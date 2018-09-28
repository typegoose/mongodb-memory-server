// @flow
export type DebugFn = (...args: any[]) => any;
export type DebugPropT = boolean | DebugFn;

export type DownloadProgressT = {
  current: number,
  length: number,
  totalMb: number,
  lastPrintedAt: number,
};

export type CallbackFn = (...args: any[]) => any;

/**
 * Adapted from the TypeScript definition for node since flow doens't seem to know about these types.
 */
export interface SpawnOptions {
  cwd?: string;
  env?: {};
  argv0?: string;
  stdio?: string | any[];
  detached?: boolean;
  uid?: number;
  gid?: number;
  shell?: boolean | string;
  windowsVerbatimArguments?: boolean;
  windowsHide?: boolean;
}

export type StorageEngineT = 'devnull' | 'ephemeralForTest' | 'mmapv1' | 'wiredTiger';
