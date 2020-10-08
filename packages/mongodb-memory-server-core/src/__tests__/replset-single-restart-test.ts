import MongoMemoryReplSet, { MongoMemoryReplSetOptsT } from '../MongoMemoryReplSet';
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
    const opts = {
      replSet: {
        storageEngine: 'wiredTiger',
      },
      instanceOpts: [
        {
          port: 27017,
          dbPath: tmpDir.name,
        },
      ],
    } as MongoMemoryReplSetOptsT;

    const replSetBefore = await MongoMemoryReplSet.create(opts);

    // Write real port to config (because 27017 may be busy, we need to get real port)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    opts.instanceOpts![0].port = replSetBefore.servers[0].instanceInfo!.port;

    await replSetBefore.stop();

    /*
     * get-port has a portlocking-feature that keeps ports locked for
     * "a minimum of 15 seconds and a maximum of 30 seconds before being released again"
     * https://github.com/sindresorhus/get-port#beware
     */
    // this test needs to use the *exact same port* again, otherwise Mongod will throw an error "No host described in new configuration ${newPort} for replica set testset maps to this node"
    await sleep(30000);

    const replSetAfter = await MongoMemoryReplSet.create(opts);
    await replSetAfter.stop();
  }, 600000);
});
