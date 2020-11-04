import { Stats, promises } from 'fs';
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
      jest.spyOn(promises, 'stat').mockResolvedValueOnce(new Stats());
      await expect(utils.pathExists('/some/path')).resolves.toEqual(true);
    });

    it('should return false if there are no stats', async () => {
      const retError = new Error();
      // @ts-expect-error because there is no FSError, or an error with an "code" property - but still being used
      retError.code = 'ENOENT';
      jest.spyOn(promises, 'stat').mockRejectedValueOnce(retError);
      await expect(utils.pathExists('/some/path')).resolves.toEqual(false);
    });
  });

  describe('statPath', () => {
    it('should throw an error if code is not "ENOENT"', async () => {
      const retError = new Error();
      // @ts-expect-error because there is no FSError, or an error with an "code" property - but still being used
      retError.code = 'EPERM';
      jest.spyOn(promises, 'stat').mockRejectedValueOnce(retError);
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
        expect(err.message).toEqual('Assert failed - no custom error [E019]');
      }
    });
  });
});
