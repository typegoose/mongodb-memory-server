import { DebugFn, DebugPropT, DownloadProgressT } from '../types';
import HttpsProxyAgent from 'https-proxy-agent';
export interface MongoBinaryDownloadOpts {
    version?: string;
    downloadDir?: string;
    platform?: string;
    arch?: string;
    debug?: DebugPropT;
    checkMD5?: boolean;
}
interface HttpDownloadOptions {
    hostname: string;
    port: string;
    path: string;
    method: 'GET' | 'POST';
    agent: HttpsProxyAgent | undefined;
}
export default class MongoBinaryDownload {
    debug: DebugFn;
    dlProgress: DownloadProgressT;
    _downloadingUrl?: string;
    checkMD5: boolean;
    downloadDir: string;
    arch: string;
    version: string;
    platform: string;
    constructor({ platform, arch, downloadDir, version, checkMD5, debug }: MongoBinaryDownloadOpts);
    getMongodPath(): Promise<string>;
    startDownload(): Promise<string>;
    makeMD5check(urlForReferenceMD5: string, mongoDBArchive: string): Promise<boolean | undefined>;
    download(downloadUrl: string): Promise<string>;
    extract(mongoDBArchive: string): Promise<string>;
    httpDownload(httpOptions: HttpDownloadOptions, downloadLocation: string, tempDownloadLocation: string): Promise<string>;
    printDownloadProgress(chunk: any): void;
    locationExists(location: string): boolean;
}
export {};
//# sourceMappingURL=MongoBinaryDownload.d.ts.map