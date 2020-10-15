import os from 'os';
import url from 'url';
import path from 'path';
import fs from 'fs';
import md5File from 'md5-file';
import https from 'https';
import { createUnzip } from 'zlib';
import tar from 'tar-stream';
import yauzl from 'yauzl';
import MongoBinaryDownloadUrl from './MongoBinaryDownloadUrl';
import { LATEST_VERSION } from './MongoBinary';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { promisify } from 'util';
import resolveConfig, { envToBool } from './resolveConfig';
import debug from 'debug';

const log = debug('MongoMS:MongoBinaryDownload');

export interface MongoBinaryDownloadProgress {
  current: number;
  length: number;
  totalMb: number;
  lastPrintedAt: number;
}

export interface MongoBinaryDownloadOpts {
  version?: string;
  downloadDir?: string;
  platform?: string;
  arch?: string;
  checkMD5?: boolean;
}

interface HttpDownloadOptions {
  hostname: string;
  port: string;
  path: string;
  method: 'GET' | 'POST';
  rejectUnauthorized?: boolean;
  agent: HttpsProxyAgent | undefined;
}

/**
 * Download and extract the "mongod" binary
 */
export class MongoBinaryDownload {
  dlProgress: MongoBinaryDownloadProgress;
  _downloadingUrl?: string;

  checkMD5: boolean;
  downloadDir: string;
  arch: string;
  version: string;
  platform: string;

  constructor({ platform, arch, downloadDir, version, checkMD5 }: MongoBinaryDownloadOpts) {
    this.platform = platform ?? os.platform();
    this.arch = arch ?? os.arch();
    this.version = version ?? LATEST_VERSION;
    this.downloadDir = path.resolve(downloadDir || 'mongodb-download');
    this.checkMD5 = checkMD5 ?? envToBool(resolveConfig('MD5_CHECK'));
    this.dlProgress = {
      current: 0,
      length: 0,
      totalMb: 0,
      lastPrintedAt: 0,
    };
  }

  /**
   * Get the path of the already downloaded "mongod" file
   * otherwise download it and then return the path
   */
  async getMongodPath(): Promise<string> {
    const binaryName = this.platform === 'win32' ? 'mongod.exe' : 'mongod';
    const mongodPath = path.resolve(this.downloadDir, this.version, binaryName);

    if (await this.locationExists(mongodPath)) {
      return mongodPath;
    }

    const mongoDBArchive = await this.startDownload();
    await this.extract(mongoDBArchive);
    fs.unlinkSync(mongoDBArchive);

    if (await this.locationExists(mongodPath)) {
      return mongodPath;
    }

    throw new Error(`Cannot find downloaded mongod binary by path ${mongodPath}`);
  }

  /**
   * Download the MongoDB Archive and check it against an MD5
   * @returns The MongoDB Archive location
   */
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

    await this.makeMD5check(`${downloadUrl}.md5`, mongoDBArchive);

    return mongoDBArchive;
  }

  /**
   * Download MD5 file and check it against the MongoDB Archive
   * @param urlForReferenceMD5 URL to download the MD5
   * @param mongoDBArchive The MongoDB Archive file location
   */
  async makeMD5check(
    urlForReferenceMD5: string,
    mongoDBArchive: string
  ): Promise<boolean | undefined> {
    if (!this.checkMD5) {
      return undefined;
    }
    log('Checking MD5 of downloaded binary...');
    const mongoDBArchiveMd5 = await this.download(urlForReferenceMD5);
    const signatureContent = fs.readFileSync(mongoDBArchiveMd5).toString('utf-8');
    const m = signatureContent.match(/(.*?)\s/);
    const md5Remote = m ? m[1] : null;
    const md5Local = md5File.sync(mongoDBArchive);
    log(`Local MD5: ${md5Local}, Remote MD5: ${md5Remote}`);
    if (md5Remote !== md5Local) {
      throw new Error('MongoBinaryDownload: md5 check failed');
    }
    return true;
  }

  /**
   * Download file from downloadUrl
   * @param downloadUrl URL to download a File
   */
  async download(downloadUrl: string): Promise<string> {
    const proxy =
      process.env['yarn_https-proxy'] ||
      process.env.yarn_proxy ||
      process.env['npm_config_https-proxy'] ||
      process.env.npm_config_proxy ||
      process.env.https_proxy ||
      process.env.http_proxy ||
      process.env.HTTPS_PROXY ||
      process.env.HTTP_PROXY;

    const strictSsl = process.env.npm_config_strict_ssl === 'true';

    const urlObject = url.parse(downloadUrl);

    if (!urlObject.hostname || !urlObject.path) {
      throw new Error(`Provided incorrect download url: ${downloadUrl}`);
    }

    const downloadOptions: HttpDownloadOptions = {
      hostname: urlObject.hostname,
      port: urlObject.port || '443',
      path: urlObject.path,
      method: 'GET',
      rejectUnauthorized: strictSsl,
      agent: proxy ? new HttpsProxyAgent(proxy) : undefined,
    };

    const filename = (urlObject.pathname || '').split('/').pop();
    if (!filename) {
      throw new Error(`MongoBinaryDownload: missing filename for url ${downloadUrl}`);
    }

    const downloadLocation = path.resolve(this.downloadDir, filename);
    const tempDownloadLocation = path.resolve(this.downloadDir, `${filename}.downloading`);
    log(`Downloading${proxy ? ` via proxy ${proxy}` : ''}: "${downloadUrl}"`);

    if (await this.locationExists(downloadLocation)) {
      log('Already downloaded archive found, skipping download');
      return downloadLocation;
    }

    this._downloadingUrl = downloadUrl;

    const downloadedFile = await this.httpDownload(
      downloadOptions,
      downloadLocation,
      tempDownloadLocation
    );
    return downloadedFile;
  }

  /**
   * Extract given Archive
   * @param mongoDBArchive Archive location
   * @returns extracted directory location
   */
  async extract(mongoDBArchive: string): Promise<string> {
    const binaryName = this.platform === 'win32' ? 'mongod.exe' : 'mongod';
    const extractDir = path.resolve(this.downloadDir, this.version);
    log(`extract(): ${extractDir}`);

    if (!fs.existsSync(extractDir)) {
      fs.mkdirSync(extractDir);
    }

    let filter: (file: string) => boolean;
    if (this.platform === 'win32') {
      filter = (file: string) => {
        return /bin\/mongod.exe$/.test(file) || /.dll$/.test(file);
      };
    } else {
      filter = (file: string) => /bin\/mongod$/.test(file);
    }

    if (/(.tar.gz|.tgz)$/.test(path.extname(mongoDBArchive))) {
      await this.extractTarGz(mongoDBArchive, extractDir, filter);
    } else if (/.zip$/.test(path.extname(mongoDBArchive))) {
      await this.extractZip(mongoDBArchive, extractDir, filter);
    } else {
      throw new Error(
        `MongoBinaryDownload: unsupported archive ${mongoDBArchive} (downloaded from ${
          this._downloadingUrl ?? 'unkown'
        }). Broken archive from MongoDB Provider?`
      );
    }

    if (!(await this.locationExists(path.resolve(this.downloadDir, this.version, binaryName)))) {
      throw new Error(
        `MongoBinaryDownload: missing mongod binary in ${mongoDBArchive} (downloaded from ${
          this._downloadingUrl ?? 'unkown'
        }). Broken archive from MongoDB Provider?`
      );
    }
    return extractDir;
  }

  /**
   * Extract a .tar.gz archive
   * @param mongoDBArchive Archive location
   * @param extractDir Directory to extract to
   * @param filter Method to determine which files to extract
   */
  async extractTarGz(
    mongoDBArchive: string,
    extractDir: string,
    filter: (file: string) => boolean
  ): Promise<void> {
    const extract = tar.extract();
    extract.on('entry', (header, stream, next) => {
      if (filter(header.name)) {
        stream.pipe(
          fs.createWriteStream(path.resolve(extractDir, path.basename(header.name)), {
            mode: 0o775,
          })
        );
      }
      stream.on('end', () => next());
      stream.resume();
    });

    return new Promise((resolve, reject) => {
      fs.createReadStream(mongoDBArchive)
        .on('error', (err) => {
          reject('Unable to open tarball ' + mongoDBArchive + ': ' + err);
        })
        .pipe(createUnzip())
        .on('error', (err) => {
          reject('Error during unzip for ' + mongoDBArchive + ': ' + err);
        })
        .pipe(extract)
        .on('error', (err) => {
          reject('Error during untar for ' + mongoDBArchive + ': ' + err);
        })
        .on('finish', (result) => {
          resolve(result);
        });
    });
  }

  /**
   * Extract a .zip archive
   * @param mongoDBArchive Archive location
   * @param extractDir Directory to extract to
   * @param filter Method to determine which files to extract
   */
  async extractZip(
    mongoDBArchive: string,
    extractDir: string,
    filter: (file: string) => boolean
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      yauzl.open(mongoDBArchive, { lazyEntries: true }, (e, zipfile) => {
        if (e || !zipfile) {
          return reject(e);
        }
        zipfile.readEntry();

        zipfile.on('end', () => resolve());

        zipfile.on('entry', (entry) => {
          if (!filter(entry.fileName)) {
            return zipfile.readEntry();
          }
          zipfile.openReadStream(entry, (e, r) => {
            if (e || !r) {
              return reject(e);
            }
            r.on('end', () => zipfile.readEntry());
            r.pipe(
              fs.createWriteStream(path.resolve(extractDir, path.basename(entry.fileName)), {
                mode: 0o775,
              })
            );
          });
        });
      });
    });
  }

  /**
   * Downlaod given httpOptions to tempDownloadLocation, then move it to downloadLocation
   * @param httpOptions The httpOptions directly passed to https.get
   * @param downloadLocation The location the File should be after the download
   * @param tempDownloadLocation The location the File should be while downloading
   */
  async httpDownload(
    httpOptions: HttpDownloadOptions,
    downloadLocation: string,
    tempDownloadLocation: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(tempDownloadLocation);

      log(`trying to download https://${httpOptions.hostname}${httpOptions.path}`);
      https
        .get(httpOptions as any, (response) => {
          // "as any" because otherwise the "agent" wouldnt match
          if (response.statusCode != 200) {
            if (response.statusCode === 403) {
              reject(
                new Error(
                  "Status Code is 403 (MongoDB's 404)\n" +
                    "This means that the requested version-platform combination doesn't exist\n" +
                    `  Used Url: "https://${httpOptions.hostname}${httpOptions.path}"\n` +
                    "Try to use different version 'new MongoMemoryServer({ binary: { version: 'X.Y.Z' } })'\n" +
                    'List of available versions can be found here:\n' +
                    '  https://www.mongodb.org/dl/linux for Linux\n' +
                    '  https://www.mongodb.org/dl/osx for OSX\n' +
                    '  https://www.mongodb.org/dl/win32 for Windows'
                )
              );
              return;
            }
            reject(new Error('Status Code isnt 200!'));
            return;
          }
          if (typeof response.headers['content-length'] != 'string') {
            reject(new Error('Response header "content-length" is empty!'));
            return;
          }
          this.dlProgress.current = 0;
          this.dlProgress.length = parseInt(response.headers['content-length'], 10);
          this.dlProgress.totalMb = Math.round((this.dlProgress.length / 1048576) * 10) / 10;

          response.pipe(fileStream);

          fileStream.on('finish', async () => {
            if (
              this.dlProgress.current < this.dlProgress.length &&
              !httpOptions.path.endsWith('.md5')
            ) {
              const downloadUrl =
                this._downloadingUrl || `https://${httpOptions.hostname}/${httpOptions.path}`;
              reject(
                new Error(
                  `Too small (${this.dlProgress.current} bytes) mongod binary downloaded from ${downloadUrl}`
                )
              );
              return;
            }

            fileStream.close();
            await promisify(fs.rename)(tempDownloadLocation, downloadLocation);
            log(`moved ${tempDownloadLocation} to ${downloadLocation}`);

            resolve(downloadLocation);
          });

          response.on('data', (chunk: any) => {
            this.printDownloadProgress(chunk);
          });
        })
        .on('error', (e: Error) => {
          // log it without having debug enabled
          console.error(`Couldnt download ${httpOptions.path}!`, e.message);
          reject(e);
        });
    });
  }

  /**
   * Print the Download Progress to STDOUT
   * @param chunk A chunk to get the length
   */
  printDownloadProgress(chunk: { length: number }): void {
    this.dlProgress.current += chunk.length;

    const now = Date.now();
    if (now - this.dlProgress.lastPrintedAt < 2000) {
      return;
    }
    this.dlProgress.lastPrintedAt = now;

    const percentComplete =
      Math.round(((100.0 * this.dlProgress.current) / this.dlProgress.length) * 10) / 10;
    const mbComplete = Math.round((this.dlProgress.current / 1048576) * 10) / 10;

    const crReturn = this.platform === 'win32' ? '\x1b[0G' : '\r';
    const message = `Downloading MongoDB ${this.version}: ${percentComplete} % (${mbComplete}mb / ${this.dlProgress.totalMb}mb)${crReturn}`;
    if (process.stdout.isTTY) {
      // if TTY overwrite last line over and over until finished
      process.stdout.write(message);
    } else {
      console.log(message);
    }
  }

  /**
   * Test if the location given is already used
   * Does *not* dereference links
   * @param location The Path to test
   */
  async locationExists(location: string): Promise<boolean> {
    try {
      await promisify(fs.lstat)(location);
      return true;
    } catch (e) {
      if (e.code !== 'ENOENT') {
        throw e;
      }
      return false;
    }
  }
}

export default MongoBinaryDownload;
