import debug from 'debug';
import { ChildProcess } from 'child_process';
import { AutomaticAuth } from '../MongoMemoryServer';
import { promises as fspromises, Stats, constants } from 'fs';
import { LinuxOS } from './getos';
import {
  AssertionFallbackError,
  BinaryNotFoundError,
  InsufficientPermissionsError,
} from './errors';
import { tmpdir } from 'os';
import * as path from 'path';
import { BinaryLike, createHash, randomUUID } from 'crypto';

const log = debug('MongoMS:utils');

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
export function errorWithCode(err: unknown): err is ErrorWithCode {
  return err instanceof Error && 'code' in err;
}

/**
 * Return input or default database
 * @param {string} dbName
 */
export function generateDbName(dbName?: string): string {
  // this is ""(empty) to make it compatible with mongodb's uri format and mongoose's uri format
  // (in mongodb its the auth database, in mongoose its the default database for models)
  return dbName || '';
}

/**
 * Extracts the host and port information from a mongodb URI string.
 * @param {string} uri mongodb URI
 */
export function getHost(uri: string): string {
  // this will turn "mongodb://user:pass@localhost:port/authdb?queryoptions=1" to "localhost:port"
  return uri.replace(/(?:^mongodb:\/{2})|(?:\/.*$)|(?:.*@)/gim, '');
}

/**
 * Basic MongoDB Connection string
 * @param host the host ip or an list of hosts
 * @param port the host port or undefined if "host" is an list of hosts
 * @param dbName the database to add to the uri (in mongodb its the auth database, in mongoose its the default database for models)
 * @param query extra uri-query options (joined with "&")
 */
export function uriTemplate(
  host: string,
  port: number | undefined,
  dbName: string,
  query?: string[]
): string {
  const hosts = !isNullOrUndefined(port) ? `${host}:${port}` : host;

  return `mongodb://${hosts}/${dbName}` + (!isNullOrUndefined(query) ? `?${query.join('&')}` : '');
}

/**
 * Because since node 4.0.0 the internal util.is* functions got deprecated
 * @param val Any value to test if null or undefined
 */
export function isNullOrUndefined(val: unknown): val is null | undefined {
  return val === null || val === undefined;
}

/**
 * Assert an condition, if "false" throw error
 * Note: it is not named "assert" to differentiate between node and jest types
 * @param cond The Condition to throw
 * @param error An Custom Error to throw
 */
export function assertion(cond: unknown, error?: Error): asserts cond {
  if (!cond) {
    throw error ?? new AssertionFallbackError();
  }
}

/**
 * Kill an ChildProcess
 * @param childprocess The Process to kill
 * @param name the name used in the logs
 * @param mongodPort the port for the mongod process (for easier logging)
 */
export async function killProcess(
  childprocess: ChildProcess,
  name: string,
  mongodPort?: number
): Promise<void> {
  function ilog(msg: string) {
    log(`Mongo[${mongodPort || 'unknown'}] killProcess: ${msg}`);
  }

  // this case can somehow happen, see https://github.com/nodkz/mongodb-memory-server/issues/666
  if (isNullOrUndefined(childprocess)) {
    ilog('childprocess was somehow undefined');

    return;
  }

  // check if the childProcess (via PID) is still alive (found thanks to https://github.com/nodkz/mongodb-memory-server/issues/411)
  if (!isAlive(childprocess.pid)) {
    ilog("given childProcess's PID was not alive anymore");

    return;
  }

  /**
   * Timeout before using SIGKILL
   */
  const timeoutTime = 1000 * 10;
  await new Promise<void>((res, rej) => {
    let timeout = setTimeout(() => {
      ilog('timeout triggered, trying SIGKILL');

      if (!debug.enabled('MongoMS:utils')) {
        console.warn(
          'An Process didnt exit with signal "SIGINT" within 10 seconds, using "SIGKILL"!\n' +
            'Enable debug logs for more information'
        );
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

/**
 * Check if the given Process is still alive
 * @param {number} pid The Process PID
 */
export function isAlive(pid?: number): boolean {
  // This test (and allow to be undefined) is here because somewhere between nodejs 12 and 16 the types for "childprocess.pid" changed to include "| undefined"
  if (isNullOrUndefined(pid)) {
    return false;
  }

  try {
    process.kill(pid, 0); // code "0" dosnt actually kill anything (on all supported systems)

    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Call "process.nextTick" to ensure an function is exectued directly after all code surrounding it
 * look at the following link to get to know on why this needed: https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#process-nexttick (read full documentation)
 */
export async function ensureAsync(): Promise<void> {
  return new Promise((res) => process.nextTick(res));
}

/**
 * Convert Partitial input into full-defaulted output
 * @param opts Partitial input options
 */
export function authDefault(opts: AutomaticAuth): Required<AutomaticAuth> {
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

/**
 * Run "fs.promises.stat", but return "undefined" if error is "ENOENT" or "EACCES"
 * follows symlinks
 * @param path The Path to Stat
 * @throws if the error is not "ENOENT" or "EACCES"
 */
export async function statPath(path: string): Promise<Stats | undefined> {
  return fspromises.stat(path).catch((err) => {
    // catch the error if the directory doesn't exist or permission is denied, without throwing an error
    if (['ENOENT', 'EACCES'].includes(err.code)) {
      return undefined;
    }

    throw err;
  });
}

/**
 * Like "fs.existsSync" but async
 * uses "utils.statPath"
 * follows symlinks
 * @param path The Path to check for
 */
export async function pathExists(path: string): Promise<boolean> {
  return !isNullOrUndefined(await statPath(path));
}

/**
 * Try to read an release file path and apply an parser to the output
 * @param path The Path to read for an release file
 * @param parser An function to parse the output of the file
 */
export async function tryReleaseFile(
  path: string,
  parser: (output: string) => LinuxOS | undefined
): Promise<LinuxOS | undefined> {
  try {
    const output = await fspromises.readFile(path);

    return parser(output.toString());
  } catch (err) {
    if (errorWithCode(err) && !['ENOENT', 'EACCES'].includes(err.code)) {
      throw err;
    }

    log(`tryReleaseFile: "${path}" does not exist`);

    return undefined;
  }
}

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
export abstract class ManagerBase {
  // this cannot be done yet, https://github.com/microsoft/TypeScript/issues/34516
  // abstract static create(opts: Record<string, any>): Promise<new (...args: any) => any>;
  abstract start(forceSamePort: boolean): Promise<void>;
  abstract start(): Promise<void>;
  abstract stop(cleanup: Cleanup): Promise<boolean>;
}

/**
 * This Class is used to have unified types for advanced-manager functions
 */
export abstract class ManagerAdvanced extends ManagerBase {
  abstract getUri(otherDB?: string | boolean): string;
  abstract cleanup(cleanup: Cleanup): Promise<void>;
}

/**
 * Check that the Binary has sufficient Permissions to be executed
 * @param path The Path to check
 */
export async function checkBinaryPermissions(path: string): Promise<void> {
  try {
    await fspromises.access(path, constants.X_OK); // check if the provided path exists and has the execute bit for current user
  } catch (err) {
    if (errorWithCode(err)) {
      if (err.code === 'EACCES') {
        throw new InsufficientPermissionsError(path);
      }
      if (err.code === 'ENOENT') {
        throw new BinaryNotFoundError(path);
      }
    }

    throw err;
  }
}

/**
 * Make Directory, wrapper for native mkdir with recursive true
 * @param path The Path to create
 * @returns Nothing
 */
export async function mkdir(path: string): Promise<void> {
  await fspromises.mkdir(path, { recursive: true });
}

/**
 * Create a Temporary directory with prefix, and optionally at "atPath"
 * @param prefix The prefix to use to create the tmpdir
 * @param atPath Optionally set a custom path other than "os.tmpdir"
 * @returns The created Path
 */
export async function createTmpDir(prefix: string, atPath?: string): Promise<string> {
  const tmpPath = atPath ?? tmpdir();

  return fspromises.mkdtemp(path.join(tmpPath, prefix));
}

/**
 * Removes the given "path", if it is a directory, and does not throw a error if not existing
 * @param dirPath The Directory Path to delete
 * @returns "true" if deleted, otherwise "false"
 */
export async function removeDir(dirPath: string): Promise<void> {
  const stat = await statPath(dirPath);

  if (isNullOrUndefined(stat)) {
    return;
  }

  if (!stat.isDirectory()) {
    throw new Error(`Given Path is not a directory! (Path: "${dirPath}")`);
  }

  await fspromises.rm(dirPath, { force: true, recursive: true });
}

/**
 * Helper function to have uuidv4 generation and definition in one place
 * @returns a uuid-v4
 */
export function uuidv4(): string {
  return randomUUID();
}

/**
 * Helper function to have md5 generation and definition in one place
 * @param content the content to checksum
 * @returns a md5 of the input
 */
export function md5(content: BinaryLike): string {
  return createHash('md5').update(content).digest('hex');
}

/**
 * Helper function to have md5 generation and definition in one place for a file
 * @param file the location of a file to read for a hash
 * @returns a md5 of the input file
 */
export async function md5FromFile(file: string): Promise<string> {
  return md5(await fspromises.readFile(file));
}

/**
 * Helper function to get the lockfile for the provided `version` in `downloadDir`
 * @param downloadDir The Download directory of the binary
 * @param version The version to be downlaoded
 * @returns The lockfile path
 */
export function lockfilePath(downloadDir: string, version: string): string {
  return path.resolve(downloadDir, `${version}.lock`);
}
