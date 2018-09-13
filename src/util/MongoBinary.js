/* @flow */

import os from 'os';
import path from 'path';
import LockFile from 'lockfile';
import mkdirp from 'mkdirp';
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

  static async getPath(opts?: MongoBinaryOpts = {}): Promise<string> {
    const defaultOptions = {
      downloadDir:
        process.env?.MONGOMS_DOWNLOAD_DIR || path.resolve(os.homedir(), '.mongodb-binaries'),
      platform: process.env?.MONGOMS_PLATFORM || os.platform(),
      arch: process.env?.MONGOMS_ARCH || os.arch(),
      version: process.env?.MONGOMS_VERSION || 'latest',
      debug:
        typeof process.env.MONGOMS_DEBUG === 'string'
          ? ['1', 'on', 'yes', 'true'].indexOf(process.env.MONGOMS_DEBUG.toLowerCase()) !== -1
          : false,
    };

    const { downloadDir, platform, arch, version } = Object.assign({}, defaultOptions, opts);

    let debug;
    if (opts.debug) {
      if (opts.debug.call && typeof opts.debug === 'function' && opts.debug.apply) {
        debug = opts.debug;
      } else {
        debug = console.log.bind(null);
      }
    } else {
      debug = (msg: string) => {}; // eslint-disable-line
    }

    if (this.cache[version]) {
      debug(`MongoBinary: found cached binary path for ${version}`);
    } else {
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

        downloader.debug = debug;
        this.cache[version] = await downloader.getMongodPath();
      }

      // remove lock
      LockFile.unlock(lockfile, err => {
        debug(
          err
            ? `MongoBinary: Error when removing download lock ${err}`
            : `MongoBinary: Download lock removed`
        );
      });
    }

    debug(`MongoBinary: Mongod binary path: ${this.cache[version]}`);
    return this.cache[version];
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
