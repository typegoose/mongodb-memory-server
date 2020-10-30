import { SpawnOptions } from 'child_process';
import * as tmp from 'tmp';
import getPort from 'get-port';
import {
  assertion,
  generateDbName,
  uriTemplate,
  isNullOrUndefined,
  authDefault,
  statPath,
} from './util/utils';
import MongoInstance, {
  MongodOpts,
  MongoMemoryInstanceProp,
  StorageEngine,
} from './util/MongoInstance';
import { MongoBinaryOpts } from './util/MongoBinary';
import debug from 'debug';
import { EventEmitter } from 'events';
import { promises as fspromises } from 'fs';
import { MongoClient } from 'mongodb';
import { lt } from 'semver';

// this is because "import {promises: {readdir}}" is not valid syntax
// const { readdir, stat, rmdir } = promises;
// the statement above cannot be done, because otherwise in the tests no spy / mock can be applied

const log = debug('MongoMS:MongoMemoryServer');

tmp.setGracefulCleanup();

/**
 * MongoMemoryServer Stored Options
 */
export interface MongoMemoryServerOpts {
  instance?: MongoMemoryInstanceProp;
  binary?: MongoBinaryOpts;
  spawn?: SpawnOptions;
  /**
   * Defining this enables automatic user creation
   */
  auth?: AutomaticAuth;
}

export interface AutomaticAuth {
  /**
   * Disable Automatic User creation
   * @default false because when defining this object it usually means that AutomaticAuth is wanted
   */
  disable?: boolean;
  /**
   * Extra Users to create besides the root user
   * @default []
   */
  extraUsers?: CreateUser[];
  /**
   * mongodb-memory-server automatically creates an root user (with "root" role)
   * @default 'mongodb-memory-server-root'
   */
  customRootName?: string;
  /**
   * mongodb-memory-server automatically creates an root user with this password
   * @default 'rootuser'
   */
  customRootPwd?: string;
  /**
   * Force to run "createAuth"
   * @default false "creatAuth" is normally only run when the given "dbPath" is empty (no files)
   */
  force?: boolean;
}

/**
 * Data used by _startUpInstance's "data" variable
 */
export interface StartupInstanceData {
  port: number;
  dbPath?: string;
  dbName: string;
  ip: string;
  storageEngine: StorageEngine;
  replSet?: string;
  tmpDir?: tmp.DirResult;
}

/**
 * Information about the currently running instance
 */
export interface MongoInstanceData extends StartupInstanceData {
  dbPath: string; // re-declare, because in this interface it is *not* optional
  instance: MongoInstance;
}

/**
 * All Events for "MongoMemoryServer"
 */
export enum MongoMemoryServerEvents {
  stateChange = 'stateChange',
}

/**
 * All States for "MongoMemoryServer._state"
 */
export enum MongoMemoryServerStates {
  new = 'new',
  starting = 'starting',
  running = 'running',
  stopped = 'stopped',
}

/**
 * All MongoDB Built-in Roles
 * @see https://docs.mongodb.com/manual/reference/built-in-roles/
 */
export type UserRoles =
  | 'read'
  | 'readWrite'
  | 'dbAdmin'
  | 'dbOwner'
  | 'userAdmin'
  | 'clusterAdmin'
  | 'clusterManager'
  | 'clusterMonitor'
  | 'hostManager'
  | 'backup'
  | 'restore'
  | 'readAnyDatabase'
  | 'readWriteAnyDatabase'
  | 'userAdminAnyDatabase'
  | 'dbAdminAnyDatabase'
  | 'root'
  | string;

/**
 * Interface options for "db.createUser" (used for this package)
 * This interface is WITHOUT the custom options from this package
 * (Some text copied from https://docs.mongodb.com/manual/reference/method/db.createUser/#definition)
 */
export interface CreateUserMongoDB {
  /**
   * Username
   */
  createUser: string;
  /**
   * Password
   */
  pwd: string;
  /**
   * Any arbitrary information.
   * This field can be used to store any data an admin wishes to associate with this particular user.
   * @example this could be the user’s full name or employee id.
   */
  customData?: {
    [key: string]: any;
  };
  /**
   * The Roles for the user, can be an empty array
   */
  roles: ({ role: UserRoles; db: string } | UserRoles)[];
  /**
   * Specify the specific SCRAM mechanism or mechanisms for creating SCRAM user credentials.
   */
  mechanisms?: ('SCRAM-SHA-1' | 'SCRAM-SHA-256')[];
  /**
   * The authentication restrictions the server enforces on the created user.
   * Specifies a list of IP addresses and CIDR ranges from which the user is allowed to connect to the server or from which the server can accept users.
   */
  authenticationRestrictions?: {
    clientSource?: string;
    serverAddress?: string;
  }[];
  /**
   * Indicates whether the server or the client digests the password.
   * "true" - The Server digests the Password
   * "false" - The Client digests the Password
   */
  digestPassword?: boolean;
}

/**
 * Interface options for "db.createUser" (used for this package)
 * This interface is WITH the custom options from this package
 * (Some text copied from https://docs.mongodb.com/manual/reference/method/db.createUser/#definition)
 */
export interface CreateUser extends CreateUserMongoDB {
  /**
   * In which Database to create this user in
   * @default 'admin' by default the "admin" database is used
   */
  database?: string;
}

export interface MongoMemoryServerGetStartOptions {
  createAuth: boolean;
  data: StartupInstanceData;
  mongodOptions: Partial<MongodOpts>;
}

export interface MongoMemoryServer extends EventEmitter {
  // Overwrite EventEmitter's definitions (to provide at least the event names)
  emit(event: MongoMemoryServerEvents, ...args: any[]): boolean;
  on(event: MongoMemoryServerEvents, listener: (...args: any[]) => void): this;
  once(event: MongoMemoryServerEvents, listener: (...args: any[]) => void): this;
}

export class MongoMemoryServer extends EventEmitter {
  protected _instanceInfo?: MongoInstanceData;
  opts: MongoMemoryServerOpts;
  protected _state: MongoMemoryServerStates = MongoMemoryServerStates.new;
  readonly auth?: Required<AutomaticAuth>;

  /**
   * Create an Mongo-Memory-Sever Instance
   *
   * Note: because of JavaScript limitations, autoStart cannot be awaited here, use ".create" for async/await ability
   * @param opts Mongo-Memory-Sever Options
   */
  constructor(opts?: MongoMemoryServerOpts) {
    super();
    this.opts = { ...opts };

    if (!isNullOrUndefined(this.opts.auth)) {
      // assign defaults
      this.auth = authDefault(this.opts.auth);
    }
  }

  /**
   * Create an Mongo-Memory-Sever Instance that can be awaited
   * @param opts Mongo-Memory-Sever Options
   */
  static async create(opts?: MongoMemoryServerOpts): Promise<MongoMemoryServer> {
    log('Called MongoMemoryServer.create() method');
    const instance = new MongoMemoryServer({ ...opts });
    await instance.start();

    return instance;
  }

  /**
   * Change "this._state" to "newState" and emit "stateChange" with "newState"
   * @param newState The new State to set & emit
   */
  protected stateChange(newState: MongoMemoryServerStates): void {
    this._state = newState;
    this.emit(MongoMemoryServerEvents.stateChange, newState);
  }

  /**
   * Start the in-memory Instance
   * @param forceSamePort Force to use the Same Port, if already an "instanceInfo" exists
   */
  async start(forceSamePort: boolean = false): Promise<boolean> {
    log('Called MongoMemoryServer.start() method');

    switch (this._state) {
      case MongoMemoryServerStates.new:
      case MongoMemoryServerStates.stopped:
        break;
      case MongoMemoryServerStates.running:
      case MongoMemoryServerStates.starting:
      default:
        throw new Error('Already in state running/starting or unkown');
    }

    if (!isNullOrUndefined(this._instanceInfo?.instance.childProcess)) {
      throw new Error('Cannot start because "instance.childProcess" is already defined!');
    }

    this.stateChange(MongoMemoryServerStates.starting);

    // check if an "beforeExit" listener for "this.cleanup" is already defined for this class, if not add one
    if (
      process
        .listeners('beforeExit')
        .findIndex((f: (...args: any[]) => any) => f === this.cleanup) <= -1
    ) {
      process.on('beforeExit', this.cleanup);
    }

    await this._startUpInstance(forceSamePort).catch((err) => {
      if (!debug.enabled('MongoMS:MongoMemoryServer')) {
        console.warn('Starting the instance failed, enable debug for more infomation');
      }
      throw err;
    });

    this.stateChange(MongoMemoryServerStates.running);

    return true;
  }

  /**
   * Find an new unlocked port
   * @param port An User defined default port
   */
  protected async getNewPort(port?: number): Promise<number> {
    const newPort = await getPort({ port });

    // only log this message if an custom port was provided
    if (port != newPort && typeof port === 'number') {
      log(`starting with port ${newPort}, since ${port} was locked`);
    }

    return newPort;
  }

  /**
   * Construct Instance Starting Options
   */
  protected async getStartOptions(): Promise<MongoMemoryServerGetStartOptions> {
    log('getStartOptions');
    /** Shortcut to this.opts.instance */
    const instOpts = this.opts.instance ?? {};
    /**
     * This variable is used for determining if "createAuth" should be run
     */
    let isNew: boolean = true;

    const data: StartupInstanceData = {
      port: await this.getNewPort(instOpts.port ?? undefined), // do (null or undefined) to undefined
      dbName: generateDbName(instOpts.dbName),
      ip: instOpts.ip ?? '127.0.0.1',
      storageEngine: instOpts.storageEngine ?? 'ephemeralForTest',
      replSet: instOpts.replSet,
      dbPath: instOpts.dbPath,
      tmpDir: undefined,
    };

    if (isNullOrUndefined(this._instanceInfo)) {
      // create an tmpDir instance if no "dbPath" is given
      if (!data.dbPath) {
        data.tmpDir = tmp.dirSync({
          mode: 0o755,
          prefix: 'mongo-mem-',
          unsafeCleanup: true,
        });
        data.dbPath = data.tmpDir.name;

        isNew = true; // just to ensure "isNew" is "true" because an new temporary directory got created
      } else {
        log(`Checking if "${data.dbPath}}" (no new tmpDir) already has data`);
        const files = await fspromises.readdir(data.dbPath);

        isNew = files.length > 0; // if there already files in the directory, assume that the database is not new
      }
    } else {
      isNew = false;
    }

    const createAuth: boolean =
      !!instOpts.auth && // check if auth is even meant to be enabled
      !isNullOrUndefined(this.auth) && // check if "this.auth" is defined
      !this.auth.disable && // check that "this.auth.disable" is falsey
      (this.auth.force || isNew) && // check that either "isNew" or "this.auth.force" is "true"
      !instOpts.replSet; // dont run "createAuth" when its an replset

    return {
      data: data,
      createAuth: createAuth,
      mongodOptions: {
        instance: {
          dbPath: data.dbPath,
          ip: data.ip,
          port: data.port,
          storageEngine: data.storageEngine,
          replSet: data.replSet,
          args: instOpts.args,
          auth: createAuth ? false : instOpts.auth, // disable "auth" for "createAuth"
        },
        binary: this.opts.binary,
        spawn: this.opts.spawn,
      },
    };
  }

  /**
   * Internal Function to start an instance
   * @param forceSamePort Force to use the Same Port, if already an "instanceInfo" exists
   * @private
   */
  async _startUpInstance(forceSamePort: boolean = false): Promise<void> {
    log('Called MongoMemoryServer._startUpInstance() method');

    if (!isNullOrUndefined(this._instanceInfo)) {
      log('_startUpInstance: "instanceInfo" already defined, reusing instance');
      if (!forceSamePort) {
        const newPort = await this.getNewPort(this._instanceInfo.port);
        this._instanceInfo.instance.instanceOpts.port = newPort;
        this._instanceInfo.port = newPort;
      }
      await this._instanceInfo.instance.run();

      return;
    }

    const { mongodOptions, createAuth, data } = await this.getStartOptions();
    log(`Creating new MongoDB instance with options: ${JSON.stringify(mongodOptions)}`);

    // After that startup MongoDB instance
    let instance = await MongoInstance.run(mongodOptions);

    // another "isNullOrUndefined" because otherwise typescript complains about "this.auth" possibly being not defined
    if (!isNullOrUndefined(this.auth) && createAuth) {
      log(`Running "createAuth" (force: "${this.auth.force}")`);
      await this.createAuth(data);

      if (data.storageEngine !== 'ephemeralForTest') {
        log('Killing No-Auth instance');
        await instance.kill();

        // TODO: change this to just change the options instead of an new instance after adding getters & setters
        log('Starting Auth Instance');
        instance = await MongoInstance.run({
          ...mongodOptions,
          instance: {
            ...mongodOptions.instance,
            auth: true,
          },
        });
      } else {
        console.warn(
          'Not Restarting MongoInstance for Auth\n' +
            'Storage engine is ephemeralForTest, which does not write data on shutdown, and mongodb does not allow changeing "auth" runtime'
        );
      }
    } else {
      // extra "if" to log when "disable" is set to "true"
      if (this.opts.auth?.disable) {
        log('AutomaticAuth.disable is set to "true" skipping "createAuth"');
      }
    }

    this._instanceInfo = {
      ...data,
      dbPath: data.dbPath as string, // because otherwise the types would be incompatible
      instance,
    };
  }

  /**
   * Stop the current In-Memory Instance
   * @param runCleanup run "this.cleanup"? (remove dbPath & reset "instanceInfo")
   */
  async stop(runCleanup: boolean = true): Promise<boolean> {
    log('Called MongoMemoryServer.stop() method');

    // just return "true" if there was never an instance
    if (isNullOrUndefined(this._instanceInfo)) {
      log('"instanceInfo" is not defined (never ran?)');
      return true;
    }

    if (this._state === MongoMemoryServerStates.stopped) {
      log(`stop: state is "stopped", so already stopped`);
      return true;
    }

    // assert here, just to be sure
    assertion(
      !isNullOrUndefined(this._instanceInfo.instance),
      new Error('"instanceInfo.instance" is undefined!')
    );

    log(
      `Shutdown MongoDB server on port ${
        this._instanceInfo.port
      } with pid ${this._instanceInfo.instance.getPid()}` // "undefined" would say more than ""
    );
    await this._instanceInfo.instance.kill();

    this.stateChange(MongoMemoryServerStates.stopped);

    if (runCleanup) {
      await this.cleanup(false);
    }

    return true;
  }

  /**
   * Remove the defined dbPath
   * This function gets automatically called on process event "beforeExit" (with force being "false")
   * @param force Remove the dbPath even if it is no "tmpDir" (and re-check if tmpDir actually removed it)
   * @throws If "state" is not "stopped"
   * @throws If "instanceInfo" is not defined
   * @throws If an fs error occured
   */
  async cleanup(force: boolean): Promise<void>;
  /**
   * This Overload is used for the "beforeExit" listener (ignore this)
   * @internal
   */
  async cleanup(code?: number): Promise<void>;
  async cleanup(force: boolean | number = false): Promise<void> {
    if (typeof force !== 'boolean') {
      force = false;
    }
    assertion(
      this.state === MongoMemoryServerStates.stopped,
      new Error('Cannot cleanup when state is not "stopped"')
    );
    process.removeListener('beforeExit', this.cleanup);
    if (isNullOrUndefined(this._instanceInfo)) {
      log('cleanup: "instanceInfo" is undefined');
      return;
    }
    assertion(
      isNullOrUndefined(this._instanceInfo.instance.childProcess),
      new Error('Cannot cleanup because "instance.childProcess" is still defined')
    );

    log(`cleanup: force ${force}`);

    const tmpDir = this._instanceInfo.tmpDir;
    if (!isNullOrUndefined(tmpDir)) {
      log(`cleanup: removing tmpDir at ${tmpDir.name}`);
      tmpDir.removeCallback();
    }

    if (force) {
      const dbPath: string = this._instanceInfo.dbPath;
      const res = await statPath(dbPath);

      if (isNullOrUndefined(res)) {
        log(`cleanup: force is true, but path "${dbPath}" dosnt exist anymore`);
      } else {
        assertion(res.isDirectory(), new Error('Defined dbPath is not an directory'));

        if (lt(process.version, '12.10.0')) {
          try {
            const rimraf = (await import('rimraf')).sync;
            rimraf(dbPath);
          } catch (err) {
            console.warn('When using NodeJS below 12.10 package "rimraf" is needed');
            throw err;
          }
        } else {
          await fspromises.rmdir(dbPath, { recursive: true, maxRetries: 1 });
        }
      }
    }

    this.stateChange(MongoMemoryServerStates.new); // reset "state" to new, because the dbPath got removed
    this._instanceInfo = undefined;
  }

  /**
   * Get Information about the currently running instance, if it is not running it returns "undefined"
   */
  get instanceInfo(): MongoInstanceData | undefined {
    return this._instanceInfo;
  }

  /**
   * Get Current state of this class
   */
  get state(): MongoMemoryServerStates {
    return this._state;
  }

  /**
   * Ensure that the instance is running
   * -> throws if instance cannot be started
   */
  async ensureInstance(): Promise<MongoInstanceData> {
    log('Called MongoMemoryServer.ensureInstance() method');

    switch (this._state) {
      case MongoMemoryServerStates.running:
        if (this._instanceInfo) {
          return this._instanceInfo;
        }
        throw new Error('MongoMemoryServer "_state" is "running" but "instanceInfo" is undefined!');
      case MongoMemoryServerStates.new:
      case MongoMemoryServerStates.stopped:
        break;
      case MongoMemoryServerStates.starting:
        return new Promise((res, rej) =>
          this.once(MongoMemoryServerEvents.stateChange, (state) => {
            if (state != MongoMemoryServerStates.running) {
              rej(
                new Error(
                  `"ensureInstance" waited for "running" but got an different state: "${state}"`
                )
              );
            }
            res(this._instanceInfo);
          })
        );
      default:
        throw new Error(`"ensureInstance" does not have an case for "${this._state}"`);
    }

    log(' - no running instance, calling `start()` command');
    await this.start();
    log(' - `start()` command was succesfully resolved');

    // check again for 1. Typescript-type reasons and 2. if .start failed to throw an error
    if (!this._instanceInfo) {
      throw new Error('Ensure-Instance failed to start an instance!');
    }

    return this._instanceInfo;
  }

  /**
   * Generate the Connection string used by mongodb
   * @param otherDbName Set an custom Database name, or set this to "true" to generate an different name
   */
  getUri(otherDbName?: string | boolean): string {
    assertionInstanceInfo(this._instanceInfo);

    let dbName: string = this._instanceInfo.dbName;

    // using "if" instead of nested "?:"
    if (!isNullOrUndefined(otherDbName)) {
      // use "otherDbName" if string, otherwise generate an db-name
      dbName = typeof otherDbName === 'string' ? otherDbName : generateDbName();
    }

    return uriTemplate(this._instanceInfo.ip, this._instanceInfo.port, dbName);
  }

  /**
   * Create Users and restart instance to enable auth
   * This Function assumes "this.opts.auth" is defined / enabled
   * @param data Used to get "ip" and "port"
   *
   * @internal
   */
  async createAuth(data: StartupInstanceData): Promise<void> {
    assertion(
      !isNullOrUndefined(this.auth),
      new Error('"createAuth" got called, but "this.auth" is undefined!')
    );
    log('createAuth, options:', this.auth);
    const con: MongoClient = await MongoClient.connect(uriTemplate(data.ip, data.port, 'admin'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    let db = con.db('admin'); // just to ensure it is actually the "admin" database AND to have the "Db" data

    // Create the root user
    log(`Creating Root user, name: "${this.auth.customRootName}"`);
    await db.command({
      createUser: this.auth.customRootName,
      pwd: 'rootuser',
      mechanisms: ['SCRAM-SHA-256'],
      customData: {
        createBy: 'mongodb-memory-server',
        as: 'ROOTUSER',
      },
      roles: ['root'],
    } as CreateUserMongoDB);

    if (this.auth.extraUsers.length > 0) {
      log(`Creating "${this.auth.extraUsers.length}" Custom Users`);
      this.auth.extraUsers.sort((a, b) => {
        if (a.database === 'admin') {
          return -1; // try to make all "admin" at the start of the array
        }
        return a.database === b.database ? 0 : 1; // "0" to sort same databases continuesly, "-1" if nothing before/above applies
      });

      for (const user of this.auth.extraUsers) {
        user.database = isNullOrUndefined(user.database) ? 'admin' : user.database;
        // just to have not to call "con.db" everytime in the loop if its the same
        if (user.database !== db.databaseName) {
          db = con.db(user.database);
        }

        log('Creating User: ', user);
        await db.command({
          createUser: user.createUser,
          pwd: user.pwd,
          customData: user.customData ?? {},
          roles: user.roles,
          authenticationRestrictions: user.authenticationRestrictions ?? [],
          mechanisms: user.mechanisms ?? ['SCRAM-SHA-256'],
          digestPassword: user.digestPassword ?? true,
        } as CreateUserMongoDB);
      }
    }

    await con.close();
  }
}

export default MongoMemoryServer;

/**
 * This function is to de-duplicate code
 * -> this couldnt be included in the class, because "asserts this.instanceInfo" is not allowed
 * @param val this.instanceInfo
 */
function assertionInstanceInfo(val: unknown): asserts val is MongoInstanceData {
  assertion(!isNullOrUndefined(val), new Error('"instanceInfo" is undefined'));
}
