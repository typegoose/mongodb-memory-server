/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import { MongoMemoryServer, AutomaticAuth, DisposeOptions } from './MongoMemoryServer';
import { Cleanup, ManagerAdvanced } from './util/utils';
import { MongoBinaryOpts } from './util/MongoBinary';
import { MongoMemoryInstanceOpts, MongoMemoryInstanceOptsBase, StorageEngine } from './util/MongoInstance';
import { SpawnOptions } from 'child_process';
/**
 * Replica set specific options.
 */
export interface ReplSetOpts {
    /**
     * Enable Authentication
     * @default false
     */
    auth?: AutomaticAuth;
    /**
     * additional command line arguments passed to `mongod`
     * @default []
     */
    args?: string[];
    /**
     * if this number is bigger than "instanceOpts.length", more "generic" servers get started
     * if this number is lower than "instanceOpts.length", no more "generic" servers get started (server count will be "instanceOpts.length")
     * @default 1
     */
    count?: number;
    /**
     * add an database into the uri (in mongodb its the auth database, in mongoose its the default database for models)
     * @default ""
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
     * @default 'ephemeralForTest' unless mongodb version is `7.0.0`, where its `wiredTiger`
     */
    storageEngine?: StorageEngine;
    /**
     * Options for "rsConfig"
     * @default {}
     */
    configSettings?: MongoMemoryReplSetConfigSettings;
    /**
     * Options for automatic dispose for "Explicit Resource Management"
     */
    dispose?: DisposeOptions;
}
/**
 * Options for "rsConfig"
 */
export interface MongoMemoryReplSetConfigSettings {
    chainingAllowed?: boolean;
    heartbeatTimeoutSecs?: number;
    heartbeatIntervalMillis?: number;
    electionTimeoutMillis?: number;
    catchUpTimeoutMillis?: number;
}
/**
 * Options for the replSet
 */
export interface MongoMemoryReplSetOpts {
    /**
     * Specific Options to use for some instances
     */
    instanceOpts: MongoMemoryInstanceOptsBase[];
    /**
     * Binary Options used for all instances
     */
    binary: MongoBinaryOpts;
    /**
     * Options used for all instances
     * -> gets overwritten by specific "instanceOpts"
     */
    replSet: ReplSetOpts;
}
/**
 * Enum for "_state" inside "MongoMemoryReplSet"
 */
export declare enum MongoMemoryReplSetStates {
    init = "init",
    running = "running",
    stopped = "stopped"
}
/**
 * All Events for "MongoMemoryReplSet"
 */
export declare enum MongoMemoryReplSetEvents {
    stateChange = "stateChange"
}
export interface MongoMemoryReplSet extends EventEmitter {
    emit(event: MongoMemoryReplSetEvents, ...args: any[]): boolean;
    on(event: MongoMemoryReplSetEvents, listener: (...args: any[]) => void): this;
    once(event: MongoMemoryReplSetEvents, listener: (...args: any[]) => void): this;
}
/**
 * Class for managing an replSet
 */
export declare class MongoMemoryReplSet extends EventEmitter implements ManagerAdvanced {
    /**
     * All servers this ReplSet instance manages
     */
    servers: MongoMemoryServer[];
    /** Options for individual instances */
    protected _instanceOpts: MongoMemoryInstanceOptsBase[];
    /** Options for the Binary across all instances */
    protected _binaryOpts: MongoBinaryOpts;
    /** Options for the Replset itself and defaults for instances */
    protected _replSetOpts: Required<ReplSetOpts>;
    /** TMPDIR for the keyfile, when auth is used */
    protected _keyfiletmp?: string;
    protected _state: MongoMemoryReplSetStates;
    protected _ranCreateAuth: boolean;
    constructor(opts?: Partial<MongoMemoryReplSetOpts>);
    /**
     * Change "this._state" to "newState" and emit "newState"
     * @param newState The new State to set & emit
     */
    protected stateChange(newState: MongoMemoryReplSetStates, ...args: any[]): void;
    /**
     * Create an instance of "MongoMemoryReplSet" and call start
     * @param opts Options for the ReplSet
     */
    static create(opts?: Partial<MongoMemoryReplSetOpts>): Promise<MongoMemoryReplSet>;
    /**
     * Get Current state of this class
     */
    get state(): MongoMemoryReplSetStates;
    /**
     * Get & Set "instanceOpts"
     * @throws if "state" is not "stopped"
     */
    get instanceOpts(): MongoMemoryInstanceOptsBase[];
    set instanceOpts(val: MongoMemoryInstanceOptsBase[]);
    /**
     * Get & Set "binaryOpts"
     * @throws if "state" is not "stopped"
     */
    get binaryOpts(): MongoBinaryOpts;
    set binaryOpts(val: MongoBinaryOpts);
    /**
     * Get & Set "replSetOpts"
     * (Applies defaults)
     * @throws if "state" is not "stopped"
     */
    get replSetOpts(): ReplSetOpts;
    set replSetOpts(val: ReplSetOpts);
    /**
     * Helper function to determine if "auth" should be enabled
     * This function expectes to be run after the auth object has been transformed to a object
     * @returns "true" when "auth" should be enabled
     */
    protected enableAuth(): boolean;
    /**
     * Returns instance options suitable for a MongoMemoryServer.
     * @param baseOpts Options to merge with
     * @param keyfileLocation The Keyfile location if "auth" is used
     */
    protected getInstanceOpts(baseOpts?: MongoMemoryInstanceOptsBase, keyfileLocation?: string): MongoMemoryInstanceOpts;
    /**
     * Returns an mongodb URI that is setup with all replSet servers
     * @param otherDb add an database into the uri (in mongodb its the auth database, in mongoose its the default database for models)
     * @param otherIp change the ip in the generated uri, default will otherwise always be "127.0.0.1"
     * @throws if state is not "running"
     * @throws if an server doesnt have "instanceInfo.port" defined
     * @returns an valid mongo URI, by the definition of https://docs.mongodb.com/manual/reference/connection-string/
     */
    getUri(otherDb?: string, otherIp?: string): string;
    /**
     * Start underlying `mongod` instances.
     * @throws if state is already "running"
     */
    start(): Promise<void>;
    /**
     * Initialize & start all servers in the replSet
     */
    protected initAllServers(): Promise<void>;
    /**
     * Ensure "_keyfiletmp" is defined
     * @returns the ensured "_keyfiletmp" value
     */
    protected ensureKeyFile(): Promise<string>;
    /**
     * Stop the underlying `mongod` instance(s).
     * @param cleanupOptions Set how to run ".cleanup", by default only `{ doCleanup: true }` is used
     */
    stop(cleanupOptions?: Cleanup): Promise<boolean>;
    /**
     * Remove the defined dbPath's
     * @param options Set how to run a cleanup, by default `{ doCleanup: true }` is used
     * @throws If "state" is not "stopped"
     * @throws If "instanceInfo" is not defined
     * @throws If an fs error occured
     */
    cleanup(options?: Cleanup): Promise<void>;
    /**
     * Wait until all instances are running
     * @throws if state is "stopped" (cannot wait on something that dosnt start)
     */
    waitUntilRunning(): Promise<void>;
    /**
     * Connects to the first server from the list of servers and issues the `replSetInitiate`
     * command passing in a new replica set configuration object.
     * @throws if state is not "init"
     * @throws if "servers.length" is not 1 or above
     * @throws if package "mongodb" is not installed
     */
    protected _initReplSet(): Promise<void>;
    /**
     * Create the one Instance (without starting them)
     * @param instanceOpts Instance Options to use for this instance
     */
    protected _initServer(instanceOpts: MongoMemoryInstanceOpts): MongoMemoryServer;
    /**
     * Wait until the replSet has elected a Primary
     * @param timeout Timeout to not run infinitly, default: 30s
     * @param where Extra Parameter for logging to know where this function was called
     * @throws if timeout is reached
     */
    protected _waitForPrimary(timeout?: number, where?: string): Promise<void>;
    [Symbol.asyncDispose](): Promise<void>;
}
export default MongoMemoryReplSet;
//# sourceMappingURL=MongoMemoryReplSet.d.ts.map