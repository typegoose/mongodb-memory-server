export interface DownloadProgress {
  current: number;
  length: number;
  totalMb: number;
  lastPrintedAt: number;
}

export type StorageEngine = 'devnull' | 'ephemeralForTest' | 'mmapv1' | 'wiredTiger';

export interface MongoMemoryInstancePropBase {
  args?: string[];
  port?: number | null;
  dbPath?: string;
  storageEngine?: StorageEngine;
}

export interface MongoMemoryInstanceProp extends MongoMemoryInstancePropBase {
  auth?: boolean;
  dbName?: string;
  ip?: string; // for binding to all IP addresses set it to `::,0.0.0.0`, by default '127.0.0.1'
  replSet?: string;
  storageEngine?: StorageEngine;
}
