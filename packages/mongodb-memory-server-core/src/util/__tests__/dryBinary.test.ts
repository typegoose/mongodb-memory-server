import * as binary from '../DryMongoBinary';
import { DryMongoBinary } from '../DryMongoBinary';
import * as path from 'path';
import { constants, promises as fspromises } from 'fs';
import { DEFAULT_VERSION, envName, ResolveConfigVariables } from '../resolveConfig';
import * as utils from '../utils';
import * as getOs from '../getos';
import { LinuxOS, OtherOS } from '../getos';
import { BinaryNotFoundError, NoRegexMatchError, ParseArchiveRegexError } from '../errors';
import { assertIsError } from '../../__tests__/testUtils/test_utils';

describe('DryBinary', () => {
  it('should combine options with base and binary', () => {
    const input = {
      base: '/hello',
      binary: 'mongod',
    };
    expect(binary.DryMongoBinary.combineBinaryName(input.base, input.binary)).toEqual(
      path.resolve(input.base, 'mongod')
    );
  });

  describe('getSystemPath', () => {
    it('should run "fs.access" and return the path', async () => {
      jest.spyOn(fspromises, 'access').mockImplementationOnce(() => {
        return Promise.resolve(void 0);
      });
      const input = '/usr/local/bin/mongod';
      const returnValue = await binary.DryMongoBinary.getSystemPath(input);

      expect(returnValue).toEqual(input);
      expect(fspromises.access).toHaveBeenCalledWith(input, constants.X_OK);
    });

    it('should run "fs.access" and return "undefined" if not found', async () => {
      jest.spyOn(fspromises, 'access').mockImplementationOnce(() => {
        return Promise.reject(new Error('TEST'));
      });
      const input = '/usr/local/bin/mongod';
      const returnValue = await binary.DryMongoBinary.getSystemPath(input);

      expect(returnValue).toBeUndefined();
      expect(fspromises.access).toHaveBeenCalledWith(input, constants.X_OK);
    });
  });

  describe('generatePaths', () => {
    /** Used for all files */
    let tmpDir: string;
    /** Used for non "find-cache-dir" */
    let tmpDir2: string;
    const cwdBefore = process.cwd();
    const version = '1.1.1';
    let opts: binary.DryMongoBinaryOptions & binary.DryMongoBinaryNameOptions;
    let binaryName: string;
    beforeAll(async () => {
      delete process.env[envName(ResolveConfigVariables.DOWNLOAD_DIR)]; // i dont know where this comes from, but without it, this property exists
      process.env['INIT_CWD'] = undefined; // removing this, because it would mess with stuff - but still should be used when available (postinstall)
      tmpDir = await utils.createTmpDir('mongo-mem-drybinGP-');
      tmpDir2 = await utils.createTmpDir('mongo-mem-drybinGP-');
      jest
        .spyOn(
          binary.DryMongoBinary,
          // @ts-expect-error expected, because function "homedir" is private
          'homedir'
        )
        .mockReturnValue(path.resolve(tmpDir, 'homedir') as any); // casting is needed, since around "@types/jest@28.1.3~4" private values do not seem to be exposed anymore

      // Create all directories
      {
        await utils.mkdir(path.resolve(tmpDir, 'node_modules/mongodb-memory-server')); // mock being in an postinstall directory path
        await utils.mkdir(path.resolve(tmpDir, 'node_modules/.cache')); // mock having an local modules cache
        await utils.mkdir(path.resolve(tmpDir, 'homedir/.cache/mongodb-binaries')); // mock having an global directory in home
        await fspromises.writeFile(path.resolve(tmpDir, 'package.json'), '');
      }
    });
    afterAll(async () => {
      await utils.removeDir(tmpDir);
      await utils.removeDir(tmpDir2);
      process.chdir(cwdBefore);
    });

    beforeEach(async () => {
      // execute this before each test, to always have the correct cwd
      process.chdir(path.resolve(tmpDir));
      opts = await binary.DryMongoBinary.generateOptions({ version });
      delete opts.downloadDir; // delete, because these tests are about "generatePaths", which will prioritise "opts.downloadDir" over env
      binaryName = await binary.DryMongoBinary.getBinaryName(opts);
    });
    afterEach(() => {
      delete process.env[envName(ResolveConfigVariables.DOWNLOAD_DIR)];
    });

    it('should have 3 complete paths while not being in postinstall or having a config', async () => {
      const returnValue = await binary.DryMongoBinary.generatePaths(opts);
      expect(returnValue).toStrictEqual({
        resolveConfig: '', // empty because not having an extra config value
        relative: path.resolve(tmpDir, 'mongodb-binaries', binaryName),
        homeCache: path.resolve(tmpDir, 'homedir/.cache/mongodb-binaries', binaryName),
        modulesCache: path.resolve(tmpDir, 'node_modules/.cache/mongodb-memory-server', binaryName),
      } as binary.DryMongoBinaryPaths);
    });

    it('should have 3 complete paths while being in postinstall and not having a config', async () => {
      process.chdir(path.resolve(tmpDir, 'node_modules/mongodb-memory-server'));
      const returnValue = await binary.DryMongoBinary.generatePaths(opts);
      expect(returnValue).toStrictEqual({
        resolveConfig: '', // empty because not having an extra config value
        relative: path.resolve(
          tmpDir,
          'node_modules/mongodb-memory-server',
          'mongodb-binaries',
          binaryName
        ),
        homeCache: path.resolve(tmpDir, 'homedir/.cache/mongodb-binaries', binaryName),
        modulesCache: path.resolve(tmpDir, 'node_modules/.cache/mongodb-memory-server', binaryName),
      } as binary.DryMongoBinaryPaths);
    });

    it('should have 4 complete paths while not being in postinstall but having a config', async () => {
      const customPath = '/some/custom/path';
      process.env[envName(ResolveConfigVariables.DOWNLOAD_DIR)] = customPath;
      const returnValue = await binary.DryMongoBinary.generatePaths(opts);
      expect(returnValue).toStrictEqual({
        resolveConfig: path.resolve('/some/custom/path', binaryName),
        relative: path.resolve(tmpDir, 'mongodb-binaries', binaryName),
        homeCache: path.resolve(tmpDir, 'homedir/.cache/mongodb-binaries', binaryName),
        modulesCache: path.resolve(tmpDir, 'node_modules/.cache/mongodb-memory-server', binaryName),
      } as binary.DryMongoBinaryPaths);
    });

    it('should have 2 complete paths while not being in postinstall and not having a config and not being in an project', async () => {
      const customPath = path.resolve(tmpDir2);
      process.chdir(customPath);
      const returnValue = await binary.DryMongoBinary.generatePaths(opts);
      expect(returnValue).toStrictEqual({
        resolveConfig: '', // empty because not having an extra config value
        relative: path.resolve(tmpDir2, 'mongodb-binaries', binaryName),
        homeCache: path.resolve(tmpDir, 'homedir/.cache/mongodb-binaries', binaryName),
        modulesCache: '', // because not being in an project
      } as binary.DryMongoBinaryPaths);
    });
  });

  describe('getBinaryName', () => {
    const platforms = [
      {
        platformOptions: {
          platform: 'linux',
          arch: 'x86_64',
          os: {
            os: 'linux',
            dist: 'Ubuntu Linux',
            release: '20.04',
          },
        },
        archiverResult: 'mongodb-linux-x86_64-ubuntu2004-5.0.3',
        nonArchiveResult: 'mongod-x86_64-Ubuntu Linux-5.0.3',
      },
      {
        platformOptions: {
          platform: 'darwin',
          arch: 'arm64',
          os: {
            os: 'osx',
          },
        },
        archiverResult: 'mongodb-macos-x86_64-5.0.3',
        nonArchiveResult: 'mongod-arm64-osx-5.0.3',
      },
      {
        platformOptions: {
          platform: 'win32',
          arch: 'x86_64',
          os: {
            os: 'win32',
          },
        },
        archiverResult: 'mongodb-windows-x86_64-5.0.3',
        nonArchiveResult: 'mongod-x86_64-win32-5.0.3.exe',
      },
    ];

    beforeAll(() => {
      delete process.env[envName(ResolveConfigVariables.USE_ARCHIVE_NAME_FOR_BINARY_NAME)];
    });

    afterEach(() => {
      delete process.env[envName(ResolveConfigVariables.USE_ARCHIVE_NAME_FOR_BINARY_NAME)];
    });

    it.each(platforms)(
      'should return binary name matching archive name for $platformOptions.platform-$platformOptions.arch',
      async ({ platformOptions, archiverResult }) => {
        process.env[envName(ResolveConfigVariables.USE_ARCHIVE_NAME_FOR_BINARY_NAME)] = 'true';

        expect(
          await DryMongoBinary.getBinaryName({ ...platformOptions, version: '5.0.3' })
        ).toEqual(archiverResult);
      }
    );

    it.each(platforms)(
      'should return binary name not matching archive name for $platformOptions.platform-$platformOptions.arch',
      async ({ platformOptions, nonArchiveResult }) => {
        process.env[envName(ResolveConfigVariables.USE_ARCHIVE_NAME_FOR_BINARY_NAME)] = 'false';

        expect(
          await DryMongoBinary.getBinaryName({ ...platformOptions, version: '5.0.3' })
        ).toEqual(nonArchiveResult);
      }
    );
  });

  describe('generateDownloadPath', () => {
    const filesExist: Set<string> = new Set();
    let expectedPaths: binary.DryMongoBinaryPaths;
    let opts: Required<binary.DryMongoBinaryOptions>;
    beforeAll(async () => {
      opts = await binary.DryMongoBinary.generateOptions({ version: '1.1.1' });
      delete process.env[envName(ResolveConfigVariables.PREFER_GLOBAL_PATH)];
      jest.spyOn(utils, 'pathExists').mockImplementation((file) => {
        // this is to ensure it is returning an promise
        return new Promise((res) => {
          return res(filesExist.has(file));
        });
      });
      jest.spyOn(binary.DryMongoBinary, 'generatePaths').mockImplementation(() => {
        return new Promise((res) => {
          return res(expectedPaths);
        });
      });
    });
    afterAll(() => {
      (utils.pathExists as jest.Mock).mockClear();
      (binary.DryMongoBinary.generatePaths as jest.Mock).mockClear();
    });

    afterEach(() => {
      delete process.env[envName(ResolveConfigVariables.PREFER_GLOBAL_PATH)];
      filesExist.clear();
      (binary.DryMongoBinary.generatePaths as jest.Mock).mockClear();

      if (jest.isMockFunction(binary.DryMongoBinary.getSystemPath)) {
        (binary.DryMongoBinary.getSystemPath as jest.Mock).mockRestore();
      }
    });

    describe('should return exists', () => {
      it('should return system binary if provided and exists', async () => {
        jest.spyOn(binary.DryMongoBinary, 'getSystemPath');
        jest.spyOn(fspromises, 'access').mockResolvedValueOnce(void 0);
        const expectedPath = '/some/systembinary/somewhere';
        expectedPaths = {
          homeCache: '',
          modulesCache: '',
          relative: '',
          resolveConfig: '',
        };
        filesExist.add(expectedPath);
        const returnValue = await binary.DryMongoBinary.generateDownloadPath({
          ...opts,
          systemBinary: expectedPath,
        });
        expect(binary.DryMongoBinary.generatePaths).toHaveBeenCalledTimes(1);
        expect(binary.DryMongoBinary.getSystemPath).toHaveBeenCalledTimes(1);
        expect(returnValue).toStrictEqual([true, expectedPath]);
      });

      it('should return the DOWNLOAD_DIR when provided', async () => {
        const expectedPath = '/some/custom/path/binary';
        expectedPaths = {
          homeCache: '',
          modulesCache: '',
          relative: '',
          resolveConfig: expectedPath,
        };
        filesExist.add(expectedPath);
        const returnValue = await binary.DryMongoBinary.generateDownloadPath(opts);
        expect(binary.DryMongoBinary.generatePaths).toHaveBeenCalledTimes(1);
        expect(returnValue).toStrictEqual([true, expectedPath]);
      });

      it('should return the homeCache when provided', async () => {
        const expectedPath = '/some/home/path/binary';
        expectedPaths = {
          homeCache: expectedPath,
          modulesCache: '',
          relative: '',
          resolveConfig: '/no',
        };
        filesExist.add(expectedPath);
        const returnValue = await binary.DryMongoBinary.generateDownloadPath(opts);
        expect(binary.DryMongoBinary.generatePaths).toHaveBeenCalledTimes(1);
        expect(returnValue).toStrictEqual([true, expectedPath]);
      });

      it('should return the modulesCache when provided', async () => {
        const expectedPath = '/some/.cache/path/binary';
        expectedPaths = {
          homeCache: '/no',
          modulesCache: expectedPath,
          relative: '',
          resolveConfig: '/no',
        };
        filesExist.add(expectedPath);
        const returnValue = await binary.DryMongoBinary.generateDownloadPath(opts);
        expect(binary.DryMongoBinary.generatePaths).toHaveBeenCalledTimes(1);
        expect(returnValue).toStrictEqual([true, expectedPath]);
      });

      it('should return the relative when provided', async () => {
        const expectedPath = '/some/relative/path/binary';
        expectedPaths = {
          homeCache: '/no',
          modulesCache: '/no',
          relative: expectedPath,
          resolveConfig: '/no',
        };
        filesExist.add(expectedPath);
        const returnValue = await binary.DryMongoBinary.generateDownloadPath(opts);
        expect(binary.DryMongoBinary.generatePaths).toHaveBeenCalledTimes(1);
        expect(returnValue).toStrictEqual([true, expectedPath]);
      });
    });

    describe('should return not exists', () => {
      it('should return the DOWNLOAD_DIR when provided', async () => {
        const expectedPath = '/some/custom/path/binary';
        expectedPaths = {
          homeCache: '',
          modulesCache: '',
          relative: '',
          resolveConfig: expectedPath,
        };
        const returnValue = await binary.DryMongoBinary.generateDownloadPath(opts);
        expect(binary.DryMongoBinary.generatePaths).toHaveBeenCalledTimes(1);
        expect(returnValue).toStrictEqual([false, expectedPath]);
      });

      it('should return the homeCache when provided with PREFER_GLOBAL "true"', async () => {
        process.env[envName(ResolveConfigVariables.PREFER_GLOBAL_PATH)] = 'true';
        const expectedPath = '/some/home/path/binary';
        expectedPaths = {
          homeCache: expectedPath,
          modulesCache: '',
          relative: '',
          resolveConfig: '',
        };
        const returnValue = await binary.DryMongoBinary.generateDownloadPath(opts);
        expect(binary.DryMongoBinary.generatePaths).toHaveBeenCalledTimes(1);
        expect(returnValue).toStrictEqual([false, expectedPath]);
      });

      it('should return the modulesCache when provided with PREFER_GLOBAL "false"', async () => {
        process.env[envName(ResolveConfigVariables.PREFER_GLOBAL_PATH)] = 'false';
        const expectedPath = '/some/.cache/path/binary';
        expectedPaths = {
          homeCache: '',
          modulesCache: expectedPath,
          relative: '',
          resolveConfig: '',
        };
        const returnValue = await binary.DryMongoBinary.generateDownloadPath(opts);
        expect(binary.DryMongoBinary.generatePaths).toHaveBeenCalledTimes(1);
        expect(returnValue).toStrictEqual([false, expectedPath]);
      });

      it('should return the relative when provided with PREFER_GLOBAL "false"', async () => {
        process.env[envName(ResolveConfigVariables.PREFER_GLOBAL_PATH)] = 'false';
        const expectedPath = '/some/relative/path/binary';
        expectedPaths = {
          homeCache: '',
          modulesCache: '',
          relative: expectedPath,
          resolveConfig: '',
        };
        const returnValue = await binary.DryMongoBinary.generateDownloadPath(opts);
        expect(binary.DryMongoBinary.generatePaths).toHaveBeenCalledTimes(1);
        expect(returnValue).toStrictEqual([false, expectedPath]);
      });
    });
  });

  describe('locateBinary', () => {
    beforeEach(() => {
      binary.DryMongoBinary.binaryCache.clear();
    });
    afterEach(() => {
      delete process.env[envName(ResolveConfigVariables.SYSTEM_BINARY)];
      jest.restoreAllMocks();
    });

    it('should return SystemBinary if option provided is valid', async () => {
      const mockBinary = '/usr/local/bin/mongod';
      process.env[envName(ResolveConfigVariables.SYSTEM_BINARY)] = mockBinary;
      jest.spyOn(fspromises, 'access').mockResolvedValue(void 0);

      const returnValue = await binary.DryMongoBinary.locateBinary({ version: '1.1.1' });
      expect(returnValue).toEqual(mockBinary);
      expect(binary.DryMongoBinary.binaryCache.size).toBe(0); // system binaries dont get added to the cache
      expect(fspromises.access).toHaveBeenCalled();
    });

    it('should throw an error if SystemBinary was provided, but not found', async () => {
      const mockBinary = '/usr/local/bin/mongod';
      process.env[envName(ResolveConfigVariables.SYSTEM_BINARY)] = mockBinary;
      jest.spyOn(fspromises, 'access').mockRejectedValue(new Error('custom'));

      try {
        await binary.DryMongoBinary.locateBinary({ version: '1.1.1' });
        fail('Expected "locateBinary" to throw');
      } catch (err) {
        expect(err).toBeInstanceOf(BinaryNotFoundError);
        assertIsError(err);
        expect(err.message).toMatchSnapshot();
        expect(binary.DryMongoBinary.binaryCache.size).toBe(0);
        expect(fspromises.access).toHaveBeenCalled();
      }
    });

    it('should return "undefined" if no binary can be found', async () => {
      jest.spyOn(binary.DryMongoBinary, 'generateDownloadPath').mockResolvedValue([false, 'empty']);

      const returnValue = await binary.DryMongoBinary.locateBinary({ version: '1.1.1' });
      expect(returnValue).toBeUndefined();
      expect(binary.DryMongoBinary.binaryCache.size).toBe(0);
      expect(binary.DryMongoBinary.generateDownloadPath).toHaveBeenCalled();
    });

    it('should return "undefined" if binary can be found but also a download-lock', async () => {
      jest
        .spyOn(binary.DryMongoBinary, 'generateDownloadPath')
        .mockResolvedValue([true, '/tmp/1.1.1']);

      const originalPathExists = utils.pathExists;

      const utilsSpy = jest.spyOn(utils, 'pathExists').mockImplementation((path) => {
        if (path === '/tmp/1.1.1.lock' || path === '/tmp/1.1.1') {
          return Promise.resolve(true);
        }

        return originalPathExists(path);
      });

      const returnValue = await binary.DryMongoBinary.locateBinary({ version: '1.1.1' });
      expect(returnValue).toBeUndefined();
      expect(binary.DryMongoBinary.binaryCache.size).toBe(0);
      expect(binary.DryMongoBinary.generateDownloadPath).toHaveBeenCalled();
      expect(utilsSpy).toHaveBeenCalledWith('/tmp/1.1.1.lock');
    });

    it('should return cached version if exists', async () => {
      const mockBinary = '/custom/path';
      binary.DryMongoBinary.binaryCache.set('1.1.1', mockBinary);
      jest.spyOn(binary.DryMongoBinary.binaryCache, 'get');
      jest.spyOn(binary.DryMongoBinary.binaryCache, 'has');

      const returnValue = await binary.DryMongoBinary.locateBinary({ version: '1.1.1' });
      expect(returnValue).toEqual(mockBinary);
      expect(binary.DryMongoBinary.binaryCache.size).toBe(1);
      expect(binary.DryMongoBinary.binaryCache.has).toBeCalledTimes(1);
      expect(binary.DryMongoBinary.binaryCache.get).toBeCalledTimes(1);
    });

    it('should return "generateDownloadPath" return value if not in cache', async () => {
      const mockBinary = '/custom/path';
      jest.spyOn(binary.DryMongoBinary.binaryCache, 'has');
      jest
        .spyOn(binary.DryMongoBinary, 'generateDownloadPath')
        .mockResolvedValue([true, mockBinary]);

      const returnValue = await binary.DryMongoBinary.locateBinary({ version: '1.1.1' });
      expect(returnValue).toEqual(mockBinary);
      expect(binary.DryMongoBinary.binaryCache.size).toBe(1);
      expect(binary.DryMongoBinary.binaryCache.has).toBeCalledTimes(1);
      expect(binary.DryMongoBinary.generateDownloadPath).toHaveBeenCalled();
    });
  });

  describe('generateOptions', () => {
    let osmock: LinuxOS;
    let getosSpy: jest.SpyInstance<ReturnType<typeof getOs.getOS>>;
    const mockBinary: string = '/custom/path';

    beforeEach(() => {
      delete process.env[envName(ResolveConfigVariables.DOWNLOAD_DIR)];
      delete process.env[envName(ResolveConfigVariables.SYSTEM_BINARY)];
      delete process.env[envName(ResolveConfigVariables.VERSION)];
      delete process.env[envName(ResolveConfigVariables.ARCHIVE_NAME)];
      delete process.env[envName(ResolveConfigVariables.DOWNLOAD_URL)];
      process.env['INIT_CWD'] = undefined; // removing this, because it would mess with stuff - but still should be used when available (postinstall)

      jest.spyOn(binary.DryMongoBinary, 'generateDownloadPath').mockImplementation(async (opts) => {
        return [true, opts.downloadDir ? opts.downloadDir : mockBinary];
      });
      osmock = {
        dist: 'ubuntu',
        os: 'linux',
        release: '20.04',
      };
      getosSpy = jest.spyOn(getOs, 'getOS').mockResolvedValue(osmock);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return defaults, with no configs set', async () => {
      const output = await binary.DryMongoBinary.generateOptions();

      expect(output).toStrictEqual(
        expect.objectContaining({
          version: DEFAULT_VERSION,
          systemBinary: '',
          os: osmock,
          downloadDir: path.dirname(mockBinary),
          platform: 'linux',
        })
      );

      expect(getosSpy).toHaveBeenCalled();
    });

    it('should use provided options instead of defaults', async () => {
      const customos: OtherOS = {
        os: 'win32',
      };
      const options: Required<binary.DryMongoBinaryOptions> = {
        version: '4.4.4',
        arch: 'x86',
        os: customos,
        downloadDir: '/path/to/somewhere',
        systemBinary: '/also/somewhere',
        platform: 'linux',
      };
      const output = await binary.DryMongoBinary.generateOptions(options);

      expect(output).toStrictEqual<binary.DryMongoBinaryOptions>({
        version: options.version,
        arch: options.arch,
        systemBinary: options.systemBinary,
        os: options.os,
        downloadDir: path.dirname(options.downloadDir),
        platform: 'linux',
      });

      expect(getosSpy).not.toHaveBeenCalled();
    });

    it('should use env over provided options and defaults', async () => {
      const envdldir = '/env/path/somewhere';
      const envsbdir = '/env/sb/somewhere';
      process.env[envName(ResolveConfigVariables.DOWNLOAD_DIR)] = envdldir;
      process.env[envName(ResolveConfigVariables.SYSTEM_BINARY)] = envsbdir;
      const customos: OtherOS = {
        os: 'win32',
      };
      const options: Required<binary.DryMongoBinaryOptions> = {
        version: '4.4.4',
        arch: 'x86',
        os: customos,
        downloadDir: '/path/to/somewhere',
        systemBinary: '/also/somewhere',
        platform: 'linux',
      };
      const output = await binary.DryMongoBinary.generateOptions(options);

      expect(output).toStrictEqual<binary.DryMongoBinaryOptions>({
        version: options.version,
        arch: options.arch,
        systemBinary: envsbdir,
        os: options.os,
        downloadDir: path.dirname(envdldir),
        platform: 'linux',
      });

      expect(getosSpy).not.toHaveBeenCalled();
    });

    it('should use "parseArchiveNameRegex" when DOWNLOAD_URL is defined', async () => {
      const parseArchiveNameRegexSpy = jest.spyOn(binary.DryMongoBinary, 'parseArchiveNameRegex');
      const envURL = 'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1604-4.0.25.tgz';
      process.env[envName(ResolveConfigVariables.DOWNLOAD_URL)] = envURL;
      const customos: OtherOS = {
        os: 'win32',
      };
      const origOptions: Required<binary.DryMongoBinaryOptions> = {
        version: '4.4.4',
        arch: 'arm64',
        os: customos,
        downloadDir: '/path/to/somewhere',
        systemBinary: '',
        platform: 'linux',
      };

      const output = await binary.DryMongoBinary.generateOptions(origOptions);

      expect(output).toStrictEqual<binary.DryMongoBinaryOptions>({
        version: '4.0.25',
        arch: 'x86_64',
        downloadDir: path.dirname(origOptions.downloadDir),
        systemBinary: '',
        os: {
          os: 'linux',
          dist: 'ubuntu',
          release: '',
        },
        platform: 'linux',
      });

      expect(parseArchiveNameRegexSpy).toHaveBeenCalledTimes(1);
      expect(getosSpy).not.toHaveBeenCalled();
    });

    it('should use "parseArchiveNameRegex" when ARCHIVE_NAME is defined', async () => {
      const parseArchiveNameRegexSpy = jest.spyOn(binary.DryMongoBinary, 'parseArchiveNameRegex');
      const envARCHIVE = 'mongodb-linux-x86_64-ubuntu1604-4.0.24.tgz';
      process.env[envName(ResolveConfigVariables.ARCHIVE_NAME)] = envARCHIVE;
      const customos: OtherOS = {
        os: 'win32',
      };
      const origOptions: Required<binary.DryMongoBinaryOptions> = {
        version: '4.4.4',
        arch: 'arm64',
        os: customos,
        downloadDir: '/path/to/somewhere',
        systemBinary: '',
        platform: 'linux',
      };

      const output = await binary.DryMongoBinary.generateOptions(origOptions);

      expect(output).toStrictEqual<binary.DryMongoBinaryOptions>({
        version: '4.0.24',
        arch: 'x86_64',
        downloadDir: path.dirname(origOptions.downloadDir),
        systemBinary: '',
        os: {
          os: 'linux',
          dist: 'ubuntu',
          release: '',
        },
        platform: 'linux',
      });

      expect(parseArchiveNameRegexSpy).toHaveBeenCalledTimes(1);
      expect(getosSpy).not.toHaveBeenCalled();
    });
  });

  describe('parseArchiveNameRegex', () => {
    it('should parse and overwrite input options LINUX-UBUNTU', async () => {
      const input = 'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1604-4.0.25.tgz';
      // The following options are made different to check that the function actually changes them
      const customos: OtherOS = {
        os: 'win32',
      };
      const origOptions: Required<binary.DryMongoBinaryOptions> = {
        version: '4.4.4',
        arch: 'arm64',
        os: customos,
        downloadDir: '/path/to/somewhere',
        systemBinary: '',
        platform: 'linux',
      };

      const output = binary.DryMongoBinary.parseArchiveNameRegex(input, origOptions);

      expect(output).toStrictEqual<binary.DryMongoBinaryOptions>({
        version: '4.0.25',
        arch: 'x86_64',
        downloadDir: origOptions.downloadDir,
        systemBinary: '',
        os: {
          os: 'linux',
          dist: 'ubuntu',
          release: '',
        },
        platform: 'linux',
      });
    });

    it('should parse and overwrite input options MACOS', async () => {
      const input = 'http://downloads.mongodb.org/osx/mongodb-osx-ssl-x86_64-4.0.25.tgz';
      // The following options are made different to check that the function actually changes them
      const customos: OtherOS = {
        os: 'win32',
      };
      const origOptions: Required<binary.DryMongoBinaryOptions> = {
        version: '4.4.4',
        arch: 'arm64',
        os: customos,
        downloadDir: '/path/to/somewhere',
        systemBinary: '',
        platform: 'darwin',
      };

      const output = binary.DryMongoBinary.parseArchiveNameRegex(input, origOptions);

      expect(output).toStrictEqual<binary.DryMongoBinaryOptions>({
        version: '4.0.25',
        arch: 'x86_64',
        downloadDir: origOptions.downloadDir,
        systemBinary: '',
        os: {
          os: 'osx',
        },
        platform: 'darwin',
      });
    });

    it('should parse and overwrite input options MACOS with macos in archive name', async () => {
      const input = 'http://downloads.mongodb.org/osx/mongodb-macos-x86_64-5.0.3.tgz';
      // The following options are made different to check that the function actually changes them
      const customos: OtherOS = {
        os: 'win32',
      };
      const origOptions: Required<binary.DryMongoBinaryOptions> = {
        version: '5.0.3',
        arch: 'arm64',
        os: customos,
        downloadDir: '/path/to/somewhere',
        systemBinary: '',
        platform: 'darwin',
      };

      const output = binary.DryMongoBinary.parseArchiveNameRegex(input, origOptions);

      expect(output).toStrictEqual<binary.DryMongoBinaryOptions>({
        version: '5.0.3',
        arch: 'x86_64',
        downloadDir: origOptions.downloadDir,
        systemBinary: '',
        os: {
          os: 'macos',
        },
        platform: 'darwin',
      });
    });

    it('should parse and overwrite input options WINDOWS', async () => {
      const input =
        'https://downloads.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-4.0.25.zip';
      // The following options are made different to check that the function actually changes them
      const customos: OtherOS = {
        os: 'osx',
      };
      const origOptions: Required<binary.DryMongoBinaryOptions> = {
        version: '4.4.4',
        arch: 'arm64',
        os: customos,
        downloadDir: '/path/to/somewhere',
        systemBinary: '',
        platform: 'win32',
      };

      const output = binary.DryMongoBinary.parseArchiveNameRegex(input, origOptions);

      expect(output).toStrictEqual<binary.DryMongoBinaryOptions>({
        version: '4.0.25',
        arch: 'x86_64',
        downloadDir: origOptions.downloadDir,
        systemBinary: '',
        os: {
          os: 'win32',
        },
        platform: 'win32',
      });
    });

    it('should throw a Error when no matches are found [NoRegexMatchError]', async () => {
      const customos: OtherOS = {
        os: 'win32',
      };
      const origOptions: Required<binary.DryMongoBinaryOptions> = {
        version: '4.4.4',
        arch: 'arm64',
        os: customos,
        downloadDir: '/path/to/somewhere',
        systemBinary: '',
        platform: 'win32',
      };

      try {
        binary.DryMongoBinary.parseArchiveNameRegex('', origOptions);

        fail('Expected generateOptions to throw "NoRegexMatchError"');
      } catch (err) {
        expect(err).toBeInstanceOf(NoRegexMatchError);
        assertIsError(err);
        expect(err.message).toMatchSnapshot();
      }
    });

    it('should throw a Error when no "version" is found [ParseArchiveRegexError]', async () => {
      const customos: OtherOS = {
        os: 'win32',
      };
      const origOptions: Required<binary.DryMongoBinaryOptions> = {
        version: '4.4.4',
        arch: 'arm64',
        os: customos,
        downloadDir: '/path/to/somewhere',
        systemBinary: '',
        platform: 'win32',
      };

      try {
        binary.DryMongoBinary.parseArchiveNameRegex('mongodb-linux-x86_64-u-4.tgz', origOptions);

        fail('Expected generateOptions to throw "ParseArchiveRegexError"');
      } catch (err) {
        expect(err).toBeInstanceOf(ParseArchiveRegexError);
        assertIsError(err);
        expect(err.message).toMatchSnapshot();
      }
    });
  });
});
