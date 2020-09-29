import * as tmp from 'tmp';
import MongoMemoryServerType from '../MongoMemoryServer';

tmp.setGracefulCleanup();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

describe('MongoMemoryServer', () => {
  let MongoMemoryServer: typeof MongoMemoryServerType;
  beforeEach(() => {
    jest.resetModules();
    MongoMemoryServer = jest.requireActual('../MongoMemoryServer').default;
  });

  describe('start()', () => {
    it('should resolve to true if an MongoInstanceData is resolved by _startUpInstance', async () => {
      MongoMemoryServer.prototype._startUpInstance = jest.fn(() => Promise.resolve({} as any));

      const mongoServer = new MongoMemoryServer();

      expect(MongoMemoryServer.prototype._startUpInstance).toHaveBeenCalledTimes(0);

      await expect(mongoServer.start()).resolves.toEqual(true);

      expect(MongoMemoryServer.prototype._startUpInstance).toHaveBeenCalledTimes(1);
    });

    it('_startUpInstance should be called a second time if an error is thrown on the first call and assign the current port to nulll', async () => {
      MongoMemoryServer.prototype._startUpInstance = jest
        .fn()
        .mockRejectedValueOnce(new Error('Mongod shutting down'))
        .mockResolvedValueOnce({});

      const mongoServer = new MongoMemoryServer({
        instance: {
          port: 123,
        },
      });

      expect(MongoMemoryServer.prototype._startUpInstance).toHaveBeenCalledTimes(0);

      await expect(mongoServer.start()).resolves.toEqual(true);

      expect(MongoMemoryServer.prototype._startUpInstance).toHaveBeenCalledTimes(2);
    });

    it('should throw an error if _startUpInstance throws an unknown error', async () => {
      MongoMemoryServer.prototype._startUpInstance = jest
        .fn()
        .mockRejectedValueOnce(new Error('unknown error'));

      console.warn = jest.fn(); // mock it to prevent writing to console

      const mongoServer = new MongoMemoryServer({
        instance: {
          port: 123,
        },
      });

      expect(MongoMemoryServer.prototype._startUpInstance).toHaveBeenCalledTimes(0);

      await expect(mongoServer.start()).rejects.toThrow('unknown error');

      expect(MongoMemoryServer.prototype._startUpInstance).toHaveBeenCalledTimes(1);
    });
  });

  describe('ensureInstance()', () => {
    it('should throw an error if not instance is running after calling start', async () => {
      MongoMemoryServer.prototype.start = jest.fn(() => Promise.resolve(true));

      const mongoServer = new MongoMemoryServer();

      await expect(mongoServer.ensureInstance()).rejects.toThrow(
        'Ensure-Instance failed to start an instance!'
      );

      expect(MongoMemoryServer.prototype.start).toHaveBeenCalledTimes(1);
    });
  });

  describe('stop()', () => {
    it('should stop mongod and answer on isRunning() method', async () => {
      const mongod = new MongoMemoryServer({});

      expect(mongod.getInstanceInfo()).toBeFalsy();
      mongod.start();
      // while mongod launching `getInstanceInfo` is false
      expect(mongod.getInstanceInfo()).toBeFalsy();

      // when instance launched then data became avaliable
      await mongod.ensureInstance();
      expect(mongod.getInstanceInfo()).toBeDefined();

      // after stop, instance data should be empty
      await mongod.stop();
      expect(mongod.getInstanceInfo()).toBeFalsy();
    });

    it('should throw an error if instance is undefined', async () => {
      const mongoServer = new MongoMemoryServer();
      jest.spyOn(mongoServer, 'ensureInstance');

      expect(await mongoServer.stop()).toEqual(true);
      expect(mongoServer.ensureInstance).not.toHaveBeenCalled();
    });
  });

  describe('create()', () => {
    // before each for sanity (overwrite protection)
    beforeEach(() => {
      // de-duplicate code
      MongoMemoryServer.prototype.start = jest.fn(() => Promise.resolve(true));
    });

    it('should create an instance and call ".start"', async () => {
      await MongoMemoryServer.create();

      expect(MongoMemoryServer.prototype.start).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUri()', () => {
    it('"getUri" should return with "otherDb"', async () => {
      const mongoServer = await MongoMemoryServer.create();
      const port: number = mongoServer.getPort();
      expect(mongoServer.getUri('customDB')).toBe(`mongodb://127.0.0.1:${port}/customDB?`);

      await mongoServer.stop();
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
