/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { ChildProcess } from 'child_process';
import { AutomaticAuth } from '../MongoMemoryServer';
import { Stats } from 'fs';
import { LinuxOS } from './getos';
import { BinaryLike } from 'crypto';
import { StorageEngine } from './MongoInstance';
import * as semver from 'semver';
/**
 * This is here, because NodeJS does not have a FSError type
 */
interface ErrorWithCode extends Error {
    code: string;
}
/**
 * This is here, because NodeJS does not have a FSError type
 * @param err Value to check agains
 * @returns `true` if it is a error with code, `false` if not
 */
export declare function errorWithCode(err: unknown): err is ErrorWithCode;
/**
 * Return input or default database
 * @param {string} dbName
 */
export declare function generateDbName(dbName?: string): string;
/**
 * Extracts the host and port information from a mongodb URI string.
 * @param {string} uri mongodb URI
 */
export declare function getHost(uri: string): string;
/**
 * Basic MongoDB Connection string
 * @param host the host ip or an list of hosts
 * @param port the host port or undefined if "host" is an list of hosts
 * @param dbName the database to add to the uri (in mongodb its the auth database, in mongoose its the default database for models)
 * @param query extra uri-query options (joined with "&")
 */
export declare function uriTemplate(host: string, port: number | undefined, dbName: string, query?: string[]): string;
/**
 * Because since node 4.0.0 the internal util.is* functions got deprecated
 * @param val Any value to test if null or undefined
 */
export declare function isNullOrUndefined(val: unknown): val is null | undefined;
/**
 * Assert an condition, if "false" throw error
 * Note: it is not named "assert" to differentiate between node and jest types
 * @param cond The Condition to throw
 * @param error An Custom Error to throw
 */
export declare function assertion(cond: unknown, error?: Error): asserts cond;
/**
 * Kill an ChildProcess
 * @param childprocess The Process to kill
 * @param name the name used in the logs
 * @param mongodPort the port for the mongod process (for easier logging)
 */
export declare function killProcess(childprocess: ChildProcess, name: string, mongodPort?: number): Promise<void>;
/**
 * Check if the given Process is still alive
 * @param {number} pid The Process PID
 */
export declare function isAlive(pid?: number): boolean;
/**
 * Call "process.nextTick" to ensure an function is exectued directly after all code surrounding it
 * look at the following link to get to know on why this needed: https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#process-nexttick (read full documentation)
 */
export declare function ensureAsync(): Promise<void>;
/**
 * Convert Partitial input into full-defaulted output
 * @param opts Partitial input options
 */
export declare function authDefault(opts: AutomaticAuth): Required<AutomaticAuth>;
/**
 * Run "fs.promises.stat", but return "undefined" if error is "ENOENT" or "EACCES"
 * follows symlinks
 * @param path The Path to Stat
 * @throws if the error is not "ENOENT" or "EACCES"
 */
export declare function statPath(path: string): Promise<Stats | undefined>;
/**
 * Like "fs.existsSync" but async
 * uses "utils.statPath"
 * follows symlinks
 * @param path The Path to check for
 */
export declare function pathExists(path: string): Promise<boolean>;
/**
 * Try to read an release file path and apply an parser to the output
 * @param path The Path to read for an release file
 * @param parser An function to parse the output of the file
 */
export declare function tryReleaseFile(path: string, parser: (output: string) => LinuxOS | undefined): Promise<LinuxOS | undefined>;
/**
 * Cleanup interface to provide easy to understand arguments for clean-up
 */
export interface Cleanup {
    /**
     * Setting this to `true` will activate cleanup
     * @default true
     */
    doCleanup?: boolean;
    /**
     * Setting this to `true` will cleanup the directory even if it is *not* a temporary directory
     * @default false
     */
    force?: boolean;
}
/**
 * This Class is used to have unified types for base-manager functions
 */
export declare abstract class ManagerBase {
    abstract start(forceSamePort: boolean): Promise<void>;
    abstract start(): Promise<void>;
    abstract stop(cleanup: Cleanup): Promise<boolean>;
    abstract [Symbol.asyncDispose](): Promise<void>;
}
/**
 * This Class is used to have unified types for advanced-manager functions
 */
export declare abstract class ManagerAdvanced extends ManagerBase {
    abstract getUri(otherDB?: string | boolean): string;
    abstract cleanup(cleanup: Cleanup): Promise<void>;
}
/**
 * Check that the Binary has sufficient Permissions to be executed
 * @param path The Path to check
 */
export declare function checkBinaryPermissions(path: string): Promise<void>;
/**
 * Make Directory, wrapper for native mkdir with recursive true
 * @param path The Path to create
 * @returns Nothing
 */
export declare function mkdir(path: string): Promise<void>;
/**
 * Create a Temporary directory with prefix, and optionally at "atPath"
 * @param prefix The prefix to use to create the tmpdir
 * @param atPath Optionally set a custom path other than "os.tmpdir"
 * @returns The created Path
 */
export declare function createTmpDir(prefix: string, atPath?: string): Promise<string>;
/**
 * Removes the given "path", if it is a directory, and does not throw a error if not existing
 * @param dirPath The Directory Path to delete
 * @returns "true" if deleted, otherwise "false"
 */
export declare function removeDir(dirPath: string): Promise<void>;
/**
 * Helper function to have uuidv4 generation and definition in one place
 * @returns a uuid-v4
 */
export declare function uuidv4(): string;
/**
 * Helper function to have md5 generation and definition in one place
 * @param content the content to checksum
 * @returns a md5 of the input
 */
export declare function md5(content: BinaryLike): string;
/**
 * Helper function to have md5 generation and definition in one place for a file
 * @param file the location of a file to read for a hash
 * @returns a md5 of the input file
 */
export declare function md5FromFile(file: string): Promise<string>;
/**
 * Helper function to get the lockfile for the provided `version` in `downloadDir`
 * @param downloadDir The Download directory of the binary
 * @param version The version to be downlaoded
 * @returns The lockfile path
 */
export declare function lockfilePath(downloadDir: string, version: string): string;
/**
 * Get the storage engine for the given given binary version, and issue a warning if it needs to be changed
 * @param storageEngine The engine that is configured
 * @param coercedVersion The binary version as semver
 * @returns The engine that actually will run in the given binary version
 */
export declare function getStorageEngine(storageEngine: StorageEngine | undefined, coercedVersion: semver.SemVer): StorageEngine;
export {};
//# sourceMappingURL=utils.d.ts.map