/* @flow */

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

export type MongoBinaryCache = {
  [version: string]: string,
};

export type MongoBinaryOpts = {
  version?: string,
  downloadDir?: string,
  platform?: string,
  arch?: string,
  debug?: boolean | Function,
};

export default class MongoBinary {
  static cache: MongoBinaryCache = {};
  static debug: Function;

  static async getSystemPath(systemBinary: string): Promise<string> {
    let binaryPath: string = '';

    try {
      await promisify(fs.access)(systemBinary);

      this.debug(`MongoBinary: found sytem binary path at ${systemBinary}`);
      binaryPath = systemBinary;
    } catch (err) {
      this.debug(`MongoBinary: can't find system binary at ${systemBinary}. ${err.message}`);
    }

    return binaryPath;
  }

  static async getCachePath(version: string) {
    this.debug(`MongoBinary: found cached binary path for ${version}`);
    return this.cache[version];
  }

  static async getDownloadPath(options: any): Promise<string> {
    const { downloadDir, platform, arch, version } = options;

    // create downloadDir if not exists
    await new Promise((resolve, reject) => {
      mkdirp(downloadDir, err => {
        if (err) reject(err);
        else resolve();
      });
    });

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
        err => {
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

      downloader.debug = this.debug;
      this.cache[version] = await downloader.getMongodPath();
    }

    // remove lock
    LockFile.unlock(lockfile, err => {
      this.debug(
        err
          ? `MongoBinary: Error when removing download lock ${err}`
          : `MongoBinary: Download lock removed`
      );
    });

    return this.cache[version];
  }

  static async getPath(opts?: MongoBinaryOpts = {}): Promise<string> {
    const legacyDLDir = path.resolve(os.homedir(), '.mongodb-binaries');
    const defaultOptions = {
      downloadDir:
        process.env?.MONGOMS_DOWNLOAD_DIR ||
        (fs.existsSync(legacyDLDir)
          ? legacyDLDir
          : path.resolve(
              findCacheDir({
                name: 'mongodb-memory-server',
                // if we're in postinstall script, npm will set the cwd too deep
                cwd: new RegExp(`node_modules${path.sep}mongodb-memory-server$`).test(process.cwd())
                  ? path.resolve(process.cwd(), '..', '..')
                  : process.cwd(),
              }),
              'mongodb-binaries'
            )),
      platform: process.env?.MONGOMS_PLATFORM || os.platform(),
      arch: process.env?.MONGOMS_ARCH || os.arch(),
      version: process.env?.MONGOMS_VERSION || 'latest',
      systemBinary: process.env?.MONGOMS_SYSTEM_BINARY,
      debug:
        typeof process.env.MONGOMS_DEBUG === 'string'
          ? ['1', 'on', 'yes', 'true'].indexOf(process.env.MONGOMS_DEBUG.toLowerCase()) !== -1
          : false,
    };

    if (opts.debug) {
      if (typeof opts.debug === 'function' && opts.debug.apply && opts.debug.call) {
        this.debug = opts.debug;
      } else {
        this.debug = console.log.bind(null);
      }
    } else {
      this.debug = (msg: string) => {}; // eslint-disable-line
    }

    const options = { ...defaultOptions, ...opts };
    this.debug(`MongoBinary options: ${JSON.stringify(options)}`);

    const { version, systemBinary } = options;

    let binaryPath: string = '';

    if (systemBinary) {
      binaryPath = await this.getSystemPath(systemBinary);
      if (binaryPath) {
        const binaryVersion = execSync(`${binaryPath} --version`)
          .toString()
          .split('\n')[0]
          .split(' ')[2];

        if (version !== 'latest' && version !== binaryVersion) {
          // we will log the version number of the system binary and the version requested so the user can see the difference
          this.debug(dedent`
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

    this.debug(`MongoBinary: Mongod binary path: ${binaryPath}`);
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
