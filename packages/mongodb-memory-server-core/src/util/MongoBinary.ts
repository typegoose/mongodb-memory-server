import fs from 'fs';
import os from 'os';
import path from 'path';
import LockFile from 'lockfile';
import mkdirp from 'mkdirp';
import findCacheDir from 'find-cache-dir';
import { execSync } from 'child_process';
import { promisify } from 'util';
import MongoBinaryDownload from './MongoBinaryDownload';
import resolveConfig, { envToBool } from './resolveConfig';
import debug from 'debug';
import { assertion } from './utils';

const log = debug('MongoMS:MongoBinary');

// TODO: return back `latest` version when it will be fixed in MongoDB distro (for now use 4.0.14 😂)
// More details in https://github.com/nodkz/mongodb-memory-server/issues/131
// export const LATEST_VERSION = 'latest';
export const LATEST_VERSION: string = '4.0.20';

export interface MongoBinaryCache {
  [version: string]: string;
}

export interface MongoBinaryOpts {
  version?: string;
  downloadDir?: string;
  platform?: string;
  arch?: string;
  checkMD5?: boolean;
}

export class MongoBinary {
  static cache: Map<string, string> = new Map();

  /**
   * Probe if the provided "systemBinary" is an existing path
   * @param systemBinary The Path to probe for an System-Binary
   * @return System Binary path or empty string
   */
  static async getSystemPath(systemBinary: string): Promise<string> {
    let binaryPath = '';

    try {
      await promisify(fs.access)(systemBinary);

      log(`MongoBinary: found system binary path at "${systemBinary}"`);
      binaryPath = systemBinary;
    } catch (err) {
      log(`MongoBinary: can't find system binary at "${systemBinary}".\n${err.message}`);
    }

    return binaryPath;
  }

  /**
   * Check if specified version already exists in the cache
   * @param version The Version to check for
   */
  static getCachePath(version: string): string | undefined {
    return this.cache.get(version);
  }

  /**
   * Probe download path and download the binary
   * @param options Options Configuring which binary to download and to which path
   * @returns The BinaryPath the binary has been downloaded to
   */
  static async getDownloadPath(options: Required<MongoBinaryOpts>): Promise<string> {
    const { downloadDir, platform, arch, version, checkMD5 } = options;
    // create downloadDir
    await mkdirp(downloadDir);

    /** Lockfile path */
    const lockfile = path.resolve(downloadDir, `${version}.lock`);
    // wait to get a lock
    // downloading of binaries may be quite long procedure
    // that's why we are using so big wait/stale periods
    await new Promise((resolve, reject) => {
      LockFile.lock(
        lockfile,
        {
          wait: 1000 * 120, // 120 seconds
          pollPeriod: 100,
          stale: 1000 * 110, // 110 seconds
          retries: 3,
          retryWait: 100,
        },
        (err: any) => {
          return err ? reject(err) : resolve();
        }
      );
    });

    // check cache if it got already added to the cache
    if (!this.getCachePath(version)) {
      const downloader = new MongoBinaryDownload({
        downloadDir,
        platform,
        arch,
        version,
        checkMD5,
      });
      this.cache.set(version, await downloader.getMongodPath());
    }
    // remove lock
    await new Promise((res) => {
      LockFile.unlock(lockfile, (err) => {
        log(
          err
            ? `MongoBinary: Error when removing download lock ${err}`
            : `MongoBinary: Download lock removed`
        );
        res(); // we don't care if it was successful or not
      });
    });

    const cachePath = this.getCachePath(version);
    // ensure that "path" exists, so the return type does not change
    assertion(
      typeof cachePath === 'string',
      new Error(`No Cache Path for version "${version}" found (and download failed silently?)`)
    );
    return cachePath;
  }

  /**
   * Probe all supported paths for an binary and return the binary path
   * @param opts Options configuring which binary to search for
   * @throws {Error} if no valid BinaryPath has been found
   * @return The first found BinaryPath
   */
  static async getPath(opts: MongoBinaryOpts = {}): Promise<string> {
    const legacyDLDir = path.resolve(os.homedir(), '.cache/mongodb-binaries');

    // if we're in postinstall script, npm will set the cwd too deep
    let nodeModulesDLDir = process.cwd();
    while (nodeModulesDLDir.endsWith(`node_modules${path.sep}mongodb-memory-server`)) {
      nodeModulesDLDir = path.resolve(nodeModulesDLDir, '..', '..');
    }

    // "||" is still used here, because it should default if the value is false-y (like an empty string)
    const defaultOptions = {
      downloadDir:
        resolveConfig('DOWNLOAD_DIR') ||
        (fs.existsSync(legacyDLDir)
          ? legacyDLDir
          : path.resolve(
              findCacheDir({
                name: 'mongodb-memory-server',
                cwd: nodeModulesDLDir,
              }) || '',
              'mongodb-binaries'
            )),
      platform: resolveConfig('PLATFORM') || os.platform(),
      arch: resolveConfig('ARCH') || os.arch(),
      version: resolveConfig('VERSION') || LATEST_VERSION,
      systemBinary: resolveConfig('SYSTEM_BINARY'),
      checkMD5: envToBool(resolveConfig('MD5_CHECK')),
    };

    /** Provided Options combined with the Default Options */
    const options = { ...defaultOptions, ...opts };
    log(`MongoBinary options:`, JSON.stringify(options, null, 2));

    let binaryPath: string | undefined;

    if (options.systemBinary) {
      binaryPath = await this.getSystemPath(options.systemBinary);
      if (binaryPath) {
        if (binaryPath.indexOf(' ') >= 0) {
          binaryPath = `"${binaryPath}"`;
        }

        const binaryVersion = execSync(`${binaryPath} --version`)
          .toString()
          .split('\n')[0]
          .split(' ')[2];

        if (options.version !== LATEST_VERSION && options.version !== binaryVersion) {
          // we will log the version number of the system binary and the version requested so the user can see the difference
          log(
            'MongoMemoryServer: Possible version conflict\n' +
              `  SystemBinary version: ${binaryVersion}\n` +
              `  Requested version:    ${options.version}\n\n` +
              '  Using SystemBinary!'
          );
        }
      }
    }

    if (!binaryPath) {
      binaryPath = this.getCachePath(options.version);
    }

    if (!binaryPath) {
      binaryPath = await this.getDownloadPath(options);
    }

    if (!binaryPath) {
      throw new Error(
        `MongoBinary.getPath: could not find an valid binary path! (Got: "${binaryPath}")`
      );
    }

    log(`MongoBinary: Mongod binary path: "${binaryPath}"`);
    return binaryPath;
  }
}

export default MongoBinary;
