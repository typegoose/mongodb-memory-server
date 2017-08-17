/* @flow */

import type { ChildProcess } from 'child_process';
import uuid from 'uuid/v4';
import tmp from 'tmp';
import getport from 'get-port';
import Debug from 'debug';
import MongoInstance from './util/MongoInstance';

tmp.setGracefulCleanup();

export type MongoMemoryServerOptsT = {
  instance: {
    port?: ?number,
    dbPath?: string,
    storageEngine?: string,
    debug?: boolean | Function,
  },
  binary: {
    version?: string,
    downloadDir?: string,
    platform?: string,
    arch?: string,
    http?: any,
    debug?: boolean | Function,
  },
  debug?: boolean,
  spawn: any,
  autoStart?: boolean,
};

export type MongoInstanceDataT = {
  port: number,
  dbPath: string,
  uri: string,
  storageEngine: string,
  childProcess: ChildProcess,
  tmpDir?: {
    name: string,
    removeCallback: Function,
  },
};

async function generateConnectionString(port: number, dbName: ?string): Promise<string> {
  const db = dbName || (await uuid());
  return `mongodb://localhost:${port}/${db}`;
}

export default class MongoMemoryServer {
  isRunning: boolean = false;
  runningInstance: ?Promise<MongoInstanceDataT>;
  opts: MongoMemoryServerOptsT;
  debug: Function;

  constructor(opts?: $Shape<MongoMemoryServerOptsT> = {}) {
    this.opts = opts;
    if (!this.opts.instance) this.opts.instance = {};
    if (!this.opts.binary) this.opts.binary = {};

    this.debug = (msg: string) => {
      if (this.opts.debug) {
        console.log(msg);
      }
    };

    // autoStart by default
    if (!opts.hasOwnProperty('autoStart') || opts.autoStart) {
      this.debug('Autostarting MongoDB instance...');
      this.start();
    }
  }

  async start(): Promise<boolean> {
    if (this.runningInstance) {
      throw new Error(
        'MongoDB instance already in status startup/running/error. Use opts.debug = true for more info.'
      );
    }

    this.runningInstance = this._startUpInstance()
      .catch(err => {
        if (err.message === 'Mongod shutting down' || err === 'Mongod shutting down') {
          this.debug(`Mongodb does not started. Trying to start on another port one more time...`);
          this.opts.instance.port = null;
          return this._startUpInstance();
        }
        throw err;
      })
      .catch(err => {
        if (!this.opts.debug) {
          throw new Error(
            `${err.message}\n\nUse debug option for more info: new MongoMemoryServer({ debug: true })`
          );
        }
        throw err;
      });

    return this.runningInstance.then(() => true);
  }

  async _startUpInstance(): Promise<MongoInstanceDataT> {
    const data = {};
    let tmpDir;

    const instOpts = this.opts.instance;
    data.port = await getport(instOpts.port);
    this.debug = Debug(`Mongo[${data.port}]`);
    this.debug.enabled = !!this.opts.debug;
    data.uri = await generateConnectionString(data.port);
    data.storageEngine = instOpts.storageEngine || 'ephemeralForTest';
    if (instOpts.dbPath) {
      data.dbPath = instOpts.dbPath;
    } else {
      tmpDir = tmp.dirSync({ prefix: 'mongo-mem-', unsafeCleanup: true });
      data.dbPath = tmpDir.name;
    }

    this.debug(`Starting MongoDB instance with following options: ${JSON.stringify(data)}`);

    // Download if not exists mongo binaries in ~/.mongodb-prebuilt
    // After that startup MongoDB instance
    const childProcess = await MongoInstance.run({
      instance: {
        port: data.port,
        storageEngine: data.storageEngine,
        dbPath: data.dbPath,
        debug: this.opts.instance.debug,
      },
      binary: this.opts.binary,
      spawn: this.opts.spawn,
      debug: this.debug,
    });
    data.childProcess = childProcess;
    data.tmpDir = tmpDir;

    return data;
  }

  async stop(): Promise<boolean> {
    const { childProcess, port, tmpDir } = (await this.getInstanceData(): MongoInstanceDataT);

    if (childProcess && childProcess.kill) {
      this.debug(`Shutdown MongoDB server on port ${port} with pid ${childProcess.pid}`);
      childProcess.kill();
    }

    if (tmpDir) {
      this.debug(`Removing tmpDir ${tmpDir.name}`);
      tmpDir.removeCallback();
    }

    this.runningInstance = null;
    return true;
  }

  async getInstanceData(): Promise<MongoInstanceDataT> {
    if (this.runningInstance) {
      return this.runningInstance;
    }
    throw new Error(
      'Database instance is not running. You should start database by calling start() method. BTW it should start automatically if opts.autoStart!=false. Also you may provide opts.debug=true for more info.'
    );
  }

  async getUri(otherDbName?: string | boolean = false): Promise<string> {
    const { uri, port } = (await this.getInstanceData(): MongoInstanceDataT);

    // IF true OR string
    if (otherDbName) {
      if (typeof otherDbName === 'string') {
        // generate uri with provided DB name on existed DB instance
        return generateConnectionString(port, otherDbName);
      }
      // generate new random db name
      return generateConnectionString(port);
    }

    return uri;
  }

  async getConnectionString(otherDbName: string | boolean = false): Promise<string> {
    return this.getUri(otherDbName);
  }

  async getPort(): Promise<number> {
    const { port } = (await this.getInstanceData(): MongoInstanceDataT);
    return port;
  }

  async getDbPath(): Promise<string> {
    const { dbPath } = (await this.getInstanceData(): MongoInstanceDataT);
    return dbPath;
  }
}
