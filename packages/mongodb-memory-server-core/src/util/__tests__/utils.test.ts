import { Stats, promises as fspromises } from 'fs';
import { ChildProcess } from 'child_process';
import * as utils from '../utils';
import { resolve } from 'path';
import {
  AssertionFallbackError,
  BinaryNotFoundError,
  InsufficientPermissionsError,
} from '../errors';
import { assertIsError } from '../../__tests__/testUtils/test_utils';
import { SemVer } from 'semver';

describe('utils', () => {
  describe('uriTemplate', () => {
    it('should not add "?" without query options', () => {
      expect(utils.uriTemplate('0.0.0.0', 1001, 'somedb')).toEqual('mongodb://0.0.0.0:1001/somedb');
    });

    it('should add "?" with query options', () => {
      expect(utils.uriTemplate('0.0.0.0', 1001, 'somedb', ['option1=1', 'option2=2'])).toEqual(
        'mongodb://0.0.0.0:1001/somedb?option1=1&option2=2'
      );
    });
  });

  describe('pathExists', () => {
    it('should return true if there are stats', async () => {
      jest.spyOn(fspromises, 'stat').mockResolvedValueOnce(new Stats());
      await expect(utils.pathExists('/some/path')).resolves.toEqual(true);
    });

    it('should return false if there are no stats', async () => {
      const retError = new Error();
      // @ts-expect-error because there is no FSError, or an error with an "code" property - but still being used
      retError.code = 'ENOENT';
      jest.spyOn(fspromises, 'stat').mockRejectedValueOnce(retError);
      await expect(utils.pathExists('/some/path')).resolves.toEqual(false);
    });
  });

  describe('statPath', () => {
    it('should throw an error if code is not "ENOENT" or "EACCES"', async () => {
      const retError = new Error();
      // @ts-expect-error because there is no FSError, or an error with an "code" property - but still being used
      retError.code = 'EPERM';
      jest.spyOn(fspromises, 'stat').mockRejectedValueOnce(retError);
      await expect(utils.statPath('/some/path')).rejects.toThrowError(retError);
    });
  });

  describe('assertion', () => {
    it('should run without error', () => {
      expect(utils.assertion(true)).toStrictEqual(void 0);
    });

    it('should throw default error if none provided', () => {
      expect.assertions(2);
      try {
        utils.assertion(false);
        fail('Expected Assertion to Throw');
      } catch (err) {
        assertIsError(err);
        expect(err).toBeInstanceOf(AssertionFallbackError);
        expect(err.message).toMatchSnapshot();
      }
    });
  });

  describe('killProcess', () => {
    it('should early return if given child pid is not alive', async () => {
      // mock "process.kill" because when mocking "isAlive", "killProcess" wont actually use the mock
      jest.spyOn(process, 'kill').mockImplementationOnce(() => {
        throw new Error('hello');
      });
      jest.spyOn(global, 'setTimeout');
      // the "useFakeTimers" seems to be brocken in jest@27.0.5 & ts-jest@27.0.3
      // tracking issue: https://github.com/facebook/jest/issues/11564
      // jest.useFakeTimers(); // fake times to have spies on "setTimeout" (and ensure they never get run)

      await utils.killProcess({ pid: 1001 } as ChildProcess, 'test');
      expect(process.kill).toHaveBeenCalledWith(1001, 0);
      expect(setTimeout).not.toHaveBeenCalled();
    });
  });

  describe('tryReleaseFile', () => {
    it('should return an Parsed Output', async () => {
      expect.assertions(2);
      const shouldOutput = 'HelloThere';
      jest.spyOn(fspromises, 'readFile').mockResolvedValueOnce(shouldOutput);

      await expect(
        utils.tryReleaseFile('/some/path', (output) => {
          expect(output).toEqual(shouldOutput);

          return { hello: output } as any;
        })
      ).resolves.toEqual({ hello: shouldOutput });
    });

    it('should return "undefined" if "ENOENT"', async () => {
      const retError = new Error();
      // @ts-expect-error because there is no FSError, or an error with an "code" property - but still being used
      retError.code = 'ENOENT';
      jest.spyOn(fspromises, 'readFile').mockRejectedValueOnce(retError);

      await expect(
        utils.tryReleaseFile('/some/path', () => {
          fail('This Function should never run');
        })
      ).resolves.toBeUndefined();
    });

    it('should return "undefined" if "EACCES"', async () => {
      const retError = new Error();
      // @ts-expect-error because there is no FSError, or an error with an "code" property - but still being used
      retError.code = 'EACCES';
      jest.spyOn(fspromises, 'readFile').mockRejectedValueOnce(retError);

      await expect(
        utils.tryReleaseFile('/some/path', () => {
          fail('This Function should never run');
        })
      ).resolves.toBeUndefined();
    });

    it('should throw an error if error is not "ENOENT" or "EACCES"', async () => {
      const retError = new Error();
      // @ts-expect-error because there is no FSError, or an error with an "code" property - but still being used
      retError.code = 'EPERM';
      jest.spyOn(fspromises, 'readFile').mockRejectedValueOnce(retError);

      await expect(
        utils.tryReleaseFile('/some/path', () => {
          fail('This Function should never run');
        })
      ).rejects.toThrow(retError);
    });
  });

  describe('getHost', () => {
    it('should correctly extract host & port', () => {
      expect(utils.getHost('mongodb://user:pass@localhost:port/authdb?queryoptions=1')).toEqual(
        'localhost:port'
      );
      expect(utils.getHost('mongodb://0.0.0.0:0000/')).toEqual('0.0.0.0:0000');
      expect(utils.getHost('mongodb://user:pass@localhost:0000/')).toEqual('localhost:0000');
    });
  });

  describe('checkBinaryPermissions', () => {
    let tmpDir: string;
    beforeEach(async () => {
      jest.restoreAllMocks();
      tmpDir = await utils.createTmpDir('mongo-mem-utils-');
    });
    afterEach(async () => {
      await utils.removeDir(tmpDir);
    });

    it('should throw nothing', async () => {
      jest.spyOn(fspromises, 'access');
      const binaryPath = resolve(tmpDir, 'noThrow');

      await fspromises.writeFile(binaryPath, '', { mode: 0o777 });

      await utils.checkBinaryPermissions(binaryPath);

      expect(fspromises.access).toHaveBeenCalledTimes(1);
    });

    it('should throw InsufficientPermissionsError', async () => {
      // this "mockImplementationOnce" is needed, because in jest "Error != Error" when returned from built-in functions
      const origAccess = fspromises.access; // store non-mocked function
      const spy = jest.spyOn(fspromises, 'access').mockImplementation(async (...options) => {
        try {
          return await origAccess(...options);
        } catch (err: any) {
          // the following maps required values from original Error to jest Error
          const newError = new Error();
          newError.message = err.message;
          (newError as any).code = err.code;
          throw newError;
        }
      });
      const binaryPath = resolve(tmpDir, 'throwInsufficientPermissionsError');

      await fspromises.writeFile(binaryPath, '', { mode: 0o600 });

      try {
        await utils.checkBinaryPermissions(binaryPath);
        fail('Expected "utils.checkBinaryPermissions" to throw');
      } catch (err) {
        expect(err).toBeInstanceOf(InsufficientPermissionsError);
        expect(err).toHaveProperty('path', binaryPath);
      }

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should throw BinaryNotFoundError', async () => {
      // this "mockImplementationOnce" is needed, because in jest "Error != Error" when returned from built-in functions
      const origAccess = fspromises.access; // store non-mocked function
      const spy = jest.spyOn(fspromises, 'access').mockImplementation(async (...options) => {
        try {
          return await origAccess(...options);
        } catch (err: any) {
          // the following maps required values from original Error to jest Error
          const newError = new Error();
          newError.message = err.message;
          (newError as any).code = err.code;
          throw newError;
        }
      });
      const binaryPath = resolve(tmpDir, 'doesNotExist');

      try {
        await utils.checkBinaryPermissions(binaryPath);
        fail('Expected "utils.checkBinaryPermissions" to throw');
      } catch (err) {
        expect(err).toBeInstanceOf(BinaryNotFoundError);
        expect(err).toHaveProperty('path', binaryPath);
      }

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getStorageEngine', () => {
    it('should get default without warning for versions', () => {
      jest.spyOn(console, 'warn');
      expect(utils.getStorageEngine(undefined, new SemVer('6.0.0'))).toStrictEqual(
        'ephemeralForTest'
      );
      expect(utils.getStorageEngine(undefined, new SemVer('7.0.0'))).toStrictEqual('wiredTiger');

      expect(console.warn).toHaveBeenCalledTimes(0);
    });

    it('should not warn for versions below 7.0.0', () => {
      jest.spyOn(console, 'warn');
      expect(utils.getStorageEngine('ephemeralForTest', new SemVer('6.0.0'))).toStrictEqual(
        'ephemeralForTest'
      );
      expect(utils.getStorageEngine('wiredTiger', new SemVer('6.0.0'))).toStrictEqual('wiredTiger');

      expect(console.warn).toHaveBeenCalledTimes(0);
    });

    it('should warn for versions above 7.0.0 for ephemeralForTest', () => {
      jest.spyOn(console, 'warn').mockImplementationOnce(() => void 0);
      expect(utils.getStorageEngine('ephemeralForTest', new SemVer('7.0.0'))).toStrictEqual(
        'wiredTiger'
      );
      expect(utils.getStorageEngine('wiredTiger', new SemVer('7.0.0'))).toStrictEqual('wiredTiger');

      expect(console.warn).toHaveBeenCalledTimes(1);
    });
  });
});
