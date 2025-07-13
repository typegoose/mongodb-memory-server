/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { ChildProcess, SpawnOptions } from 'child_process';
import { MongoBinaryOpts } from './MongoBinary';
import { ManagerBase } from './utils';
import { EventEmitter } from 'events';
import { MongoClientOptions } from 'mongodb';
export type StorageEngine = 'ephemeralForTest' | 'wiredTiger';
/**
 * Overwrite replica member-specific configuration
 *
 * @see {@link https://docs.mongodb.com/manual/reference/replica-configuration/#replica-set-configuration-document-example}
 *
 * @example
 * ```ts
 * {
 *   priority: 2,
 *   buildIndexes: false,
 *   votes: 2,
 * }
 * ```
 */
export interface ReplicaMemberConfig {
    /**
     * A boolean that identifies an arbiter.
     * @default false - A value of `true` indicates that the member is an arbiter.
     */
    arbiterOnly?: boolean;
    /**
     * A boolean that indicates whether the mongod builds indexes on this member.
     * You can only set this value when adding a member to a replica set.
     * @default true
     */
    buildIndexes?: boolean;
    /**
     * The replica set hides this instance and does not include the member in the output of `db.hello()` or `hello`.
     * @default true
     */
    hidden?: boolean;
    /**
     * A number that indicates the relative eligibility of a member to become a primary.
     * Specify higher values to make a member more eligible to become primary, and lower values to make the member less eligible.
     * @default 1 for primary/secondary; 0 for arbiters.
     */
    priority?: number;
    /**
     * A tags document contains user-defined tag field and value pairs for the replica set member.
     * @default null
     * @example
     * ```ts
     * { "<tag1>": "<string1>", "<tag2>": "<string2>",... }
     * ```
     */
    tags?: any;
    /**
     * Mongodb 4.x only - The number of seconds "behind" the primary that this replica set member should "lag".
     * For mongodb 5.x, use `secondaryDelaySecs` instead.
     * @see {@link https://docs.mongodb.com/v4.4/tutorial/configure-a-delayed-replica-set-member/}
     * @default 0
     */
    slaveDelay?: number;
    /**
     * Mongodb 5.x only - The number of seconds "behind" the primary that this replica set member should "lag".
     * @default 0
     */
    secondaryDelaySecs?: number;
    /**
     * The number of votes a server will cast in a replica set election.
     * The number of votes each member has is either 1 or 0, and arbiters always have exactly 1 vote.
     * @default 1
     */
    votes?: number;
}
export interface MongoMemoryInstanceOptsBase {
    /**
     * Extra Arguments to add
     */
    args?: string[];
    /**
     * Set which port to use
     * Adds "--port"
     * @default from get-port
     */
    port?: number;
    /**
     * Set which storage path to use
     * Adds "--dbpath"
     * @default TmpDir
     */
    dbPath?: string;
    /**
     * Set which Storage Engine to use
     * Adds "--storageEngine"
     * @default "ephemeralForTest"
     */
    storageEngine?: StorageEngine;
    /**
     * Set the Replica-Member-Config
     * Only has a effect when started with "MongoMemoryReplSet"
     */
    replicaMemberConfig?: ReplicaMemberConfig;
    /**
     * Define a custom timeout for when out of some reason the binary cannot get started correctly
     * Time in MS
     * @default 10000 10 seconds
     */
    launchTimeout?: number;
}
export interface MongoMemoryInstanceOpts extends MongoMemoryInstanceOptsBase {
    /**
     * Set which parameter will be used
     * true -> "--auth"
     * false -> "--noauth"
     * @default false
     */
    auth?: boolean;
    /**
     * Currently unused option
     * @default undefined
     */
    dbName?: string;
    /**
     * for binding to all IP addresses set it to `::,0.0.0.0`, by default '127.0.0.1'
     * Adds "--bind_ip"
     * @default undefined
     */
    ip?: string;
    /**
     * Set that this instance is part of a replset
     * Adds "--replSet"
     * @default undefined
     */
    replSet?: string;
    /**
     * Location for the "--keyfile" argument
     * Only has an effect when "auth" is enabled and is a replset
     * Adds "--keyfile"
     * @default undefined
     */
    keyfileLocation?: string;
}
export declare enum MongoInstanceEvents {
    instanceReplState = "instanceReplState",
    instancePrimary = "instancePrimary",
    instanceReady = "instanceReady",
    instanceSTDOUT = "instanceSTDOUT",
    instanceSTDERR = "instanceSTDERR",
    instanceClosed = "instanceClosed",
    /** Only Raw Error (emitted by mongodProcess) */
    instanceRawError = "instanceRawError",
    /** Raw Errors and Custom Errors */
    instanceError = "instanceError",
    killerLaunched = "killerLaunched",
    instanceLaunched = "instanceLaunched",
    instanceStarted = "instanceStarted"
}
export interface MongodOpts {
    /** instance options */
    instance: MongoMemoryInstanceOpts;
    /** mongo binary options */
    binary: MongoBinaryOpts;
    /** child process spawn options */
    spawn: SpawnOptions;
}
export interface MongoInstance extends EventEmitter {
    emit(event: MongoInstanceEvents, ...args: any[]): boolean;
    on(event: MongoInstanceEvents, listener: (...args: any[]) => void): this;
    once(event: MongoInstanceEvents, listener: (...args: any[]) => void): this;
}
/**
 * MongoDB Instance Handler Class
 * This Class starts & stops the "mongod" process directly and handles stdout, sterr and close events
 */
export declare class MongoInstance extends EventEmitter implements ManagerBase {
    instanceOpts: MongoMemoryInstanceOpts;
    readonly binaryOpts: Readonly<MongoBinaryOpts>;
    readonly spawnOpts: Readonly<SpawnOptions>;
    /**
     * Extra options to append to "mongoclient.connect"
     * Mainly used for authentication
     */
    extraConnectionOptions?: MongoClientOptions;
    /**
     * The "mongod" Process reference
     */
    mongodProcess?: ChildProcess;
    /**
     * The "mongo_killer" Process reference
     */
    killerProcess?: ChildProcess;
    /**
     * This boolean is "true" if the instance is elected to be PRIMARY
     */
    isInstancePrimary: boolean;
    /**
     * This boolean is "true" if the instance is successfully started
     */
    isInstanceReady: boolean;
    /**
     * This boolean is "true" if the instance is part of an replset
     */
    isReplSet: boolean;
    /**
     * Extra promise to avoid multiple calls of `.stop` at the same time
     *
     * @see https://github.com/typegoose/mongodb-memory-server/issues/802
     */
    stopPromise?: Promise<boolean>;
    constructor(opts: Partial<MongodOpts>);
    /**
     * Debug-log with template applied
     * @param msg The Message to log
     */
    protected debug(msg: string, ...extra: unknown[]): void;
    /**
     * Create an new instance an call method "start"
     * @param opts Options passed to the new instance
     */
    static create(opts: Partial<MongodOpts>): Promise<MongoInstance>;
    /**
     * Create an array of arguments for the mongod instance
     */
    prepareCommandArgs(): string[];
    /**
     * Create the mongod process
     * @fires MongoInstance#instanceStarted
     */
    start(): Promise<void>;
    /**
     * Shutdown all related processes (Mongod Instance & Killer Process)
     */
    stop(): Promise<boolean>;
    /**
     * Actually launch mongod
     * @param mongoBin The binary to run
     * @fires MongoInstance#instanceLaunched
     */
    _launchMongod(mongoBin: string): ChildProcess;
    /**
     * Spawn an seperate process to kill the parent and the mongod instance to ensure "mongod" gets stopped in any case
     * @param parentPid Parent nodejs process
     * @param childPid Mongod process to kill
     * @fires MongoInstance#killerLaunched
     */
    _launchKiller(parentPid: number, childPid: number): ChildProcess;
    /**
     * Event "error" handler
     * @param err The Error to handle
     * @fires MongoInstance#instanceRawError
     * @fires MongoInstance#instanceError
     */
    errorHandler(err: string): void;
    /**
     * Write the CLOSE event to the debug function
     * @param code The Exit code to handle
     * @param signal The Signal to handle
     * @fires MongoInstance#instanceClosed
     */
    closeHandler(code: number | null, signal: string | null): void;
    /**
     * Write STDERR to debug function
     * @param message The STDERR line to write
     * @fires MongoInstance#instanceSTDERR
     */
    stderrHandler(message: string | Buffer): void;
    /**
     * Write STDOUT to debug function and process some special messages
     * @param message The STDOUT line to write/parse
     * @fires MongoInstance#instanceSTDOUT
     * @fires MongoInstance#instanceReady
     * @fires MongoInstance#instanceError
     * @fires MongoInstance#instancePrimary
     * @fires MongoInstance#instanceReplState
     */
    stdoutHandler(message: string | Buffer): void;
    /**
     * Run Checks on the line if the lines contain any thrown errors
     * @param line The Line to check
     */
    protected checkErrorInLine(line: string): void;
    [Symbol.asyncDispose](): Promise<void>;
}
export default MongoInstance;
//# sourceMappingURL=MongoInstance.d.ts.map