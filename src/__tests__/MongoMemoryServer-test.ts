import MongoMemoryServer from '../MongoMemoryServer';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

describe('MongoMemoryServer', () => {
  describe('start', () => {
    const mockStartUpInstance = jest.fn();

    afterEach(() => {
      mockStartUpInstance.mockClear();
    });

    it('should resolve to true if an MongoInstanceData is resolved by _startUpInstance', async () => {
      mockStartUpInstance.mockResolvedValue({});
      MongoMemoryServer.prototype._startUpInstance = mockStartUpInstance;

      const mongoServer = new MongoMemoryServer({ autoStart: false });

      expect(mockStartUpInstance).toHaveBeenCalledTimes(0);

      await expect(mongoServer.start()).resolves.toEqual(true);

      expect(mockStartUpInstance).toHaveBeenCalledTimes(1);
    });

    it('_startUpInstance should be called a second time if an error is thrown on the first call and assign the current port to nulll', async () => {
      mockStartUpInstance
        .mockRejectedValueOnce(new Error('Mongod shutting down'))
        .mockResolvedValueOnce({});
      MongoMemoryServer.prototype._startUpInstance = mockStartUpInstance;

      const mongoServer = new MongoMemoryServer({
        autoStart: false,
        instance: {
          port: 123,
        },
      });

      expect(mockStartUpInstance).toHaveBeenCalledTimes(0);

      await expect(mongoServer.start()).resolves.toEqual(true);

      expect(mockStartUpInstance).toHaveBeenCalledTimes(2);
    });

    it('should throw an error if _startUpInstance throws an unknown error', async () => {
      mockStartUpInstance.mockRejectedValueOnce(new Error('unknown error'));
      MongoMemoryServer.prototype._startUpInstance = mockStartUpInstance;

      const mongoServer = new MongoMemoryServer({
        autoStart: false,
        instance: {
          port: 123,
        },
      });

      expect(mockStartUpInstance).toHaveBeenCalledTimes(0);

      await expect(mongoServer.start()).rejects.toThrow(
        `unknown error\n\nUse debug option for more info: ` +
          `new MongoMemoryServer({ debug: true })`
      );

      expect(mockStartUpInstance).toHaveBeenCalledTimes(1);
    });
  });
  describe('getInstanceData', () => {
    const mockStart = jest.fn();

    afterEach(() => {
      mockStart.mockClear();
    });

    it('should throw an error if not instance is running after calling start', async () => {
      mockStart.mockResolvedValue(true);
      MongoMemoryServer.prototype.start = mockStart;

      const mongoServer = new MongoMemoryServer({ autoStart: false });

      await expect(mongoServer.getInstanceData()).rejects.toThrow(
        'Database instance is not running. You should start database by calling start() method. BTW it should start automatically if opts.autoStart!=false. Also you may provide opts.debug=true for more info.'
      );

      expect(mockStart).toHaveBeenCalledTimes(1);
    });
  });
});
