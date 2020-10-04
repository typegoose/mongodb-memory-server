import { ChildProcess, SpawnOptions } from 'child_process';
import * as tmp from 'tmp';
import getPort from 'get-port';
import { generateDbName, getUriBase, isNullOrUndefined } from './util/db_util';
import MongoInstance from './util/MongoInstance';
import { MongoBinaryOpts } from './util/MongoBinary';
import { MongoMemoryInstancePropT, StorageEngineT } from './types';
import debug from 'debug';
import { deprecate } from 'util';

const log = debug('MongoMS:MongoMemoryServer');

tmp.setGracefulCleanup();

/**
 * Starting Options
 */
export interface MongoMemoryServerOptsT {
  instance?: MongoMemoryInstancePropT;
  binary?: MongoBinaryOpts;
  spawn?: SpawnOptions;
  autoStart?: boolean;
}

/**
 * Data used by _startUpInstance's "data" variable
 */
export interface StartupInstanceData {
  port: number;
  dbPath?: string;
  dbName: string;
  ip: string;
  uri?: string;
  storageEngine: StorageEngineT;
  replSet?: string;
  tmpDir?: tmp.DirResult;
}

/**
 * Information about the currently running instance
 */
export interface MongoInstanceDataT extends StartupInstanceData {
  dbPath: string; // re-declare, because in this interface it is *not* optional
  uri: string; // same as above
  instance: MongoInstance;
  childProcess?: ChildProcess;
}

export class MongoMemoryServer {
  runningInstance: Promise<MongoInstanceDataT> | null = null;
  instanceInfoSync: MongoInstanceDataT | null = null;
  opts: MongoMemoryServerOptsT;

  /**
   * Create an Mongo-Memory-Sever Instance
   *
   * Note: because of JavaScript limitations, autoStart cannot be awaited here, use ".create" for async/await ability
   * @param opts Mongo-Memory-Sever Options
   */
  constructor(opts?: MongoMemoryServerOptsT) {
    this.opts = { ...opts };

    if (opts?.autoStart === true) {
      log('Autostarting MongoDB instance...');
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
    log('Called MongoMemoryServer.start() method');
    if (this.runningInstance) {
      throw new Error(
        'MongoDB instance already in status startup/running/error. Use debug for more info.'
      );
    }

    this.runningInstance = this._startUpInstance()
      .catch((err) => {
        if (err.message === 'Mongod shutting down' || err === 'Mongod shutting down') {
          log(`Mongodb did not start. Trying to start on another port one more time...`);
          if (this.opts.instance?.port) {
            this.opts.instance.port = null;
          }
          return this._startUpInstance();
        }
        throw err;
      })
      .catch((err) => {
        if (!debug.enabled('MongoMS:MongoMemoryServer')) {
          console.warn('Starting the instance failed, please enable debug for more infomation');
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
    /** Shortcut to this.opts.instance */
    const instOpts = this.opts.instance ?? {};
    const data: StartupInstanceData = {
      port: await getPort({ port: instOpts.port ?? undefined }), // do (null or undefined) to undefined
      dbName: generateDbName(instOpts.dbName),
      ip: instOpts.ip ?? '127.0.0.1',
      storageEngine: instOpts.storageEngine ?? 'ephemeralForTest',
      replSet: instOpts.replSet,
      dbPath: instOpts.dbPath,
      tmpDir: undefined,
    };

    if (instOpts.port != data.port) {
      log(`starting with port ${data.port}, since ${instOpts.port} was locked:`, data.port);
    }

    data.uri = await getUriBase(data.ip, data.port, data.dbName);
    if (!data.dbPath) {
      data.tmpDir = tmp.dirSync({
        mode: 0o755,
        prefix: 'mongo-mem-',
        unsafeCleanup: true,
      });
      data.dbPath = data.tmpDir.name;
    }

    log(`Starting MongoDB instance with following options: ${JSON.stringify(data)}`);

    // Download if not exists mongo binaries in ~/.mongodb-prebuilt
    // After that startup MongoDB instance
    const instance = await MongoInstance.run({
      instance: {
        dbPath: data.dbPath,
        ip: data.ip,
        port: data.port,
        storageEngine: data.storageEngine,
        replSet: data.replSet,
        args: instOpts.args,
        auth: instOpts.auth,
      },
      binary: this.opts.binary,
      spawn: this.opts.spawn,
    });

    return {
      ...data,
      dbPath: data.dbPath as string, // because otherwise the types would be incompatible
      uri: data.uri as string, // same as above
      instance: instance,
      childProcess: instance.childProcess ?? undefined, // convert null | undefined to undefined
    };
  }

  /**
   * Stop the current In-Memory Instance
   */
  async stop(): Promise<boolean> {
    log('Called MongoMemoryServer.stop() method');

    // just return "true" if the instance is already running / defined
    if (isNullOrUndefined(this.runningInstance)) {
      log('Instance is already stopped, returning true');
      return true;
    }

    const { instance, port, tmpDir }: MongoInstanceDataT = await this.ensureInstance();

    log(`Shutdown MongoDB server on port ${port} with pid ${instance.getPid() || ''}`);
    await instance.kill();

    this.runningInstance = null;
    this.instanceInfoSync = null;

    if (tmpDir) {
      log(`Removing tmpDir ${tmpDir.name}`);
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
    log('Called MongoMemoryServer.ensureInstance() method');
    if (this.runningInstance) {
      return this.runningInstance;
    }
    log(' - no running instance, call `start()` command');
    await this.start();
    log(' - `start()` command was succesfully resolved');

    // check again for 1. Typescript-type reasons and 2. if .start failed to throw an error
    if (!this.runningInstance) {
      throw new Error('Ensure-Instance failed to start an instance!');
    }

    return this.runningInstance;
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
        return getUriBase(ip, port, otherDbName);
      }
      // generate new random db name
      return getUriBase(ip, port, generateDbName());
    }

    return uri;
  }

  /**
   * Get a mongodb-URI for a different DataBase
   * @param otherDbName Set this to "true" to generate a random DataBase name, otherwise a string to specify a DataBase name
   * @deprecated
   */
  async getConnectionString(otherDbName: string | boolean = false): Promise<string> {
    return deprecate(
      this.getUri,
      '"MongoMemoryReplSet.getConnectionString" is deprecated, use ".getUri"',
      'MDEP001'
    ).call(this, otherDbName);
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

export default MongoMemoryServer;
