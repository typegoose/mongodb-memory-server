import { ChildProcess } from 'child_process';
import { default as spawnChild } from 'cross-spawn';
import path from 'path';
import MongoBinary from './MongoBinary';
import { MongoBinaryOpts } from './MongoBinary';
import { StorageEngineT, SpawnOptions, ErrorVoidCallback, EmptyVoidCallback } from '../types';
import debug from 'debug';
import { isNullOrUndefined } from './db_util';
import { lt } from 'semver';

if (lt(process.version, '10.15.0')) {
  console.warn('Using NodeJS below 10.15.0');
}

const log = debug('MongoMS:MongoInstance');

export interface MongoInstanceOpts {
  port?: number;
  ip?: string; // for binding to all IP addresses set it to `::,0.0.0.0`, by default '127.0.0.1'
  storageEngine?: StorageEngineT;
  dbPath?: string;
  replSet?: string;
  args?: string[];
  auth?: boolean;
}

export interface MongodOpts {
  // instance options
  instance: MongoInstanceOpts;

  // mongo binary options
  binary: MongoBinaryOpts;

  // child process spawn options
  spawn: SpawnOptions;
}

/**
 * MongoDB Instance Handler Class
 */
export default class MongoInstance {
  opts: MongodOpts;

  childProcess: ChildProcess | null = null;
  killerProcess: ChildProcess | null = null;
  waitForPrimaryResolveFns: ((value: boolean) => void)[] = [];
  isInstancePrimary: boolean = false;
  isInstanceReady: boolean = false;
  instanceReady: EmptyVoidCallback = () => {};
  instanceFailed: ErrorVoidCallback = () => {};

  constructor(opts: Partial<MongodOpts>) {
    this.opts = Object.assign({ binary: {}, instance: {}, spawn: {} } as MongodOpts, opts);
  }

  /**
   * Debug-log with template applied
   * @param msg The Message to log
   */
  private debug(msg: string): void {
    if (debug.enabled('MongoMS:MongoInstance')) {
      const port = this.opts?.instance?.port ?? 'unkown';
      log(`Mongo[${port}]: ${msg}`);
    }
  }

  /**
   * Create an new instance an call method "run"
   * @param opts Options passed to the new instance
   */
  static async run(opts: Partial<MongodOpts>): Promise<MongoInstance> {
    const instance = new this(opts);
    return instance.run();
  }

  /**
   * Create an array of arguments for the mongod instance
   */
  prepareCommandArgs(): string[] {
    const { ip, port, storageEngine, dbPath, replSet, auth, args } = this.opts.instance;

    const result: string[] = [];
    result.push('--bind_ip', ip || '127.0.0.1'); // default on all falsy values
    if (port) {
      result.push('--port', port.toString());
    }
    if (storageEngine) {
      result.push('--storageEngine', storageEngine);
    }
    if (dbPath) {
      result.push('--dbpath', dbPath);
    }
    if (!auth) {
      result.push('--noauth');
    } else if (auth) {
      result.push('--auth');
    }
    if (replSet) {
      result.push('--replSet', replSet);
    }

    return result.concat(args ?? []);
  }

  /**
   * Create the mongod process
   */
  async run(): Promise<this> {
    const launch: Promise<void> = new Promise((resolve, reject) => {
      this.instanceReady = () => {
        this.isInstanceReady = true;
        this.debug('MongodbInstance: Instance is ready!');
        resolve();
      };
      this.instanceFailed = (err: any) => {
        this.debug(`MongodbInstance: Instance has failed: ${err.toString()}`);
        if (this.killerProcess) {
          this.killerProcess.kill();
        }
        reject(err);
      };
    });

    const mongoBin = await MongoBinary.getPath(this.opts.binary);
    this.childProcess = this._launchMongod(mongoBin);
    this.killerProcess = this._launchKiller(process.pid, this.childProcess.pid);

    await launch;
    return this;
  }

  /**
   * Shutdown all related processes (Mongod Instance & Killer Process)
   */
  async kill(): Promise<MongoInstance> {
    this.debug('Called MongoInstance.kill():');

    /**
     * Function to De-Duplicate Code
     * @param process The Process to kill
     * @param name the name used in the logs
     */
    async function kill_internal(this: MongoInstance, process: ChildProcess, name: string) {
      const timeoutTime = 1000 * 10;
      await new Promise((resolve, reject) => {
        let timeout = setTimeout(() => {
          this.debug('kill_internal timeout triggered, trying SIGKILL');
          if (!debug.enabled('MongoMS:MongoInstance')) {
            console.warn(
              'An Process didnt exit with signal "SIGINT" within 10 seconds, using "SIGKILL"!\n' +
                'Enable debug logs for more information'
            );
          }
          process.kill('SIGKILL');
          timeout = setTimeout(() => {
            this.debug('kill_internal timeout triggered again, rejecting');
            reject(new Error('Process didnt exit, enable debug for more information.'));
          }, timeoutTime);
        }, timeoutTime);
        process.once(`exit`, (code, signal) => {
          this.debug(`- ${name}: got exit signal, Code: ${code}, Signal: ${signal}`);
          clearTimeout(timeout);
          resolve();
        });
        this.debug(`- ${name}: send "SIGINT"`);
        process.kill('SIGINT');
      });
    }

    if (!isNullOrUndefined(this.childProcess)) {
      await kill_internal.call(this, this.childProcess, 'childProcess');
    } else {
      this.debug('- childProcess: nothing to shutdown, skipping.');
    }
    if (!isNullOrUndefined(this.killerProcess)) {
      await kill_internal.call(this, this.killerProcess, 'killerProcess');
    } else {
      this.debug('- killerProcess: nothing to shutdown, skipping.');
    }

    this.debug('Instance Finished Shutdown');

    return this;
  }

  /**
   * Get the PID of the mongod instance
   */
  getPid(): number | undefined {
    return this.childProcess?.pid;
  }

  /**
   * Wait until the Primary mongod is running
   */
  async waitPrimaryReady(): Promise<boolean> {
    if (this.isInstancePrimary) {
      return true;
    }
    return new Promise((resolve) => {
      this.waitForPrimaryResolveFns.push(resolve);
    });
  }

  /**
   * Actually launch mongod
   * @param mongoBin The binary to run
   */
  _launchMongod(mongoBin: string): ChildProcess {
    const spawnOpts = this.opts.spawn ?? {};
    if (!spawnOpts.stdio) {
      spawnOpts.stdio = 'pipe';
    }

    const childProcess = spawnChild(mongoBin, this.prepareCommandArgs(), spawnOpts);
    childProcess.stderr?.on('data', this.stderrHandler.bind(this));
    childProcess.stdout?.on('data', this.stdoutHandler.bind(this));
    childProcess.on('close', this.closeHandler.bind(this));
    childProcess.on('error', this.errorHandler.bind(this));

    if (isNullOrUndefined(childProcess.pid)) {
      throw new Error('Spawned Mongo Instance PID is undefined');
    }

    return childProcess;
  }

  /**
   * Spawn an child to kill the parent and the mongod instance if both are Dead
   * @param parentPid Parent to kill
   * @param childPid Mongod process to kill
   */
  _launchKiller(parentPid: number, childPid: number): ChildProcess {
    this.debug(`Called MongoInstance._launchKiller(parent: ${parentPid}, child: ${childPid}):`);
    // spawn process which kills itself and mongo process if current process is dead
    const killer = spawnChild(
      process.env['NODE'] ?? process.argv[0], // try Environment variable "NODE" before using argv[0]
      [
        path.resolve(__dirname, '../../scripts/mongo_killer.js'),
        parentPid.toString(),
        childPid.toString(),
      ],
      { stdio: 'pipe' }
    );

    killer.stdout?.on('data', (data) => {
      this.debug(`[MongoKiller]: ${data}`);
    });

    killer.stderr?.on('data', (data) => {
      this.debug(`[MongoKiller]: ${data}`);
    });

    ['exit', 'message', 'disconnect', 'error'].forEach((type) => {
      killer.on(type, (...args) => {
        this.debug(`[MongoKiller]: ${type} - ${JSON.stringify(args)}`);
      });
    });

    return killer;
  }

  /**
   * Event "error" handler
   * @param err The Error to handle
   */
  errorHandler(err: string): void {
    this.instanceFailed(err);
  }

  /**
   * Write the CLOSE event to the debug function
   * @param code The Exit code to handle
   */
  closeHandler(code: number): void {
    if (code != 0) {
      this.debug('Mongod instance closed with an non-0 code!');
    }
    this.debug(`CLOSE: ${code}`);
    this.instanceFailed(`Mongod instance closed with code "${code}"`);
  }

  /**
   * Write STDERR to debug function
   * @param message The STDERR line to write
   */
  stderrHandler(message: string | Buffer): void {
    this.debug(`STDERR: ${message.toString()}`);
  }

  /**
   * Write STDOUT to debug function AND instanceReady/instanceFailed if inputs match
   * @param message The STDOUT line to write/parse
   */
  stdoutHandler(message: string | Buffer): void {
    const line: string = message.toString();
    this.debug(`STDOUT: ${line}`);

    if (/waiting for connections/i.test(line)) {
      this.instanceReady();
    } else if (/addr already in use/i.test(line)) {
      this.instanceFailed(`Port ${this.opts.instance.port} already in use`);
    } else if (/mongod instance already running/i.test(line)) {
      this.instanceFailed('Mongod already running');
    } else if (/permission denied/i.test(line)) {
      this.instanceFailed('Mongod permission denied');
    } else if (/Data directory .*? not found/i.test(line)) {
      this.instanceFailed('Data directory not found');
    } else if (/CURL_OPENSSL_3.*not found/i.test(line)) {
      this.instanceFailed(
        'libcurl3 is not available on your system. Mongod requires it and cannot be started without it.\n' +
          'You should manually install libcurl3 or try to use an newer version of MongoDB\n'
      );
    } else if (/CURL_OPENSSL_4.*not found/i.test(line)) {
      this.instanceFailed(
        'libcurl4 is not available on your system. Mongod requires it and cannot be started without it.\n' +
          'You need to manually install libcurl4\n'
      );
    } else if (/shutting down with code/i.test(line)) {
      // if mongod started succesfully then no error on shutdown!
      if (!this.isInstanceReady) {
        this.instanceFailed('Mongod shutting down');
      }
    } else if (/\*\*\*aborting after/i.test(line)) {
      this.instanceFailed('Mongod internal error');
    } else if (/transition to primary complete; database writes are now permitted/i.test(line)) {
      this.isInstancePrimary = true;
      this.debug('Calling all waitForPrimary resolve functions');
      this.waitForPrimaryResolveFns.forEach((resolveFn) => resolveFn(true));
    }
  }
}
