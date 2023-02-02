/* eslint-disable @typescript-eslint/no-non-null-assertion */
import MongoMemoryReplSet, {
  MongoMemoryReplSetEvents,
  MongoMemoryReplSetStates,
} from '../MongoMemoryReplSet';
import { MongoClient, MongoServerError } from 'mongodb';
import MongoMemoryServer, { AutomaticAuth } from '../MongoMemoryServer';
import * as utils from '../util/utils';
import MongoInstance, { MongoMemoryInstanceOpts } from '../util/MongoInstance';
import { ReplsetCountLowError, StateError, WaitForPrimaryTimeoutError } from '../util/errors';
import { assertIsError } from './testUtils/test_utils';
import * as debug from 'debug';

jest.setTimeout(100000); // 10s

afterEach(() => {
  jest.restoreAllMocks();
  debug.disable();
});

describe('single server replset', () => {
  it('should enter running state', async () => {
    const replSet = await MongoMemoryReplSet.create();
    expect(replSet.getUri().split(',').length).toEqual(1);

    await replSet.stop();
  });

  it('"getUri" should be able to get connection string to specific db', async () => {
    const replSet = await MongoMemoryReplSet.create();
    const uri = replSet.getUri('other');
    expect(uri.split(',').length).toEqual(1);
    expect(uri.includes('/other')).toBeTruthy();
    expect(uri.includes('replicaSet=testset')).toBeTruthy();

    await replSet.stop();
  });

  it('"getUri" should be able to generate an dbName', async () => {
    jest.spyOn(utils, 'generateDbName');
    const replSet = await MongoMemoryReplSet.create();
    const port = replSet.servers[0].instanceInfo?.port;
    const uri = replSet.getUri();
    expect(uri).toEqual(`mongodb://127.0.0.1:${port}/?replicaSet=testset`);
    expect(uri.split(',').length).toEqual(1);
    expect(utils.generateDbName).toHaveBeenCalledTimes(4); // once in "new MongoMemoryReplSet" (setter), once in "_startUpInstance", once in getUri

    await replSet.stop();
  });

  it('should be able to get dbName', async () => {
    const replSet = new MongoMemoryReplSet({ replSet: { dbName: 'static' } });
    expect(replSet.replSetOpts.dbName).toEqual('static');

    await replSet.stop();
  });

  it('should be possible to connect replicaset after waitUntilRunning resolves', async () => {
    const replSet = new MongoMemoryReplSet();
    // @ts-expect-error because "_state" is protected
    replSet._state = MongoMemoryReplSetStates.init;
    const promise = replSet.waitUntilRunning();
    // @ts-expect-error because "_state" is protected
    replSet._state = MongoMemoryReplSetStates.stopped;
    replSet.start();

    await promise;

    const con = await MongoClient.connect(replSet.getUri(), {});

    await con.close();
    await replSet.stop();
  });

  it('"new" should throw an error if replSet count is 0 or less', () => {
    try {
      new MongoMemoryReplSet({ replSet: { count: 0 } });
      fail('Expected "new MongoMemoryReplSet" to throw an error');
    } catch (err) {
      expect(err).toBeInstanceOf(ReplsetCountLowError);
      expect(err).toHaveProperty('count', 0);
      assertIsError(err);
      expect(err.message).toMatchSnapshot();
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
      expect(err).toBeInstanceOf(StateError);
      assertIsError(err);
      expect(err.message).toMatchSnapshot();
    }
  });

  it('"getUri" should throw an error if _state is not "running" or "init"', async () => {
    const replSet = new MongoMemoryReplSet();
    const timeout = setTimeout(() => {
      fail('Timeout - Expected "getUri" to throw');
    }, 100);

    // @ts-expect-error because "_state" is protected
    replSet._state = MongoMemoryReplSetStates.init;
    replSet.getUri();
    // @ts-expect-error because "_state" is protected
    replSet._state = MongoMemoryReplSetStates.running;
    replSet.getUri();
    // @ts-expect-error because "_state" is protected
    replSet._state = MongoMemoryReplSetStates.stopped;

    try {
      replSet.getUri();
      fail('Expected "getUri" to throw');
    } catch (err) {
      clearTimeout(timeout);
      expect(err).toBeInstanceOf(StateError);
      assertIsError(err);
      expect(err.message).toMatchSnapshot();
    }
  });

  it('"getUri" should return "otherIp" if set', async () => {
    const replSet = await MongoMemoryReplSet.create();
    const uri = replSet.getUri(undefined, '0.0.0.0');
    expect(uri.split(',').length).toEqual(1);
    expect(uri.includes('replicaSet=testset')).toBeTruthy();
    expect(uri.includes('0.0.0.0')).toBeTruthy();
    expect(uri.includes('127.0.0.1')).toBeFalsy();

    await replSet.stop();
  });

  it('"start" should throw an error if _state is not "stopped"', async () => {
    const replSet = new MongoMemoryReplSet();
    const timeout = setTimeout(() => {
      fail('Timeout - Expected "start" to throw');
    }, 100);

    // this case can normally happen if "start" is called again, without either an error or "stop" happened
    // @ts-expect-error because "_state" is protected
    replSet._state = MongoMemoryReplSetStates.running; // artificially set this to running

    try {
      await replSet.start();
      fail('Expected "start" to throw');
    } catch (err) {
      clearTimeout(timeout);
      expect(err).toBeInstanceOf(StateError);
      assertIsError(err);
      expect(err.message).toMatchSnapshot();
    }
  });

  it('start an replset with instanceOpts', async () => {
    const replSet = new MongoMemoryReplSet({
      instanceOpts: [
        {
          args: ['--quiet'],
          replicaMemberConfig: {
            priority: 2,
          },
        },
      ],
    });
    await replSet.start();

    expect(
      replSet.servers[0].opts.instance!.args!.findIndex((x) => x === '--quiet') > -1
    ).toBeTruthy();
    expect(replSet.servers[0].opts.instance?.replicaMemberConfig?.priority).toBe(2);

    await replSet.stop();
  });

  it('"waitUntilRunning" should return if state is "running"', async () => {
    const replSet = new MongoMemoryReplSet();
    jest.spyOn(replSet, 'once');
    // @ts-expect-error because "_state" is protected
    replSet._state = MongoMemoryReplSetStates.running; // artificially set this to running to not actually have to start an server (test-speedup)

    await replSet.waitUntilRunning();

    expect(replSet.once).not.toHaveBeenCalled();
  });

  it('"_initReplSet" should throw an error if _state is not "init"', async () => {
    const replSet = new MongoMemoryReplSet();
    const timeout = setTimeout(() => {
      fail('Timeout - Expected "_initReplSet" to throw');
    }, 100);

    // this case can normally happen if "start" is called again, without either an error or "stop" happened
    // @ts-expect-error because "_state" is protected
    replSet._state = MongoMemoryReplSetStates.running; // artificially set this to running

    try {
      // @ts-expect-error because "_initReplSet" is protected
      await replSet._initReplSet();
      fail('Expected "_initReplSet" to throw');
    } catch (err) {
      clearTimeout(timeout);
      expect(err).toBeInstanceOf(StateError);
      assertIsError(err);
      expect(err.message).toMatchSnapshot();
    }
  });

  it('"_initReplSet" should throw if server count is 0 or less', async () => {
    const replSet = new MongoMemoryReplSet();
    const timeout = setTimeout(() => {
      fail('Timeout - Expected "_initReplSet" to throw');
    }, 100);

    // @ts-expect-error because "_state" is protected
    replSet._state = MongoMemoryReplSetStates.init; // artificially set this to init

    try {
      // @ts-expect-error because "_initReplSet" is protected
      await replSet._initReplSet();
      fail('Expected "_initReplSet" to throw');
    } catch (err) {
      clearTimeout(timeout);
      assertIsError(err);
      expect(err.message).toMatchSnapshot();
    }
  });

  it('should make use of "AutomaticAuth" (ephemeralForTest)', async () => {
    // @ts-expect-error because "initAllServers" is protected
    jest.spyOn(MongoMemoryReplSet.prototype, 'initAllServers');
    jest.spyOn(console, 'warn').mockImplementationOnce(() => void 0);
    const replSet = await MongoMemoryReplSet.create({
      replSet: { auth: {}, count: 3, storageEngine: 'ephemeralForTest' },
    });

    utils.assertion(!utils.isNullOrUndefined(replSet.replSetOpts.auth));
    utils.assertion(typeof replSet.replSetOpts.auth === 'object');

    utils.assertion(!utils.isNullOrUndefined(replSet.replSetOpts.auth.customRootName));
    utils.assertion(!utils.isNullOrUndefined(replSet.replSetOpts.auth.customRootPwd));

    // test unpriviliged connection
    {
      const con = await MongoClient.connect(replSet.getUri());

      const db = con.db('somedb');
      const col = db.collection('somecol');

      try {
        await col.insertOne({ test: 1 });
        fail('Expected insertion to fail');
      } catch (err) {
        expect(err).toBeInstanceOf(MongoServerError);
        expect((err as MongoServerError).codeName).toEqual('Unauthorized');
      } finally {
        await con.close();
      }
    }

    // test priviliged connection
    {
      const con: MongoClient = await MongoClient.connect(replSet.getUri(), {
        authSource: 'admin',
        authMechanism: 'SCRAM-SHA-256',
        auth: {
          username: replSet.replSetOpts.auth.customRootName,
          password: replSet.replSetOpts.auth.customRootPwd,
        },
      });

      const admindb = con.db('admin');
      const users: { users?: { user: string }[] } = await admindb.command({
        usersInfo: replSet.replSetOpts.auth.customRootName,
      });
      expect(users.users).toHaveLength(1);
      expect(users.users?.[0].user).toEqual(replSet.replSetOpts.auth.customRootName);

      const db = con.db('somedb');
      const col = db.collection('somecol');

      expect(await col.insertOne({ test: 1 })).toHaveProperty('acknowledged', true);

      await con.close();
    }

    // @ts-expect-error because "initAllServers" is protected
    expect(MongoMemoryReplSet.prototype.initAllServers).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledTimes(0);

    {
      expect(replSet.servers[0].instanceInfo?.instance.instanceOpts.auth).toStrictEqual(true);
      expect(replSet.servers[1].instanceInfo?.instance.instanceOpts.auth).toStrictEqual(true);
      expect(replSet.servers[2].instanceInfo?.instance.instanceOpts.auth).toStrictEqual(true);
    }

    await replSet.stop();
  });

  it('should make use of "AutomaticAuth" (wiredTiger)', async () => {
    // @ts-expect-error because "initAllServers" is protected
    jest.spyOn(MongoMemoryReplSet.prototype, 'initAllServers');
    jest.spyOn(console, 'warn').mockImplementationOnce(() => void 0);
    const replSet = await MongoMemoryReplSet.create({
      replSet: { auth: {}, count: 3, storageEngine: 'wiredTiger' },
    });

    async function testConnections() {
      utils.assertion(!utils.isNullOrUndefined(replSet.replSetOpts.auth));
      utils.assertion(typeof replSet.replSetOpts.auth === 'object');

      utils.assertion(!utils.isNullOrUndefined(replSet.replSetOpts.auth.customRootName));
      utils.assertion(!utils.isNullOrUndefined(replSet.replSetOpts.auth.customRootPwd));

      // test unpriviliged connection
      {
        const con = await MongoClient.connect(replSet.getUri());

        const db = con.db('somedb');
        const col = db.collection('somecol');

        try {
          await col.insertOne({ test: 1 });
          fail('Expected insertion to fail');
        } catch (err) {
          expect(err).toBeInstanceOf(MongoServerError);
          expect((err as MongoServerError).codeName).toEqual('Unauthorized');
        } finally {
          await con.close();
        }
      }

      // test priviliged connection
      {
        const con: MongoClient = await MongoClient.connect(replSet.getUri(), {
          authSource: 'admin',
          authMechanism: 'SCRAM-SHA-256',
          auth: {
            username: replSet.replSetOpts.auth.customRootName,
            password: replSet.replSetOpts.auth.customRootPwd,
          },
        });

        const admindb = con.db('admin');
        const users: { users?: { user: string }[] } = await admindb.command({
          usersInfo: replSet.replSetOpts.auth.customRootName,
        });
        expect(users.users).toHaveLength(1);
        expect(users.users?.[0].user).toEqual(replSet.replSetOpts.auth.customRootName);

        const db = con.db('somedb');
        const col = db.collection('somecol');

        expect(await col.insertOne({ test: 1 })).toHaveProperty('acknowledged', true);

        await con.close();
      }
    }

    await testConnections();

    // @ts-expect-error because "initAllServers" is protected
    expect(MongoMemoryReplSet.prototype.initAllServers).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledTimes(0);

    {
      expect(replSet.servers[0].instanceInfo?.instance.instanceOpts.auth).toStrictEqual(true);
      expect(replSet.servers[1].instanceInfo?.instance.instanceOpts.auth).toStrictEqual(true);
      expect(replSet.servers[2].instanceInfo?.instance.instanceOpts.auth).toStrictEqual(true);
    }

    await replSet.stop({ doCleanup: false });

    // test restart for "_ranCreateAuth" restart testing
    await replSet.start();

    await testConnections();

    await replSet.stop();
  });
});

describe('MongoMemoryReplSet', () => {
  describe('getters & setters', () => {
    let replSet: MongoMemoryReplSet;
    beforeEach(() => {
      replSet = new MongoMemoryReplSet();
    });
    it('"get state" should match "_state"', () => {
      // @ts-expect-error because "_state" is protected
      expect(replSet.state).toEqual(replSet._state);
      expect(replSet.state).toEqual(MongoMemoryReplSetStates.stopped);
      // @ts-expect-error because "_state" is protected
      replSet._state = MongoMemoryReplSetStates.init;
      // @ts-expect-error because "_state" is protected
      expect(replSet.state).toEqual(replSet._state);
      expect(replSet.state).toEqual(MongoMemoryReplSetStates.init);
    });

    it('"binaryOpts" should match "_binaryOpts"', () => {
      // @ts-expect-error because "_binaryOpts" is protected
      expect(replSet.binaryOpts).toEqual(replSet._binaryOpts);
      expect(replSet.binaryOpts).toEqual({});
      replSet.binaryOpts = { arch: 'x86_64' };
      // @ts-expect-error because "_binaryOpts" is protected
      expect(replSet.binaryOpts).toEqual(replSet._binaryOpts);
      expect(replSet.binaryOpts).toEqual({ arch: 'x86_64' });
    });

    it('"instanceOpts" should match "_instanceOpts"', () => {
      // @ts-expect-error because "_instanceOpts" is protected
      expect(replSet.instanceOpts).toEqual(replSet._instanceOpts);
      expect(replSet.instanceOpts).toEqual([]);
      replSet.instanceOpts = [{ port: 1001 }];
      // @ts-expect-error because "_instanceOpts" is protected
      expect(replSet.instanceOpts).toEqual(replSet._instanceOpts);
      expect(replSet.instanceOpts).toEqual([{ port: 1001 }]);
      expect(replSet.instanceOpts).toHaveLength(1);
    });

    it('"replSetOpts" should match "_replSetOpts"', () => {
      // @ts-expect-error because "_replSetOpts" is protected
      expect(replSet.replSetOpts).toEqual(replSet._replSetOpts);
      expect(replSet.replSetOpts).toEqual({
        auth: { disable: true },
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
      // @ts-expect-error because "_replSetOpts" is protected
      expect(replSet.replSetOpts).toEqual(replSet._replSetOpts);
      const authDefault = utils.authDefault(replSet.replSetOpts.auth as AutomaticAuth);
      expect(replSet.replSetOpts).toEqual({
        auth: { ...authDefault, disable: false },
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
        // @ts-expect-error because "_state" is protected
        replSet._state = MongoMemoryReplSetStates.init;
      });
      it('setter of "binaryOpts" should throw an error if state is not "stopped"', () => {
        try {
          replSet.binaryOpts = {};
          fail('Expected assignment of "replSet.binaryOpts" to fail');
        } catch (err) {
          expect(err).toBeInstanceOf(StateError);
          assertIsError(err);
          expect(err.message).toMatchSnapshot();
        }
      });

      it('setter of "instanceOpts" should throw an error if state is not "stopped"', () => {
        try {
          replSet.instanceOpts = [];
          fail('Expected assignment of "replSet.instanceOpts" to fail');
        } catch (err) {
          expect(err).toBeInstanceOf(StateError);
          assertIsError(err);
          expect(err.message).toMatchSnapshot();
        }
      });

      it('setter of "replSetOpts" should throw an error if state is not "stopped"', () => {
        try {
          replSet.replSetOpts = {};
          fail('Expected assignment of "replSet.instanceOpts" to fail');
        } catch (err) {
          expect(err).toBeInstanceOf(StateError);
          assertIsError(err);
          expect(err.message).toMatchSnapshot();
        }
      });
    });

    it('setter of "replSetOpts" should throw an error if count is 1 or above', () => {
      try {
        replSet.replSetOpts = { count: 0 };
        fail('Expected assignment of "replSet.instanceOpts" to fail');
      } catch (err) {
        expect(err).toBeInstanceOf(ReplsetCountLowError);
        expect(err).toHaveProperty('count', 0);
        assertIsError(err);
        expect(err.message).toMatchSnapshot();
      }
    });
  });

  it('"stop" should return "false" if an error got thrown', async () => {
    // this test creates an mock-instance, so that no actual instance gets started
    const replSet = new MongoMemoryReplSet();
    // @ts-expect-error because "_state" is protected
    replSet._state = MongoMemoryReplSetStates.running;
    const instance = new MongoMemoryServer();
    jest.spyOn(instance, 'stop').mockRejectedValueOnce(new Error('Some Error'));
    replSet.servers = [instance];

    expect(await replSet.stop()).toEqual(false);
    expect(instance.stop).toBeCalledTimes(1);
  });

  it('"_waitForPrimary" should throw an error if timeout is reached', async () => {
    const replSet = new MongoMemoryReplSet();

    try {
      // @ts-expect-error because "_waitForPrimary" is protected
      await replSet._waitForPrimary(1); // 1ms to be fast (0 and 1 are equal for "setTimeout" in js)
      fail('Expected "_waitForPrimary" to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(WaitForPrimaryTimeoutError);
      expect(JSON.stringify(err)).toMatchSnapshot(); // this is to test all the custom values on the error
    }
  });

  it('"getInstanceOpts" should return "storageEngine" if in baseOpts', () => {
    const replSet = new MongoMemoryReplSet();

    expect(
      // @ts-expect-error because "getInstanceOpts" is protected
      replSet.getInstanceOpts({ storageEngine: 'wiredTiger' })
    ).toMatchObject<MongoMemoryInstanceOpts>({
      // this is needed, otherwise no ts error when "storageEngine" might get changed
      storageEngine: 'wiredTiger',
    });
  });

  describe('.stop()', () => {
    it('should call cleanup by default', async () => {
      const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });

      const cleanupSpy = jest.spyOn(replSet, 'cleanup');
      const cleanupInstance0Spy = jest
        .spyOn(replSet.servers[0], 'cleanup')
        .mockResolvedValue(void 0);

      await replSet.stop();

      expect(cleanupSpy).toHaveBeenCalledWith({ doCleanup: true, force: false } as utils.Cleanup);
      expect(cleanupInstance0Spy).toHaveBeenCalledWith({
        doCleanup: true,
        force: false,
      } as utils.Cleanup);
    });

    it('should call cleanup with mapped boolean', async () => {
      const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });

      const cleanupSpy = jest.spyOn(replSet, 'cleanup');
      const cleanupInstance0Spy = jest
        .spyOn(replSet.servers[0], 'cleanup')
        .mockResolvedValue(void 0);

      await replSet.stop(false);

      expect(cleanupSpy).not.toHaveBeenCalled();
      expect(cleanupInstance0Spy).not.toHaveBeenCalled();

      cleanupInstance0Spy.mockClear();
      cleanupSpy.mockClear();

      await replSet.stop(true);

      expect(cleanupSpy).toHaveBeenCalledWith({ doCleanup: true, force: false } as utils.Cleanup);
      expect(cleanupInstance0Spy).toHaveBeenCalledWith({
        doCleanup: true,
        force: false,
      } as utils.Cleanup);
    });

    it('should call cleanup and pass-through cleanup options', async () => {
      const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });

      const cleanupSpy = jest.spyOn(replSet, 'cleanup');
      const cleanupInstance0Spy = jest
        .spyOn(replSet.servers[0], 'cleanup')
        .mockResolvedValue(void 0);

      await replSet.stop({ doCleanup: false, force: false });

      expect(cleanupSpy).not.toHaveBeenCalled();
      expect(cleanupInstance0Spy).not.toHaveBeenCalled();

      cleanupInstance0Spy.mockClear();
      cleanupSpy.mockClear();

      await replSet.stop({ doCleanup: true, force: true });

      expect(cleanupSpy).toHaveBeenCalledWith({ doCleanup: true, force: true } as utils.Cleanup);
      expect(cleanupInstance0Spy).toHaveBeenCalledWith({
        doCleanup: true,
        force: true,
      } as utils.Cleanup);
    });
  });

  describe('.cleanup()', () => {
    it('should run cleanup with defaults', async () => {
      const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });

      const cleanupSpy = jest.spyOn(replSet, 'cleanup');
      const cleanupInstance0Spy = jest
        .spyOn(replSet.servers[0], 'cleanup')
        .mockResolvedValue(void 0);

      await replSet.stop({ doCleanup: false });
      await replSet.cleanup();

      expect(cleanupSpy).toHaveBeenCalledWith();
      expect(cleanupInstance0Spy).toHaveBeenCalledWith({
        doCleanup: true,
        force: false,
      } as utils.Cleanup);
    });

    it('should run cleanup with boolean', async () => {
      const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });

      const cleanupSpy = jest.spyOn(replSet, 'cleanup');
      const cleanupInstance0Spy = jest
        .spyOn(replSet.servers[0], 'cleanup')
        .mockResolvedValue(void 0);

      await replSet.stop({ doCleanup: false });
      await replSet.cleanup(false);

      expect(cleanupSpy).toHaveBeenCalledWith(false);
      expect(cleanupInstance0Spy).toHaveBeenCalledWith({
        doCleanup: true,
        force: false,
      } as utils.Cleanup);

      cleanupSpy.mockClear();

      await replSet.start();

      const cleanupInstance1Spy = jest
        .spyOn(replSet.servers[0], 'cleanup')
        .mockResolvedValue(void 0);

      await replSet.stop({ doCleanup: false });
      await replSet.cleanup(true);
      expect(cleanupInstance1Spy).toHaveBeenCalledWith({
        doCleanup: true,
        force: true,
      } as utils.Cleanup);
    });

    it('should run cleanup with cleanup options and pass-through options to lower', async () => {
      const replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });

      const cleanupSpy = jest.spyOn(replSet, 'cleanup');
      const cleanupInstance0Spy = jest
        .spyOn(replSet.servers[0], 'cleanup')
        .mockResolvedValue(void 0);

      await replSet.stop({ doCleanup: false });
      await replSet.cleanup({ doCleanup: true, force: true });

      expect(cleanupSpy).toHaveBeenCalledWith({ doCleanup: true, force: true } as utils.Cleanup);
      expect(cleanupInstance0Spy).toHaveBeenCalledWith({
        doCleanup: true,
        force: true,
      } as utils.Cleanup);
    });
  });

  it('"waitUntilRunning" should clear stateChange listener', async () => {
    const replSet = new MongoMemoryReplSet();
    // @ts-expect-error because "_state" is protected
    replSet._state = MongoMemoryReplSetStates.init;
    const promise = replSet.waitUntilRunning();
    await utils.ensureAsync(); // ensure that "waitUntilRunning" has executed and setup the listener
    // @ts-expect-error because "_state" is protected
    replSet._state = MongoMemoryReplSetStates.stopped;

    expect(replSet.listeners(MongoMemoryReplSetEvents.stateChange).length).toEqual(1);

    replSet.start();

    await promise;

    expect(replSet.listeners(MongoMemoryReplSetEvents.stateChange).length).toEqual(0);

    await replSet.stop();
  });

  it('should transfer "launchTimeout" option to the MongoInstance', async () => {
    jest.spyOn(MongoInstance.prototype, 'start').mockImplementation(
      // @ts-expect-error This can work, because the instance is not used in the function that is tested here, beyond setting some extra options
      () => Promise.resolve({})
    );

    const replSet = new MongoMemoryReplSet({ instanceOpts: [{ launchTimeout: 2000 }] });

    // @ts-expect-error "initAllServers" is protected
    await replSet.initAllServers();

    // @ts-expect-error "_instanceInfo" is protected
    const instanceInfo = replSet.servers[0]._instanceInfo;
    expect(instanceInfo).toBeDefined();
    utils.assertion(!utils.isNullOrUndefined(instanceInfo));
    expect(instanceInfo.instance).toBeDefined();
    expect(instanceInfo?.launchTimeout).toStrictEqual(2000);
  });
});
