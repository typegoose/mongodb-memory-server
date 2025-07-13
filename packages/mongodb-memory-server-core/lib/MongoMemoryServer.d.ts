/// <reference types="node" />
/// <reference types="node" />
import { SpawnOptions } from 'child_process';
import { ManagerAdvanced, Cleanup } from './util/utils';
import { MongoInstance, MongodOpts, MongoMemoryInstanceOpts } from './util/MongoInstance';
import { MongoBinaryOpts } from './util/MongoBinary';
import { EventEmitter } from 'events';
/**
 * Type with automatic options removed
 * "auth" is automatically handled and set via {@link AutomaticAuth}
 */
export type MemoryServerInstanceOpts = Omit<MongoMemoryInstanceOpts, 'auth'> & ExtraInstanceOpts;
/**
 * Extra Instance options specifically for {@link MongoMemoryServer}
 */
export interface ExtraInstanceOpts {
    /**
     * Change if port generation is enabled or not.
     *
     * If enabled and a port is set, that port is tried, if locked a new one will be generated.
     * If disabled and a port is set, only that port is tried, if locked a error will be thrown.
     * If disabled and no port is set, will act as if enabled.
     *
     * This setting will get overwritten by `start`'s `forceSamePort` parameter if set
     *
     * @default true
     */
    portGeneration?: boolean;
}
/**
 * MongoMemoryServer Stored Options
 */
export interface MongoMemoryServerOpts {
    instance?: MemoryServerInstanceOpts;
    binary?: MongoBinaryOpts;
    spawn?: SpawnOptions;
    /**
     * Defining this enables automatic user creation
     */
    auth?: AutomaticAuth;
    /**
     * Options for automatic dispose for "Explicit Resource Management"
     */
    dispose?: DisposeOptions;
}
/**
 * Options to configure `Symbol.asyncDispose` behavior
 */
export interface DisposeOptions {
    /**
     * Set whether to run the dispose hook or not.
     * Note that this only applies when `Symbol.asyncDispose` is actually called
     * @default true
     */
    enabled?: boolean;
    /**
     * Pass custom options for cleanup
     * @default { doCleanup: true, force: false }
     */
    cleanup?: Cleanup;
}
export interface AutomaticAuth {
    /**
     * Enable Automatic User creation
     * @default false
     */
    enable?: boolean;
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
     * @default false "createAuth" is normally only run when the given "dbPath" is empty (no files)
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
    tmpDir?: string;
    keyfileLocation?: NonNullable<MongoMemoryInstanceOpts['keyfileLocation']>;
    launchTimeout?: NonNullable<MongoMemoryInstanceOpts['launchTimeout']>;
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
export declare enum MongoMemoryServerEvents {
    stateChange = "stateChange"
}
/**
 * All States for "MongoMemoryServer._state"
 */
export declare enum MongoMemoryServerStates {
    new = "new",
    starting = "starting",
    running = "running",
    stopped = "stopped"
}
/**
 * All MongoDB Built-in Roles
 * @see https://docs.mongodb.com/manual/reference/built-in-roles/
 */
export type UserRoles = 'read' | 'readWrite' | 'dbAdmin' | 'dbOwner' | 'userAdmin' | 'clusterAdmin' | 'clusterManager' | 'clusterMonitor' | 'hostManager' | 'backup' | 'restore' | 'readAnyDatabase' | 'readWriteAnyDatabase' | 'userAdminAnyDatabase' | 'dbAdminAnyDatabase' | 'root' | string;
export interface RoleSpecification {
    /**
     * A role grants privileges to perform sets of actions on defined resources.
     * A given role applies to the database on which it is defined and can grant access down to a collection level of granularity.
     */
    role: string;
    /** The database this user's role should effect. */
    db: string;
}
/**
 * Interface options for "db.createUser" (used for this package)
 * This interface is WITHOUT the custom options from this package
 * (Some text copied from https://docs.mongodb.com/manual/reference/method/db.createUser/#definition)
 * This interface only exists, because mongodb dosnt provide such an interface for "createUser" (or as just very basic types) as of 6.7.0
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
    roles: string | string[] | RoleSpecification | RoleSpecification[];
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
    /** Defines wheter should {@link MongoMemoryServer.createAuth} be run */
    createAuth: boolean;
    data: StartupInstanceData;
    mongodOptions: Partial<MongodOpts>;
}
export interface MongoMemoryServer extends EventEmitter {
    emit(event: MongoMemoryServerEvents, ...args: any[]): boolean;
    on(event: MongoMemoryServerEvents, listener: (...args: any[]) => void): this;
    once(event: MongoMemoryServerEvents, listener: (...args: any[]) => void): this;
}
export declare class MongoMemoryServer extends EventEmitter implements ManagerAdvanced {
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
    protected _state: MongoMemoryServerStates;
    /**
     * Original Auth Configuration (this.opts can be changed if stopped, but auth cannot be changed here)
     */
    readonly auth?: Required<AutomaticAuth>;
    /**
     * Create a Mongo-Memory-Sever Instance
     * @param opts Mongo-Memory-Sever Options
     */
    constructor(opts?: MongoMemoryServerOpts);
    /**
     * Create a Mongo-Memory-Sever Instance that can be awaited
     * @param opts Mongo-Memory-Sever Options
     */
    static create(opts?: MongoMemoryServerOpts): Promise<MongoMemoryServer>;
    /**
     * Start the Mongod Instance
     * @param forceSamePort Force to use the port defined in `options.instance` (disabled port generation)
     * @throws if state is not "new" or "stopped"
     */
    start(forceSamePort?: boolean): Promise<void>;
    /**
     * Change "this._state" to "newState" and emit "stateChange" with "newState"
     * @param newState The new State to set & emit
     */
    protected stateChange(newState: MongoMemoryServerStates): void;
    /**
     * Debug-log with template applied
     * @param msg The Message to log
     */
    protected debug(msg: string, ...extra: unknown[]): void;
    /**
     * Find a new unlocked port
     * @param port A User defined default port
     */
    protected getNewPort(port?: number): Promise<number>;
    /**
     * Construct Instance Starting Options
     * @param forceSamePort Force to use the port defined in `options.instance` (disabled port generation)
     */
    protected getStartOptions(forceSamePort?: boolean): Promise<MongoMemoryServerGetStartOptions>;
    /**
     * Internal Function to start an instance
     * @param forceSamePort Force to use the port defined in `options.instance` (disabled port generation)
     * @private
     */
    _startUpInstance(forceSamePort?: boolean): Promise<void>;
    /**
     * Stop the current In-Memory Instance
     * @param cleanupOptions Set how to run ".cleanup", by default only `{ doCleanup: true }` is used
     */
    stop(cleanupOptions?: Cleanup): Promise<boolean>;
    /**
     * Remove the defined dbPath
     * @param options Set how to run a cleanup, by default `{ doCleanup: true }` is used
     * @throws If "state" is not "stopped"
     * @throws If "instanceInfo" is not defined
     * @throws If an fs error occured
     */
    cleanup(options?: Cleanup): Promise<void>;
    /**
     * Get Information about the currently running instance, if it is not running it returns "undefined"
     */
    get instanceInfo(): MongoInstanceData | undefined;
    /**
     * Get Current state of this class
     */
    get state(): MongoMemoryServerStates;
    /**
     * Ensure that the instance is running
     * -> throws if instance cannot be started
     */
    ensureInstance(): Promise<MongoInstanceData>;
    /**
     * Generate the Connection string used by mongodb
     * @param otherDb add a database into the uri (in mongodb its the auth database, in mongoose its the default database for models)
     * @param otherIp change the ip in the generated uri, default will otherwise always be "127.0.0.1"
     * @throws if state is not "running" (or "starting")
     * @throws if a server doesnt have "instanceInfo.port" defined
     * @returns a valid mongo URI, by the definition of https://docs.mongodb.com/manual/reference/connection-string/
     */
    getUri(otherDb?: string, otherIp?: string): string;
    /**
     * Create the Root user and additional users using the [localhost exception](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)
     * This Function assumes "this.opts.auth" is already processed into "this.auth"
     * @param data Used to get "ip" and "port"
     * @internal
     */
    createAuth(data: StartupInstanceData): Promise<void>;
    /**
     * Helper function to determine if the "auth" object is set and not to be disabled
     * This function expectes to be run after the auth object has been transformed to a object
     * @returns "true" when "auth" should be enabled
     */
    protected authObjectEnable(): boolean;
    [Symbol.asyncDispose](): Promise<void>;
}
export default MongoMemoryServer;
//# sourceMappingURL=MongoMemoryServer.d.ts.map