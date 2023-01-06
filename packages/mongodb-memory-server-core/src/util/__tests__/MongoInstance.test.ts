/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as tmp from 'tmp';
import * as dbUtil from '../utils';
import MongodbInstance, { MongoInstanceEvents } from '../MongoInstance';
import resolveConfig, { ResolveConfigVariables } from '../resolveConfig';
import getPort from 'get-port';
import {
  GenericMMSError,
  StartBinaryFailedError,
  StdoutInstanceError,
  UnexpectedCloseError,
} from '../errors';
import { assertIsError } from '../../__tests__/testUtils/test_utils';

jest.setTimeout(100000); // 10s
tmp.setGracefulCleanup();

let tmpDir: tmp.DirResult;
beforeEach(() => {
  tmpDir = tmp.dirSync({ prefix: 'mongo-mem-', unsafeCleanup: true });
});

afterEach(() => {
  tmpDir.removeCallback();
  jest.restoreAllMocks();
});

describe('MongodbInstance', () => {
  let version: string;
  beforeAll(() => {
    const tmpVersion = resolveConfig(ResolveConfigVariables.VERSION);
    dbUtil.assertion(
      typeof tmpVersion === 'string',
      new Error('Expected "version" to be an string')
    );
    version = tmpVersion;
  });

  describe('prepareCommandArgs', () => {
    it('should prepare command args', () => {
      const inst = new MongodbInstance({
        instance: {
          port: 27333,
          dbPath: tmpDir.name,
          storageEngine: 'ephemeralForTest',
        },
      });
      expect(inst.prepareCommandArgs()).toEqual([
        '--port',
        '27333',
        '--dbpath',
        tmpDir.name,
        '--storageEngine',
        'ephemeralForTest',
        '--noauth',
      ]);
    });

    it('should allow specifying replSet', () => {
      const inst = new MongodbInstance({
        instance: {
          port: 27555,
          dbPath: tmpDir.name,
          replSet: 'testset',
        },
      });
      expect(inst.prepareCommandArgs()).toEqual([
        '--port',
        '27555',
        '--dbpath',
        tmpDir.name,
        '--replSet',
        'testset',
        '--noauth',
      ]);
    });

    it('should be able to enable auth', () => {
      const inst = new MongodbInstance({
        instance: {
          port: 27555,
          dbPath: tmpDir.name,
          auth: true,
        },
      });
      expect(inst.prepareCommandArgs()).toEqual([
        '--port',
        '27555',
        '--dbpath',
        tmpDir.name,
        '--auth',
      ]);
    });

    it('should be able to pass arbitrary args', () => {
      const args = ['--notablescan', '--nounixsocket'];
      const inst = new MongodbInstance({
        instance: {
          port: 27555,
          dbPath: tmpDir.name,
          args,
        },
      });
      expect(inst.prepareCommandArgs()).toEqual(
        ['--port', '27555', '--dbpath', tmpDir.name, '--noauth'].concat(args)
      );
    });

    it('should throw an error if no port is provided', () => {
      const inst = new MongodbInstance({
        instance: {
          dbPath: tmpDir.name,
        },
      });
      try {
        inst.prepareCommandArgs();
        fail('Expected prepareCommandArgs to throw');
      } catch (err) {
        assertIsError(err);
        expect(err.message).toMatchSnapshot();
      }
    });

    it('should throw an error if no dbpath is provided', () => {
      const inst = new MongodbInstance({
        instance: {
          port: 27555,
        },
      });
      try {
        inst.prepareCommandArgs();
        fail('Expected prepareCommandArgs to throw');
      } catch (err) {
        assertIsError(err);
        expect(err.message).toMatchSnapshot();
      }
    });

    it('should add "keyfile" argument when auth is enabled and is a replset', () => {
      const keyfileLocation = '/dev/null';
      const replsetName = 'hello';
      const inst = new MongodbInstance({
        instance: {
          port: 27555,
          dbPath: tmpDir.name,
          auth: true,
          replSet: replsetName,
          keyfileLocation: keyfileLocation,
        },
      });
      expect(inst.prepareCommandArgs()).toEqual([
        '--port',
        '27555',
        '--dbpath',
        tmpDir.name,
        '--replSet',
        replsetName,
        '--auth',
        '--keyFile',
        keyfileLocation,
      ]);
    });
  });

  it('should start instance on port specific port', async () => {
    const gotPort = await getPort({ port: 27333 });
    const mongod = await MongodbInstance.create({
      instance: { port: gotPort, dbPath: tmpDir.name },
      binary: { version },
    });

    expect(mongod.mongodProcess!.pid).toBeGreaterThan(0);

    await mongod.stop();
  });

  it('should throw error if port is busy', async () => {
    const gotPort = await getPort({ port: 27444 });
    const mongod = await MongodbInstance.create({
      instance: { port: gotPort, dbPath: tmpDir.name },
      binary: { version },
    });

    try {
      await MongodbInstance.create({
        instance: { port: gotPort, dbPath: tmpDir.name },
        binary: { version },
      });

      fail('Expected to Fail');
    } catch (err) {
      expect(err).toBeInstanceOf(StdoutInstanceError);
      assertIsError(err); // has to be used, because there is not typeguard from "expect(variable).toBeInstanceOf"
      expect(err.message).toEqual(`Port "${gotPort}" already in use`);
    } finally {
      await mongod.stop();
    }
  });

  it('should wait until childprocess and killerprocess are killed', async () => {
    const gotPort = await getPort({ port: 27445 });
    const mongod: MongodbInstance = await MongodbInstance.create({
      instance: { port: gotPort, dbPath: tmpDir.name },
      binary: { version },
    });
    const pid: any = mongod.mongodProcess!.pid;
    const killerPid: any = mongod.killerProcess!.pid;
    expect(pid).toBeGreaterThan(0);
    expect(killerPid).toBeGreaterThan(0);

    expect(dbUtil.isAlive(pid)).toBeTruthy();
    expect(dbUtil.isAlive(killerPid)).toBeTruthy();
    await mongod.stop();
    expect(dbUtil.isAlive(pid)).toBeFalsy();
    expect(dbUtil.isAlive(killerPid)).toBeFalsy();
  });

  describe('should work with mongodb LTS releases', () => {
    it('should work with mongodb 4.0', async () => {
      const gotPort = await getPort({ port: 27445 });
      const mongod = await MongodbInstance.create({
        instance: { port: gotPort, dbPath: tmpDir.name },
        binary: { version: '4.0.28' }, // explicit version instead of default to not mess it up later
      });
      expect(mongod.mongodProcess!.pid).toBeGreaterThan(0);
      await mongod.stop();
    });

    it('should work with mongodb 4.2', async () => {
      const gotPort = await getPort({ port: 27445 });
      const mongod = await MongodbInstance.create({
        instance: { port: gotPort, dbPath: tmpDir.name },
        binary: { version: '4.2.18' },
      });
      expect(mongod.mongodProcess!.pid).toBeGreaterThan(0);
      await mongod.stop();
    });

    it('should work with mongodb 4.4', async () => {
      const gotPort = await getPort({ port: 27445 });
      const mongod = await MongodbInstance.create({
        instance: { port: gotPort, dbPath: tmpDir.name },
        binary: { version: '4.4.13' },
      });
      expect(mongod.mongodProcess!.pid).toBeGreaterThan(0);
      await mongod.stop();
    });

    it('should work with mongodb 5.0', async () => {
      const gotPort = await getPort({ port: 27445 });
      const mongod = await MongodbInstance.create({
        instance: { port: gotPort, dbPath: tmpDir.name },
        binary: { version: '5.0.13' },
      });
      expect(mongod.mongodProcess!.pid).toBeGreaterThan(0);
      await mongod.stop();
    });

    it('should work with mongodb 6.0', async () => {
      const gotPort = await getPort({ port: 27445 });
      const mongod = await MongodbInstance.create({
        instance: { port: gotPort, dbPath: tmpDir.name },
        binary: { version: '6.0.0' },
      });
      expect(mongod.mongodProcess!.pid).toBeGreaterThan(0);
      await mongod.stop();
    });
  });

  it('"kill" should not call "killProcess" if no childProcesses are not running', async () => {
    const mongod = new MongodbInstance({});
    jest.spyOn(dbUtil, 'killProcess');
    await mongod.stop();

    expect(dbUtil.killProcess).not.toBeCalled();
  });

  it('"_launchMongod" should throw an error if "mongodProcess.pid" is undefined', () => {
    const mongod = new MongodbInstance({ instance: { port: 0, dbPath: '' } }); // dummy values - they shouldnt matter
    const mockBinary = '/tmp/thisShouldNotExist';

    try {
      mongod._launchMongod(mockBinary);
      fail('Expected "_launchMongod" to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(StartBinaryFailedError);
      expect(JSON.stringify(err)).toMatchSnapshot(); // this is to test all the custom values on the error
    }
  });

  describe('test events', () => {
    let mongod: MongodbInstance;
    let events: Map<MongoInstanceEvents | string, unknown[]>;
    beforeEach(() => {
      mongod = new MongodbInstance({ instance: { port: 1001, dbPath: 'hello' } });
      events = new Map();
      jest.spyOn(mongod, 'emit').mockImplementation((event: string, ...args) => {
        events.set(event, args);

        return true;
      });
    });
    it('"errorHandler" should emit "instanceRawError" and "instanceError"', () => {
      mongod.errorHandler('hello');

      expect(events.size).toEqual(2);
      expect(events.get(MongoInstanceEvents.instanceRawError)).toEqual(['hello']);
      expect(events.get(MongoInstanceEvents.instanceError)).toEqual(['hello']);
    });

    it('"stderrHandler" should emit "instanceSTDERR"', () => {
      mongod.stderrHandler('hello');

      expect(events.size).toEqual(1);
      expect(events.get(MongoInstanceEvents.instanceSTDERR)).toEqual(['hello']);
    });

    it('"closeHandler" should emit "instanceClosed"', () => {
      // test both code and signal
      {
        events.clear();
        mongod.closeHandler(0, 'SIG');

        expect(events.size).toEqual(1);
        expect(events.get(MongoInstanceEvents.instanceClosed)).toEqual([0, 'SIG']);
      }
      // test only code
      {
        events.clear();
        mongod.closeHandler(0, null);

        expect(events.size).toEqual(1);
        expect(events.get(MongoInstanceEvents.instanceClosed)).toEqual([0, null]);
      }
      // test only Signal
      {
        events.clear();
        mongod.closeHandler(null, 'SIG');

        expect(events.size).toEqual(2);
        expect(events.get(MongoInstanceEvents.instanceClosed)).toEqual([null, 'SIG']);

        const event = events.get(MongoInstanceEvents.instanceError)?.[0];
        expect(event).toBeInstanceOf(UnexpectedCloseError);
        assertIsError(event); // has to be used, because there is not typeguard from "expect(variable).toBeInstanceOf"
        expect(event.message).toMatchSnapshot();
      }
    });

    it('"closeHandler" should emit "instanceError" with extra information on "SIGILL"', () => {
      // test SIGILL
      mongod.closeHandler(null, 'SIGILL');

      expect(events.size).toEqual(2);
      expect(events.get(MongoInstanceEvents.instanceClosed)).toEqual([null, 'SIGILL']);

      const event = events.get(MongoInstanceEvents.instanceError)?.[0];
      expect(event).toBeInstanceOf(UnexpectedCloseError);
      assertIsError(event); // has to be used, because there is not typeguard from "expect(variable).toBeInstanceOf"
      expect(event.message).toMatchSnapshot();
    });

    it('"closeHandler" should emit "instanceError" with non-0 or non-12 code', () => {
      // test code non-0
      {
        events.clear();
        mongod.closeHandler(1, null);

        expect(events.size).toEqual(2);
        expect(events.get(MongoInstanceEvents.instanceClosed)).toEqual([1, null]);

        const event = events.get(MongoInstanceEvents.instanceError)?.[0];
        expect(event).toBeInstanceOf(UnexpectedCloseError);
        assertIsError(event); // has to be used, because there is not typeguard from "expect(variable).toBeInstanceOf"
        expect(event.message).toMatchSnapshot();
      }

      // test signal
      {
        events.clear();
        mongod.closeHandler(null, 'SIG');

        expect(events.size).toEqual(2);
        expect(events.get(MongoInstanceEvents.instanceClosed)).toEqual([null, 'SIG']);

        const event = events.get(MongoInstanceEvents.instanceError)?.[0];
        expect(event).toBeInstanceOf(UnexpectedCloseError);
        assertIsError(event); // has to be used, because there is not typeguard from "expect(variable).toBeInstanceOf"
        expect(event.message).toMatchSnapshot();
      }
    });

    describe('stdoutHandler()', () => {
      // All the lines used to test here should be sourced from actual mongod output!

      // TODO: add test for "aborting after"

      it('should emit "instanceReady" when waiting for connections', () => {
        // actual line copied from mongod 4.0.14
        const line =
          '2020-09-30T18:48:58.273+0200 I NETWORK  [initandlisten] waiting for connections on port 45227';

        mongod.stdoutHandler(line);

        expect(events.size).toEqual(2);
        expect(events.get(MongoInstanceEvents.instanceSTDOUT)).toEqual([line]);
        expect(events.get(MongoInstanceEvents.instanceReady)).toEqual([undefined]);
      });

      it('should emit "instanceError" when port is already in use', () => {
        // actual line copied from mongod 4.0.14
        const line =
          '2020-09-30T19:00:43.555+0200 E STORAGE  [initandlisten] Failed to set up listener: SocketException: Address already in use';

        mongod.stdoutHandler(line);

        expect(events.size).toEqual(2);
        expect(events.get(MongoInstanceEvents.instanceSTDOUT)).toEqual([line]);

        const event = events.get(MongoInstanceEvents.instanceError)?.[0];
        expect(event).toBeInstanceOf(StdoutInstanceError);
        assertIsError(event); // has to be used, because there is not typeguard from "expect(variable).toBeInstanceOf"
        expect(event.message).toMatchSnapshot();
      });

      it('should emit "instanceError" when curl-open-ssl-3 is not found', () => {
        // actual line copied from mongod 4.0.3 (from https://github.com/nodkz/mongodb-memory-server/issues/204#issuecomment-514492136)
        const line =
          "/fm/fm-api/node_modules/.cache/mongodb-memory-server/mongodb-binaries/4.0.3/mongod: /usr/lib/x86_64-linux-gnu/libcurl.so.4: version 'CURL_OPENSSL_3' not found (required by /fm/fm-api/node_modules/.cache/mongodb-memory-server/mongodb-binaries/4.0.3/mongod)";

        mongod.stdoutHandler(line);

        expect(events.size).toEqual(2);
        expect(events.get(MongoInstanceEvents.instanceSTDOUT)).toEqual([line]);

        const event = events.get(MongoInstanceEvents.instanceError)?.[0];
        expect(event).toBeInstanceOf(StdoutInstanceError);
        assertIsError(event); // has to be used, because there is not typeguard from "expect(variable).toBeInstanceOf"
        expect(event.message).toMatchSnapshot();
      });

      it('should emit "instanceError" when curl-open-ssl-4 is not found', () => {
        // actual line copied from mongod 4.0.14 (from https://github.com/nodkz/mongodb-memory-server/issues/313#issue-631429207)
        const line =
          "/usr/src/app/packages/backend/node_modules/.cache/mongodb-memory-server/mongodb-binaries/4.0.14/mongod: /usr/lib/x86_64-linux-gnu/libcurl.so.4: version `CURL_OPENSSL_4' not found (required by /usr/src/app/packages/backend/node_modules/.cache/mongodb-memory-server/mongodb-binaries/4.0.14/mongod)";

        mongod.stdoutHandler(line);

        expect(events.size).toEqual(2);
        expect(events.get(MongoInstanceEvents.instanceSTDOUT)).toEqual([line]);

        const event = events.get(MongoInstanceEvents.instanceError)?.[0];
        expect(event).toBeInstanceOf(StdoutInstanceError);
        assertIsError(event); // has to be used, because there is not typeguard from "expect(variable).toBeInstanceOf"
        expect(event.message).toMatchSnapshot();
      });

      it('should emit "instancePrimary" when "transition to primary complete" is found', () => {
        // actual line copied from mongod 4.0.14
        const line =
          '2020-09-30T19:19:56.583+0200 I REPL     [rsSync-0] transition to primary complete; database writes are now permitted';

        mongod.stdoutHandler(line);

        expect(events.size).toEqual(2);
        expect(events.get(MongoInstanceEvents.instanceSTDOUT)).toEqual([line]);
        expect(events.get(MongoInstanceEvents.instancePrimary)).toEqual([undefined]);
        expect(mongod.isInstancePrimary).toEqual(true);
      });

      it('should emit "instanceReplState" when member state is changed', () => {
        // actual line copied from mongod 4.0.14
        const line =
          '2021-08-27T18:44:01.4895064Z 2021-08-27T18:44:01.471+0000 I REPL     [replication-1] transition to RECOVERING from STARTUP2';

        mongod.isInstancePrimary = true;
        mongod.stdoutHandler(line);

        expect(events.size).toEqual(2);
        expect(events.get(MongoInstanceEvents.instanceSTDOUT)).toEqual([line]);
        expect(events.get(MongoInstanceEvents.instanceReplState)).toEqual(['RECOVERING']);
        expect(mongod.isInstancePrimary).toEqual(false);
      });

      it('should emit "instanceError" when library is missing', () => {
        // actual line copied from mongod 4.?.? (from https://github.com/nodkz/mongodb-memory-server/issues/408)
        // TODO: when finding an actual line, please replace the one below
        const line = 'libcrypto.so.10: cannot open shared object';

        mongod.stdoutHandler(line);

        expect(events.size).toEqual(2);
        expect(events.get(MongoInstanceEvents.instanceSTDOUT)).toEqual([line]);

        const event = events.get(MongoInstanceEvents.instanceError)?.[0];
        expect(event).toBeInstanceOf(StdoutInstanceError);
        assertIsError(event); // has to be used, because there is not typeguard from "expect(variable).toBeInstanceOf"
        expect(event.message).toMatchSnapshot();
      });

      describe('should emit "instanceError" when "excepetion in initAndListen" is thrown', () => {
        it('DbPathInUse (Not a directory)', () => {
          // actual line copied from mongod 4.0.27
          // can be reproduced with "mongodb --dbpath /dev/null"
          const line =
            '2021-11-01T12:05:02.810+0100 I STORAGE  [initandlisten] exception in initAndListen: DBPathInUse: Unable to create/open the lock file: /dev/null/mongod.lock (Not a directory). Ensure the user executing mongod is the owner of the lock file and has the appropriate permissions. Also make sure that another mongod instance is not already running on the /dev/null directory, terminating';

          mongod.stdoutHandler(line);

          expect(events.size).toEqual(2);
          expect(events.get(MongoInstanceEvents.instanceSTDOUT)).toEqual([line]);

          const event = events.get(MongoInstanceEvents.instanceError)?.[0];
          expect(event).toBeInstanceOf(StdoutInstanceError);
          assertIsError(event); // has to be used, because there is not typeguard from "expect(variable).toBeInstanceOf"
          expect(event.message).toMatchSnapshot();
        });

        it('DbPathInUse (already running)', () => {
          // actual line copied from mongod 4.0.27
          // can be reproduced with having one instance of "mongodb --dbpath /tmp/db --port 3000" and trying another with "mongodb --dbpath /tmp/db --port 3001"
          const line =
            '2021-11-01T13:03:56.660+0100 I STORAGE  [initandlisten] exception in initAndListen: DBPathInUse: Unable to lock the lock file: /tmp/hellodb/mongod.lock (Resource temporarily unavailable). Another mongod instance is already running on the /tmp/hellodb directory, terminating';

          mongod.stdoutHandler(line);

          expect(events.size).toEqual(2);
          expect(events.get(MongoInstanceEvents.instanceSTDOUT)).toEqual([line]);

          const event = events.get(MongoInstanceEvents.instanceError)?.[0];
          expect(event).toBeInstanceOf(StdoutInstanceError);
          assertIsError(event); // has to be used, because there is not typeguard from "expect(variable).toBeInstanceOf"
          expect(event.message).toMatchSnapshot();
        });

        it('Location28596', () => {
          // actual line copied from mongod 4.0.27
          // can be reproduced with "mongodb --dbpath /root" (while not being root)
          const line =
            '2021-11-01T12:05:34.302+0100 I STORAGE  [initandlisten] exception in initAndListen: Location28596: Unable to determine status of lock file in the data directory /root: boost::filesystem::status: Permission denied: "/root/mongod.lock", terminating';

          mongod.stdoutHandler(line);

          expect(events.size).toEqual(2);
          expect(events.get(MongoInstanceEvents.instanceSTDOUT)).toEqual([line]);

          const event = events.get(MongoInstanceEvents.instanceError)?.[0];
          expect(event).toBeInstanceOf(StdoutInstanceError);
          assertIsError(event); // has to be used, because there is not typeguard from "expect(variable).toBeInstanceOf"
          expect(event.message).toMatchSnapshot();
        });

        it('NonExistentPath', () => {
          // actual line copied from mongod 4.0.27
          // can be reproduced with "mongodb --dbpath /root" (while not being root)
          const line =
            "2021-11-01T12:08:05.077+0100 I STORAGE  [initandlisten] exception in initAndListen: NonExistentPath: Data directory /tmp/hello not found. Create the missing directory or specify another path using (1) the --dbpath command line option, or (2) by adding the 'storage.dbPath' option in the configuration file., terminating";

          mongod.stdoutHandler(line);

          expect(events.size).toEqual(2);
          expect(events.get(MongoInstanceEvents.instanceSTDOUT)).toEqual([line]);

          const event = events.get(MongoInstanceEvents.instanceError)?.[0];
          expect(event).toBeInstanceOf(StdoutInstanceError);
          assertIsError(event); // has to be used, because there is not typeguard from "expect(variable).toBeInstanceOf"
          expect(event.message).toMatchSnapshot();
        });

        it('DBException in initAndListen', () => {
          // actual line copied from mongod 6.1.0
          // can be reproduced with "mongodb --storageEngine ephemeralForTest"
          const line =
            '{"t":{"$date":"2022-09-01T08:54:54.598+00:00"},"s":"E",  "c":"CONTROL",  "id":20557,   "ctx":"initandlisten","msg":"DBException in initAndListen, terminating","attr":{"error":"Location18656: Cannot start server with an unknown storage engine: ephemeralForTest"}}';

          mongod.stdoutHandler(line);

          expect(events.size).toEqual(2);
          expect(events.get(MongoInstanceEvents.instanceSTDOUT)).toEqual([line]);

          const event = events.get(MongoInstanceEvents.instanceError)?.[0];
          expect(event).toBeInstanceOf(StdoutInstanceError);
          assertIsError(event); // has to be used, because there is not typeguard from "expect(variable).toBeInstanceOf"
          expect(event.message).toMatchSnapshot();
        });
      });
    });

    describe('checkErrorInLine()', () => {
      it('should emit "instanceError" when shared libraries fail to load', () => {
        // actual line copied from mongod 5.0.3
        const line =
          '/root/.cache/mongodb-binaries/mongod-x64-ubuntu-5.0.3: error while loading shared libraries: libcrypto.so.1.1: cannot open shared object file: No such file or directory';

        // @ts-expect-error "checkErrorInLine" is protected
        mongod.checkErrorInLine(line);

        expect(events.size).toEqual(1);

        const event = events.get(MongoInstanceEvents.instanceError)?.[0];
        expect(event).toBeInstanceOf(StdoutInstanceError);
        assertIsError(event); // has to be used, because there is not typeguard from "expect(variable).toBeInstanceOf"
        expect(event.message).toMatchSnapshot();
      });
    });

    it('"start" should emit a "instanceError" when timeout is reached and throw a error', async () => {
      mongod.instanceOpts['launchTimeout'] = 1000;

      jest.spyOn(mongod, '_launchMongod').mockImplementation(
        // @ts-expect-error The following is not meant to work, but in this test we dont care about that result, only that it never fires any events
        () => {
          return { pid: 0 }; // required for a direct check afterwards
        }
      );
      jest.spyOn(mongod, '_launchKiller').mockImplementation(
        // @ts-expect-error The following is not meant to work, but in this test we dont care about that result, only that it never fires any events
        () => undefined
      );
      jest.spyOn(mongod, 'stop').mockImplementation(
        // @ts-expect-error The following is not meant to work, but in this test we dont care about that result, only that it never fires any events
        () => undefined
      );

      try {
        await mongod.start();
        fail('Expected "start" to throw');
      } catch (err) {
        // this error could be thrown through "once => instanceError" or from the timeout directly, but it does not matter where it gets thrown from
        expect(err).toBeInstanceOf(GenericMMSError);
        assertIsError(err);
        expect(err.message).toMatchSnapshot();

        expect(events.size).toEqual(1);

        const event = events.get(MongoInstanceEvents.instanceError)?.[0];
        expect(event).toBeInstanceOf(GenericMMSError);
        assertIsError(event);
        expect(event.message).toStrictEqual(err.message);
        expect(err).toBe(event); // reference compare, because these 2 values should be the same
      }
    });
  });
});
