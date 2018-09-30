/// <reference types='node' />
import { SpawnOptions } from 'child_process';
import * as events from 'events';
import {
  DebugFn,
  MongoMemoryInstancePropT,
  MongoMemoryInstancePropBaseT,
  StorageEngineT,
} from './types';
import MongoMemoryServer from './MongoMemoryServer';
import { MongoBinaryOpts } from './util/MongoBinary';

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
}

export interface MongoMemoryReplSetOptsT {
  instanceOpts: MongoMemoryInstancePropBaseT[];
  binary: MongoBinaryOpts;
  replSet: ReplSetOpts;
  autoStart?: boolean;
  debug?: boolean;
}

export default class MongoMemoryReplSet extends events.EventEmitter {
  servers: MongoMemoryServer[];
  opts: MongoMemoryReplSetOptsT;
  debug: DebugFn;
  _state: 'init' | 'running' | 'stopped';
  getConnectionString(otherDb?: string | boolean): Promise<string>;
  getDbName(): Promise<string>;
  getInstanceOpts(baseOpts: MongoMemoryInstancePropBaseT): MongoMemoryInstancePropT;
  getUri(otherDb?: string | boolean): Promise<string>;
  start(): Promise<void>;
  stop(): Promise<boolean>;
  waitUntilRunning(): Promise<void>;
}
