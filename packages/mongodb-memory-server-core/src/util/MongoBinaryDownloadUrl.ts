import getOS, { AnyOS, LinuxOS } from './getos';
import { execSync } from 'child_process';
import resolveConfig from './resolveConfig';
import debug from 'debug';
import * as semver from 'semver';
import { isNullOrUndefined } from './utils';

const log = debug('MongoMS:MongoBinaryDownloadUrl');

export interface MongoBinaryDownloadUrlOpts {
  version: string;
  platform: string;
  arch: string;
  os?: AnyOS;
}

/**
 * Download URL generator
 */
export class MongoBinaryDownloadUrl {
  platform: string;
  arch: string;
  version: string;
  os: AnyOS | undefined;

  constructor({ platform, arch, version, os }: MongoBinaryDownloadUrlOpts) {
    this.version = version;
    this.platform = this.translatePlatform(platform);
    this.arch = this.translateArch(arch, this.platform);
    this.os = os;
  }

  /**
   * Assemble the URL to download
   * Calls all the necessary functions to determine the URL
   */
  async getDownloadUrl(): Promise<string> {
    const archive = await this.getArchiveName();
    log(`Using "${archive}" as the Archive String`);

    const downloadUrl = resolveConfig('DOWNLOAD_URL');
    if (downloadUrl) {
      log(`Using "${downloadUrl}" as the Download-URL`);
      return downloadUrl;
    }

    const mirror = resolveConfig('DOWNLOAD_MIRROR') ?? 'https://fastdl.mongodb.org';
    log(`Using "${mirror}" as the mirror`);

    return `${mirror}/${this.platform}/${archive}`;
  }

  /**
   * Get the archive
   * Version independent
   */
  async getArchiveName(): Promise<string> {
    const archive_name = resolveConfig('ARCHIVE_NAME');
    if (!isNullOrUndefined(archive_name) && archive_name.length > 0) {
      return archive_name;
    }
    switch (this.platform) {
      case 'osx':
        return this.getArchiveNameOsx();
      case 'win32':
      case 'windows':
        return this.getArchiveNameWin();
      case 'linux':
      default:
        return this.getArchiveNameLinux();
    }
  }

  /**
   * Get the archive for Windows
   * (from: https://www.mongodb.org/dl/win32)
   */
  getArchiveNameWin(): string {
    let name = `mongodb-${this.platform}`;
    name += `-${this.arch}`;
    if (!isNullOrUndefined(semver.coerce(this.version))) {
      if (semver.satisfies(this.version, '4.2.x')) {
        name += '-2012plus';
      } else if (semver.lt(this.version, '4.0.0')) {
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
  getArchiveNameOsx(): string {
    let name = `mongodb-osx`;
    const version = semver.coerce(this.version);
    if (!isNullOrUndefined(version) && semver.gte(version, '3.2.0')) {
      name += '-ssl';
    }
    if (isNullOrUndefined(version) || semver.gte(version, '4.2.0')) {
      name = `mongodb-macos`; // somehow these files are not listed in https://www.mongodb.org/dl/osx
    }
    name += `-${this.arch}`;
    name += `-${this.version}.tgz`;
    return name;
  }

  /**
   * Get the archive for Linux
   * (from: https://www.mongodb.org/dl/linux)
   */
  async getArchiveNameLinux(): Promise<string> {
    let name = `mongodb-linux`;
    name += `-${this.arch}`;

    let osString: string | undefined;
    if (this.arch !== 'i686') {
      if (!this.os) {
        this.os = await getOS();
      }
      osString = this.getLinuxOSVersionString(this.os as LinuxOS);
    }
    if (osString) {
      name += `-${osString}`;
    }

    name += `-${this.version}.tgz`;

    return name;
  }

  /**
   * Get the version string (with distro)
   * @param os LinuxOS Object
   */
  getLinuxOSVersionString(os: LinuxOS): string {
    if (/ubuntu/i.test(os.dist)) {
      return this.getUbuntuVersionString(os);
    } else if (/elementary OS/i.test(os.dist)) {
      return this.getElementaryOSVersionString(os);
    } else if (/suse/i.test(os.dist)) {
      return this.getSuseVersionString(os);
    } else if (/rhel/i.test(os.dist) || /centos/i.test(os.dist) || /scientific/i.test(os.dist)) {
      return this.getRhelVersionString(os);
    } else if (/fedora/i.test(os.dist)) {
      return this.getFedoraVersionString(os);
    } else if (/debian/i.test(os.dist)) {
      return this.getDebianVersionString(os);
    } else if (/\s+mint\s*$/i.test(os.dist)) {
      return this.getMintVersionString(os);
    } else if (/arch/i.test(os.dist)) {
      console.warn('There is no offical build of MongoDB for ArchLinux!');
    } else if (/alpine/i.test(os.dist)) {
      console.warn('There is no offical build of MongoDB for Alpine!');
    } else if (/unkown/i.test(os.dist)) {
      // "unkown" is likely to happen if no release file / command could be found
      console.warn(
        'Couldnt parse dist infomation, please report this to https://github.com/nodkz/mongodb-memory-server/issues'
      );
    } else {
      // warn if no case for the *parsed* distro is found
      console.warn(`Unknown linux distro ${os.dist}`);
    }
    // warn for the fallback
    console.warn(`Falling back to legacy MongoDB build!`);

    return this.getLegacyVersionString(os);
  }

  /**
   * Get the version string for Debain
   * @param os LinuxOS Object
   */
  getDebianVersionString(os: LinuxOS): string {
    let name = 'debian';
    const release: number = parseFloat(os.release);
    if (release >= 10 || os.release === 'unstable') {
      name += '10';
    } else if (release >= 9) {
      name += '92';
    } else if (release >= 8.1) {
      name += '81';
    } else if (release >= 7.1) {
      name += '71';
    }
    return name;
  }

  /**
   * Get the version string for Fedora
   * @param os LinuxOS Object
   */
  getFedoraVersionString(os: LinuxOS): string {
    let name = 'rhel';
    const fedoraVer: number = parseInt(os.release, 10);
    if (fedoraVer > 18) {
      name += '70';
    } else if (fedoraVer < 19 && fedoraVer >= 12) {
      name += '62';
    } else if (fedoraVer < 12 && fedoraVer >= 6) {
      name += '55';
    }
    return name;
  }

  /**
   * Get the version string for Red Hat Enterprise Linux
   * @param os LinuxOS Object
   */
  getRhelVersionString(os: LinuxOS): string {
    let name = 'rhel';
    const { release } = os;
    if (release) {
      if (/^8/.test(release)) {
        name += '80';
      } else if (/^7/.test(release)) {
        name += '70';
      } else if (/^6/.test(release)) {
        name += '62';
      } else if (/^5/.test(release)) {
        name += '55';
      }
    }
    return name;
  }

  /**
   * Get the version string for ElementaryOS
   * @param os LinuxOS Object
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getElementaryOSVersionString(os: LinuxOS): string {
    // Elementary specific - get used ubuntu version
    const ubuntuVersion = execSync('/usr/bin/lsb_release -u -rs');
    try {
      // confirm it is actually a version, otherwise throw an error
      parseFloat(ubuntuVersion.toString());

      return `ubuntu${ubuntuVersion.toString().replace('.', '').trim()}`;
    } catch (err) {
      console.error('ElementaryOS "lsb_relese -u -rs" couldnt be executed!');
      throw err;
    }
  }

  /**
   * Get the version string for Linux Mint
   * @param os LinuxOS Object
   */
  getMintVersionString(os: LinuxOS): string {
    let name = 'ubuntu';
    const mintMajorVer = parseInt(os.release ? os.release.split('.')[0] : os.release);
    if (mintMajorVer < 17) {
      throw new Error('Mint Versions under 17 are not supported!');
    }

    switch (mintMajorVer) {
      case 17:
        name += '1404';
        break;
      case 18:
        name += '1604';
        break;
      case 19:
      default:
        // a default to support versions > 19
        name += '1804';
        break;
    }

    return name;
  }

  /**
   * Linux Fallback
   * @param os LinuxOS Object
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getLegacyVersionString(os: AnyOS): string {
    return '';
  }

  /**
   * Get the version string for Suse / OpenSuse
   * @param os LinuxOS Object
   */
  getSuseVersionString(os: LinuxOS): string {
    const releaseMatch: RegExpMatchArray | null = os.release.match(/(^11|^12)/);

    return releaseMatch ? `suse${releaseMatch[0]}` : '';
  }

  /**
   * Get the version string for Ubuntu
   * @param os LinuxOS Object
   */
  getUbuntuVersionString(os: LinuxOS): string {
    let name = 'ubuntu';
    const ubuntuVer: string[] = os.release ? os.release.split('.') : [];
    const majorVer: number = parseInt(ubuntuVer[0], 10);
    // const minorVer: string = ubuntuVer[1];

    if (os.release === '12.04') {
      name += '1204';
    } else if (os.release === '14.04') {
      name += '1404';
    } else if (os.release === '14.10') {
      name += '1410-clang';
    } else if (majorVer === 14) {
      name += '1404';
    } else if (os.release === '16.04') {
      name += '1604';
    } else if (majorVer === 16) {
      name += '1604';
    } else if (majorVer >= 18) {
      if (this.version && this.version.indexOf('3.') === 0) {
        // For MongoDB 3.x using 1604 binaries, download distro does not have builds for Ubuntu 1804
        // https://www.mongodb.org/dl/linux/x86_64-ubuntu1604
        name += '1604';
      } else {
        // See fulllist of versions https://www.mongodb.org/dl/linux/x86_64-ubuntu1804
        name += '1804';
      }
    } else {
      name += '1404';
    }
    return name;
  }

  /**
   * Translate input platform to mongodb useable platfrom
   * @example
   * darwin -> osx
   * @param platform The Platform to translate
   */
  translatePlatform(platform: string): string {
    switch (platform) {
      case 'darwin':
        return 'osx';
      case 'win32':
        const version = semver.coerce(this.version);
        if (isNullOrUndefined(version)) {
          return 'windows';
        }
        return semver.gte(version, '4.3.0') ? 'windows' : 'win32';
      case 'linux':
      case 'elementary OS':
        return 'linux';
      case 'sunos':
        return 'sunos5';
      default:
        throw new Error(`unsupported OS ${platform}`);
    }
  }

  /**
   * Translate input arch to mongodb useable arch
   * @example
   * x64 -> x86_64
   * @param platform The Platform to translate
   */
  translateArch(arch: string, mongoPlatform: string): string {
    if (arch === 'ia32') {
      if (mongoPlatform === 'linux') {
        return 'i686';
      } else if (mongoPlatform === 'win32') {
        return 'i386';
      }
      throw new Error('unsupported architecture');
    } else if (arch === 'x64') {
      return 'x86_64';
    } else {
      throw new Error('unsupported architecture, ia32 and x64 are the only valid options');
    }
  }
}

export default MongoBinaryDownloadUrl;
