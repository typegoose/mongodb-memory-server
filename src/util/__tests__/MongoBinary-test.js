/* @flow */

import tmp from 'tmp';
import fs from 'fs';
import MongoBinary from '../MongoBinary';

tmp.setGracefulCleanup();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 160000;

describe('MongoBinary', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = tmp.dirSync({ prefix: 'mongo-mem-bin-', unsafeCleanup: true });
  });

  afterEach(() => {
    // cleanup
    tmpDir.removeCallback();
  });

  it('should download binary and keep it in cache', async () => {
    // download
    const version = 'latest';
    const binPath = await MongoBinary.getPath({
      downloadDir: tmpDir.name,
      version,
    });
    // eg. /tmp/mongo-mem-bin-33990ScJTSRNSsFYf/mongodb-download/a811facba94753a2eba574f446561b7e/mongodb-macOS-x86_64-3.5.5-13-g00ee4f5/
    expect(binPath).toMatch(/mongo-mem-bin-.*\/.*\/mongod$/);

    // reuse cache
    expect(MongoBinary.cache[version]).toBeDefined();
    expect(MongoBinary.cache[version]).toEqual(binPath);
    const binPathAgain = await MongoBinary.getPath({
      downloadDir: tmpDir.name,
      version,
    });
    expect(binPathAgain).toEqual(binPath);
  });

  it('should use cache', async () => {
    MongoBinary.cache['3.4.2'] = '/bin/mongod';
    await expect(MongoBinary.getPath({ version: '3.4.2' })).resolves.toEqual('/bin/mongod');
  });

  describe('System Binary', () => {
    let accessSpy: any;

    beforeEach(() => {
      accessSpy = jest.spyOn(fs, 'access');
    });

    afterEach(() => accessSpy.mockClear());

    it('should use system binary if option is passed.', async () => {
      await MongoBinary.getPath({ systemBinary: '/usr/bin/mongod' });

      expect(accessSpy).toHaveBeenCalledWith('/usr/bin/mongod');
    });

    it('should get system binary from the environment', async () => {
      process.env.MONGOMS_SYSTEM_BINARY = '/usr/local/bin/mongod';
      await MongoBinary.getPath();

      expect(accessSpy).toHaveBeenCalledWith('/usr/local/bin/mongod');
    });
  });
});
