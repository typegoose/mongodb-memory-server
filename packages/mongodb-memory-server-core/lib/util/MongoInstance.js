"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoInstance = exports.MongoInstanceEvents = void 0;
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const path = tslib_1.__importStar(require("path"));
const MongoBinary_1 = require("./MongoBinary");
const debug_1 = tslib_1.__importDefault(require("debug"));
const utils_1 = require("./utils");
const semver_1 = require("semver");
const events_1 = require("events");
const mongodb_1 = require("mongodb");
const errors_1 = require("./errors");
// ignore the nodejs warning for coverage
/* istanbul ignore next */
if ((0, semver_1.lt)(process.version, '16.20.1')) {
    console.warn('Using NodeJS below 16.20.1');
}
const log = (0, debug_1.default)('MongoMS:MongoInstance');
var MongoInstanceEvents;
(function (MongoInstanceEvents) {
    MongoInstanceEvents["instanceReplState"] = "instanceReplState";
    MongoInstanceEvents["instancePrimary"] = "instancePrimary";
    MongoInstanceEvents["instanceReady"] = "instanceReady";
    MongoInstanceEvents["instanceSTDOUT"] = "instanceSTDOUT";
    MongoInstanceEvents["instanceSTDERR"] = "instanceSTDERR";
    MongoInstanceEvents["instanceClosed"] = "instanceClosed";
    /** Only Raw Error (emitted by mongodProcess) */
    MongoInstanceEvents["instanceRawError"] = "instanceRawError";
    /** Raw Errors and Custom Errors */
    MongoInstanceEvents["instanceError"] = "instanceError";
    MongoInstanceEvents["killerLaunched"] = "killerLaunched";
    MongoInstanceEvents["instanceLaunched"] = "instanceLaunched";
    MongoInstanceEvents["instanceStarted"] = "instanceStarted";
})(MongoInstanceEvents || (exports.MongoInstanceEvents = MongoInstanceEvents = {}));
/**
 * MongoDB Instance Handler Class
 * This Class starts & stops the "mongod" process directly and handles stdout, sterr and close events
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class MongoInstance extends events_1.EventEmitter {
    constructor(opts) {
        super();
        /**
         * This boolean is "true" if the instance is elected to be PRIMARY
         */
        this.isInstancePrimary = false;
        /**
         * This boolean is "true" if the instance is successfully started
         */
        this.isInstanceReady = false;
        /**
         * This boolean is "true" if the instance is part of an replset
         */
        this.isReplSet = false;
        this.instanceOpts = { ...opts.instance };
        this.binaryOpts = { ...opts.binary };
        this.spawnOpts = { ...opts.spawn };
        this.on(MongoInstanceEvents.instanceReady, () => {
            this.isInstanceReady = true;
            this.debug('constructor: Instance is ready!');
        });
        this.on(MongoInstanceEvents.instanceError, async (err) => {
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
    debug(msg, ...extra) {
        const port = this.instanceOpts.port ?? 'unknown';
        log(`Mongo[${port}]: ${msg}`, ...extra);
    }
    /**
     * Create an new instance an call method "start"
     * @param opts Options passed to the new instance
     */
    static async create(opts) {
        log('create: Called .create() method');
        const instance = new this(opts);
        await instance.start();
        return instance;
    }
    /**
     * Create an array of arguments for the mongod instance
     */
    prepareCommandArgs() {
        this.debug('prepareCommandArgs');
        (0, utils_1.assertion)(!(0, utils_1.isNullOrUndefined)(this.instanceOpts.port), new Error('"instanceOpts.port" is required to be set!'));
        (0, utils_1.assertion)(!(0, utils_1.isNullOrUndefined)(this.instanceOpts.dbPath), new Error('"instanceOpts.dbPath" is required to be set!'));
        const result = [];
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
                (0, utils_1.assertion)(!(0, utils_1.isNullOrUndefined)(this.instanceOpts.keyfileLocation), new errors_1.KeyFileMissingError());
                result.push('--keyFile', this.instanceOpts.keyfileLocation);
            }
        }
        else {
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
    async start() {
        this.debug('start');
        if (!(0, utils_1.isNullOrUndefined)(this.mongodProcess?.pid)) {
            throw new errors_1.GenericMMSError(`Cannot run "MongoInstance.start" because "mongodProcess.pid" is still defined (pid: ${this.mongodProcess?.pid})`);
        }
        this.isInstancePrimary = false;
        this.isInstanceReady = false;
        this.isReplSet = false;
        let timeout;
        const mongoBin = await MongoBinary_1.MongoBinary.getPath(this.binaryOpts);
        await (0, utils_1.checkBinaryPermissions)(mongoBin);
        const launch = new Promise((res, rej) => {
            this.once(MongoInstanceEvents.instanceReady, res);
            this.once(MongoInstanceEvents.instanceError, rej);
            this.once(MongoInstanceEvents.instanceClosed, function launchInstanceClosed() {
                rej(new Error('Instance Exited before being ready and without throwing an error!'));
            });
            // extra conditions just to be sure that the custom defined timeout is valid
            const timeoutTime = !!this.instanceOpts.launchTimeout && this.instanceOpts.launchTimeout >= 1000
                ? this.instanceOpts.launchTimeout
                : 1000 * 10; // default 10 seconds
            timeout = setTimeout(() => {
                const err = new errors_1.GenericMMSError(`Instance failed to start within ${timeoutTime}ms`);
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
        (0, utils_1.assertion)(!(0, utils_1.isNullOrUndefined)(this.mongodProcess.pid), new Error('MongoD Process failed to spawn'));
        this.killerProcess = this._launchKiller(process.pid, this.mongodProcess.pid);
        await launch;
        this.emit(MongoInstanceEvents.instanceStarted);
        this.debug('start: Processes Started');
    }
    /**
     * Shutdown all related processes (Mongod Instance & Killer Process)
     */
    async stop() {
        this.debug('stop');
        if (!this.mongodProcess && !this.killerProcess) {
            this.debug('stop: nothing to shutdown, returning');
            return false;
        }
        if (!(0, utils_1.isNullOrUndefined)(this.stopPromise)) {
            this.debug('stop: stopPromise is already set, using that');
            return this.stopPromise;
        }
        // wrap the actual stop in a promise, so it can be awaited in multiple calls
        // for example a instanceError while stop is already running would cause another stop
        this.stopPromise = (async () => {
            if (!(0, utils_1.isNullOrUndefined)(this.mongodProcess) && (0, utils_1.isAlive)(this.mongodProcess.pid)) {
                // try to run "shutdown" before running "killProcess" (gracefull "SIGINT")
                // using this, otherwise on windows nodejs will handle "SIGINT" & "SIGTERM" & "SIGKILL" the same (instant exit)
                if (this.isReplSet) {
                    let con;
                    try {
                        this.debug('stop: trying shutdownServer');
                        const port = this.instanceOpts.port;
                        const ip = this.instanceOpts.ip;
                        (0, utils_1.assertion)(!(0, utils_1.isNullOrUndefined)(port), new Error('Cannot shutdown replset gracefully, no "port" is provided'));
                        (0, utils_1.assertion)(!(0, utils_1.isNullOrUndefined)(ip), new Error('Cannot shutdown replset gracefully, no "ip" is provided'));
                        con = await mongodb_1.MongoClient.connect((0, utils_1.uriTemplate)(ip, port, 'admin'), {
                            // stopping a instance should not take long to connect to, default would be 30 seconds
                            serverSelectionTimeoutMS: 5000, // 5 seconds
                            ...this.extraConnectionOptions,
                            directConnection: true,
                        });
                        const admin = con.db('admin'); // just to ensure it is actually the "admin" database
                        // "timeoutSecs" is set to "1" otherwise it will take at least "10" seconds to stop (very long tests)
                        await admin.command({ shutdown: 1, force: true, timeoutSecs: 1 });
                        this.debug('stop: after admin shutdown command');
                    }
                    catch (err) {
                        // Quote from MongoDB Documentation (https://docs.mongodb.com/manual/reference/command/replSetStepDown/#client-connections):
                        // > Starting in MongoDB 4.2, replSetStepDown command no longer closes all client connections.
                        // > In MongoDB 4.0 and earlier, replSetStepDown command closes all client connections during the step down.
                        // so error "MongoNetworkError: connection 1 to 127.0.0.1:41485 closed" will get thrown below 4.2
                        if (!(err instanceof mongodb_1.MongoNetworkError &&
                            /^connection \d+ to [\d.]+:\d+ closed$/i.test(err.message))) {
                            console.warn(err);
                        }
                    }
                    finally {
                        if (!(0, utils_1.isNullOrUndefined)(con)) {
                            // even if it errors out, somehow the connection stays open
                            await con.close();
                        }
                    }
                }
                await (0, utils_1.killProcess)(this.mongodProcess, 'mongodProcess', this.instanceOpts.port);
                this.mongodProcess = undefined; // reset reference to the childProcess for "mongod"
            }
            else {
                this.debug('stop: mongodProcess: nothing to shutdown, skipping');
            }
            if (!(0, utils_1.isNullOrUndefined)(this.killerProcess)) {
                await (0, utils_1.killProcess)(this.killerProcess, 'killerProcess', this.instanceOpts.port);
                this.killerProcess = undefined; // reset reference to the childProcess for "mongo_killer"
            }
            else {
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
    _launchMongod(mongoBin) {
        this.debug('_launchMongod: Launching Mongod Process');
        const childProcess = (0, child_process_1.spawn)(path.resolve(mongoBin), this.prepareCommandArgs(), {
            ...this.spawnOpts,
            stdio: 'pipe', // ensure that stdio is always an pipe, regardless of user input
        });
        childProcess.stderr?.on('data', this.stderrHandler.bind(this));
        childProcess.stdout?.on('data', this.stdoutHandler.bind(this));
        childProcess.on('close', this.closeHandler.bind(this));
        childProcess.on('error', this.errorHandler.bind(this));
        if ((0, utils_1.isNullOrUndefined)(childProcess.pid)) {
            throw new errors_1.StartBinaryFailedError(path.resolve(mongoBin));
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
    _launchKiller(parentPid, childPid) {
        this.debug(`_launchKiller: Launching Killer Process (parent: ${parentPid}, child: ${childPid})`);
        // spawn process which kills itself and mongo process if current process is dead
        const killer = (0, child_process_1.fork)(path.resolve(__dirname, '../../scripts/mongo_killer.js'), [parentPid.toString(), childPid.toString()], {
            execArgv: [],
            detached: true,
            stdio: 'ignore', // stdio cannot be done with an detached process cross-systems and without killing the fork on parent termination
        });
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
    errorHandler(err) {
        this.emit(MongoInstanceEvents.instanceRawError, err);
        this.emit(MongoInstanceEvents.instanceError, err);
    }
    /**
     * Write the CLOSE event to the debug function
     * @param code The Exit code to handle
     * @param signal The Signal to handle
     * @fires MongoInstance#instanceClosed
     */
    closeHandler(code, signal) {
        // check if the platform is windows, if yes check if the code is not "12" or "0" otherwise just check code is not "0"
        // because for mongodb any event on windows (like SIGINT / SIGTERM) will result in an code 12
        // https://docs.mongodb.com/manual/reference/exit-codes/#12
        if ((process.platform === 'win32' && code != 12 && code != 0) ||
            (process.platform !== 'win32' && code != 0)) {
            this.debug('closeHandler: Mongod instance closed with an non-0 (or non 12 on windows) code!');
            // Note: this also emits when a signal is present, which is expected because signals are not expected here
            this.emit(MongoInstanceEvents.instanceError, new errors_1.UnexpectedCloseError(code, signal));
        }
        this.debug(`closeHandler: code: "${code}", signal: "${signal}"`);
        this.emit(MongoInstanceEvents.instanceClosed, code, signal);
    }
    /**
     * Write STDERR to debug function
     * @param message The STDERR line to write
     * @fires MongoInstance#instanceSTDERR
     */
    stderrHandler(message) {
        const line = message.toString().trim();
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
    stdoutHandler(message) {
        const line = message.toString().trim(); // trimming to remove extra new lines and spaces around the message
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
    checkErrorInLine(line) {
        if (/address already in use/i.test(line)) {
            this.emit(MongoInstanceEvents.instanceError, new errors_1.StdoutInstanceError(`Port "${this.instanceOpts.port}" already in use`));
        }
        {
            const execptionMatch = /\bexception in initAndListen: (\w+): /i.exec(line);
            if (!(0, utils_1.isNullOrUndefined)(execptionMatch)) {
                // in pre-4.0 mongodb this exception may have been "permission denied" and "Data directory /path not found"
                this.emit(MongoInstanceEvents.instanceError, new errors_1.StdoutInstanceError(`Instance Failed to start with "${execptionMatch[1] ?? 'unknown'}". Original Error:\n` +
                    line.substring(execptionMatch.index + execptionMatch[0].length)));
            }
            // special handling for when mongodb outputs this error as json
            const execptionMatchJson = /\bDBException in initAndListen,/i.test(line);
            if (execptionMatchJson) {
                const loadedJSON = JSON.parse(line) ?? {};
                this.emit(MongoInstanceEvents.instanceError, new errors_1.StdoutInstanceError(`Instance Failed to start with "DBException in initAndListen". Original Error:\n` +
                    loadedJSON?.attr?.error ?? line // try to use the parsed json, but as fallback use the entire line
                ));
            }
        }
        if (/CURL_OPENSSL_3['\s]+not found/i.test(line)) {
            this.emit(MongoInstanceEvents.instanceError, new errors_1.StdoutInstanceError('libcurl3 is not available on your system. Mongod requires it and cannot be started without it.\n' +
                'You should manually install libcurl3 or try to use an newer version of MongoDB'));
        }
        if (/CURL_OPENSSL_4['\s]+not found/i.test(line)) {
            this.emit(MongoInstanceEvents.instanceError, new errors_1.StdoutInstanceError('libcurl4 is not available on your system. Mongod requires it and cannot be started without it.\n' +
                'You need to manually install libcurl4'));
        }
        {
            /*
            The following regex matches something like "libsomething.so.1: cannot open shared object"
            and is optimized to only start matching at a word boundary ("\b") and using atomic-group replacement "(?=inner)\1"
            */
            const liberrormatch = line.match(/\b(?=(lib[^:]+))\1: cannot open shared object/i);
            if (!(0, utils_1.isNullOrUndefined)(liberrormatch)) {
                const lib = liberrormatch[1].toLocaleLowerCase() ?? 'unknown';
                this.emit(MongoInstanceEvents.instanceError, new errors_1.StdoutInstanceError(`Instance failed to start because a library is missing or cannot be opened: "${lib}"`));
            }
        }
        if (/\*\*\*aborting after/i.test(line)) {
            const match = line.match(/\*\*\*aborting after ([^\n]+)/i);
            const extra = match?.[1] ? ` (${match[1]})` : '';
            this.emit(MongoInstanceEvents.instanceError, new errors_1.StdoutInstanceError('Mongod internal error' + extra));
        }
    }
    /// Symbol for "Explicit Resource Management"
    async [Symbol.asyncDispose]() {
        await this.stop();
    }
}
exports.MongoInstance = MongoInstance;
exports.default = MongoInstance;
//# sourceMappingURL=MongoInstance.js.map