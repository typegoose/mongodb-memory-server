/* @flow */

import tmp from 'tmp';
import MongoInstance from '../MongoInstance';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 240000;

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

    expect(mongod.getPid()).toBeGreaterThan(0);

    await mongod.kill();
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

    await mongod.kill();
  });

  it('should await while mongo is killed', async () => {
    const mongod = await MongoInstance.run({
      instance: { port: 27445, dbPath: tmpDir.name },
      binary: { version: '3.4.4' },
    });
    const pid: any = mongod.getPid();
    expect(pid).toBeGreaterThan(0);

    function isPidRunning(p: number) {
      try {
        return process.kill(p, 0);
      } catch (e) {
        return e.code === 'EPERM';
      }
    }

    expect(isPidRunning(pid)).toBeTruthy();
    await mongod.kill();
    expect(isPidRunning(pid)).toBeFalsy();
  });
});
