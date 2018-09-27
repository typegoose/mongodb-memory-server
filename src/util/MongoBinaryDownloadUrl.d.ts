/// <reference types='getos' />

import {Os as OS} from 'getos';

export interface MongoBinaryDownloadUrlOpts {
  version: string;
  platform: string;
  arch: string;
  os?: OS;  // getos() result
}

export default class MongoBinaryDownloadUrl {
  constructor(opts: MongoBinaryDownloadUrlOpts);
  getDownloadUrl(): Promise<string>;
  getArchiveName(): Promise<string>;
  getArchiveNameWin(): Promise<string>;
  getArchiveNameOsx(): Promise<string>;
  getArchiveNameLinux(): Promise<string>;
  getos(): Promise<OS>;
  getLinuxOSVersionString(os: OS): string;
  getDebianVersionString(os: OS): string;
  getFedoraVersionString(os: OS): string;
  getRhelVersionString(os: OS): string;
  getElementaryOSVersionString(os: OS): string;
  getLegacyVersionString(os: OS): string;
  getSuseVersionString(os: any): string;
  getUbuntuVersionString(os: OS): string;
  translatePlatform(platform: string): string;
  translateArch(arch: string, mongoPlatform: string): string;
}
