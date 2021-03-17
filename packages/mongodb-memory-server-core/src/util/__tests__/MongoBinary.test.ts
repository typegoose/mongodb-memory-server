import * as tmp from 'tmp';
import os from 'os';
import MongoBinary, { MongoBinaryOpts } from '../MongoBinary';
import MongoBinaryDownload from '../MongoBinaryDownload';
import resolveConfig, { ResolveConfigVariables } from '../resolveConfig';
import { assertion } from '../utils';
import { DryMongoBinary } from '../DryMongoBinary';

tmp.setGracefulCleanup();

const mockedPath = '/path/to/binary';
const mockGetMongodPath = jest.fn().mockResolvedValue(mockedPath);

jest.mock('../MongoBinaryDownload', () => {
  return jest.fn().mockImplementation(() => {
    return { getMongodPath: mockGetMongodPath };
  });
});

describe('MongoBinary', () => {
  let tmpDir: tmp.DirResult;

  beforeEach(() => {
    tmpDir = tmp.dirSync({ prefix: 'mongo-mem-bin-', unsafeCleanup: true });
    DryMongoBinary.binaryCache.clear();
  });

  // cleanup
  afterEach(() => {
    tmpDir.removeCallback();
    (MongoBinaryDownload as jest.Mock).mockClear();
    mockGetMongodPath.mockClear();
    DryMongoBinary.binaryCache.clear();
  });

  describe('getPath', () => {
    it('should download binary and keep it in cache', async () => {
      const version = resolveConfig(ResolveConfigVariables.VERSION);
      assertion(typeof version === 'string', new Error('Expected "version" to be an string'));
      const binPath = await MongoBinary.download({
        downloadDir: tmpDir.name,
        version,
        arch: 'x64',
        platform: 'linux',
        checkMD5: false,
      } as Required<MongoBinaryOpts>);

      // eg. /tmp/mongo-mem-bin-33990ScJTSRNSsFYf/mongodb-download/a811facba94753a2eba574f446561b7e/mongodb-macOS-x86_64-3.5.5-13-g00ee4f5/
      expect(MongoBinaryDownload).toHaveBeenCalledWith({
        downloadDir: tmpDir.name,
        platform: os.platform(),
        arch: os.arch(),
        version,
        checkMD5: false,
      });

      expect(mockGetMongodPath).toHaveBeenCalledTimes(1);

      const gotVersionPath = DryMongoBinary.binaryCache.get(version);
      expect(gotVersionPath).toBeDefined();
      expect(gotVersionPath).toEqual(binPath);
      expect(gotVersionPath).toEqual(mockedPath);
    });
  });
});
