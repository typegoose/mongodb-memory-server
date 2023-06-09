import { EventEmitter } from 'events';
import { MongoMemoryServer, AutomaticAuth, MongoMemoryServerOpts } from './MongoMemoryServer';
import {
  assertion,
  authDefault,
  Cleanup,
  createTmpDir,
  ensureAsync,
  generateDbName,
  getHost,
  isNullOrUndefined,
  ManagerAdvanced,
  removeDir,
  statPath,
  uriTemplate,
} from './util/utils';
import { MongoBinaryOpts } from './util/MongoBinary';
import debug from 'debug';
import { MongoClient, MongoError } from 'mongodb';
import {
  MongoInstanceEvents,
  MongoMemoryInstanceOpts,
  MongoMemoryInstanceOptsBase,
  StorageEngine,
} from './util/MongoInstance';
import { SpawnOptions } from 'child_process';
import {
  AuthNotObjectError,
  InstanceInfoError,
  ReplsetCountLowError,
  StateError,
  WaitForPrimaryTimeoutError,
} from './util/errors';
import { promises as fs } from 'fs';
import { resolve } from 'path';

const log = debug('MongoMS:MongoMemoryReplSet');

// "setImmediate" is used to ensure the functions are async, otherwise the process might evaluate the one function before other async functions (like "start")
// and so skip to next state check or return before actually ready

/**
 * Replica set specific options.
 */
export interface ReplSetOpts {
  /**
   * enable auth ("--auth" / "--noauth")
   * @default false
   */
  auth?: boolean | AutomaticAuth; // TODO: remove "boolean" option next major version
  /**
   * additional command line arguments passed to `mongod`
   * @default []
   */
  args?: string[];
  /**
   * if this number is bigger than "instanceOpts.length", more "generic" servers get started
   * if this number is lower than "instanceOpts.length", no more "generic" servers get started (server count will be "instanceOpts.length")
   * @default 1
   */
  count?: number;
  /**
   * add an database into the uri (in mongodb its the auth database, in mongoose its the default database for models)
   * @default ""
   */
  dbName?: string;
  /**
   * bind to all IP addresses specify `::,0.0.0.0`
   * @default '127.0.0.1'
   */
  ip?: string;
  /**
   * replSet name
   * @default 'testset'
   */
  name?: string;
  /**
   * Childprocess spawn options
   * @default {}
   */
  spawn?: SpawnOptions;
  /**
   *`mongod` storage engine type
   * @default 'ephemeralForTest'
   */
  storageEngine?: StorageEngine;
  /**
   * Options for "rsConfig"
   * @default {}
   */
  configSettings?: MongoMemoryReplSetConfigSettings;
}

/**
 * Options for "rsConfig"
 */
export interface MongoMemoryReplSetConfigSettings {
  chainingAllowed?: boolean;
  heartbeatTimeoutSecs?: number;
  heartbeatIntervalMillis?: number;
  electionTimeoutMillis?: number;
  catchUpTimeoutMillis?: number;
}

/**
 * Options for the replSet
 */
export interface MongoMemoryReplSetOpts {
  /**
   * Specific Options to use for some instances
   */
  instanceOpts: MongoMemoryInstanceOptsBase[];
  /**
   * Binary Options used for all instances
   */
  binary: MongoBinaryOpts;
  /**
   * Options used for all instances
   * -> gets overwritten by specific "instanceOpts"
   */
  replSet: ReplSetOpts;
}

/**
 * Enum for "_state" inside "MongoMemoryReplSet"
 */
export enum MongoMemoryReplSetStates {
  init = 'init',
  running = 'running',
  stopped = 'stopped',
}

/**
 * All Events for "MongoMemoryReplSet"
 */
export enum MongoMemoryReplSetEvents {
  stateChange = 'stateChange',
}

export interface MongoMemoryReplSet extends EventEmitter {
  // Overwrite EventEmitter's definitions (to provide at least the event names)
  emit(event: MongoMemoryReplSetEvents, ...args: any[]): boolean;
  on(event: MongoMemoryReplSetEvents, listener: (...args: any[]) => void): this;
  once(event: MongoMemoryReplSetEvents, listener: (...args: any[]) => void): this;
}

/**
 * Class for managing an replSet
 */
export class MongoMemoryReplSet extends EventEmitter implements ManagerAdvanced {
  /**
   * All servers this ReplSet instance manages
   */
  servers: MongoMemoryServer[] = [];

  // "!" is used, because the getters are used instead of the "_" values
  /** Options for individual instances */
  protected _instanceOpts!: MongoMemoryInstanceOptsBase[];
  /** Options for the Binary across all instances */
  protected _binaryOpts!: MongoBinaryOpts;
  /** Options for the Replset itself and defaults for instances */
  protected _replSetOpts!: Required<ReplSetOpts>;
  /** TMPDIR for the keyfile, when auth is used */
  protected _keyfiletmp?: string;

  protected _state: MongoMemoryReplSetStates = MongoMemoryReplSetStates.stopped;
  protected _ranCreateAuth: boolean = false;

  constructor(opts: Partial<MongoMemoryReplSetOpts> = {}) {
    super();

    this.binaryOpts = { ...opts.binary };
    this.instanceOpts = opts.instanceOpts ?? [];
    this.replSetOpts = { ...opts.replSet };
  }

  /**
   * Change "this._state" to "newState" and emit "newState"
   * @param newState The new State to set & emit
   */
  protected stateChange(newState: MongoMemoryReplSetStates, ...args: any[]): void {
    this._state = newState;
    this.emit(MongoMemoryReplSetEvents.stateChange, newState, ...args);
  }

  /**
   * Create an instance of "MongoMemoryReplSet" and call start
   * @param opts Options for the ReplSet
   */
  static async create(opts?: Partial<MongoMemoryReplSetOpts>): Promise<MongoMemoryReplSet> {
    log('create: Called .create() method');
    const replSet = new this({ ...opts });
    await replSet.start();

    return replSet;
  }

  /**
   * Get Current state of this class
   */
  get state(): MongoMemoryReplSetStates {
    return this._state;
  }

  /**
   * Get & Set "instanceOpts"
   * @throws if "state" is not "stopped"
   */
  get instanceOpts(): MongoMemoryInstanceOptsBase[] {
    return this._instanceOpts;
  }

  set instanceOpts(val: MongoMemoryInstanceOptsBase[]) {
    assertionIsMMSRSState(MongoMemoryReplSetStates.stopped, this._state);
    this._instanceOpts = val;
  }

  /**
   * Get & Set "binaryOpts"
   * @throws if "state" is not "stopped"
   */
  get binaryOpts(): MongoBinaryOpts {
    return this._binaryOpts;
  }

  set binaryOpts(val: MongoBinaryOpts) {
    assertionIsMMSRSState(MongoMemoryReplSetStates.stopped, this._state);
    this._binaryOpts = val;
  }

  /**
   * Get & Set "replSetOpts"
   * (Applies defaults)
   * @throws if "state" is not "stopped"
   */
  get replSetOpts(): ReplSetOpts {
    return this._replSetOpts;
  }

  set replSetOpts(val: ReplSetOpts) {
    assertionIsMMSRSState(MongoMemoryReplSetStates.stopped, this._state);
    const defaults: Required<ReplSetOpts> = {
      auth: false,
      args: [],
      name: 'testset',
      count: 1,
      dbName: generateDbName(),
      ip: '127.0.0.1',
      spawn: {},
      storageEngine: 'ephemeralForTest',
      configSettings: {},
    };
    this._replSetOpts = { ...defaults, ...val };

    assertion(this._replSetOpts.count > 0, new ReplsetCountLowError(this._replSetOpts.count));

    // setting this for sanity
    if (typeof this._replSetOpts.auth === 'boolean') {
      this._replSetOpts.auth = { enable: this._replSetOpts.auth };
    }

    // only set default is enabled
    if (this._replSetOpts.auth.enable) {
      this._replSetOpts.auth = authDefault(this._replSetOpts.auth);
    }
  }

  /**
   * Helper function to determine if "auth" should be enabled
   * This function expectes to be run after the auth object has been transformed to a object
   * @returns "true" when "auth" should be enabled
   */
  protected enableAuth(): boolean {
    if (isNullOrUndefined(this._replSetOpts.auth)) {
      return false;
    }

    assertion(typeof this._replSetOpts.auth === 'object', new AuthNotObjectError());

    return typeof this._replSetOpts.auth.enable === 'boolean' // if "this._replSetOpts.auth.enable" is defined, use that
      ? this._replSetOpts.auth.enable
      : false; // if "this._replSetOpts.auth.enable" is not defined, default to false
  }

  /**
   * Returns instance options suitable for a MongoMemoryServer.
   * @param baseOpts Options to merge with
   * @param keyfileLocation The Keyfile location if "auth" is used
   */
  protected getInstanceOpts(
    baseOpts: MongoMemoryInstanceOptsBase = {},
    keyfileLocation?: string
  ): MongoMemoryInstanceOpts {
    const enableAuth: boolean = this.enableAuth();

    const opts: MongoMemoryInstanceOpts = {
      auth: enableAuth,
      args: this._replSetOpts.args,
      dbName: this._replSetOpts.dbName,
      ip: this._replSetOpts.ip,
      replSet: this._replSetOpts.name,
      storageEngine: this._replSetOpts.storageEngine,
    };

    if (!isNullOrUndefined(keyfileLocation)) {
      opts.keyfileLocation = keyfileLocation;
    }

    if (baseOpts.args) {
      opts.args = this._replSetOpts.args.concat(baseOpts.args);
    }
    if (baseOpts.port) {
      opts.port = baseOpts.port;
    }
    if (baseOpts.dbPath) {
      opts.dbPath = baseOpts.dbPath;
    }
    if (baseOpts.storageEngine) {
      opts.storageEngine = baseOpts.storageEngine;
    }
    if (baseOpts.replicaMemberConfig) {
      opts.replicaMemberConfig = baseOpts.replicaMemberConfig;
    }
    if (baseOpts.launchTimeout) {
      opts.launchTimeout = baseOpts.launchTimeout;
    }

    log('getInstanceOpts: instance opts:', opts);

    return opts;
  }

  /**
   * Returns an mongodb URI that is setup with all replSet servers
   * @param otherDb add an database into the uri (in mongodb its the auth database, in mongoose its the default database for models)
   * @param otherIp change the ip in the generated uri, default will otherwise always be "127.0.0.1"
   * @throws if state is not "running"
   * @throws if an server doesnt have "instanceInfo.port" defined
   * @returns an valid mongo URI, by the definition of https://docs.mongodb.com/manual/reference/connection-string/
   */
  getUri(otherDb?: string, otherIp?: string): string {
    log('getUri:', this.state);
    switch (this.state) {
      case MongoMemoryReplSetStates.running:
      case MongoMemoryReplSetStates.init:
        break;
      case MongoMemoryReplSetStates.stopped:
      default:
        throw new StateError(
          [MongoMemoryReplSetStates.running, MongoMemoryReplSetStates.init],
          this.state
        );
    }

    const hosts = this.servers
      .map((s) => {
        const port = s.instanceInfo?.port;
        assertion(!isNullOrUndefined(port), new Error('Instance Port is undefined!'));
        const ip = otherIp || '127.0.0.1';

        return `${ip}:${port}`;
      })
      .join(',');

    return uriTemplate(hosts, undefined, generateDbName(otherDb), [
      `replicaSet=${this._replSetOpts.name}`,
    ]);
  }

  /**
   * Start underlying `mongod` instances.
   * @throws if state is already "running"
   */
  async start(): Promise<void> {
    log('start:', this.state);
    switch (this.state) {
      case MongoMemoryReplSetStates.stopped:
        break;
      case MongoMemoryReplSetStates.running:
      default:
        throw new StateError([MongoMemoryReplSetStates.stopped], this.state);
    }
    this.stateChange(MongoMemoryReplSetStates.init); // this needs to be executed before "setImmediate"

    await ensureAsync()
      .then(() => this.initAllServers())
      .then(() => this._initReplSet())
      .catch(async (err) => {
        if (!debug.enabled('MongoMS:MongoMemoryReplSet')) {
          console.warn(
            'Starting the MongoMemoryReplSet Instance failed, enable debug log for more information. Error:\n',
            err
          );
        }

        log('ensureAsync chain threw a Error: ', err);

        await this.stop({ doCleanup: false, force: false }); // still try to close the instance that was spawned, without cleanup for investigation

        this.stateChange(MongoMemoryReplSetStates.stopped);

        throw err;
      });
  }

  /**
   * Initialize & start all servers in the replSet
   */
  protected async initAllServers(): Promise<void> {
    log('initAllServers');
    this.stateChange(MongoMemoryReplSetStates.init);

    if (this.servers.length > 0) {
      log('initAllServers: lenght of "servers" is higher than 0, starting existing servers');

      if (this._ranCreateAuth) {
        log('initAllServers: "_ranCreateAuth" is true, re-using auth');
        const keyfilepath = resolve(await this.ensureKeyFile(), 'keyfile');
        for (const server of this.servers) {
          assertion(
            !isNullOrUndefined(server.instanceInfo),
            new InstanceInfoError('MongoMemoryReplSet.initAllServers')
          );
          assertion(typeof this._replSetOpts.auth === 'object', new AuthNotObjectError());
          server.instanceInfo.instance.instanceOpts.auth = true;
          server.instanceInfo.instance.instanceOpts.keyfileLocation = keyfilepath;
          server.instanceInfo.instance.extraConnectionOptions = {
            authSource: 'admin',
            authMechanism: 'SCRAM-SHA-256',
            auth: {
              username: this._replSetOpts.auth.customRootName as string, // cast because these are existing
              password: this._replSetOpts.auth.customRootPwd as string,
            },
          };
        }
      }

      await Promise.all(this.servers.map((s) => s.start(true)));
      log('initAllServers: finished starting existing instances again');

      return;
    }

    let keyfilePath: string | undefined = undefined;

    if (this.enableAuth()) {
      keyfilePath = resolve(await this.ensureKeyFile(), 'keyfile');
    }

    // Any servers defined within `_instanceOpts` should be started first as
    // the user could have specified a `dbPath` in which case we would want to perform
    // the `replSetInitiate` command against that server.
    this._instanceOpts.forEach((opts, index) => {
      log(
        `initAllServers: starting special server "${index + 1}" of "${
          this._instanceOpts.length
        }" from instanceOpts (count: ${this.servers.length + 1}):`,
        opts
      );
      this.servers.push(this._initServer(this.getInstanceOpts(opts, keyfilePath)));
    });
    while (this.servers.length < this._replSetOpts.count) {
      log(
        `initAllServers: starting extra server "${this.servers.length + 1}" of "${
          this._replSetOpts.count
        }" (count: ${this.servers.length + 1})`
      );
      this.servers.push(this._initServer(this.getInstanceOpts(undefined, keyfilePath)));
    }

    log('initAllServers: waiting for all servers to finish starting');
    // ensures all servers are listening for connection
    await Promise.all(this.servers.map((s) => s.start()));
    log('initAllServers: finished starting all servers initially');
  }

  /**
   * Ensure "_keyfiletmp" is defined
   * @returns the ensured "_keyfiletmp" value
   */
  protected async ensureKeyFile(): Promise<string> {
    log('ensureKeyFile');

    if (isNullOrUndefined(this._keyfiletmp)) {
      this._keyfiletmp = await createTmpDir('mongo-mem-keyfile-');
    }

    const keyfilepath = resolve(this._keyfiletmp, 'keyfile');

    // if path does not exist or have no access, create it (or fail)
    if (!(await statPath(keyfilepath))) {
      log('ensureKeyFile: creating Keyfile');

      assertion(typeof this._replSetOpts.auth === 'object', new AuthNotObjectError());

      await fs.writeFile(
        resolve(this._keyfiletmp, 'keyfile'),
        this._replSetOpts.auth.keyfileContent ?? '0123456789',
        { mode: 0o700 } // this is because otherwise mongodb errors with "permissions are too open" on unix systems
      );
    }

    return this._keyfiletmp;
  }

  /**
   * Stop the underlying `mongod` instance(s).
   * @param cleanupOptions Set how to run ".cleanup", by default only `{ doCleanup: true }` is used
   */
  async stop(cleanupOptions?: Cleanup): Promise<boolean> {
    log(`stop: called by ${isNullOrUndefined(process.exitCode) ? 'manual' : 'process exit'}`);

    /** Default to cleanup temporary, but not custom dbpaths */
    let cleanup: Cleanup = { doCleanup: true, force: false };

    // TODO: for next major release (10.0), this should be removed
    if (typeof cleanupOptions === 'boolean') {
      throw new Error('Unsupported argument type: boolean');
    }

    // handle the new way of setting what and how to cleanup
    if (typeof cleanupOptions === 'object') {
      cleanup = cleanupOptions;
    }

    if (this._state === MongoMemoryReplSetStates.stopped) {
      log('stop: state is "stopped", trying to stop / kill anyway');
    }

    const successfullyStopped = await Promise.all(
      this.servers.map((s) => s.stop({ doCleanup: false, force: false }))
    )
      .then(() => {
        this.stateChange(MongoMemoryReplSetStates.stopped);

        return true;
      })
      .catch((err) => {
        log('stop:', err);
        this.stateChange(MongoMemoryReplSetStates.stopped, err);

        return false;
      });

    // return early if the instances failed to stop
    if (!successfullyStopped) {
      return false;
    }

    if (cleanup.doCleanup) {
      await this.cleanup(cleanup);
    }

    return true;
  }

  /**
   * Remove the defined dbPath's
   * @param options Set how to run a cleanup, by default `{ doCleanup: true }` is used
   * @throws If "state" is not "stopped"
   * @throws If "instanceInfo" is not defined
   * @throws If an fs error occured
   */
  async cleanup(options?: Cleanup): Promise<void> {
    assertionIsMMSRSState(MongoMemoryReplSetStates.stopped, this._state);
    log(`cleanup for "${this.servers.length}" servers`);

    /** Default to doing cleanup, but not forcing it */
    let cleanup: Cleanup = { doCleanup: true, force: false };

    // TODO: for next major release (10.0), this should be removed
    if (typeof options === 'boolean') {
      throw new Error('Unsupported argument type: boolean');
    }

    // handle the new way of setting what and how to cleanup
    if (typeof options === 'object') {
      cleanup = options;
    }

    log(`cleanup:`, cleanup);

    // dont do cleanup, if "doCleanup" is false
    if (!cleanup.doCleanup) {
      log('cleanup: "doCleanup" is set to false');

      return;
    }

    await Promise.all(this.servers.map((s) => s.cleanup(cleanup)));

    // cleanup the keyfile tmpdir
    if (!isNullOrUndefined(this._keyfiletmp)) {
      await removeDir(this._keyfiletmp);
      this._keyfiletmp = undefined;
    }

    this.servers = [];
    this._ranCreateAuth = false;

    return;
  }

  /**
   * Wait until all instances are running
   * @throws if state is "stopped" (cannot wait on something that dosnt start)
   */
  async waitUntilRunning(): Promise<void> {
    await ensureAsync();
    log('waitUntilRunning:', this._state);
    switch (this._state) {
      case MongoMemoryReplSetStates.running:
        // just return immediatly if the replSet is already running
        return;
      case MongoMemoryReplSetStates.init:
        // wait for event "running"
        await new Promise<void>((res) => {
          // the use of "this" here can be done because "on" either binds "this" or uses an arrow function
          function waitRunning(this: MongoMemoryReplSet, state: MongoMemoryReplSetStates) {
            // this is because other states can be emitted multiple times (like stopped & init for auth creation)
            if (state === MongoMemoryReplSetStates.running) {
              this.removeListener(MongoMemoryReplSetEvents.stateChange, waitRunning);
              res();
            }
          }

          this.on(MongoMemoryReplSetEvents.stateChange, waitRunning);
        });

        return;
      case MongoMemoryReplSetStates.stopped:
      default:
        throw new StateError(
          [MongoMemoryReplSetStates.running, MongoMemoryReplSetStates.init],
          this.state
        );
    }
  }

  /**
   * Connects to the first server from the list of servers and issues the `replSetInitiate`
   * command passing in a new replica set configuration object.
   * @throws if state is not "init"
   * @throws if "servers.length" is not 1 or above
   * @throws if package "mongodb" is not installed
   */
  protected async _initReplSet(): Promise<void> {
    log('_initReplSet');
    assertionIsMMSRSState(MongoMemoryReplSetStates.init, this._state);
    assertion(this.servers.length > 0, new Error('One or more servers are required.'));
    const uris = this.servers.map((server) => server.getUri());
    const isInMemory = this.servers[0].instanceInfo?.storageEngine === 'ephemeralForTest';

    const extraOptions = this._ranCreateAuth
      ? this.servers[0].instanceInfo?.instance.extraConnectionOptions ?? {}
      : {};

    const con: MongoClient = await MongoClient.connect(uris[0], {
      // somehow since mongodb-nodejs 4.0, this option is needed when the server is set to be in a replset
      directConnection: true,
      ...extraOptions,
    });
    log('_initReplSet: connected');

    // try-finally to close connection in any case
    try {
      const adminDb = con.db('admin');

      const members = uris.map((uri, index) => ({
        _id: index,
        host: getHost(uri),
        ...(this.servers[index].opts.instance?.replicaMemberConfig || {}), // Overwrite replica member config
      }));
      const rsConfig = {
        _id: this._replSetOpts.name,
        members,
        writeConcernMajorityJournalDefault: !isInMemory, // if storage engine is "ephemeralForTest" deactivate this option, otherwise enable it
        settings: {
          electionTimeoutMillis: 500,
          ...this._replSetOpts.configSettings,
        },
      };
      // try-catch because the first "command" can fail
      try {
        log('_initReplSet: trying "replSetInitiate"');
        await adminDb.command({ replSetInitiate: rsConfig });

        if (this.enableAuth()) {
          log('_initReplSet: "enableAuth" returned "true"');

          await this._waitForPrimary(undefined, '_initReplSet authIsObject');

          // find the primary instance to run createAuth on
          const primary = this.servers.find(
            (server) => server.instanceInfo?.instance.isInstancePrimary
          );
          assertion(!isNullOrUndefined(primary), new Error('No Primary found'));
          // this should be defined at this point, but is checked anyway (thanks to types)
          assertion(
            !isNullOrUndefined(primary.instanceInfo),
            new InstanceInfoError('_initReplSet authIsObject primary')
          );

          await con.close(); // just ensuring that no timeouts happen or conflicts happen
          await primary.createAuth(primary.instanceInfo);
          this._ranCreateAuth = true;
        }
      } catch (err) {
        if (err instanceof MongoError && err.errmsg == 'already initialized') {
          log(`_initReplSet: "${err.errmsg}": trying to set old config`);
          const { config: oldConfig } = await adminDb.command({ replSetGetConfig: 1 });
          log('_initReplSet: got old config:\n', oldConfig);
          await adminDb.command({
            replSetReconfig: oldConfig,
            force: true,
          });
        } else {
          throw err;
        }
      }
      log('_initReplSet: ReplSet-reconfig finished');
      await this._waitForPrimary(undefined, '_initReplSet beforeRunning');
      this.stateChange(MongoMemoryReplSetStates.running);
      log('_initReplSet: running');
    } finally {
      log('_initReplSet: finally closing connection');
      await con.close();
    }
  }

  /**
   * Create the one Instance (without starting them)
   * @param instanceOpts Instance Options to use for this instance
   */
  protected _initServer(instanceOpts: MongoMemoryInstanceOpts): MongoMemoryServer {
    const serverOpts: MongoMemoryServerOpts = {
      binary: this._binaryOpts,
      instance: instanceOpts,
      spawn: this._replSetOpts.spawn,
      auth: typeof this.replSetOpts.auth === 'object' ? this.replSetOpts.auth : undefined,
    };
    const server = new MongoMemoryServer(serverOpts);

    return server;
  }

  /**
   * Wait until the replSet has elected a Primary
   * @param timeout Timeout to not run infinitly, default: 30s
   * @param where Extra Parameter for logging to know where this function was called
   * @throws if timeout is reached
   */
  protected async _waitForPrimary(timeout: number = 1000 * 30, where?: string): Promise<void> {
    log('_waitForPrimary: Waiting for a Primary');
    let timeoutId: NodeJS.Timeout | undefined;

    // "race" because not all servers will be a primary
    await Promise.race([
      ...this.servers.map(
        (server) =>
          new Promise<void>((res, rej) => {
            const instanceInfo = server.instanceInfo;

            // this should be defined at this point, but is checked anyway (thanks to types)
            if (isNullOrUndefined(instanceInfo)) {
              return rej(new InstanceInfoError('_waitForPrimary Primary race'));
            }

            instanceInfo.instance.once(MongoInstanceEvents.instancePrimary, res);

            if (instanceInfo.instance.isInstancePrimary) {
              log('_waitForPrimary: found instance being already primary');
              res();
            }
          })
      ),
      new Promise((_res, rej) => {
        timeoutId = setTimeout(() => {
          Promise.all([...this.servers.map((v) => v.stop())]); // this is not chained with "rej", this is here just so things like jest can exit at some point
          rej(new WaitForPrimaryTimeoutError(timeout, where));
        }, timeout);
      }),
    ]);

    if (!isNullOrUndefined(timeoutId)) {
      clearTimeout(timeoutId);
    }

    log('_waitForPrimary: detected one primary instance ');
  }
}

export default MongoMemoryReplSet;

/**
 * Helper function to de-duplicate state checking for "MongoMemoryReplSetStates"
 * @param wantedState The State that is wanted
 * @param currentState The current State ("this._state")
 */
function assertionIsMMSRSState(
  wantedState: MongoMemoryReplSetStates,
  currentState: MongoMemoryReplSetStates
): void {
  assertion(currentState === wantedState, new StateError([wantedState], currentState));
}
