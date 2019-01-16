import { DebugPropT, DebugFn, DownloadProgressT } from '../types';

export interface MongoBinaryDownloadOpts {
  version: string;
  downloadDir: string;
  platform: string;
  arch: string;
  debug?: DebugPropT;
}

export default class MongoBinaryDownload {
  debug: DebugFn;
  dlProgress: DownloadProgressT;

  checkMD5: boolean;
  downloadDir: string;
  arch: string;
  version: string;
  platform: string;

  constructor(opts: MongoBinaryDownloadOpts);
  getMongodPath(): Promise<string>;
  startDownload(): Promise<string>;
  makeMd5check(mongoDBArchiveMd5: string, mongoDBArchive: string): Promise<void>;
  download(downloadUrl: string): Promise<string>;
  extract(mongoDBArchive: string): Promise<string>;
  httpDownload(
    httpOptions: any,  // tslint:disable-line:no-any
    downloadLocation: string,
    tempDownloadLocation: string
  ): Promise<string>;
  printDownloadProgress(chunk: any): void;  // tslint:disable-line:no-any
  locationExists(location: string): boolean;
}
