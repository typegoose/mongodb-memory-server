import * as tmp from 'tmp';
import MongoMemoryServer from '../MongoMemoryServer';
import { assertion } from '../util/db_util';

tmp.setGracefulCleanup();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

describe('MongoMemoryServer', () => {
  describe('start()', () => {
    it('should resolve to true if an MongoInstanceData is resolved by _startUpInstance', async () => {
      const mongoServer = new MongoMemoryServer();
      jest
        .spyOn(mongoServer, '_startUpInstance')
        // @ts-expect-error expect an error here rather than an "as any"
        .mockImplementationOnce(() => Promise.resolve({}));

      expect(mongoServer._startUpInstance).not.toHaveBeenCalled();

      await expect(mongoServer.start()).resolves.toEqual(true);

      expect(mongoServer._startUpInstance).toHaveBeenCalledTimes(1);
    });

    it('_startUpInstance should be called a second time if an error is thrown on the first call and assign the current port to nulll', async () => {
      const mongoServer = new MongoMemoryServer({
        instance: {
          port: 123,
        },
      });

      jest
        .spyOn(mongoServer, '_startUpInstance')
        .mockRejectedValueOnce(new Error('Mongod shutting down'))
        // @ts-expect-error expect an error here rather than an "as any"
        .mockResolvedValueOnce({});

      await expect(mongoServer.start()).resolves.toEqual(true);

      expect(mongoServer._startUpInstance).toHaveBeenCalledTimes(2);
    });

    it('should throw an error if _startUpInstance throws an unknown error', async () => {
      console.warn = jest.fn(); // mock it to prevent writing to console

      const mongoServer = new MongoMemoryServer({
        instance: {
          port: 123,
        },
      });

      jest.spyOn(mongoServer, '_startUpInstance').mockRejectedValueOnce(new Error('unknown error'));

      await expect(mongoServer.start()).rejects.toThrow('unknown error');

      expect(mongoServer._startUpInstance).toHaveBeenCalledTimes(1);
    });
  });

  describe('ensureInstance()', () => {
    it('should throw an error if not instance is running after calling start', async () => {
      const mongoServer = new MongoMemoryServer();
      jest.spyOn(mongoServer, 'start').mockImplementationOnce(() => Promise.resolve(true));

      await expect(mongoServer.ensureInstance()).rejects.toThrow(
        'Ensure-Instance failed to start an instance!'
      );

      expect(mongoServer.start).toHaveBeenCalledTimes(1);
    });

    it('should return instanceInfo if already running', async () => {
      const mongoServer = await MongoMemoryServer.create();
      jest.spyOn(mongoServer, 'start'); // so it dosnt count the "start" call inside "create"

      expect(await mongoServer.ensureInstance()).toEqual(mongoServer.getInstanceInfo());
      expect(mongoServer.start).not.toHaveBeenCalled();

      await mongoServer.stop();
    });
  });

  describe('stop()', () => {
    it('should stop mongod and answer on isRunning() method', async () => {
      const mongoServer = new MongoMemoryServer({});

      expect(mongoServer.getInstanceInfo()).toBeFalsy();
      mongoServer.start();
      // while mongod launching `getInstanceInfo` is false
      expect(mongoServer.getInstanceInfo()).toBeFalsy(); // isnt this an race-condition?

      // when instance launched then data became avaliable
      await mongoServer.ensureInstance();
      expect(mongoServer.getInstanceInfo()).toBeDefined();

      // after stop, instance data should be empty
      await mongoServer.stop();
      expect(mongoServer.getInstanceInfo()).toBeFalsy();
    });

    it('should throw an error if instance is undefined', async () => {
      const mongoServer = new MongoMemoryServer();
      jest.spyOn(mongoServer, 'ensureInstance');

      expect(await mongoServer.stop()).toEqual(true);
      expect(mongoServer.ensureInstance).not.toHaveBeenCalled();
    });
  });

  describe('create()', () => {
    it('should create an instance and call ".start"', async () => {
      jest
        .spyOn(MongoMemoryServer.prototype, 'start')
        .mockImplementationOnce(() => Promise.resolve(true));

      const mongoServer = await MongoMemoryServer.create();

      expect(MongoMemoryServer.prototype.start).toHaveBeenCalledTimes(1);

      await mongoServer.stop();
    });
  });

  describe('getUri()', () => {
    // this is here to not start 2 servers, when only 1 would be enough
    let mongoServer: MongoMemoryServer;
    beforeAll(async () => {
      mongoServer = await MongoMemoryServer.create({ instance: { dbName: 'hello' } });
    });
    afterAll(async () => {
      if (mongoServer) {
        await mongoServer.stop();
      }
    });

    it('should return correct value with "otherDb" being a string', async () => {
      const port: number = mongoServer.getPort();
      expect(mongoServer.getUri('customDB')).toEqual(`mongodb://127.0.0.1:${port}/customDB?`);
    });

    it('should return correct value with "otherDb" being a boolean', async () => {
      const port: number = mongoServer.getPort();
      expect(mongoServer.getUri(true)).not.toEqual(`mongodb://127.0.0.1:${port}/hello?`);
    });

    it('should return correct value without "otherDb" being provided', async () => {
      const port: number = mongoServer.getPort();
      assertion(
        mongoServer.instanceInfo,
        new Error('"MongoServer.instanceInfo" should be defined!')
      );
      expect(mongoServer.getUri()).toEqual(
        `mongodb://127.0.0.1:${port}/${mongoServer.instanceInfo.dbName}?`
      );
    });
  });

  it('"getDbPath" should return the dbPath', async () => {
    const tmpDir = tmp.dirSync({ prefix: 'mongo-mem-getDbPath-', unsafeCleanup: true });
    const mongoServer = new MongoMemoryServer({
      instance: { dbPath: tmpDir.name },
    });

    await mongoServer.start();

    expect(mongoServer.getDbPath()).toEqual(tmpDir.name);

    await mongoServer.stop();
    tmpDir.removeCallback();
  });
});
