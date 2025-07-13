"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoMemoryServer = exports.MongoMemoryServerStates = exports.MongoMemoryServerEvents = void 0;
const tslib_1 = require("tslib");
const getport_1 = require("./util/getport");
const utils_1 = require("./util/utils");
const MongoInstance_1 = require("./util/MongoInstance");
const debug_1 = tslib_1.__importDefault(require("debug"));
const events_1 = require("events");
const fs_1 = require("fs");
const mongodb_1 = require("mongodb");
const errors_1 = require("./util/errors");
const os = tslib_1.__importStar(require("os"));
const DryMongoBinary_1 = require("./util/DryMongoBinary");
const semver = tslib_1.__importStar(require("semver"));
const log = (0, debug_1.default)('MongoMS:MongoMemoryServer');
/**
 * All Events for "MongoMemoryServer"
 */
var MongoMemoryServerEvents;
(function (MongoMemoryServerEvents) {
    MongoMemoryServerEvents["stateChange"] = "stateChange";
})(MongoMemoryServerEvents || (exports.MongoMemoryServerEvents = MongoMemoryServerEvents = {}));
/**
 * All States for "MongoMemoryServer._state"
 */
var MongoMemoryServerStates;
(function (MongoMemoryServerStates) {
    MongoMemoryServerStates["new"] = "new";
    MongoMemoryServerStates["starting"] = "starting";
    MongoMemoryServerStates["running"] = "running";
    MongoMemoryServerStates["stopped"] = "stopped";
})(MongoMemoryServerStates || (exports.MongoMemoryServerStates = MongoMemoryServerStates = {}));
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class MongoMemoryServer extends events_1.EventEmitter {
    /**
     * Create a Mongo-Memory-Sever Instance
     * @param opts Mongo-Memory-Sever Options
     */
    constructor(opts) {
        super();
        /**
         * The Current State of this instance
         */
        this._state = MongoMemoryServerStates.new;
        this.opts = { ...opts };
        // instance option "auth" will be automatically set and handled via AutomaticAuth
        if ('auth' in (this.opts.instance ?? {})) {
            log('opts.instance.auth was defined, but will be set automatically, ignoring');
            delete this.opts.instance?.auth;
        }
        if (this.opts.auth?.enable === true) {
            // assign defaults
            this.auth = (0, utils_1.authDefault)(this.opts.auth);
        }
    }
    /**
     * Create a Mongo-Memory-Sever Instance that can be awaited
     * @param opts Mongo-Memory-Sever Options
     */
    static async create(opts) {
        log('create: Called .create() method');
        const instance = new MongoMemoryServer({ ...opts });
        await instance.start();
        return instance;
    }
    /**
     * Start the Mongod Instance
     * @param forceSamePort Force to use the port defined in `options.instance` (disabled port generation)
     * @throws if state is not "new" or "stopped"
     */
    async start(forceSamePort) {
        this.debug('start: Called .start() method');
        switch (this._state) {
            case MongoMemoryServerStates.new:
            case MongoMemoryServerStates.stopped:
                break;
            case MongoMemoryServerStates.running:
            case MongoMemoryServerStates.starting:
            default:
                throw new errors_1.StateError([MongoMemoryServerStates.new, MongoMemoryServerStates.stopped], this.state);
        }
        (0, utils_1.assertion)((0, utils_1.isNullOrUndefined)(this._instanceInfo?.instance.mongodProcess), new Error('Cannot start because "instance.mongodProcess" is already defined!'));
        this.stateChange(MongoMemoryServerStates.starting);
        await this._startUpInstance(forceSamePort).catch(async (err) => {
            // add error information on macos-arm because "spawn Unknown system error -86" does not say much
            if (err instanceof Error && err.message?.includes('spawn Unknown system error -86')) {
                if (os.platform() === 'darwin' && os.arch() === 'arm64') {
                    err.message += err.message += ', Is Rosetta Installed and Setup correctly?';
                }
            }
            if (!debug_1.default.enabled('MongoMS:MongoMemoryServer')) {
                console.warn('Starting the MongoMemoryServer Instance failed, enable debug log for more information. Error:\n', err);
            }
            this.debug('_startUpInstance threw a Error: ', err);
            await this.stop({ doCleanup: false, force: false }); // still try to close the instance that was spawned, without cleanup for investigation
            this.stateChange(MongoMemoryServerStates.stopped);
            throw err;
        });
        this.stateChange(MongoMemoryServerStates.running);
        this.debug('start: Instance fully Started');
    }
    /**
     * Change "this._state" to "newState" and emit "stateChange" with "newState"
     * @param newState The new State to set & emit
     */
    stateChange(newState) {
        this._state = newState;
        this.emit(MongoMemoryServerEvents.stateChange, newState);
    }
    /**
     * Debug-log with template applied
     * @param msg The Message to log
     */
    debug(msg, ...extra) {
        const port = this._instanceInfo?.port ?? 'unknown';
        log(`Mongo[${port}]: ${msg}`, ...extra);
    }
    /**
     * Find a new unlocked port
     * @param port A User defined default port
     */
    async getNewPort(port) {
        const newPort = await (0, getport_1.getFreePort)(port);
        // only log this message if a custom port was provided
        if (port != newPort && typeof port === 'number') {
            this.debug(`getNewPort: starting with port "${newPort}", since "${port}" was locked`);
        }
        return newPort;
    }
    /**
     * Construct Instance Starting Options
     * @param forceSamePort Force to use the port defined in `options.instance` (disabled port generation)
     */
    async getStartOptions(forceSamePort = false) {
        this.debug(`getStartOptions: forceSamePort: ${forceSamePort}`);
        /** Shortcut to this.opts.instance */
        const instOpts = this.opts.instance ?? {};
        /**
         * This variable is used for determining if "createAuth" should be run
         */
        let isNew = true;
        const opts = await DryMongoBinary_1.DryMongoBinary.generateOptions(this.opts.binary);
        let storageEngine = instOpts.storageEngine;
        // try to convert a string to a valid semver, like "v6.0-latest" (compiles to "6.0.0")
        // use "0.0.0" as a fallback to have a valid semver for later checks, but warn on invalid
        const coercedVersion = semver.coerce(opts.version) ?? new semver.SemVer('0.0.0');
        // warn on invalid version here, a invalid version will be thrown in MongoBinaryDownloadUrl if downloading
        if (semver.eq(coercedVersion, '0.0.0')) {
            console.warn(new errors_1.UnknownVersionError(opts.version));
        }
        storageEngine = (0, utils_1.getStorageEngine)(storageEngine, coercedVersion);
        // use pre-defined port if available, otherwise generate a new port
        let port = typeof instOpts.port === 'number' ? instOpts.port : undefined;
        // if "forceSamePort" is not true, and get a available port
        if (!forceSamePort || (0, utils_1.isNullOrUndefined)(port)) {
            port = await this.getNewPort(port);
        }
        // consider directly using "this.opts.instance", to pass through all options, even if not defined in "StartupInstanceData"
        const data = {
            port: port,
            dbName: (0, utils_1.generateDbName)(instOpts.dbName),
            ip: instOpts.ip ?? '127.0.0.1',
            storageEngine: storageEngine,
            replSet: instOpts.replSet,
            dbPath: instOpts.dbPath,
            tmpDir: undefined,
            keyfileLocation: instOpts.keyfileLocation,
            launchTimeout: instOpts.launchTimeout,
        };
        if ((0, utils_1.isNullOrUndefined)(this._instanceInfo)) {
            // create a tmpDir instance if no "dbPath" is given
            if (!data.dbPath) {
                data.tmpDir = await (0, utils_1.createTmpDir)('mongo-mem-');
                data.dbPath = data.tmpDir;
                isNew = true; // just to ensure "isNew" is "true" because a new temporary directory got created
            }
            else {
                this.debug(`getStartOptions: Checking if "${data.dbPath}}" (no new tmpDir) already has data`);
                const files = await fs_1.promises.readdir(data.dbPath);
                isNew = files.length === 0; // if there are no files in the directory, assume that the database is new
            }
        }
        else {
            isNew = false;
        }
        const enableAuth = this.authObjectEnable();
        const createAuth = enableAuth && // re-use all the checks from "enableAuth"
            !(0, utils_1.isNullOrUndefined)(this.auth) && // needs to be re-checked because typescript complains
            (this.auth.force || isNew) && // check that either "isNew" or "this.auth.force" is "true"
            !instOpts.replSet; // dont run "createAuth" when its a replset, it will be run by the replset controller
        return {
            data: data,
            createAuth: createAuth,
            mongodOptions: {
                instance: {
                    ...data,
                    args: instOpts.args,
                    auth: enableAuth,
                },
                binary: this.opts.binary,
                spawn: this.opts.spawn,
            },
        };
    }
    /**
     * Internal Function to start an instance
     * @param forceSamePort Force to use the port defined in `options.instance` (disabled port generation)
     * @private
     */
    async _startUpInstance(forceSamePort) {
        this.debug('_startUpInstance: Called MongoMemoryServer._startUpInstance() method');
        const useSamePort = forceSamePort ?? !(this.opts.instance?.portGeneration ?? true);
        if (!(0, utils_1.isNullOrUndefined)(this._instanceInfo)) {
            this.debug('_startUpInstance: "instanceInfo" already defined, reusing instance');
            if (!useSamePort) {
                const newPort = await this.getNewPort(this._instanceInfo.port);
                this._instanceInfo.instance.instanceOpts.port = newPort;
                this._instanceInfo.port = newPort;
            }
            await this._instanceInfo.instance.start();
            return;
        }
        const { mongodOptions, createAuth, data } = await this.getStartOptions(useSamePort);
        this.debug(`_startUpInstance: Creating new MongoDB instance with options:`, mongodOptions);
        const instance = await MongoInstance_1.MongoInstance.create(mongodOptions);
        this._instanceInfo = {
            ...data,
            dbPath: data.dbPath, // because otherwise the types would be incompatible
            instance,
        };
        // log after "_instanceInfo" is set so that the port shows up in the message
        this.debug(`_startUpInstance: Instance Started, createAuth: "${createAuth}"`);
        // always set the "extraConnectionOptions" when "auth" is enabled, regardless of if "createAuth" gets run
        if (this.authObjectEnable() &&
            mongodOptions.instance?.auth === true &&
            !(0, utils_1.isNullOrUndefined)(this.auth) // extra check again for typescript, because it cant reuse checks from "enableAuth" yet
        ) {
            instance.extraConnectionOptions = {
                authSource: 'admin',
                authMechanism: 'SCRAM-SHA-256',
                auth: {
                    username: this.auth.customRootName,
                    password: this.auth.customRootPwd,
                },
            };
        }
        // "isNullOrUndefined" because otherwise typescript complains about "this.auth" possibly being not defined
        if (!(0, utils_1.isNullOrUndefined)(this.auth) && createAuth) {
            this.debug(`_startUpInstance: Running "createAuth" (force: "${this.auth.force}")`);
            await this.createAuth(data);
        }
    }
    /**
     * Stop the current In-Memory Instance
     * @param cleanupOptions Set how to run ".cleanup", by default only `{ doCleanup: true }` is used
     */
    async stop(cleanupOptions) {
        this.debug('stop: Called .stop() method');
        /** Default to cleanup temporary, but not custom dbpaths */
        let cleanup = { doCleanup: true, force: false };
        // handle the new way of setting what and how to cleanup
        if (typeof cleanupOptions === 'object') {
            cleanup = cleanupOptions;
        }
        // just return "true" if there was never an instance
        if ((0, utils_1.isNullOrUndefined)(this._instanceInfo)) {
            this.debug('stop: "instanceInfo" is not defined (never ran?)');
            return false;
        }
        if (this._state === MongoMemoryServerStates.stopped) {
            this.debug('stop: state is "stopped", trying to stop / kill anyway');
        }
        this.debug(`stop: Stopping MongoDB server on port ${this._instanceInfo.port} with pid ${this._instanceInfo.instance?.mongodProcess?.pid}` // "undefined" would say more than ""
        );
        await this._instanceInfo.instance.stop();
        this.stateChange(MongoMemoryServerStates.stopped);
        if (cleanup.doCleanup) {
            await this.cleanup(cleanup);
        }
        return true;
    }
    /**
     * Remove the defined dbPath
     * @param options Set how to run a cleanup, by default `{ doCleanup: true }` is used
     * @throws If "state" is not "stopped"
     * @throws If "instanceInfo" is not defined
     * @throws If an fs error occured
     */
    async cleanup(options) {
        assertionIsMMSState(MongoMemoryServerStates.stopped, this.state);
        /** Default to doing cleanup, but not forcing it */
        let cleanup = { doCleanup: true, force: false };
        // handle the new way of setting what and how to cleanup
        if (typeof options === 'object') {
            cleanup = options;
        }
        this.debug(`cleanup:`, cleanup);
        // dont do cleanup, if "doCleanup" is false
        if (!cleanup.doCleanup) {
            this.debug('cleanup: "doCleanup" is set to false');
            return;
        }
        if ((0, utils_1.isNullOrUndefined)(this._instanceInfo)) {
            this.debug('cleanup: "instanceInfo" is undefined');
            return;
        }
        (0, utils_1.assertion)((0, utils_1.isNullOrUndefined)(this._instanceInfo.instance.mongodProcess), new Error('Cannot cleanup because "instance.mongodProcess" is still defined'));
        const tmpDir = this._instanceInfo.tmpDir;
        if (!(0, utils_1.isNullOrUndefined)(tmpDir)) {
            this.debug(`cleanup: removing tmpDir at ${tmpDir}`);
            await (0, utils_1.removeDir)(tmpDir);
        }
        if (cleanup.force) {
            const dbPath = this._instanceInfo.dbPath;
            const res = await (0, utils_1.statPath)(dbPath);
            if ((0, utils_1.isNullOrUndefined)(res)) {
                this.debug(`cleanup: force is true, but path "${dbPath}" dosnt exist anymore`);
            }
            else {
                (0, utils_1.assertion)(res.isDirectory(), new Error('Defined dbPath is not a directory'));
                await (0, utils_1.removeDir)(dbPath);
            }
        }
        this.stateChange(MongoMemoryServerStates.new); // reset "state" to new, because the dbPath got removed
        this._instanceInfo = undefined;
    }
    /**
     * Get Information about the currently running instance, if it is not running it returns "undefined"
     */
    get instanceInfo() {
        return this._instanceInfo;
    }
    /**
     * Get Current state of this class
     */
    get state() {
        return this._state;
    }
    /**
     * Ensure that the instance is running
     * -> throws if instance cannot be started
     */
    async ensureInstance() {
        this.debug('ensureInstance: Called .ensureInstance() method');
        switch (this._state) {
            case MongoMemoryServerStates.running:
                if (this._instanceInfo) {
                    return this._instanceInfo;
                }
                throw new errors_1.InstanceInfoError('MongoMemoryServer.ensureInstance (state: running)');
            case MongoMemoryServerStates.new:
            case MongoMemoryServerStates.stopped:
                break;
            case MongoMemoryServerStates.starting:
                return new Promise((res, rej) => this.once(MongoMemoryServerEvents.stateChange, (state) => {
                    if (state != MongoMemoryServerStates.running) {
                        rej(new Error(`"ensureInstance" waited for "running" but got a different state: "${state}"`));
                        return;
                    }
                    // this assertion is mainly for types (typescript otherwise would complain that "_instanceInfo" might be "undefined")
                    (0, utils_1.assertion)(!(0, utils_1.isNullOrUndefined)(this._instanceInfo), new Error('InstanceInfo is undefined!'));
                    res(this._instanceInfo);
                }));
            default:
                throw new errors_1.StateError([
                    MongoMemoryServerStates.running,
                    MongoMemoryServerStates.new,
                    MongoMemoryServerStates.stopped,
                    MongoMemoryServerStates.starting,
                ], this.state);
        }
        this.debug('ensureInstance: no running instance, calling "start()" command');
        await this.start();
        this.debug('ensureInstance: "start()" command was succesfully resolved');
        // check again for 1. Typescript-type reasons and 2. if .start failed to throw an error
        (0, utils_1.assertion)(!!this._instanceInfo, new errors_1.InstanceInfoError('MongoMemoryServer.ensureInstance (after starting)'));
        return this._instanceInfo;
    }
    /**
     * Generate the Connection string used by mongodb
     * @param otherDb add a database into the uri (in mongodb its the auth database, in mongoose its the default database for models)
     * @param otherIp change the ip in the generated uri, default will otherwise always be "127.0.0.1"
     * @throws if state is not "running" (or "starting")
     * @throws if a server doesnt have "instanceInfo.port" defined
     * @returns a valid mongo URI, by the definition of https://docs.mongodb.com/manual/reference/connection-string/
     */
    getUri(otherDb, otherIp) {
        this.debug('getUri:', this.state, otherDb, otherIp);
        switch (this.state) {
            case MongoMemoryServerStates.running:
            case MongoMemoryServerStates.starting:
                break;
            case MongoMemoryServerStates.stopped:
            default:
                throw new errors_1.StateError([MongoMemoryServerStates.running, MongoMemoryServerStates.starting], this.state);
        }
        assertionInstanceInfo(this._instanceInfo);
        return (0, utils_1.uriTemplate)(otherIp || '127.0.0.1', this._instanceInfo.port, (0, utils_1.generateDbName)(otherDb));
    }
    /**
     * Create the Root user and additional users using the [localhost exception](https://www.mongodb.com/docs/manual/core/localhost-exception/#std-label-localhost-exception)
     * This Function assumes "this.opts.auth" is already processed into "this.auth"
     * @param data Used to get "ip" and "port"
     * @internal
     */
    async createAuth(data) {
        (0, utils_1.assertion)(!(0, utils_1.isNullOrUndefined)(this.auth), new Error('"createAuth" got called, but "this.auth" is undefined!'));
        assertionInstanceInfo(this._instanceInfo);
        this.debug('createAuth: options:', this.auth);
        let con = await mongodb_1.MongoClient.connect((0, utils_1.uriTemplate)(data.ip, data.port, 'admin'));
        try {
            let db = con.db('admin'); // just to ensure it is actually the "admin" database AND to have the "Db" data
            // Create the root user
            this.debug(`createAuth: Creating Root user, name: "${this.auth.customRootName}"`);
            await db.command({
                createUser: this.auth.customRootName,
                pwd: this.auth.customRootPwd,
                mechanisms: ['SCRAM-SHA-256'],
                customData: {
                    createdBy: 'mongodb-memory-server',
                    as: 'ROOTUSER',
                },
                roles: ['root'],
                // "writeConcern" is needced, otherwise replset servers might fail with "auth failed: such user does not exist"
                writeConcern: {
                    w: 'majority',
                },
            });
            if (this.auth.extraUsers.length > 0) {
                this.debug(`createAuth: Creating "${this.auth.extraUsers.length}" Custom Users`);
                this.auth.extraUsers.sort((a, b) => {
                    if (a.database === 'admin') {
                        return -1; // try to make all "admin" at the start of the array
                    }
                    return a.database === b.database ? 0 : 1; // "0" to sort all databases that are the same after each other, and "1" to for pushing it back
                });
                // reconnecting the database because the root user now exists and the "localhost exception" only allows the first user
                await con.close();
                con = await mongodb_1.MongoClient.connect(this.getUri('admin'), this._instanceInfo.instance.extraConnectionOptions ?? {});
                db = con.db('admin');
                for (const user of this.auth.extraUsers) {
                    user.database = (0, utils_1.isNullOrUndefined)(user.database) ? 'admin' : user.database;
                    // just to have not to call "con.db" everytime in the loop if its the same
                    if (user.database !== db.databaseName) {
                        db = con.db(user.database);
                    }
                    this.debug('createAuth: Creating User: ', user);
                    await db.command({
                        createUser: user.createUser,
                        pwd: user.pwd,
                        customData: {
                            ...user.customData,
                            createdBy: 'mongodb-memory-server',
                            as: 'EXTRAUSER',
                        },
                        roles: user.roles,
                        authenticationRestrictions: user.authenticationRestrictions ?? [],
                        mechanisms: user.mechanisms ?? ['SCRAM-SHA-256'],
                        digestPassword: user.digestPassword ?? true,
                        // "writeConcern" is needced, otherwise replset servers might fail with "auth failed: such user does not exist"
                        writeConcern: {
                            w: 'majority',
                        },
                    });
                }
            }
        }
        finally {
            // close connection in any case (even if throwing a error or being successfull)
            await con.close();
        }
    }
    /**
     * Helper function to determine if the "auth" object is set and not to be disabled
     * This function expectes to be run after the auth object has been transformed to a object
     * @returns "true" when "auth" should be enabled
     */
    authObjectEnable() {
        if ((0, utils_1.isNullOrUndefined)(this.auth)) {
            return false;
        }
        return typeof this.auth.enable === 'boolean' // if "this._replSetOpts.auth.enable" is defined, use that
            ? this.auth.enable
            : false; // if "this._replSetOpts.auth.enable" is not defined, default to false
    }
    // Symbol for "Explicit Resource Management"
    async [Symbol.asyncDispose]() {
        if (this.opts.dispose?.enabled ?? true) {
            await this.stop(this.opts.dispose?.cleanup);
        }
    }
}
exports.MongoMemoryServer = MongoMemoryServer;
exports.default = MongoMemoryServer;
/**
 * This function is to de-duplicate code
 * -> this couldnt be included in the class, because "asserts this.instanceInfo" is not allowed
 * @param val this.instanceInfo
 */
function assertionInstanceInfo(val) {
    (0, utils_1.assertion)(!(0, utils_1.isNullOrUndefined)(val), new Error('"instanceInfo" is undefined'));
}
/**
 * Helper function to de-duplicate state checking for "MongoMemoryServerStates"
 * @param wantedState The State that is wanted
 * @param currentState The current State ("this._state")
 */
function assertionIsMMSState(wantedState, currentState) {
    (0, utils_1.assertion)(currentState === wantedState, new errors_1.StateError([wantedState], currentState));
}
//# sourceMappingURL=MongoMemoryServer.js.map