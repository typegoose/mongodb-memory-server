import { ChildProcess } from 'child_process';
import { default as spawnChild } from 'cross-spawn';
import path from 'path';
import MongoBinary from './MongoBinary';
import { MongoBinaryOpts } from './MongoBinary';
import { DebugPropT, StorageEngineT, SpawnOptions } from '../types';

export interface MongodOps {
  // instance options
  instance: {
    port?: number;
    ip?: string; // for binding to all IP addresses set it to `::,0.0.0.0`, by default '127.0.0.1'
    storageEngine?: StorageEngineT;
    dbPath?: string;
    debug?: DebugPropT;
    replSet?: string;
    args?: string[];
    auth?: boolean;
  };

  // mongo binary options
  binary?: MongoBinaryOpts;

  // child process spawn options
  spawn?: SpawnOptions;
  debug?: DebugPropT;
}

export default class MongoInstance {
  static childProcessList: ChildProcess[] = [];
  opts: MongodOps;
  debug: Function;

  childProcess: ChildProcess | null;
  killerProcess: ChildProcess | null;
  waitForPrimaryResolveFns: Function[];
  isInstancePrimary: boolean = false;
  isInstanceReady: boolean = false;
  instanceReady: () => void = () => {};
  instanceFailed: (err: any) => void = () => {};

  constructor(opts: MongodOps) {
    this.opts = opts;
    this.childProcess = null;
    this.killerProcess = null;
    this.waitForPrimaryResolveFns = [];

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

    // add instance's port to debug output
    const debugFn = this.debug;
    const port = this.opts.instance && this.opts.instance.port;
    this.debug = (msg: string): void => {
      debugFn(`Mongo[${port}]: ${msg}`);
    };
  }

  static run(opts: MongodOps): Promise<MongoInstance> {
    const instance = new this(opts);
    return instance.run();
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

  async run(): Promise<MongoInstance> {
    const launch = new Promise((resolve, reject) => {
      this.instanceReady = () => {
        this.isInstanceReady = true;
        this.debug('MongodbInstance: is ready!');
        resolve({ ...this.childProcess });
      };
      this.instanceFailed = (err: any) => {
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

  async kill(): Promise<MongoInstance> {
    this.debug('Called MongoInstance.kill():');
    if (this.childProcess && !this.childProcess.killed) {
      await new Promise((resolve) => {
        if (this.childProcess) {
          this.childProcess.once(`exit`, () => {
            this.debug(' - childProcess: got exit signal. Ok!');
            resolve();
          });
          this.childProcess.kill();
          this.debug(' - childProcess: send kill cmd...');
        }
      });
    } else {
      this.debug(' - childProcess: nothing to kill, skipping.');
    }
    if (this.killerProcess && !this.killerProcess.killed) {
      await new Promise((resolve) => {
        if (this.killerProcess) {
          this.killerProcess.once(`exit`, () => {
            this.debug(' - killerProcess: got exit signal. Ok!');
            resolve();
          });
          this.killerProcess.kill();
          this.debug(' - killerProcess: send kill cmd...');
        }
      });
    } else {
      this.debug(' - killerProcess: nothing to kill, skipping.');
    }
    return this;
  }

  getPid(): number | undefined {
    return this.childProcess ? this.childProcess.pid : undefined;
  }

  async waitPrimaryReady(): Promise<boolean> {
    if (this.isInstancePrimary) {
      return true;
    }
    return new Promise((resolve) => {
      this.waitForPrimaryResolveFns.push(resolve);
    });
  }

  _launchMongod(mongoBin: string): ChildProcess {
    const spawnOpts = this.opts.spawn || {};
    if (!spawnOpts.stdio) spawnOpts.stdio = 'pipe';
    const childProcess = spawnChild(mongoBin, this.prepareCommandArgs(), spawnOpts);
    if (childProcess.stderr) {
      childProcess.stderr.on('data', this.stderrHandler.bind(this));
    }
    if (childProcess.stdout) {
      childProcess.stdout.on('data', this.stdoutHandler.bind(this));
    }
    childProcess.on('close', this.closeHandler.bind(this));
    childProcess.on('error', this.errorHandler.bind(this));

    return childProcess;
  }

  _launchKiller(parentPid: number, childPid: number): ChildProcess {
    this.debug(`Called MongoInstance._launchKiller(parent: ${parentPid}, child: ${childPid}):`);
    // spawn process which kills itself and mongo process if current process is dead
    const killer = spawnChild(
      process.argv[0],
      [
        path.resolve(__dirname, '../../scripts/mongo_killer.js'),
        parentPid.toString(),
        childPid.toString(),
      ],
      { stdio: 'pipe' }
    );

    ['exit', 'message', 'disconnect', 'error'].forEach((e) => {
      killer.on(e, (...args) => {
        this.debug(`[MongoKiller]: ${e} - ${JSON.stringify(args)}`);
      });
    });

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
    } else if (/CURL_OPENSSL_3.*not found/i.test(log)) {
      this.instanceFailed(
        'libcurl3 is not available on your system. Mongod requires it and cannot be started without it. You should manually install libcurl3 or try to use older Mongodb version eg. 3.6.12'
      );
    } else if (/shutting down with code/i.test(log)) {
      // if mongod started succesfully then no error on shutdown!
      if (!this.isInstanceReady) {
        this.instanceFailed('Mongod shutting down');
      }
    } else if (/\*\*\*aborting after/i.test(log)) {
      this.instanceFailed('Mongod internal error');
    } else if (/transition to primary complete; database writes are now permitted/.test(log)) {
      this.isInstancePrimary = true;
      this.waitForPrimaryResolveFns.forEach((resolveFn) => {
        this.debug('Calling waitForPrimary resolve function');
        resolveFn(true);
      });
    }
  }
}
