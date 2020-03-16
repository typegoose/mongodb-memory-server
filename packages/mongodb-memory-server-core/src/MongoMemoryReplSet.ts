import { EventEmitter } from 'events';
import * as mongodb from 'mongodb';
import MongoMemoryServer from './MongoMemoryServer';
import { MongoMemoryServerOptsT } from './MongoMemoryServer';
import { generateDbName, getHost } from './util/db_util';
import { MongoBinaryOpts } from './util/MongoBinary';
import {
  MongoMemoryInstancePropT,
  MongoMemoryInstancePropBaseT,
  SpawnOptions,
  StorageEngineT,
} from './types';
import debug from 'debug';
import { MongoError } from 'mongodb';

const log = debug('MongoMS:MongoMemoryReplSet');

/**
 * Replica set specific options.
 *
 * @property {boolean} auth enable auth; (default: false)
 * @property {string[]} args additional command line args passed to `mongod`
 * @property {number} count number of `mongod` servers to start (default: 1)
 * @property {string} dbName database name used in connection string (default: uuid)
 * @property {string} ip bind to all IP addresses specify `::,0.0.0.0`; (default '127.0.0.1')
 * @property {string} name replSet name (default: 'testset')
 * @property {number} oplogSize oplog size (in MB); (default: 1)
 * @property {StorageEngineT} storageEngine `mongod` storage engine type; (default: 'ephemeralForTest')
 */
export interface ReplSetOpts {
  auth?: boolean;
  args?: string[];
  count?: number;
  dbName?: string;
  ip?: string;
  name?: string;
  oplogSize?: number;
  spawn?: SpawnOptions;
  storageEngine?: StorageEngineT;
  configSettings?: MongoMemoryReplSetConfigSettingsT;
}

export interface MongoMemoryReplSetConfigSettingsT {
  chainingAllowed?: boolean;
  heartbeatTimeoutSecs?: number;
  heartbeatIntervalMillis?: number;
  electionTimeoutMillis?: number;
  catchUpTimeoutMillis?: number;
}

export interface MongoMemoryReplSetOptsT {
  instanceOpts?: MongoMemoryInstancePropBaseT[];
  binary?: MongoBinaryOpts;
  replSet?: ReplSetOpts;
  autoStart?: boolean;
}

export default class MongoMemoryReplSet extends EventEmitter {
  servers: MongoMemoryServer[] = [];
  opts: {
    instanceOpts: MongoMemoryInstancePropBaseT[];
    binary: MongoBinaryOpts;
    replSet: Required<ReplSetOpts>;
    autoStart?: boolean;
  };

  _state: 'init' | 'running' | 'stopped';

  constructor(opts: MongoMemoryReplSetOptsT = {}) {
    super();
    const replSetDefaults: Required<ReplSetOpts> = {
      auth: false,
      args: [],
      name: 'testset',
      count: 1,
      dbName: generateDbName(),
      ip: '127.0.0.1',
      oplogSize: 1,
      spawn: {},
      storageEngine: 'ephemeralForTest',
      configSettings: {},
    };
    this._state = 'stopped';
    this.opts = {
      binary: opts.binary || {},
      instanceOpts: opts.instanceOpts || [],
      replSet: { ...replSetDefaults, ...opts.replSet },
    };

    if (!this.opts.replSet.args) this.opts.replSet.args = [];
    this.opts.replSet.args.push('--oplogSize', `${this.opts.replSet.oplogSize}`);
    if (!(opts && opts.autoStart === false)) {
      log('Autostarting MongoMemoryReplSet.');
      setTimeout(() => this.start(), 0);
    }
    process.on('beforeExit', () => this.stop());
  }

  async getConnectionString(otherDb?: string | boolean): Promise<string> {
    return this.getUri(otherDb);
  }

  /**
   * Returns database name.
   */
  async getDbName(): Promise<string> {
    // this function is only async for consistency with MongoMemoryServer
    // I don't see much point to either of them being async but don't
    // care enough to change it and introduce a breaking change.
    return this.opts.replSet.dbName;
  }

  /**
   * Returns instance options suitable for a MongoMemoryServer.
   * @param {MongoMemoryInstancePropBaseT} baseOpts
   */
  getInstanceOpts(baseOpts: MongoMemoryInstancePropBaseT = {}): MongoMemoryInstancePropT {
    const rsOpts: ReplSetOpts = this.opts.replSet;
    const opts: MongoMemoryInstancePropT = {
      auth: !!rsOpts.auth,
      args: rsOpts.args,
      dbName: rsOpts.dbName,
      ip: rsOpts.ip,
      replSet: rsOpts.name,
      storageEngine: rsOpts.storageEngine,
    };
    if (baseOpts.args) opts.args = (rsOpts.args || []).concat(baseOpts.args);
    if (baseOpts.port) opts.port = baseOpts.port;
    if (baseOpts.dbPath) opts.dbPath = baseOpts.dbPath;
    if (baseOpts.storageEngine) opts.storageEngine = baseOpts.storageEngine;
    log('   instance opts:', opts);
    return opts;
  }

  /**
   * Returns a mongodb: URI to connect to a given database.
   */
  async getUri(otherDb?: string | boolean): Promise<string> {
    if (this._state === 'init') {
      await this._waitForPrimary();
    }
    if (this._state !== 'running') {
      throw new Error('Replica Set is not running. Use debug for more info.');
    }
    let dbName: string;
    if (otherDb) {
      dbName = typeof otherDb === 'string' ? otherDb : generateDbName();
    } else {
      dbName = this.opts.replSet.dbName;
    }
    const ports = await Promise.all(this.servers.map((s) => s.getPort()));
    const hosts = ports.map((port) => `127.0.0.1:${port}`).join(',');
    return `mongodb://${hosts}/${dbName}?replicaSet=${this.opts.replSet.name}`;
  }

  /**
   * Start underlying `mongod` instances.
   */
  async start(): Promise<void> {
    log('start');
    if (this._state !== 'stopped') {
      throw new Error(`Already in 'init' or 'running' state. Use debug for more info.`);
    }
    this.emit((this._state = 'init'));
    log('init');
    // Any servers defined within `opts.instanceOpts` should be started first as
    // the user could have specified a `dbPath` in which case we would want to perform
    // the `replSetInitiate` command against that server.
    const servers = this.opts.instanceOpts.map((opts) => {
      log('  starting server from instanceOpts:', opts, '...');
      return this._initServer(this.getInstanceOpts(opts));
    });
    const cnt = this.opts.replSet.count || 1;
    /** For extra logging */
    const current = 0;
    while (servers.length < cnt) {
      log(`  starting server ${current} of ${cnt}...`);
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
    if (this._state === 'stopped') return false;
    const servers = this.servers;
    this.servers = [];
    return Promise.all(servers.map((s) => s.stop()))
      .then(() => {
        this.emit((this._state = 'stopped'));
        return true;
      })
      .catch((err) => {
        log(err);
        this.emit((this._state = 'stopped'), err);
        return false;
      });
  }

  async waitUntilRunning(): Promise<void> {
    if (this._state === 'running') return;
    await new Promise((resolve) => this.once('running', () => resolve()));
  }

  /**
   * Connects to the first server from the list of servers and issues the `replSetInitiate`
   * command passing in a new replica set configuration object.
   */
  async _initReplSet(): Promise<void> {
    if (this._state !== 'init') {
      throw new Error('Not in init phase.');
    }
    log('Initializing replica set.');
    if (!this.servers.length) {
      throw new Error('One or more servers are required.');
    }
    const uris = await Promise.all(this.servers.map((server) => server.getUri()));

    let MongoClient: typeof mongodb.MongoClient;
    try {
      MongoClient = require('mongodb').MongoClient;
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
      const db = await conn.db(this.opts.replSet.dbName);

      // MongoClient HACK which helps to avoid the following error:
      //   "RangeError: Maximum call stack size exceeded"
      //   in ./node_modules/mongodb/lib/core/sdam/topology_description.js:263:51
      // Under the hood initiated server topology has type `RSGhost`
      //   and this server does not support session
      //   so for skipping the following code
      //   https://github.com/mongodb/node-mongodb-native/blob/dc70c2de7d3dae2617708c45a1ea695d131e15f3/lib/operations/execute_operation.js#L33-L39
      //   we just override shouldCheckForSessionSupport() method for current connection instance
      (db as any).topology.shouldCheckForSessionSupport = () => false;

      /** reference to "db.admin()" */
      const admin = db.admin();
      const members = uris.map((uri, idx) => ({ _id: idx, host: getHost(uri) }));
      const rsConfig = {
        _id: this.opts.replSet.name,
        members,
        settings: {
          electionTimeoutMillis: 500,
          ...(this.opts.replSet.configSettings || {}),
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
      log('Waiting for replica set to have a PRIMARY member.');
      await this._waitForPrimary();
      this.emit((this._state = 'running'));
      log('running');
    } finally {
      await conn.close();
    }
  }

  _initServer(instanceOpts: MongoMemoryInstancePropT): MongoMemoryServer {
    const serverOpts: MongoMemoryServerOptsT = {
      autoStart: false,
      binary: this.opts.binary,
      instance: instanceOpts,
      spawn: this.opts.replSet.spawn,
    };
    const server = new MongoMemoryServer(serverOpts);
    return server;
  }

  async _waitForPrimary(timeout: number = 30000): Promise<void> {
    let timeoutId: NodeJS.Timeout | undefined;
    const timeoutPromise = new Promise((resolve, reject) => {
      timeoutId = setTimeout(() => {
        reject('Timed out in ' + timeout + 'ms. When waiting for primary.');
      }, timeout);
    });

    await Promise.race([
      ...this.servers.map((server) => {
        const instanceInfo = server.getInstanceInfo();
        if (!instanceInfo) {
          throw new Error('_waitForPrimary - instanceInfo not present ');
        }
        return instanceInfo.instance.waitPrimaryReady();
      }),
      timeoutPromise,
    ]);

    if (timeoutId != null) {
      clearTimeout(timeoutId);
    }

    log('_waitForPrimary detected one primary instance ');
  }
}
