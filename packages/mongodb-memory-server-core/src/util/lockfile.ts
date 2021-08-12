import { EventEmitter } from 'events';
import * as utils from './utils';
import debug from 'debug';
import * as path from 'path';
import mkdirp from 'mkdirp';
import { promises as fspromises } from 'fs';
import { Mutex } from 'async-mutex';
import { v4 as uuidv4 } from 'uuid';
import { UnknownLockfileStatus } from './errors';

const log = debug('MongoMS:LockFile');

/**
 * Error used to cause an promise to stop and re-wait for an lockfile
 */
class RepeatError extends Error {
  constructor(public repeat: boolean) {
    super();
  }
}

export enum LockFileStatus {
  /**
   * Status is "available" to be grabbed (lockfile not existing or being invalid)
   */
  available,
  /**
   * Status is "available for asking instance" (instance that asked has the lock)
   */
  availableInstance,
  /**
   * Status is "locked by another instance in this process"
   */
  lockedSelf,
  /**
   * Status is "locked by another process"
   */
  lockedDifferent,
}

export enum LockFileEvents {
  lock = 'lock',
  unlock = 'unlock',
}

interface LockFileEventsClass extends EventEmitter {
  // Overwrite EventEmitter's definitions (to provide at least the event names)
  emit(event: LockFileEvents, ...args: any[]): boolean;
  on(event: LockFileEvents, listener: (...args: any[]) => void): this;
  once(event: LockFileEvents, listener: (...args: any[]) => void): this;
}

/** Dummy class for types */
class LockFileEventsClass extends EventEmitter {}

export class LockFile {
  /** All Files that are handled by this process */
  static files: Set<string> = new Set();
  /** Listen for events from this process */
  static events: LockFileEventsClass = new LockFileEventsClass();
  /** Mutex to stop same-process race conditions */
  static mutex: Mutex = new Mutex();

  /**
   * Acquire an lockfile
   * @param file The file to use as the LockFile
   */
  static async lock(file: string): Promise<LockFile> {
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
        throw new UnknownLockfileStatus(status);
    }
  }

  /**
   * Check the status of the lockfile
   * @param file The file to use as the LockFile
   */
  protected static async checkLock(file: string, uuid?: string): Promise<LockFileStatus> {
    log(`checkLock: for file "${file}" with uuid: "${uuid}"`);

    // if file / path does not exist, directly acquire lock
    if (!(await utils.pathExists(file))) {
      return LockFileStatus.available;
    }

    try {
      const fileData = (await fspromises.readFile(file)).toString().trim().split(' ');
      const readout = parseInt(fileData[0]);

      if (readout === process.pid) {
        log(
          `checkLock: Lock File Already exists, and is for *this* process, with uuid: "${fileData[1]}"`
        );

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
    } catch (err) {
      if (err.code === 'ENOENT') {
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
  protected static async waitForLock(file: string): Promise<LockFile> {
    log(`waitForLock: Starting to wait for file "${file}"`);
    /** Store the interval id to be cleared later */
    let interval: NodeJS.Timeout | undefined = undefined;
    /** Store the function in an value to be cleared later, without having to use an class-external or class function */
    let eventCB: ((val: any) => any) | undefined = undefined;
    await new Promise<void>((res) => {
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
        throw new UnknownLockfileStatus(lockStatus);
    }
  }

  /**
   * Function create the path and lock file
   * @param file The file to use as the LockFile
   */
  protected static async createLock(file: string): Promise<LockFile> {
    // this function only gets called by processed "file" input, so no re-checking
    log(`createLock: trying to create a lock file for "${file}"`);
    const uuid = uuidv4();

    // This is not an ".catch" because in an callback running "return" dosnt "return" the parent function
    try {
      await this.mutex.runExclusive(async () => {
        // this may cause "Stack Size" errors, because of an infinite loop if too many times this gets called
        if (this.files.has(file)) {
          log(`createLock: Map already has file "${file}"`);

          throw new RepeatError(true);
        }

        await mkdirp(path.dirname(file));

        await fspromises.writeFile(file, `${process.pid.toString()} ${uuid}`);

        this.files.add(file);
        this.events.emit(LockFileEvents.lock, file);
      });
    } catch (err) {
      if (err instanceof RepeatError && err.repeat) {
        return this.waitForLock(file);
      }
    }

    log(`createLock: Lock File Created for file "${file}"`);

    return new this(file, uuid);
  }

  // Below here are instance functions & values

  /**
   * File locked by this instance
   */
  public file?: string;
  /**
   * UUID Unique to this lock instance
   */
  public uuid?: string;

  constructor(file: string, uuid: string) {
    this.file = file;
    this.uuid = uuid;
  }

  /**
   * Unlock the File that is locked by this instance
   */
  async unlock(): Promise<void> {
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
        throw new Error(
          `Cannot unlock file "${this.file}", because it is not locked by this instance!`
        );
      default:
        throw new Error(
          `Cannot unlock Lock File "${this.file}" because it is not locked by this process!`
        );
    }
  }

  /**
   * Helper function for the unlock-cleanup
   * @param fileio Unlink the file?
   */
  protected async unlockCleanup(fileio: boolean = true): Promise<void> {
    return await LockFile.mutex.runExclusive(async () => {
      log(`unlockCleanup: for file "${this.file}"`);

      if (utils.isNullOrUndefined(this.file)) {
        return;
      }

      if (fileio) {
        await fspromises.unlink(this.file).catch((reason) => {
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
