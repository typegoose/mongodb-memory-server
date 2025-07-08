"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoBinaryDownloadUrl = exports.DEFAULT_UBUNTU_YEAR = void 0;
const tslib_1 = require("tslib");
const getos_1 = require("./getos");
const resolveConfig_1 = require("./resolveConfig");
const debug_1 = tslib_1.__importDefault(require("debug"));
const semver = tslib_1.__importStar(require("semver"));
const utils_1 = require("./utils");
const url_1 = require("url");
const errors_1 = require("./errors");
const log = (0, debug_1.default)('MongoMS:MongoBinaryDownloadUrl');
/** Set the default ubuntu version number */
exports.DEFAULT_UBUNTU_YEAR = 22; // TODO: try to keep this up-to-date to the latest LTS
/**
 * Download URL generator
 */
class MongoBinaryDownloadUrl {
    constructor(opts) {
        this.version = opts.version;
        this.platform = this.translatePlatform(opts.platform);
        this.arch = MongoBinaryDownloadUrl.translateArch(opts.arch);
        this.os = opts.os;
    }
    /**
     * Assemble the URL to download
     * Calls all the necessary functions to determine the URL
     */
    async getDownloadUrl() {
        const downloadUrl = (0, resolveConfig_1.resolveConfig)(resolveConfig_1.ResolveConfigVariables.DOWNLOAD_URL);
        if (downloadUrl) {
            log(`Using "${downloadUrl}" as the Download-URL`);
            const url = new url_1.URL(downloadUrl); // check if this is an valid url
            return url.toString();
        }
        const archive = await this.getArchiveName();
        log(`Using "${archive}" as the Archive String`);
        const mirror = (0, resolveConfig_1.resolveConfig)(resolveConfig_1.ResolveConfigVariables.DOWNLOAD_MIRROR) ?? 'https://fastdl.mongodb.org';
        log(`Using "${mirror}" as the mirror`);
        const url = new url_1.URL(mirror);
        // ensure that the "mirror" path ends with "/"
        if (!url.pathname.endsWith('/')) {
            url.pathname = url.pathname + '/';
        }
        // no extra "/" between "pathname" and "platfrom", because of the "if" statement above to ensure "url.pathname" to end with "/"
        url.pathname = `${url.pathname}${this.platform}/${archive}`;
        return url.toString();
    }
    /**
     * Get the archive
     */
    async getArchiveName() {
        const archive_name = (0, resolveConfig_1.resolveConfig)(resolveConfig_1.ResolveConfigVariables.ARCHIVE_NAME);
        // double-"!" to not include falsy values
        if (!!archive_name) {
            return archive_name;
        }
        switch (this.platform) {
            case 'osx':
                return this.getArchiveNameOsx();
            case 'win32':
            case 'windows':
                return this.getArchiveNameWin();
            case 'linux':
                return this.getArchiveNameLinux();
            default:
                throw new errors_1.UnknownPlatformError(this.platform);
        }
    }
    /**
     * Get the archive for Windows
     * (from: https://www.mongodb.org/dl/win32)
     */
    getArchiveNameWin() {
        let name = `mongodb-${this.platform}-${this.arch}`;
        const coercedVersion = semver.coerce(this.version);
        if (!(0, utils_1.isNullOrUndefined)(coercedVersion)) {
            if (semver.satisfies(coercedVersion, '4.2.x')) {
                name += '-2012plus';
            }
            else if (semver.lt(coercedVersion, '4.1.0')) {
                name += '-2008plus-ssl';
            }
        }
        name += `-${this.version}.zip`;
        return name;
    }
    /**
     * Get the archive for OSX (Mac)
     * (from: https://www.mongodb.org/dl/osx)
     */
    getArchiveNameOsx() {
        let name = `mongodb-osx`;
        const coercedVersion = semver.coerce(this.version);
        if (!(0, utils_1.isNullOrUndefined)(coercedVersion) && semver.gte(coercedVersion, '3.2.0')) {
            name += '-ssl';
        }
        if ((0, utils_1.isNullOrUndefined)(coercedVersion) || semver.gte(coercedVersion, '4.2.0')) {
            name = `mongodb-macos`; // somehow these files are not listed in https://www.mongodb.org/dl/osx
        }
        // mongodb has native arm64
        if (this.arch === 'aarch64') {
            // force usage of "x86_64" binary for all versions below than 6.0.0
            if (!(0, utils_1.isNullOrUndefined)(coercedVersion) && semver.lt(coercedVersion, '6.0.0')) {
                log('getArchiveNameOsx: Arch is "aarch64" and version is below 6.0.0, using x64 binary');
                this.arch = 'x86_64';
            }
            else {
                log('getArchiveNameOsx: Arch is "aarch64" and version is above or equal to 6.0.0, using arm64 binary');
                // naming for macos is still "arm64" instead of "aarch64"
                this.arch = 'arm64';
            }
        }
        name += `-${this.arch}-${this.version}.tgz`;
        return name;
    }
    /**
     * Get the archive for Linux
     * (from: https://www.mongodb.org/dl/linux)
     */
    async getArchiveNameLinux() {
        if (!this.os && (0, resolveConfig_1.resolveConfig)(resolveConfig_1.ResolveConfigVariables.DISTRO)) {
            this.os = await (0, getos_1.getOS)();
        }
        if ((0, resolveConfig_1.resolveConfig)(resolveConfig_1.ResolveConfigVariables.DISTRO)) {
            this.overwriteDistro();
        }
        const osString = this.getLinuxOSVersionString(this.os);
        // this is below, to allow overwriting the arch (like arm64 to aarch64)
        let name = `mongodb-linux-${this.arch}`;
        // guard against any falsy values
        if (!!osString) {
            name += `-${osString}`;
        }
        name += `-${this.version}.tgz`;
        return name;
    }
    /**
     * Parse and apply config option DISTRO
     */
    overwriteDistro() {
        const env = (0, resolveConfig_1.resolveConfig)(resolveConfig_1.ResolveConfigVariables.DISTRO);
        if ((0, utils_1.isNullOrUndefined)(env)) {
            return;
        }
        const split = env.split('-');
        const distro = split[0];
        const release = split[1];
        if ((0, utils_1.isNullOrUndefined)(distro)) {
            throw new errors_1.GenericMMSError('Expected DISTRO option to have a distro like "ubuntu-18.04"');
        }
        if ((0, utils_1.isNullOrUndefined)(release)) {
            throw new errors_1.GenericMMSError('Expected DISTRO option to have a release like "ubuntu-18.04" (delimited by "-")');
        }
        this.os = {
            os: 'linux',
            dist: distro,
            release: release,
        };
    }
    /**
     * Get the version string (with distro)
     * @param os LinuxOS Object
     */
    getLinuxOSVersionString(os) {
        if (regexHelper(/ubuntu/i, os)) {
            return this.getUbuntuVersionString(os);
        }
        else if (regexHelper(/amzn/i, os)) {
            return this.getAmazonVersionString(os);
        }
        else if (regexHelper(/suse/i, os)) {
            return this.getSuseVersionString(os);
            // handle "oracle linux"(ol) as "rhel", because they define "id_like: fedora", but the versions themself match up with rhel
        }
        else if (regexHelper(/(rhel|centos|scientific|^ol$)/i, os)) {
            return this.getRhelVersionString(os);
        }
        else if (regexHelper(/fedora/i, os)) {
            return this.getFedoraVersionString(os);
        }
        else if (regexHelper(/debian/i, os)) {
            return this.getDebianVersionString(os);
        }
        else if (regexHelper(/alpine/i, os)) {
            console.warn('There is no official build of MongoDB for Alpine!');
            // Match "arch", "archlinux", "manjaro", "manjarolinux", "arco", "arcolinux"
        }
        else if (regexHelper(/(arch|manjaro|arco)(?:linux)?$/i, os)) {
            console.warn(`There is no official build of MongoDB for ArchLinux (${os.dist}). Falling back to Ubuntu 22.04 release.`);
            return this.getUbuntuVersionString({
                os: 'linux',
                dist: 'Ubuntu Linux',
                release: '22.04',
            });
        }
        else if (regexHelper(/gentoo/i, os)) {
            // it seems like debian binaries work for gentoo too (at least most), see https://github.com/typegoose/mongodb-memory-server/issues/639
            console.warn(`There is no official build of MongoDB for Gentoo (${os.dist}). Falling back to Debian.`);
            return this.getDebianVersionString({
                os: 'linux',
                dist: 'Debian',
                release: '11',
            });
        }
        else if (regexHelper(/unknown/i, os)) {
            // "unknown" is likely to happen if no release file / command could be found
            console.warn('Couldnt parse dist information, please report this to https://github.com/typegoose/mongodb-memory-server/issues');
        }
        // mongodb does not ship generic linux builds anymore
        throw new errors_1.UnknownLinuxDistro(os.dist, os.id_like ?? []);
    }
    /**
     * Get the version string for Debian
     * @param os LinuxOS Object
     */
    getDebianVersionString(os) {
        let name = 'debian';
        const release = parseFloat(os.release);
        const coercedVersion = semver.coerce(this.version);
        if ((0, utils_1.isNullOrUndefined)(coercedVersion)) {
            throw new errors_1.UnknownVersionError(this.version);
        }
        // without any "release"(empty string), fallback to testing
        // see https://tracker.debian.org/news/1433360/accepted-base-files-13-source-into-unstable/
        const isTesting = ['unstable', 'testing', ''].includes(os.release);
        if (isTesting || release >= 12) {
            name += '12';
        }
        else if (release >= 11) {
            // Debian 11 is compatible with the binaries for debian 10
            // but does not have binaries for before 5.0.8
            // and only set to use "debian10" if the requested version is not a latest version
            if (semver.lt(coercedVersion, '5.0.8') && !testVersionIsLatest(this.version)) {
                log('debian11 detected, but version below 5.0.8 requested, using debian10');
                name += '10';
            }
            else {
                name += '11';
            }
        }
        else if (release >= 10) {
            name += '10';
        }
        else if (release >= 9) {
            name += '92';
        }
        else if (release >= 8.1) {
            name += '81';
        }
        else if (release >= 7.1) {
            name += '71';
        }
        if (isTesting || release >= 12) {
            if (semver.lt(coercedVersion, '7.0.3') && !testVersionIsLatest(this.version)) {
                throw new errors_1.KnownVersionIncompatibilityError(`Debian ${release || os.release || os.codename}`, this.version, '>=7.0.3', 'Mongodb does not provide binaries for versions before 7.0.3 for Debian 12+ and also cannot be mapped to a previous Debian release');
            }
        }
        else if (release >= 10) {
            if (semver.lt(coercedVersion, '4.2.1') && !testVersionIsLatest(this.version)) {
                throw new errors_1.KnownVersionIncompatibilityError(`Debian ${release || os.release || os.codename}`, this.version, '>=4.2.1', 'Mongodb does not provide binaries for versions before 4.2.1 for Debian 10+ and also cannot be mapped to a previous Debian release');
            }
        }
        return name;
    }
    /**
     * Get the version string for Fedora
     * @param os LinuxOS Object
     */
    getFedoraVersionString(os) {
        const fedoraVer = parseInt(os.release, 10);
        const rhelOS = {
            os: 'linux',
            dist: 'rhel',
            // fallback to 8.0
            release: '8.0',
        };
        // 36 and onwards dont ship with libcrypto.so.1.1 anymore and need to be manually installed ("openssl1.1")
        // 34 onward dosnt have "compat-openssl10" anymore, and only build from 4.0.24 are available for "rhel80"
        if (fedoraVer >= 34) {
            rhelOS.release = '8.0';
        }
        else if (fedoraVer >= 19) {
            rhelOS.release = '7.0';
        }
        else if (fedoraVer >= 12) {
            rhelOS.release = '6.2';
        }
        else if (fedoraVer >= 6) {
            rhelOS.release = '5.5';
        }
        return this.getRhelVersionString(rhelOS);
    }
    /**
     * Get the version string for Red Hat Enterprise Linux
     * @param os LinuxOS Object
     */
    getRhelVersionString(os) {
        let name = 'rhel';
        const { release } = os;
        const releaseAsSemver = semver.coerce(release); // coerce "8" to "8.0.0" and "8.2" to "8.2.0", makes comparing easier than "parseInt" or "parseFloat"
        const coercedVersion = semver.coerce(this.version);
        if ((0, utils_1.isNullOrUndefined)(coercedVersion)) {
            throw new errors_1.UnknownVersionError(this.version);
        }
        if (releaseAsSemver) {
            // extra checks for architecture aarch64 (arm64)
            // should not assign "name" by itself
            if (this.arch === 'aarch64') {
                // there are no versions for aarch64 before rhel 8.2 (or currently after)
                if (semver.lt(releaseAsSemver, '8.2.0')) {
                    throw new errors_1.KnownVersionIncompatibilityError(`Rhel ${release} arm64`, this.version, '>=4.4.2', 'ARM64(aarch64) support for rhel is only for rhel82 or higher');
                }
                // there are no versions for aarch64 before mongodb 4.4.2
                // Note: version 4.4.2 and 4.4.3 are NOT listed at the list, but are existing; list: https://www.mongodb.com/download-center/community/releases/archive
                if (semver.lt(coercedVersion, '4.4.2') && !testVersionIsLatest(this.version)) {
                    throw new errors_1.KnownVersionIncompatibilityError(`Rhel ${release} arm64`, this.version, '>=4.4.2');
                }
                // rhel 9 does not provide openssl 1.1 anymore, making it incompatible with previous versions
                // lowest rhel9 arm64 is 6.0.7
                if (semver.satisfies(releaseAsSemver, '>=9.0.0') && semver.lt(coercedVersion, '6.0.7')) {
                    throw new errors_1.KnownVersionIncompatibilityError(`Rhel ${release} arm64`, this.version, '>=6.0.7');
                }
            }
            if (semver.satisfies(releaseAsSemver, '>=9.0.0')) {
                // there are only binaries for rhel90 since 6.0.4
                name += '90';
            }
            else if (semver.satisfies(releaseAsSemver, '8.2.0') && this.arch == 'aarch64') {
                // Mongodb changed its naming for rhel8 only https://jira.mongodb.org/browse/SERVER-92375
                // NOTE: as of 10.10.2024 `(rhel8|rhel80)-7.0.13` is not downloadable but `7.0.14` is
                if (semver.satisfies(coercedVersion, '^5.0.29 || ^6.0.17 || ^7.0.13 || ^8.0.0')) {
                    name += '8';
                }
                else {
                    name += '82';
                }
            }
            else if (semver.satisfies(releaseAsSemver, '^8.0.0')) {
                // Mongodb changed its naming for rhel8 only https://jira.mongodb.org/browse/SERVER-92375
                // NOTE: as of 10.10.2024 `(rhel8|rhel80)-7.0.13` is not downloadable but `7.0.14` is
                if (semver.satisfies(coercedVersion, '^5.0.29 || ^6.0.17 || ^7.0.13 || ^8.0.0')) {
                    name += '8';
                }
                else {
                    name += '80';
                }
            }
            else if (semver.satisfies(releaseAsSemver, '^7.0.0')) {
                name += '70';
            }
            else if (semver.satisfies(releaseAsSemver, '^6.0.0')) {
                name += '62';
            }
            else if (semver.satisfies(releaseAsSemver, '^5.0.0')) {
                name += '55';
            }
            else {
                console.warn(`Unhandled RHEL version: "${release}"("${this.arch}")`);
            }
        }
        else {
            console.warn(`Couldnt coerce RHEL version "${release}"`);
        }
        // fallback if name has not been modified yet
        if (name === 'rhel') {
            log('getRhelVersionString: falling back to "70"');
            // fallback to "70", because that is what currently is supporting 3.6 to 5.0 and should work with many
            name += '70';
        }
        return name;
    }
    /**
     * Get the version string for Amazon Distro
     * @param os LinuxOS Object
     */
    getAmazonVersionString(os) {
        let name = 'amazon';
        const release = parseInt(os.release, 10);
        if (release >= 2) {
            name += release.toString();
        }
        // dont add anthing as fallback, because for "amazon 1", mongodb just uses "amazon"
        return name;
    }
    /**
     * Get the version string for Suse / OpenSuse
     * @param os LinuxOS Object
     */
    // TODO: add tests for getSuseVersionString
    getSuseVersionString(os) {
        const releaseMatch = os.release.match(/(^11|^12|^15)/);
        return releaseMatch ? `suse${releaseMatch[0]}` : '';
    }
    /**
     * Get the version string for Ubuntu
     * @param os LinuxOS Object
     */
    getUbuntuVersionString(os) {
        let ubuntuOS = undefined;
        const coercedVersion = semver.coerce(this.version);
        if ((0, utils_1.isNullOrUndefined)(coercedVersion)) {
            throw new errors_1.UnknownVersionError(this.version);
        }
        // "id_like" processing (version conversion) [this is an block to be collapsible]
        {
            if (/^linux\s?mint\s*$/i.test(os.dist)) {
                const mintToUbuntuRelease = {
                    17: '14.04',
                    18: '16.04',
                    19: '18.04',
                    20: '20.04',
                    21: '22.04',
                    22: '24.04',
                };
                ubuntuOS = {
                    os: 'linux',
                    dist: 'ubuntu',
                    release: mintToUbuntuRelease[parseInt(os.release.split('.')[0])] || mintToUbuntuRelease[21],
                };
            }
            if (/^elementary(?:\s?os)?\s*$/i.test(os.dist)) {
                const elementaryToUbuntuRelease = {
                    3: '14.04',
                    4: '16.04',
                    5: '18.04',
                    6: '20.04',
                    7: '22.04',
                };
                // untangle elemenatary versioning from hell https://en.wikipedia.org/wiki/Elementary_OS#Development
                const [elementaryMajor, elementaryMinor] = os.release.split('.').map((el) => parseInt(el));
                // versions below 5.0 were named 0.X, and so use the minor version if major is 0
                const realMajor = elementaryMajor || elementaryMinor;
                ubuntuOS = {
                    os: 'linux',
                    dist: 'ubuntu',
                    release: elementaryToUbuntuRelease[realMajor] || elementaryToUbuntuRelease[7],
                };
            }
        }
        if ((0, utils_1.isNullOrUndefined)(ubuntuOS)) {
            // Warn against distros that have a ID_LIKE set to "ubuntu", but no other upstream information and are not specially mapped (see above)
            if (!/^ubuntu(?:| linux)\s*$/i.test(os.dist)) {
                console.warn(`Unmapped distro "${os.dist}" with ID_LIKE "ubuntu", defaulting to highest ubuntu version!\n` +
                    'This means that your distro does not have a internal mapping in MMS or does not have a upstream release file (like "/etc/upstream-release/lsb-release"), but has set a ID_LIKE');
                ubuntuOS = {
                    os: 'linux',
                    dist: 'ubuntu',
                    release: `${exports.DEFAULT_UBUNTU_YEAR}.04`,
                };
            }
            else {
                ubuntuOS = os;
            }
        }
        let ubuntuYear = parseInt(ubuntuOS.release.split('.')[0], 10);
        if (Number.isNaN(ubuntuYear)) {
            console.warn(`Could not parse ubuntu year from "${ubuntuOS.release}", using default`);
            ubuntuYear = exports.DEFAULT_UBUNTU_YEAR;
        }
        if (this.arch === 'aarch64') {
            // this is because, before version 4.1.10, everything for "arm64" / "aarch64" were just "arm64" and for "ubuntu1604"
            if (semver.satisfies(coercedVersion, '<4.1.10')) {
                this.arch = 'arm64';
                return 'ubuntu1604';
            }
            // this is because versions below "4.4.0" did not provide an binary for anything above 1804
            if (semver.satisfies(coercedVersion, '>=4.1.10 <4.4.0')) {
                return 'ubuntu1804';
            }
        }
        if (ubuntuOS.release === '14.10') {
            return 'ubuntu1410-clang';
        }
        // there are no MongoDB 3.x binary distributions for ubuntu >= 18
        // https://www.mongodb.org/dl/linux/x86_64-ubuntu1604
        if (ubuntuYear >= 18 && semver.satisfies(coercedVersion, '3.x.x')) {
            log(`getUbuntuVersionString: ubuntuYear is "${ubuntuYear}", which dosnt have an 3.x.x version, defaulting to "1604"`);
            return 'ubuntu1604';
        }
        // there are no MongoDB <=4.3.x binary distributions for ubuntu > 18
        // https://www.mongodb.org/dl/linux/x86_64-ubuntu1804
        if (ubuntuYear > 18 && semver.satisfies(coercedVersion, '<=4.3.x')) {
            log(`getUbuntuVersionString: ubuntuYear is "${ubuntuYear}", which dosnt have an "<=4.3.x" version, defaulting to "1804"`);
            return 'ubuntu1804';
        }
        // there are only binaries for 2204 since 6.0.4 (and not binaries for ubuntu2104)
        if (ubuntuYear >= 21 && semver.satisfies(coercedVersion, '<6.0.4')) {
            return 'ubuntu2004';
        }
        // there are only binaries for 2404 since 8.0.0, not in 7.x
        if (ubuntuYear >= 22 && semver.satisfies(coercedVersion, '<8.0.0')) {
            return 'ubuntu2204';
        }
        // base case for higher than mongodb supported ubuntu versions
        {
            // TODO: try to keep this up-to-date to the latest mongodb supported ubuntu version
            /**
             * Highest ubuntu year supported by mongodb binaries
             * @see https://www.mongodb.com/download-center/community/releases/archive
             */
            const highestUbuntuYear = 24; // 24 is the highest supported as of mongodb 8.0.1
            if (ubuntuYear > highestUbuntuYear) {
                log(`getUbuntuVersionString: ubuntuYear "${ubuntuYear}" is higher than the currently supported mongodb year of "${highestUbuntuYear}", using highest known`);
                return 'ubuntu2404';
            }
        }
        // the "04" version always exists for ubuntu, use that as default
        return `ubuntu${ubuntuYear}04`;
    }
    /**
     * Translate input platform to mongodb-archive useable platform
     * @param platform The Platform to translate to a mongodb archive platform
     * @example
     * darwin -> osx
     */
    translatePlatform(platform) {
        switch (platform) {
            case 'darwin':
                return 'osx';
            case 'win32':
                const version = semver.coerce(this.version);
                if ((0, utils_1.isNullOrUndefined)(version)) {
                    return 'windows';
                }
                return semver.gte(version, '4.3.0') ? 'windows' : 'win32';
            case 'linux':
                return 'linux';
            default:
                throw new errors_1.UnknownPlatformError(platform);
        }
    }
    /**
     * Translate input arch to mongodb-archive useable arch
     * @param arch The Architecture to translate to a mongodb archive architecture
     * @example
     * x64 -> x86_64
     */
    static translateArch(arch) {
        switch (arch) {
            case 'x86_64':
            case 'x64':
                return 'x86_64';
            case 'arm64':
            case 'aarch64':
                return 'aarch64';
            default:
                throw new errors_1.UnknownArchitectureError(arch);
        }
    }
}
exports.MongoBinaryDownloadUrl = MongoBinaryDownloadUrl;
exports.default = MongoBinaryDownloadUrl;
/**
 * Helper function to reduce code / regex duplication
 */
function regexHelper(regex, os) {
    return (regex.test(os.dist) ||
        (!(0, utils_1.isNullOrUndefined)(os.id_like) ? os.id_like.filter((v) => regex.test(v)).length >= 1 : false));
}
/** Helper to consistently test if a version is a "-latest" version, like "v5.0-latest" */
function testVersionIsLatest(version) {
    return /^v\d+\.\d+-latest$/.test(version);
}
//# sourceMappingURL=MongoBinaryDownloadUrl.js.map