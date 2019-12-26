import { ChildProcess } from 'child_process';
import tmp from 'tmp';
import getPort from 'get-port';
import { generateDbName } from './util/db_util';
import MongoInstance from './util/MongoInstance';
import { MongoBinaryOpts } from './util/MongoBinary';
import {
  CallbackFn,
  DebugFn,
  MongoMemoryInstancePropT,
  StorageEngineT,
  SpawnOptions,
} from './types';
import { DirResult } from 'tmp';
import { isNullOrUndefined } from 'util';

tmp.setGracefulCleanup();

export interface MongoMemoryServerOptsT {
  instance?: MongoMemoryInstancePropT;
  binary?: MongoBinaryOpts;
  debug?: boolean;
  spawn?: SpawnOptions;
  autoStart?: boolean;
}

export interface MongoInstanceDataT {
  port: number;
  dbPath: string;
  dbName: string;
  ip: string;
  uri: string;
  storageEngine: StorageEngineT;
  instance: MongoInstance;
  childProcess: ChildProcess;
  tmpDir?: {
    name: string;
    removeCallback: CallbackFn;
  };
  replSet?: string;
}

export default class MongoMemoryServer {
  runningInstance: Promise<MongoInstanceDataT> | null = null;
  instanceInfoSync: MongoInstanceDataT | null = null;
  opts: MongoMemoryServerOptsT;
  debug: DebugFn;

  /**
   * Create an Mongo-Memory-Sever Instance
   *
   * Note: because of JavaScript limitations, autoStart cannot be awaited here, use ".create" for async/await ability
   * @param opts Mongo-Memory-Sever Options
   */
  constructor(opts?: MongoMemoryServerOptsT) {
    this.opts = { ...opts };

    this.debug = (msg: string) => {
      if (this.opts.debug) {
        console.log(msg);
      }
    };
    if (opts?.autoStart === true) {
      this.debug('Autostarting MongoDB instance...');
      this.start();
    }
  }

  /**
   * Create an Mongo-Memory-Sever Instance that can be awaited
   * @param opts Mongo-Memory-Sever Options
   */
  static async create(opts?: MongoMemoryServerOptsT): Promise<MongoMemoryServer> {
    // create an instance WITHOUT autoStart so that the user can await it
    const instance = new MongoMemoryServer({
      ...opts,
      autoStart: false,
    });
    if (opts?.autoStart) {
      await instance.start();
    }

    return instance;
  }

  /**
   * Start the in-memory Instance
   * (when options.autoStart is true, this already got called)
   */
  async start(): Promise<boolean> {
    this.debug('Called MongoMemoryServer.start() method:');
    if (this.runningInstance) {
      throw new Error(
        'MongoDB instance already in status startup/running/error. Use opts.debug = true for more info.'
      );
    }

    this.runningInstance = this._startUpInstance()
      .catch((err) => {
        if (err.message === 'Mongod shutting down' || err === 'Mongod shutting down') {
          this.debug(`Mongodb does not started. Trying to start on another port one more time...`);
          if (this.opts.instance && this.opts.instance.port) {
            this.opts.instance.port = null;
          }
          return this._startUpInstance();
        }
        throw err;
      })
      .catch((err) => {
        if (!this.opts.debug) {
          throw new Error(
            `${err.message}\n\nUse debug option for more info: ` +
              `new MongoMemoryServer({ debug: true })`
          );
        }
        throw err;
      });

    return this.runningInstance.then((data) => {
      this.instanceInfoSync = data;
      return true;
    });
  }

  /**
   * Internal Function to start an instance
   * @private
   */
  async _startUpInstance(): Promise<MongoInstanceDataT> {
    const data: any = {};
    let tmpDir: DirResult;

    const instOpts = this.opts.instance || {};
    data.port = await getPort({ port: instOpts.port || undefined });
    data.dbName = generateDbName(instOpts.dbName);
    data.ip = instOpts.ip || '127.0.0.1';
    data.uri = await this._getUriBase(data.ip, data.port, data.dbName);
    data.storageEngine = instOpts.storageEngine || 'ephemeralForTest';
    data.replSet = instOpts.replSet;
    if (instOpts.dbPath) {
      data.dbPath = instOpts.dbPath;
    } else {
      tmpDir = tmp.dirSync({
        mode: 0o755,
        prefix: 'mongo-mem-',
        unsafeCleanup: true,
      });
      data.dbPath = tmpDir.name;
      data.tmpDir = tmpDir;
    }

    this.debug(`Starting MongoDB instance with following options: ${JSON.stringify(data)}`);

    // Download if not exists mongo binaries in ~/.mongodb-prebuilt
    // After that startup MongoDB instance
    const instance = await MongoInstance.run({
      instance: {
        dbPath: data.dbPath,
        ip: data.ip,
        port: data.port,
        storageEngine: data.storageEngine,
        replSet: data.replSet,
        debug: instOpts.debug,
        args: instOpts.args,
        auth: instOpts.auth,
      },
      binary: this.opts.binary,
      spawn: this.opts.spawn,
      debug: this.debug,
    });
    data.instance = instance;
    data.childProcess = instance.childProcess;

    return data;
  }

  /**
   * Stop the current In-Memory Instance
   */
  async stop(): Promise<boolean> {
    this.debug('Called MongoMemoryServer.stop() method');

    // just return "true" if the instance is already running / defined
    if (isNullOrUndefined(this.runningInstance)) {
      return true;
    }

    const { instance, port, tmpDir }: MongoInstanceDataT = await this.ensureInstance();

    this.debug(`Shutdown MongoDB server on port ${port} with pid ${instance.getPid() || ''}`);
    await instance.kill();

    this.runningInstance = null;
    this.instanceInfoSync = null;

    if (tmpDir) {
      this.debug(`Removing tmpDir ${tmpDir.name}`);
      tmpDir.removeCallback();
    }

    return true;
  }

  /**
   * Get Information about the currently running instance, if it is not running it returns "false"
   */
  getInstanceInfo(): MongoInstanceDataT | false {
    return this.instanceInfoSync ?? false;
  }

  /**
   * Ensure that the instance is running
   * -> throws if instance cannot be started
   */
  async ensureInstance(): Promise<MongoInstanceDataT> {
    this.debug('Called MongoMemoryServer.ensureInstance() method:');
    if (this.runningInstance) {
      return this.runningInstance;
    } else {
      this.debug(' - no running instance, call `start()` command');
      await this.start();
      this.debug(' - `start()` command was succesfully resolved');

      // check again for 1. Typescript-type reasons and 2. if .start failed to throw an error
      if (!this.runningInstance) {
        throw new Error('Ensure-Instance failed to start an instance!');
      }

      return this.runningInstance;
    }
  }

  /**
   * Basic MongoDB Connection string
   * @private
   */
  _getUriBase(host: string, port: number, dbName: string) {
    return `mongodb://${host}:${port}/${dbName}?`;
  }

  /**
   * Get a mongodb-URI for a different DataBase
   * @param otherDbName Set this to "true" to generate a random DataBase name, otherwise a string to specify a DataBase name
   */
  async getUri(otherDbName: string | boolean = false): Promise<string> {
    const { uri, port, ip }: MongoInstanceDataT = await this.ensureInstance();

    // IF true OR string
    if (otherDbName) {
      if (typeof otherDbName === 'string') {
        // generate uri with provided DB name on existed DB instance
        return this._getUriBase(ip, port, otherDbName);
      }
      // generate new random db name
      return this._getUriBase(ip, port, generateDbName());
    }

    return uri;
  }

  /**
   * Get a mongodb-URI for a different DataBase
   * @param otherDbName Set this to "true" to generate a random DataBase name, otherwise a string to specify a DataBase name
   */
  async getConnectionString(otherDbName: string | boolean = false): Promise<string> {
    // should this function be marked deprecated? because it is just a pass-through to getUri
    return this.getUri(otherDbName);
  }

  /**
   * Get the Port of the currently running Instance
   * Note: calls "ensureInstance"
   */
  async getPort(): Promise<number> {
    const { port }: MongoInstanceDataT = await this.ensureInstance();
    return port;
  }

  /**
   * Get the DB-Path of the currently running Instance
   * Note: calls "ensureInstance"
   */
  async getDbPath(): Promise<string> {
    const { dbPath }: MongoInstanceDataT = await this.ensureInstance();
    return dbPath;
  }

  /**
   * Get the DB-Name of the currently running Instance
   * Note: calls "ensureInstance"
   */
  async getDbName(): Promise<string> {
    const { dbName }: MongoInstanceDataT = await this.ensureInstance();
    return dbName;
  }
}
