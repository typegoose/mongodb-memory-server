// @flow

import MongoMemoryReplSet from '../MongoMemoryReplSet';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe('single server replset', () => {
  let replSet: MongoMemoryReplSet;
  afterEach(async () => {
    if (!(replSet && replSet._state === 'running')) return;
    await replSet.stop();
    replSet = (null: any);
  });

  it('should enter running state', async () => {
    replSet = new MongoMemoryReplSet();
    await replSet.waitUntilRunning();
    const uri = await replSet.getUri();
    expect(uri.split(',').length).toEqual(1);
  });

  it('should be able to get connection string to specific db', async () => {
    replSet = new MongoMemoryReplSet();
    await replSet.waitUntilRunning();
    const uri = await replSet.getUri('other');
    const str = await replSet.getConnectionString('other');
    expect(uri.split(',').length).toEqual(1);
    expect(uri.endsWith('/other')).toBeTruthy();
    expect(str).toEqual(uri);
  });

  it('should be able to get dbName', async () => {
    const opts: any = { autoStart: false, replSet: { dbName: 'static' } };
    replSet = new MongoMemoryReplSet(opts);
    const dbName = await replSet.getDbName();
    expect(dbName).toEqual('static');
  });

  it('should not autostart if autostart: false', async () => {
    replSet = new MongoMemoryReplSet({ autoStart: false });
    await new Promise((resolve, reject) => {
      replSet.once('state', state => reject(new Error(`Invalid state: ${state}`)));
      setTimeout(resolve, 500);
    });
  });
});

describe('multi-member replica set', () => {
  let replSet: MongoMemoryReplSet;
  afterEach(async () => {
    if (!replSet) return;
    await replSet.stop();
    replSet = (null: any);
  });

  it(
    'should enter running state',
    async () => {
      const opts: any = { replSet: { count: 3 } };
      replSet = new MongoMemoryReplSet(opts);
      await replSet.waitUntilRunning();
      expect(replSet.servers.length).toEqual(3);
      const uri = await replSet.getUri();
      expect(uri.split(',').length).toEqual(3);
    },
    40000
  );
});
