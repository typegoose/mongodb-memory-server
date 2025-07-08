/// <reference types="node" />
import { EventEmitter } from 'events';
import { Mutex } from 'async-mutex';
export declare enum LockFileStatus {
    /**
     * Status is "available" to be grabbed (lockfile not existing or being invalid)
     */
    available = 0,
    /**
     * Status is "available for asking instance" (instance that asked has the lock)
     */
    availableInstance = 1,
    /**
     * Status is "locked by another instance in this process"
     */
    lockedSelf = 2,
    /**
     * Status is "locked by another process"
     */
    lockedDifferent = 3
}
export declare enum LockFileEvents {
    lock = "lock",
    unlock = "unlock"
}
interface LockFileEventsClass extends EventEmitter {
    emit(event: LockFileEvents, ...args: any[]): boolean;
    on(event: LockFileEvents, listener: (...args: any[]) => void): this;
    once(event: LockFileEvents, listener: (...args: any[]) => void): this;
}
/** Dummy class for types */
declare class LockFileEventsClass extends EventEmitter {
}
export declare class LockFile {
    /** All Files that are handled by this process */
    static files: Set<string>;
    /** Listen for events from this process */
    static events: LockFileEventsClass;
    /** Mutex to stop same-process race conditions */
    static mutex: Mutex;
    /**
     * Acquire an lockfile
     * @param file The file to use as the LockFile
     */
    static lock(file: string): Promise<LockFile>;
    /**
     * Check the status of the lockfile
     * @param file The file to use as the LockFile
     */
    protected static checkLock(file: string, uuid?: string): Promise<LockFileStatus>;
    /**
     * Wait for the Lock file to become available
     * @param file The file to use as the LockFile
     */
    protected static waitForLock(file: string): Promise<LockFile>;
    /**
     * Function create the path and lock file
     * @param file The file to use as the LockFile
     */
    protected static createLock(file: string): Promise<LockFile>;
    /**
     * File locked by this instance
     */
    file?: string;
    /**
     * UUID Unique to this lock instance
     */
    uuid?: string;
    constructor(file: string, uuid: string);
    /**
     * Unlock the File that is locked by this instance
     */
    unlock(): Promise<void>;
    /**
     * Helper function for the unlock-cleanup
     * @param fileio Unlink the file?
     */
    protected unlockCleanup(fileio?: boolean): Promise<void>;
}
export {};
//# sourceMappingURL=lockfile.d.ts.map