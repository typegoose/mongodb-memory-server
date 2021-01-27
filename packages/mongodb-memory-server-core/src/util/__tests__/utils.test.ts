import { Stats, promises as fspromises } from 'fs';
import { ChildProcess } from 'child_process';
import * as utils from '../utils';

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
    it('should throw an error if code is not "ENOENT"', async () => {
      const retError = new Error();
      // @ts-expect-error because there is no FSError, or an error with an "code" property - but still being used
      retError.code = 'EPERM';
      jest.spyOn(fspromises, 'stat').mockRejectedValueOnce(retError);
      await expect(utils.statPath('/some/path')).rejects.toThrowError(retError);
    });
  });

  describe('assertion', () => {
    it('should throw default error if none provided', () => {
      expect.assertions(1);
      try {
        utils.assertion(false);
        fail('Expected Assertion to Throw');
      } catch (err) {
        expect(err.message).toEqual('Assert failed - no custom error');
      }
    });
  });

  describe('killProcess', () => {
    it('should early return if given child pid is not alive', async () => {
      // mock "process.kill" because when mocking "isAlive", "killProcess" wont actually use the mock
      jest.spyOn(process, 'kill').mockImplementationOnce(() => {
        throw new Error('hello');
      });
      jest.useFakeTimers(); // fake times to have spies on "setTimeout" (and ensure they never get run)

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

    it('should throw an error if error is not "ENOENT"', async () => {
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
});
