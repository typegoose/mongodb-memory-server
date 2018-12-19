/* @flow */
/* eslint-disable class-methods-use-this */

import os from 'os';
import url from 'url';
import path from 'path';
import fs from 'fs';
import md5File from 'md5-file';
import https from 'https';
import HttpsProxyAgent from 'https-proxy-agent';
import decompress from 'decompress'; // 💩💩💩 this package does not work with Node@11+Jest+Babel
import MongoBinaryDownloadUrl from './MongoBinaryDownloadUrl';
import type { DebugFn, DebugPropT, DownloadProgressT } from '../types';

export type MongoBinaryDownloadOpts = {
  version: string,
  downloadDir: string,
  platform: string,
  arch: string,
  debug?: DebugPropT,
  skipMD5?: boolean,
};

export default class MongoBinaryDownload {
  debug: DebugFn;
  dlProgress: DownloadProgressT;

  skipMD5: boolean;
  downloadDir: string;
  arch: string;
  version: string;
  platform: string;

  constructor({
    platform,
    arch,
    downloadDir,
    version,
    skipMD5,
    debug,
  }: $Shape<MongoBinaryDownloadOpts>) {
    this.platform = platform || os.platform();
    this.arch = arch || os.arch();
    this.version = version || 'latest';
    this.downloadDir = path.resolve(downloadDir || 'mongodb-download');
    if (skipMD5 === undefined) {
      this.skipMD5 =
        typeof process.env.MONGOMS_SKIP_MD5_CHECK === 'string' &&
        ['1', 'on', 'yes', 'true'].indexOf(process.env.MONGOMS_SKIP_MD5_CHECK.toLowerCase()) !== -1;
    } else {
      this.skipMD5 = skipMD5;
    }
    this.dlProgress = {
      current: 0,
      length: 0,
      totalMb: 0,
      lastPrintedAt: 0,
    };

    if (debug) {
      if (typeof debug === 'function' && debug.apply && debug.call) {
        this.debug = debug;
      } else {
        this.debug = console.log.bind(null);
      }
    } else {
      this.debug = () => {};
    }
  }

  async getMongodPath(): Promise<string> {
    const binaryName = this.platform === 'win32' ? 'mongod.exe' : 'mongod';
    const mongodPath = path.resolve(this.downloadDir, this.version, binaryName);
    if (this.locationExists(mongodPath)) {
      return mongodPath;
    }

    const mongoDBArchive = await this.startDownload();
    await this.extract(mongoDBArchive);
    fs.unlinkSync(mongoDBArchive);

    if (this.locationExists(mongodPath)) {
      return mongodPath;
    }

    throw new Error(`Cannot find downloaded mongod binary by path ${mongodPath}`);
  }

  async startDownload(): Promise<string> {
    const mbdUrl = new MongoBinaryDownloadUrl({
      platform: this.platform,
      arch: this.arch,
      version: this.version,
    });

    if (!fs.existsSync(this.downloadDir)) {
      fs.mkdirSync(this.downloadDir);
    }

    const downloadUrl = await mbdUrl.getDownloadUrl();
    const mongoDBArchive = await this.download(downloadUrl);

    await this.checkMD5(`${downloadUrl}.md5`, mongoDBArchive);

    return mongoDBArchive;
  }

  async checkMD5(urlForReferenceMD5: string, mongoDBArchive: string): Promise<?boolean> {
    if (this.skipMD5) {
      return undefined;
    }
    const mongoDBArchiveMd5 = await this.download(urlForReferenceMD5);
    const signatureContent = fs.readFileSync(mongoDBArchiveMd5).toString('UTF-8');
    const m = signatureContent.match(/(.*?)\s/);
    const md5Remote = m ? m[1] : null;
    const md5Local = md5File.sync(mongoDBArchive);
    if (md5Remote !== md5Local) {
      throw new Error('MongoBinaryDownload: md5 check is failed');
    }
    return true;
  }

  async download(downloadUrl: string) {
    const proxy =
      process.env['yarn_https-proxy'] ||
      process.env.yarn_proxy ||
      process.env['npm_config_https-proxy'] ||
      process.env.npm_config_proxy ||
      process.env.https_proxy ||
      process.env.http_proxy ||
      process.env.HTTPS_PROXY ||
      process.env.HTTP_PROXY;

    const urlObject = url.parse(downloadUrl);

    const downloadOptions = {
      hostname: urlObject.hostname,
      port: urlObject.port || 443,
      path: urlObject.path,
      method: 'GET',
      agent: proxy ? new HttpsProxyAgent(proxy) : undefined,
    };

    const filename = (urlObject.pathname || '').split('/').pop();
    if (!filename) {
      throw new Error(`MongoBinaryDownload: missing filename for url ${downloadUrl}`);
    }

    const downloadLocation = path.resolve(this.downloadDir, filename);
    const tempDownloadLocation = path.resolve(this.downloadDir, `${filename}.downloading`);
    this.debug(`Downloading${proxy ? ` via proxy ${proxy}` : ''}:`, downloadUrl);
    const downloadedFile = await this.httpDownload(
      downloadOptions,
      downloadLocation,
      tempDownloadLocation
    );
    return downloadedFile;
  }

  async extract(mongoDBArchive: string): Promise<string> {
    const binaryName = this.platform === 'win32' ? 'mongod.exe' : 'mongod';
    const extractDir = path.resolve(this.downloadDir, this.version);
    this.debug(`extract(): ${extractDir}`);

    if (!fs.existsSync(extractDir)) {
      fs.mkdirSync(extractDir);
    }

    let filter;
    if (this.platform === 'win32') {
      filter = file => {
        return /bin\/mongod.exe$/.test(file.path) || /.dll$/.test(file.path);
      };
    } else {
      filter = file => /bin\/mongod$/.test(file.path);
    }

    await decompress(mongoDBArchive, extractDir, {
      // extract only `bin/mongod` file
      filter,
      // extract to root folder
      map: file => {
        file.path = path.basename(file.path); // eslint-disable-line
        return file;
      },
    });

    if (!this.locationExists(path.resolve(this.downloadDir, this.version, binaryName))) {
      throw new Error(`MongoBinaryDownload: missing mongod binary in ${mongoDBArchive}`);
    }
    return extractDir;
  }

  async httpDownload(
    httpOptions: any,
    downloadLocation: string,
    tempDownloadLocation: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(tempDownloadLocation);

      const req: any = https.get(httpOptions, (response: any) => {
        this.dlProgress.current = 0;
        this.dlProgress.length = parseInt(response.headers['content-length'], 10);
        this.dlProgress.totalMb = Math.round((this.dlProgress.length / 1048576) * 10) / 10;

        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          fs.renameSync(tempDownloadLocation, downloadLocation);
          this.debug(`renamed ${tempDownloadLocation} to ${downloadLocation}`);
          resolve(downloadLocation);
        });

        response.on('data', (chunk: any) => {
          this.printDownloadProgress(chunk);
        });

        req.on('error', (e: any) => {
          this.debug('request error:', e);
          reject(e);
        });
      });
    });
  }

  printDownloadProgress(chunk: *): void {
    this.dlProgress.current += chunk.length;

    const now = Date.now();
    if (now - this.dlProgress.lastPrintedAt < 2000) return;
    this.dlProgress.lastPrintedAt = now;

    const percentComplete =
      Math.round(((100.0 * this.dlProgress.current) / this.dlProgress.length) * 10) / 10;
    const mbComplete = Math.round((this.dlProgress.current / 1048576) * 10) / 10;

    const crReturn = this.platform === 'win32' ? '\x1b[0G' : '\r';
    process.stdout.write(
      `Downloading MongoDB ${this.version}: ${percentComplete} % (${mbComplete}mb ` +
        `/ ${this.dlProgress.totalMb}mb)${crReturn}`
    );
  }

  locationExists(location: string): boolean {
    try {
      fs.lstatSync(location);
      return true;
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
      return false;
    }
  }
}
