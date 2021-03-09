import { EventEmitter } from 'events';
import MongoMemoryServer, { AutomaticAuth } from './MongoMemoryServer';
import { MongoMemoryServerOpts } from './MongoMemoryServer';
import {
  assertion,
  authDefault,
  ensureAsync,
  generateDbName,
  getHost,
  isNullOrUndefined,
} from './util/utils';
import { MongoBinaryOpts } from './util/MongoBinary';
import debug from 'debug';
import { MongoClient, MongoError } from 'mongodb';
import {
  MongoInstanceEvents,
  MongoMemoryInstanceProp,
  MongoMemoryInstancePropBase,
  StorageEngine,
} from './util/MongoInstance';
import { SpawnOptions } from 'child_process';

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
  auth?: boolean | AutomaticAuth;
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
   * database name used in connection string
   * @default uuidv4()
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
  instanceOpts: MongoMemoryInstancePropBase[];
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
export class MongoMemoryReplSet extends EventEmitter {
  /**
   * All servers this ReplSet instance manages
   */
  servers: MongoMemoryServer[] = [];

  // "!" is used, because the getters are used instead of the "_" values
  protected _instanceOpts!: MongoMemoryInstancePropBase[];
  protected _binaryOpts!: MongoBinaryOpts;
  protected _replSetOpts!: Required<ReplSetOpts>;

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
  static async create(opts: Partial<MongoMemoryReplSetOpts> = {}): Promise<MongoMemoryReplSet> {
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
  get instanceOpts(): MongoMemoryInstancePropBase[] {
    return this._instanceOpts;
  }

  set instanceOpts(val: MongoMemoryInstancePropBase[]) {
    assertion(
      this._state === MongoMemoryReplSetStates.stopped,
      new Error('Cannot change instance Options while "state" is not "stopped"!')
    );
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
    assertion(
      this._state === MongoMemoryReplSetStates.stopped,
      new Error('Cannot change binary Options while "state" is not "stopped"!')
    );
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
    assertion(
      this._state === MongoMemoryReplSetStates.stopped,
      new Error('Cannot change replSet Options while "state" is not "stopped"!')
    );
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

    assertion(this._replSetOpts.count > 0, new Error('ReplSet Count needs to be 1 or higher!'));

    if (typeof this._replSetOpts.auth === 'object') {
      this._replSetOpts.auth = authDefault(this._replSetOpts.auth);
    }
  }

  /**
   * Returns instance options suitable for a MongoMemoryServer.
   * @param baseOpts Options to merge with
   */
  protected getInstanceOpts(baseOpts: MongoMemoryInstancePropBase = {}): MongoMemoryInstanceProp {
    const opts: MongoMemoryInstanceProp = {
      // disable "auth" if replsetopts has an object-auth
      auth:
        typeof this._replSetOpts.auth === 'object' && !this._ranCreateAuth
          ? false
          : !!this._replSetOpts.auth,
      args: this._replSetOpts.args,
      dbName: this._replSetOpts.dbName,
      ip: this._replSetOpts.ip,
      replSet: this._replSetOpts.name,
      storageEngine: this._replSetOpts.storageEngine,
    };

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

    log('   instance opts:', opts);

    return opts;
  }

  /**
   * Returns an mongodb URI that is setup with all replSet servers
   * @param otherDb use a different database than what was set on creation?
   * @throws if state is not "running"
   * @throws if an server doesnt have "instanceInfo.port" defined
   */
  getUri(otherDb?: string | boolean): string {
    log('getUri:', this._state);
    switch (this._state) {
      case MongoMemoryReplSetStates.running:
      case MongoMemoryReplSetStates.init:
        break;
      case MongoMemoryReplSetStates.stopped:
      default:
        throw new Error('Replica Set is not running. Use debug for more info.');
    }

    const dbName: string = isNullOrUndefined(otherDb)
      ? this._replSetOpts.dbName
      : typeof otherDb === 'string'
      ? otherDb
      : generateDbName();
    const ports = this.servers.map((s) => {
      const port = s.instanceInfo?.port;
      assertion(!isNullOrUndefined(port), new Error('Instance Port is undefined!'));

      return port;
    });
    const hosts = ports.map((port) => `127.0.0.1:${port}`).join(',');

    return `mongodb://${hosts}/${dbName}?replicaSet=${this._replSetOpts.name}`;
  }

  /**
   * Start underlying `mongod` instances.
   * @throws if state is already "running"
   */
  async start(): Promise<void> {
    log('start');
    switch (this._state) {
      case MongoMemoryReplSetStates.stopped:
        break;
      case MongoMemoryReplSetStates.running:
      default:
        throw new Error('Already in "init" or "running" state. Use debug for more info.');
    }
    this.stateChange(MongoMemoryReplSetStates.init); // this needs to be executed before "setImmediate"
    await ensureAsync();
    await this.initAllServers();
    await this._initReplSet();

    // check if an "beforeExit" listener for "this.cleanup" is already defined for this class, if not add one
    if (
      process
        .listeners('beforeExit')
        .findIndex((f: (...args: any[]) => any) => f === this.cleanup) <= -1
    ) {
      process.on('beforeExit', this.cleanup);
    }
  }

  protected async initAllServers(): Promise<void> {
    log('initAllServers');
    this.stateChange(MongoMemoryReplSetStates.init);

    if (this.servers.length > 0) {
      log('initAllServers: lenght of "servers" is higher than 0, starting existing servers');
      await Promise.all(this.servers.map((s) => s.start(true)));

      return;
    }

    // Any servers defined within `_instanceOpts` should be started first as
    // the user could have specified a `dbPath` in which case we would want to perform
    // the `replSetInitiate` command against that server.
    this._instanceOpts.forEach((opts) => {
      log(`  starting server from instanceOpts (count: ${this.servers.length + 1}):`, opts);
      this.servers.push(this._initServer(this.getInstanceOpts(opts)));
    });
    while (this.servers.length < this._replSetOpts.count) {
      log(`  starting server ${this.servers.length + 1} of ${this._replSetOpts.count}`);
      this.servers.push(this._initServer(this.getInstanceOpts()));
    }

    log('initAllServers: waiting for all servers to finish starting');
    // ensures all servers are listening for connection
    await Promise.all(this.servers.map((s) => s.start()));
  }

  /**
   * Stop the underlying `mongod` instance(s).
   * @param runCleanup run "this.cleanup"? (remove dbPath & reset "instanceInfo")
   */
  async stop(runCleanup: boolean = true): Promise<boolean> {
    log('stop' + isNullOrUndefined(process.exitCode) ? '' : ': called by process-event');

    if (this._state === MongoMemoryReplSetStates.stopped) {
      return false;
    }

    const bool = await Promise.all(this.servers.map((s) => s.stop(false)))
      .then(() => {
        this.stateChange(MongoMemoryReplSetStates.stopped);

        return true;
      })
      .catch((err) => {
        log(err);
        this.stateChange(MongoMemoryReplSetStates.stopped, err);

        return false;
      });

    // return early if the instances failed to stop
    if (!bool) {
      return bool;
    }

    if (runCleanup) {
      await this.cleanup(false);
    }

    return true;
  }

  /**
   * Remove the defined dbPath's
   * This function gets automatically called on process event "beforeExit" (with force being "false")
   * @param force Remove the dbPath even if it is no "tmpDir" (and re-check if tmpDir actually removed it)
   * @throws If "state" is not "stopped"
   * @throws If "instanceInfo" is not defined
   * @throws If an fs error occured
   */
  async cleanup(force: boolean = false): Promise<void> {
    assertion(
      this._state === MongoMemoryReplSetStates.stopped,
      new Error('Cannot run cleanup when state is not "stopped"')
    );
    log(`cleanup for "${this.servers.length}" servers`);
    process.removeListener('beforeExit', this.cleanup);

    await Promise.all(this.servers.map((s) => s.cleanup(force)));

    this.servers = [];

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
        // throw an error if not "running" or "init"
        throw new Error(
          'State is not "running" or "init" - cannot wait on something that dosnt start'
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
    assertion(this._state === MongoMemoryReplSetStates.init, new Error('Not in init phase.'));
    assertion(this.servers.length > 0, new Error('One or more servers are required.'));
    const uris = this.servers.map((server) => server.getUri());

    let con: MongoClient = await MongoClient.connect(uris[0], {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    try {
      let adminDb = con.db('admin');

      const members = uris.map((uri, idx) => ({ _id: idx, host: getHost(uri) }));
      const rsConfig = {
        _id: this._replSetOpts.name,
        members,
        settings: {
          electionTimeoutMillis: 500,
          ...this._replSetOpts.configSettings,
        },
      };
      try {
        await adminDb.command({ replSetInitiate: rsConfig });

        if (typeof this._replSetOpts.auth === 'object') {
          log('_initReplSet: "this._replSetOpts.auth" is an object');

          await this._waitForPrimary();

          const primary = this.servers.find(
            (server) => server.instanceInfo?.instance.isInstancePrimary
          );
          assertion(!isNullOrUndefined(primary), new Error('No Primary found'));
          assertion(
            !isNullOrUndefined(primary.instanceInfo),
            new Error('Primary dosnt have an "instanceInfo" defined')
          );

          await primary.createAuth(primary.instanceInfo);
          this._ranCreateAuth = true;

          if (primary.opts.instance?.storageEngine !== 'ephemeralForTest') {
            log('_initReplSet: closing connection for restart');
            await con.close(); // close connection in preparation for "stop"
            await this.stop(false); // stop all servers for enabling auth
            log('_initReplSet: starting all server again with auth');
            await this.initAllServers(); // start all servers again with "auth" enabled

            con = await MongoClient.connect(this.getUri('admin'), {
              useNewUrlParser: true,
              useUnifiedTopology: true,
              authSource: 'admin',
              authMechanism: 'SCRAM-SHA-256',
              auth: {
                user: this._replSetOpts.auth.customRootName as string, // cast because these are existing
                password: this._replSetOpts.auth.customRootPwd as string,
              },
            });
            adminDb = con.db('admin');
            log('_initReplSet: auth restart finished');
          } else {
            console.warn(
              'Not Restarting ReplSet for Auth\n' +
                'Storage engine of current PRIMARY is ephemeralForTest, which does not write data on shutdown, and mongodb does not allow changeing "auth" runtime'
            );
          }
        }
      } catch (e) {
        if (e instanceof MongoError && e.errmsg == 'already initialized') {
          log(`${e.errmsg}: trying to set old config`);
          const { config: oldConfig } = await adminDb.command({ replSetGetConfig: 1 });
          log('got old config:\n', oldConfig);
          await adminDb.command({
            replSetReconfig: oldConfig,
            force: true,
          });
        } else {
          throw e;
        }
      }
      log('_initReplSet: ReplSet-reConfig finished');
      await this._waitForPrimary();
      this.stateChange(MongoMemoryReplSetStates.running);
      log('_initReplSet: running');
    } finally {
      await con.close();
    }
  }

  /**
   * Create the one Instance (without starting them)
   * @param instanceOpts Instance Options to use for this instance
   */
  protected _initServer(instanceOpts: MongoMemoryInstanceProp): MongoMemoryServer {
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
   * Wait until the replSet has elected an Primary
   * @param timeout Timeout to not run infinitly
   * @throws if timeout is reached
   */
  protected async _waitForPrimary(timeout: number = 30000): Promise<void> {
    log('_waitForPrimary: Waiting for an Primary');
    let timeoutId: NodeJS.Timeout | undefined;

    await Promise.race([
      ...this.servers.map(
        (server) =>
          new Promise<void>((res, rej) => {
            const instanceInfo = server.instanceInfo;

            if (!instanceInfo) {
              return rej(new Error('_waitForPrimary - instanceInfo not present'));
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
          rej(new Error(`Timed out after ${timeout}ms while waiting for an Primary`));
        }, timeout);
      }),
    ]);

    if (!isNullOrUndefined(timeoutId)) {
      clearTimeout(timeoutId);
    }

    log('_waitForPrimary detected one primary instance ');
  }
}

export default MongoMemoryReplSet;
