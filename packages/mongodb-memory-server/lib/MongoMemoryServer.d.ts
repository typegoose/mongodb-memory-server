/// <reference types="node" />
import { ChildProcess } from 'child_process';
import MongoInstance from './util/MongoInstance';
import { MongoBinaryOpts } from './util/MongoBinary';
import { CallbackFn, DebugFn, MongoMemoryInstancePropT, StorageEngineT, SpawnOptions } from './types';
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
    runningInstance: Promise<MongoInstanceDataT> | null;
    instanceInfoSync: MongoInstanceDataT | null;
    opts: MongoMemoryServerOptsT;
    debug: DebugFn;
    constructor(opts?: MongoMemoryServerOptsT);
    start(): Promise<boolean>;
    _startUpInstance(): Promise<MongoInstanceDataT>;
    stop(): Promise<boolean>;
    getInstanceInfo(): MongoInstanceDataT | false;
    getInstanceData(): Promise<MongoInstanceDataT>;
    ensureInstance(): Promise<MongoInstanceDataT>;
    getUri(otherDbName?: string | boolean): Promise<string>;
    getConnectionString(otherDbName?: string | boolean): Promise<string>;
    getPort(): Promise<number>;
    getDbPath(): Promise<string>;
    getDbName(): Promise<string>;
}
//# sourceMappingURL=MongoMemoryServer.d.ts.map