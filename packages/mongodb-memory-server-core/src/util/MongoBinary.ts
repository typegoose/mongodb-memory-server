import os from 'os';
import path from 'path';
import mkdirp from 'mkdirp';
import MongoBinaryDownload from './MongoBinaryDownload';
import resolveConfig, { envToBool, ResolveConfigVariables } from './resolveConfig';
import debug from 'debug';
import { assertion, isNullOrUndefined } from './utils';
import { spawnSync } from 'child_process';
import { LockFile } from './lockfile';
import { DryMongoBinary } from './DryMongoBinary';

const log = debug('MongoMS:MongoBinary');

export interface MongoBinaryOpts {
  version?: string;
  downloadDir?: string;
  platform?: string;
  arch?: string;
  checkMD5?: boolean;
}

export class MongoBinary {
  /**
   * Probe download path and download the binary
   * @param options Options Configuring which binary to download and to which path
   * @returns The BinaryPath the binary has been downloaded to
   */
  static async getDownloadPath(options: Required<MongoBinaryOpts>): Promise<string> {
    log('getDownloadPath');
    const { downloadDir, version } = options;
    // create downloadDir
    await mkdirp(downloadDir);

    /** Lockfile path */
    const lockfile = path.resolve(downloadDir, `${version}.lock`);
    log('getDownloadPath: Waiting to acquire Download lock');
    // wait to get a lock
    // downloading of binaries may be quite long procedure
    // that's why we are using so big wait/stale periods
    const lock = await LockFile.lock(lockfile);
    log('getDownloadPath: Download lock acquired');

    // this is to ensure that the lockfile gets removed in case of an error
    try {
      // check cache if it got already added to the cache
      if (!DryMongoBinary.binaryCache.has(version)) {
        log(`getDownloadPath: Adding version ${version} to cache`);
        const downloader = new MongoBinaryDownload(options);
        DryMongoBinary.binaryCache.set(version, await downloader.getMongodPath());
      }
    } finally {
      log('getDownloadPath: Removing Download lock');
      // remove lock
      await lock.unlock();
      log('getDownloadPath: Download lock removed');
    }

    const cachePath = DryMongoBinary.binaryCache.get(version);
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

    // "||" is still used here, because it should default if the value is false-y (like an empty string)
    const defaultOptions = {
      downloadDir: '',
      platform: resolveConfig(ResolveConfigVariables.PLATFORM) || os.platform(),
      arch: resolveConfig(ResolveConfigVariables.ARCH) || os.arch(),
      version: resolveConfig(ResolveConfigVariables.VERSION) ?? '4.0.20',
      systemBinary: resolveConfig(ResolveConfigVariables.SYSTEM_BINARY),
      checkMD5: envToBool(resolveConfig(ResolveConfigVariables.MD5_CHECK)),
    };

    const downloadBinary = await DryMongoBinary.generateDownloadPath(defaultOptions);
    // quick workaround because the "generateDownloadPath" is already fully assembled (base/version/binary)
    defaultOptions.downloadDir = path.resolve(path.dirname(downloadBinary[1]), '..');

    /** Provided Options combined with the Default Options */
    const options = { ...defaultOptions, ...opts };
    log(`getPath: MongoBinary options:`, JSON.stringify(options, null, 2));

    let binaryPath: string | undefined;

    const locatedBinary = await DryMongoBinary.locateBinary({
      version: options.version ?? '4.0.20',
    });

    if (!isNullOrUndefined(locatedBinary)) {
      binaryPath = locatedBinary;
    }

    if (options.systemBinary) {
      binaryPath = await DryMongoBinary.getSystemPath(options.systemBinary);

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
