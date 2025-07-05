"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorageEngine = exports.lockfilePath = exports.md5FromFile = exports.md5 = exports.uuidv4 = exports.removeDir = exports.createTmpDir = exports.mkdir = exports.checkBinaryPermissions = exports.ManagerAdvanced = exports.ManagerBase = exports.tryReleaseFile = exports.pathExists = exports.statPath = exports.authDefault = exports.ensureAsync = exports.isAlive = exports.killProcess = exports.assertion = exports.isNullOrUndefined = exports.uriTemplate = exports.getHost = exports.generateDbName = exports.errorWithCode = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const fs_1 = require("fs");
const errors_1 = require("./errors");
const os_1 = require("os");
const path = tslib_1.__importStar(require("path"));
const crypto_1 = require("crypto");
const semver = tslib_1.__importStar(require("semver"));
const log = (0, debug_1.default)('MongoMS:utils');
/**
 * This is here, because NodeJS does not have a FSError type
 * @param err Value to check agains
 * @returns `true` if it is a error with code, `false` if not
 */
function errorWithCode(err) {
    return err instanceof Error && 'code' in err;
}
exports.errorWithCode = errorWithCode;
/**
 * Return input or default database
 * @param {string} dbName
 */
function generateDbName(dbName) {
    // this is ""(empty) to make it compatible with mongodb's uri format and mongoose's uri format
    // (in mongodb its the auth database, in mongoose its the default database for models)
    return dbName || '';
}
exports.generateDbName = generateDbName;
/**
 * Extracts the host and port information from a mongodb URI string.
 * @param {string} uri mongodb URI
 */
function getHost(uri) {
    // this will turn "mongodb://user:pass@localhost:port/authdb?queryoptions=1" to "localhost:port"
    return uri.replace(/(?:^mongodb:\/{2})|(?:\/.*$)|(?:.*@)/gim, '');
}
exports.getHost = getHost;
/**
 * Basic MongoDB Connection string
 * @param host the host ip or an list of hosts
 * @param port the host port or undefined if "host" is an list of hosts
 * @param dbName the database to add to the uri (in mongodb its the auth database, in mongoose its the default database for models)
 * @param query extra uri-query options (joined with "&")
 */
function uriTemplate(host, port, dbName, query) {
    const hosts = !isNullOrUndefined(port) ? `${host}:${port}` : host;
    return `mongodb://${hosts}/${dbName}` + (!isNullOrUndefined(query) ? `?${query.join('&')}` : '');
}
exports.uriTemplate = uriTemplate;
/**
 * Because since node 4.0.0 the internal util.is* functions got deprecated
 * @param val Any value to test if null or undefined
 */
function isNullOrUndefined(val) {
    return val === null || val === undefined;
}
exports.isNullOrUndefined = isNullOrUndefined;
/**
 * Assert an condition, if "false" throw error
 * Note: it is not named "assert" to differentiate between node and jest types
 * @param cond The Condition to throw
 * @param error An Custom Error to throw
 */
function assertion(cond, error) {
    if (!cond) {
        throw error ?? new errors_1.AssertionFallbackError();
    }
}
exports.assertion = assertion;
/**
 * Kill an ChildProcess
 * @param childprocess The Process to kill
 * @param name the name used in the logs
 * @param mongodPort the port for the mongod process (for easier logging)
 */
async function killProcess(childprocess, name, mongodPort) {
    function ilog(msg) {
        log(`Mongo[${mongodPort || 'unknown'}] killProcess: ${msg}`);
    }
    // this case can somehow happen, see https://github.com/typegoose/mongodb-memory-server/issues/666
    if (isNullOrUndefined(childprocess)) {
        ilog('childprocess was somehow undefined');
        return;
    }
    // check if the childProcess (via PID) is still alive (found thanks to https://github.com/typegoose/mongodb-memory-server/issues/411)
    if (!isAlive(childprocess.pid)) {
        ilog("given childProcess's PID was not alive anymore");
        return;
    }
    /**
     * Timeout before using SIGKILL
     */
    const timeoutTime = 1000 * 10;
    await new Promise((res, rej) => {
        let timeout = setTimeout(() => {
            ilog('timeout triggered, trying SIGKILL');
            if (!debug_1.default.enabled('MongoMS:utils')) {
                console.warn('An Process didnt exit with signal "SIGINT" within 10 seconds, using "SIGKILL"!\n' +
                    'Enable debug logs for more information');
            }
            childprocess.kill('SIGKILL');
            timeout = setTimeout(() => {
                ilog('timeout triggered again, rejecting');
                rej(new Error(`Process "${name}" didnt exit, enable debug for more information.`));
            }, timeoutTime);
        }, timeoutTime);
        childprocess.once(`exit`, (code, signal) => {
            ilog(`${name}: got exit signal, Code: ${code}, Signal: ${signal}`);
            clearTimeout(timeout);
            res();
        });
        ilog(`${name}: sending "SIGINT"`);
        childprocess.kill('SIGINT');
    });
}
exports.killProcess = killProcess;
/**
 * Check if the given Process is still alive
 * @param {number} pid The Process PID
 */
function isAlive(pid) {
    // This test (and allow to be undefined) is here because somewhere between nodejs 12 and 16 the types for "childprocess.pid" changed to include "| undefined"
    if (isNullOrUndefined(pid)) {
        return false;
    }
    try {
        process.kill(pid, 0); // code "0" dosnt actually kill anything (on all supported systems)
        return true;
    }
    catch (err) {
        return false;
    }
}
exports.isAlive = isAlive;
/**
 * Call "process.nextTick" to ensure an function is exectued directly after all code surrounding it
 * look at the following link to get to know on why this needed: https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#process-nexttick (read full documentation)
 */
async function ensureAsync() {
    return new Promise((res) => process.nextTick(res));
}
exports.ensureAsync = ensureAsync;
/**
 * Convert Partitial input into full-defaulted output
 * @param opts Partitial input options
 */
function authDefault(opts) {
    return {
        force: false,
        enable: true,
        customRootName: 'mongodb-memory-server-root',
        customRootPwd: 'rootuser',
        extraUsers: [],
        keyfileContent: '0123456789',
        ...opts,
    };
}
exports.authDefault = authDefault;
/**
 * Run "fs.promises.stat", but return "undefined" if error is "ENOENT" or "EACCES"
 * follows symlinks
 * @param path The Path to Stat
 * @throws if the error is not "ENOENT" or "EACCES"
 */
async function statPath(path) {
    return fs_1.promises.stat(path).catch((err) => {
        // catch the error if the directory doesn't exist or permission is denied, without throwing an error
        if (['ENOENT', 'EACCES'].includes(err.code)) {
            return undefined;
        }
        throw err;
    });
}
exports.statPath = statPath;
/**
 * Like "fs.existsSync" but async
 * uses "utils.statPath"
 * follows symlinks
 * @param path The Path to check for
 */
async function pathExists(path) {
    return !isNullOrUndefined(await statPath(path));
}
exports.pathExists = pathExists;
/**
 * Try to read an release file path and apply an parser to the output
 * @param path The Path to read for an release file
 * @param parser An function to parse the output of the file
 */
async function tryReleaseFile(path, parser) {
    try {
        const output = await fs_1.promises.readFile(path);
        return parser(output.toString());
    }
    catch (err) {
        if (errorWithCode(err) && !['ENOENT', 'EACCES'].includes(err.code)) {
            throw err;
        }
        log(`tryReleaseFile: "${path}" does not exist`);
        return undefined;
    }
}
exports.tryReleaseFile = tryReleaseFile;
/**
 * This Class is used to have unified types for base-manager functions
 */
class ManagerBase {
}
exports.ManagerBase = ManagerBase;
/**
 * This Class is used to have unified types for advanced-manager functions
 */
class ManagerAdvanced extends ManagerBase {
}
exports.ManagerAdvanced = ManagerAdvanced;
/**
 * Check that the Binary has sufficient Permissions to be executed
 * @param path The Path to check
 */
async function checkBinaryPermissions(path) {
    try {
        await fs_1.promises.access(path, fs_1.constants.X_OK); // check if the provided path exists and has the execute bit for current user
    }
    catch (err) {
        if (errorWithCode(err)) {
            if (err.code === 'EACCES') {
                throw new errors_1.InsufficientPermissionsError(path);
            }
            if (err.code === 'ENOENT') {
                throw new errors_1.BinaryNotFoundError(path);
            }
        }
        throw err;
    }
}
exports.checkBinaryPermissions = checkBinaryPermissions;
/**
 * Make Directory, wrapper for native mkdir with recursive true
 * @param path The Path to create
 * @returns Nothing
 */
async function mkdir(path) {
    await fs_1.promises.mkdir(path, { recursive: true });
}
exports.mkdir = mkdir;
/**
 * Create a Temporary directory with prefix, and optionally at "atPath"
 * @param prefix The prefix to use to create the tmpdir
 * @param atPath Optionally set a custom path other than "os.tmpdir"
 * @returns The created Path
 */
async function createTmpDir(prefix, atPath) {
    const tmpPath = atPath ?? (0, os_1.tmpdir)();
    return fs_1.promises.mkdtemp(path.join(tmpPath, prefix));
}
exports.createTmpDir = createTmpDir;
/**
 * Removes the given "path", if it is a directory, and does not throw a error if not existing
 * @param dirPath The Directory Path to delete
 * @returns "true" if deleted, otherwise "false"
 */
async function removeDir(dirPath) {
    const stat = await statPath(dirPath);
    if (isNullOrUndefined(stat)) {
        return;
    }
    if (!stat.isDirectory()) {
        throw new Error(`Given Path is not a directory! (Path: "${dirPath}")`);
    }
    await fs_1.promises.rm(dirPath, { force: true, recursive: true });
}
exports.removeDir = removeDir;
/**
 * Helper function to have uuidv4 generation and definition in one place
 * @returns a uuid-v4
 */
function uuidv4() {
    return (0, crypto_1.randomUUID)();
}
exports.uuidv4 = uuidv4;
/**
 * Helper function to have md5 generation and definition in one place
 * @param content the content to checksum
 * @returns a md5 of the input
 */
function md5(content) {
    return (0, crypto_1.createHash)('md5').update(content).digest('hex');
}
exports.md5 = md5;
/**
 * Helper function to have md5 generation and definition in one place for a file
 * @param file the location of a file to read for a hash
 * @returns a md5 of the input file
 */
async function md5FromFile(file) {
    return md5(await fs_1.promises.readFile(file));
}
exports.md5FromFile = md5FromFile;
/**
 * Helper function to get the lockfile for the provided `version` in `downloadDir`
 * @param downloadDir The Download directory of the binary
 * @param version The version to be downlaoded
 * @returns The lockfile path
 */
function lockfilePath(downloadDir, version) {
    return path.resolve(downloadDir, `${version}.lock`);
}
exports.lockfilePath = lockfilePath;
/**
 * Get the storage engine for the given given binary version, and issue a warning if it needs to be changed
 * @param storageEngine The engine that is configured
 * @param coercedVersion The binary version as semver
 * @returns The engine that actually will run in the given binary version
 */
function getStorageEngine(storageEngine, coercedVersion) {
    // warn when storage engine "ephemeralForTest" is explicitly used and switch to "wiredTiger"
    if (storageEngine === 'ephemeralForTest' && semver.gte(coercedVersion, '7.0.0')) {
        console.warn('Storage Engine "ephemeralForTest" is removed since mongodb 7.0.0, automatically using "wiredTiger"!\n' +
            'This warning is because the mentioned storage engine is explicitly used and mongodb version is 7.0.0 or higher');
        return 'wiredTiger';
    }
    if (isNullOrUndefined(storageEngine)) {
        if (semver.gte(coercedVersion, '7.0.0')) {
            return 'wiredTiger';
        }
        return 'ephemeralForTest';
    }
    return storageEngine;
}
exports.getStorageEngine = getStorageEngine;
//# sourceMappingURL=utils.js.map