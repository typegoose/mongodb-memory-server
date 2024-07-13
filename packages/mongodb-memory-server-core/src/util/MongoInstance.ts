import { ChildProcess, fork, spawn, SpawnOptions } from 'child_process';
import * as path from 'path';
import { MongoBinary, MongoBinaryOpts } from './MongoBinary';
import debug from 'debug';
import {
  assertion,
  uriTemplate,
  isNullOrUndefined,
  killProcess,
  ManagerBase,
  checkBinaryPermissions,
  isAlive,
} from './utils';
import { lt } from 'semver';
import { EventEmitter } from 'events';
import { MongoClient, MongoClientOptions, MongoNetworkError } from 'mongodb';
import {
  GenericMMSError,
  KeyFileMissingError,
  StartBinaryFailedError,
  StdoutInstanceError,
  UnexpectedCloseError,
} from './errors';

// ignore the nodejs warning for coverage
/* istanbul ignore next */
if (lt(process.version, '14.20.1')) {
  console.warn('Using NodeJS below 14.20.1');
}

const log = debug('MongoMS:MongoInstance');

export type StorageEngine = 'ephemeralForTest' | 'wiredTiger';

/**
 * Overwrite replica member-specific configuration
 *
 * @see {@link https://docs.mongodb.com/manual/reference/replica-configuration/#replica-set-configuration-document-example}
 *
 * @example
 * ```ts
 * {
 *   priority: 2,
 *   buildIndexes: false,
 *   votes: 2,
 * }
 * ```
 */
export interface ReplicaMemberConfig {
  /**
   * A boolean that identifies an arbiter.
   * @default false - A value of `true` indicates that the member is an arbiter.
   */
  arbiterOnly?: boolean;

  /**
   * A boolean that indicates whether the mongod builds indexes on this member.
   * You can only set this value when adding a member to a replica set.
   * @default true
   */
  buildIndexes?: boolean;

  /**
   * The replica set hides this instance and does not include the member in the output of `db.hello()` or `hello`.
   * @default true
   */
  hidden?: boolean;

  /**
   * A number that indicates the relative eligibility of a member to become a primary.
   * Specify higher values to make a member more eligible to become primary, and lower values to make the member less eligible.
   * @default 1 for primary/secondary; 0 for arbiters.
   */
  priority?: number;

  /**
   * A tags document contains user-defined tag field and value pairs for the replica set member.
   * @default null
   * @example
   * ```ts
   * { "<tag1>": "<string1>", "<tag2>": "<string2>",... }
   * ```
   */
  tags?: any;

  /**
   * Mongodb 4.x only - The number of seconds "behind" the primary that this replica set member should "lag".
   * For mongodb 5.x, use `secondaryDelaySecs` instead.
   * @see {@link https://docs.mongodb.com/v4.4/tutorial/configure-a-delayed-replica-set-member/}
   * @default 0
   */
  slaveDelay?: number;

  /**
   * Mongodb 5.x only - The number of seconds "behind" the primary that this replica set member should "lag".
   * @default 0
   */
  secondaryDelaySecs?: number;

  /**
   * The number of votes a server will cast in a replica set election.
   * The number of votes each member has is either 1 or 0, and arbiters always have exactly 1 vote.
   * @default 1
   */
  votes?: number;
}

export interface MongoMemoryInstanceOptsBase {
  /**
   * Extra Arguments to add
   */
  args?: string[];
  /**
   * Set which port to use
   * Adds "--port"
   * @default from get-port
   */
  port?: number;
  /**
   * Set which storage path to use
   * Adds "--dbpath"
   * @default TmpDir
   */
  dbPath?: string;
  /**
   * Set which Storage Engine to use
   * Adds "--storageEngine"
   * @default "ephemeralForTest"
   */
  storageEngine?: StorageEngine;
  /**
   * Set the Replica-Member-Config
   * Only has a effect when started with "MongoMemoryReplSet"
   */
  replicaMemberConfig?: ReplicaMemberConfig;
  /**
   * Define a custom timeout for when out of some reason the binary cannot get started correctly
   * Time in MS
   * @default 10000 10 seconds
   */
  launchTimeout?: number;
}

export interface MongoMemoryInstanceOpts extends MongoMemoryInstanceOptsBase {
  /**
   * Set which parameter will be used
   * true -> "--auth"
   * false -> "--noauth"
   * @default false
   */
  auth?: boolean;
  /**
   * Currently unused option
   * @default undefined
   */
  dbName?: string;
  /**
   * for binding to all IP addresses set it to `::,0.0.0.0`, by default '127.0.0.1'
   * Adds "--bind_ip"
   * @default undefined
   */
  ip?: string;
  /**
   * Set that this instance is part of a replset
   * Adds "--replSet"
   * @default undefined
   */
  replSet?: string;
  /**
   * Location for the "--keyfile" argument
   * Only has an effect when "auth" is enabled and is a replset
   * Adds "--keyfile"
   * @default undefined
   */
  keyfileLocation?: string;
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
   * Extra options to append to "mongoclient.connect"
   * Mainly used for authentication
   */
  extraConnectionOptions?: MongoClientOptions;

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

  /**
   * Extra promise to avoid multiple calls of `.stop` at the same time
   *
   * @see https://github.com/typegoose/mongodb-memory-server/issues/802
   */
  // NOTE: i am not sure how to properly test this
  stopPromise?: Promise<boolean>;

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
  protected debug(msg: string, ...extra: unknown[]): void {
    const port = this.instanceOpts.port ?? 'unknown';
    log(`Mongo[${port}]: ${msg}`, ...extra);
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
    if (!!this.instanceOpts.replSet) {
      this.isReplSet = true;
      result.push('--replSet', this.instanceOpts.replSet);
    }
    if (!!this.instanceOpts.storageEngine) {
      result.push('--storageEngine', this.instanceOpts.storageEngine);
    }
    if (!!this.instanceOpts.ip) {
      result.push('--bind_ip', this.instanceOpts.ip);
    }
    if (this.instanceOpts.auth) {
      result.push('--auth');

      if (this.isReplSet) {
        assertion(!isNullOrUndefined(this.instanceOpts.keyfileLocation), new KeyFileMissingError());
        result.push('--keyFile', this.instanceOpts.keyfileLocation);
      }
    } else {
      result.push('--noauth');
    }

    const final = result.concat(this.instanceOpts.args ?? []);

    this.debug('prepareCommandArgs: final argument array:' + JSON.stringify(final));

    return final;
  }

  /**
   * Create the mongod process
   * @fires MongoInstance#instanceStarted
   */
  async start(): Promise<void> {
    this.debug('start');

    if (!isNullOrUndefined(this.mongodProcess?.pid)) {
      throw new GenericMMSError(
        `Cannot run "MongoInstance.start" because "mongodProcess.pid" is still defined (pid: ${this.mongodProcess?.pid})`
      );
    }

    this.isInstancePrimary = false;
    this.isInstanceReady = false;
    this.isReplSet = false;

    let timeout: NodeJS.Timeout;

    const mongoBin = await MongoBinary.getPath(this.binaryOpts);
    await checkBinaryPermissions(mongoBin);

    const launch: Promise<void> = new Promise<void>((res, rej) => {
      this.once(MongoInstanceEvents.instanceReady, res);
      this.once(MongoInstanceEvents.instanceError, rej);
      this.once(MongoInstanceEvents.instanceClosed, function launchInstanceClosed() {
        rej(new Error('Instance Exited before being ready and without throwing an error!'));
      });

      // extra conditions just to be sure that the custom defined timeout is valid
      const timeoutTime =
        !!this.instanceOpts.launchTimeout && this.instanceOpts.launchTimeout >= 1000
          ? this.instanceOpts.launchTimeout
          : 1000 * 10; // default 10 seconds

      timeout = setTimeout(() => {
        const err = new GenericMMSError(`Instance failed to start within ${timeoutTime}ms`);
        this.emit(MongoInstanceEvents.instanceError, err);

        rej(err);
      }, timeoutTime);
    }).finally(() => {
      // always clear the timeout after the promise somehow resolves
      clearTimeout(timeout);
    });

    this.debug('start: Starting Processes');
    this.mongodProcess = this._launchMongod(mongoBin);
    // This assertion is here because somewhere between nodejs 12 and 16 the types for "childprocess.pid" changed to include "| undefined"
    // it is tested and a error is thrown in "this_launchMongod", but typescript somehow does not see this yet as of 4.3.5
    assertion(
      !isNullOrUndefined(this.mongodProcess.pid),
      new Error('MongoD Process failed to spawn')
    );
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
      this.debug('stop: nothing to shutdown, returning');

      return false;
    }

    if (!isNullOrUndefined(this.stopPromise)) {
      this.debug('stop: stopPromise is already set, using that');

      return this.stopPromise;
    }

    // wrap the actual stop in a promise, so it can be awaited in multiple calls
    // for example a instanceError while stop is already running would cause another stop
    this.stopPromise = (async () => {
      if (!isNullOrUndefined(this.mongodProcess) && isAlive(this.mongodProcess.pid)) {
        // try to run "shutdown" before running "killProcess" (gracefull "SIGINT")
        // using this, otherwise on windows nodejs will handle "SIGINT" & "SIGTERM" & "SIGKILL" the same (instant exit)
        if (this.isReplSet) {
          let con: MongoClient | undefined;
          try {
            this.debug('stop: trying shutdownServer');
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
              // stopping a instance should not take long to connect to, default would be 30 seconds
              serverSelectionTimeoutMS: 5000, // 5 seconds
              ...this.extraConnectionOptions,
              directConnection: true,
            });

            const admin = con.db('admin'); // just to ensure it is actually the "admin" database
            // "timeoutSecs" is set to "1" otherwise it will take at least "10" seconds to stop (very long tests)
            await admin.command({ shutdown: 1, force: true, timeoutSecs: 1 });
            this.debug('stop: after admin shutdown command');
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

        await killProcess(this.mongodProcess, 'mongodProcess', this.instanceOpts.port);
        this.mongodProcess = undefined; // reset reference to the childProcess for "mongod"
      } else {
        this.debug('stop: mongodProcess: nothing to shutdown, skipping');
      }
      if (!isNullOrUndefined(this.killerProcess)) {
        await killProcess(this.killerProcess, 'killerProcess', this.instanceOpts.port);
        this.killerProcess = undefined; // reset reference to the childProcess for "mongo_killer"
      } else {
        this.debug('stop: killerProcess: nothing to shutdown, skipping');
      }

      this.debug('stop: Instance Finished Shutdown');

      return true;
    })().finally(() => (this.stopPromise = undefined));

    return this.stopPromise;
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
      throw new StartBinaryFailedError(path.resolve(mongoBin));
    }

    childProcess.unref();

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
   * @param signal The Signal to handle
   * @fires MongoInstance#instanceClosed
   */
  closeHandler(code: number | null, signal: string | null): void {
    // check if the platform is windows, if yes check if the code is not "12" or "0" otherwise just check code is not "0"
    // because for mongodb any event on windows (like SIGINT / SIGTERM) will result in an code 12
    // https://docs.mongodb.com/manual/reference/exit-codes/#12
    if (
      (process.platform === 'win32' && code != 12 && code != 0) ||
      (process.platform !== 'win32' && code != 0)
    ) {
      this.debug('closeHandler: Mongod instance closed with an non-0 (or non 12 on windows) code!');
      // Note: this also emits when a signal is present, which is expected because signals are not expected here
      this.emit(MongoInstanceEvents.instanceError, new UnexpectedCloseError(code, signal));
    }

    this.debug(`closeHandler: code: "${code}", signal: "${signal}"`);
    this.emit(MongoInstanceEvents.instanceClosed, code, signal);
  }

  /**
   * Write STDERR to debug function
   * @param message The STDERR line to write
   * @fires MongoInstance#instanceSTDERR
   */
  stderrHandler(message: string | Buffer): void {
    const line: string = message.toString().trim();
    this.debug(`stderrHandler: ""${line}""`); // denoting the STDERR string with double quotes, because the stdout might also use quotes
    this.emit(MongoInstanceEvents.instanceSTDERR, line);

    this.checkErrorInLine(line);
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

    this.checkErrorInLine(line);

    // this case needs to be infront of "transition to primary complete", otherwise it might reset "isInstancePrimary" to "false"
    if (/transition to \w+ from \w+/i.test(line)) {
      const state = /transition to (\w+) from \w+/i.exec(line)?.[1] ?? 'UNKNOWN';
      this.emit(MongoInstanceEvents.instanceReplState, state);

      if (state !== 'PRIMARY') {
        this.isInstancePrimary = false;
      }
    }
    if (/transition to primary complete; database writes are now permitted/i.test(line)) {
      this.isInstancePrimary = true;
      this.debug('stdoutHandler: emitting "instancePrimary"');
      this.emit(MongoInstanceEvents.instancePrimary);
    }
  }

  /**
   * Run Checks on the line if the lines contain any thrown errors
   * @param line The Line to check
   */
  protected checkErrorInLine(line: string) {
    if (/address already in use/i.test(line)) {
      this.emit(
        MongoInstanceEvents.instanceError,
        new StdoutInstanceError(`Port "${this.instanceOpts.port}" already in use`)
      );
    }

    {
      const execptionMatch = /\bexception in initAndListen: (\w+): /i.exec(line);

      if (!isNullOrUndefined(execptionMatch)) {
        // in pre-4.0 mongodb this exception may have been "permission denied" and "Data directory /path not found"

        this.emit(
          MongoInstanceEvents.instanceError,
          new StdoutInstanceError(
            `Instance Failed to start with "${execptionMatch[1] ?? 'unknown'}". Original Error:\n` +
              line.substring(execptionMatch.index + execptionMatch[0].length)
          )
        );
      }

      // special handling for when mongodb outputs this error as json
      const execptionMatchJson = /\bDBException in initAndListen,/i.test(line);

      if (execptionMatchJson) {
        const loadedJSON = JSON.parse(line) ?? {};

        this.emit(
          MongoInstanceEvents.instanceError,
          new StdoutInstanceError(
            `Instance Failed to start with "DBException in initAndListen". Original Error:\n` +
              loadedJSON?.attr?.error ?? line // try to use the parsed json, but as fallback use the entire line
          )
        );
      }
    }

    if (/CURL_OPENSSL_3['\s]+not found/i.test(line)) {
      this.emit(
        MongoInstanceEvents.instanceError,
        new StdoutInstanceError(
          'libcurl3 is not available on your system. Mongod requires it and cannot be started without it.\n' +
            'You should manually install libcurl3 or try to use an newer version of MongoDB'
        )
      );
    }
    if (/CURL_OPENSSL_4['\s]+not found/i.test(line)) {
      this.emit(
        MongoInstanceEvents.instanceError,
        new StdoutInstanceError(
          'libcurl4 is not available on your system. Mongod requires it and cannot be started without it.\n' +
            'You need to manually install libcurl4'
        )
      );
    }

    {
      /*
      The following regex matches something like "libsomething.so.1: cannot open shared object"
      and is optimized to only start matching at a word boundary ("\b") and using atomic-group replacement "(?=inner)\1"
      */
      const liberrormatch = line.match(/\b(?=(lib[^:]+))\1: cannot open shared object/i);

      if (!isNullOrUndefined(liberrormatch)) {
        const lib = liberrormatch[1].toLocaleLowerCase() ?? 'unknown';
        this.emit(
          MongoInstanceEvents.instanceError,
          new StdoutInstanceError(
            `Instance failed to start because a library is missing or cannot be opened: "${lib}"`
          )
        );
      }
    }

    if (/\*\*\*aborting after/i.test(line)) {
      const match = line.match(/\*\*\*aborting after ([^\n]+)/i);

      const extra = match?.[1] ? ` (${match[1]})` : '';

      this.emit(
        MongoInstanceEvents.instanceError,
        new StdoutInstanceError('Mongod internal error' + extra)
      );
    }
  }
}

export default MongoInstance;
