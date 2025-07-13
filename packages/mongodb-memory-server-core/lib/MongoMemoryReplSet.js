"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoMemoryReplSet = exports.MongoMemoryReplSetEvents = exports.MongoMemoryReplSetStates = void 0;
const tslib_1 = require("tslib");
const events_1 = require("events");
const MongoMemoryServer_1 = require("./MongoMemoryServer");
const utils_1 = require("./util/utils");
const debug_1 = tslib_1.__importDefault(require("debug"));
const mongodb_1 = require("mongodb");
const MongoInstance_1 = require("./util/MongoInstance");
const errors_1 = require("./util/errors");
const fs_1 = require("fs");
const path_1 = require("path");
const semver = tslib_1.__importStar(require("semver"));
const DryMongoBinary_1 = require("./util/DryMongoBinary");
const log = (0, debug_1.default)('MongoMS:MongoMemoryReplSet');
/**
 * Enum for "_state" inside "MongoMemoryReplSet"
 */
var MongoMemoryReplSetStates;
(function (MongoMemoryReplSetStates) {
    MongoMemoryReplSetStates["init"] = "init";
    MongoMemoryReplSetStates["running"] = "running";
    MongoMemoryReplSetStates["stopped"] = "stopped";
})(MongoMemoryReplSetStates || (exports.MongoMemoryReplSetStates = MongoMemoryReplSetStates = {}));
/**
 * All Events for "MongoMemoryReplSet"
 */
var MongoMemoryReplSetEvents;
(function (MongoMemoryReplSetEvents) {
    MongoMemoryReplSetEvents["stateChange"] = "stateChange";
})(MongoMemoryReplSetEvents || (exports.MongoMemoryReplSetEvents = MongoMemoryReplSetEvents = {}));
/**
 * Class for managing an replSet
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class MongoMemoryReplSet extends events_1.EventEmitter {
    constructor(opts = {}) {
        super();
        /**
         * All servers this ReplSet instance manages
         */
        this.servers = [];
        this._state = MongoMemoryReplSetStates.stopped;
        this._ranCreateAuth = false;
        this.binaryOpts = { ...opts.binary };
        this.instanceOpts = opts.instanceOpts ?? [];
        this.replSetOpts = { ...opts.replSet };
    }
    /**
     * Change "this._state" to "newState" and emit "newState"
     * @param newState The new State to set & emit
     */
    stateChange(newState, ...args) {
        this._state = newState;
        this.emit(MongoMemoryReplSetEvents.stateChange, newState, ...args);
    }
    /**
     * Create an instance of "MongoMemoryReplSet" and call start
     * @param opts Options for the ReplSet
     */
    static async create(opts) {
        log('create: Called .create() method');
        const replSet = new this({ ...opts });
        await replSet.start();
        return replSet;
    }
    /**
     * Get Current state of this class
     */
    get state() {
        return this._state;
    }
    /**
     * Get & Set "instanceOpts"
     * @throws if "state" is not "stopped"
     */
    get instanceOpts() {
        return this._instanceOpts;
    }
    set instanceOpts(val) {
        assertionIsMMSRSState(MongoMemoryReplSetStates.stopped, this._state);
        this._instanceOpts = val;
    }
    /**
     * Get & Set "binaryOpts"
     * @throws if "state" is not "stopped"
     */
    get binaryOpts() {
        return this._binaryOpts;
    }
    set binaryOpts(val) {
        assertionIsMMSRSState(MongoMemoryReplSetStates.stopped, this._state);
        this._binaryOpts = val;
    }
    /**
     * Get & Set "replSetOpts"
     * (Applies defaults)
     * @throws if "state" is not "stopped"
     */
    get replSetOpts() {
        return this._replSetOpts;
    }
    set replSetOpts(val) {
        assertionIsMMSRSState(MongoMemoryReplSetStates.stopped, this._state);
        // the following needs to be done because we set the default "storageEngine" here
        // which means the default is seen as set "explicitly" by the instance and would warn
        // in binary versions >=7.0.0
        const opts = DryMongoBinary_1.DryMongoBinary.getEnsuredOptions(this.binaryOpts);
        // try to convert a string to a valid semver, like "v6.0-latest" (compiles to "6.0.0")
        // use "0.0.0" as a fallback to have a valid semver for later checks, but warn on invalid
        const coercedVersion = semver.coerce(opts.version) ?? new semver.SemVer('0.0.0');
        const storageEngine = (0, utils_1.getStorageEngine)(val.storageEngine, coercedVersion);
        const defaults = {
            auth: { enable: false },
            args: [],
            name: 'testset',
            count: 1,
            dbName: (0, utils_1.generateDbName)(),
            ip: '127.0.0.1',
            spawn: {},
            storageEngine,
            configSettings: {},
            dispose: {},
        };
        // force overwrite "storageEngine" because it is transformed already
        this._replSetOpts = { ...defaults, ...val, storageEngine };
        (0, utils_1.assertion)(this._replSetOpts.count > 0, new errors_1.ReplsetCountLowError(this._replSetOpts.count));
        // only set default is enabled
        if (this._replSetOpts.auth.enable) {
            this._replSetOpts.auth = (0, utils_1.authDefault)(this._replSetOpts.auth);
        }
    }
    /**
     * Helper function to determine if "auth" should be enabled
     * This function expectes to be run after the auth object has been transformed to a object
     * @returns "true" when "auth" should be enabled
     */
    enableAuth() {
        if ((0, utils_1.isNullOrUndefined)(this._replSetOpts.auth)) {
            return false;
        }
        (0, utils_1.assertion)(typeof this._replSetOpts.auth === 'object', new errors_1.AuthNotObjectError());
        return typeof this._replSetOpts.auth.enable === 'boolean' // if "this._replSetOpts.auth.enable" is defined, use that
            ? this._replSetOpts.auth.enable
            : false; // if "this._replSetOpts.auth.enable" is not defined, default to false
    }
    /**
     * Returns instance options suitable for a MongoMemoryServer.
     * @param baseOpts Options to merge with
     * @param keyfileLocation The Keyfile location if "auth" is used
     */
    getInstanceOpts(baseOpts = {}, keyfileLocation) {
        const enableAuth = this.enableAuth();
        const opts = {
            auth: enableAuth,
            args: this._replSetOpts.args,
            dbName: this._replSetOpts.dbName,
            ip: this._replSetOpts.ip,
            replSet: this._replSetOpts.name,
            storageEngine: this._replSetOpts.storageEngine,
        };
        if (!(0, utils_1.isNullOrUndefined)(keyfileLocation)) {
            opts.keyfileLocation = keyfileLocation;
        }
        if (baseOpts.args) {
            opts.args = this._replSetOpts.args.concat(baseOpts.args);
        }
        if (baseOpts.port) {
            opts.port = baseOpts.port;
        }
        if (baseOpts.dbPath) {
            opts.dbPath = baseOpts.dbPath;
        }
        if (baseOpts.storageEngine) {
            opts.storageEngine = baseOpts.storageEngine;
        }
        if (baseOpts.replicaMemberConfig) {
            opts.replicaMemberConfig = baseOpts.replicaMemberConfig;
        }
        if (baseOpts.launchTimeout) {
            opts.launchTimeout = baseOpts.launchTimeout;
        }
        log('getInstanceOpts: instance opts:', opts);
        return opts;
    }
    /**
     * Returns an mongodb URI that is setup with all replSet servers
     * @param otherDb add an database into the uri (in mongodb its the auth database, in mongoose its the default database for models)
     * @param otherIp change the ip in the generated uri, default will otherwise always be "127.0.0.1"
     * @throws if state is not "running"
     * @throws if an server doesnt have "instanceInfo.port" defined
     * @returns an valid mongo URI, by the definition of https://docs.mongodb.com/manual/reference/connection-string/
     */
    getUri(otherDb, otherIp) {
        log('getUri:', this.state);
        switch (this.state) {
            case MongoMemoryReplSetStates.running:
            case MongoMemoryReplSetStates.init:
                break;
            case MongoMemoryReplSetStates.stopped:
            default:
                throw new errors_1.StateError([MongoMemoryReplSetStates.running, MongoMemoryReplSetStates.init], this.state);
        }
        const hosts = this.servers
            .map((s) => {
            const port = s.instanceInfo?.port;
            (0, utils_1.assertion)(!(0, utils_1.isNullOrUndefined)(port), new Error('Instance Port is undefined!'));
            const ip = otherIp || '127.0.0.1';
            return `${ip}:${port}`;
        })
            .join(',');
        return (0, utils_1.uriTemplate)(hosts, undefined, (0, utils_1.generateDbName)(otherDb), [
            `replicaSet=${this._replSetOpts.name}`,
        ]);
    }
    /**
     * Start underlying `mongod` instances.
     * @throws if state is already "running"
     */
    async start() {
        log('start:', this.state);
        switch (this.state) {
            case MongoMemoryReplSetStates.stopped:
                break;
            case MongoMemoryReplSetStates.running:
            default:
                throw new errors_1.StateError([MongoMemoryReplSetStates.stopped], this.state);
        }
        this.stateChange(MongoMemoryReplSetStates.init); // this needs to be executed before "setImmediate"
        await (0, utils_1.ensureAsync)()
            .then(() => this.initAllServers())
            .then(() => this._initReplSet())
            .catch(async (err) => {
            if (!debug_1.default.enabled('MongoMS:MongoMemoryReplSet')) {
                console.warn('Starting the MongoMemoryReplSet Instance failed, enable debug log for more information. Error:\n', err);
            }
            log('ensureAsync chain threw a Error: ', err);
            await this.stop({ doCleanup: false, force: false }); // still try to close the instance that was spawned, without cleanup for investigation
            this.stateChange(MongoMemoryReplSetStates.stopped);
            throw err;
        });
    }
    /**
     * Initialize & start all servers in the replSet
     */
    async initAllServers() {
        log('initAllServers');
        this.stateChange(MongoMemoryReplSetStates.init);
        if (this.servers.length > 0) {
            log('initAllServers: lenght of "servers" is higher than 0, starting existing servers');
            if (this._ranCreateAuth) {
                log('initAllServers: "_ranCreateAuth" is true, re-using auth');
                const keyfilepath = (0, path_1.resolve)(await this.ensureKeyFile(), 'keyfile');
                for (const server of this.servers) {
                    (0, utils_1.assertion)(!(0, utils_1.isNullOrUndefined)(server.instanceInfo), new errors_1.InstanceInfoError('MongoMemoryReplSet.initAllServers'));
                    (0, utils_1.assertion)(typeof this._replSetOpts.auth === 'object', new errors_1.AuthNotObjectError());
                    server.instanceInfo.instance.instanceOpts.auth = true;
                    server.instanceInfo.instance.instanceOpts.keyfileLocation = keyfilepath;
                    server.instanceInfo.instance.extraConnectionOptions = {
                        authSource: 'admin',
                        authMechanism: 'SCRAM-SHA-256',
                        auth: {
                            username: this._replSetOpts.auth.customRootName, // cast because these are existing
                            password: this._replSetOpts.auth.customRootPwd,
                        },
                    };
                }
            }
            await Promise.all(this.servers.map((s) => s.start(true)));
            log('initAllServers: finished starting existing instances again');
            return;
        }
        let keyfilePath = undefined;
        if (this.enableAuth()) {
            keyfilePath = (0, path_1.resolve)(await this.ensureKeyFile(), 'keyfile');
        }
        // Any servers defined within `_instanceOpts` should be started first as
        // the user could have specified a `dbPath` in which case we would want to perform
        // the `replSetInitiate` command against that server.
        this._instanceOpts.forEach((opts, index) => {
            log(`initAllServers: starting special server "${index + 1}" of "${this._instanceOpts.length}" from instanceOpts (count: ${this.servers.length + 1}):`, opts);
            this.servers.push(this._initServer(this.getInstanceOpts(opts, keyfilePath)));
        });
        while (this.servers.length < this._replSetOpts.count) {
            log(`initAllServers: starting extra server "${this.servers.length + 1}" of "${this._replSetOpts.count}" (count: ${this.servers.length + 1})`);
            this.servers.push(this._initServer(this.getInstanceOpts(undefined, keyfilePath)));
        }
        log('initAllServers: waiting for all servers to finish starting');
        // ensures all servers are listening for connection
        await Promise.all(this.servers.map((s) => s.start()));
        log('initAllServers: finished starting all servers initially');
    }
    /**
     * Ensure "_keyfiletmp" is defined
     * @returns the ensured "_keyfiletmp" value
     */
    async ensureKeyFile() {
        log('ensureKeyFile');
        if ((0, utils_1.isNullOrUndefined)(this._keyfiletmp)) {
            this._keyfiletmp = await (0, utils_1.createTmpDir)('mongo-mem-keyfile-');
        }
        const keyfilepath = (0, path_1.resolve)(this._keyfiletmp, 'keyfile');
        // if path does not exist or have no access, create it (or fail)
        if (!(await (0, utils_1.statPath)(keyfilepath))) {
            log('ensureKeyFile: creating Keyfile');
            (0, utils_1.assertion)(typeof this._replSetOpts.auth === 'object', new errors_1.AuthNotObjectError());
            await fs_1.promises.writeFile((0, path_1.resolve)(this._keyfiletmp, 'keyfile'), this._replSetOpts.auth.keyfileContent ?? '0123456789', { mode: 0o700 } // this is because otherwise mongodb errors with "permissions are too open" on unix systems
            );
        }
        return this._keyfiletmp;
    }
    /**
     * Stop the underlying `mongod` instance(s).
     * @param cleanupOptions Set how to run ".cleanup", by default only `{ doCleanup: true }` is used
     */
    async stop(cleanupOptions) {
        log(`stop: called by ${(0, utils_1.isNullOrUndefined)(process.exitCode) ? 'manual' : 'process exit'}`);
        /** Default to cleanup temporary, but not custom dbpaths */
        let cleanup = { doCleanup: true, force: false };
        // handle the new way of setting what and how to cleanup
        if (typeof cleanupOptions === 'object') {
            cleanup = cleanupOptions;
        }
        if (this._state === MongoMemoryReplSetStates.stopped) {
            log('stop: state is "stopped", trying to stop / kill anyway');
        }
        const successfullyStopped = await Promise.all(this.servers.map((s) => s.stop({ doCleanup: false, force: false })))
            .then(() => {
            this.stateChange(MongoMemoryReplSetStates.stopped);
            return true;
        })
            .catch((err) => {
            log('stop:', err);
            this.stateChange(MongoMemoryReplSetStates.stopped, err);
            return false;
        });
        // return early if the instances failed to stop
        if (!successfullyStopped) {
            return false;
        }
        if (cleanup.doCleanup) {
            await this.cleanup(cleanup);
        }
        return true;
    }
    /**
     * Remove the defined dbPath's
     * @param options Set how to run a cleanup, by default `{ doCleanup: true }` is used
     * @throws If "state" is not "stopped"
     * @throws If "instanceInfo" is not defined
     * @throws If an fs error occured
     */
    async cleanup(options) {
        assertionIsMMSRSState(MongoMemoryReplSetStates.stopped, this._state);
        log(`cleanup for "${this.servers.length}" servers`);
        /** Default to doing cleanup, but not forcing it */
        let cleanup = { doCleanup: true, force: false };
        // handle the new way of setting what and how to cleanup
        if (typeof options === 'object') {
            cleanup = options;
        }
        log(`cleanup:`, cleanup);
        // dont do cleanup, if "doCleanup" is false
        if (!cleanup.doCleanup) {
            log('cleanup: "doCleanup" is set to false');
            return;
        }
        await Promise.all(this.servers.map((s) => s.cleanup(cleanup)));
        // cleanup the keyfile tmpdir
        if (!(0, utils_1.isNullOrUndefined)(this._keyfiletmp)) {
            await (0, utils_1.removeDir)(this._keyfiletmp);
            this._keyfiletmp = undefined;
        }
        this.servers = [];
        this._ranCreateAuth = false;
        return;
    }
    /**
     * Wait until all instances are running
     * @throws if state is "stopped" (cannot wait on something that dosnt start)
     */
    async waitUntilRunning() {
        await (0, utils_1.ensureAsync)();
        log('waitUntilRunning:', this._state);
        switch (this._state) {
            case MongoMemoryReplSetStates.running:
                // just return immediatly if the replSet is already running
                return;
            case MongoMemoryReplSetStates.init:
                // wait for event "running"
                await new Promise((res) => {
                    // the use of "this" here can be done because "on" either binds "this" or uses an arrow function
                    function waitRunning(state) {
                        // this is because other states can be emitted multiple times (like stopped & init for auth creation)
                        if (state === MongoMemoryReplSetStates.running) {
                            this.removeListener(MongoMemoryReplSetEvents.stateChange, waitRunning);
                            res();
                        }
                    }
                    this.on(MongoMemoryReplSetEvents.stateChange, waitRunning);
                });
                return;
            case MongoMemoryReplSetStates.stopped:
            default:
                throw new errors_1.StateError([MongoMemoryReplSetStates.running, MongoMemoryReplSetStates.init], this.state);
        }
    }
    /**
     * Connects to the first server from the list of servers and issues the `replSetInitiate`
     * command passing in a new replica set configuration object.
     * @throws if state is not "init"
     * @throws if "servers.length" is not 1 or above
     * @throws if package "mongodb" is not installed
     */
    async _initReplSet() {
        log('_initReplSet');
        assertionIsMMSRSState(MongoMemoryReplSetStates.init, this._state);
        (0, utils_1.assertion)(this.servers.length > 0, new Error('One or more servers are required.'));
        const uris = this.servers.map((server) => server.getUri());
        const isInMemory = this.servers[0].instanceInfo?.storageEngine === 'ephemeralForTest';
        const extraOptions = this._ranCreateAuth
            ? (this.servers[0].instanceInfo?.instance.extraConnectionOptions ?? {})
            : {};
        const con = await mongodb_1.MongoClient.connect(uris[0], {
            // somehow since mongodb-nodejs 4.0, this option is needed when the server is set to be in a replset
            directConnection: true,
            ...extraOptions,
        });
        log('_initReplSet: connected');
        // try-finally to close connection in any case
        try {
            const adminDb = con.db('admin');
            const members = uris.map((uri, index) => ({
                _id: index,
                host: (0, utils_1.getHost)(uri),
                ...(this.servers[index].opts.instance?.replicaMemberConfig || {}), // Overwrite replica member config
            }));
            const rsConfig = {
                _id: this._replSetOpts.name,
                members,
                writeConcernMajorityJournalDefault: !isInMemory, // if storage engine is "ephemeralForTest" deactivate this option, otherwise enable it
                settings: {
                    electionTimeoutMillis: 500,
                    ...this._replSetOpts.configSettings,
                },
            };
            // try-catch because the first "command" can fail
            try {
                log('_initReplSet: trying "replSetInitiate"');
                await adminDb.command({ replSetInitiate: rsConfig });
                if (this.enableAuth()) {
                    log('_initReplSet: "enableAuth" returned "true"');
                    await this._waitForPrimary(undefined, '_initReplSet authIsObject');
                    // find the primary instance to run createAuth on
                    const primary = this.servers.find((server) => server.instanceInfo?.instance.isInstancePrimary);
                    (0, utils_1.assertion)(!(0, utils_1.isNullOrUndefined)(primary), new Error('No Primary found'));
                    // this should be defined at this point, but is checked anyway (thanks to types)
                    (0, utils_1.assertion)(!(0, utils_1.isNullOrUndefined)(primary.instanceInfo), new errors_1.InstanceInfoError('_initReplSet authIsObject primary'));
                    await con.close(); // just ensuring that no timeouts happen or conflicts happen
                    await primary.createAuth(primary.instanceInfo);
                    this._ranCreateAuth = true;
                }
            }
            catch (err) {
                if (err instanceof mongodb_1.MongoError && err.errmsg == 'already initialized') {
                    log(`_initReplSet: "${err.errmsg}": trying to set old config`);
                    const { config: oldConfig } = await adminDb.command({ replSetGetConfig: 1 });
                    log('_initReplSet: got old config:\n', oldConfig);
                    await adminDb.command({
                        replSetReconfig: oldConfig,
                        force: true,
                    });
                }
                else {
                    throw err;
                }
            }
            log('_initReplSet: ReplSet-reconfig finished');
            await this._waitForPrimary(undefined, '_initReplSet beforeRunning');
            this.stateChange(MongoMemoryReplSetStates.running);
            log('_initReplSet: running');
        }
        finally {
            log('_initReplSet: finally closing connection');
            await con.close();
        }
    }
    /**
     * Create the one Instance (without starting them)
     * @param instanceOpts Instance Options to use for this instance
     */
    _initServer(instanceOpts) {
        const serverOpts = {
            binary: this._binaryOpts,
            instance: instanceOpts,
            spawn: this._replSetOpts.spawn,
            auth: typeof this.replSetOpts.auth === 'object' ? this.replSetOpts.auth : undefined,
        };
        const server = new MongoMemoryServer_1.MongoMemoryServer(serverOpts);
        return server;
    }
    /**
     * Wait until the replSet has elected a Primary
     * @param timeout Timeout to not run infinitly, default: 30s
     * @param where Extra Parameter for logging to know where this function was called
     * @throws if timeout is reached
     */
    async _waitForPrimary(timeout = 1000 * 30, where) {
        log('_waitForPrimary: Waiting for a Primary');
        let timeoutId;
        // "race" because not all servers will be a primary
        await Promise.race([
            ...this.servers.map((server) => new Promise((res, rej) => {
                const instanceInfo = server.instanceInfo;
                // this should be defined at this point, but is checked anyway (thanks to types)
                if ((0, utils_1.isNullOrUndefined)(instanceInfo)) {
                    return rej(new errors_1.InstanceInfoError('_waitForPrimary Primary race'));
                }
                instanceInfo.instance.once(MongoInstance_1.MongoInstanceEvents.instancePrimary, res);
                if (instanceInfo.instance.isInstancePrimary) {
                    log('_waitForPrimary: found instance being already primary');
                    res();
                }
            })),
            new Promise((_res, rej) => {
                timeoutId = setTimeout(() => {
                    Promise.all([...this.servers.map((v) => v.stop())]); // this is not chained with "rej", this is here just so things like jest can exit at some point
                    rej(new errors_1.WaitForPrimaryTimeoutError(timeout, where));
                }, timeout);
            }),
        ]);
        if (!(0, utils_1.isNullOrUndefined)(timeoutId)) {
            clearTimeout(timeoutId);
        }
        log('_waitForPrimary: detected one primary instance ');
    }
    // Symbol for "Explicit Resource Management"
    async [Symbol.asyncDispose]() {
        if (this.replSetOpts.dispose?.enabled ?? true) {
            await this.stop(this.replSetOpts.dispose?.cleanup);
        }
    }
}
exports.MongoMemoryReplSet = MongoMemoryReplSet;
exports.default = MongoMemoryReplSet;
/**
 * Helper function to de-duplicate state checking for "MongoMemoryReplSetStates"
 * @param wantedState The State that is wanted
 * @param currentState The current State ("this._state")
 */
function assertionIsMMSRSState(wantedState, currentState) {
    (0, utils_1.assertion)(currentState === wantedState, new errors_1.StateError([wantedState], currentState));
}
//# sourceMappingURL=MongoMemoryReplSet.js.map