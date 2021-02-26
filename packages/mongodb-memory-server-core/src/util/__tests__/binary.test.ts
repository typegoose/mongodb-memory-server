import * as binary from '../DryMongoBinary';
import * as debug from 'debug';
import * as path from 'path';
import { constants, promises as fspromises } from 'fs';

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

  describe('generatePaths', () => {}); // TODO: add tests for "DryMongoBinary.generatePaths"
  describe('generateDownloadPath', () => {}); // TODO: add tests for "DryMongoBinary.generateDownloadPath"
  describe('locateBinary', () => {}); // TODO: add tests for "DryMongoBinary.locateBinary"

  it.skip('TEST', async () => {
    debug.enable('*');
    const returnvalue = await binary.DryMongoBinary.locateBinary({ version: '4.0.20' });
    console.log('returnvalue', returnvalue);
  });
});
