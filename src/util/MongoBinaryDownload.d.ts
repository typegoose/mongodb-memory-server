export interface MongoBinaryDownloadOpts {
  version: string;
  downloadDir: string;
  platform: string;
  arch: string;
  debug?: boolean | Function;
}

interface dlProgress {  // tslint:disable-line
  current: number;
  length: number;
  totalMb: number;
  lastPrintedAt: number;
}

export default class MongoBinaryDownload {
  debug: Function;
  dlProgress: dlProgress;

  downloadDir: string;
  arch: string;
  version: string;
  platform: string;

  constructor(opts: MongoBinaryDownloadOpts);
  getMongodPath(): Promise<string>;
  startDownload(): Promise<string>;
  checkMd5(mongoDBArchiveMd5: string, mongoDBArchive: string): Promise<void>;
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
