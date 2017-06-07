/* @flow */

import { MongoDBDownload } from 'mongodb-download';
import glob from 'glob';
import os from 'os';
import path from 'path';

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

  static getPath(opts?: MongoBinaryOpts = {}): Promise<string> {
    const {
      downloadDir = path.resolve(os.homedir(), '.mongodb-binaries'),
      platform = os.platform(),
      arch = os.arch(),
      version = '3.4.4',
      http = {},
    } = opts;

    if (!this.cache[version]) {
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

      this.cache[version] = downloader.downloadAndExtract().then(releaseDir => {
        return this.findBinPath(releaseDir);
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
