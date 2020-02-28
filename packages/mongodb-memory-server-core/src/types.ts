export type DebugFn = (...args: any[]) => any;
export type DebugPropT = boolean;

export interface DownloadProgressT {
  current: number;
  length: number;
  totalMb: number;
  lastPrintedAt: number;
}

export type CallbackFn = (...args: any[]) => any;

export { SpawnOptions } from 'child_process';

export type StorageEngineT = 'devnull' | 'ephemeralForTest' | 'mmapv1' | 'wiredTiger';

export interface MongoMemoryInstancePropBaseT {
  args?: string[];
  port?: number | null;
  dbPath?: string;
  storageEngine?: StorageEngineT;
}

export interface MongoMemoryInstancePropT extends MongoMemoryInstancePropBaseT {
  auth?: boolean;
  dbName?: string;
  ip?: string; // for binding to all IP addresses set it to `::,0.0.0.0`, by default '127.0.0.1'
  replSet?: string;
  storageEngine?: StorageEngineT;
}

export interface ReplStatusReplT {
  ismaster: boolean;
}

export interface ReplStatusResultT {
  repl: ReplStatusReplT;
}

export type ErrorVoidCallback = (err: any) => void;
export type EmptyVoidCallback = () => void;
