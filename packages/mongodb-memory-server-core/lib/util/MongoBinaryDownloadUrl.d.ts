import getos from 'getos';
export interface MongoBinaryDownloadUrlOpts {
    version: string;
    platform: string;
    arch: string;
    os?: getos.Os;
}
export default class MongoBinaryDownloadUrl {
    platform: string;
    arch: string;
    version: string;
    os: getos.Os | undefined;
    constructor({ platform, arch, version, os }: MongoBinaryDownloadUrlOpts);
    getDownloadUrl(): Promise<string>;
    getArchiveName(): Promise<string>;
    getArchiveNameWin(): Promise<string>;
    getArchiveNameOsx(): Promise<string>;
    getArchiveNameLinux(): Promise<string>;
    getos(): Promise<getos.Os>;
    getLinuxOSVersionString(os: getos.LinuxOs): string;
    getDebianVersionString(os: getos.Os): string;
    getFedoraVersionString(os: getos.Os): string;
    getRhelVersionString(os: getos.Os): string;
    getElementaryOSVersionString(os: getos.Os): string;
    getMintVersionString(os: getos.Os): string;
    getLegacyVersionString(os: getos.Os): string;
    getSuseVersionString(os: getos.Os): string;
    getUbuntuVersionString(os: getos.LinuxOs): string;
    translatePlatform(platform: string): string;
    translateArch(arch: string, mongoPlatform: string): string;
}
//# sourceMappingURL=MongoBinaryDownloadUrl.d.ts.map