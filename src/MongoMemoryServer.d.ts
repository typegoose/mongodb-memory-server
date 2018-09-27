/// <reference types='node' />

import { ChildProcess } from 'child_process';
import MongoInstance from './util/MongoInstance';

export interface MongoMemoryServerOptsT {
  instance: {
    port?: number;
    dbPath?: string;
    dbName?: string;
    storageEngine?: string;
    debug?: boolean | ((...args: any[]) => any);
  };
  binary: {
    version?: string;
    downloadDir?: string;
    platform?: string;
    arch?: string;
    debug?: boolean | ((...args: any[]) => any);
  };
  debug?: boolean;
  spawn: any;
  autoStart?: boolean;
}

export interface MongoInstanceDataT {
  port: number;
  dbPath: string;
  dbName: string;
  uri: string;
  storageEngine: string;
  instance: MongoInstance;
  childProcess: ChildProcess;
  tmpDir?: {
    name: string;
    removeCallback: ((...args: any[]) => any);
  };
}

export default class MongoMemoryServer {
  isRunning: boolean;
  runningInstance: Promise<MongoInstanceDataT> | undefined;
  opts: MongoMemoryServerOptsT;
  debug: ((...args: any[]) => any);

  constructor(opts?: Partial<MongoMemoryServerOptsT>);

  start(): Promise<boolean>;
  stop(): Promise<boolean>;
  getInstanceData(): Promise<MongoInstanceDataT>;
  getUri(otherDbName?: string | boolean): Promise<string>;
  getConnectionString(otherDbName?: string | boolean): Promise<string>;
  getPort(): Promise<number>;
  getDbPath(): Promise<string>;
  getDbName(): Promise<string>;

  protected _startUpInstance(): Promise<MongoInstanceDataT>;
}
