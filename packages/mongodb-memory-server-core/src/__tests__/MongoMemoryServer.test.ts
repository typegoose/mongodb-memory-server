/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MongoClient, MongoServerError } from 'mongodb';
import * as tmp from 'tmp';
import MongoMemoryServer, {
  CreateUser,
  MongoInstanceData,
  MongoMemoryServerEvents,
  MongoMemoryServerStates,
} from '../MongoMemoryServer';
import MongoInstance from '../util/MongoInstance';
import * as utils from '../util/utils';
import * as semver from 'semver';
import { EnsureInstanceError, StateError } from '../util/errors';
import { assertIsError } from './testUtils/test_utils';
import { promises as fspromises } from 'fs';
import * as path from 'path';

tmp.setGracefulCleanup();
jest.setTimeout(100000); // 10s

afterEach(() => {
  jest.restoreAllMocks();
});

describe('MongoMemoryServer', () => {
  describe('start()', () => {
    it('should not error if an MongoInstanceData is resolved by _startUpInstance', async () => {
      const mongoServer = new MongoMemoryServer();
      jest.spyOn(mongoServer, '_startUpInstance').mockImplementationOnce(() => Promise.resolve());

      expect(mongoServer._startUpInstance).not.toHaveBeenCalled();

      await mongoServer.start();

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

      // test unpriviliged connection
      {
        const con = await MongoClient.connect(mongoServer.getUri());

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
        const con: MongoClient = await MongoClient.connect(
          utils.uriTemplate(mongoServer.instanceInfo.ip, mongoServer.instanceInfo.port, 'admin'),
          {
            authSource: 'admin',
            authMechanism: 'SCRAM-SHA-256',
            auth: {
              username: mongoServer.auth.customRootName,
              password: mongoServer.auth.customRootPwd,
            },
          }
        );

        const admindb = con.db('admin');
        const users: { users?: { user: string }[] } = await admindb.command({
          usersInfo: mongoServer.auth.customRootName,
        });
        expect(users.users).toHaveLength(1);
        expect(users.users?.[0].user).toEqual(mongoServer.auth.customRootName);

        const db = con.db('somedb');
        const col = db.collection('somecol');

        expect(await col.insertOne({ test: 1 })).toHaveProperty('acknowledged', true);

        await con.close();
      }

      expect(MongoInstance.prototype.start).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledTimes(0);

      await mongoServer.stop();
    });

    it('should make use of "AutomaticAuth" even when "instance.auth" is not set (wiredTiger)', async () => {
      jest.spyOn(MongoInstance.prototype, 'start');
      jest.spyOn(console, 'warn').mockImplementationOnce(() => void 0);
      const mongoServer = await MongoMemoryServer.create({
        auth: {},
        instance: {
          storageEngine: 'wiredTiger',
        },
      });

      utils.assertion(!utils.isNullOrUndefined(mongoServer.instanceInfo));
      utils.assertion(!utils.isNullOrUndefined(mongoServer.auth));

      // test unpriviliged connection
      {
        const con = await MongoClient.connect(mongoServer.getUri());

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
        const con: MongoClient = await MongoClient.connect(
          utils.uriTemplate(mongoServer.instanceInfo.ip, mongoServer.instanceInfo.port, 'admin'),
          {
            authSource: 'admin',
            authMechanism: 'SCRAM-SHA-256',
            auth: {
              username: mongoServer.auth.customRootName,
              password: mongoServer.auth.customRootPwd,
            },
          }
        );

        const admindb = con.db('admin');
        const users: { users?: { user: string }[] } = await admindb.command({
          usersInfo: mongoServer.auth.customRootName,
        });
        expect(users.users).toHaveLength(1);
        expect(users.users?.[0].user).toEqual(mongoServer.auth.customRootName);

        const db = con.db('somedb');
        const col = db.collection('somecol');

        expect(await col.insertOne({ test: 1 })).toHaveProperty('acknowledged', true);

        await con.close();
      }

      expect(MongoInstance.prototype.start).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledTimes(0);

      await mongoServer.stop();
    });

    it('should make use of "AutomaticAuth" (wiredTiger)', async () => {
      jest.spyOn(MongoInstance.prototype, 'start');
      jest.spyOn(console, 'warn').mockImplementationOnce(() => void 0);
      const mongoServer = await MongoMemoryServer.create({
        auth: {},
        instance: {
          auth: true,
          storageEngine: 'wiredTiger',
        },
      });

      utils.assertion(!utils.isNullOrUndefined(mongoServer.instanceInfo));
      utils.assertion(!utils.isNullOrUndefined(mongoServer.auth));

      // test unpriviliged connection
      {
        const con = await MongoClient.connect(mongoServer.getUri());

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
        const con: MongoClient = await MongoClient.connect(
          utils.uriTemplate(mongoServer.instanceInfo.ip, mongoServer.instanceInfo.port, 'admin'),
          {
            authSource: 'admin',
            authMechanism: 'SCRAM-SHA-256',
            auth: {
              username: mongoServer.auth.customRootName,
              password: mongoServer.auth.customRootPwd,
            },
          }
        );

        const admindb = con.db('admin');
        const users: { users?: { user: string }[] } = await admindb.command({
          usersInfo: mongoServer.auth.customRootName,
        });
        expect(users.users).toHaveLength(1);
        expect(users.users?.[0].user).toEqual(mongoServer.auth.customRootName);

        const db = con.db('somedb');
        const col = db.collection('somecol');

        expect(await col.insertOne({ test: 1 })).toHaveProperty('acknowledged', true);

        await con.close();
      }

      expect(MongoInstance.prototype.start).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledTimes(0);

      await mongoServer.stop();
    });

    it('should make use of "AutomaticAuth" with extra users (ephemeralForTest)', async () => {
      const readOnlyUser: CreateUser = {
        createUser: 'SomeUser',
        pwd: 'hello',
        roles: ['readAnyDatabase'],
      };

      jest.spyOn(MongoInstance.prototype, 'start');
      jest.spyOn(console, 'warn').mockImplementationOnce(() => void 0);
      const mongoServer = await MongoMemoryServer.create({
        auth: {
          extraUsers: [
            readOnlyUser,
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

      // test unpriviliged connection
      {
        const con = await MongoClient.connect(mongoServer.getUri());

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

      // test admin priviliged connection
      {
        const con: MongoClient = await MongoClient.connect(
          utils.uriTemplate(mongoServer.instanceInfo.ip, mongoServer.instanceInfo.port, 'admin'),
          {
            authSource: 'admin',
            authMechanism: 'SCRAM-SHA-256',
            auth: {
              username: mongoServer.auth.customRootName,
              password: mongoServer.auth.customRootPwd,
            },
          }
        );

        const admindb = con.db('admin');
        const users: { users?: { user: string }[] } = await admindb.command({
          usersInfo: 1,
        });
        utils.assertion(!utils.isNullOrUndefined(users.users));
        expect(users.users).toHaveLength(4); // 1 root user, 3 extra users in database "admin"

        expect(
          users.users.filter((v) => v.user === mongoServer.auth!.customRootName).length > 0
        ).toEqual(true);
        expect(users.users.filter((v) => v.user === 'SomeUser').length > 0).toEqual(true);
        expect(users.users.filter((v) => v.user === 'SomeOtherUser').length > 0).toEqual(true);
        expect(users.users.filter((v) => v.user === 'AdminUser').length > 0).toEqual(true);
        expect(users.users.filter((v) => v.user === 'OtherDBUser').length > 0).toEqual(false);

        const otherdb = con.db('otherdb');
        const otherdbUsers: { users?: { user: string }[] } = await otherdb.command({
          usersInfo: 1,
        });
        utils.assertion(!utils.isNullOrUndefined(otherdbUsers.users));
        expect(otherdbUsers.users).toHaveLength(1); // 1 extra user in database "otherdb"
        expect(otherdbUsers.users.filter((v) => v.user === 'OtherDBUser').length > 0).toEqual(true);

        const db = con.db('somedb');
        const col = db.collection('somecol');

        expect(await col.insertOne({ test: 1 })).toHaveProperty('acknowledged', true);

        await con.close();
      }

      // test read-only user connection
      {
        const con = await MongoClient.connect(mongoServer.getUri(), {
          authSource: readOnlyUser.database,
          authMechanism: 'SCRAM-SHA-256',
          auth: {
            username: readOnlyUser.createUser,
            password: readOnlyUser.pwd,
          },
        });

        const db = con.db('somedb');
        const col = db.collection('somecol');

        // write test
        try {
          await col.insertOne({ test: 1 });
          fail('Expected insertion to fail');
        } catch (err) {
          expect(err).toBeInstanceOf(MongoServerError);
          expect((err as MongoServerError).codeName).toEqual('Unauthorized');
        }

        expect(await col.findOne()).toHaveProperty('test', 1);

        await con.close();
      }

      expect(MongoInstance.prototype.start).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledTimes(0);

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
      expect(mongoServer.instanceInfo.instance.prepareCommandArgs().includes('--noauth'));

      const con: MongoClient = await MongoClient.connect(
        utils.uriTemplate(mongoServer.instanceInfo.ip, mongoServer.instanceInfo.port, 'admin'),
        {}
      );
      const db = con.db('admin');
      expect(
        await db.command({
          usersInfo: 1,
        })
      ).toHaveProperty('ok', 1); // noauth instance has root permissions without user
      expect(MongoInstance.prototype.start).toHaveBeenCalledTimes(1);
      expect(MongoMemoryServer.prototype.createAuth).not.toHaveBeenCalled();

      await con.close();
      await mongoServer.stop();
    });

    it('"createAuth" should not be called if "instance.auth" is false', async () => {
      jest.spyOn(MongoInstance.prototype, 'start');
      jest.spyOn(MongoMemoryServer.prototype, 'createAuth');
      const mongoServer = await MongoMemoryServer.create({
        auth: {},
        instance: {
          auth: false,
          storageEngine: 'ephemeralForTest',
        },
      });

      utils.assertion(!utils.isNullOrUndefined(mongoServer.instanceInfo));
      utils.assertion(!utils.isNullOrUndefined(mongoServer.auth));

      const con: MongoClient = await MongoClient.connect(
        utils.uriTemplate(mongoServer.instanceInfo.ip, mongoServer.instanceInfo.port, 'admin')
      );
      const db = con.db('admin');
      await db.command({
        usersInfo: 1,
      });
      expect(MongoInstance.prototype.start).toHaveBeenCalledTimes(1);
      expect(MongoMemoryServer.prototype.createAuth).not.toHaveBeenCalled();
      expect(
        mongoServer.instanceInfo.instance.prepareCommandArgs().includes('--noauth')
      ).toStrictEqual(true);

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
          assertIsError(err);
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
          assertIsError(err);
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
      jest.spyOn(mongoServer, 'start').mockResolvedValue(void 0);

      try {
        await mongoServer.ensureInstance();
        fail('Expected "ensureInstance" to fail');
      } catch (err) {
        expect(err).toBeInstanceOf(EnsureInstanceError);
        expect(JSON.stringify(err)).toMatchSnapshot(); // this is to test all the custom values on the error
      }

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
        fail('Expected "ensureInstance" to fail');
      } catch (err) {
        expect(err).toBeInstanceOf(EnsureInstanceError);
        expect(JSON.stringify(err)).toMatchSnapshot(); // this is to test all the custom values on the error
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
        assertIsError(err);
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

    it('should still run "stop" even if state is already "stopped"', async () => {
      const mongoServer = new MongoMemoryServer();
      const instance = new MongoInstance({});
      const instanceStopSpy = jest
        .spyOn(instance, 'stop')
        .mockImplementation(() => Promise.resolve(true));
      // @ts-expect-error because "_instanceInfo" is protected
      mongoServer._instanceInfo = { instance: instance };
      // @ts-expect-error because "_state" is protected
      mongoServer._state = MongoMemoryServerStates.stopped;
      jest.spyOn(utils, 'isNullOrUndefined');
      jest.spyOn(utils, 'assertion');

      expect(await mongoServer.stop({ doCleanup: false, force: false })).toEqual(true);
      expect(instanceStopSpy).toHaveBeenCalledTimes(1);
      expect(utils.isNullOrUndefined).toHaveBeenCalledTimes(1);
      expect(utils.assertion).not.toHaveBeenCalled();
    });

    it('should call cleanup by default', async () => {
      const mongoServer = new MongoMemoryServer();

      // mock "_instanceInfo" as if the instance had already been started once
      {
        const instance = new MongoInstance({});
        // @ts-expect-error because "_instanceInfo" is protected
        mongoServer._instanceInfo = { instance: instance };
      }

      const cleanupSpy = jest.spyOn(mongoServer, 'cleanup').mockResolvedValue(void 0);

      await mongoServer.stop();

      expect(cleanupSpy).toHaveBeenCalledWith({ doCleanup: true, force: false } as utils.Cleanup);
    });

    it('should call cleanup with mapped boolean', async () => {
      const mongoServer = new MongoMemoryServer();

      // mock "_instanceInfo" as if the instance had already been started once
      {
        const instance = new MongoInstance({});
        // @ts-expect-error because "_instanceInfo" is protected
        mongoServer._instanceInfo = { instance: instance };
      }

      const cleanupSpy = jest.spyOn(mongoServer, 'cleanup').mockResolvedValue(void 0);

      await mongoServer.stop(false);

      expect(cleanupSpy).not.toHaveBeenCalled();

      cleanupSpy.mockClear();

      await mongoServer.stop(true);

      expect(cleanupSpy).toHaveBeenCalledWith({ doCleanup: true, force: false } as utils.Cleanup);
    });

    it('should call cleanup and pass-through cleanup options', async () => {
      const mongoServer = new MongoMemoryServer();

      // mock "_instanceInfo" as if the instance had already been started once
      {
        const instance = new MongoInstance({});
        // @ts-expect-error because "_instanceInfo" is protected
        mongoServer._instanceInfo = { instance: instance };
      }

      const cleanupSpy = jest.spyOn(mongoServer, 'cleanup').mockResolvedValue(void 0);

      await mongoServer.stop({ doCleanup: true, force: true });

      expect(cleanupSpy).toHaveBeenCalledWith({ doCleanup: true, force: true } as utils.Cleanup);
    });
  });

  describe('create()', () => {
    it('should create an instance and call ".start"', async () => {
      jest.spyOn(MongoMemoryServer.prototype, 'start').mockResolvedValue(void 0);

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

    it('should return correct value with "otherDb" being a string', () => {
      const port: number = mongoServer.instanceInfo!.port;
      expect(mongoServer.getUri('customDB')).toEqual(`mongodb://127.0.0.1:${port}/customDB`);
    });

    it('should return correct value with "otherDb" being a boolean', () => {
      const port: number = mongoServer.instanceInfo!.port;
      const uri = mongoServer.getUri();
      expect(uri).not.toEqual(`mongodb://127.0.0.1:${port}/hello`);
      expect(uri).toEqual(`mongodb://127.0.0.1:${port}/`);
    });

    it('should return with no database attached', () => {
      const port: number = mongoServer.instanceInfo!.port;
      const instanceInfo = mongoServer.instanceInfo;
      utils.assertion(instanceInfo, new Error('"MongoServer.instanceInfo" should be defined!'));
      expect(mongoServer.getUri()).toEqual(`mongodb://127.0.0.1:${port}/`);
    });

    it('should throw an state error, if not starting or running', async () => {
      const newMongoServer = new MongoMemoryServer();

      // short for instead having to use "() => newMongoServer.getUri()"
      function getUri() {
        return newMongoServer.getUri();
      }

      // it is tested multiple times, to ensure it is an *instanceof* that error, and *the message* is correct
      expect(getUri).toThrowError(StateError);
      expect(getUri).toThrowErrorMatchingSnapshot();
      expect(mongoServer.getUri()).not.toBeUndefined();

      await newMongoServer.start();
      expect(newMongoServer.getUri()).not.toBeUndefined();
      await newMongoServer.stop();
      expect(getUri).toThrowError(StateError);
      expect(getUri).toThrowErrorMatchingSnapshot();
    });

    it('should return "otherIp" if set', () => {
      const port: number = mongoServer.instanceInfo!.port;
      expect(mongoServer.getUri(undefined, '0.0.0.0')).toStrictEqual(`mongodb://0.0.0.0:${port}/`);
    });
  });

  describe('cleanup()', () => {
    /** Cleanup the created tmp-dir, even if the cleanup test tested to not clean it up */
    let tmpdir: tmp.DirResult | undefined;

    // "beforeAll" dosnt work here, thanks to the top-level "afterAll" hook
    beforeEach(() => {
      jest.spyOn(utils, 'statPath');
      // @ts-expect-error because "default" dosnt exist in the definitions
      jest.spyOn(semver.default, 'lt'); // it needs to be ".default" otherwise "lt" is only an getter
    });

    afterEach(() => {
      if (!utils.isNullOrUndefined(tmpdir)) {
        tmpdir.removeCallback();

        tmpdir = undefined; // reset, just to be sure its clean
      }
    });

    it('should properly cleanup with tmpDir with default no force (old)', async () => {
      const mongoServer = await MongoMemoryServer.create();
      const dbPath = mongoServer.instanceInfo!.dbPath;

      tmpdir = mongoServer.instanceInfo?.tmpDir;

      await mongoServer.stop({ doCleanup: false });
      await mongoServer.cleanup();

      expect(utils.statPath).not.toHaveBeenCalled();
      expect(semver.lt).not.toHaveBeenCalled();
      expect(await utils.statPath(dbPath)).toBeUndefined();
      expect(mongoServer.state).toEqual(MongoMemoryServerStates.new);
      expect(mongoServer.instanceInfo).toBeUndefined();
    });

    it('should properly cleanup with tmpDir and re-check with force (old)', async () => {
      const mongoServer = await MongoMemoryServer.create();
      const dbPath = mongoServer.instanceInfo!.dbPath;

      tmpdir = mongoServer.instanceInfo?.tmpDir;

      await mongoServer.stop({ doCleanup: false });
      await mongoServer.cleanup(true);

      expect(utils.statPath).toHaveBeenCalledTimes(1);
      expect(semver.lt).not.toHaveBeenCalled();
      expect(await utils.statPath(dbPath)).toBeUndefined();
      expect(mongoServer.state).toEqual(MongoMemoryServerStates.new);
      expect(mongoServer.instanceInfo).toBeUndefined();
    });

    it('should properly cleanup with force (without tmpDir) (old)', async () => {
      const tmpDir = tmp.dirSync({ prefix: 'mongo-mem-cleanup-', unsafeCleanup: true });
      const mongoServer = await MongoMemoryServer.create({ instance: { dbPath: tmpDir.name } });
      const dbPath = mongoServer.instanceInfo!.dbPath;

      tmpdir = mongoServer.instanceInfo?.tmpDir;

      await mongoServer.stop({ doCleanup: false });
      await mongoServer.cleanup(true);

      expect(utils.statPath).toHaveBeenCalledTimes(1);
      expect(semver.lt).toHaveBeenCalled(); // not testing on how many, because it would change with nodejs version
      expect(await utils.statPath(dbPath)).toBeUndefined();
      expect(mongoServer.state).toEqual(MongoMemoryServerStates.new);
      expect(mongoServer.instanceInfo).toBeUndefined();
    });

    it('should properly cleanup with tmpDir with default no force (new)', async () => {
      const mongoServer = await MongoMemoryServer.create();
      const dbPath = mongoServer.instanceInfo!.dbPath;

      const cleanupSpy = jest.spyOn(mongoServer, 'cleanup');

      tmpdir = mongoServer.instanceInfo?.tmpDir;

      await mongoServer.stop({ doCleanup: false });
      await mongoServer.cleanup();
      expect(utils.statPath).not.toHaveBeenCalled();
      expect(semver.lt).not.toHaveBeenCalled();
      expect(await utils.statPath(dbPath)).toBeUndefined();
      expect(mongoServer.state).toEqual(MongoMemoryServerStates.new);
      expect(mongoServer.instanceInfo).toBeUndefined();
      expect(cleanupSpy).toHaveBeenCalledWith();
    });

    it('should properly cleanup with tmpDir and re-check with force (new)', async () => {
      const mongoServer = await MongoMemoryServer.create();

      const cleanupSpy = jest.spyOn(mongoServer, 'cleanup');

      tmpdir = mongoServer.instanceInfo?.tmpDir;

      const dbPath = mongoServer.instanceInfo!.dbPath;
      await mongoServer.stop({ doCleanup: false });
      await mongoServer.cleanup({ doCleanup: true, force: true });
      expect(utils.statPath).toHaveBeenCalledTimes(1);
      expect(semver.lt).not.toHaveBeenCalled();
      expect(await utils.statPath(dbPath)).toBeUndefined();
      expect(mongoServer.state).toEqual(MongoMemoryServerStates.new);
      expect(mongoServer.instanceInfo).toBeUndefined();
      expect(cleanupSpy).toHaveBeenCalledWith({ doCleanup: true, force: true } as utils.Cleanup);
    });

    it('should properly cleanup with force (without tmpDir) (new)', async () => {
      const tmpDir = tmp.dirSync({ prefix: 'mongo-mem-cleanup-', unsafeCleanup: true });
      const mongoServer = await MongoMemoryServer.create({ instance: { dbPath: tmpDir.name } });
      const dbPath = mongoServer.instanceInfo!.dbPath;

      const cleanupSpy = jest.spyOn(mongoServer, 'cleanup');

      tmpdir = mongoServer.instanceInfo?.tmpDir;

      await mongoServer.stop({ doCleanup: false });
      await mongoServer.cleanup({ doCleanup: true, force: true });
      expect(utils.statPath).toHaveBeenCalledTimes(1);
      expect(semver.lt).toHaveBeenCalled(); // not testing on how many, because it would change with nodejs version
      expect(await utils.statPath(dbPath)).toBeUndefined();
      expect(mongoServer.state).toEqual(MongoMemoryServerStates.new);
      expect(mongoServer.instanceInfo).toBeUndefined();
      expect(cleanupSpy).toHaveBeenCalledWith({ doCleanup: true, force: true } as utils.Cleanup);
    });

    it('should throw an error if state is not "stopped"', async () => {
      const mongoServer = new MongoMemoryServer();
      try {
        await mongoServer.cleanup();
        fail('Expected "cleanup" to fail');
      } catch (err) {
        expect(err).toBeInstanceOf(StateError);
        assertIsError(err);
        expect(err.message).toMatchSnapshot();
      }
    });
  });

  describe('getStartOptions()', () => {
    it('should create a tmpdir if "dbPath" is not set', async () => {
      // somehow, jest cannot redefine function "dirSync", so this is disabled
      // const tmpSpy = jest.spyOn(tmp, 'dirSync');
      const mongoServer = new MongoMemoryServer({});

      // @ts-expect-error "getStartOptions" is protected
      const options = await mongoServer.getStartOptions();

      // see comment above
      // expect(tmpSpy).toHaveBeenCalledTimes(1);
      expect(options.data.tmpDir).toBeDefined();
      // jest "expect" do not act as typescript typeguards
      utils.assertion(
        !utils.isNullOrUndefined(options.data.dbPath),
        new Error('Expected "options.data.dbPath" to be defined')
      );
      expect(await utils.pathExists(options.data.dbPath)).toEqual(true);
    });

    it('should resolve "isNew" to "true" and set "createAuth" to "true" when dbPath is set, but empty', async () => {
      const readdirSpy = jest.spyOn(fspromises, 'readdir');
      const tmpDbPath = tmp.dirSync({ prefix: 'mongo-mem-getStartOptions1-', unsafeCleanup: true });

      const mongoServer = new MongoMemoryServer({
        instance: { dbPath: tmpDbPath.name },
        auth: {},
      });

      // @ts-expect-error "getStartOptions" is protected
      const options = await mongoServer.getStartOptions();

      expect(options.data.tmpDir).toBeUndefined();
      utils.assertion(
        !utils.isNullOrUndefined(options.data.dbPath),
        new Error('Expected "options.data.dbPath" to be defined')
      );
      expect(await utils.pathExists(options.data.dbPath)).toEqual(true);
      expect(options.data.dbPath).toEqual(tmpDbPath.name);
      expect(readdirSpy).toHaveBeenCalledTimes(1);
      expect(options.createAuth).toEqual(true);

      tmpDbPath.removeCallback();
    });

    it('should resolve "isNew" to "false" and set "createAuth" to "false" when dbPath is set, but not empty', async () => {
      const readdirSpy = jest.spyOn(fspromises, 'readdir');
      const tmpDbPath = tmp.dirSync({ prefix: 'mongo-mem-getStartOptions1-', unsafeCleanup: true });

      // create dummy file, to make the directory non-empty
      await fspromises.writeFile(path.resolve(tmpDbPath.name, 'testfile'), '');

      const mongoServer = new MongoMemoryServer({
        instance: { dbPath: tmpDbPath.name },
        auth: {},
      });

      // @ts-expect-error "getStartOptions" is protected
      const options = await mongoServer.getStartOptions();

      expect(options.data.tmpDir).toBeUndefined();
      utils.assertion(
        !utils.isNullOrUndefined(options.data.dbPath),
        new Error('Expected "options.data.dbPath" to be defined')
      );
      expect(await utils.pathExists(options.data.dbPath)).toEqual(true);
      expect(options.data.dbPath).toEqual(tmpDbPath.name);
      expect(readdirSpy).toHaveBeenCalledTimes(1);
      expect(options.createAuth).toEqual(false);

      tmpDbPath.removeCallback();
    });

    it('should generate a port when no suggestion is defined', async () => {
      const mongoServer = new MongoMemoryServer();
      const newPortSpy = jest
        // @ts-expect-error "getNewPort" is protected
        .spyOn(mongoServer, 'getNewPort')
        // @ts-expect-error it somehow gets a wrong function type
        .mockImplementation((port) => Promise.resolve(port ? port : 2000));

      // @ts-expect-error "getStartOptions" is protected
      const options = await mongoServer.getStartOptions();

      expect(newPortSpy).toHaveBeenCalledTimes(1);
      expect(typeof options.data.port === 'number').toBeTruthy();
    });

    it('should use a predefined port as a suggestion for a port', async () => {
      const predefinedPort = 10000;

      const mongoServer = new MongoMemoryServer({ instance: { port: predefinedPort } });
      const newPortSpy = jest
        // @ts-expect-error "getNewPort" is protected
        .spyOn(mongoServer, 'getNewPort')
        // @ts-expect-error it somehow gets a wrong function type
        .mockImplementation((port) => Promise.resolve(port ? port : 2000));

      // @ts-expect-error "getStartOptions" is protected
      const options = await mongoServer.getStartOptions();

      expect(newPortSpy).toHaveBeenCalledWith(predefinedPort);
      expect(options.data.port).toStrictEqual(predefinedPort);
    });

    it('should use a predefined port for a port with "forceSamePort" on', async () => {
      const predefinedPort = 30000;

      const mongoServer = new MongoMemoryServer({ instance: { port: predefinedPort } });
      const newPortSpy = jest
        // @ts-expect-error "getNewPort" is protected
        .spyOn(mongoServer, 'getNewPort')
        .mockImplementation(() => fail('Expected this function to not be called'));

      // @ts-expect-error "getStartOptions" is protected
      const options = await mongoServer.getStartOptions(true);

      expect(newPortSpy).not.toHaveBeenCalled();
      expect(options.data.port).toStrictEqual(predefinedPort);
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
      assertIsError(err);
      expect(err.message).toMatchSnapshot();
    }
  });

  it('should start & stop multiple times without creating new instances & directories', async () => {
    const mongoServer = await MongoMemoryServer.create();
    const dbPath = mongoServer.instanceInfo!.dbPath;
    await mongoServer.stop({ doCleanup: false, force: false });
    expect(await utils.statPath(dbPath)).toBeTruthy();
    expect(mongoServer.instanceInfo).toBeTruthy();
    await mongoServer.start();
    expect(mongoServer.instanceInfo!.dbPath).toEqual(dbPath);
    await mongoServer.stop({ doCleanup: false, force: false });
    expect(await utils.statPath(dbPath)).toBeTruthy();
    expect(mongoServer.instanceInfo).toBeTruthy();

    await mongoServer.cleanup();
    expect(await utils.statPath(dbPath)).toBeFalsy();
    expect(mongoServer.instanceInfo).toBeFalsy();
    expect(mongoServer.state).toEqual(MongoMemoryServerStates.new);
  });

  describe('authObjectEnable()', () => {
    it('should with defaults return "false"', () => {
      const mongoServer = new MongoMemoryServer();

      expect(mongoServer.auth).toBeFalsy();

      expect(
        // @ts-expect-error "authObjectEnable" is protected
        mongoServer.authObjectEnable()
      ).toStrictEqual(false);
    });

    it('should with defaults return "true" if empty object OR "disable: false"', () => {
      {
        const mongoServer = new MongoMemoryServer({ auth: {} });

        expect(
          // @ts-expect-error "authObjectEnable" is protected
          mongoServer.authObjectEnable()
        ).toStrictEqual(true);
      }
      {
        const mongoServer = new MongoMemoryServer({ auth: { disable: false } });

        expect(
          // @ts-expect-error "authObjectEnable" is protected
          mongoServer.authObjectEnable()
        ).toStrictEqual(true);
      }
    });
  });

  it('should transfer "launchTimeout" option to the MongoInstance', async () => {
    const createSpy = jest.spyOn(MongoInstance, 'create').mockImplementation(
      // @ts-expect-error This can work, because the instance is not used in the function that is tested here, beyond setting some extra options
      () => Promise.resolve({})
    );

    const mongoServer = new MongoMemoryServer({ instance: { launchTimeout: 2000 } });

    await mongoServer._startUpInstance();

    // @ts-expect-error "_instanceInfo" is protected
    const instanceInfo = mongoServer._instanceInfo;
    expect(instanceInfo).toBeDefined();
    utils.assertion(!utils.isNullOrUndefined(instanceInfo));
    expect(instanceInfo.instance).toBeDefined();
    expect(instanceInfo?.launchTimeout).toStrictEqual(2000);

    expect(createSpy.mock.calls.length).toStrictEqual(1);
    expect(createSpy.mock.calls[0][0].instance).toHaveProperty('launchTimeout', 2000);
  });
});
