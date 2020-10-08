import { EventEmitter } from 'events';
import * as mongodb from 'mongodb';
import MongoMemoryServer from './MongoMemoryServer';
import { MongoMemoryServerOptsT } from './MongoMemoryServer';
import { assertion, ensureAsync, generateDbName, getHost, isNullOrUndefined } from './util/db_util';
import { MongoBinaryOpts } from './util/MongoBinary';
import { MongoMemoryInstancePropT, MongoMemoryInstancePropBaseT, StorageEngineT } from './types';
import debug from 'debug';
import { MongoError } from 'mongodb';
import { MongoInstanceEvents } from './util/MongoInstance';
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
  auth?: boolean;
  /**
   * additional command line args passed to `mongod`
   * @default []
   */
  args?: string[];
  /**
   * number of `mongod` servers to start
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
  storageEngine?: StorageEngineT;
  /**
   * Options for "rsConfig"
   * @default {}
   */
  configSettings?: MongoMemoryReplSetConfigSettingsT;
}

/**
 * Options for "rsConfig"
 */
export interface MongoMemoryReplSetConfigSettingsT {
  chainingAllowed?: boolean;
  heartbeatTimeoutSecs?: number;
  heartbeatIntervalMillis?: number;
  electionTimeoutMillis?: number;
  catchUpTimeoutMillis?: number;
}

/**
 * Options for the replSet
 */
export interface MongoMemoryReplSetOptsT {
  instanceOpts: MongoMemoryInstancePropBaseT[];
  binary: MongoBinaryOpts;
  replSet: ReplSetOpts;
}

/**
 * Enum for "_state" inside "MongoMemoryReplSet"
 */
export enum MongoMemoryReplSetStateEnum {
  init = 'init',
  running = 'running',
  stopped = 'stopped',
}

export interface MongoMemoryReplSet extends EventEmitter {
  // Overwrite EventEmitter's definitions (to provide at least the event names)
  emit(event: MongoMemoryReplSetStateEnum, ...args: any[]): boolean;
  on(event: MongoMemoryReplSetStateEnum, listener: (...args: any[]) => void): this;
  once(event: MongoMemoryReplSetStateEnum, listener: (...args: any[]) => void): this;
}

/**
 * Class for managing an replSet
 */
export class MongoMemoryReplSet extends EventEmitter {
  servers: MongoMemoryServer[] = [];

  // "!" is used, because the getters are used instead of the "_" values
  protected _instanceOpts!: MongoMemoryInstancePropBaseT[];
  protected _binaryOpts!: MongoBinaryOpts;
  protected _replSetOpts!: Required<ReplSetOpts>;

  protected _state: MongoMemoryReplSetStateEnum = MongoMemoryReplSetStateEnum.stopped;

  constructor(opts: Partial<MongoMemoryReplSetOptsT> = {}) {
    super();

    this.binaryOpts = { ...opts.binary };
    this.instanceOpts = opts.instanceOpts ?? [];
    this.replSetOpts = { ...opts.replSet };

    process.once('beforeExit', this.stop);
  }

  /**
   * Change "this._state" to "newState" and emit "newState"
   * @param newState The new State to set & emit
   */
  protected stateChange(newState: MongoMemoryReplSetStateEnum, ...args: any[]): void {
    this._state = newState;
    this.emit(newState, ...args);
  }

  /**
   * Create an instance of "MongoMemoryReplSet" and call start
   * @param opts Options for the ReplSet
   */
  static async create(opts: Partial<MongoMemoryReplSetOptsT> = {}): Promise<MongoMemoryReplSet> {
    const replSet = new this({ ...opts });
    await replSet.start();
    return replSet;
  }

  /**
   * Get Current state of this class
   */
  get state(): MongoMemoryReplSetStateEnum {
    return this._state;
  }

  /**
   * Get & Set "instanceOpts"
   * @throws if "state" is not "stopped"
   */
  get instanceOpts(): MongoMemoryInstancePropBaseT[] {
    return this._instanceOpts;
  }

  set instanceOpts(val: MongoMemoryInstancePropBaseT[]) {
    assertion(
      this._state === MongoMemoryReplSetStateEnum.stopped,
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
      this._state === MongoMemoryReplSetStateEnum.stopped,
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
      this._state === MongoMemoryReplSetStateEnum.stopped,
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
  }

  /**
   * Returns instance options suitable for a MongoMemoryServer.
   * @param baseOpts Options to merge with
   */
  protected getInstanceOpts(baseOpts: MongoMemoryInstancePropBaseT = {}): MongoMemoryInstancePropT {
    const opts: MongoMemoryInstancePropT = {
      auth: !!this._replSetOpts.auth,
      args: this._replSetOpts.args,
      dbName: this._replSetOpts.dbName,
      ip: this._replSetOpts.ip,
      replSet: this._replSetOpts.name,
      storageEngine: this._replSetOpts.storageEngine,
    };
    if (baseOpts.args) {
      opts.args = (this._replSetOpts.args || []).concat(baseOpts.args);
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
   * Returns a mongodb: URI to connect to a given database.
   * @param otherDb use a different database than what was set on creation?
   */
  async getUri(otherDb?: string | boolean): Promise<string> {
    log('getUri:', this._state);
    switch (this._state) {
      case MongoMemoryReplSetStateEnum.init:
        await this.waitUntilRunning();
        break;
      case MongoMemoryReplSetStateEnum.running:
        break;
      case MongoMemoryReplSetStateEnum.stopped:
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
   */
  async start(): Promise<void> {
    log('start');
    switch (this._state) {
      // case MongoMemoryReplSetStateEnum.init:
      //   return this.waitUntilRunning();
      case MongoMemoryReplSetStateEnum.stopped:
        break;
      case MongoMemoryReplSetStateEnum.running:
      default:
        throw new Error('Already in "init" or "running" state. Use debug for more info.');
    }
    this.stateChange(MongoMemoryReplSetStateEnum.init); // this needs to be executed before "setImmediate"
    await ensureAsync();
    log('init');
    // Any servers defined within `_instanceOpts` should be started first as
    // the user could have specified a `dbPath` in which case we would want to perform
    // the `replSetInitiate` command against that server.
    const servers = this._instanceOpts.map((opts) => {
      log('  starting server from instanceOpts:', opts, '...');
      return this._initServer(this.getInstanceOpts(opts));
    });
    const cnt = this._replSetOpts.count || 1;
    while (servers.length < cnt) {
      log(`  starting server ${servers.length + 1} of ${cnt}...`);
      const server = this._initServer(this.getInstanceOpts({}));
      servers.push(server);
    }
    // ensures all servers are listening for connection
    await Promise.all(servers.map((s) => s.start()));
    this.servers = servers;
    await this._initReplSet();
  }

  /**
   * Stop the underlying `mongod` instance(s).
   */
  async stop(): Promise<boolean> {
    log('stop' + isNullOrUndefined(process.exitCode) ? '' : ': called by process-event');
    if (this._state === MongoMemoryReplSetStateEnum.stopped) {
      return false;
    }
    process.removeListener('beforeExit', this.stop); // many accumulate inside tests
    return Promise.all(this.servers.map((s) => s.stop()))
      .then(() => {
        this.servers = [];
        this.stateChange(MongoMemoryReplSetStateEnum.stopped);
        return true;
      })
      .catch((err) => {
        this.servers = [];
        log(err);
        this.stateChange(MongoMemoryReplSetStateEnum.stopped, err);
        return false;
      });
  }

  /**
   * Wait until all instances are running
   */
  async waitUntilRunning(): Promise<void> {
    // TODO: this seems like it dosnt catch if an instance fails, and runs forever
    await ensureAsync();
    log('waitUntilRunning:', this._state);
    switch (this._state) {
      case MongoMemoryReplSetStateEnum.running:
        // just return immediatly if the replSet is already running
        return;
      case MongoMemoryReplSetStateEnum.init:
        // wait for event "running"
        await new Promise((resolve) =>
          this.once(MongoMemoryReplSetStateEnum.running, () => resolve())
        );
        return;
      case MongoMemoryReplSetStateEnum.stopped:
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
   */
  async _initReplSet(): Promise<void> {
    if (this._state !== MongoMemoryReplSetStateEnum.init) {
      throw new Error('Not in init phase.');
    }
    log('Initializing replica set.');
    if (this.servers.length <= 0) {
      throw new Error('One or more servers are required.');
    }
    const uris = this.servers.map((server) => server.getUri());

    let MongoClient: typeof mongodb.MongoClient;
    try {
      MongoClient = (await import('mongodb')).MongoClient;
    } catch (e) {
      throw new Error(
        `You need to install "mongodb" package. It's required for checking ReplicaSet state.`
      );
    }

    const conn: mongodb.MongoClient = await MongoClient.connect(uris[0], {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    try {
      const db = await conn.db(this._replSetOpts.dbName);

      // MongoClient HACK which helps to avoid the following error:
      //   "RangeError: Maximum call stack size exceeded"
      // (db as any).topology.shouldCheckForSessionSupport = () => false; // TODO: remove after 1.1.2021 if no issues arise

      /** reference to "db.admin()" */
      const admin = db.admin();
      const members = uris.map((uri, idx) => ({ _id: idx, host: getHost(uri) }));
      const rsConfig = {
        _id: this._replSetOpts.name,
        members,
        settings: {
          electionTimeoutMillis: 500,
          ...(this._replSetOpts.configSettings || {}),
        },
      };
      try {
        await admin.command({ replSetInitiate: rsConfig });
      } catch (e) {
        if (e instanceof MongoError && e.errmsg == 'already initialized') {
          log(`${e.errmsg}: trying to set old config`);
          const { config: oldConfig } = await admin.command({ replSetGetConfig: 1 });
          log('got old config:\n', oldConfig);
          await admin.command({
            replSetReconfig: oldConfig,
            force: true,
          });
        } else {
          throw e;
        }
      }
      log('ReplSet-reConfig finished');
      // Documentation for return value: https://docs.mongodb.com/manual/reference/command/replSetGetStatus/#output
      // there is no interface provided by MongoDb inside typescript, so defining only needed values
      const status: { members: { stateStr: string }[] } = await admin.command({
        replSetGetStatus: 1,
      });
      // test if the ReplSet has already an member Primary, if false wait for primary
      if (status.members.findIndex((m) => m.stateStr === 'PRIMARY') <= -1) {
        log('Waiting for replica set to have a PRIMARY member.');
        await this._waitForPrimary();
      }
      this.stateChange(MongoMemoryReplSetStateEnum.running);
      log('running');
    } finally {
      await conn.close();
    }
  }

  /**
   * Create the one Instance (without starting them)
   * @param instanceOpts Instance Options to use for this instance
   */
  _initServer(instanceOpts: MongoMemoryInstancePropT): MongoMemoryServer {
    const serverOpts: MongoMemoryServerOptsT = {
      binary: this._binaryOpts,
      instance: instanceOpts,
      spawn: this._replSetOpts.spawn,
    };
    const server = new MongoMemoryServer(serverOpts);
    return server;
  }

  /**
   * Wait until the replSet has elected an Primary
   * @param timeout Timeout to not run infinitly
   */
  async _waitForPrimary(timeout: number = 30000): Promise<void> {
    let timeoutId: NodeJS.Timeout | undefined;
    const timeoutPromise = new Promise((resolve, reject) => {
      timeoutId = setTimeout(() => {
        reject('Timed out in ' + timeout + 'ms. When waiting for primary.');
      }, timeout);
    });

    await Promise.race([
      ...this.servers.map(
        (server) =>
          new Promise((res, rej) => {
            const instanceInfo = server.instanceInfo;
            if (!instanceInfo) {
              return rej(new Error('_waitForPrimary - instanceInfo not present '));
            }
            instanceInfo.instance.once(MongoInstanceEvents.instancePrimary, res);
          })
      ),
      timeoutPromise,
    ]);

    if (!isNullOrUndefined(timeoutId)) {
      clearTimeout(timeoutId);
    }

    log('_waitForPrimary detected one primary instance ');
  }
}

export default MongoMemoryReplSet;
