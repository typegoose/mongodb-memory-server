/* @flow */

import { MongoDBDownload } from 'mongodb-download';
import glob from 'glob';
import os from 'os';
import path from 'path';
import lockFile from 'proper-lockfile';
import mkdirp from 'mkdirp';

export type MongoBinaryCache = {
  [version: string]: Promise<string>,
};

export type MongoBinaryOpts = {
  version?: string,
  downloadDir?: string,
  platform?: string,
  arch?: string,
  http?: any,
  debug?: boolean,
};

export default class MongoBinary {
  static cache: MongoBinaryCache = {};

  static async getPath(opts?: MongoBinaryOpts = {}): Promise<string> {
    const {
      downloadDir = path.resolve(os.homedir(), '.mongodb-binaries'),
      platform = os.platform(),
      arch = os.arch(),
      version = '3.4.4',
      http = {},
    } = opts;

    if (!this.cache[version]) {
      await new Promise((resolve, reject) => {
        mkdirp(downloadDir, err => {
          if (err) reject(err);
          else resolve();
        });
      });
      this.cache[version] = new Promise((resolve, reject) => {
        lockFile.lock(
          downloadDir,
          {
            stale: 120000,
            // try to get lock every second, give up after 3 minutes
            retries: { retries: 180, factor: 1, minTimeout: 1000 },
          },
          (err, releaseLock) => {
            if (err) {
              reject(err);
              return;
            }

            const downloader = new MongoDBDownload({
              downloadDir,
              platform,
              arch,
              version,
              http,
            });

            if (opts.debug) {
              downloader.debug = console.log.bind(null);
            }

            downloader
              .downloadAndExtract()
              .then(releaseDir => {
                releaseLock();
                resolve(this.findBinPath(releaseDir));
              })
              .catch(e => reject(e));
          }
        );
      });
    }
    return this.cache[version];
  }

  static findBinPath(releaseDir: string): Promise<string> {
    return new Promise((resolve, reject) => {
      glob(`${releaseDir}/*/bin`, {}, (err: any, files: string[]) => {
        if (err) {
          reject(err);
        } else if (this.hasValidBinPath(files) === true) {
          const resolvedBinPath: string = files[0];
          resolve(resolvedBinPath);
        } else {
          reject(`path not found`);
        }
      });
    });
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
