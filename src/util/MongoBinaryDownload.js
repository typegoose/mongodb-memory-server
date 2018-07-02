/* @flow */
/* eslint-disable class-methods-use-this */

import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import request from 'request-promise';
import md5File from 'md5-file';
import https from 'https';

import decompress from 'decompress';
import MongoBinaryDownloadUrl from './MongoBinaryDownloadUrl';

export type MongoBinaryDownloadOpts = {
    version: string,
    downloadDir: string,
    platform: string,
    arch: string,
    debug?: boolean | Function,
};

type dlProgress = {
    current: number,
    length: number,
    totalMb: number,
    lastPrintedAt: number,
};

export default class MongoBinaryDownload {
    debug: Function;
    dlProgress: dlProgress;

    downloadDir: string;
    arch: string;
    version: string;
    platform: string;

    constructor({ platform, arch, downloadDir, version, debug }: $Shape<MongoBinaryDownloadOpts>) {
        this.platform = platform || os.platform();
        this.arch = arch || os.arch();
        this.version = version || 'latest';
        this.downloadDir = path.resolve(downloadDir || 'mongodb-download');
        this.dlProgress = {
            current: 0,
            length: 0,
            totalMb: 0,
            lastPrintedAt: 0,
        };

        if (debug) {
            if (debug.call && typeof debug === 'function' && debug.apply) {
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

        await fs.ensureDir(this.downloadDir);

        const downloadOptions = await mbdUrl.getDownloadOptions();
        const archName = await mbdUrl.getArchiveName();
        const mongoDBArchive = await this.download(archName, downloadOptions);
        // const mongoDBArchive = path.resolve(this.downloadDir, archName);


        let mongoDBArchiveMd5 = '';

        const downloadOptionsMd5 = await mbdUrl.getDownloadOptions();
        downloadOptionsMd5.path = `${downloadOptionsMd5.path}.md5`;
        const archMd5Name = `${archName}.md5`;

        mongoDBArchiveMd5 = await this.download(archMd5Name, downloadOptionsMd5);

        await this.checkMd5(mongoDBArchiveMd5, mongoDBArchive);

        return mongoDBArchive;
    }

    async checkMd5(mongoDBArchiveMd5, mongoDBArchive) {
        const signatureContent = (await fs.readFile(mongoDBArchiveMd5)).toString('UTF-8');
        const md5Remote = signatureContent.match(/(.*?)\s/)[1];
        const md5Local = md5File.sync(mongoDBArchive);
        if (md5Remote !== md5Local) {
            throw new Error('MongoBinaryDownload: md5 check is failed');
        }
    }

    async download(archName, downloadOptions) {
        const downloadLocation = path.resolve(this.downloadDir, archName);
        const tempDownloadLocation = path.resolve(this.downloadDir, `${archName}.downloading`);
        console.log('Downloading:', `https://${downloadOptions.hostname}${downloadOptions.path}`);
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
        await fs.ensureDir(extractDir);

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
                    fileStream.close(() => {
                        fs.renameSync(tempDownloadLocation, downloadLocation);
                        this.debug(`renamed ${tempDownloadLocation} to ${downloadLocation}`);
                        resolve(downloadLocation);
                    });
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
