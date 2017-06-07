/* @flow */
/* eslint-disable class-methods-use-this */

import { ChildProcess, spawn as spawnChild } from 'child_process';
import path from 'path';
import MongoBinary from './MongoBinary';

import type { MongoBinaryOpts } from './MongoBinary';

export type MongodOps = {
  // instance options
  instance: {
    port: number,
    storageEngine?: string,
    dbPath: string,
    debug?: boolean,
  },

  // mongo binary options
  binary?: MongoBinaryOpts,

  // child process spawn options
  spawn?: {
    cwd?: string,
    env?: Object,
    argv0?: string,
    stdio?: string | Array<any>,
    detached?: boolean,
    uid?: number,
    gid?: number,
    shell?: boolean | string,
  },

  debug?: boolean,
};

export default class MongodbInstance {
  static childProcessList: ChildProcess[] = [];
  opts: MongodOps;
  debug: Function;

  childProcess: ChildProcess;
  killerProcess: ChildProcess;
  instanceReady: Function;
  instanceFailed: Function;

  static run(opts: MongodOps): Promise<ChildProcess> {
    const instance = new this(opts);
    return instance.run();
  }

  constructor(opts: MongodOps) {
    this.opts = opts;

    if (this.opts.debug) {
      if (!this.opts.instance) this.opts.instance = {};
      if (!this.opts.binary) this.opts.binary = {};
      this.opts.instance.debug = this.opts.debug;
      this.opts.binary.debug = this.opts.debug;
    }

    this.debug = this.opts.instance && this.opts.instance.debug ? console.log.bind(null) : () => {};
  }

  prepareCommandArgs(): string[] {
    const { port, storageEngine, dbPath } = this.opts.instance;

    const result = [];
    if (port) result.push('--port', port.toString());
    if (storageEngine) result.push('--storageEngine', storageEngine);
    if (dbPath) result.push('--dbpath', dbPath);
    result.push('--noauth');

    return result;
  }

  async run(): Promise<ChildProcess> {
    const launch = new Promise((resolve, reject) => {
      this.instanceReady = resolve;
      this.instanceFailed = err => {
        if (this.killerProcess) this.killerProcess.kill();
        reject(err);
      };
    });

    const mongoBin = path.resolve(await MongoBinary.getPath(this.opts.binary), 'mongod');
    this.childProcess = this.launchMongod(mongoBin);
    this.killerProcess = this.launchKiller(process.pid, this.childProcess.pid);

    await launch;
    return this.childProcess;
  }

  launchMongod(mongoBin: string): ChildProcess {
    const spawnOpts = this.opts.spawn || {};
    if (!spawnOpts.stdio) spawnOpts.stdio = 'pipe';
    const childProcess = spawnChild(mongoBin, this.prepareCommandArgs(), spawnOpts);
    childProcess.stderr.on('data', this.stderrHandler.bind(this));
    childProcess.stdout.on('data', this.stdoutHandler.bind(this));
    childProcess.on('close', this.closeHandler.bind(this));
    childProcess.on('error', this.errorHandler.bind(this));

    return childProcess;
  }

  launchKiller(parentPid: number, childPid: number): ChildProcess {
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
      this.instanceReady(true);
    } else if (/addr already in use/i.test(log)) {
      this.instanceFailed(`Port ${this.opts.instance.port} already in use`);
    } else if (/mongod instance already running/i.test(log)) {
      this.instanceFailed('Mongod already running');
    } else if (/permission denied/i.test(log)) {
      this.instanceFailed('Mongod permission denied');
    } else if (/Data directory .*? not found/i.test(log)) {
      this.instanceFailed('Data directory not found');
    } else if (/shutting down with code/i.test(log)) {
      this.instanceFailed('Mongod shutting down');
    }
  }
}
