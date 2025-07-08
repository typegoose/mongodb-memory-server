import { AnyOS, LinuxOS } from './getos';
export interface MongoBinaryDownloadUrlOpts {
    version: string;
    platform: string;
    arch: string;
    os?: AnyOS;
}
/** Set the default ubuntu version number */
export declare const DEFAULT_UBUNTU_YEAR = 22;
/**
 * Download URL generator
 */
export declare class MongoBinaryDownloadUrl implements MongoBinaryDownloadUrlOpts {
    platform: string;
    arch: string;
    version: string;
    os?: AnyOS;
    constructor(opts: MongoBinaryDownloadUrlOpts);
    /**
     * Assemble the URL to download
     * Calls all the necessary functions to determine the URL
     */
    getDownloadUrl(): Promise<string>;
    /**
     * Get the archive
     */
    getArchiveName(): Promise<string>;
    /**
     * Get the archive for Windows
     * (from: https://www.mongodb.org/dl/win32)
     */
    getArchiveNameWin(): string;
    /**
     * Get the archive for OSX (Mac)
     * (from: https://www.mongodb.org/dl/osx)
     */
    getArchiveNameOsx(): string;
    /**
     * Get the archive for Linux
     * (from: https://www.mongodb.org/dl/linux)
     */
    getArchiveNameLinux(): Promise<string>;
    /**
     * Parse and apply config option DISTRO
     */
    protected overwriteDistro(): void;
    /**
     * Get the version string (with distro)
     * @param os LinuxOS Object
     */
    getLinuxOSVersionString(os: LinuxOS): string;
    /**
     * Get the version string for Debian
     * @param os LinuxOS Object
     */
    getDebianVersionString(os: LinuxOS): string;
    /**
     * Get the version string for Fedora
     * @param os LinuxOS Object
     */
    getFedoraVersionString(os: LinuxOS): string;
    /**
     * Get the version string for Red Hat Enterprise Linux
     * @param os LinuxOS Object
     */
    getRhelVersionString(os: LinuxOS): string;
    /**
     * Get the version string for Amazon Distro
     * @param os LinuxOS Object
     */
    getAmazonVersionString(os: LinuxOS): string;
    /**
     * Get the version string for Suse / OpenSuse
     * @param os LinuxOS Object
     */
    getSuseVersionString(os: LinuxOS): string;
    /**
     * Get the version string for Ubuntu
     * @param os LinuxOS Object
     */
    getUbuntuVersionString(os: LinuxOS): string;
    /**
     * Translate input platform to mongodb-archive useable platform
     * @param platform The Platform to translate to a mongodb archive platform
     * @example
     * darwin -> osx
     */
    translatePlatform(platform: string): string;
    /**
     * Translate input arch to mongodb-archive useable arch
     * @param arch The Architecture to translate to a mongodb archive architecture
     * @example
     * x64 -> x86_64
     */
    static translateArch(arch: string): string;
}
export default MongoBinaryDownloadUrl;
//# sourceMappingURL=MongoBinaryDownloadUrl.d.ts.map