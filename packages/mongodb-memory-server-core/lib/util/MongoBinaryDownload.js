"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoBinaryDownload = void 0;
const tslib_1 = require("tslib");
const os_1 = tslib_1.__importDefault(require("os"));
const url_1 = require("url");
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = require("fs");
const follow_redirects_1 = require("follow-redirects");
const zlib_1 = require("zlib");
const tar_stream_1 = tslib_1.__importDefault(require("tar-stream"));
const yauzl_1 = tslib_1.__importDefault(require("yauzl"));
const MongoBinaryDownloadUrl_1 = tslib_1.__importDefault(require("./MongoBinaryDownloadUrl"));
const https_proxy_agent_1 = require("https-proxy-agent");
const resolveConfig_1 = tslib_1.__importStar(require("./resolveConfig"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const utils_1 = require("./utils");
const DryMongoBinary_1 = require("./DryMongoBinary");
const readline_1 = require("readline");
const errors_1 = require("./errors");
const log = (0, debug_1.default)('MongoMS:MongoBinaryDownload');
/**
 * Download and extract the "mongod" binary
 */
class MongoBinaryDownload {
    constructor(opts) {
        (0, utils_1.assertion)(typeof opts.downloadDir === 'string', new Error('An DownloadDir must be specified!'));
        const version = opts.version ?? (0, resolveConfig_1.default)(resolveConfig_1.ResolveConfigVariables.VERSION);
        (0, utils_1.assertion)(typeof version === 'string', new Error('An MongoDB Binary version must be specified!'));
        // DryMongoBinary.generateOptions cannot be used here, because its async
        this.binaryOpts = {
            platform: opts.platform ?? os_1.default.platform(),
            arch: opts.arch ?? os_1.default.arch(),
            version: version,
            downloadDir: opts.downloadDir,
            checkMD5: opts.checkMD5 ?? (0, resolveConfig_1.envToBool)((0, resolveConfig_1.default)(resolveConfig_1.ResolveConfigVariables.MD5_CHECK)),
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
    async getPath() {
        const opts = await DryMongoBinary_1.DryMongoBinary.generateOptions(this.binaryOpts);
        return DryMongoBinary_1.DryMongoBinary.combineBinaryName(this.binaryOpts.downloadDir, await DryMongoBinary_1.DryMongoBinary.getBinaryName(opts));
    }
    /**
     * Get the path of the already downloaded "mongod" file
     * otherwise download it and then return the path
     */
    async getMongodPath() {
        log('getMongodPath');
        const mongodPath = await this.getPath();
        if (await (0, utils_1.pathExists)(mongodPath)) {
            log(`getMongodPath: mongod path "${mongodPath}" already exists, using this`);
            return mongodPath;
        }
        const mongoDBArchive = await this.startDownload();
        await this.extract(mongoDBArchive);
        await fs_1.promises.unlink(mongoDBArchive);
        if (await (0, utils_1.pathExists)(mongodPath)) {
            return mongodPath;
        }
        throw new Error(`Cannot find downloaded mongod binary by path "${mongodPath}"`);
    }
    /**
     * Download the MongoDB Archive and check it against an MD5
     * @returns The MongoDB Archive location
     */
    async startDownload() {
        log('startDownload');
        const mbdUrl = new MongoBinaryDownloadUrl_1.default(this.binaryOpts);
        await (0, utils_1.mkdir)(this.binaryOpts.downloadDir);
        try {
            await fs_1.promises.access(this.binaryOpts.downloadDir, fs_1.constants.X_OK | fs_1.constants.W_OK); // check that this process has permissions to create files & modify file contents & read file contents
        }
        catch (err) {
            console.error(`Download Directory at "${this.binaryOpts.downloadDir}" does not have sufficient permissions to be used by this process\n` +
                'Needed Permissions: Write & Execute (-wx)\n');
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
    async makeMD5check(urlForReferenceMD5, mongoDBArchive) {
        log('makeMD5check: Checking MD5 of downloaded binary...');
        if (!this.binaryOpts.checkMD5) {
            log('makeMD5check: checkMD5 is disabled');
            return undefined;
        }
        const archiveMD5Path = await this.download(urlForReferenceMD5);
        const signatureContent = (await fs_1.promises.readFile(archiveMD5Path)).toString('utf-8');
        const regexMatch = signatureContent.match(/^\s*([\w\d]+)\s*/i);
        const md5SigRemote = regexMatch ? regexMatch[1] : null;
        const md5SigLocal = await (0, utils_1.md5FromFile)(mongoDBArchive);
        log(`makeMD5check: Local MD5: ${md5SigLocal}, Remote MD5: ${md5SigRemote}`);
        if (md5SigRemote !== md5SigLocal) {
            throw new errors_1.Md5CheckFailedError(md5SigLocal, md5SigRemote || 'unknown');
        }
        await fs_1.promises.unlink(archiveMD5Path);
        return true;
    }
    /**
     * Download file from downloadUrl
     * @param downloadUrl URL to download a File
     * @returns The Path to the downloaded archive file
     */
    async download(downloadUrl) {
        log('download');
        const proxy = process.env['yarn_https-proxy'] ||
            process.env.yarn_proxy ||
            process.env['npm_config_https-proxy'] ||
            process.env.npm_config_proxy ||
            process.env.https_proxy ||
            process.env.http_proxy ||
            process.env.HTTPS_PROXY ||
            process.env.HTTP_PROXY;
        const strictSsl = process.env.npm_config_strict_ssl === 'true';
        const urlObject = new url_1.URL(downloadUrl);
        urlObject.port = urlObject.port || '443';
        const requestOptions = {
            method: 'GET',
            rejectUnauthorized: strictSsl,
            protocol: (0, resolveConfig_1.envToBool)((0, resolveConfig_1.default)(resolveConfig_1.ResolveConfigVariables.USE_HTTP)) ? 'http:' : 'https:',
            agent: proxy ? new https_proxy_agent_1.HttpsProxyAgent(proxy) : undefined,
        };
        const filename = urlObject.pathname.split('/').pop();
        if (!filename) {
            throw new Error(`MongoBinaryDownload: missing filename for url "${downloadUrl}"`);
        }
        const downloadLocation = path_1.default.resolve(this.binaryOpts.downloadDir, filename);
        const tempDownloadLocation = path_1.default.resolve(this.binaryOpts.downloadDir, `${filename}.downloading`);
        log(`download: Downloading${proxy ? ` via proxy "${proxy}"` : ''}: "${downloadUrl}"`);
        if (await (0, utils_1.pathExists)(downloadLocation)) {
            log('download: Already downloaded archive found, skipping download');
            return downloadLocation;
        }
        this.assignDownloadingURL(urlObject);
        const downloadedFile = await this.httpDownload(urlObject, requestOptions, downloadLocation, tempDownloadLocation);
        return downloadedFile;
    }
    /**
     * Extract given Archive
     * @param mongoDBArchive Archive location
     * @returns extracted directory location
     */
    async extract(mongoDBArchive) {
        log('extract');
        const mongodbFullPath = await this.getPath();
        log(`extract: archive: "${mongoDBArchive}" final: "${mongodbFullPath}"`);
        await (0, utils_1.mkdir)(path_1.default.dirname(mongodbFullPath));
        const filter = (file) => /(?:bin\/(?:mongod(?:\.exe)?))$/i.test(file);
        if (/(.tar.gz|.tgz)$/.test(mongoDBArchive)) {
            await this.extractTarGz(mongoDBArchive, mongodbFullPath, filter);
        }
        else if (/.zip$/.test(mongoDBArchive)) {
            await this.extractZip(mongoDBArchive, mongodbFullPath, filter);
        }
        else {
            throw new Error(`MongoBinaryDownload: unsupported archive "${mongoDBArchive}" (downloaded from "${this._downloadingUrl ?? 'unknown'}"). Broken archive from MongoDB Provider?`);
        }
        if (!(await (0, utils_1.pathExists)(mongodbFullPath))) {
            throw new Error(`MongoBinaryDownload: missing mongod binary in "${mongoDBArchive}" (downloaded from "${this._downloadingUrl ?? 'unknown'}"). Broken archive from MongoDB Provider?`);
        }
        return mongodbFullPath;
    }
    /**
     * Extract a .tar.gz archive
     * @param mongoDBArchive Archive location
     * @param extractPath Directory to extract to
     * @param filter Method to determine which files to extract
     */
    async extractTarGz(mongoDBArchive, extractPath, filter) {
        log('extractTarGz');
        const extract = tar_stream_1.default.extract();
        extract.on('entry', (header, stream, next) => {
            if (filter(header.name)) {
                stream.pipe((0, fs_1.createWriteStream)(extractPath, {
                    mode: 0o775,
                }));
            }
            stream.on('end', () => next());
            stream.resume();
        });
        return new Promise((res, rej) => {
            (0, fs_1.createReadStream)(mongoDBArchive)
                .on('error', (err) => {
                rej(new errors_1.GenericMMSError('Unable to open tarball ' + mongoDBArchive + ': ' + err));
            })
                .pipe((0, zlib_1.createUnzip)())
                .on('error', (err) => {
                rej(new errors_1.GenericMMSError('Error during unzip for ' + mongoDBArchive + ': ' + err));
            })
                .pipe(extract)
                .on('error', (err) => {
                rej(new errors_1.GenericMMSError('Error during untar for ' + mongoDBArchive + ': ' + err));
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
    async extractZip(mongoDBArchive, extractPath, filter) {
        log('extractZip');
        return new Promise((resolve, reject) => {
            yauzl_1.default.open(mongoDBArchive, { lazyEntries: true }, (err, zipfile) => {
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
                        r.pipe((0, fs_1.createWriteStream)(extractPath, {
                            mode: 0o775,
                        }));
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
    async httpDownload(url, httpOptions, downloadLocation, tempDownloadLocation, maxRetries = 3, baseDelay = 1000) {
        log('httpDownload');
        const downloadUrl = this.assignDownloadingURL(url);
        const maxRedirects = parseInt((0, resolveConfig_1.default)(resolveConfig_1.ResolveConfigVariables.MAX_REDIRECTS) ?? '');
        const useHttpsOptions = {
            maxRedirects: Number.isNaN(maxRedirects) ? 2 : maxRedirects,
            ...httpOptions,
        };
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await this.attemptDownload(url, useHttpsOptions, downloadLocation, tempDownloadLocation, downloadUrl, httpOptions);
            }
            catch (error) {
                if (attempt === maxRetries) {
                    throw error;
                }
                const delay = baseDelay * Math.pow(2, attempt);
                log(`httpDownload: attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
        throw new Error('Max retries exceeded');
    }
    async attemptDownload(url, useHttpsOptions, downloadLocation, tempDownloadLocation, downloadUrl, httpOptions) {
        return new Promise((resolve, reject) => {
            log(`httpDownload: trying to download "${downloadUrl}"`);
            let stallTimer;
            const stallTimeout = 30000; // 30 seconds without data = stall
            const resetStallTimer = () => {
                if (stallTimer) {
                    clearTimeout(stallTimer);
                }
                stallTimer = setTimeout(() => {
                    reject(new errors_1.DownloadError(downloadUrl, 'Network I/O stalled - no data received for 30 seconds'));
                }, stallTimeout);
            };
            const clearStallTimer = () => {
                if (stallTimer) {
                    clearTimeout(stallTimer);
                    stallTimer = null;
                }
            };
            const request = follow_redirects_1.https.get(url, useHttpsOptions, (response) => {
                resetStallTimer();
                if (response.statusCode != 200) {
                    clearStallTimer();
                    if (response.statusCode === 403) {
                        reject(new errors_1.DownloadError(downloadUrl, "Status Code is 403 (MongoDB's 404)\n" +
                            "This means that the requested version-platform combination doesn't exist\n" +
                            "Try to use different version 'new MongoMemoryServer({ binary: { version: 'X.Y.Z' } })'\n" +
                            'List of available versions can be found here: ' +
                            'https://www.mongodb.com/download-center/community/releases/archive'));
                        return;
                    }
                    reject(new errors_1.DownloadError(downloadUrl, `Status Code isn't 200! (it is ${response.statusCode})`));
                    return;
                }
                // content-length, otherwise 0
                let contentLength;
                if (typeof response.headers['content-length'] != 'string') {
                    log('Response header "content-length" is empty!');
                    contentLength = 0;
                }
                else {
                    contentLength = parseInt(response.headers['content-length'], 10);
                    if (Number.isNaN(contentLength)) {
                        log('Response header "content-length" resolved to NaN!');
                        contentLength = 0;
                    }
                }
                // error if the content-length header is missing or is 0 if config option "DOWNLOAD_IGNORE_MISSING_HEADER" is not set to "true"
                if (!(0, resolveConfig_1.envToBool)((0, resolveConfig_1.default)(resolveConfig_1.ResolveConfigVariables.DOWNLOAD_IGNORE_MISSING_HEADER)) &&
                    contentLength <= 0) {
                    clearStallTimer();
                    reject(new errors_1.DownloadError(downloadUrl, 'Response header "content-length" does not exist or resolved to NaN'));
                    return;
                }
                this.dlProgress.current = 0;
                this.dlProgress.length = contentLength;
                this.dlProgress.totalMb = Math.round((this.dlProgress.length / 1048576) * 10) / 10;
                const fileStream = (0, fs_1.createWriteStream)(tempDownloadLocation);
                response.pipe(fileStream);
                fileStream.on('finish', async () => {
                    clearStallTimer();
                    if (this.dlProgress.current < this.dlProgress.length &&
                        !httpOptions.path?.endsWith('.md5')) {
                        reject(new errors_1.DownloadError(downloadUrl, `Too small (${this.dlProgress.current} bytes) mongod binary downloaded.`));
                        return;
                    }
                    this.printDownloadProgress({ length: 0 }, true);
                    fileStream.close();
                    await fs_1.promises.rename(tempDownloadLocation, downloadLocation);
                    log(`httpDownload: moved "${tempDownloadLocation}" to "${downloadLocation}"`);
                    resolve(downloadLocation);
                });
                response.on('data', (chunk) => {
                    resetStallTimer();
                    this.printDownloadProgress(chunk);
                });
                response.on('error', (err) => {
                    clearStallTimer();
                    reject(new errors_1.DownloadError(downloadUrl, err.message));
                });
            });
            request.on('error', (err) => {
                clearStallTimer();
                console.error(`Could NOT download "${downloadUrl}"!`, err.message);
                reject(new errors_1.DownloadError(downloadUrl, err.message));
            });
            request.setTimeout(60000, () => {
                clearStallTimer();
                request.destroy();
                reject(new errors_1.DownloadError(downloadUrl, 'Request timeout after 60 seconds'));
            });
            resetStallTimer();
        });
    }
    /**
     * Print the Download Progress to STDOUT
     * @param chunk A chunk to get the length
     */
    printDownloadProgress(chunk, forcePrint = false) {
        this.dlProgress.current += chunk.length;
        const now = Date.now();
        if (now - this.dlProgress.lastPrintedAt < 2000 && !forcePrint) {
            return;
        }
        this.dlProgress.lastPrintedAt = now;
        const percentComplete = Math.round(((100.0 * this.dlProgress.current) / this.dlProgress.length) * 10) / 10;
        const mbComplete = Math.round((this.dlProgress.current / 1048576) * 10) / 10;
        const crReturn = this.binaryOpts.platform === 'win32' ? '\x1b[0G' : '\r';
        const message = `Downloading MongoDB "${this.binaryOpts.version}": ${percentComplete}% (${mbComplete}mb / ${this.dlProgress.totalMb}mb)${crReturn}`;
        if (process.stdout.isTTY) {
            // if TTY overwrite last line over and over until finished and clear line to avoid residual characters
            (0, readline_1.clearLine)(process.stdout, 0); // this is because "process.stdout.clearLine" does not exist anymore
            process.stdout.write(message);
        }
        else {
            console.log(message);
        }
    }
    /**
     * Helper function to de-duplicate assigning "_downloadingUrl"
     */
    assignDownloadingURL(url) {
        this._downloadingUrl = url.href;
        return this._downloadingUrl;
    }
}
exports.MongoBinaryDownload = MongoBinaryDownload;
exports.default = MongoBinaryDownload;
//# sourceMappingURL=MongoBinaryDownload.js.map