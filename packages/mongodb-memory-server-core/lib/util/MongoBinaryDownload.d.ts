/// <reference types="node" />
/// <reference types="node" />
import { URL } from 'url';
import { MongoBinaryOpts } from './MongoBinary';
import { RequestOptions } from 'https';
export interface MongoBinaryDownloadProgress {
    current: number;
    length: number;
    totalMb: number;
    lastPrintedAt: number;
}
/**
 * Download and extract the "mongod" binary
 */
export declare class MongoBinaryDownload {
    dlProgress: MongoBinaryDownloadProgress;
    protected _downloadingUrl?: string;
    /** These options are kind of raw, they are not run through DryMongoBinary.generateOptions */
    binaryOpts: Required<MongoBinaryOpts>;
    constructor(opts: MongoBinaryOpts);
    /**
     * Get the full path with filename
     * @returns Absoulte Path with FileName
     */
    protected getPath(): Promise<string>;
    /**
     * Get the path of the already downloaded "mongod" file
     * otherwise download it and then return the path
     */
    getMongodPath(): Promise<string>;
    /**
     * Download the MongoDB Archive and check it against an MD5
     * @returns The MongoDB Archive location
     */
    startDownload(): Promise<string>;
    /**
     * Download MD5 file and check it against the MongoDB Archive
     * @param urlForReferenceMD5 URL to download the MD5
     * @param mongoDBArchive The MongoDB Archive file location
     *
     * @returns {undefined} if "checkMD5" is falsey
     * @returns {true} if the md5 check was successful
     * @throws if the md5 check failed
     */
    makeMD5check(urlForReferenceMD5: string, mongoDBArchive: string): Promise<boolean | undefined>;
    /**
     * Download file from downloadUrl
     * @param downloadUrl URL to download a File
     * @returns The Path to the downloaded archive file
     */
    download(downloadUrl: string): Promise<string>;
    /**
     * Extract given Archive
     * @param mongoDBArchive Archive location
     * @returns extracted directory location
     */
    extract(mongoDBArchive: string): Promise<string>;
    /**
     * Extract a .tar.gz archive
     * @param mongoDBArchive Archive location
     * @param extractPath Directory to extract to
     * @param filter Method to determine which files to extract
     */
    extractTarGz(mongoDBArchive: string, extractPath: string, filter: (file: string) => boolean): Promise<void>;
    /**
     * Extract a .zip archive
     * @param mongoDBArchive Archive location
     * @param extractPath Directory to extract to
     * @param filter Method to determine which files to extract
     */
    extractZip(mongoDBArchive: string, extractPath: string, filter: (file: string) => boolean): Promise<void>;
    /**
     * Download given httpOptions to tempDownloadLocation, then move it to downloadLocation
     * @param url The URL to download the file from
     * @param httpOptions The httpOptions directly passed to https.get
     * @param downloadLocation The location the File should be after the download
     * @param tempDownloadLocation The location the File should be while downloading
     * @param maxRetries Maximum number of retries on download failure
     * @param baseDelay Base delay in milliseconds for retrying the download
     */
    httpDownload(url: URL, httpOptions: RequestOptions, downloadLocation: string, tempDownloadLocation: string, maxRetries?: number, baseDelay?: number): Promise<string>;
    private attemptDownload;
    /**
     * Print the Download Progress to STDOUT
     * @param chunk A chunk to get the length
     */
    printDownloadProgress(chunk: {
        length: number;
    }, forcePrint?: boolean): void;
    /**
     * Helper function to de-duplicate assigning "_downloadingUrl"
     */
    assignDownloadingURL(url: URL): string;
}
export default MongoBinaryDownload;
//# sourceMappingURL=MongoBinaryDownload.d.ts.map