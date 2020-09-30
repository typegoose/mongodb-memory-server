import { ChildProcess } from 'child_process';
import { default as spawnChild } from 'cross-spawn';
import path from 'path';
import MongoBinary from './MongoBinary';
import { MongoBinaryOpts } from './MongoBinary';
import { StorageEngineT, SpawnOptions } from '../types';
import debug from 'debug';
import { assertion, isNullOrUndefined, killProcess } from './db_util';
import { lt } from 'semver';
import { EventEmitter } from 'events';

if (lt(process.version, '10.15.0')) {
  console.warn('Using NodeJS below 10.15.0');
}

const log = debug('MongoMS:MongoInstance');

export enum MongoInstanceEvents {
  instanceState = 'instanceState',
  instancePrimary = 'instancePrimary',
  instanceReady = 'instanceReady',
  instanceSTDOUT = 'instanceSTDOUT',
  instanceSTDERR = 'instanceSTDERR',
  instanceClosed = 'instanceClosed',
  /** Only Raw Error (emitted by childProcess) */
  instanceRawError = 'instanceRawError',
  /** Raw Errors and Custom Errors */
  instanceError = 'instanceError',
  killerLaunched = 'killerLaunched',
  instanceLaunched = 'instanceLaunched',
  instanceStarted = 'instanceStarted',
}

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

export default interface MongoInstance extends EventEmitter {
  // Overwrite EventEmitter's definitions (to provide at least the event names)
  emit(event: MongoInstanceEvents, ...args: any[]): boolean;
  on(event: MongoInstanceEvents, listener: (...args: any[]) => void): this;
  once(event: MongoInstanceEvents, listener: (...args: any[]) => void): this;
}

/**
 * MongoDB Instance Handler Class
 */
export default class MongoInstance extends EventEmitter {
  instanceOpts: MongoInstanceOpts;
  binaryOpts: MongoBinaryOpts;
  spawnOpts: SpawnOptions;

  childProcess: ChildProcess | null = null;
  killerProcess: ChildProcess | null = null;
  isInstancePrimary: boolean = false;
  isInstanceReady: boolean = false;

  constructor(opts: Partial<MongodOpts>) {
    super();
    this.instanceOpts = { ...opts.instance };
    this.binaryOpts = { ...opts.binary };
    this.spawnOpts = { ...opts.spawn };

    this.on(MongoInstanceEvents.instanceReady, () => {
      this.isInstanceReady = true;
      this.debug('Instance is ready!');
    });

    this.on(MongoInstanceEvents.instanceError, async (err: string | Error) => {
      this.debug(`Instance has thrown an Error: ${err.toString()}`);
      this.isInstanceReady = false;
      this.isInstancePrimary = false;

      await this.kill();
    });
  }

  /**
   * Debug-log with template applied
   * @param msg The Message to log
   */
  private debug(msg: string): void {
    if (debug.enabled('MongoMS:MongoInstance')) {
      const port = this.instanceOpts.port ?? 'unkown';
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
    this.debug('prepareCommandArgs');
    assertion(
      !isNullOrUndefined(this.instanceOpts.port),
      new Error('"instanceOpts.port" is required to be set!')
    );
    assertion(
      !isNullOrUndefined(this.instanceOpts.dbPath),
      new Error('"instanceOpts.dbPath" is required to be set!')
    );
    const result: string[] = [];
    // "!!" converts the value to an boolean (double-invert) so that no "falsy" values are added
    result.push('--port', this.instanceOpts.port.toString());
    result.push('--dbpath', this.instanceOpts.dbPath);
    if (!!this.instanceOpts.storageEngine) {
      result.push('--storageEngine', this.instanceOpts.storageEngine);
    }
    if (!!this.instanceOpts.ip) {
      result.push('--bind_ip', this.instanceOpts.ip);
    }
    if (this.instanceOpts.auth) {
      result.push('--auth');
    } else {
      result.push('--noauth');
    }
    if (!!this.instanceOpts.replSet) {
      result.push('--replSet', this.instanceOpts.replSet);
    }

    const final = result.concat(this.instanceOpts.args ?? []);

    this.debug('prepareCommandArgs: final arugment array:' + JSON.stringify(final));

    return final;
  }

  /**
   * Create the mongod process
   */
  async run(): Promise<this> {
    const launch: Promise<void> = new Promise((resolve, reject) => {
      this.once(MongoInstanceEvents.instanceReady, resolve);
      this.once(MongoInstanceEvents.instanceError, reject);
      this.once(MongoInstanceEvents.instanceClosed, () => {
        reject(new Error('Instance Exited before being ready and without throwing an error!'));
      });
    });

    const mongoBin = await MongoBinary.getPath(this.binaryOpts);
    this.childProcess = this._launchMongod(mongoBin);
    this.killerProcess = this._launchKiller(process.pid, this.childProcess.pid);

    await launch;
    this.emit(MongoInstanceEvents.instanceStarted);
    return this;
  }

  /**
   * Shutdown all related processes (Mongod Instance & Killer Process)
   */
  async kill(): Promise<MongoInstance> {
    this.debug('Called MongoInstance.kill():');

    if (!isNullOrUndefined(this.childProcess)) {
      await killProcess(this.childProcess, 'childProcess');
    } else {
      this.debug('- childProcess: nothing to shutdown, skipping.');
    }
    if (!isNullOrUndefined(this.killerProcess)) {
      await killProcess(this.killerProcess, 'killerProcess');
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
   * Actually launch mongod
   * @param mongoBin The binary to run
   */
  _launchMongod(mongoBin: string): ChildProcess {
    const childProcess = spawnChild(mongoBin, this.prepareCommandArgs(), {
      ...this.spawnOpts,
      stdio: 'pipe', // ensure that stdio is always an pipe, regardless of user input
    });
    childProcess.stderr?.on('data', this.stderrHandler.bind(this));
    childProcess.stdout?.on('data', this.stdoutHandler.bind(this));
    childProcess.on('close', this.closeHandler.bind(this));
    childProcess.on('error', this.errorHandler.bind(this));

    if (isNullOrUndefined(childProcess.pid)) {
      throw new Error('Spawned Mongo Instance PID is undefined');
    }

    this.emit(MongoInstanceEvents.instanceLaunched);

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

    this.emit(MongoInstanceEvents.killerLaunched);

    return killer;
  }

  /**
   * Event "error" handler
   * @param err The Error to handle
   */
  errorHandler(err: string): void {
    this.emit(MongoInstanceEvents.instanceRawError, err);
    this.emit(MongoInstanceEvents.instanceError, err);
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
    this.emit(MongoInstanceEvents.instanceClosed, code);
  }

  /**
   * Write STDERR to debug function
   * @param message The STDERR line to write
   */
  stderrHandler(message: string | Buffer): void {
    this.debug(`STDERR: ${message.toString()}`);
    this.emit(MongoInstanceEvents.instanceSTDERR, message);
  }

  /**
   * Write STDOUT to debug function and process some special messages
   * @param message The STDOUT line to write/parse
   */
  stdoutHandler(message: string | Buffer): void {
    const line: string = message.toString();
    this.debug(`STDOUT: ${line}`);
    this.emit(MongoInstanceEvents.instanceSTDOUT, line);

    if (/waiting for connections/i.test(line)) {
      this.emit(MongoInstanceEvents.instanceReady);
    } else if (/address already in use/i.test(line)) {
      this.emit(MongoInstanceEvents.instanceError, `Port ${this.instanceOpts.port} already in use`);
    } else if (/mongod instance already running/i.test(line)) {
      this.emit(MongoInstanceEvents.instanceError, 'Mongod already running');
    } else if (/permission denied/i.test(line)) {
      this.emit(MongoInstanceEvents.instanceError, 'Mongod permission denied');
    } else if (/Data directory .*? not found/i.test(line)) {
      this.emit(MongoInstanceEvents.instanceError, 'Data directory not found');
    } else if (/CURL_OPENSSL_3.*not found/i.test(line)) {
      this.emit(
        MongoInstanceEvents.instanceError,
        'libcurl3 is not available on your system. Mongod requires it and cannot be started without it.\n' +
          'You should manually install libcurl3 or try to use an newer version of MongoDB\n'
      );
    } else if (/CURL_OPENSSL_4.*not found/i.test(line)) {
      this.emit(
        MongoInstanceEvents.instanceError,
        'libcurl4 is not available on your system. Mongod requires it and cannot be started without it.\n' +
          'You need to manually install libcurl4\n'
      );
    } else if (/\*\*\*aborting after/i.test(line)) {
      this.emit(MongoInstanceEvents.instanceError, 'Mongod internal error');
    } else if (/transition to primary complete; database writes are now permitted/i.test(line)) {
      this.isInstancePrimary = true;
      this.debug('Calling all waitForPrimary resolve functions');
      this.emit(MongoInstanceEvents.instancePrimary);
    } else if (/member [\d\.:]+ is now in state \w+/i.test(line)) {
      // "[\d\.:]+" matches "0.0.0.0:0000" (IP:PORT)
      const state = /member [\d\.:]+ is now in state (\w+)/i.exec(line)?.[1] ?? 'UNKOWN';
      this.emit(MongoInstanceEvents.instanceState, state);

      if (state !== 'PRIMARY') {
        this.isInstancePrimary = false;
      }
    }
  }
}
