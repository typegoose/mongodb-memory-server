import MongoMemoryReplSet, { MongoMemoryReplSetOpts } from '../MongoMemoryReplSet';
import { resetPortsCache } from '../util/getport';
import { createTmpDir, removeDir } from '../util/utils';

let tmpDir: string;
beforeEach(async () => {
  tmpDir = await createTmpDir('reuse-mongo-mem-');
});

afterEach(async () => {
  await removeDir(tmpDir);
});

describe('Restart single MongoMemoryReplSet instance', () => {
  it('should start and stop twice', async () => {
    const opts = {
      replSet: {
        storageEngine: 'wiredTiger',
      },
      instanceOpts: [
        {
          port: 27017,
          dbPath: tmpDir,
        },
      ],
    } as MongoMemoryReplSetOpts;

    const replSetBefore = await MongoMemoryReplSet.create(opts);

    // Write real port to config (because 27017 may be busy, we need to get real port)

    opts.instanceOpts[0].port = replSetBefore.servers[0].instanceInfo!.port;

    await replSetBefore.stop();

    resetPortsCache();

    const replSetAfter = await MongoMemoryReplSet.create(opts);
    await replSetAfter.stop();
  }, 600000);
});
