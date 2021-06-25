import MongoMemoryReplSet from '../MongoMemoryReplSet';
import { MongoClient } from 'mongodb';

jest.setTimeout(100000); // 10s

describe('multi-member replica set', () => {
  it('should enter running state', async () => {
    const replSet = await MongoMemoryReplSet.create({ replSet: { count: 3 } });
    expect(replSet.servers.length).toEqual(3);
    expect(replSet.getUri().split(',').length).toEqual(3);

    await replSet.stop();
  }, 40000);

  it('should be possible to connect replicaset after waitUntilRunning resolveds', async () => {
    const replSet = await MongoMemoryReplSet.create({ replSet: { count: 3 } });

    const con = await MongoClient.connect(replSet.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // await while all SECONDARIES will be ready
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const db = await con.db('admin');
    const admin = db.admin();
    const status = await admin.replSetGetStatus();
    expect(status.members.filter((m: any) => m.stateStr === 'PRIMARY')).toHaveLength(1);
    expect(status.members.filter((m: any) => m.stateStr === 'SECONDARY')).toHaveLength(2);

    await con.close();
    await replSet.stop();
  });
});
