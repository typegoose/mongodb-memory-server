/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as tmp from 'tmp';
import * as dbUtil from '../utils';
import MongodbInstance, { MongoInstanceEvents } from '../MongoInstance';
import resolveConfig, { ResolveConfigVariables } from '../resolveConfig';
import getPort from 'get-port';
import { StartBinaryFailedError } from '../errors';

jest.setTimeout(100000); // 10s
tmp.setGracefulCleanup();

let tmpDir: tmp.DirResult;
beforeEach(() => {
  tmpDir = tmp.dirSync({ prefix: 'mongo-mem-', unsafeCleanup: true });
});

afterEach(() => {
  tmpDir.removeCallback();
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
        '--noauth',
        '--replSet',
        'testset',
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
        expect(err.message).toEqual('"instanceOpts.port" is required to be set!');
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
        expect(err.message).toEqual('"instanceOpts.dbPath" is required to be set!');
      }
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

    await expect(
      MongodbInstance.create({
        instance: { port: gotPort, dbPath: tmpDir.name },
        binary: { version },
      })
    ).rejects.toEqual(`Port "${gotPort}" already in use`);

    await mongod.stop();
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
        binary: { version: '4.0.25' }, // explicit version instead of default to not mess it up later
      });
      expect(mongod.mongodProcess!.pid).toBeGreaterThan(0);
      await mongod.stop();
    });

    it('should work with mongodb 4.2', async () => {
      const gotPort = await getPort({ port: 27445 });
      const mongod = await MongodbInstance.create({
        instance: { port: gotPort, dbPath: tmpDir.name },
        binary: { version: '4.2.14' },
      });
      expect(mongod.mongodProcess!.pid).toBeGreaterThan(0);
      await mongod.stop();
    });

    it('should work with mongodb 4.4', async () => {
      const gotPort = await getPort({ port: 27445 });
      const mongod = await MongodbInstance.create({
        instance: { port: gotPort, dbPath: tmpDir.name },
        binary: { version: '4.4.6' },
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
    const mockBinary = 'thisShouldNotExist';

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
    let events: Map<MongoInstanceEvents | string, string>;
    beforeEach(() => {
      mongod = new MongodbInstance({ instance: { port: 1001, dbPath: 'hello' } });
      events = new Map();
      jest.spyOn(mongod, 'emit').mockImplementation((event: string, arg1: string) => {
        events.set(event, arg1);

        return true;
      });
    });
    it('"errorHandler" should emit "instanceRawError" and "instanceError"', () => {
      mongod.errorHandler('hello');

      expect(events.size).toEqual(2);
      expect(events.get(MongoInstanceEvents.instanceRawError)).toEqual('hello');
      expect(events.get(MongoInstanceEvents.instanceError)).toEqual('hello');
    });

    it('"stderrHandler" should emit "instanceSTDERR"', () => {
      mongod.stderrHandler('hello');

      expect(events.size).toEqual(1);
      expect(events.get(MongoInstanceEvents.instanceSTDERR)).toEqual('hello');
    });

    describe('stdoutHandler()', () => {
      // All the lines used to test here should be sourced from actual mongod output!

      // TODO: add test for "mongod instance already running"
      // TODO: add test for "permission denied"
      // TODO: add test for "Data directory .*? not found"
      // TODO: add test for "aborting after"

      it('should emit "instanceReady" when waiting for connections', () => {
        // actual line copied from mongod 4.0.14
        const line =
          '2020-09-30T18:48:58.273+0200 I NETWORK  [initandlisten] waiting for connections on port 45227';

        mongod.stdoutHandler(line);

        expect(events.size).toEqual(2);
        expect(events.get(MongoInstanceEvents.instanceSTDOUT)).toEqual(line);
        expect(events.get(MongoInstanceEvents.instanceReady)).toEqual(undefined);
      });

      it('should emit "instanceError" when port is already in use', () => {
        // actual line copied from mongod 4.0.14
        const line =
          '2020-09-30T19:00:43.555+0200 E STORAGE  [initandlisten] Failed to set up listener: SocketException: Address already in use';

        mongod.stdoutHandler(line);

        expect(events.size).toEqual(2);
        expect(events.get(MongoInstanceEvents.instanceSTDOUT)).toEqual(line);
        expect(events.get(MongoInstanceEvents.instanceError)).toEqual('Port "1001" already in use');
      });

      it('should emit "instanceError" when curl-open-ssl-3 is not found', () => {
        // actual line copied from mongod 4.0.3 (from https://github.com/nodkz/mongodb-memory-server/issues/204#issuecomment-514492136)
        const line =
          "/fm/fm-api/node_modules/.cache/mongodb-memory-server/mongodb-binaries/4.0.3/mongod: /usr/lib/x86_64-linux-gnu/libcurl.so.4: version 'CURL_OPENSSL_3' not found (required by /fm/fm-api/node_modules/.cache/mongodb-memory-server/mongodb-binaries/4.0.3/mongod)";

        mongod.stdoutHandler(line);

        expect(events.size).toEqual(2);
        expect(events.get(MongoInstanceEvents.instanceSTDOUT)).toEqual(line);
        expect(events.get(MongoInstanceEvents.instanceError)).toEqual(
          'libcurl3 is not available on your system. Mongod requires it and cannot be started without it.\n' +
            'You should manually install libcurl3 or try to use an newer version of MongoDB\n'
        );
      });

      it('should emit "instanceError" when curl-open-ssl-4 is not found', () => {
        // actual line copied from mongod 4.0.14 (from https://github.com/nodkz/mongodb-memory-server/issues/313#issue-631429207)
        const line =
          "/usr/src/app/packages/backend/node_modules/.cache/mongodb-memory-server/mongodb-binaries/4.0.14/mongod: /usr/lib/x86_64-linux-gnu/libcurl.so.4: version `CURL_OPENSSL_4' not found (required by /usr/src/app/packages/backend/node_modules/.cache/mongodb-memory-server/mongodb-binaries/4.0.14/mongod)";

        mongod.stdoutHandler(line);

        expect(events.size).toEqual(2);
        expect(events.get(MongoInstanceEvents.instanceSTDOUT)).toEqual(line);
        expect(events.get(MongoInstanceEvents.instanceError)).toEqual(
          'libcurl4 is not available on your system. Mongod requires it and cannot be started without it.\n' +
            'You need to manually install libcurl4\n'
        );
      });

      it('should emit "instancePrimary" when "transition to primary complete" is found', () => {
        // actual line copied from mongod 4.0.14
        const line =
          '2020-09-30T19:19:56.583+0200 I REPL     [rsSync-0] transition to primary complete; database writes are now permitted';

        mongod.stdoutHandler(line);

        expect(events.size).toEqual(2);
        expect(events.get(MongoInstanceEvents.instanceSTDOUT)).toEqual(line);
        expect(events.get(MongoInstanceEvents.instancePrimary)).toEqual(undefined);
        expect(mongod.isInstancePrimary).toEqual(true);
      });

      it('should emit "instanceReplState" when member state is changed', () => {
        // actual line copied from mongod 4.0.14
        const line =
          'STDOUT: 2020-09-30T19:41:48.388+0200 I REPL     [replexec-0] Member 127.0.0.1:34765 is now in state STARTUP';

        mongod.isInstancePrimary = true;
        mongod.stdoutHandler(line);

        expect(events.size).toEqual(2);
        expect(events.get(MongoInstanceEvents.instanceSTDOUT)).toEqual(line);
        expect(events.get(MongoInstanceEvents.instanceReplState)).toEqual('STARTUP');
        expect(mongod.isInstancePrimary).toEqual(false);
      });

      it('should emit "instanceError" when library is missing', () => {
        // actual line copied from mongod 4.?.? (from https://github.com/nodkz/mongodb-memory-server/issues/408)
        // TODO: when finding an actual line, please replace the one below
        const line = 'libcrypto.so.10: cannot open shared object';

        mongod.stdoutHandler(line);

        expect(events.size).toEqual(2);
        expect(events.get(MongoInstanceEvents.instanceSTDOUT)).toEqual(line);
        expect(events.get(MongoInstanceEvents.instanceError)).toEqual(
          'Instance Failed to start because an library file is missing: "libcrypto.so.10"'
        );
      });
    });
  });
});
