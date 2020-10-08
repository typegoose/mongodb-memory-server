/* eslint-disable @typescript-eslint/ban-ts-comment */
import MongoMemoryReplSet, { MongoMemoryReplSetStateEnum } from '../MongoMemoryReplSet';
import { MongoClient } from 'mongodb';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

describe('single server replset', () => {
  it('should enter running state', async () => {
    const replSet = await MongoMemoryReplSet.create();
    const uri = await replSet.getUri();
    expect(uri.split(',').length).toEqual(1);

    await replSet.stop();
  });

  it('should be able to get connection string to specific db', async () => {
    const replSet = await MongoMemoryReplSet.create();
    const uri = await replSet.getUri('other');
    expect(uri.split(',').length).toEqual(1);
    expect(uri.includes('/other')).toBeTruthy();
    expect(uri.includes('replicaSet=testset')).toBeTruthy();

    await replSet.stop();
  });

  it('should be able to get dbName', async () => {
    const replSet = new MongoMemoryReplSet({ replSet: { dbName: 'static' } });
    expect(replSet.replSetOpts.dbName).toEqual('static');

    await replSet.stop();
  });

  it('should be possible to connect replicaset after waitUntilRunning resolves', async () => {
    const replSet = await MongoMemoryReplSet.create();
    const uri = await replSet.getUri();

    const con = await MongoClient.connect(`${uri}?replicaSet=testset`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await con.close();
    await replSet.stop();
  });

  it('"new" should throw an error if replSet count is 0 or less', () => {
    try {
      new MongoMemoryReplSet({ replSet: { count: 0 } });
      fail('Expected "new MongoMemoryReplSet" to throw an error');
    } catch (err) {
      expect(err.message).toEqual('ReplSet Count needs to be 1 or higher!');
    }
  });

  it('"waitUntilRunning" should throw an error if _state is not "init"', async () => {
    const replSet = new MongoMemoryReplSet();
    const timeout = setTimeout(() => {
      fail('Timeout - Expected "waitUntilRunning" to throw');
    }, 100);

    try {
      await replSet.waitUntilRunning();
      fail('Expected "waitUntilRunning" to throw');
    } catch (err) {
      clearTimeout(timeout);
      expect(err.message).toEqual(
        'State is not "running" or "init" - cannot wait on something that dosnt start'
      );
    }
  });

  it('"getUri" should throw an error if _state is not "running"', async () => {
    const replSet = new MongoMemoryReplSet();
    const timeout = setTimeout(() => {
      fail('Timeout - Expected "getUri" to throw');
    }, 100);

    try {
      await replSet.getUri();
      fail('Expected "getUri" to throw');
    } catch (err) {
      clearTimeout(timeout);
      expect(err.message).toEqual('Replica Set is not running. Use debug for more info.');
    }
  });

  it('"getUri" should execute "waitUntilRunning" if state is "init"', async () => {
    const replSet = new MongoMemoryReplSet();
    const spy = jest.spyOn(replSet, 'waitUntilRunning');
    // this case can normally happen if "start" is called without await, and "getUri" directly after and that is awaited
    // @ts-expect-error
    replSet._state = MongoMemoryReplSetStateEnum.init; // artificially set this to init
    const promise = replSet.getUri();
    // @ts-expect-error
    replSet._state = MongoMemoryReplSetStateEnum.stopped; // set it back for "start"
    await replSet.start();

    await promise; // await the promise to make sure nothing got thrown

    expect(spy.mock.calls.length).toEqual(1);

    await replSet.stop();
  });

  it('"start" should throw an error if _state is not "stopped"', async () => {
    const replSet = new MongoMemoryReplSet();
    const timeout = setTimeout(() => {
      fail('Timeout - Expected "start" to throw');
    }, 100);

    // this case can normally happen if "start" is called again, without either an error or "stop" happened
    // @ts-expect-error
    replSet._state = MongoMemoryReplSetStateEnum.running; // artificially set this to running

    try {
      await replSet.start();
      fail('Expected "start" to throw');
    } catch (err) {
      clearTimeout(timeout);
      expect(err.message).toEqual('Already in "init" or "running" state. Use debug for more info.');
    }
  });

  it('start an replset with instanceOpts', async () => {
    const replSet = new MongoMemoryReplSet({ instanceOpts: [{ args: ['--quiet'] }] });
    await replSet.start();

    expect(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      replSet.servers[0].opts.instance!.args!.findIndex((x) => x === '--quiet') > -1
    ).toBeTruthy();

    await replSet.stop();
  });

  it('"waitUntilRunning" should return if state is "running"', async () => {
    const replSet = new MongoMemoryReplSet();
    const spy = jest.spyOn(replSet, 'once');
    // @ts-expect-error
    replSet._state = MongoMemoryReplSetStateEnum.running; // artificially set this to running to not actually have to start an server (test-speedup)

    await replSet.waitUntilRunning();

    expect(spy.mock.calls.length).toEqual(0);
  });

  it('"_initReplSet" should throw an error if _state is not "init"', async () => {
    const replSet = new MongoMemoryReplSet();
    const timeout = setTimeout(() => {
      fail('Timeout - Expected "_initReplSet" to throw');
    }, 100);

    // this case can normally happen if "start" is called again, without either an error or "stop" happened
    // @ts-expect-error
    replSet._state = MongoMemoryReplSetStateEnum.running; // artificially set this to running

    try {
      // @ts-expect-error
      await replSet._initReplSet();
      fail('Expected "_initReplSet" to throw');
    } catch (err) {
      clearTimeout(timeout);
      expect(err.message).toEqual('Not in init phase.');
    }
  });

  it('"_initReplSet" should throw if server count is 0 or less', async () => {
    const replSet = new MongoMemoryReplSet();
    const timeout = setTimeout(() => {
      fail('Timeout - Expected "_initReplSet" to throw');
    }, 100);

    // @ts-expect-error
    replSet._state = MongoMemoryReplSetStateEnum.init; // artificially set this to init

    try {
      // @ts-expect-error
      await replSet._initReplSet();
      fail('Expected "_initReplSet" to throw');
    } catch (err) {
      clearTimeout(timeout);
      expect(err.message).toEqual('One or more servers are required.');
    }
  });
});
