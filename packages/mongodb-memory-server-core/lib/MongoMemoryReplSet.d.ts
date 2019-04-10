/// <reference types="node" />
import { EventEmitter } from 'events';
import { Admin } from 'mongodb';
import MongoMemoryServer from './MongoMemoryServer';
import { MongoBinaryOpts } from './util/MongoBinary';
import { DebugFn, MongoMemoryInstancePropT, MongoMemoryInstancePropBaseT, SpawnOptions, StorageEngineT } from './types';
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
    configSettings?: MongoMemoryReplSetConfigSettingsT;
}
export interface MongoMemoryReplSetConfigSettingsT {
    chainingAllowed?: boolean;
    heartbeatTimeoutSecs?: number;
    heartbeatIntervalMillis?: number;
    electionTimeoutMillis?: number;
    catchUpTimeoutMillis?: number;
}
export interface MongoMemoryReplSetOptsT {
    instanceOpts: MongoMemoryInstancePropBaseT[];
    binary: MongoBinaryOpts;
    replSet: ReplSetOpts;
    autoStart?: boolean;
    debug?: boolean;
}
export default class MongoMemoryReplSet extends EventEmitter {
    servers: MongoMemoryServer[];
    opts: MongoMemoryReplSetOptsT;
    debug: DebugFn;
    _state: 'init' | 'running' | 'stopped';
    admin?: Admin;
    constructor(opts?: Partial<MongoMemoryReplSetOptsT>);
    getConnectionString(otherDb?: string | boolean): Promise<string>;
    /**
     * Returns database name.
     */
    getDbName(): Promise<string>;
    /**
     * Returns instance options suitable for a MongoMemoryServer.
     * @param {MongoMemoryInstancePropBaseT} baseOpts
     */
    getInstanceOpts(baseOpts?: MongoMemoryInstancePropBaseT): MongoMemoryInstancePropT;
    /**
     * Returns a mongodb: URI to connect to a given database.
     */
    getUri(otherDb?: string | boolean): Promise<string>;
    /**
     * Start underlying `mongod` instances.
     */
    start(): Promise<void>;
    /**
     * Stop the underlying `mongod` instance(s).
     */
    stop(): Promise<boolean>;
    waitUntilRunning(): Promise<void>;
    /**
     * Connects to the first server from the list of servers and issues the `replSetInitiate`
     * command passing in a new replica set configuration object.
     */
    _initReplSet(): Promise<void>;
    _startServer(instanceOpts: MongoMemoryInstancePropT): MongoMemoryServer;
    _waitForPrimary(): Promise<boolean>;
}
//# sourceMappingURL=MongoMemoryReplSet.d.ts.map