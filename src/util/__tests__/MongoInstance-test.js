/* @flow */

import tmp from 'tmp';
import MongoInstance from '../MongoInstance';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

let tmpDir;
beforeEach(() => {
  tmp.setGracefulCleanup();
  tmpDir = tmp.dirSync({ prefix: 'mongo-mem-', unsafeCleanup: true });
});

afterEach(() => {
  tmpDir.removeCallback();
});

describe('MongoInstance', () => {
  it('should prepare command args', () => {
    const inst = new MongoInstance({
      instance: {
        port: 27333,
        dbPath: '/data',
        storageEngine: 'ephemeralForTest',
      },
    });
    expect(inst.prepareCommandArgs()).toEqual([
      '--port',
      '27333',
      '--storageEngine',
      'ephemeralForTest',
      '--dbpath',
      '/data',
      '--noauth',
    ]);
  });

  it('should start instance on port 27333', async () => {
    const mongod = await MongoInstance.run({
      instance: { port: 27333, dbPath: tmpDir.name },
      binary: { version: '3.4.4' },
    });

    expect(mongod.pid).toBeGreaterThan(0);
    mongod.kill();
  });

  it('should throw error if port is busy', async () => {
    const mongod = await MongoInstance.run({
      instance: { port: 27444, dbPath: tmpDir.name },
      binary: { version: '3.4.4' },
    });

    await expect(
      MongoInstance.run({
        instance: { port: 27444, dbPath: tmpDir.name },
        binary: { version: '3.4.4' },
      })
    ).rejects.toBeDefined();

    mongod.kill();
  });
});
