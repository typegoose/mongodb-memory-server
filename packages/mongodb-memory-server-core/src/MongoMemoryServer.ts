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
  ManagerAdvanced,
  Cleanup,
} from './util/utils';
import { MongoInstance, MongodOpts, MongoMemoryInstanceOpts } from './util/MongoInstance';
import { MongoBinaryOpts } from './util/MongoBinary';
import debug from 'debug';
import { EventEmitter } from 'events';
import { promises as fspromises } from 'fs';
import { MongoClient } from 'mongodb';
import { lt } from 'semver';
import { EnsureInstanceError, StateError } from './util/errors';

const log = debug('MongoMS:MongoMemoryServer');

tmp.setGracefulCleanup();

/**
 * MongoMemoryServer Stored Options
 */
export interface MongoMemoryServerOpts {
  instance?: MongoMemoryInstanceOpts;
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
   * mongodb-memory-server automatically creates a root user (with "root" role)
   * @default 'mongodb-memory-server-root'
   */
  customRootName?: string;
  /**
   * mongodb-memory-server automatically creates a root user with this password
   * @default 'rootuser'
   */
  customRootPwd?: string;
  /**
   * Force to run "createAuth"
   * @default false "creatAuth" is normally only run when the given "dbPath" is empty (no files)
   */
  force?: boolean;
  /**
   * Custom Keyfile content to use (only has an effect in replset's)
   * Note: This is not secure, this is for test environments only!
   * @default "0123456789"
   */
  keyfileContent?: string;
}

/**
 * Data used by _startUpInstance's "data" variable
 */
export interface StartupInstanceData {
  port: NonNullable<MongoMemoryInstanceOpts['port']>;
  dbPath?: MongoMemoryInstanceOpts['dbPath'];
  dbName: NonNullable<MongoMemoryInstanceOpts['dbName']>;
  ip: NonNullable<MongoMemoryInstanceOpts['ip']>;
  storageEngine: NonNullable<MongoMemoryInstanceOpts['storageEngine']>;
  replSet?: NonNullable<MongoMemoryInstanceOpts['replSet']>;
  tmpDir?: tmp.DirResult;
}

/**
 * Information about the currently running instance
 */
export interface MongoInstanceData extends StartupInstanceData {
  dbPath: NonNullable<StartupInstanceData['dbPath']>;
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
 * This interface only exists, because mongodb dosnt provide such an interface for "createUser" (or as just very basic types)
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

export class MongoMemoryServer extends EventEmitter implements ManagerAdvanced {
  /**
   * Information about the started instance
   */
  protected _instanceInfo?: MongoInstanceData;
  /**
   * General Options for this Instance
   */
  opts: MongoMemoryServerOpts;
  /**
   * The Current State of this instance
   */
  protected _state: MongoMemoryServerStates = MongoMemoryServerStates.new;
  /**
   * Original Auth Configuration (this.opts can be changed if stopped, but auth cannot be changed here)
   */
  readonly auth?: Required<AutomaticAuth>;

  /**
   * Create an Mongo-Memory-Sever Instance
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
    log('create: Called .create() method');
    const instance = new MongoMemoryServer({ ...opts });
    await instance.start();

    return instance;
  }

  /**
   * Start the Mongod Instance
   * @param forceSamePort Force to use the Same Port, if already an "instanceInfo" exists
   * @throws if state is not "new" or "stopped"
   */
  async start(forceSamePort: boolean = false): Promise<void> {
    this.debug('start: Called .start() method');

    switch (this._state) {
      case MongoMemoryServerStates.new:
      case MongoMemoryServerStates.stopped:
        break;
      case MongoMemoryServerStates.running:
      case MongoMemoryServerStates.starting:
      default:
        throw new StateError(
          [MongoMemoryServerStates.new, MongoMemoryServerStates.stopped],
          this.state
        );
    }

    assertion(
      isNullOrUndefined(this._instanceInfo?.instance.mongodProcess),
      new Error('Cannot start because "instance.mongodProcess" is already defined!')
    );

    this.stateChange(MongoMemoryServerStates.starting);

    await this._startUpInstance(forceSamePort).catch(async (err) => {
      if (!debug.enabled('MongoMS:MongoMemoryServer')) {
        console.warn('Starting the instance failed, enable debug for more information');
      }

      await this.stop(false); // still try to close the instance that was spawned, without cleanup for investigation

      this.stateChange(MongoMemoryServerStates.stopped);

      throw err;
    });

    this.stateChange(MongoMemoryServerStates.running);
    this.debug('start: Instance fully Started');
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
   * Debug-log with template applied
   * @param msg The Message to log
   */
  protected debug(msg: string, ...extra: unknown[]): void {
    const port = this._instanceInfo?.port ?? 'unknown';
    log(`Mongo[${port}]: ${msg}`, ...extra);
  }

  /**
   * Find an new unlocked port
   * @param port An User defined default port
   */
  protected async getNewPort(port?: number): Promise<number> {
    const newPort = await getPort({ port });

    // only log this message if an custom port was provided
    if (port != newPort && typeof port === 'number') {
      this.debug(`getNewPort: starting with port "${newPort}", since "${port}" was locked`);
    }

    return newPort;
  }

  /**
   * Construct Instance Starting Options
   */
  protected async getStartOptions(
    forceSamePort: boolean = false
  ): Promise<MongoMemoryServerGetStartOptions> {
    this.debug(`getStartOptions: forceSamePort: ${forceSamePort}`);
    /** Shortcut to this.opts.instance */
    const instOpts = this.opts.instance ?? {};
    /**
     * This variable is used for determining if "createAuth" should be run
     */
    let isNew: boolean = true;

    // use pre-defined port if available, otherwise generate a new port
    let port = typeof instOpts.port === 'number' ? instOpts.port : undefined;

    // if "forceSamePort" is not true, and get a available port
    if (!forceSamePort || isNullOrUndefined(port)) {
      port = await this.getNewPort(port);
    }

    const data: StartupInstanceData = {
      port: port,
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
        this.debug(
          `getStartOptions: Checking if "${data.dbPath}}" (no new tmpDir) already has data`
        );
        const files = await fspromises.readdir(data.dbPath);

        isNew = files.length === 0; // if there are no files in the directory, assume that the database is new
      }
    } else {
      isNew = false;
    }

    const createAuth: boolean =
      (typeof instOpts.auth === 'boolean' ? instOpts.auth : true) && // check if auth is even meant to be enabled
      !isNullOrUndefined(this.auth) && // check if "this.auth" is defined
      !this.auth.disable && // check that "this.auth.disable" is falsey
      (this.auth.force || isNew) && // check that either "isNew" or "this.auth.force" is "true"
      !instOpts.replSet; // dont run "createAuth" when its an replset

    return {
      data: data,
      createAuth: createAuth,
      mongodOptions: {
        instance: {
          ...data,
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
    this.debug('_startUpInstance: Called MongoMemoryServer._startUpInstance() method');

    if (!isNullOrUndefined(this._instanceInfo)) {
      this.debug('_startUpInstance: "instanceInfo" already defined, reusing instance');

      if (!forceSamePort) {
        const newPort = await this.getNewPort(this._instanceInfo.port);
        this._instanceInfo.instance.instanceOpts.port = newPort;
        this._instanceInfo.port = newPort;
      }

      await this._instanceInfo.instance.start();

      return;
    }

    const { mongodOptions, createAuth, data } = await this.getStartOptions(forceSamePort);
    this.debug(`_startUpInstance: Creating new MongoDB instance with options:`, mongodOptions);

    const instance = await MongoInstance.create(mongodOptions);
    this.debug(`_startUpInstance: Instance Started, createAuth: "${createAuth}"`);

    // "isNullOrUndefined" because otherwise typescript complains about "this.auth" possibly being not defined
    if (!isNullOrUndefined(this.auth) && createAuth) {
      this.debug(`_startUpInstance: Running "createAuth" (force: "${this.auth.force}")`);
      await this.createAuth(data);

      if (data.storageEngine !== 'ephemeralForTest') {
        this.debug('_startUpInstance: Killing No-Auth instance');
        await instance.stop();

        this.debug('_startUpInstance: Starting Auth Instance');
        instance.instanceOpts.auth = true;
        await instance.start();
      } else {
        console.warn(
          'Not Restarting MongoInstance for Auth\n' +
            'Storage engine is "ephemeralForTest", which does not write data on shutdown, and mongodb does not allow changing "auth" runtime'
        );
      }
    } else {
      // extra "if" to log when "disable" is set to "true"
      if (this.opts.auth?.disable) {
        this.debug(
          '_startUpInstance: AutomaticAuth.disable is set to "true" skipping "createAuth"'
        );
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
   *
   * @deprecated replace argument with `Cleanup` interface object
   */
  async stop(runCleanup: boolean): Promise<boolean>; // TODO: for next major release (9.0), this should be removed
  /**
   * Stop the current In-Memory Instance
   * @param cleanupOptions Set how to run ".cleanup", by default only `{ doCleanup: true }` is used
   */
  async stop(cleanupOptions?: Cleanup): Promise<boolean>;
  async stop(cleanupOptions?: boolean | Cleanup): Promise<boolean> {
    this.debug('stop: Called .stop() method');

    /** Default to cleanup temporary, but not custom dbpaths */
    let cleanup: Cleanup = { doCleanup: true, force: false };

    // handle the old way of setting wheter to cleanup or not
    // TODO: for next major release (9.0), this should be removed
    if (typeof cleanupOptions === 'boolean') {
      cleanup.doCleanup = cleanupOptions;
    }

    // handle the new way of setting what and how to cleanup
    if (typeof cleanupOptions === 'object') {
      cleanup = cleanupOptions;
    }

    // just return "true" if there was never an instance
    if (isNullOrUndefined(this._instanceInfo)) {
      this.debug('stop: "instanceInfo" is not defined (never ran?)');

      return false;
    }

    if (this._state === MongoMemoryServerStates.stopped) {
      this.debug('stop: state is "stopped", trying to stop / kill anyway');
    }

    this.debug(
      `stop: Stopping MongoDB server on port ${this._instanceInfo.port} with pid ${this._instanceInfo.instance?.mongodProcess?.pid}` // "undefined" would say more than ""
    );
    await this._instanceInfo.instance.stop();

    this.stateChange(MongoMemoryServerStates.stopped);

    if (cleanup.doCleanup) {
      await this.cleanup(cleanup);
    }

    return true;
  }

  /**
   * Remove the defined dbPath
   * @param force Remove the dbPath even if it is no "tmpDir" (and re-check if tmpDir actually removed it)
   * @throws If "state" is not "stopped"
   * @throws If "instanceInfo" is not defined
   * @throws If an fs error occured
   *
   * @deprecated replace argument with `Cleanup` interface object
   */
  async cleanup(force: boolean): Promise<void>; // TODO: for next major release (9.0), this should be removed
  /**
   * Remove the defined dbPath
   * @param options Set how to run a cleanup, by default `{ doCleanup: true }` is used
   * @throws If "state" is not "stopped"
   * @throws If "instanceInfo" is not defined
   * @throws If an fs error occured
   */
  async cleanup(options?: Cleanup): Promise<void>;
  async cleanup(options?: boolean | Cleanup): Promise<void> {
    assertionIsMMSState(MongoMemoryServerStates.stopped, this.state);

    /** Default to doing cleanup, but not forcing it */
    let cleanup: Cleanup = { doCleanup: true, force: false };

    // handle the old way of setting wheter to cleanup or not
    // TODO: for next major release (9.0), this should be removed
    if (typeof options === 'boolean') {
      cleanup.force = options;
    }

    // handle the new way of setting what and how to cleanup
    if (typeof options === 'object') {
      cleanup = options;
    }

    this.debug(`cleanup:`, cleanup);

    // dont do cleanup, if "doCleanup" is false
    if (!cleanup.doCleanup) {
      this.debug('cleanup: "doCleanup" is set to false');

      return;
    }

    if (isNullOrUndefined(this._instanceInfo)) {
      this.debug('cleanup: "instanceInfo" is undefined');

      return;
    }

    assertion(
      isNullOrUndefined(this._instanceInfo.instance.mongodProcess),
      new Error('Cannot cleanup because "instance.mongodProcess" is still defined')
    );

    const tmpDir = this._instanceInfo.tmpDir;

    if (!isNullOrUndefined(tmpDir)) {
      this.debug(`cleanup: removing tmpDir at ${tmpDir.name}`);
      tmpDir.removeCallback();
    }

    if (cleanup.force) {
      const dbPath: string = this._instanceInfo.dbPath;
      const res = await statPath(dbPath);

      if (isNullOrUndefined(res)) {
        this.debug(`cleanup: force is true, but path "${dbPath}" dosnt exist anymore`);
      } else {
        assertion(res.isDirectory(), new Error('Defined dbPath is not an directory'));

        if (lt(process.version, '14.14.0')) {
          // this has to be used for 12.10 - 14.13 (inclusive) because ".rm" did not exist yet
          await fspromises.rmdir(dbPath, { recursive: true, maxRetries: 1 });
        } else {
          // this has to be used for 14.14+ (inclusive) because ".rmdir" and "recursive" got deprecated (DEP0147)
          await fspromises.rm(dbPath, { recursive: true, maxRetries: 1 });
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
    this.debug('ensureInstance: Called .ensureInstance() method');

    switch (this._state) {
      case MongoMemoryServerStates.running:
        if (this._instanceInfo) {
          return this._instanceInfo;
        }

        throw new EnsureInstanceError(true);
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

              return;
            }

            // this assertion is mainly for types (typescript otherwise would complain that "_instanceInfo" might be "undefined")
            assertion(
              !isNullOrUndefined(this._instanceInfo),
              new Error('InstanceInfo is undefined!')
            );

            res(this._instanceInfo);
          })
        );
      default:
        throw new StateError(
          [
            MongoMemoryServerStates.running,
            MongoMemoryServerStates.new,
            MongoMemoryServerStates.stopped,
            MongoMemoryServerStates.starting,
          ],
          this.state
        );
    }

    this.debug('ensureInstance: no running instance, calling "start()" command');
    await this.start();
    this.debug('ensureInstance: "start()" command was succesfully resolved');

    // check again for 1. Typescript-type reasons and 2. if .start failed to throw an error
    if (!this._instanceInfo) {
      throw new EnsureInstanceError(false);
    }

    return this._instanceInfo;
  }

  /**
   * Generate the Connection string used by mongodb
   * @param otherDb add an database into the uri (in mongodb its the auth database, in mongoose its the default database for models)
   * @param otherIp change the ip in the generated uri, default will otherwise always be "127.0.0.1"
   * @throws if state is not "running" (or "starting")
   * @throws if an server doesnt have "instanceInfo.port" defined
   * @returns an valid mongo URI, by the definition of https://docs.mongodb.com/manual/reference/connection-string/
   */
  getUri(otherDb?: string, otherIp?: string): string {
    this.debug('getUri:', this.state, otherDb, otherIp);

    switch (this.state) {
      case MongoMemoryServerStates.running:
      case MongoMemoryServerStates.starting:
        break;
      case MongoMemoryServerStates.stopped:
      default:
        throw new StateError(
          [MongoMemoryServerStates.running, MongoMemoryServerStates.starting],
          this.state
        );
    }

    assertionInstanceInfo(this._instanceInfo);

    return uriTemplate(otherIp || '127.0.0.1', this._instanceInfo.port, generateDbName(otherDb));
  }

  /**
   * Create Users and restart instance to enable auth
   * This Function assumes "this.opts.auth" is already processed into "this.auth"
   * @param data Used to get "ip" and "port"
   * @internal
   */
  async createAuth(data: StartupInstanceData): Promise<void> {
    assertion(
      !isNullOrUndefined(this.auth),
      new Error('"createAuth" got called, but "this.auth" is undefined!')
    );
    this.debug('createAuth: options:', this.auth);
    const con: MongoClient = await MongoClient.connect(
      uriTemplate(data.ip, data.port, 'admin'),
      {}
    );

    let db = con.db('admin'); // just to ensure it is actually the "admin" database AND to have the "Db" data

    // Create the root user
    this.debug(`createAuth: Creating Root user, name: "${this.auth.customRootName}"`);
    await db.command({
      createUser: this.auth.customRootName,
      pwd: this.auth.customRootPwd,
      mechanisms: ['SCRAM-SHA-256'],
      customData: {
        createdBy: 'mongodb-memory-server',
        as: 'ROOTUSER',
      },
      roles: ['root'],
      // "writeConcern" is needced, otherwise replset servers might fail with "auth failed: such user does not exist"
      writeConcern: {
        w: 'majority',
      },
    } as CreateUserMongoDB);

    if (this.auth.extraUsers.length > 0) {
      this.debug(`createAuth: Creating "${this.auth.extraUsers.length}" Custom Users`);
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

        this.debug('createAuth: Creating User: ', user);
        await db.command({
          createUser: user.createUser,
          pwd: user.pwd,
          customData: {
            ...user.customData,
            createdBy: 'mongodb-memory-server',
            as: 'EXTRAUSER',
          },
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

/**
 * Helper function to de-duplicate state checking for "MongoMemoryServerStates"
 * @param wantedState The State that is wanted
 * @param currentState The current State ("this._state")
 */
function assertionIsMMSState(
  wantedState: MongoMemoryServerStates,
  currentState: MongoMemoryServerStates
): void {
  assertion(currentState === wantedState, new StateError([wantedState], currentState));
}
