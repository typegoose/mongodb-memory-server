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
