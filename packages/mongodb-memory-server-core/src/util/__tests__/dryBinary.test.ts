import * as binary from '../DryMongoBinary';
import * as debug from 'debug';
import * as path from 'path';
import * as tmp from 'tmp';
import { constants, promises as fspromises } from 'fs';
import { envName, ResolveConfigVariables } from '../resolveConfig';
import mkdirp from 'mkdirp';

tmp.setGracefulCleanup();

describe('DryBinary', () => {
  it('should combine options with base and binary', () => {
    const input = {
      opts: {
        version: '4.0.20',
      },
      base: '/hello',
      binary: 'mongod',
    };
    expect(binary.DryMongoBinary.combineBinaryName(input.opts, input.base, input.binary)).toEqual(
      path.resolve(input.base, input.opts.version, input.binary)
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
    let tmpDir: tmp.DirResult;
    /** Used for non "find-cache-dir" */
    let tmpDir2: tmp.DirResult;
    let cwdBefore: string;
    const version = '4.0.20';
    beforeAll(async () => {
      delete process.env[envName(ResolveConfigVariables.DOWNLOAD_DIR)]; // i dont know where this comes from, but without it, this property exists
      cwdBefore = process.cwd();
      tmpDir = tmp.dirSync({ prefix: 'mongo-mem-drybinGP-', unsafeCleanup: true });
      tmpDir2 = tmp.dirSync({ prefix: 'mongo-mem-drybinGP-', unsafeCleanup: true });
      jest
        .spyOn(
          binary.DryMongoBinary,
          // @ts-expect-error expected, because function "homedir" is private
          'homedir'
        )
        .mockReturnValue(path.resolve(tmpDir.name, 'homedir'));

      // Create all directories
      {
        await mkdirp(path.resolve(tmpDir.name, 'node_modules/mongodb-memory-server')); // mock being in an postinstall directory path
        await mkdirp(path.resolve(tmpDir.name, 'node_modules/.cache')); // mock having an local modules cache
        await mkdirp(path.resolve(tmpDir.name, 'homedir/.cache/mongodb-binaries')); // mock having an "legacy" global directory
        await fspromises.writeFile(path.resolve(tmpDir.name, 'package.json'), '');
      }
    });
    afterAll(() => {
      tmpDir.removeCallback();
      tmpDir2.removeCallback();
      process.chdir(cwdBefore);
    });

    beforeEach(() => {
      // execute this before each test, to always have the correct cwd
      process.chdir(path.resolve(tmpDir.name));
    });
    afterEach(() => {
      delete process.env[envName(ResolveConfigVariables.DOWNLOAD_DIR)];
    });

    it('should have 3 complete paths while not being in postinstall or having a config', async () => {
      const returnValue = await binary.DryMongoBinary.generatePaths({ version });
      expect(returnValue).toStrictEqual({
        resolveConfig: '', // empty because not having an extra config value
        relative: path.resolve(tmpDir.name, 'mongodb-binaries', version, 'mongod'),
        legacyHomeCache: path.resolve(
          tmpDir.name,
          'homedir/.cache/mongodb-binaries',
          version,
          'mongod'
        ),
        modulesCache: path.resolve(
          tmpDir.name,
          'node_modules/.cache/mongodb-memory-server',
          version,
          'mongod'
        ),
      } as binary.DryMongoBinaryPaths);
    });

    it('should have 3 complete paths while being in postinstall and not having a config', async () => {
      process.chdir(path.resolve(tmpDir.name, 'node_modules/mongodb-memory-server'));
      const returnValue = await binary.DryMongoBinary.generatePaths({ version });
      expect(returnValue).toStrictEqual({
        resolveConfig: '', // empty because not having an extra config value
        relative: path.resolve(
          tmpDir.name,
          'node_modules/mongodb-memory-server',
          'mongodb-binaries',
          version,
          'mongod'
        ),
        legacyHomeCache: path.resolve(
          tmpDir.name,
          'homedir/.cache/mongodb-binaries',
          version,
          'mongod'
        ),
        modulesCache: path.resolve(
          tmpDir.name,
          'node_modules/.cache/mongodb-memory-server',
          version,
          'mongod'
        ),
      } as binary.DryMongoBinaryPaths);
    });

    it('should have 4 complete paths while not being in postinstall but having a config', async () => {
      const customPath = '/some/custom/path';
      process.env[envName(ResolveConfigVariables.DOWNLOAD_DIR)] = customPath;
      const returnValue = await binary.DryMongoBinary.generatePaths({ version });
      expect(returnValue).toStrictEqual({
        resolveConfig: path.resolve('/some/custom/path', version, 'mongod'),
        relative: path.resolve(tmpDir.name, 'mongodb-binaries', version, 'mongod'),
        legacyHomeCache: path.resolve(
          tmpDir.name,
          'homedir/.cache/mongodb-binaries',
          version,
          'mongod'
        ),
        modulesCache: path.resolve(
          tmpDir.name,
          'node_modules/.cache/mongodb-memory-server',
          version,
          'mongod'
        ),
      } as binary.DryMongoBinaryPaths);
    });

    it('should have 2 complete paths while not being in postinstall and not having a config and not being in an project', async () => {
      const customPath = path.resolve(tmpDir2.name);
      process.chdir(customPath);
      const returnValue = await binary.DryMongoBinary.generatePaths({ version });
      expect(returnValue).toStrictEqual({
        resolveConfig: '', // empty because not having an extra config value
        relative: path.resolve(tmpDir2.name, 'mongodb-binaries', version, 'mongod'),
        legacyHomeCache: path.resolve(
          tmpDir.name,
          'homedir/.cache/mongodb-binaries',
          version,
          'mongod'
        ),
        modulesCache: '', // because not being in an project
      } as binary.DryMongoBinaryPaths);
    });
  });

  describe('generateDownloadPath', () => {}); // TODO: add tests for "DryMongoBinary.generateDownloadPath"

  describe('locateBinary', () => {
    beforeEach(() => {
      binary.DryMongoBinary.binaryCache.clear();
    });
    afterEach(() => {
      delete process.env[envName(ResolveConfigVariables.SYSTEM_BINARY)];
    });

    it('should return SystemBinary if option provided is valid', async () => {
      const mockBinary = '/usr/local/bin/mongod';
      process.env[envName(ResolveConfigVariables.SYSTEM_BINARY)] = mockBinary;
      jest.spyOn(fspromises, 'access').mockResolvedValue(void 0);

      const returnValue = await binary.DryMongoBinary.locateBinary({ version: '4.0.20' });
      expect(returnValue).toEqual(mockBinary);
      expect(binary.DryMongoBinary.binaryCache.size).toBe(0); // system binaries dont get added to the cache
      expect(fspromises.access).toHaveBeenCalled();
    });

    it('should throw an error if SystemBinary was provided, but not found', async () => {
      const mockBinary = '/usr/local/bin/mongod';
      process.env[envName(ResolveConfigVariables.SYSTEM_BINARY)] = mockBinary;
      jest.spyOn(fspromises, 'access').mockRejectedValue(new Error('custom'));

      try {
        await binary.DryMongoBinary.locateBinary({ version: '4.0.20' });
        fail('Expected "locateBinary" to throw');
      } catch (err) {
        expect(err.message).toEqual(
          `Config option "SYSTEM_BINARY" was provided with value "${mockBinary}", but no binary could be found!`
        );
        expect(binary.DryMongoBinary.binaryCache.size).toBe(0);
        expect(fspromises.access).toHaveBeenCalled();
      }
    });

    it('should return "undefined" if no binary can be found', async () => {
      jest.spyOn(binary.DryMongoBinary, 'generateDownloadPath').mockResolvedValue([false, 'empty']);

      const returnValue = await binary.DryMongoBinary.locateBinary({ version: '4.0.20' });
      expect(returnValue).toBeUndefined();
      expect(binary.DryMongoBinary.binaryCache.size).toBe(0);
      expect(binary.DryMongoBinary.generateDownloadPath).toHaveBeenCalled();
    });

    it('should return cached version if exists', async () => {
      const mockBinary = '/custom/path';
      binary.DryMongoBinary.binaryCache.set('4.0.20', mockBinary);
      jest.spyOn(binary.DryMongoBinary.binaryCache, 'get');
      jest.spyOn(binary.DryMongoBinary.binaryCache, 'has');

      const returnValue = await binary.DryMongoBinary.locateBinary({ version: '4.0.20' });
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

      const returnValue = await binary.DryMongoBinary.locateBinary({ version: '4.0.20' });
      expect(returnValue).toEqual(mockBinary);
      expect(binary.DryMongoBinary.binaryCache.size).toBe(1);
      expect(binary.DryMongoBinary.binaryCache.has).toBeCalledTimes(2); // it seems like ".set" also calls ".has"
      expect(binary.DryMongoBinary.generateDownloadPath).toHaveBeenCalled();
    });
  });

  it.skip('TEST', async () => {
    debug.enable('*');
    const returnvalue = await binary.DryMongoBinary.locateBinary({ version: '4.0.20' });
    console.log('returnvalue', returnvalue);
  });
});
