/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MongoClient } from 'mongodb';
import * as tmp from 'tmp';
import MongoMemoryServer, {
  MongoInstanceData,
  MongoMemoryServerEvents,
  MongoMemoryServerStates,
} from '../MongoMemoryServer';
import MongoInstance from '../util/MongoInstance';
import * as utils from '../util/utils';
import * as semver from 'semver';
import { StateError } from '../util/errors';

tmp.setGracefulCleanup();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

afterEach(() => {
  jest.restoreAllMocks();
});

describe('MongoMemoryServer', () => {
  describe('start()', () => {
    it('should resolve to true if an MongoInstanceData is resolved by _startUpInstance', async () => {
      const mongoServer = new MongoMemoryServer();
      jest
        .spyOn(mongoServer, '_startUpInstance')
        // @ts-expect-error expect an error here rather than an "as any"
        .mockImplementationOnce(() => Promise.resolve({}));

      expect(mongoServer._startUpInstance).not.toHaveBeenCalled();

      await expect(mongoServer.start()).resolves.toEqual(true);

      expect(mongoServer._startUpInstance).toHaveBeenCalledTimes(1);
    });

    it('"_startUpInstance" should use an different port if address is already in use (use same port for 2 servers)', async () => {
      const mongoServer1 = await MongoMemoryServer.create({
        instance: { port: 27444 },
      });

      const mongoServer2 = await MongoMemoryServer.create({
        instance: { port: mongoServer1.instanceInfo!.port },
      });

      expect(mongoServer1.instanceInfo).toBeDefined();
      expect(mongoServer2.instanceInfo).toBeDefined();
      expect(mongoServer1.instanceInfo!.port).not.toEqual(mongoServer2.instanceInfo!.port);

      await mongoServer1.stop();
      await mongoServer2.stop();
    });

    it('should throw an error if _startUpInstance throws an unknown error', async () => {
      jest.spyOn(console, 'warn').mockImplementationOnce(() => void 0);

      const mongoServer = new MongoMemoryServer({
        instance: {
          port: 123,
        },
      });

      jest.spyOn(mongoServer, '_startUpInstance').mockRejectedValueOnce(new Error('unknown error'));

      await expect(mongoServer.start()).rejects.toThrow('unknown error');

      expect(mongoServer.state).toStrictEqual(MongoMemoryServerStates.stopped);
      expect(mongoServer._startUpInstance).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it('should make use of "AutomaticAuth" (ephemeralForTest)', async () => {
      jest.spyOn(MongoInstance.prototype, 'start');
      jest.spyOn(console, 'warn').mockImplementationOnce(() => void 0);
      const mongoServer = await MongoMemoryServer.create({
        auth: {},
        instance: {
          auth: true,
          storageEngine: 'ephemeralForTest',
        },
      });

      utils.assertion(!utils.isNullOrUndefined(mongoServer.instanceInfo));
      utils.assertion(!utils.isNullOrUndefined(mongoServer.auth));

      const con: MongoClient = await MongoClient.connect(
        utils.uriTemplate(mongoServer.instanceInfo.ip, mongoServer.instanceInfo.port, 'admin'),
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          authSource: 'admin',
          authMechanism: 'SCRAM-SHA-256',
          auth: {
            user: mongoServer.auth.customRootName,
            password: mongoServer.auth.customRootPwd,
          },
        }
      );
      const db = con.db('admin');
      const users: { users: { user: string }[] } = await db.command({
        usersInfo: mongoServer.auth.customRootName,
      });
      expect(users.users).toHaveLength(1);
      expect(users.users[0].user).toEqual(mongoServer.auth.customRootName);
      expect(MongoInstance.prototype.start).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledTimes(1);

      await con.close();
      await mongoServer.stop();
    });

    it('should make use of "AutomaticAuth" (wiredTiger)', async () => {
      jest.spyOn(MongoInstance.prototype, 'start');
      const mongoServer = await MongoMemoryServer.create({
        auth: {},
        instance: {
          auth: true,
          storageEngine: 'wiredTiger',
        },
      });

      utils.assertion(!utils.isNullOrUndefined(mongoServer.instanceInfo));
      utils.assertion(!utils.isNullOrUndefined(mongoServer.auth));

      const con: MongoClient = await MongoClient.connect(
        utils.uriTemplate(mongoServer.instanceInfo.ip, mongoServer.instanceInfo.port, 'admin'),
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          authSource: 'admin',
          authMechanism: 'SCRAM-SHA-256',
          auth: {
            user: mongoServer.auth.customRootName,
            password: mongoServer.auth.customRootPwd,
          },
        }
      );
      const db = con.db('admin');
      const users: { users: { user: string }[] } = await db.command({
        usersInfo: mongoServer.auth.customRootName,
      });
      expect(users.users).toHaveLength(1);
      expect(users.users[0].user).toEqual(mongoServer.auth.customRootName);
      expect(MongoInstance.prototype.start).toHaveBeenCalledTimes(2);

      await con.close();
      await mongoServer.stop();
    });

    it('should make use of "AutomaticAuth" with extra users (ephemeralForTest)', async () => {
      jest.spyOn(MongoInstance.prototype, 'start');
      jest.spyOn(console, 'warn').mockImplementationOnce(() => void 0);
      const mongoServer = await MongoMemoryServer.create({
        auth: {
          extraUsers: [
            {
              createUser: 'SomeUser',
              pwd: 'hello',
              roles: ['read'],
            },
            {
              createUser: 'SomeOtherUser',
              pwd: 'hello',
              roles: ['readWrite'],
            },
            {
              createUser: 'AdminUser',
              database: 'admin',
              pwd: 'hello',
              roles: ['readWrite'],
            },
            {
              createUser: 'OtherDBUser',
              database: 'otherdb',
              pwd: 'hello',
              roles: ['readWrite'],
            },
          ],
        },
        instance: {
          auth: true,
          storageEngine: 'ephemeralForTest',
        },
      });

      utils.assertion(!utils.isNullOrUndefined(mongoServer.instanceInfo));
      utils.assertion(!utils.isNullOrUndefined(mongoServer.auth));

      const con: MongoClient = await MongoClient.connect(
        utils.uriTemplate(mongoServer.instanceInfo.ip, mongoServer.instanceInfo.port, 'admin'),
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          authSource: 'admin',
          authMechanism: 'SCRAM-SHA-256',
          auth: {
            user: mongoServer.auth.customRootName,
            password: mongoServer.auth.customRootPwd,
          },
        }
      );
      let db = con.db('admin');
      const users: { users: { user: string }[] } = await db.command({
        usersInfo: 1,
      });
      expect(users.users).toHaveLength(4);
      expect(
        users.users.filter((v) => v.user === mongoServer.auth!.customRootName).length > 0
      ).toEqual(true);
      expect(users.users.filter((v) => v.user === 'SomeUser').length > 0).toEqual(true);
      expect(users.users.filter((v) => v.user === 'SomeOtherUser').length > 0).toEqual(true);
      expect(users.users.filter((v) => v.user === 'AdminUser').length > 0).toEqual(true);
      expect(users.users.filter((v) => v.user === 'OtherDBUser').length > 0).toEqual(false);
      db = con.db('otherdb');
      const usersOtherDb: { users: { user: string }[] } = await db.command({
        usersInfo: 1,
      });
      expect(usersOtherDb.users).toHaveLength(1);
      expect(usersOtherDb.users.filter((v) => v.user === 'OtherDBUser').length > 0).toEqual(true);
      expect(MongoInstance.prototype.start).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledTimes(1);

      await con.close();
      await mongoServer.stop();
    });

    it('"createAuth" should not be called if "disabled" is true', async () => {
      jest.spyOn(MongoInstance.prototype, 'start');
      jest.spyOn(MongoMemoryServer.prototype, 'createAuth');
      const mongoServer = await MongoMemoryServer.create({
        auth: {
          disable: true,
        },
        instance: {
          auth: true,
          storageEngine: 'ephemeralForTest',
        },
      });

      utils.assertion(!utils.isNullOrUndefined(mongoServer.instanceInfo));
      utils.assertion(!utils.isNullOrUndefined(mongoServer.auth));

      const con: MongoClient = await MongoClient.connect(
        utils.uriTemplate(mongoServer.instanceInfo.ip, mongoServer.instanceInfo.port, 'admin'),
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
      const db = con.db('admin');
      try {
        await db.command({
          usersInfo: 1,
        });
        fail('Expected "db.command" to fail');
      } catch (err) {
        expect(err.codeName).toEqual('Unauthorized');
      }
      expect(MongoInstance.prototype.start).toHaveBeenCalledTimes(1);
      expect(MongoMemoryServer.prototype.createAuth).not.toHaveBeenCalled();

      await con.close();
      await mongoServer.stop();
    });

    it('should throw an error if state is not "new" or "stopped"', async () => {
      const mongoServer = new MongoMemoryServer();
      // state = starting
      {
        // @ts-expect-error because "_state" is protected
        mongoServer._state = MongoMemoryServerStates.starting;
        try {
          await mongoServer.start();
          fail('Expected "start" to fail');
        } catch (err) {
          expect(err).toBeInstanceOf(StateError);
          expect(err.message).toMatchSnapshot();
        }
      }

      // state = running
      {
        // @ts-expect-error because "_state" is protected
        mongoServer._state = MongoMemoryServerStates.running;
        try {
          await mongoServer.start();
          fail('Expected "start" to fail');
        } catch (err) {
          expect(err).toBeInstanceOf(StateError);
          expect(err.message).toMatchSnapshot();
        }
      }
    });

    it('should throw error on start if there is already a running instance', async () => {
      const mongoServer2 = new MongoMemoryServer();
      // this case can normally happen if "start" is called again
      // @ts-expect-error because "_instanceInfo" is protected
      mongoServer2._instanceInfo = {
        instance: { mongodProcess: {} },
      } as Partial<MongoInstanceData>; // artificially set this to {} to not be undefined anymore
      await expect(mongoServer2.start()).rejects.toThrow(
        'Cannot start because "instance.mongodProcess" is already defined!'
      );
    });
  });

  describe('ensureInstance()', () => {
    it('should throw an error if no "instanceInfo" is defined after calling start', async () => {
      const mongoServer = new MongoMemoryServer();
      jest.spyOn(mongoServer, 'start').mockImplementationOnce(() => Promise.resolve(true));

      await expect(mongoServer.ensureInstance()).rejects.toThrow(
        'Ensure-Instance failed to start an instance!'
      );

      expect(mongoServer.start).toHaveBeenCalledTimes(1);
    });

    it('should return instanceInfo if already running', async () => {
      const mongoServer = await MongoMemoryServer.create();
      jest.spyOn(mongoServer, 'start'); // so it dosnt count the "start" call inside "create"

      expect(await mongoServer.ensureInstance()).toEqual(mongoServer.instanceInfo);
      expect(mongoServer.start).not.toHaveBeenCalled();

      await mongoServer.stop();
    });

    it('should throw an error if "instanceInfo" is undefined but "_state" is "running"', async () => {
      const mongoServer = new MongoMemoryServer();
      // @ts-expect-error because "_state" is protected
      mongoServer._state = MongoMemoryServerStates.running;

      try {
        await mongoServer.ensureInstance();
        fail('Expected "ensureInstance" to throw');
      } catch (err) {
        expect(err.message).toEqual(
          'MongoMemoryServer "_state" is "running" but "instanceInfo" is undefined!'
        );
      }
    });

    it('should throw an error if the given "_state" has no case', async () => {
      const mongoServer = new MongoMemoryServer();
      // @ts-expect-error because "_state" is protected
      mongoServer._state = 'not Existing';

      try {
        await mongoServer.ensureInstance();
        fail('Expected "ensureInstance" to throw');
      } catch (err) {
        expect(err).toBeInstanceOf(StateError);
        expect(err.message).toMatchSnapshot();
      }
    });

    it('should throw an error if state was "starting" and emitted an event but not "running"', async () => {
      const mongoServer = new MongoMemoryServer();
      // @ts-expect-error because "_state" is protected
      mongoServer._state = MongoMemoryServerStates.starting;
      const ensureInstancePromise = mongoServer.ensureInstance();

      mongoServer.emit(MongoMemoryServerEvents.stateChange, MongoMemoryServerStates.stopped);

      expect(ensureInstancePromise).rejects.toThrow(
        `"ensureInstance" waited for "running" but got an different state: "${MongoMemoryServerStates.stopped}"`
      );
    });

    it('should also call "start" and actually start an server', async () => {
      const mongoServer = new MongoMemoryServer();
      jest.spyOn(mongoServer, 'start');

      await mongoServer.ensureInstance();

      expect(mongoServer.start).toHaveBeenCalledTimes(1);
      expect(mongoServer.instanceInfo).toBeDefined();

      await mongoServer.stop();
    });
  });

  describe('stop()', () => {
    it('should start & stop mongod and check output of "getInstanceInfo"', async () => {
      const mongoServer = new MongoMemoryServer({});

      expect(mongoServer.instanceInfo).toBeFalsy();
      mongoServer.start();
      // while mongod launching `getInstanceInfo` is false
      expect(mongoServer.instanceInfo).toBeFalsy(); // isnt this an race-condition?

      // when instance launched then data became avaliable
      await mongoServer.ensureInstance();
      expect(mongoServer.instanceInfo).toBeTruthy();

      // after stop, instance data should be empty
      await mongoServer.stop();
      expect(mongoServer.instanceInfo).toBeFalsy();
    });

    it('should return "true" if no instance was ever running', async () => {
      const mongoServer = new MongoMemoryServer();
      jest.spyOn(utils, 'isNullOrUndefined');

      expect(await mongoServer.stop()).toEqual(false);
      expect(utils.isNullOrUndefined).toHaveBeenCalledTimes(1);
    });

    it('should return "true" if instance is already stopped', async () => {
      const mongoServer = new MongoMemoryServer();
      // @ts-expect-error because "_instanceInfo" is protected
      mongoServer._instanceInfo = {};
      // @ts-expect-error because "_state" is protected
      mongoServer._state = MongoMemoryServerStates.stopped;
      jest.spyOn(utils, 'isNullOrUndefined');
      jest.spyOn(utils, 'assertion');

      expect(await mongoServer.stop()).toEqual(false);
      expect(utils.isNullOrUndefined).toHaveBeenCalledTimes(1);
      expect(utils.assertion).not.toHaveBeenCalled();
    });
  });

  describe('create()', () => {
    it('should create an instance and call ".start"', async () => {
      jest
        .spyOn(MongoMemoryServer.prototype, 'start')
        .mockImplementationOnce(() => Promise.resolve(true));

      await MongoMemoryServer.create();

      expect(MongoMemoryServer.prototype.start).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUri()', () => {
    // this is here to not start 2 servers, when only 1 would be enough
    let mongoServer: MongoMemoryServer;
    beforeAll(async () => {
      mongoServer = await MongoMemoryServer.create({ instance: { dbName: 'hello' } });
    });
    afterAll(async () => {
      if (mongoServer) {
        await mongoServer.stop();
      }
    });

    it('should return correct value with "otherDb" being a string', async () => {
      const port: number = mongoServer.instanceInfo!.port;
      expect(mongoServer.getUri('customDB')).toEqual(`mongodb://127.0.0.1:${port}/customDB`);
    });

    it('should return correct value with "otherDb" being a boolean', async () => {
      const port: number = mongoServer.instanceInfo!.port;
      expect(mongoServer.getUri(true)).not.toEqual(`mongodb://127.0.0.1:${port}/hello`);
    });

    it('should return correct value without "otherDb" being provided', async () => {
      const port: number = mongoServer.instanceInfo!.port;
      const instanceInfo = mongoServer.instanceInfo;
      utils.assertion(instanceInfo, new Error('"MongoServer.instanceInfo" should be defined!'));
      expect(mongoServer.getUri()).toEqual(`mongodb://127.0.0.1:${port}/${instanceInfo.dbName}`);
    });
  });

  describe('cleanup()', () => {
    // "beforeAll" dosnt work here, thanks to the top-level "afterAll" hook
    beforeEach(() => {
      jest.spyOn(utils, 'statPath');
      // @ts-expect-error because "default" dosnt exist in the definitions
      jest.spyOn(semver.default, 'lt'); // it needs to be ".default" otherwise "lt" is only an getter
    });

    it('should properly cleanup with tmpDir', async () => {
      const mongoServer = await MongoMemoryServer.create();
      const dbPath = mongoServer.instanceInfo!.dbPath;
      await mongoServer.stop(false);
      await mongoServer.cleanup();
      expect(utils.statPath).toHaveBeenCalledTimes(0);
      expect(semver.lt).not.toHaveBeenCalled();
      expect(await utils.statPath(dbPath)).toBeUndefined();
      expect(mongoServer.state).toEqual(MongoMemoryServerStates.new);
      expect(mongoServer.instanceInfo).toBeUndefined();
    });

    it('should properly cleanup with tmpDir and re-check with force', async () => {
      const mongoServer = await MongoMemoryServer.create();
      const dbPath = mongoServer.instanceInfo!.dbPath;
      await mongoServer.stop(false);
      await mongoServer.cleanup(true);
      expect(utils.statPath).toHaveBeenCalledTimes(1);
      expect(semver.lt).not.toHaveBeenCalled();
      expect(await utils.statPath(dbPath)).toBeUndefined();
      expect(mongoServer.state).toEqual(MongoMemoryServerStates.new);
      expect(mongoServer.instanceInfo).toBeUndefined();
    });

    it('should properly cleanup with force (without tmpDir)', async () => {
      const tmpDir = tmp.dirSync({ prefix: 'mongo-mem-cleanup-', unsafeCleanup: true });
      const mongoServer = await MongoMemoryServer.create({ instance: { dbPath: tmpDir.name } });
      const dbPath = mongoServer.instanceInfo!.dbPath;
      await mongoServer.stop(false);
      await mongoServer.cleanup(true);
      expect(utils.statPath).toHaveBeenCalledTimes(1);
      expect(semver.lt).toHaveBeenCalledTimes(1);
      expect(await utils.statPath(dbPath)).toBeUndefined();
      expect(mongoServer.state).toEqual(MongoMemoryServerStates.new);
      expect(mongoServer.instanceInfo).toBeUndefined();
    });

    it('should throw an error if state is not "stopped"', async () => {
      const mongoServer = new MongoMemoryServer();
      try {
        await mongoServer.cleanup();
        fail('Expected "cleanup" to fail');
      } catch (err) {
        expect(err).toBeInstanceOf(StateError);
        expect(err.message).toMatchSnapshot();
      }
    });
  });

  it('"getDbPath" should return the dbPath', async () => {
    const tmpDir = tmp.dirSync({ prefix: 'mongo-mem-getDbPath-', unsafeCleanup: true });
    const mongoServer = new MongoMemoryServer({
      instance: { dbPath: tmpDir.name },
    });

    await mongoServer.start();

    expect(mongoServer.instanceInfo!.dbPath).toEqual(tmpDir.name);

    await mongoServer.stop();
    tmpDir.removeCallback();
  });

  it('"state" should return correct state', () => {
    const mongoServer = new MongoMemoryServer();
    expect(mongoServer.state).toEqual(MongoMemoryServerStates.new);
    // @ts-expect-error because "stateChange" is protected
    mongoServer.stateChange(MongoMemoryServerStates.running);
    expect(mongoServer.state).toEqual(MongoMemoryServerStates.running);
  });

  it('"createAuth" should throw an error if called without "this.auth" defined', async () => {
    const mongoServer = new MongoMemoryServer();

    try {
      // @ts-expect-error because "createAuth" is protected
      await mongoServer.createAuth();
      fail('Expected "createAuth" to fail');
    } catch (err) {
      expect(err.message).toEqual('"createAuth" got called, but "this.auth" is undefined!');
    }
  });

  it('should start & stop multiple times without creating new instances & directories', async () => {
    const mongoServer = await MongoMemoryServer.create();
    const dbPath = mongoServer.instanceInfo!.dbPath;
    await mongoServer.stop(false);
    expect(await utils.statPath(dbPath)).toBeTruthy();
    expect(mongoServer.instanceInfo).toBeTruthy();
    await mongoServer.start();
    expect(mongoServer.instanceInfo!.dbPath).toEqual(dbPath);
    await mongoServer.stop(false);
    expect(await utils.statPath(dbPath)).toBeTruthy();
    expect(mongoServer.instanceInfo).toBeTruthy();

    await mongoServer.cleanup();
    expect(await utils.statPath(dbPath)).toBeFalsy();
    expect(mongoServer.instanceInfo).toBeFalsy();
    expect(mongoServer.state).toEqual(MongoMemoryServerStates.new);
  });
});
