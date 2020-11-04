import * as tmp from 'tmp';
import { promises } from 'fs';
import os from 'os';
import MongoBinary from '../MongoBinary';
import MongoBinaryDownload from '../MongoBinaryDownload';
import resolveConfig, { ENV_CONFIG_PREFIX, ResolveConfigVariables } from '../resolveConfig';
import { assertion } from '../utils';

tmp.setGracefulCleanup();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 5; // 5 seconds

const mockGetMongodPath = jest.fn().mockResolvedValue('/temp/path');

jest.mock('../MongoBinaryDownload', () => {
  return jest.fn().mockImplementation(() => {
    return { getMongodPath: mockGetMongodPath };
  });
});

describe('MongoBinary', () => {
  let tmpDir: tmp.DirResult;

  beforeEach(() => {
    tmpDir = tmp.dirSync({ prefix: 'mongo-mem-bin-', unsafeCleanup: true });
  });

  // cleanup
  afterEach(() => {
    tmpDir.removeCallback();
    (MongoBinaryDownload as jest.Mock).mockClear();
    mockGetMongodPath.mockClear();
    MongoBinary.cache = new Map();
  });

  describe('getPath', () => {
    it('should get system binary from the environment', async () => {
      jest.spyOn(promises, 'access');
      process.env[ENV_CONFIG_PREFIX + ResolveConfigVariables.SYSTEM_BINARY] =
        '/usr/local/bin/mongod';
      await MongoBinary.getPath();

      expect(promises.access).toHaveBeenCalledWith('/usr/local/bin/mongod');

      delete process.env[ENV_CONFIG_PREFIX + ResolveConfigVariables.SYSTEM_BINARY];
    });
  });

  describe('getDownloadPath', () => {
    it('should download binary and keep it in cache', async () => {
      const version = resolveConfig(ResolveConfigVariables.VERSION);
      assertion(typeof version === 'string', new Error('Expected "version" to be an string'));
      const binPath = await MongoBinary.getPath({
        downloadDir: tmpDir.name,
        version,
      });

      // eg. /tmp/mongo-mem-bin-33990ScJTSRNSsFYf/mongodb-download/a811facba94753a2eba574f446561b7e/mongodb-macOS-x86_64-3.5.5-13-g00ee4f5/
      expect(MongoBinaryDownload).toHaveBeenCalledWith({
        downloadDir: tmpDir.name,
        platform: os.platform(),
        arch: os.arch(),
        version,
        checkMD5: false,
      });

      expect(mockGetMongodPath).toHaveBeenCalledTimes(1);

      expect(MongoBinary.cache.get(version)).toBeDefined();
      expect(MongoBinary.cache.get(version)).toEqual(binPath);
    });
  });

  describe('getSystemPath', () => {
    it('should use system binary if option is passed.', async () => {
      jest.spyOn(promises, 'access');
      await MongoBinary.getSystemPath('/usr/bin/mongod'); // ignoring return, because this depends on the host system

      expect(promises.access).toHaveBeenCalledWith('/usr/bin/mongod');
    });
  });
});
