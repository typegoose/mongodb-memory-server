/* eslint-disable @typescript-eslint/ban-ts-comment */
import MongoMemoryReplSet, { MongoMemoryReplSetStateEnum } from '../MongoMemoryReplSet';
import { MongoClient } from 'mongodb';
import MongoMemoryServer from '../MongoMemoryServer';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

describe('single server replset', () => {
  it('should enter running state', async () => {
    const replSet = await MongoMemoryReplSet.create();
    expect(replSet.getUri().split(',').length).toEqual(1);

    await replSet.stop();
  });

  it('should be able to get connection string to specific db', async () => {
    const replSet = await MongoMemoryReplSet.create();
    const uri = replSet.getUri('other');
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
    const replSet = new MongoMemoryReplSet();
    // @ts-expect-error
    replSet._state = MongoMemoryReplSetStateEnum.init;
    const promise = replSet.waitUntilRunning();
    // @ts-expect-error
    replSet._state = MongoMemoryReplSetStateEnum.stopped;
    replSet.start();

    await promise;

    const con = await MongoClient.connect(replSet.getUri(), {
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

  it('"getUri" should throw an error if _state is not "running" (state = "stopped")', async () => {
    const replSet = new MongoMemoryReplSet();
    const timeout = setTimeout(() => {
      fail('Timeout - Expected "getUri" to throw');
    }, 100);

    try {
      replSet.getUri();
      fail('Expected "getUri" to throw');
    } catch (err) {
      clearTimeout(timeout);
      expect(err.message).toEqual('Replica Set is not running. Use debug for more info.');
    }
  });

  it('"getUri" should throw an error if _state is not "running" (state = "stopped")', async () => {
    const replSet = new MongoMemoryReplSet();
    // @ts-expect-error
    replSet._state = MongoMemoryReplSetStateEnum.init;
    const timeout = setTimeout(() => {
      fail('Timeout - Expected "getUri" to throw');
    }, 100);

    try {
      replSet.getUri();
      fail('Expected "getUri" to throw');
    } catch (err) {
      clearTimeout(timeout);
      expect(err.message).toEqual('Replica Set is not running. Use debug for more info.');
    }
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

describe('MongoMemoryReplSet', () => {
  describe('getters & setters', () => {
    let replSet: MongoMemoryReplSet;
    beforeEach(() => {
      replSet = new MongoMemoryReplSet();
    });
    afterAll(async () => {
      // to clean up event listeners
      await replSet.stop();
    });
    it('"get state" should match "_state"', () => {
      // @ts-expect-error
      expect(replSet.state).toEqual(replSet._state);
      expect(replSet.state).toEqual(MongoMemoryReplSetStateEnum.stopped);
      // @ts-expect-error
      replSet._state = MongoMemoryReplSetStateEnum.init;
      // @ts-expect-error
      expect(replSet.state).toEqual(replSet._state);
      expect(replSet.state).toEqual(MongoMemoryReplSetStateEnum.init);
    });

    it('"binaryOpts" should match "_binaryOpts"', () => {
      // @ts-expect-error
      expect(replSet.binaryOpts).toEqual(replSet._binaryOpts);
      expect(replSet.binaryOpts).toEqual({});
      replSet.binaryOpts = { arch: 'x86_64' };
      // @ts-expect-error
      expect(replSet.binaryOpts).toEqual(replSet._binaryOpts);
      expect(replSet.binaryOpts).toEqual({ arch: 'x86_64' });
    });

    it('"instanceOpts" should match "_instanceOpts"', () => {
      // @ts-expect-error
      expect(replSet.instanceOpts).toEqual(replSet._instanceOpts);
      expect(replSet.instanceOpts).toEqual([]);
      replSet.instanceOpts = [{ port: 1001 }];
      // @ts-expect-error
      expect(replSet.instanceOpts).toEqual(replSet._instanceOpts);
      expect(replSet.instanceOpts).toEqual([{ port: 1001 }]);
      expect(replSet.instanceOpts).toHaveLength(1);
    });

    it('"replSetOpts" should match "_replSetOpts"', () => {
      // @ts-expect-error
      expect(replSet.replSetOpts).toEqual(replSet._replSetOpts);
      expect(replSet.replSetOpts).toEqual({
        auth: false,
        args: [],
        name: 'testset',
        count: 1,
        dbName: replSet.replSetOpts.dbName, // not testing this value, because its generated "randomly"
        ip: '127.0.0.1',
        spawn: {},
        storageEngine: 'ephemeralForTest',
        configSettings: {},
      });
      replSet.replSetOpts = { auth: true };
      // @ts-expect-error
      expect(replSet.replSetOpts).toEqual(replSet._replSetOpts);
      expect(replSet.replSetOpts).toEqual({
        auth: true,
        args: [],
        name: 'testset',
        count: 1,
        dbName: replSet.replSetOpts.dbName, // not testing this value, because its generated "randomly"
        ip: '127.0.0.1',
        spawn: {},
        storageEngine: 'ephemeralForTest',
        configSettings: {},
      });
    });

    describe('state errors', () => {
      beforeEach(() => {
        // @ts-expect-error
        replSet._state = MongoMemoryReplSetStateEnum.init;
      });
      it('setter of "binaryOpts" should throw an error if state is not "stopped"', () => {
        try {
          replSet.binaryOpts = {};
          fail('Expected assignment of "replSet.binaryOpts" to fail');
        } catch (err) {
          expect(err.message).toEqual(
            'Cannot change binary Options while "state" is not "stopped"!'
          );
        }
      });

      it('setter of "instanceOpts" should throw an error if state is not "stopped"', () => {
        try {
          replSet.instanceOpts = [];
          fail('Expected assignment of "replSet.instanceOpts" to fail');
        } catch (err) {
          expect(err.message).toEqual(
            'Cannot change instance Options while "state" is not "stopped"!'
          );
        }
      });

      it('setter of "replSetOpts" should throw an error if state is not "stopped"', () => {
        try {
          replSet.replSetOpts = {};
          fail('Expected assignment of "replSet.instanceOpts" to fail');
        } catch (err) {
          expect(err.message).toEqual(
            'Cannot change replSet Options while "state" is not "stopped"!'
          );
        }
      });
    });

    it('setter of "replSetOpts" should throw an error if count is 1 or above', () => {
      try {
        replSet.replSetOpts = { count: 0 };
        fail('Expected assignment of "replSet.instanceOpts" to fail');
      } catch (err) {
        expect(err.message).toEqual('ReplSet Count needs to be 1 or higher!');
      }
    });
  });

  it('"stop" should return "false" if an error got thrown', async () => {
    // this test creates an mock-instance, so that no actual instance gets started
    const replSet = new MongoMemoryReplSet();
    // @ts-expect-error
    replSet._state = MongoMemoryReplSetStateEnum.running;
    const instance = new MongoMemoryServer();
    jest.spyOn(instance, 'stop').mockRejectedValueOnce(new Error('Some Error'));
    replSet.servers = [instance];

    expect(await replSet.stop()).toEqual(false);
    expect(instance.stop).toBeCalledTimes(1);
  });

  it('"_waitForPrimary" should throw an error if timeout is reached', async () => {
    const replSet = new MongoMemoryReplSet();

    try {
      // @ts-expect-error
      await replSet._waitForPrimary(1); // 1ms to be fast (0 and 1 are equal for "setTimeout" in js)
      fail('Expected "_waitForPrimary" to throw');
    } catch (err) {
      expect(err.message).toEqual('Timed out after 1ms while waiting for an Primary');
    }
  });
});
