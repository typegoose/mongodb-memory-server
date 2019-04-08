export declare type DebugFn = (...args: any[]) => any;
export declare type DebugPropT = boolean | DebugFn;
export interface DownloadProgressT {
    current: number;
    length: number;
    totalMb: number;
    lastPrintedAt: number;
}
export declare type CallbackFn = (...args: any[]) => any;
export { SpawnOptions } from 'child_process';
export declare type StorageEngineT = 'devnull' | 'ephemeralForTest' | 'mmapv1' | 'wiredTiger';
export interface MongoMemoryInstancePropBaseT {
    args?: string[];
    port?: number | null;
    dbPath?: string;
    storageEngine?: StorageEngineT;
}
export interface MongoMemoryInstancePropT extends MongoMemoryInstancePropBaseT {
    auth?: boolean;
    dbName?: string;
    debug?: DebugPropT;
    ip?: string;
    replSet?: string;
    storageEngine?: StorageEngineT;
}
export interface ReplStatusMemberT {
    _id: number;
    name: string;
    health: number;
    state: number;
    stateStr: string;
    uptime: number;
}
export interface ReplStatusResultT {
    set: string;
    members: ReplStatusMemberT[];
}
//# sourceMappingURL=types.d.ts.map