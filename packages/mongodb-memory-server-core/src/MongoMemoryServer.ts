import { SpawnOptions } from 'child_process';
import * as tmp from 'tmp';
import getPort from 'get-port';
import { assertion, generateDbName, getUriBase, isNullOrUndefined } from './util/db_util';
import MongoInstance from './util/MongoInstance';
import { MongoBinaryOpts } from './util/MongoBinary';
import { MongoMemoryInstancePropT, StorageEngineT } from './types';
import debug from 'debug';

const log = debug('MongoMS:MongoMemoryServer');

tmp.setGracefulCleanup();

/**
 * MongoMemoryServer Stored Options
 */
export interface MongoMemoryServerOptsT {
  instance?: MongoMemoryInstancePropT;
  binary?: MongoBinaryOpts;
  spawn?: SpawnOptions;
}

/**
 * Data used by _startUpInstance's "data" variable
 */
export interface StartupInstanceData {
  port: number;
  dbPath?: string;
  dbName: string;
  ip: string;
  storageEngine: StorageEngineT;
  replSet?: string;
  tmpDir?: tmp.DirResult;
}

/**
 * Information about the currently running instance
 */
export interface MongoInstanceDataT extends StartupInstanceData {
  dbPath: string; // re-declare, because in this interface it is *not* optional
  instance: MongoInstance;
}

export class MongoMemoryServer {
  instanceInfo?: MongoInstanceDataT;
  opts: MongoMemoryServerOptsT;

  /**
   * Create an Mongo-Memory-Sever Instance
   *
   * Note: because of JavaScript limitations, autoStart cannot be awaited here, use ".create" for async/await ability
   * @param opts Mongo-Memory-Sever Options
   */
  constructor(opts?: MongoMemoryServerOptsT) {
    this.opts = { ...opts };
  }

  /**
   * Create an Mongo-Memory-Sever Instance that can be awaited
   * @param opts Mongo-Memory-Sever Options
   */
  static async create(opts?: MongoMemoryServerOptsT): Promise<MongoMemoryServer> {
    const instance = new MongoMemoryServer({ ...opts });
    await instance.start();

    return instance;
  }

  /**
   * Start the in-memory Instance
   */
  async start(): Promise<boolean> {
    log('Called MongoMemoryServer.start() method');
    if (this.instanceInfo) {
      throw new Error(
        'MongoDB instance already in status startup/running/error. Use debug for more info.'
      );
    }

    this.instanceInfo = await this._startUpInstance().catch((err) => {
      if (!debug.enabled('MongoMS:MongoMemoryServer')) {
        console.warn('Starting the instance failed, enable debug for more infomation');
      }
      throw err;
    });

    return true;
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

    if (!data.dbPath) {
      data.tmpDir = tmp.dirSync({
        mode: 0o755,
        prefix: 'mongo-mem-',
        unsafeCleanup: true,
      });
      data.dbPath = data.tmpDir.name;
    }

    log(`Starting MongoDB instance with options: ${JSON.stringify(data)}`);

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
      instance: instance,
    };
  }

  /**
   * Stop the current In-Memory Instance
   */
  async stop(): Promise<boolean> {
    log('Called MongoMemoryServer.stop() method');

    // just return "true" if the instance is already running / defined
    if (isNullOrUndefined(this.instanceInfo)) {
      log('Instance is already stopped, returning true');
      return true;
    }

    // assert here, just to be sure
    assertion(
      !isNullOrUndefined(this.instanceInfo.instance),
      new Error('"instanceInfo.instance" is undefined!')
    );

    log(
      `Shutdown MongoDB server on port ${
        this.instanceInfo.port
      } with pid ${this.instanceInfo.instance.getPid()}` // "undefined" would say more than ""
    );
    await this.instanceInfo.instance.kill();

    const tmpDir = this.instanceInfo.tmpDir;
    if (tmpDir) {
      log(`Removing tmpDir ${tmpDir.name}`);
      tmpDir.removeCallback();
    }

    this.instanceInfo = undefined;

    return true;
  }

  /**
   * Get Information about the currently running instance, if it is not running it returns "undefined"
   */
  getInstanceInfo(): MongoInstanceDataT | undefined {
    return this.instanceInfo;
  }

  /**
   * Ensure that the instance is running
   * -> throws if instance cannot be started
   */
  async ensureInstance(): Promise<MongoInstanceDataT> {
    log('Called MongoMemoryServer.ensureInstance() method');
    if (this.instanceInfo) {
      return this.instanceInfo;
    }
    log(' - no running instance, call `start()` command');
    await this.start();
    log(' - `start()` command was succesfully resolved');

    // check again for 1. Typescript-type reasons and 2. if .start failed to throw an error
    if (!this.instanceInfo) {
      throw new Error('Ensure-Instance failed to start an instance!');
    }

    return this.instanceInfo;
  }

  /**
   * Generate the Connection string used by mongodb
   * @param otherDbName Set an custom Database name, or set this to "true" to generate an different name
   */
  getUri(otherDbName?: string | boolean): string {
    assertionInstanceInfo(this.instanceInfo);

    let dbName: string = this.instanceInfo.dbName;

    // using "if" instead of nested "?:"
    if (!isNullOrUndefined(otherDbName)) {
      // use "otherDbName" if string, otherwise generate an db-name
      dbName = typeof otherDbName === 'string' ? otherDbName : generateDbName();
    }

    return getUriBase(this.instanceInfo.ip, this.instanceInfo.port, dbName);
  }

  /**
   * Get the Port of the currently running Instance
   */
  getPort(): number {
    assertionInstanceInfo(this.instanceInfo);
    assertion(!isNullOrUndefined(this.instanceInfo.port), new Error('"port" is undefined'));
    return this.instanceInfo.port;
  }

  /**
   * Get the DB-Path of the currently running Instance
   */
  getDbPath(): string {
    assertionInstanceInfo(this.instanceInfo);
    assertion(!isNullOrUndefined(this.instanceInfo.dbPath), new Error('"dbPath" is undefined'));
    return this.instanceInfo.dbPath;
  }

  /**
   * Get the DB-Name of the currently running Instance
   */
  getDbName(): string {
    assertionInstanceInfo(this.instanceInfo);
    assertion(!isNullOrUndefined(this.instanceInfo.dbName), new Error('"dbName" is undefined'));
    return this.instanceInfo.dbName;
  }
}

export default MongoMemoryServer;

/**
 * This function is to de-duplicate code
 * -> this couldnt be included in the class, because "asserts this.instanceInfo" is not allowed
 * @param val this.instanceInfo
 */
function assertionInstanceInfo(val: unknown): asserts val is MongoInstanceDataT {
  assertion(!isNullOrUndefined(val), new Error('"instanceInfo" is undefined'));
}
