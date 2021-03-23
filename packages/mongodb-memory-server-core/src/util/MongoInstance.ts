import { ChildProcess, fork, spawn, SpawnOptions } from 'child_process';
import * as path from 'path';
import { MongoBinary, MongoBinaryOpts } from './MongoBinary';
import debug from 'debug';
import { assertion, uriTemplate, isNullOrUndefined, killProcess, ManagerBase } from './utils';
import { lt } from 'semver';
import { EventEmitter } from 'events';
import { MongoClient, MongoNetworkError } from 'mongodb';
import { promises as fspromises, constants } from 'fs';

if (lt(process.version, '10.15.0')) {
  console.warn('Using NodeJS below 10.15.0');
}

const log = debug('MongoMS:MongoInstance');

export type StorageEngine = 'devnull' | 'ephemeralForTest' | 'mmapv1' | 'wiredTiger';

export interface MongoMemoryInstanceOptsBase {
  args?: string[];
  port?: number;
  dbPath?: string;
  storageEngine?: StorageEngine;
}

export interface MongoMemoryInstanceOpts extends MongoMemoryInstanceOptsBase {
  auth?: boolean;
  dbName?: string;
  /**
   * for binding to all IP addresses set it to `::,0.0.0.0`, by default '127.0.0.1'
   */
  ip?: string;
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
  /** Only Raw Error (emitted by mongodProcess) */
  instanceRawError = 'instanceRawError',
  /** Raw Errors and Custom Errors */
  instanceError = 'instanceError',
  killerLaunched = 'killerLaunched',
  instanceLaunched = 'instanceLaunched',
  instanceStarted = 'instanceStarted',
}

export interface MongodOpts {
  /** instance options */
  instance: MongoMemoryInstanceOpts;
  /** mongo binary options */
  binary: MongoBinaryOpts;
  /** child process spawn options */
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
export class MongoInstance extends EventEmitter implements ManagerBase {
  // Mark these values as "readonly" & "Readonly" because modifying them after starting will have no effect
  // readonly is required otherwise the property can still be changed on the root level
  instanceOpts: MongoMemoryInstanceOpts;
  readonly binaryOpts: Readonly<MongoBinaryOpts>;
  readonly spawnOpts: Readonly<SpawnOptions>;

  /**
   * The "mongod" Process reference
   */
  mongodProcess?: ChildProcess;
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
      this.debug('constructor: Instance is ready!');
    });

    this.on(MongoInstanceEvents.instanceError, async (err: string | Error) => {
      this.debug(`constructor: Instance has thrown an Error: ${err.toString()}`);
      this.isInstanceReady = false;
      this.isInstancePrimary = false;

      await this.stop();
    });
  }

  /**
   * Debug-log with template applied
   * @param msg The Message to log
   */
  protected debug(msg: string): void {
    const port = this.instanceOpts.port ?? 'unknown';
    log(`Mongo[${port}]: ${msg}`);
  }

  /**
   * Create an new instance an call method "start"
   * @param opts Options passed to the new instance
   */
  static async create(opts: Partial<MongodOpts>): Promise<MongoInstance> {
    log('create: Called .create() method');
    const instance = new this(opts);
    await instance.start();

    return instance;
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

    result.push('--port', this.instanceOpts.port.toString());
    result.push('--dbpath', this.instanceOpts.dbPath);

    // "!!" converts the value to an boolean (double-invert) so that no "falsy" values are added
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
  async start(): Promise<void> {
    this.debug('start');
    this.isInstancePrimary = false;
    this.isInstanceReady = false;
    this.isReplSet = false;

    const launch: Promise<void> = new Promise((res, rej) => {
      this.once(MongoInstanceEvents.instanceReady, res);
      this.once(MongoInstanceEvents.instanceError, rej);
      this.once(MongoInstanceEvents.instanceClosed, () => {
        rej(new Error('Instance Exited before being ready and without throwing an error!'));
      });
    });

    const mongoBin = await MongoBinary.getPath(this.binaryOpts);
    try {
      await fspromises.access(mongoBin, constants.X_OK);
    } catch (err) {
      console.error(
        `Mongod File at "${mongoBin}" does not have sufficient permissions to be used by this process\n` +
          'Needed Permissions: Execute (--x)\n'
      );
      throw err;
    }
    this.debug('start: Starting Processes');
    this.mongodProcess = this._launchMongod(mongoBin);
    this.killerProcess = this._launchKiller(process.pid, this.mongodProcess.pid);

    await launch;
    this.emit(MongoInstanceEvents.instanceStarted);
    this.debug('start: Processes Started');
  }

  /**
   * Shutdown all related processes (Mongod Instance & Killer Process)
   */
  async stop(): Promise<boolean> {
    this.debug('stop');

    if (!this.mongodProcess && !this.killerProcess) {
      log('stop: nothing to shutdown, returning');

      return false;
    }

    if (!isNullOrUndefined(this.mongodProcess)) {
      // try to run "replSetStepDown" before running "killProcess" (gracefull "SIGINT")
      // running "&& this.isInstancePrimary" otherwise "replSetStepDown" will fail with "MongoError: not primary so can't step down"
      if (this.isReplSet && this.isInstancePrimary) {
        let con: MongoClient | undefined;
        try {
          log('stop: trying replSetStepDown');
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

      await killProcess(this.mongodProcess, 'mongodProcess');
      this.mongodProcess = undefined; // reset reference to the childProcess for "mongod"
    } else {
      this.debug('stop: mongodProcess: nothing to shutdown, skipping');
    }
    if (!isNullOrUndefined(this.killerProcess)) {
      await killProcess(this.killerProcess, 'killerProcess');
      this.killerProcess = undefined; // reset reference to the childProcess for "mongo_killer"
    } else {
      this.debug('stop: killerProcess: nothing to shutdown, skipping');
    }

    this.debug('stop: Instance Finished Shutdown');

    return true;
  }

  /**
   * Actually launch mongod
   * @param mongoBin The binary to run
   * @fires MongoInstance#instanceLaunched
   */
  _launchMongod(mongoBin: string): ChildProcess {
    this.debug('_launchMongod: Launching Mongod Process');
    const childProcess = spawn(path.resolve(mongoBin), this.prepareCommandArgs(), {
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
   * Spawn an seperate process to kill the parent and the mongod instance to ensure "mongod" gets stopped in any case
   * @param parentPid Parent nodejs process
   * @param childPid Mongod process to kill
   * @fires MongoInstance#killerLaunched
   */
  _launchKiller(parentPid: number, childPid: number): ChildProcess {
    this.debug(
      `_launchKiller: Launching Killer Process (parent: ${parentPid}, child: ${childPid})`
    );
    // spawn process which kills itself and mongo process if current process is dead
    const killer = fork(
      path.resolve(__dirname, '../../scripts/mongo_killer.js'),
      [parentPid.toString(), childPid.toString()],
      {
        detached: true,
        stdio: 'ignore', // stdio cannot be done with an detached process cross-systems and without killing the fork on parent termination
      }
    );

    killer.unref(); // dont force an exit on the fork when parent is exiting

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
    // check if the platform is windows, if yes check if the code is not "12" or "0" otherwise just check code is not "0"
    // because for mongodb any event on windows (like SIGINT / SIGTERM) will result in an code 12
    // https://docs.mongodb.com/manual/reference/exit-codes/#12
    if ((process.platform === 'win32' && code != 12 && code != 0) || code != 0) {
      this.debug('closeHandler: Mongod instance closed with an non-0 (or non 12 on windows) code!');
    }

    this.debug(`closeHandler: ${code}`);
    this.emit(MongoInstanceEvents.instanceClosed, code);
  }

  /**
   * Write STDERR to debug function
   * @param message The STDERR line to write
   * @fires MongoInstance#instanceSTDERR
   */
  stderrHandler(message: string | Buffer): void {
    this.debug(`stderrHandler: ""${message.toString()}""`); // denoting the STDERR string with double quotes, because the stdout might also use quotes
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
    const line: string = message.toString().trim(); // trimming to remove extra new lines and spaces around the message
    this.debug(`stdoutHandler: ""${line}""`); // denoting the STDOUT string with double quotes, because the stdout might also use quotes
    this.emit(MongoInstanceEvents.instanceSTDOUT, line);

    // dont use "else if", because input can be multiple lines and match multiple things
    if (/waiting for connections/i.test(line)) {
      this.emit(MongoInstanceEvents.instanceReady);
    }
    if (/address already in use/i.test(line)) {
      this.emit(
        MongoInstanceEvents.instanceError,
        `Port "${this.instanceOpts.port}" already in use`
      );
    }
    if (/mongod instance already running/i.test(line)) {
      this.emit(MongoInstanceEvents.instanceError, 'Mongod already running');
    }
    if (/permission denied/i.test(line)) {
      this.emit(MongoInstanceEvents.instanceError, 'Mongod permission denied');
    }
    if (/Data directory .*? not found/i.test(line)) {
      this.emit(MongoInstanceEvents.instanceError, 'Data directory not found');
    }
    if (/CURL_OPENSSL_3.*not found/i.test(line)) {
      this.emit(
        MongoInstanceEvents.instanceError,
        'libcurl3 is not available on your system. Mongod requires it and cannot be started without it.\n' +
          'You should manually install libcurl3 or try to use an newer version of MongoDB\n'
      );
    }
    if (/CURL_OPENSSL_4.*not found/i.test(line)) {
      this.emit(
        MongoInstanceEvents.instanceError,
        'libcurl4 is not available on your system. Mongod requires it and cannot be started without it.\n' +
          'You need to manually install libcurl4\n'
      );
    }
    if (/lib.*: cannot open shared object/i.test(line)) {
      const lib =
        line.match(/(lib.*): cannot open shared object/i)?.[1].toLocaleLowerCase() ?? 'unknown';
      this.emit(
        MongoInstanceEvents.instanceError,
        `Instance Failed to start because an library file is missing: "${lib}"`
      );
    }
    if (/\*\*\*aborting after/i.test(line)) {
      this.emit(MongoInstanceEvents.instanceError, 'Mongod internal error');
    }
    if (/transition to primary complete; database writes are now permitted/i.test(line)) {
      this.isInstancePrimary = true;
      this.debug('stdoutHandler: emitting "instancePrimary"');
      this.emit(MongoInstanceEvents.instancePrimary);
    }
    if (/member [\d\.:]+ is now in state \w+/i.test(line)) {
      // "[\d\.:]+" matches "0.0.0.0:0000" (IP:PORT)
      const state = /member [\d\.:]+ is now in state (\w+)/i.exec(line)?.[1] ?? 'UNKNOWN';
      this.emit(MongoInstanceEvents.instanceReplState, state);

      if (state !== 'PRIMARY') {
        this.isInstancePrimary = false;
      }
    }
  }
}

export default MongoInstance;
