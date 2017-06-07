/* @flow */

import { MongoDBDownload } from 'mongodb-download';
import glob from 'glob';
import os from 'os';
import path from 'path';
import lockFile from 'proper-lockfile';
import mkdirp from 'mkdirp';

export type MongoBinaryCache = {
  [version: string]: string,
};

export type MongoBinaryOpts = {
  version?: string,
  downloadDir?: string,
  platform?: string,
  arch?: string,
  http?: any,
  debug?: boolean | Function,
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
      await new Promise((resolve, reject) => {
        mkdirp(downloadDir, err => {
          if (err) reject(err);
          else resolve();
        });
      });
      await new Promise((resolve, reject) => {
        lockFile.lock(
          downloadDir,
          {
            stale: 120000,
            // try to get lock every second, give up after 3 minutes
            retries: { retries: 180, factor: 1, minTimeout: 1000 },
          },
          (err, releaseLock) => {
            debug('MongoBinary: Download lock created');

            // cache may be populated by previous process
            // check again
            if (this.cache[version]) {
              debug(`MongoBinary: found cached binary path for ${version}`);
              resolve(this.cache[version]);
            }

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

            downloader.debug = debug;

            downloader
              .downloadAndExtract()
              .then(releaseDir => {
                releaseLock(e => {
                  debug(
                    e
                      ? `MongoBinary: Error when removing download lock ${e}`
                      : `MongoBinary: Download lock removed`
                  );
                });
                return this.findBinPath(releaseDir);
              })
              .then(binPath => {
                this.cache[version] = binPath;
                resolve();
              })
              .catch(e => {
                debug(`MongoBinary: Error with mongod binary path: ${e}`);
                reject(e);
              });
          }
        );
      });
    }

    debug(`MongoBinary: Mongod binary path: ${this.cache[version]}`);
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
