/// <reference types='node' />

// These types are used internally to the module.

export type DebugFn = (...args: any[]) => any;
export type DebugPropT = boolean | DebugFn;

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
  debug?: DebugPropT;
  ip?: string; // for binding to all IP addresses set it to `::,0.0.0.0`, by default '127.0.0.1'
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
