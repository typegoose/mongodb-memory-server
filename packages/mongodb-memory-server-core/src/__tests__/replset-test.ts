import MongoMemoryReplSet from '../MongoMemoryReplSet';
import { MongoClient } from 'mongodb';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

describe('multi-member replica set', () => {
  it.only('should enter running state', async () => {
    const opts: any = { replSet: { count: 3 } };
    const replSet = new MongoMemoryReplSet(opts);
    await replSet.waitUntilRunning();
    expect(replSet.servers.length).toEqual(3);
    const uri = await replSet.getUri();
    expect(uri.split(',').length).toEqual(3);

    await replSet.stop();
  }, 40000);

  it('should be possible to connect replicaset after waitUntilRunning resolveds', async () => {
    const opts: any = { replSet: { count: 3 } };
    const replSet = new MongoMemoryReplSet(opts);
    await replSet.waitUntilRunning();
    const uri = await replSet.getUri();

    await MongoClient.connect(`${uri}?replicaSet=testset`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await replSet.stop();
  });
});
