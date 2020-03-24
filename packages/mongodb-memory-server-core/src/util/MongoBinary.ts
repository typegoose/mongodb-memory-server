import fs from 'fs';
import os from 'os';
import path from 'path';
import LockFile from 'lockfile';
import mkdirp from 'mkdirp';
import findCacheDir from 'find-cache-dir';
import { execSync } from 'child_process';
import dedent from 'dedent';
import { promisify } from 'util';
import MongoBinaryDownload from './MongoBinaryDownload';
import resolveConfig from './resolve-config';
import debug from 'debug';

const log = debug('MongoMS:MongoBinary');

// TODO: return back `latest` version when it will be fixed in MongoDB distro (for now use 4.0.14 😂)
// More details in https://github.com/nodkz/mongodb-memory-server/issues/131
// export const LATEST_VERSION = 'latest';
export const LATEST_VERSION: string = '4.0.14';

export interface MongoBinaryCache {
  [version: string]: string;
}

export interface MongoBinaryOpts {
  version?: string;
  downloadDir?: string;
  platform?: string;
  arch?: string;
}

export default class MongoBinary {
  static cache: MongoBinaryCache = {};

  static async getSystemPath(systemBinary: string): Promise<string> {
    let binaryPath = '';

    try {
      await promisify(fs.access)(systemBinary);

      log(`MongoBinary: found sytem binary path at ${systemBinary}`);
      binaryPath = systemBinary;
    } catch (err) {
      log(`MongoBinary: can't find system binary at ${systemBinary}. ${err.message}`);
    }

    return binaryPath;
  }

  static async getCachePath(version: string): Promise<string> {
    return this.cache[version];
  }

  static async getDownloadPath(options: any): Promise<string> {
    const { downloadDir, platform, arch, version } = options;
    // create downloadDir if not exists
    await mkdirp(downloadDir);

    const lockfile = path.resolve(downloadDir, `${version}.lock`);
    // wait lock
    await new Promise((resolve, reject) => {
      LockFile.lock(
        lockfile,
        {
          wait: 120000,
          pollPeriod: 100,
          stale: 110000,
          retries: 3,
          retryWait: 100,
        },
        (err: any) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // again check cache, maybe other instance resolve it
    if (!this.cache[version]) {
      const downloader = new MongoBinaryDownload({
        downloadDir,
        platform,
        arch,
        version,
      });
      this.cache[version] = await downloader.getMongodPath();
    }
    // remove lock
    LockFile.unlock(lockfile, (err: any) => {
      log(
        err
          ? `MongoBinary: Error when removing download lock ${err}`
          : `MongoBinary: Download lock removed`
      );
    });
    return this.cache[version];
  }

  static async getPath(opts: MongoBinaryOpts = {}): Promise<string> {
    const legacyDLDir = path.resolve(os.homedir(), '.cache/mongodb-binaries');

    // if we're in postinstall script, npm will set the cwd too deep
    let nodeModulesDLDir = process.cwd();
    while (nodeModulesDLDir.endsWith(`node_modules${path.sep}mongodb-memory-server`)) {
      nodeModulesDLDir = path.resolve(nodeModulesDLDir, '..', '..');
    }

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
    };

    const options = { ...defaultOptions, ...opts };
    log(`MongoBinary options: ${JSON.stringify(options)}`);

    const { version, systemBinary } = options;

    let binaryPath = '';

    if (systemBinary) {
      binaryPath = await this.getSystemPath(systemBinary);
      if (binaryPath) {
        if (~binaryPath.indexOf(' ')) {
          binaryPath = `"${binaryPath}"`;
        }

        const binaryVersion = execSync(`${binaryPath} --version`)
          .toString()
          .split('\n')[0]
          .split(' ')[2];

        if (version !== LATEST_VERSION && version !== binaryVersion) {
          // we will log the version number of the system binary and the version requested so the user can see the difference
          log(dedent`
            MongoMemoryServer: Possible version conflict
              SystemBinary version: ${binaryVersion}
              Requested version:    ${version}

              Using SystemBinary!
          `);
        }
      }
    }

    if (!binaryPath) {
      binaryPath = await this.getCachePath(version);
    }

    if (!binaryPath) {
      binaryPath = await this.getDownloadPath(options);
    }

    log(`MongoBinary: Mongod binary path: ${binaryPath}`);
    return binaryPath;
  }

  static hasValidBinPath(files: string[]): boolean {
    if (files.length === 1) {
      return true;
    } else if (files.length > 1) {
      return false;
    }
    return false;
  }
}
