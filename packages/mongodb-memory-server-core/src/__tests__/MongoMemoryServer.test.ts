/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MongoClient, MongoServerError } from 'mongodb';
import MongoMemoryServer, {
  CreateUser,
  MongoInstanceData,
  MongoMemoryServerEvents,
  MongoMemoryServerStates,
} from '../MongoMemoryServer';
import MongoInstance from '../util/MongoInstance';
import * as utils from '../util/utils';
import { InstanceInfoError, StateError } from '../util/errors';
import { assertIsError } from './testUtils/test_utils';
import { promises as fspromises } from 'fs';
import * as path from 'path';
import getFreePort from '../util/getport';

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
      const testPort = await getFreePort(27444);
      const mongoServer1 = await MongoMemoryServer.create({
        instance: { port: testPort },
      });

      const mongoServer2 = await MongoMemoryServer.create({
        instance: { port: testPort },
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
        auth: { enable: true },
        instance: {
          storageEngine: 'ephemeralForTest',
        },
        binary: {
          // 7.0 removed "ephemeralForTest", this test is explicitly for that engine
          version: '6.0.14',
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

    it('should not start auth when "instance.auth" is not set (wiredTiger)', async () => {
      jest.spyOn(MongoInstance.prototype, 'start').mockResolvedValueOnce();
      jest.spyOn(console, 'warn').mockImplementationOnce(() => void 0);
      const mongoServer = await MongoMemoryServer.create({
        auth: {},
        instance: {
          storageEngine: 'wiredTiger',
        },
      });

      const args = // @ts-expect-error "_instanceInfo" is protected
        mongoServer._instanceInfo?.instance
          // separator comment
          .prepareCommandArgs();

      utils.assertion(!utils.isNullOrUndefined(args));

      expect(args.includes('--noauth')).toBeTruthy();

      await mongoServer.stop(); // cleanup
    });

    it('should make use of "AutomaticAuth" (wiredTiger)', async () => {
      jest.spyOn(MongoInstance.prototype, 'start');
      jest.spyOn(console, 'warn').mockImplementationOnce(() => void 0);
      const mongoServer = await MongoMemoryServer.create({
        auth: { enable: true },
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
          enable: true,
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
          storageEngine: 'ephemeralForTest',
        },
        binary: {
          // 7.0 removed "ephemeralForTest", this test is explicitly for that engine
          version: '6.0.14',
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

    it('"createAuth" should not be called if "enabled" is false', async () => {
      jest.spyOn(MongoInstance.prototype, 'start');
      jest.spyOn(MongoMemoryServer.prototype, 'createAuth');
      const mongoServer = await MongoMemoryServer.create({
        auth: {
          enable: false,
        },
      });

      utils.assertion(!utils.isNullOrUndefined(mongoServer.instanceInfo));
      utils.assertion(utils.isNullOrUndefined(mongoServer.auth));
      expect(
        mongoServer.instanceInfo.instance.prepareCommandArgs().includes('--noauth')
      ).toBeTruthy();

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

    it('"createAuth" should ignore "instance.auth"', async () => {
      jest.spyOn(MongoInstance.prototype, 'start');
      jest.spyOn(MongoMemoryServer.prototype, 'createAuth');
      const mongoServer = new MongoMemoryServer({
        auth: { enable: true },
        instance: {
          // @ts-expect-error "auth" is removed from the type
          auth: false,
          storageEngine: 'ephemeralForTest',
        },
      });

      expect(mongoServer.opts.instance).not.toHaveProperty('auth');
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

    describe('instance.portGeneration', () => {
      it('should use a predefined port if "opts.instance.portGeneration" is "false"', async () => {
        const predefinedPort = 30001;

        const mongoServer = new MongoMemoryServer({
          instance: { port: predefinedPort, portGeneration: false },
        });
        const newPortSpy = jest
          // @ts-expect-error "getNewPort" is protected
          .spyOn(mongoServer, 'getNewPort')
          .mockImplementation(() => fail('Expected this function to not be called'));

        await mongoServer.start();

        expect(newPortSpy).not.toHaveBeenCalled();
        // @ts-expect-error "_instanceInfo" is protected
        expect(mongoServer._instanceInfo!.port).toStrictEqual(predefinedPort);

        await mongoServer.stop();
      });

      it('should Error if a predefined port is already in use if "opts.instance.portGeneration" is "false"', async () => {
        const predefinedPort = 30002;

        const newPortSpy = jest
          // @ts-expect-error "getNewPort" is protected
          .spyOn(MongoMemoryServer.prototype, 'getNewPort')
          .mockImplementation(() => fail('Expected this function to not be called'));

        jest.spyOn(console, 'warn').mockImplementationOnce(() => void 0);

        const mongoServer1 = new MongoMemoryServer({
          instance: { port: predefinedPort, portGeneration: false },
        });

        const mongoServer2 = new MongoMemoryServer({
          instance: { port: predefinedPort, portGeneration: false },
        });

        await mongoServer1.start();

        await expect(() => mongoServer2.start()).rejects.toMatchSnapshot();

        expect(newPortSpy).not.toHaveBeenCalled();
        // @ts-expect-error "_instanceInfo" is protected
        expect(mongoServer1._instanceInfo!.port).toStrictEqual(predefinedPort);
        expect(console.warn).toHaveBeenCalledTimes(1);

        await mongoServer1.stop();
      });

      it('should generate a new port if the predefined port is already in use and "opts.instance.portGeneration" is "true"', async () => {
        const predefinedPort = 30003;

        const newPortSpy = jest
          // @ts-expect-error "getNewPort" is protected
          .spyOn(MongoMemoryServer.prototype, 'getNewPort');

        const mongoServer1 = new MongoMemoryServer({
          instance: { port: predefinedPort, portGeneration: false },
        });

        const mongoServer2 = new MongoMemoryServer({
          instance: { port: predefinedPort, portGeneration: true },
        });

        await mongoServer1.start();

        expect(newPortSpy).not.toHaveBeenCalled();

        await mongoServer2.start();

        expect(newPortSpy).toHaveBeenCalledTimes(1);

        await mongoServer1.stop();
        await mongoServer2.stop();
      });

      it('should overwrite "opts.instance.portGeneration" if "forceSamePort" is set ("forceSamePort true" case)', async () => {
        const predefinedPort = 30004;

        const newPortSpy = jest
          // @ts-expect-error "getNewPort" is protected
          .spyOn(MongoMemoryServer.prototype, 'getNewPort')
          .mockImplementation(() => fail('Expected this function to not be called'));

        jest.spyOn(console, 'warn').mockImplementationOnce(() => void 0);

        const mongoServer1 = new MongoMemoryServer({
          instance: { port: predefinedPort, portGeneration: false },
        });

        const mongoServer2 = new MongoMemoryServer({
          instance: { port: predefinedPort, portGeneration: true },
        });

        await mongoServer1.start();

        await expect(() => mongoServer2.start(true)).rejects.toMatchSnapshot();

        expect(newPortSpy).not.toHaveBeenCalled();
        // @ts-expect-error "_instanceInfo" is protected
        expect(mongoServer1._instanceInfo!.port).toStrictEqual(predefinedPort);
        expect(console.warn).toHaveBeenCalledTimes(1);

        await mongoServer1.stop();
      });

      it('should overwrite "opts.instance.portGeneration" if "forceSamePort" is set ("forceSamePort false" case)', async () => {
        const predefinedPort = 30005;

        const newPortSpy = jest
          // @ts-expect-error "getNewPort" is protected
          .spyOn(MongoMemoryServer.prototype, 'getNewPort');

        const mongoServer1 = new MongoMemoryServer({
          instance: { port: predefinedPort, portGeneration: false },
        });

        const mongoServer2 = new MongoMemoryServer({
          instance: { port: predefinedPort, portGeneration: false },
        });

        await mongoServer1.start();

        expect(newPortSpy).not.toHaveBeenCalled();

        await mongoServer2.start(false);

        expect(newPortSpy).toHaveBeenCalledTimes(1);

        await mongoServer1.stop();
        await mongoServer2.stop();
      });
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
        expect(err).toBeInstanceOf(InstanceInfoError);
        assertIsError(err);
        expect(err.message).toMatchSnapshot();
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
        expect(err).toBeInstanceOf(InstanceInfoError);
        assertIsError(err);
        expect(err.message).toMatchSnapshot();
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
        `"ensureInstance" waited for "running" but got a different state: "${MongoMemoryServerStates.stopped}"`
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

      await mongoServer.stop({ doCleanup: false });

      expect(cleanupSpy).not.toHaveBeenCalled();

      cleanupSpy.mockClear();

      await mongoServer.stop({ doCleanup: true });

      expect(cleanupSpy).toHaveBeenCalledWith({ doCleanup: true } as utils.Cleanup);
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
    let tmpdir: string | undefined;

    // "beforeAll" dosnt work here, thanks to the top-level "afterAll" hook
    beforeEach(() => {
      jest.spyOn(utils, 'statPath');
      jest.spyOn(utils, 'removeDir');
    });

    afterEach(async () => {
      if (!utils.isNullOrUndefined(tmpdir)) {
        await utils.removeDir(tmpdir);

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
      expect(utils.removeDir).toHaveBeenCalled();
      expect(await utils.statPath(dbPath)).toBeUndefined();
      expect(mongoServer.state).toEqual(MongoMemoryServerStates.new);
      expect(mongoServer.instanceInfo).toBeUndefined();
    });

    it('should properly cleanup with tmpDir and re-check with force (old)', async () => {
      const mongoServer = await MongoMemoryServer.create();
      const dbPath = mongoServer.instanceInfo!.dbPath;

      tmpdir = mongoServer.instanceInfo?.tmpDir;

      await mongoServer.stop({ doCleanup: false });
      await mongoServer.cleanup({ doCleanup: true, force: true });

      expect(utils.statPath).toHaveBeenCalledTimes(1);
      expect(utils.removeDir).toHaveBeenCalled();
      expect(await utils.statPath(dbPath)).toBeUndefined();
      expect(mongoServer.state).toEqual(MongoMemoryServerStates.new);
      expect(mongoServer.instanceInfo).toBeUndefined();
    });

    it('should properly cleanup with force (without tmpDir) (old)', async () => {
      const tmpDir = await utils.createTmpDir('mongo-mem-cleanup-');
      const mongoServer = await MongoMemoryServer.create({ instance: { dbPath: tmpDir } });
      const dbPath = mongoServer.instanceInfo!.dbPath;

      tmpdir = mongoServer.instanceInfo?.tmpDir;

      await mongoServer.stop({ doCleanup: false });
      await mongoServer.cleanup({ doCleanup: true, force: true });

      expect(utils.statPath).toHaveBeenCalledTimes(1);
      expect(utils.removeDir).toHaveBeenCalled();
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
      expect(utils.removeDir).toHaveBeenCalled();
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
      expect(utils.removeDir).toHaveBeenCalled();
      expect(await utils.statPath(dbPath)).toBeUndefined();
      expect(mongoServer.state).toEqual(MongoMemoryServerStates.new);
      expect(mongoServer.instanceInfo).toBeUndefined();
      expect(cleanupSpy).toHaveBeenCalledWith({ doCleanup: true, force: true } as utils.Cleanup);
    });

    it('should properly cleanup with force (without tmpDir) (new)', async () => {
      const tmpDir = await utils.createTmpDir('mongo-mem-cleanup-');
      const mongoServer = await MongoMemoryServer.create({ instance: { dbPath: tmpDir } });
      const dbPath = mongoServer.instanceInfo!.dbPath;

      const cleanupSpy = jest.spyOn(mongoServer, 'cleanup');

      tmpdir = mongoServer.instanceInfo?.tmpDir;

      await mongoServer.stop({ doCleanup: false });
      await mongoServer.cleanup({ doCleanup: true, force: true });
      expect(utils.statPath).toHaveBeenCalledTimes(1);
      expect(utils.removeDir).toHaveBeenCalled();
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
      const tmpSpy = jest.spyOn(utils, 'createTmpDir');
      const mongoServer = new MongoMemoryServer({});

      // @ts-expect-error "getStartOptions" is protected
      const options = await mongoServer.getStartOptions();

      expect(tmpSpy).toHaveBeenCalledTimes(1);
      expect(options.data.tmpDir).toBeDefined();
      // jest "expect" do not act as typescript typeguards
      utils.assertion(
        !utils.isNullOrUndefined(options.data.dbPath),
        new Error('Expected "options.data.dbPath" to be defined')
      );
      expect(await utils.pathExists(options.data.dbPath)).toEqual(true);

      await utils.removeDir(options.data.tmpDir!); // manual cleanup
    });

    it('should resolve "isNew" to "true" and set "createAuth" to "true" when dbPath is set, but empty', async () => {
      const readdirSpy = jest.spyOn(fspromises, 'readdir');
      const tmpDbPath = await utils.createTmpDir('mongo-mem-getStartOptions1-');

      const mongoServer = new MongoMemoryServer({
        instance: { dbPath: tmpDbPath },
        auth: { enable: true },
      });

      // @ts-expect-error "getStartOptions" is protected
      const options = await mongoServer.getStartOptions();

      expect(options.data.tmpDir).toBeUndefined();
      utils.assertion(
        !utils.isNullOrUndefined(options.data.dbPath),
        new Error('Expected "options.data.dbPath" to be defined')
      );
      expect(await utils.pathExists(options.data.dbPath)).toEqual(true);
      expect(options.data.dbPath).toEqual(tmpDbPath);
      expect(readdirSpy).toHaveBeenCalledTimes(1);
      expect(options.createAuth).toEqual(true);

      await utils.removeDir(tmpDbPath);
    });

    it('should resolve "isNew" to "false" and set "createAuth" to "false" when dbPath is set, but not empty', async () => {
      const readdirSpy = jest.spyOn(fspromises, 'readdir');
      const tmpDbPath = await utils.createTmpDir('mongo-mem-getStartOptions2-');

      // create dummy file, to make the directory non-empty
      await fspromises.writeFile(path.resolve(tmpDbPath, 'testfile'), '');

      const mongoServer = new MongoMemoryServer({
        instance: { dbPath: tmpDbPath },
        auth: { enable: true },
      });

      // @ts-expect-error "getStartOptions" is protected
      const options = await mongoServer.getStartOptions();

      expect(options.data.tmpDir).toBeUndefined();
      utils.assertion(
        !utils.isNullOrUndefined(options.data.dbPath),
        new Error('Expected "options.data.dbPath" to be defined')
      );
      expect(await utils.pathExists(options.data.dbPath)).toEqual(true);
      expect(options.data.dbPath).toEqual(tmpDbPath);
      expect(readdirSpy).toHaveBeenCalledTimes(1);
      expect(options.createAuth).toEqual(false);

      await utils.removeDir(tmpDbPath);
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

      await utils.removeDir(options.data.tmpDir!); // manual cleanup
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

      await utils.removeDir(options.data.tmpDir!); // manual cleanup
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

      await utils.removeDir(options.data.tmpDir!); // manual cleanup
    });

    it('should work with -latest versions [#841]', async () => {
      const mongoServer = new MongoMemoryServer({ binary: { version: 'v6.0-latest' } });

      // @ts-expect-error "getStartOptions" is protected
      await mongoServer.getStartOptions();
    });

    it('should work with -latest versions [#841]', async () => {
      const spy = jest.spyOn(console, 'warn').mockImplementationOnce(() => {});
      const mongoServer = new MongoMemoryServer({ binary: { version: 'junk' } });

      // @ts-expect-error "getStartOptions" is protected
      await mongoServer.getStartOptions();

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls).toMatchSnapshot();
    });
  });

  it('"getDbPath" should return the dbPath', async () => {
    const tmpDir = await utils.createTmpDir('mongo-mem-getDbPath-');
    const mongoServer = new MongoMemoryServer({
      instance: { dbPath: tmpDir },
    });

    await mongoServer.start();

    expect(mongoServer.instanceInfo!.dbPath).toEqual(tmpDir);

    await mongoServer.stop();
    await utils.removeDir(tmpDir);
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

    it('should with defaults return "false" if empty object OR "enable: false"', () => {
      {
        const mongoServer = new MongoMemoryServer({ auth: {} });

        expect(
          // @ts-expect-error "authObjectEnable" is protected
          mongoServer.authObjectEnable()
        ).toStrictEqual(false);
      }
      {
        const mongoServer = new MongoMemoryServer({ auth: { enable: false } });

        expect(
          // @ts-expect-error "authObjectEnable" is protected
          mongoServer.authObjectEnable()
        ).toStrictEqual(false);
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

    await utils.removeDir(
      // @ts-expect-error "_instanceInfo" is protected
      mongoServer._instanceInfo.tmpDir!
    ); // manual cleanup
  });

  describe('server version specific', () => {
    // should use default options that are supported for 7.0 (like not using "ephemeralForTest" by default)
    it('should allow mongodb by default 7.0', async () => {
      const server = await MongoMemoryServer.create({ binary: { version: '7.0.14' } });

      await server.stop();
    });

    it('should not warn if "ephemeralForTest" is used explicitly in mongodb 6.0', async () => {
      jest.spyOn(console, 'warn');
      const server = await MongoMemoryServer.create({
        binary: { version: '6.0.14' },
        instance: { storageEngine: 'ephemeralForTest' },
      });

      expect(console.warn).toHaveBeenCalledTimes(0);

      expect(server.instanceInfo?.storageEngine).toStrictEqual('ephemeralForTest');

      await server.stop();
    });

    it('should not warn if no explicit storage engine is set in 7.0', async () => {
      jest.spyOn(console, 'warn');
      const server = await MongoMemoryServer.create({
        binary: { version: '7.0.14' },
        // instance: { storageEngine: 'ephemeralForTest' },
      });

      expect(console.warn).toHaveBeenCalledTimes(0);

      expect(server.instanceInfo?.storageEngine).toStrictEqual('wiredTiger');

      await server.stop();
    });

    it('should warn if "ephemeralForTest" is used explicitly in mongodb 7.0', async () => {
      const spy = jest.spyOn(console, 'warn').mockImplementationOnce(() => {});
      const server = await MongoMemoryServer.create({
        binary: { version: '7.0.14' },
        instance: { storageEngine: 'ephemeralForTest' },
      });

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls).toMatchSnapshot();

      expect(server.instanceInfo?.storageEngine).toStrictEqual('wiredTiger');

      await server.stop();
    });
  });

  describe('asyncDispose', () => {
    it('should work by default', async () => {
      jest.spyOn(MongoMemoryServer.prototype, 'start');
      jest.spyOn(MongoMemoryServer.prototype, 'stop');
      let outer;
      // would like to test this, but jest seemingly does not support spying on symbols
      // jest.spyOn(MongoMemoryServer.prototype, Symbol.asyncDispose);
      {
        await using server = await MongoMemoryServer.create();
        // use the value and test that it actually runs, as "getUri" will throw is not in "running" state
        server.getUri();
        // reassignment still calls dispose at the *current* scope
        outer = server;
      }
      // not "stopped" because of cleanup
      expect(outer.state).toStrictEqual(MongoMemoryServerStates.new);
      expect(MongoMemoryServer.prototype.start).toHaveBeenCalledTimes(1);
      expect(MongoMemoryServer.prototype.stop).toHaveBeenCalledTimes(1);
      // expect(MongoMemoryServer.prototype[Symbol.asyncDispose]).toHaveBeenCalledTimes(1);
    });

    it('should be able to be disabled', async () => {
      jest.spyOn(MongoMemoryServer.prototype, 'start');
      jest.spyOn(MongoMemoryServer.prototype, 'stop');
      let outer;
      // would like to test this, but jest seemingly does not support spying on symbols
      // jest.spyOn(MongoMemoryServer.prototype, Symbol.asyncDispose);
      {
        await using server = await MongoMemoryServer.create({ dispose: { enabled: false } });
        // use the value and test that it actually runs, as "getUri" will throw is not in "running" state
        server.getUri();
        // reassignment still calls dispose at the *current* scope
        outer = server;
      }
      expect(outer.state).toStrictEqual(MongoMemoryServerStates.running);
      expect(MongoMemoryServer.prototype.start).toHaveBeenCalledTimes(1);
      expect(MongoMemoryServer.prototype.stop).toHaveBeenCalledTimes(0);
      // expect(MongoMemoryServer.prototype[Symbol.asyncDispose]).toHaveBeenCalledTimes(1);
      await outer.stop();
      // not "stopped" because of cleanup
      expect(outer.state).toStrictEqual(MongoMemoryServerStates.new);
    });

    it('should be able to set custom cleanup', async () => {
      jest.spyOn(MongoMemoryServer.prototype, 'start');
      jest.spyOn(MongoMemoryServer.prototype, 'stop');
      let outer;
      // would like to test this, but jest seemingly does not support spying on symbols
      // jest.spyOn(MongoMemoryServer.prototype, Symbol.asyncDispose);
      {
        await using server = await MongoMemoryServer.create({
          dispose: { cleanup: { doCleanup: false } },
        });
        // use the value and test that it actually runs, as "getUri" will throw is not in "running" state
        server.getUri();
        // reassignment still calls dispose at the *current* scope
        outer = server;
      }
      // not "stopped" because of cleanup
      expect(outer.state).toStrictEqual(MongoMemoryServerStates.stopped);
      expect(MongoMemoryServer.prototype.start).toHaveBeenCalledTimes(1);
      expect(MongoMemoryServer.prototype.stop).toHaveBeenCalledTimes(1);
      // expect(MongoMemoryServer.prototype[Symbol.asyncDispose]).toHaveBeenCalledTimes(1);
      await outer.cleanup({ doCleanup: true });
      // not "stopped" because of cleanup
      expect(outer.state).toStrictEqual(MongoMemoryServerStates.new);
    });
  });
});
