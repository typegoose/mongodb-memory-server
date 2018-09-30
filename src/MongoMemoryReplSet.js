// @flow
import events from 'events';
import { MongoClient } from 'mongodb';
import MongoMemoryServer from './MongoMemoryServer';
import type { MongoMemoryServerOptsT } from './MongoMemoryServer';
import { generateDbName, getHost, getReplStatus } from './util/db_util';
import type { MongoBinaryOpts } from './util/MongoBinary';
import type {
  DebugFn,
  MongoMemoryInstancePropT,
  MongoMemoryInstancePropBaseT,
  SpawnOptions,
  StorageEngineT,
} from './types';

/**
 * Replica set specific options.
 *
 * @property {boolean} auth enable auth; (default: false)
 * @property {string[]} args additional command line args passed to `mongod`
 * @property {number} count number of `mongod` servers to start (default: 1)
 * @property {string} dbName database name used in connection string
 * @property {string} ip bind to all IP addresses specify `::,0.0.0.0`; (default '127.0.0.1')
 * @property {string} name replSet name (default: 'testset')
 * @property {number} oplogSize oplog size (in MB); (default: 1)
 * @property {StorageEngineT} storageEngine `mongod` storage engine type; (default: 'ephemeralForTest')
 */
export interface ReplSetOpts {
  auth: boolean;
  args: string[];
  count: number;
  dbName: string;
  ip: string;
  name: string;
  oplogSize: number;
  spawn: SpawnOptions;
  storageEngine: StorageEngineT;
}

export interface MongoMemoryReplSetOptsT {
  instanceOpts: MongoMemoryInstancePropBaseT[];
  binary: MongoBinaryOpts;
  replSet: ReplSetOpts;
  autoStart?: boolean;
  debug?: boolean;
}

export default class MongoMemoryReplSet extends events.EventEmitter {
  servers: MongoMemoryServer[];
  opts: MongoMemoryReplSetOptsT;
  debug: DebugFn;
  _state: 'init' | 'running' | 'stopped';

  constructor(opts?: $Shape<MongoMemoryReplSetOptsT> = {}) {
    super();
    const replSetDefaults: ReplSetOpts = {
      auth: false,
      args: [],
      name: 'testset',
      count: 1,
      dbName: generateDbName(),
      ip: '127.0.0.1',
      oplogSize: 1,
      spawn: {},
      storageEngine: 'ephemeralForTest',
    };
    this._state = 'stopped';
    this.opts = {
      binary: opts.binary || {},
      debug: !!opts.debug,
      instanceOpts: opts.instanceOpts || [],
      replSet: Object.assign(replSetDefaults, (opts.replSet: any)),
    };
    this.opts.replSet.args.push('--oplogSize', `${this.opts.replSet.oplogSize}`);
    this.debug = (...args: any[]) => {
      if (!this.opts.debug) return;
      console.log(...args);
    };
    // auto start by default
    if (opts.autoStart || !('autoStart' in opts)) {
      this.debug('Autostarting MongoMemoryReplSet.');
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
    };
    if (baseOpts.args) opts.args = rsOpts.args.concat(baseOpts.args);
    if (baseOpts.port) opts.port = baseOpts.port;
    if (baseOpts.dbPath) opts.dbPath = baseOpts.dbPath;
    if (baseOpts.storageEngine) opts.storageEngine = baseOpts.storageEngine;
    this.debug('   instance opts:', opts);
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
      throw new Error('Replica Set is not running. Use opts.debug for more info.');
    }
    let dbName: string;
    if (otherDb) {
      dbName = typeof otherDb === 'string' ? otherDb : generateDbName();
    } else {
      dbName = this.opts.replSet.dbName;
    }
    const ports = await Promise.all(this.servers.map(s => s.getPort()));
    const hosts = ports.map(port => `127.0.0.1:${port}`).join(',');
    return `mongodb://${hosts}/${dbName}`;
  }

  /**
   * Start underlying `mongod` instances.
   */
  async start(): Promise<void> {
    this.debug('start');
    if (this._state !== 'stopped') {
      throw new Error(`Already in 'init' or 'running' state. Use opts.debug = true for more info.`);
    }
    this.emit((this._state = 'init'));
    this.debug('init');
    // Any servers defined within `opts.instanceOpts` should be started first as
    // the user could have specified a `dbPath` in which case we would want to perform
    // the `replSetInitiate` command against that server.
    const servers = this.opts.instanceOpts.map(opts => {
      this.debug('  starting server from instanceOpts:', opts, '...');
      return this._startServer(this.getInstanceOpts(opts));
    });
    while (servers.length < this.opts.replSet.count) {
      this.debug('  starting a server due to count...');
      const server = this._startServer(this.getInstanceOpts({}));
      servers.push(server);
    }
    this.servers = servers;
    // Brief delay to wait for servers to start up.
    await new Promise(resolve => setTimeout(resolve, 1000));
    await this._initReplSet();
  }

  /**
   * Stop the underlying `mongod` instance(s).
   */
  async stop(): Promise<boolean> {
    if (this._state === 'stopped') return false;
    const servers = this.servers;
    this.servers = [];
    return Promise.all(servers.map(s => s.stop()))
      .then(() => {
        this.emit((this._state = 'stopped'));
        return true;
      })
      .catch(err => {
        this.debug(err);
        this.emit((this._state = 'stopped'), err);
        return false;
      });
  }

  async waitUntilRunning() {
    if (this._state === 'running') return;
    await new Promise(resolve => this.once('running', () => resolve()));
  }

  /**
   * Connects to the first server from the list of servers and issues the `replSetInitiate`
   * command passing in a new replica set configuration object.
   */
  async _initReplSet(): Promise<void> {
    if (this._state !== 'init') {
      throw new Error('Not in init phase.');
    }
    this.debug('Initializing replica set.');
    if (!this.servers.length) {
      throw new Error('One or more server is required.');
    }
    const uris = await Promise.all(this.servers.map(server => server.getUri()));
    const conn = await MongoClient.connect(
      uris[0],
      { useNewUrlParser: true }
    );
    try {
      const db = await conn.db(this.opts.replSet.dbName);
      const admin = db.admin();
      const members = uris.map((uri, idx) => ({ _id: idx, host: getHost(uri) }));
      const rsConfig = {
        _id: this.opts.replSet.name,
        members,
      };
      await admin.command({ replSetInitiate: rsConfig });
      this.debug('Waiting for replica set to have a PRIMARY member.');
      await this._waitForPrimary(admin);
      this.emit((this._state = 'running'));
      this.debug('running');
    } finally {
      await conn.close();
    }
  }

  _startServer(instanceOpts: MongoMemoryInstancePropT): MongoMemoryServer {
    const serverOpts: MongoMemoryServerOptsT = {
      autoStart: true,
      debug: this.opts.debug,
      binary: this.opts.binary,
      instance: instanceOpts,
      spawn: (this.opts.replSet.spawn: any),
    };
    const server = new MongoMemoryServer(serverOpts);
    return server;
  }

  async _waitForPrimary(db: any): Promise<boolean> {
    const replStatus = await getReplStatus(db);
    this.debug('   replStatus:', replStatus);
    const hasPrimary = replStatus.members.some(m => m.stateStr === 'PRIMARY');
    if (!hasPrimary) {
      this.debug('No PRIMARY yet. Waiting...');
      return new Promise(resolve => setTimeout(() => resolve(this._waitForPrimary(db)), 1000));
    }
    return true;
  }
}
