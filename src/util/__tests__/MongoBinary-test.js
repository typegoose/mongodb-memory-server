/* @flow */

import tmp from 'tmp';
import MongoBinary from '../MongoBinary';

tmp.setGracefulCleanup();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe('MongoBinary', () => {
  it('should download binary and keep it in cache', async () => {
    const tmpDir = tmp.dirSync({ prefix: 'mongo-mem-bin-', unsafeCleanup: true });

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

    // cleanup
    tmpDir.removeCallback();
  });

  it('should use cache', async () => {
    MongoBinary.cache['3.4.2'] = '/bin/mongod';
    await expect(MongoBinary.getPath({ version: '3.4.2' })).resolves.toEqual('/bin/mongod');
  });
});
