/// <reference types='node' />

import { ChildProcess, SpawnOptions } from 'child_process';
import MongoInstance from './util/MongoInstance';
import { MongoBinaryOpts } from './util/MongoBinary';
import { CallbackFn, DebugFn, MongoMemoryInstancePropT, StorageEngineT } from './types';

export interface MongoMemoryServerOptsT {
  instance: MongoMemoryInstancePropT;
  binary: MongoBinaryOpts;
  debug?: boolean;
  spawn: SpawnOptions;
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
  runningInstance: Promise<MongoInstanceDataT> | undefined;
  opts: MongoMemoryServerOptsT;
  debug: DebugFn;

  constructor(opts?: Partial<MongoMemoryServerOptsT>);

  start(): Promise<boolean>;
  stop(): Promise<boolean>;
  getInstanceData(): Promise<MongoInstanceDataT>;
  getUri(otherDbName?: string | boolean): Promise<string>;
  getConnectionString(otherDbName?: string | boolean): Promise<string>;
  getPort(): Promise<number>;
  getDbPath(): Promise<string>;
  getDbName(): Promise<string>;
}
