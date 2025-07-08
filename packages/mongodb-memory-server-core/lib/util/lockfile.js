"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockFile = exports.LockFileEvents = exports.LockFileStatus = void 0;
const tslib_1 = require("tslib");
const events_1 = require("events");
const utils = tslib_1.__importStar(require("./utils"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const path = tslib_1.__importStar(require("path"));
const fs_1 = require("fs");
const async_mutex_1 = require("async-mutex");
const errors_1 = require("./errors");
const log = (0, debug_1.default)('MongoMS:LockFile');
/**
 * Error used to cause an promise to stop and re-wait for an lockfile
 */
class RepeatError extends Error {
    constructor(repeat) {
        super();
        this.repeat = repeat;
    }
}
var LockFileStatus;
(function (LockFileStatus) {
    /**
     * Status is "available" to be grabbed (lockfile not existing or being invalid)
     */
    LockFileStatus[LockFileStatus["available"] = 0] = "available";
    /**
     * Status is "available for asking instance" (instance that asked has the lock)
     */
    LockFileStatus[LockFileStatus["availableInstance"] = 1] = "availableInstance";
    /**
     * Status is "locked by another instance in this process"
     */
    LockFileStatus[LockFileStatus["lockedSelf"] = 2] = "lockedSelf";
    /**
     * Status is "locked by another process"
     */
    LockFileStatus[LockFileStatus["lockedDifferent"] = 3] = "lockedDifferent";
})(LockFileStatus || (exports.LockFileStatus = LockFileStatus = {}));
var LockFileEvents;
(function (LockFileEvents) {
    LockFileEvents["lock"] = "lock";
    LockFileEvents["unlock"] = "unlock";
})(LockFileEvents || (exports.LockFileEvents = LockFileEvents = {}));
/** Dummy class for types */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class LockFileEventsClass extends events_1.EventEmitter {
}
class LockFile {
    /**
     * Acquire an lockfile
     * @param file The file to use as the LockFile
     */
    static async lock(file) {
        await utils.ensureAsync();
        log(`lock: Locking file "${file}"`);
        const useFile = path.resolve(file.trim());
        // just to make sure "path" could resolve it to something
        utils.assertion(useFile.length > 0, new Error('Provided Path for lock file is length of 0'));
        const status = await this.checkLock(useFile);
        switch (status) {
            case LockFileStatus.lockedDifferent:
            case LockFileStatus.lockedSelf:
                return this.waitForLock(useFile);
            case LockFileStatus.available:
                return this.createLock(useFile);
            default:
                throw new errors_1.UnknownLockfileStatusError(status);
        }
    }
    /**
     * Check the status of the lockfile
     * @param file The file to use as the LockFile
     */
    static async checkLock(file, uuid) {
        log(`checkLock: for file "${file}" with uuid: "${uuid}"`);
        // if file / path does not exist, directly acquire lock
        if (!(await utils.pathExists(file))) {
            return LockFileStatus.available;
        }
        try {
            const fileData = (await fs_1.promises.readFile(file)).toString().trim().split(' ');
            const readout = parseInt(fileData[0]);
            if (readout === process.pid) {
                log(`checkLock: Lock File Already exists, and is for *this* process, with uuid: "${fileData[1]}"`);
                // early return if "file"(input) dosnt exists within the files Map anymore
                if (!this.files.has(file)) {
                    return LockFileStatus.available;
                }
                // check if "uuid"(input) matches the filereadout, if yes say "available" (for unlock check)
                if (!utils.isNullOrUndefined(uuid)) {
                    return uuid === fileData[1]
                        ? LockFileStatus.availableInstance
                        : LockFileStatus.lockedSelf;
                }
                // as fallback say "lockedSelf"
                return LockFileStatus.lockedSelf;
            }
            log(`checkLock: Lock File Aready exists, for a different process: "${readout}"`);
            return utils.isAlive(readout) ? LockFileStatus.lockedDifferent : LockFileStatus.available;
        }
        catch (err) {
            if (utils.errorWithCode(err) && err.code === 'ENOENT') {
                log('checkLock: reading file failed with ENOENT');
                return LockFileStatus.available;
            }
            throw err;
        }
    }
    /**
     * Wait for the Lock file to become available
     * @param file The file to use as the LockFile
     */
    static async waitForLock(file) {
        log(`waitForLock: Starting to wait for file "${file}"`);
        /** Store the interval id to be cleared later */
        let interval = undefined;
        /** Store the function in an value to be cleared later, without having to use an class-external or class function */
        let eventCB = undefined;
        await new Promise((res) => {
            eventCB = (unlockedFile) => {
                if (unlockedFile === file) {
                    res();
                }
            };
            interval = setInterval(async () => {
                const lockStatus = await this.checkLock(file);
                log(`waitForLock: Interval for file "${file}" with status "${lockStatus}"`);
                if (lockStatus === LockFileStatus.available) {
                    res();
                }
            }, 1000 * 3); // every 3 seconds
            this.events.on(LockFileEvents.unlock, eventCB);
        });
        if (interval) {
            clearInterval(interval);
        }
        if (eventCB) {
            this.events.removeListener(LockFileEvents.unlock, eventCB);
        }
        log(`waitForLock: File became available "${file}"`);
        // i hope the following prevents race-conditions
        await utils.ensureAsync(); // to make sure all event listeners got executed
        const lockStatus = await this.checkLock(file);
        log(`waitForLock: Lock File Status reassessment for file "${file}": ${lockStatus}`);
        switch (lockStatus) {
            case LockFileStatus.lockedDifferent:
            case LockFileStatus.lockedSelf:
                return this.waitForLock(file);
            case LockFileStatus.available:
                return this.createLock(file);
            default:
                throw new errors_1.UnknownLockfileStatusError(lockStatus);
        }
    }
    /**
     * Function create the path and lock file
     * @param file The file to use as the LockFile
     */
    static async createLock(file) {
        // this function only gets called by processed "file" input, so no re-checking
        log(`createLock: trying to create a lock file for "${file}"`);
        const uuid = utils.uuidv4();
        // This is not an ".catch" because in an callback running "return" dosnt "return" the parent function
        try {
            await this.mutex.runExclusive(async () => {
                // this may cause "Stack Size" errors, because of an infinite loop if too many times this gets called
                if (this.files.has(file)) {
                    log(`createLock: Map already has file "${file}"`);
                    throw new RepeatError(true);
                }
                await utils.mkdir(path.dirname(file));
                await fs_1.promises.writeFile(file, `${process.pid.toString()} ${uuid}`);
                this.files.add(file);
                this.events.emit(LockFileEvents.lock, file);
            });
        }
        catch (err) {
            if (err instanceof RepeatError && err.repeat) {
                return this.waitForLock(file);
            }
        }
        log(`createLock: Lock File Created for file "${file}"`);
        return new this(file, uuid);
    }
    constructor(file, uuid) {
        this.file = file;
        this.uuid = uuid;
    }
    /**
     * Unlock the File that is locked by this instance
     */
    async unlock() {
        await utils.ensureAsync();
        log(`unlock: Unlocking file "${this.file}"`);
        if (utils.isNullOrUndefined(this.file) || this.file?.length <= 0) {
            log('unlock: invalid file, returning');
            return;
        }
        // No "case-fallthrough" because this is more clear (and no linter will complain)
        switch (await LockFile.checkLock(this.file, this.uuid)) {
            case LockFileStatus.available:
                log(`unlock: Lock Status was already "available" for file "${this.file}"`);
                await this.unlockCleanup(false);
                return;
            case LockFileStatus.availableInstance:
                log(`unlock: Lock Status was "availableInstance" for file "${this.file}"`);
                await this.unlockCleanup(true);
                return;
            case LockFileStatus.lockedSelf:
                throw new errors_1.UnableToUnlockLockfileError(true, this.file);
            default:
                throw new errors_1.UnableToUnlockLockfileError(false, this.file);
        }
    }
    /**
     * Helper function for the unlock-cleanup
     * @param fileio Unlink the file?
     */
    async unlockCleanup(fileio = true) {
        return await LockFile.mutex.runExclusive(async () => {
            log(`unlockCleanup: for file "${this.file}"`);
            if (utils.isNullOrUndefined(this.file)) {
                return;
            }
            if (fileio) {
                await fs_1.promises.unlink(this.file).catch((reason) => {
                    log(`unlockCleanup: lock file unlink failed: "${reason}"`);
                });
            }
            LockFile.files.delete(this.file);
            LockFile.events.emit(LockFileEvents.unlock, this.file);
            // make this LockFile instance unusable (to prevent double unlock calling)
            this.file = undefined;
            this.uuid = undefined;
        });
    }
}
exports.LockFile = LockFile;
/** All Files that are handled by this process */
LockFile.files = new Set();
/** Listen for events from this process */
LockFile.events = new LockFileEventsClass();
/** Mutex to stop same-process race conditions */
LockFile.mutex = new async_mutex_1.Mutex();
//# sourceMappingURL=lockfile.js.map