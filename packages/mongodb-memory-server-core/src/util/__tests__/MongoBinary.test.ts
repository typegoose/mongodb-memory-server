import * as tmp from 'tmp';
import os from 'os';
import MongoBinary, { MongoBinaryOpts } from '../MongoBinary';
import MongoBinaryDownload from '../MongoBinaryDownload';
import resolveConfig, { envName, ResolveConfigVariables } from '../resolveConfig';
import * as utils from '../utils';
import { DryMongoBinary } from '../DryMongoBinary';
import * as childProcess from 'child_process';
import { assertIsError } from '../../__tests__/testUtils/test_utils';

tmp.setGracefulCleanup();

const mockedPath = '/path/to/binary';
const mockGetMongodPath = jest.fn().mockResolvedValue(mockedPath);

jest.mock('../MongoBinaryDownload', () => {
  return jest.fn().mockImplementation(() => {
    return { getMongodPath: mockGetMongodPath };
  });
});

jest.mock('child_process');

describe('MongoBinary', () => {
  let tmpDir: tmp.DirResult;

  beforeEach(() => {
    tmpDir = tmp.dirSync({ prefix: 'mongo-mem-bin-', unsafeCleanup: true });
    DryMongoBinary.binaryCache.clear();
  });

  // cleanup
  afterEach(() => {
    tmpDir.removeCallback();
    jest.restoreAllMocks(); // restore all mocked functions to original
    DryMongoBinary.binaryCache.clear();
    delete process.env[envName(ResolveConfigVariables.RUNTIME_DOWNLOAD)];
  });

  describe('getPath', () => {
    it('should download binary and keep it in cache', async () => {
      const version = resolveConfig(ResolveConfigVariables.VERSION);
      utils.assertion(typeof version === 'string', new Error('Expected "version" to be an string'));
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

    it('should trigger an download if binary dosnt exist', async () => {
      const mockPath = '/path/to/downloaded/binary';
      process.env[envName(ResolveConfigVariables.RUNTIME_DOWNLOAD)] = 'true';
      jest.spyOn(MongoBinary, 'download').mockResolvedValue(mockPath);
      jest.spyOn(DryMongoBinary, 'locateBinary').mockResolvedValue(undefined);

      const output = await MongoBinary.getPath();
      expect(output).toBe(mockPath);
      expect(DryMongoBinary.locateBinary).toHaveBeenCalledTimes(1);
      expect(MongoBinary.download).toHaveBeenCalledTimes(1);
    });

    it('should not trigger an download an error if "RUNTIME_DOWNLOAD" is false and no binary is found', async () => {
      process.env[envName(ResolveConfigVariables.RUNTIME_DOWNLOAD)] = 'false';
      jest.spyOn(DryMongoBinary, 'locateBinary').mockResolvedValue(undefined);
      jest
        .spyOn(MongoBinary, 'download')
        .mockImplementation(() => fail('Expect this function to not have been called'));

      try {
        await MongoBinary.getPath();
        fail('Expected "getPath" to fail');
      } catch (err) {
        assertIsError(err);
        expect(err.message).toMatchSnapshot();
        expect(DryMongoBinary.locateBinary).toBeCalledTimes(1);
        expect(MongoBinary.download).not.toHaveBeenCalled();
      }
    });

    describe('systemBinary', () => {
      const sysBinaryPath = '/path/to/binary';
      beforeEach(() => {
        jest.resetAllMocks(); // reset all mocked functions information & set implementation to blank "jest.fn()"
        jest
          .spyOn(utils, 'pathExists') // mock this to be sure that "pathExists" is "true" for "sysBinaryPath"
          .mockImplementation((path) => Promise.resolve(path === sysBinaryPath));
        jest.spyOn(DryMongoBinary, 'getSystemPath').mockImplementation((v) => Promise.resolve(v)); // mock this so that no error comes up, because mock path actually dosnt exist
        jest.spyOn(MongoBinary, 'download'); // add spy to get call information
      });
      afterEach(() => {
        delete process.env[envName(ResolveConfigVariables.VERSION)];
        delete process.env[envName(ResolveConfigVariables.SYSTEM_BINARY)];
        delete process.env[envName(ResolveConfigVariables.SYSTEM_BINARY_VERSION_CHECK)];
      });

      it('should return and check an SystemBinary', async () => {
        // Output taken from mongodb x64 for "ubuntu" version "4.0.25"
        // DO NOT INDENT THE TEXT
        jest.spyOn(childProcess, 'spawnSync').mockReturnValue(
          // @ts-expect-error Because "Buffer" is missing values from type, but they are not used in code, so its fine
          {
            stdout: Buffer.from(`db version v4.0.25
git version: e2416422da84a0b63cde2397d60b521758b56d1b
OpenSSL version: OpenSSL 1.1.1f  31 Mar 2020
allocator: tcmalloc
modules: none
build environment:
    distmod: ubuntu1804
    distarch: x86_64
    target_arch: x86_64`),
          }
        );
        process.env[envName(ResolveConfigVariables.VERSION)] = '4.0.25'; // set it explicitly to that version to test matching versions
        process.env[envName(ResolveConfigVariables.SYSTEM_BINARY)] = sysBinaryPath;

        const output = await MongoBinary.getPath();
        expect(childProcess.spawnSync).toHaveBeenCalledTimes(1);
        expect(MongoBinary.download).not.toHaveBeenCalled();
        expect(output).toBe(sysBinaryPath);
      });

      it('should return and check an SYSTEM_BINARY and warn version conflict', async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => void 0);
        // Output taken from mongodb x64 for "ubuntu" version "4.0.25"
        // DO NOT INDENT THE TEXT
        jest.spyOn(childProcess, 'spawnSync').mockReturnValue(
          // @ts-expect-error Because "Buffer" is missing values from type, but they are not used in code, so its fine
          {
            stdout: Buffer.from(`db version v4.0.25
git version: e2416422da84a0b63cde2397d60b521758b56d1b
OpenSSL version: OpenSSL 1.1.1f  31 Mar 2020
allocator: tcmalloc
modules: none
build environment:
    distmod: ubuntu1804
    distarch: x86_64
    target_arch: x86_64`),
          }
        );
        process.env[envName(ResolveConfigVariables.VERSION)] = '4.4.0'; // set it explicitly to that version to test non-matching versions
        process.env[envName(ResolveConfigVariables.SYSTEM_BINARY)] = sysBinaryPath;
        expect(resolveConfig(ResolveConfigVariables.SYSTEM_BINARY_VERSION_CHECK)).toStrictEqual(
          'true'
        );

        const output = await MongoBinary.getPath();
        expect(childProcess.spawnSync).toHaveBeenCalledTimes(1);
        expect(MongoBinary.download).not.toHaveBeenCalled();
        expect(output).toBe(sysBinaryPath);
        expect(console.warn).toHaveBeenCalledTimes(1);
      });

      it('should return and check an SYSTEM_BINARY and dont warn version conflict if SYSTEM_BINARY_VERSION_CHECK is false', async () => {
        jest.spyOn(console, 'warn');
        // Output taken from mongodb x64 for "ubuntu" version "4.0.25"
        // DO NOT INDENT THE TEXT
        jest.spyOn(childProcess, 'spawnSync').mockReturnValue(
          // @ts-expect-error Because "Buffer" is missing values from type, but they are not used in code, so its fine
          {
            stdout: Buffer.from(`db version v4.0.25
git version: e2416422da84a0b63cde2397d60b521758b56d1b
OpenSSL version: OpenSSL 1.1.1f  31 Mar 2020
allocator: tcmalloc
modules: none
build environment:
    distmod: ubuntu1804
    distarch: x86_64
    target_arch: x86_64`),
          }
        );
        process.env[envName(ResolveConfigVariables.VERSION)] = '4.4.0'; // set it explicitly to that version to test non-matching versions
        process.env[envName(ResolveConfigVariables.SYSTEM_BINARY)] = sysBinaryPath;
        expect(resolveConfig(ResolveConfigVariables.SYSTEM_BINARY_VERSION_CHECK)).toStrictEqual(
          'true'
        );
        process.env[envName(ResolveConfigVariables.SYSTEM_BINARY_VERSION_CHECK)] = 'false';

        const output = await MongoBinary.getPath();
        expect(childProcess.spawnSync).toHaveBeenCalledTimes(1);
        expect(MongoBinary.download).not.toHaveBeenCalled();
        expect(console.warn).not.toHaveBeenCalled();
        expect(output).toBe(sysBinaryPath);
      });

      it('should throw an error if SYSTEM_BINARY is set, but no binary can be found', async () => {
        process.env[envName(ResolveConfigVariables.SYSTEM_BINARY)] = sysBinaryPath;
        jest.spyOn(DryMongoBinary, 'locateBinary').mockResolvedValue(undefined);

        try {
          await MongoBinary.getPath();
          fail('Expected "getPath" to fail');
        } catch (err) {
          assertIsError(err);
          expect(err.message).toMatchSnapshot();
        }
      });
    });
  });
});
