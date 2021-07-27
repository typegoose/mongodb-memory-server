import os from 'os';
import { URL } from 'url';
import path from 'path';
import { promises as fspromises, createWriteStream, createReadStream, constants } from 'fs';
import md5File from 'md5-file';
import https from 'https';
import { createUnzip } from 'zlib';
import tar from 'tar-stream';
import yauzl from 'yauzl';
import MongoBinaryDownloadUrl from './MongoBinaryDownloadUrl';
import { HttpsProxyAgent } from 'https-proxy-agent';
import resolveConfig, { envToBool, ResolveConfigVariables } from './resolveConfig';
import debug from 'debug';
import { assertion, pathExists } from './utils';
import { DryMongoBinary } from './DryMongoBinary';
import mkdirp from 'mkdirp';
import { MongoBinaryOpts } from './MongoBinary';
import { clearLine } from 'readline';

const log = debug('MongoMS:MongoBinaryDownload');

export interface MongoBinaryDownloadProgress {
  current: number;
  length: number;
  totalMb: number;
  lastPrintedAt: number;
}

/**
 * Download and extract the "mongod" binary
 */
export class MongoBinaryDownload {
  dlProgress: MongoBinaryDownloadProgress;
  _downloadingUrl?: string;

  /**These options are kind of raw, they are not run through DryMongoBinary.generateOptions */
  binaryOpts: Required<MongoBinaryOpts>;

  // TODO: for an major version, remove the compat get/set
  // the following get/set are to not break existing stuff

  get checkMD5(): boolean {
    return this.binaryOpts.checkMD5;
  }

  set checkMD5(val: boolean) {
    this.binaryOpts.checkMD5 = val;
  }

  get downloadDir(): string {
    return this.binaryOpts.downloadDir;
  }

  set downloadDir(val: string) {
    this.binaryOpts.downloadDir = val;
  }

  get arch(): string {
    return this.binaryOpts.arch;
  }

  set arch(val: string) {
    this.binaryOpts.arch = val;
  }

  get version(): string {
    return this.binaryOpts.version;
  }

  set version(val: string) {
    this.binaryOpts.version = val;
  }

  get platform(): string {
    return this.binaryOpts.platform;
  }

  set platform(val: string) {
    this.binaryOpts.platform = val;
  }

  // end get/set backwards compat section

  constructor(opts: MongoBinaryOpts) {
    assertion(typeof opts.downloadDir === 'string', new Error('An DownloadDir must be specified!'));
    const version = opts.version ?? resolveConfig(ResolveConfigVariables.VERSION);
    assertion(
      typeof version === 'string',
      new Error('An MongoDB Binary version must be specified!')
    );

    // DryMongoBinary.generateOptions cannot be used here, because its async
    this.binaryOpts = {
      platform: opts.platform ?? os.platform(),
      arch: opts.arch ?? os.arch(),
      version: version,
      downloadDir: opts.downloadDir,
      checkMD5: opts.checkMD5 ?? envToBool(resolveConfig(ResolveConfigVariables.MD5_CHECK)),
      systemBinary: opts.systemBinary ?? '',
      os: opts.os ?? { os: 'unknown' },
    };

    this.dlProgress = {
      current: 0,
      length: 0,
      totalMb: 0,
      lastPrintedAt: 0,
    };
  }

  /**
   * Get the full path with filename
   * @return Absoulte Path with FileName
   */
  protected async getPath(): Promise<string> {
    const opts = await DryMongoBinary.generateOptions(this.binaryOpts);

    return DryMongoBinary.combineBinaryName(this.downloadDir, DryMongoBinary.getBinaryName(opts));
  }

  /**
   * Get the path of the already downloaded "mongod" file
   * otherwise download it and then return the path
   */
  async getMongodPath(): Promise<string> {
    log('getMongodPath');
    const mongodPath = await this.getPath();

    if (await pathExists(mongodPath)) {
      log(`getMongodPath: mongod path "${mongodPath}" already exists, using this`);

      return mongodPath;
    }

    const mongoDBArchive = await this.startDownload();
    await this.extract(mongoDBArchive);
    await fspromises.unlink(mongoDBArchive);

    if (await pathExists(mongodPath)) {
      return mongodPath;
    }

    throw new Error(`Cannot find downloaded mongod binary by path "${mongodPath}"`);
  }

  /**
   * Download the MongoDB Archive and check it against an MD5
   * @returns The MongoDB Archive location
   */
  async startDownload(): Promise<string> {
    log('startDownload');
    const mbdUrl = new MongoBinaryDownloadUrl(this.binaryOpts);

    await mkdirp(this.downloadDir);

    try {
      await fspromises.access(this.downloadDir, constants.X_OK | constants.W_OK); // check that this process has permissions to create files & modify file contents & read file contents
    } catch (err) {
      console.error(
        `Download Directory at "${this.downloadDir}" does not have sufficient permissions to be used by this process\n` +
          'Needed Permissions: Write & Execute (-wx)\n'
      );
      throw err;
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
   *
   * @returns {undefined} if "checkMD5" is falsey
   * @returns {true} if the md5 check was successful
   * @throws if the md5 check failed
   */
  async makeMD5check(
    urlForReferenceMD5: string,
    mongoDBArchive: string
  ): Promise<boolean | undefined> {
    log('makeMD5check: Checking MD5 of downloaded binary...');

    if (!this.checkMD5) {
      log('makeMD5check: checkMD5 is disabled');

      return undefined;
    }

    const mongoDBArchiveMd5 = await this.download(urlForReferenceMD5);
    const signatureContent = (await fspromises.readFile(mongoDBArchiveMd5)).toString('utf-8');
    const regexMatch = signatureContent.match(/^\s*([\w\d]+)\s*/i);
    const md5Remote = regexMatch ? regexMatch[1] : null;
    const md5Local = md5File.sync(mongoDBArchive);
    log(`makeMD5check: Local MD5: ${md5Local}, Remote MD5: ${md5Remote}`);

    if (md5Remote !== md5Local) {
      throw new Error('MongoBinaryDownload: md5 check failed');
    }

    await fspromises.unlink(mongoDBArchiveMd5);

    return true;
  }

  /**
   * Download file from downloadUrl
   * @param downloadUrl URL to download a File
   */
  async download(downloadUrl: string): Promise<string> {
    log('download');
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

    const urlObject = new URL(downloadUrl);
    urlObject.port = urlObject.port || '443';

    const requestOptions: https.RequestOptions = {
      method: 'GET',
      rejectUnauthorized: strictSsl,
      protocol: envToBool(resolveConfig(ResolveConfigVariables.USE_HTTP)) ? 'http:' : 'https:',
      agent: proxy ? new HttpsProxyAgent(proxy) : undefined,
    };

    const filename = urlObject.pathname.split('/').pop();

    if (!filename) {
      throw new Error(`MongoBinaryDownload: missing filename for url "${downloadUrl}"`);
    }

    const downloadLocation = path.resolve(this.downloadDir, filename);
    const tempDownloadLocation = path.resolve(this.downloadDir, `${filename}.downloading`);
    log(`download: Downloading${proxy ? ` via proxy "${proxy}"` : ''}: "${downloadUrl}"`);

    if (await pathExists(downloadLocation)) {
      log('download: Already downloaded archive found, skipping download');

      return downloadLocation;
    }

    this.assignDownloadingURL(urlObject);

    const downloadedFile = await this.httpDownload(
      urlObject,
      requestOptions,
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
    log('extract');
    const mongodbFullPath = await this.getPath();
    log(`extract: archive: "${mongoDBArchive}" final: "${mongodbFullPath}"`);

    await mkdirp(path.dirname(mongodbFullPath));

    const filter = (file: string) => /(?:bin\/(?:mongod(?:\.exe)?)|(?:.*\.dll))$/i.test(file);

    if (/(.tar.gz|.tgz)$/.test(mongoDBArchive)) {
      await this.extractTarGz(mongoDBArchive, mongodbFullPath, filter);
    } else if (/.zip$/.test(mongoDBArchive)) {
      await this.extractZip(mongoDBArchive, mongodbFullPath, filter);
    } else {
      throw new Error(
        `MongoBinaryDownload: unsupported archive "${mongoDBArchive}" (downloaded from "${
          this._downloadingUrl ?? 'unknown'
        }"). Broken archive from MongoDB Provider?`
      );
    }

    if (!(await pathExists(mongodbFullPath))) {
      throw new Error(
        `MongoBinaryDownload: missing mongod binary in "${mongoDBArchive}" (downloaded from "${
          this._downloadingUrl ?? 'unknown'
        }"). Broken archive from MongoDB Provider?`
      );
    }

    return mongodbFullPath;
  }

  /**
   * Extract a .tar.gz archive
   * @param mongoDBArchive Archive location
   * @param extractPath Directory to extract to
   * @param filter Method to determine which files to extract
   */
  async extractTarGz(
    mongoDBArchive: string,
    extractPath: string,
    filter: (file: string) => boolean
  ): Promise<void> {
    log('extractTarGz');
    const extract = tar.extract();
    extract.on('entry', (header, stream, next) => {
      if (filter(header.name)) {
        stream.pipe(
          createWriteStream(extractPath, {
            mode: 0o775,
          })
        );
      }

      stream.on('end', () => next());
      stream.resume();
    });

    return new Promise((resolve, reject) => {
      createReadStream(mongoDBArchive)
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
   * @param extractPath Directory to extract to
   * @param filter Method to determine which files to extract
   */
  async extractZip(
    mongoDBArchive: string,
    extractPath: string,
    filter: (file: string) => boolean
  ): Promise<void> {
    log('extractZip');

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
              createWriteStream(extractPath, {
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
    url: URL,
    httpOptions: https.RequestOptions,
    downloadLocation: string,
    tempDownloadLocation: string
  ): Promise<string> {
    log('httpDownload');
    const downloadUrl = this.assignDownloadingURL(url);

    return new Promise((resolve, reject) => {
      log(`httpDownload: trying to download "${downloadUrl}"`);
      https
        .get(url, httpOptions, (response) => {
          if (response.statusCode != 200) {
            if (response.statusCode === 403) {
              reject(
                new Error(
                  "Status Code is 403 (MongoDB's 404)\n" +
                    "This means that the requested version-platform combination doesn't exist\n" +
                    `  Used Url: "${downloadUrl}"\n` +
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

          const fileStream = createWriteStream(tempDownloadLocation);

          response.pipe(fileStream);

          fileStream.on('finish', async () => {
            if (
              this.dlProgress.current < this.dlProgress.length &&
              !httpOptions.path?.endsWith('.md5')
            ) {
              reject(
                new Error(
                  `Too small (${this.dlProgress.current} bytes) mongod binary downloaded from ${downloadUrl}`
                )
              );

              return;
            }

            this.printDownloadProgress({ length: 0 }, true);

            fileStream.close();
            await fspromises.rename(tempDownloadLocation, downloadLocation);
            log(`httpDownload: moved "${tempDownloadLocation}" to "${downloadLocation}"`);

            resolve(downloadLocation);
          });

          response.on('data', (chunk: any) => {
            this.printDownloadProgress(chunk);
          });
        })
        .on('error', (e: Error) => {
          // log it without having debug enabled
          console.error(`Couldnt download "${downloadUrl}"!`, e.message);
          reject(e);
        });
    });
  }

  /**
   * Print the Download Progress to STDOUT
   * @param chunk A chunk to get the length
   */
  printDownloadProgress(chunk: { length: number }, forcePrint: boolean = false): void {
    this.dlProgress.current += chunk.length;

    const now = Date.now();

    if (now - this.dlProgress.lastPrintedAt < 2000 && !forcePrint) {
      return;
    }

    this.dlProgress.lastPrintedAt = now;

    const percentComplete =
      Math.round(((100.0 * this.dlProgress.current) / this.dlProgress.length) * 10) / 10;
    const mbComplete = Math.round((this.dlProgress.current / 1048576) * 10) / 10;

    const crReturn = this.platform === 'win32' ? '\x1b[0G' : '\r';
    const message = `Downloading MongoDB "${this.version}": ${percentComplete}% (${mbComplete}mb / ${this.dlProgress.totalMb}mb)${crReturn}`;

    if (process.stdout.isTTY) {
      // if TTY overwrite last line over and over until finished and clear line to avoid residual characters
      clearLine(process.stdout, 0); // this is because "process.stdout.clearLine" does not exist anymore
      process.stdout.write(message);
    } else {
      console.log(message);
    }
  }

  /**
   * Helper function to de-duplicate assigning "_downloadingUrl"
   */
  assignDownloadingURL(url: URL): string {
    this._downloadingUrl = url.href;

    return this._downloadingUrl;
  }
}

export default MongoBinaryDownload;
