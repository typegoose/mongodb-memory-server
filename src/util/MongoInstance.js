/* @flow */
/* eslint-disable class-methods-use-this */

import { ChildProcess, spawn as spawnChild } from 'child_process';
import path from 'path';
import MongoBinary from './MongoBinary';
import type { MongoBinaryOpts } from './MongoBinary';
import type { DebugPropT, StorageEngineT, SpawnOptions } from '../types';

export type MongodOps = {
  // instance options
  instance: {
    port: number,
    ip?: string, // for binding to all IP addresses set it to `::,0.0.0.0`, by default '127.0.0.1'
    storageEngine?: StorageEngineT,
    dbPath: string,
    debug?: DebugPropT,
    replSet?: string,
    args?: string[],
    auth?: boolean,
  },

  // mongo binary options
  binary?: MongoBinaryOpts,

  // child process spawn options
  spawn?: SpawnOptions,
  debug?: DebugPropT,
};

export default class MongodbInstance {
  static childProcessList: ChildProcess[] = [];
  opts: MongodOps;
  debug: Function;

  childProcess: ChildProcess;
  killerProcess: ChildProcess;
  instanceReady: Function;
  instanceFailed: Function;
  isInstanceReady: boolean;

  static run(opts: MongodOps): Promise<MongodbInstance> {
    const instance = new this(opts);
    return instance.run();
  }

  constructor(opts: MongodOps) {
    this.opts = opts;
    this.isInstanceReady = false;

    if (this.opts.debug) {
      if (!this.opts.instance) this.opts.instance = {};
      if (!this.opts.binary) this.opts.binary = {};
      this.opts.instance.debug = this.opts.debug;
      this.opts.binary.debug = this.opts.debug;
    }

    if (this.opts.instance && this.opts.instance.debug) {
      if (
        typeof this.opts.instance.debug === 'function' &&
        this.opts.instance.debug.apply &&
        this.opts.instance.debug.call
      ) {
        this.debug = this.opts.instance.debug;
      } else {
        this.debug = console.log.bind(null);
      }
    } else {
      this.debug = () => {};
    }
  }

  prepareCommandArgs(): string[] {
    const { ip, port, storageEngine, dbPath, replSet, auth, args } = this.opts.instance;

    const result = [];
    result.push('--bind_ip', ip || '127.0.0.1');
    if (port) result.push('--port', port.toString());
    if (storageEngine) result.push('--storageEngine', storageEngine);
    if (dbPath) result.push('--dbpath', dbPath);
    if (!auth) result.push('--noauth');
    else if (auth) result.push('--auth');
    if (replSet) result.push('--replSet', replSet);

    return result.concat(args || []);
  }

  async run(): Promise<MongodbInstance> {
    const launch = new Promise((resolve, reject) => {
      this.instanceReady = () => {
        this.isInstanceReady = true;
        this.debug('MongodbInstance: is ready!');
        resolve(this.childProcess);
      };
      this.instanceFailed = err => {
        this.debug(`MongodbInstance: is failed: ${err.toString()}`);
        if (this.killerProcess) this.killerProcess.kill();
        reject(err);
      };
    });

    const mongoBin = await MongoBinary.getPath(this.opts.binary);
    this.childProcess = this._launchMongod(mongoBin);
    this.killerProcess = this._launchKiller(process.pid, this.childProcess.pid);

    await launch;
    return this;
  }

  async kill(): Promise<MongodbInstance> {
    if (this.childProcess && !(this.childProcess: any).killed) {
      await new Promise(resolve => {
        this.childProcess.once(`exit`, resolve);
        this.childProcess.kill();
      });
    }
    if (this.killerProcess && !(this.killerProcess: any).killed) {
      await new Promise(resolve => {
        this.killerProcess.once(`exit`, resolve);
        this.killerProcess.kill();
      });
    }
    return this;
  }

  getPid(): ?number {
    return this.childProcess ? this.childProcess.pid : undefined;
  }

  _launchMongod(mongoBin: string): ChildProcess {
    const spawnOpts = this.opts.spawn || {};
    if (!spawnOpts.stdio) spawnOpts.stdio = 'pipe';
    const childProcess = spawnChild(mongoBin, this.prepareCommandArgs(), spawnOpts);
    childProcess.stderr.on('data', this.stderrHandler.bind(this));
    childProcess.stdout.on('data', this.stdoutHandler.bind(this));
    childProcess.on('close', this.closeHandler.bind(this));
    childProcess.on('error', this.errorHandler.bind(this));

    return childProcess;
  }

  _launchKiller(parentPid: number, childPid: number): ChildProcess {
    // spawn process which kills itself and mongo process if current process is dead
    const killer = spawnChild(
      process.argv[0],
      [path.resolve(__dirname, 'mongo_killer.js'), parentPid.toString(), childPid.toString()],
      { stdio: 'pipe' }
    );

    return killer;
  }

  errorHandler(err: string): void {
    this.instanceFailed(err);
  }

  closeHandler(code: number): void {
    this.debug(`CLOSE: ${code}`);
  }

  stderrHandler(message: string | Buffer): void {
    this.debug(`STDERR: ${message.toString()}`);
  }

  stdoutHandler(message: string | Buffer): void {
    this.debug(`${message.toString()}`);

    const log: string = message.toString();
    if (/waiting for connections on port/i.test(log)) {
      this.instanceReady();
    } else if (/addr already in use/i.test(log)) {
      this.instanceFailed(`Port ${this.opts.instance.port} already in use`);
    } else if (/mongod instance already running/i.test(log)) {
      this.instanceFailed('Mongod already running');
    } else if (/permission denied/i.test(log)) {
      this.instanceFailed('Mongod permission denied');
    } else if (/Data directory .*? not found/i.test(log)) {
      this.instanceFailed('Data directory not found');
    } else if (/shutting down with code/i.test(log)) {
      // if mongod started succesfully then no error on shutdown!
      if (!this.isInstanceReady) {
        this.instanceFailed('Mongod shutting down');
      }
    } else if (/\*\*\*aborting after/i.test(log)) {
      this.instanceFailed('Mongod internal error');
    }
  }
}
