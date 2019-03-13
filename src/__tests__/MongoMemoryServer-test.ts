import MongoMemoryServerType from '../MongoMemoryServer';

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

      const mongoServer = new MongoMemoryServer({ autoStart: false });

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
        autoStart: false,
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

      const mongoServer = new MongoMemoryServer({
        autoStart: false,
        instance: {
          port: 123,
        },
      });

      expect(MongoMemoryServer.prototype._startUpInstance).toHaveBeenCalledTimes(0);

      await expect(mongoServer.start()).rejects.toThrow(
        `unknown error\n\nUse debug option for more info: ` +
          `new MongoMemoryServer({ debug: true })`
      );

      expect(MongoMemoryServer.prototype._startUpInstance).toHaveBeenCalledTimes(1);
    });
  });

  describe('ensureInstance()', () => {
    it('should throw an error if not instance is running after calling start', async () => {
      MongoMemoryServer.prototype.start = jest.fn(() => Promise.resolve(true));

      const mongoServer = new MongoMemoryServer({ autoStart: false });

      await expect(mongoServer.ensureInstance()).rejects.toThrow(
        'Database instance is not running. You should start database by calling start() method. BTW it should start automatically if opts.autoStart!=false. Also you may provide opts.debug=true for more info.'
      );

      expect(MongoMemoryServer.prototype.start).toHaveBeenCalledTimes(1);
    });
  });

  describe('stop()', () => {
    it('should stop mongod and answer on isRunning() method', async () => {
      const mongod = new MongoMemoryServer({
        autoStart: false,
        debug: false,
      });

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
  });
});
