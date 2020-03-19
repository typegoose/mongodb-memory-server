import MongoMemoryReplSet from '../MongoMemoryReplSet';
import * as tmp from 'tmp';

let tmpDir: tmp.DirResult;
beforeEach(() => {
  tmpDir = tmp.dirSync({ prefix: 'reuse-mongo-mem-', unsafeCleanup: true });
});

afterEach(() => {
  tmpDir.removeCallback();
});

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

describe('single-member replica set', () => {
  it('should start multiple times', async () => {
    const opts: any = {
      replSet: {
        storageEngine: 'wiredTiger',
      },
      instanceOpts: [
        {
          port: 27017,
          dbPath: tmpDir.name,
        },
      ],
    };

    const replSetBefore = new MongoMemoryReplSet(opts);
    await replSetBefore.waitUntilRunning();
    await replSetBefore.stop();
    /**
     * get-port has a portlocking-feature that keeps ports locked for
     * "a minimum of 15 seconds and a maximum of 30 seconds before being released again"
     * https://github.com/sindresorhus/get-port#beware
     */
    await sleep(30000);

    const replSetAfter = new MongoMemoryReplSet(opts);
    await replSetAfter.waitUntilRunning();
    await replSetAfter.stop();
  }, 600000);
});
