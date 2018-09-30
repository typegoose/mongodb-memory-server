/// <reference types='getos' />

import * as getos from 'getos';

export interface MongoBinaryDownloadUrlOpts {
  version: string;
  platform: string;
  arch: string;
  os?: getos.Os | null;  // getos() result
}

export default class MongoBinaryDownloadUrl {
  platform: string;
  arch: string;
  version: string;
  os: getos.Os | null | undefined;

  constructor(opts: MongoBinaryDownloadUrlOpts);
  getDownloadUrl(): Promise<string>;
  getArchiveName(): Promise<string>;
  getArchiveNameWin(): Promise<string>;
  getArchiveNameOsx(): Promise<string>;
  getArchiveNameLinux(): Promise<string>;
  getos(): Promise<getos.Os>;
  getLinuxOSVersionString(os: getos.Os): string;
  getDebianVersionString(os: getos.Os): string;
  getFedoraVersionString(os: getos.Os): string;
  getRhelVersionString(os: getos.Os): string;
  getElementaryOSVersionString(os: getos.Os): string;
  getLegacyVersionString(os: getos.Os): string;
  getSuseVersionString(os: getos.Os): string;
  getUbuntuVersionString(os: getos.Os): string;
  translatePlatform(platform: string): string;
  translateArch(arch: string, mongoPlatform: string): string;
}
