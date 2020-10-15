/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as tmp from 'tmp';
import MongoMemoryServer, {
  MongoMemoryServerEventEnum,
  MongoMemoryServerStateEnum,
} from '../MongoMemoryServer';
import { assertion } from '../util/utils';

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

    it('"_startUpInstance" should use an different port if address is already in use (use same port for 2 servers)', async () => {
      const mongoServer1 = await MongoMemoryServer.create({
        instance: { port: 27444 },
      });

      const mongoServer2 = await MongoMemoryServer.create({
        instance: { port: mongoServer1.instanceInfo!.port },
      });

      expect(mongoServer1.instanceInfo).toBeDefined();
      expect(mongoServer2.instanceInfo).toBeDefined();
      expect(mongoServer1.instanceInfo!.port).not.toEqual(mongoServer2.instanceInfo!.port);

      await mongoServer1.stop();
      await mongoServer2.stop();
    });

    it('should throw an error if _startUpInstance throws an unknown error', async () => {
      jest.spyOn(console, 'warn').mockImplementationOnce(() => void 0);

      const mongoServer = new MongoMemoryServer({
        instance: {
          port: 123,
        },
      });

      jest.spyOn(mongoServer, '_startUpInstance').mockRejectedValueOnce(new Error('unknown error'));

      await expect(mongoServer.start()).rejects.toThrow('unknown error');

      expect(mongoServer._startUpInstance).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledTimes(1);
    });
  });

  describe('ensureInstance()', () => {
    it('should throw an error if no "instanceInfo" is defined after calling start', async () => {
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

      expect(await mongoServer.ensureInstance()).toEqual(mongoServer.instanceInfo);
      expect(mongoServer.start).not.toHaveBeenCalled();

      await mongoServer.stop();
    });

    it('should throw an error if "instanceInfo" is undefined but "_state" is "running"', async () => {
      const mongoServer = new MongoMemoryServer();
      // @ts-expect-error
      mongoServer._state = MongoMemoryServerStateEnum.running;

      try {
        await mongoServer.ensureInstance();
        fail('Expected "ensureInstance" to throw');
      } catch (err) {
        expect(err.message).toEqual(
          'MongoMemoryServer "_state" is "running" but "instanceInfo" is undefined!'
        );
      }
    });

    it('should throw an error if the given "_state" has no case', async () => {
      const mongoServer = new MongoMemoryServer();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      mongoServer._state = 'not Existing';

      try {
        await mongoServer.ensureInstance();
        fail('Expected "ensureInstance" to throw');
      } catch (err) {
        expect(err.message).toEqual('"ensureInstance" does not have an case for "not Existing"');
      }
    });

    it('should throw an error if state was "starting" and emitted an event but not "running"', async () => {
      const mongoServer = new MongoMemoryServer();
      // @ts-expect-error
      mongoServer._state = MongoMemoryServerStateEnum.starting;
      const ensureInstancePromise = mongoServer.ensureInstance();

      mongoServer.emit(MongoMemoryServerEventEnum.stateChange, MongoMemoryServerStateEnum.stopped);

      expect(ensureInstancePromise).rejects.toThrow(
        `"ensureInstance" waited for "running" but got an different state: "${MongoMemoryServerStateEnum.stopped}"`
      );
    });

    it('should also call "start" and actually start an server', async () => {
      const mongoServer = new MongoMemoryServer();
      jest.spyOn(mongoServer, 'start');

      await mongoServer.ensureInstance();

      expect(mongoServer.start).toHaveBeenCalledTimes(1);
      expect(mongoServer.instanceInfo).toBeDefined();

      await mongoServer.stop();
    });
  });

  describe('stop()', () => {
    it('should start & stop mongod and check output of "getInstanceInfo"', async () => {
      const mongoServer = new MongoMemoryServer({});

      expect(mongoServer.instanceInfo).toBeFalsy();
      mongoServer.start();
      // while mongod launching `getInstanceInfo` is false
      expect(mongoServer.instanceInfo).toBeFalsy(); // isnt this an race-condition?

      // when instance launched then data became avaliable
      await mongoServer.ensureInstance();
      expect(mongoServer.instanceInfo).toBeDefined();

      // after stop, instance data should be empty
      await mongoServer.stop();
      expect(mongoServer.instanceInfo).toBeFalsy();
    });

    it('should return "true" if no instance is running', async () => {
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

      await MongoMemoryServer.create();

      expect(MongoMemoryServer.prototype.start).toHaveBeenCalledTimes(1);
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
      const port: number = mongoServer.instanceInfo!.port;
      expect(mongoServer.getUri('customDB')).toEqual(`mongodb://127.0.0.1:${port}/customDB`);
    });

    it('should return correct value with "otherDb" being a boolean', async () => {
      const port: number = mongoServer.instanceInfo!.port;
      expect(mongoServer.getUri(true)).not.toEqual(`mongodb://127.0.0.1:${port}/hello`);
    });

    it('should return correct value without "otherDb" being provided', async () => {
      const port: number = mongoServer.instanceInfo!.port;
      const instanceInfo = mongoServer.instanceInfo;
      assertion(instanceInfo, new Error('"MongoServer.instanceInfo" should be defined!'));
      expect(mongoServer.getUri()).toEqual(`mongodb://127.0.0.1:${port}/${instanceInfo.dbName}`);
    });
  });

  it('"getDbPath" should return the dbPath', async () => {
    const tmpDir = tmp.dirSync({ prefix: 'mongo-mem-getDbPath-', unsafeCleanup: true });
    const mongoServer = new MongoMemoryServer({
      instance: { dbPath: tmpDir.name },
    });

    await mongoServer.start();

    expect(mongoServer.instanceInfo!.dbPath).toEqual(tmpDir.name);

    await mongoServer.stop();
    tmpDir.removeCallback();
  });

  it('"state" should return correct state', () => {
    const mongoServer = new MongoMemoryServer();
    expect(mongoServer.state).toEqual(MongoMemoryServerStateEnum.new);
    // @ts-expect-error
    mongoServer.stateChange(MongoMemoryServerStateEnum.running);
    expect(mongoServer.state).toEqual(MongoMemoryServerStateEnum.running);
  });
});
