import { promises as fspromises, constants } from 'fs';
import os from 'os';
import path from 'path';
import LockFile from 'lockfile';
import mkdirp from 'mkdirp';
import findCacheDir from 'find-cache-dir';
import MongoBinaryDownload from './MongoBinaryDownload';
import resolveConfig, { envToBool, ResolveConfigVariables } from './resolveConfig';
import debug from 'debug';
import { assertion, isNullOrUndefined, pathExists } from './utils';
import { spawnSync } from 'child_process';

const log = debug('MongoMS:MongoBinary');

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
   * @return System Binary path or undefined
   */
  static async getSystemPath(systemBinary: string): Promise<string | undefined> {
    try {
      await fspromises.access(systemBinary, constants.X_OK); // check if the provided path exists and has the execute bit for current user

      log(`getSystemPath: found system binary path at "${systemBinary}"`);

      return systemBinary; // returns if "access" is successful
    } catch (err) {
      log(`getSystemPath: can't find system binary at "${systemBinary}".\n${err.message}`);
    }

    return undefined;
  }

  /**
   * Probe download path and download the binary
   * @param options Options Configuring which binary to download and to which path
   * @returns The BinaryPath the binary has been downloaded to
   */
  static async getDownloadPath(options: Required<MongoBinaryOpts>): Promise<string> {
    log('getDownloadPath');
    const { downloadDir, platform, arch, version, checkMD5 } = options;
    // create downloadDir
    await mkdirp(downloadDir);

    /** Lockfile path */
    const lockfile = path.resolve(downloadDir, `${version}.lock`);
    log('getDownloadPath: Waiting to acquire Download lock');
    // wait to get a lock
    // downloading of binaries may be quite long procedure
    // that's why we are using so big wait/stale periods
    await new Promise<void>((res, rej) => {
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
          return err ? rej(err) : res();
        }
      );
    });
    log('getDownloadPath: Download lock acquired');

    // check cache if it got already added to the cache
    if (!this.cache.get(version)) {
      log(`getDownloadPath: Adding version ${version} to cache`);
      const downloader = new MongoBinaryDownload({
        downloadDir,
        platform,
        arch,
        version,
        checkMD5,
      });
      this.cache.set(version, await downloader.getMongodPath());
    }

    log('getDownloadPath: Removing Download lock');
    // remove lock
    await new Promise<void>((res) => {
      LockFile.unlock(lockfile, (err) => {
        log(
          err
            ? `getDownloadPath: Error when removing download lock ${err}`
            : `getDownloadPath: Download lock removed`
        );
        res(); // we don't care if it was successful or not
      });
    });

    const cachePath = this.cache.get(version);
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
    log('getPath');
    const legacyDLDir = path.resolve(os.homedir(), '.cache/mongodb-binaries');

    // if we're in postinstall script, npm will set the cwd too deep
    let nodeModulesDLDir = process.cwd();
    while (nodeModulesDLDir.endsWith(`node_modules${path.sep}mongodb-memory-server`)) {
      nodeModulesDLDir = path.resolve(nodeModulesDLDir, '..', '..');
    }

    // "||" is still used here, because it should default if the value is false-y (like an empty string)
    const defaultOptions = {
      downloadDir:
        resolveConfig(ResolveConfigVariables.DOWNLOAD_DIR) ||
        ((await pathExists(legacyDLDir))
          ? legacyDLDir
          : path.resolve(
              findCacheDir({
                name: 'mongodb-memory-server',
                cwd: nodeModulesDLDir,
              }) || '',
              'mongodb-binaries'
            )),
      platform: resolveConfig(ResolveConfigVariables.PLATFORM) || os.platform(),
      arch: resolveConfig(ResolveConfigVariables.ARCH) || os.arch(),
      version: resolveConfig(ResolveConfigVariables.VERSION),
      systemBinary: resolveConfig(ResolveConfigVariables.SYSTEM_BINARY),
      checkMD5: envToBool(resolveConfig(ResolveConfigVariables.MD5_CHECK)),
    };

    /** Provided Options combined with the Default Options */
    const options = { ...defaultOptions, ...opts };
    log(`getPath: MongoBinary options:`, JSON.stringify(options, null, 2));

    let binaryPath: string | undefined;

    if (options.systemBinary) {
      binaryPath = await this.getSystemPath(options.systemBinary);

      if (binaryPath) {
        log(`getPath: Spawning binaryPath "${binaryPath}" to get version`);
        const binaryVersion = spawnSync(binaryPath, ['--version'])
          .toString()
          .split('\n')[0]
          .split(' ')[2];

        if (isNullOrUndefined(options.version) || options.version.length <= 0) {
          log('getPath: Using SystemBinary version as options.version');
          options.version = binaryVersion;
        }

        if (options.version !== binaryVersion) {
          // we will log the version number of the system binary and the version requested so the user can see the difference
          log(
            'getPath: MongoMemoryServer: Possible version conflict\n' +
              `  SystemBinary version: ${binaryVersion}\n` +
              `  Requested version:    ${options.version}\n\n` +
              '  Using SystemBinary!'
          );
        }
      }
    }

    assertion(
      typeof options.version === 'string',
      new Error('"MongoBinary.options.version" is not an string!')
    );

    if (!binaryPath) {
      binaryPath = this.cache.get(options.version);
    }

    if (!binaryPath) {
      binaryPath = await this.getDownloadPath(options as Required<MongoBinaryOpts>); // casting because "string" is asserted above (assertion is not reflected in type)
    }

    if (!binaryPath) {
      throw new Error(
        `MongoBinary.getPath: could not find an valid binary path! (Got: "${binaryPath}")`
      );
    }

    log(`getPath: Mongod binary path: "${binaryPath}"`);

    return binaryPath;
  }
}

export default MongoBinary;
