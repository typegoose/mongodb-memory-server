import os from 'os';
import { URL } from 'url';
import path from 'path';
import { promises as fspromises, createWriteStream, createReadStream, constants } from 'fs';
import { https } from 'follow-redirects';
import { createUnzip } from 'zlib';
import tar from 'tar-stream';
import yauzl from 'yauzl';
import MongoBinaryDownloadUrl from './MongoBinaryDownloadUrl';
import { HttpsProxyAgent } from 'https-proxy-agent';
import resolveConfig, { envToBool, ResolveConfigVariables } from './resolveConfig';
import debug from 'debug';
import { assertion, mkdir, pathExists, md5FromFile } from './utils';
import { DryMongoBinary } from './DryMongoBinary';
import { MongoBinaryOpts } from './MongoBinary';
import { clearLine } from 'readline';
import { DownloadError, GenericMMSError, Md5CheckFailedError } from './errors';
import { RequestOptions } from 'https';

const log = debug('MongoMS:MongoBinaryDownload');

const retryableStatusCodes = [503, 500];
const retryableErrorCodes = ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNREFUSED'];

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
  protected _downloadingUrl?: string;

  /** These options are kind of raw, they are not run through DryMongoBinary.generateOptions */
  binaryOpts: Required<MongoBinaryOpts>;

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
   * @returns Absoulte Path with FileName
   */
  protected async getPath(): Promise<string> {
    const opts = await DryMongoBinary.generateOptions(this.binaryOpts);

    return DryMongoBinary.combineBinaryName(
      this.binaryOpts.downloadDir,
      await DryMongoBinary.getBinaryName(opts)
    );
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

    await mkdir(this.binaryOpts.downloadDir);

    try {
      await fspromises.access(this.binaryOpts.downloadDir, constants.X_OK | constants.W_OK); // check that this process has permissions to create files & modify file contents & read file contents
    } catch (err) {
      console.error(
        `Download Directory at "${this.binaryOpts.downloadDir}" does not have sufficient permissions to be used by this process\n` +
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

    if (!this.binaryOpts.checkMD5) {
      log('makeMD5check: checkMD5 is disabled');

      return undefined;
    }

    const archiveMD5Path = await this.download(urlForReferenceMD5);
    const signatureContent = (await fspromises.readFile(archiveMD5Path)).toString('utf-8');
    const regexMatch = signatureContent.match(/^\s*([\w\d]+)\s*/i);
    const md5SigRemote = regexMatch ? regexMatch[1] : null;
    const md5SigLocal = await md5FromFile(mongoDBArchive);
    log(`makeMD5check: Local MD5: ${md5SigLocal}, Remote MD5: ${md5SigRemote}`);

    if (md5SigRemote !== md5SigLocal) {
      throw new Md5CheckFailedError(md5SigLocal, md5SigRemote || 'unknown');
    }

    await fspromises.unlink(archiveMD5Path);

    return true;
  }

  /**
   * Download file from downloadUrl
   * @param downloadUrl URL to download a File
   * @returns The Path to the downloaded archive file
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

    const requestOptions: RequestOptions = {
      method: 'GET',
      rejectUnauthorized: strictSsl,
      protocol: envToBool(resolveConfig(ResolveConfigVariables.USE_HTTP)) ? 'http:' : 'https:',
      agent: proxy ? new HttpsProxyAgent(proxy) : undefined,
    };

    const filename = urlObject.pathname.split('/').pop();

    if (!filename) {
      throw new Error(`MongoBinaryDownload: missing filename for url "${downloadUrl}"`);
    }

    const downloadLocation = path.resolve(this.binaryOpts.downloadDir, filename);
    const tempDownloadLocation = path.resolve(
      this.binaryOpts.downloadDir,
      `${filename}.downloading`
    );
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

    await mkdir(path.dirname(mongodbFullPath));

    const filter = (file: string) => /(?:bin\/(?:mongod(?:\.exe)?))$/i.test(file);

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

    return new Promise((res, rej) => {
      createReadStream(mongoDBArchive)
        .on('error', (err) => {
          rej(new GenericMMSError('Unable to open tarball ' + mongoDBArchive + ': ' + err));
        })
        .pipe(createUnzip())
        .on('error', (err) => {
          rej(new GenericMMSError('Error during unzip for ' + mongoDBArchive + ': ' + err));
        })
        .pipe(extract)
        .on('error', (err) => {
          rej(new GenericMMSError('Error during untar for ' + mongoDBArchive + ': ' + err));
        })
        .on('finish', res);
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
      yauzl.open(mongoDBArchive, { lazyEntries: true }, (err, zipfile) => {
        if (err || !zipfile) {
          return reject(err);
        }

        zipfile.readEntry();

        zipfile.on('end', () => resolve());

        zipfile.on('entry', (entry) => {
          if (!filter(entry.fileName)) {
            return zipfile.readEntry();
          }

          zipfile.openReadStream(entry, (err2, r) => {
            if (err2 || !r) {
              return reject(err2);
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
   * Download given httpOptions to tempDownloadLocation, then move it to downloadLocation
   * @param url The URL to download the file from
   * @param httpOptions The httpOptions directly passed to https.get
   * @param downloadLocation The location the File should be after the download
   * @param tempDownloadLocation The location the File should be while downloading
   * @param maxRetries Maximum number of retries on download failure
   * @param baseDelay Base delay in milliseconds for retrying the download
   */
  async httpDownload(
    url: URL,
    httpOptions: RequestOptions,
    downloadLocation: string,
    tempDownloadLocation: string,
    maxRetries?: number,
    baseDelay: number = 1000
  ): Promise<string> {
    log('httpDownload');
    const downloadUrl = this.assignDownloadingURL(url);

    const maxRedirects = parseInt(resolveConfig(ResolveConfigVariables.MAX_REDIRECTS) ?? '');
    const useHttpsOptions: Parameters<typeof https.get>[1] = {
      maxRedirects: Number.isNaN(maxRedirects) ? 2 : maxRedirects,
      ...httpOptions,
    };

    // Get maxRetries from config if not provided
    const retriesFromConfig = parseInt(resolveConfig(ResolveConfigVariables.MAX_RETRIES) ?? '');
    const retries =
      typeof maxRetries === 'number'
        ? maxRetries
        : !Number.isNaN(retriesFromConfig)
          ? retriesFromConfig
          : 3;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await this.attemptDownload(
          url,
          useHttpsOptions,
          downloadLocation,
          tempDownloadLocation,
          downloadUrl,
          httpOptions
        );
      } catch (error: any) {
        const shouldRetry =
          (error instanceof DownloadError &&
            retryableStatusCodes.some((code) => error.message.includes(code.toString()))) ||
          (error?.code && retryableErrorCodes.includes(error.code));

        if (!shouldRetry || attempt === retries) {
          throw error;
        }

        const base = baseDelay * Math.pow(2, attempt);
        const jitter = Math.floor(Math.random() * 1000);
        const delay = base + jitter;
        log(
          `httpDownload: attempt ${attempt + 1} failed with ${error.message}, retrying in ${delay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new Error('Max retries exceeded');
  }

  private async attemptDownload(
    url: URL,
    useHttpsOptions: Parameters<typeof https.get>[1],
    downloadLocation: string,
    tempDownloadLocation: string,
    downloadUrl: string,
    httpOptions: RequestOptions
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      log(`httpDownload: trying to download "${downloadUrl}"`);

      const request = https.get(url, useHttpsOptions, (response) => {
        if (response.statusCode != 200) {
          if (response.statusCode === 403) {
            reject(
              new DownloadError(
                downloadUrl,
                "Status Code is 403 (MongoDB's 404)\n" +
                  "This means that the requested version-platform combination doesn't exist\n" +
                  "Try to use different version 'new MongoMemoryServer({ binary: { version: 'X.Y.Z' } })'\n" +
                  'List of available versions can be found here: ' +
                  'https://www.mongodb.com/download-center/community/releases/archive'
              )
            );

            return;
          }

          reject(
            new DownloadError(downloadUrl, `Status Code isn't 200! (it is ${response.statusCode})`)
          );

          return;
        }

        // content-length, otherwise 0
        let contentLength: number;

        if (typeof response.headers['content-length'] != 'string') {
          log('Response header "content-length" is empty!');
          contentLength = 0;
        } else {
          contentLength = parseInt(response.headers['content-length'], 10);

          if (Number.isNaN(contentLength)) {
            log('Response header "content-length" resolved to NaN!');
            contentLength = 0;
          }
        }

        // error if the content-length header is missing or is 0 if config option "DOWNLOAD_IGNORE_MISSING_HEADER" is not set to "true"
        if (
          !envToBool(resolveConfig(ResolveConfigVariables.DOWNLOAD_IGNORE_MISSING_HEADER)) &&
          contentLength <= 0
        ) {
          reject(
            new DownloadError(
              downloadUrl,
              'Response header "content-length" does not exist or resolved to NaN'
            )
          );

          return;
        }

        this.dlProgress.current = 0;
        this.dlProgress.length = contentLength;
        this.dlProgress.totalMb = Math.round((this.dlProgress.length / 1048576) * 10) / 10;

        const fileStream = createWriteStream(tempDownloadLocation);

        response.pipe(fileStream);

        fileStream.on('finish', async () => {
          if (
            this.dlProgress.current < this.dlProgress.length &&
            !httpOptions.path?.endsWith('.md5')
          ) {
            reject(
              new DownloadError(
                downloadUrl,
                `Too small (${this.dlProgress.current} bytes) mongod binary downloaded.`
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

        response.on('error', (err: Error) => {
          reject(new DownloadError(downloadUrl, err.message));
        });
      });

      request.on('error', (err: Error) => {
        console.error(`Could NOT download "${downloadUrl}"!`, err.message);
        reject(new DownloadError(downloadUrl, err.message));
      });

      request.setTimeout(60000, () => {
        request.destroy();
        reject(new DownloadError(downloadUrl, 'Request timeout after 60 seconds'));
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

    const crReturn = this.binaryOpts.platform === 'win32' ? '\x1b[0G' : '\r';
    const message = `Downloading MongoDB "${this.binaryOpts.version}": ${percentComplete}% (${mbComplete}mb / ${this.dlProgress.totalMb}mb)${crReturn}`;

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
