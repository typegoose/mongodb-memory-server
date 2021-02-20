import { EventEmitter } from 'events';
import * as utils from './utils';
import debug from 'debug';
import * as path from 'path';
import mkdirp from 'mkdirp';
import { promises as fspromises } from 'fs';
import { Mutex } from 'async-mutex';

const log = debug('MongoMS:LockFile');

export enum LockFileStatus {
  available,
  lockedSelf,
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

    switch (await this.checkLock(useFile)) {
      case LockFileStatus.lockedDifferent:
      case LockFileStatus.lockedSelf:
        return this.waitForLock(useFile);
      case LockFileStatus.available:
        return this.createLock(useFile);
      default:
        throw new Error(`Unknown LockFileStatus!`);
    }
  }

  /**
   * Check the status of the lockfile
   * @param file The file to use as the LockFile
   */
  protected static async checkLock(file: string): Promise<LockFileStatus> {
    log(`checkLock: for file "${file}"`);

    // if file / path does not exist, directly acquire lock
    if (!(await utils.pathExists(file))) {
      return LockFileStatus.available;
    }

    const readout = parseInt((await fspromises.readFile(file)).toString().trim());

    if (readout === process.pid) {
      log('checkLock: Lock File Already exists, and is for *this* process');

      return !this.files.has(file) ? LockFileStatus.available : LockFileStatus.lockedSelf;
    }

    return utils.isAlive(readout) ? LockFileStatus.lockedDifferent : LockFileStatus.available;
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
        throw new Error(`Unknown LockFileStatus!`);
    }
  }

  /**
   * Function create the path and lock file
   * @param file The file to use as the LockFile
   */
  protected static async createLock(file: string): Promise<LockFile> {
    // this function only gets called by processed "file" input, so no re-checking
    log(`createLock: Creating lock file "${file}"`);

    if (this.files.has(file)) {
      log(`createLock: Set already has file "${file}", ignoring`);
    }

    await this.mutex.runExclusive(async () => {
      await mkdirp(path.dirname(file));

      await fspromises.writeFile(file, process.pid.toString());

      this.files.add(file);
      this.events.emit(LockFileEvents.lock, file);
    });

    log('createLock: Lock File Created');

    return new this(file);
  }

  // Below here are instance functions & values

  /**
   * File locked by this instance
   */
  public file?: string;

  constructor(file: string) {
    this.file = file;
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

    switch (await LockFile.checkLock(this.file)) {
      case LockFileStatus.available:
        log(`unlock: Lock Status was already "available" for file "${this.file}", ignoring`);
        await LockFile.mutex.runExclusive(this.unlockCleanup.bind(this, false));

        return;
      case LockFileStatus.lockedSelf:
        await LockFile.mutex.runExclusive(this.unlockCleanup.bind(this, true));

        return;
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

    await utils.ensureAsync();
  }
}
