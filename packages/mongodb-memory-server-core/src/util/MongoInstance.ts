import { ChildProcess, SpawnOptions } from 'child_process';
import { default as spawnChild } from 'cross-spawn';
import path from 'path';
import MongoBinary from './MongoBinary';
import { MongoBinaryOpts } from './MongoBinary';
import debug from 'debug';
import { assertion, uriTemplate, isNullOrUndefined, killProcess } from './utils';
import { lt } from 'semver';
import { EventEmitter } from 'events';
import { MongoClient, MongoNetworkError } from 'mongodb';

if (lt(process.version, '10.15.0')) {
  console.warn('Using NodeJS below 10.15.0');
}

const log = debug('MongoMS:MongoInstance');

export type StorageEngine = 'devnull' | 'ephemeralForTest' | 'mmapv1' | 'wiredTiger';

export interface MongoMemoryInstancePropBase {
  args?: string[];
  port?: number | null;
  dbPath?: string;
  storageEngine?: StorageEngine;
}

// TODO: find an better name for this interface
// TODO: find a way to unify with "MongoInstanceOpts"
export interface MongoMemoryInstanceProp extends MongoMemoryInstancePropBase {
  auth?: boolean;
  dbName?: string;
  ip?: string; // for binding to all IP addresses set it to `::,0.0.0.0`, by default '127.0.0.1'
  replSet?: string;
  storageEngine?: StorageEngine;
}

export enum MongoInstanceEvents {
  instanceReplState = 'instanceReplState',
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
  storageEngine?: StorageEngine;
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

export interface MongoInstance extends EventEmitter {
  // Overwrite EventEmitter's definitions (to provide at least the event names)
  emit(event: MongoInstanceEvents, ...args: any[]): boolean;
  on(event: MongoInstanceEvents, listener: (...args: any[]) => void): this;
  once(event: MongoInstanceEvents, listener: (...args: any[]) => void): this;
}

/**
 * MongoDB Instance Handler Class
 * This Class starts & stops the "mongod" process directly and handles stdout, sterr and close events
 */
export class MongoInstance extends EventEmitter {
  // Mark these values as "readonly" & "Readonly" because modifying them after starting will have no effect
  // readonly is required otherwise the property can still be changed on the root level
  readonly instanceOpts: Readonly<MongoInstanceOpts>;
  readonly binaryOpts: Readonly<MongoBinaryOpts>;
  readonly spawnOpts: Readonly<SpawnOptions>;

  /**
   * The "mongod" Process reference
   */
  childProcess?: ChildProcess;
  /**
   * The "mongo_killer" Process reference
   */
  killerProcess?: ChildProcess;
  /**
   * This boolean is "true" if the instance is elected to be PRIMARY
   */
  isInstancePrimary: boolean = false;
  /**
   * This boolean is "true" if the instance is successfully started
   */
  isInstanceReady: boolean = false;
  /**
   * This boolean is "true" if the instance is part of an replset
   */
  isReplSet: boolean = false;

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
    const port = this.instanceOpts.port ?? 'unkown';
    log(`Mongo[${port}]: ${msg}`);
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
      this.isReplSet = true;
      result.push('--replSet', this.instanceOpts.replSet);
    }

    const final = result.concat(this.instanceOpts.args ?? []);

    this.debug('prepareCommandArgs: final arugment array:' + JSON.stringify(final));

    return final;
  }

  /**
   * Create the mongod process
   * @fires MongoInstance#instanceStarted
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
      // try to run "replSetStepDown" before running "killProcess" (gracefull "SIGINT")
      // running "&& this.isInstancePrimary" otherwise "replSetStepDown" will fail with "MongoError: not primary so can't step down"
      if (this.isReplSet && this.isInstancePrimary) {
        let con: MongoClient | undefined;
        try {
          log('kill: instanceStopFailed event');
          const port = this.instanceOpts.port;
          const ip = this.instanceOpts.ip;
          assertion(
            !isNullOrUndefined(port),
            new Error('Cannot shutdown replset gracefully, no "port" is provided')
          );
          assertion(
            !isNullOrUndefined(ip),
            new Error('Cannot shutdown replset gracefully, no "ip" is provided')
          );

          con = await MongoClient.connect(uriTemplate(ip, port, 'admin'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });

          const admin = con.db('admin'); // just to ensure it is actually the "admin" database
          await admin.command({ replSetStepDown: 1, force: true });
          await con.close();
        } catch (err) {
          // Quote from MongoDB Documentation (https://docs.mongodb.com/manual/reference/command/replSetStepDown/#client-connections):
          // > Starting in MongoDB 4.2, replSetStepDown command no longer closes all client connections.
          // > In MongoDB 4.0 and earlier, replSetStepDown command closes all client connections during the step down.
          // so error "MongoNetworkError: connection 1 to 127.0.0.1:41485 closed" will get thrown below 4.2
          if (
            !(
              err instanceof MongoNetworkError &&
              /^connection \d+ to [\d.]+:\d+ closed$/i.test(err.message)
            )
          ) {
            console.warn(err);
          }
        } finally {
          if (!isNullOrUndefined(con)) {
            // even if it errors out, somehow the connection stays open
            await con.close();
          }
        }
      }
      await killProcess(this.childProcess, 'childProcess');
      this.childProcess = undefined; // reset reference to the childProcess for "mongod"
    } else {
      this.debug('- childProcess: nothing to shutdown, skipping.');
    }
    if (!isNullOrUndefined(this.killerProcess)) {
      await killProcess(this.killerProcess, 'killerProcess');
      this.killerProcess = undefined; // reset reference to the childProcess for "mongo_killer"
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
   * @fires MongoInstance#instanceLaunched
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
   * @fires MongoInstance#killerLaunched
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
   * @fires MongoInstance#instanceRawError
   * @fires MongoInstance#instanceError
   */
  errorHandler(err: string): void {
    this.emit(MongoInstanceEvents.instanceRawError, err);
    this.emit(MongoInstanceEvents.instanceError, err);
  }

  /**
   * Write the CLOSE event to the debug function
   * @param code The Exit code to handle
   * @fires MongoInstance#instanceClosed
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
   * @fires MongoInstance#instanceSTDERR
   */
  stderrHandler(message: string | Buffer): void {
    this.debug(`STDERR: ${message.toString()}`);
    this.emit(MongoInstanceEvents.instanceSTDERR, message);
  }

  /**
   * Write STDOUT to debug function and process some special messages
   * @param message The STDOUT line to write/parse
   * @fires MongoInstance#instanceSTDOUT
   * @fires MongoInstance#instanceReady
   * @fires MongoInstance#instanceError
   * @fires MongoInstance#instancePrimary
   * @fires MongoInstance#instanceReplState
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
      this.emit(MongoInstanceEvents.instanceReplState, state);

      if (state !== 'PRIMARY') {
        this.isInstancePrimary = false;
      }
    }
  }
}

export default MongoInstance;
