import { getOS, AnyOS, LinuxOS } from './getos';
import { resolveConfig, ResolveConfigVariables } from './resolveConfig';
import debug from 'debug';
import * as semver from 'semver';
import { isNullOrUndefined } from './utils';
import { URL } from 'url';
import {
  KnownVersionIncompatibilityError,
  UnknownArchitectureError,
  UnknownPlatformError,
} from './errors';
import { deprecate } from 'util';

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
export class MongoBinaryDownloadUrl implements MongoBinaryDownloadUrlOpts {
  platform: string;
  arch: string;
  version: string;
  os?: AnyOS;

  constructor(opts: MongoBinaryDownloadUrlOpts) {
    this.version = opts.version;
    this.platform = this.translatePlatform(opts.platform);
    this.arch = MongoBinaryDownloadUrl.translateArch(opts.arch, this.platform);
    this.os = opts.os;
  }

  /**
   * Assemble the URL to download
   * Calls all the necessary functions to determine the URL
   */
  async getDownloadUrl(): Promise<string> {
    const downloadUrl = resolveConfig(ResolveConfigVariables.DOWNLOAD_URL);

    if (downloadUrl) {
      log(`Using "${downloadUrl}" as the Download-URL`);

      const url = new URL(downloadUrl); // check if this is an valid url

      return url.toString();
    }

    const archive = await this.getArchiveName();
    log(`Using "${archive}" as the Archive String`);

    const mirror =
      resolveConfig(ResolveConfigVariables.DOWNLOAD_MIRROR) ?? 'https://fastdl.mongodb.org';
    log(`Using "${mirror}" as the mirror`);

    const url = new URL(mirror);

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
  async getArchiveName(): Promise<string> {
    const archive_name = resolveConfig(ResolveConfigVariables.ARCHIVE_NAME);

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
        throw new UnknownPlatformError(this.platform);
    }
  }

  /**
   * Get the archive for Windows
   * (from: https://www.mongodb.org/dl/win32)
   */
  getArchiveNameWin(): string {
    let name = `mongodb-${this.platform}-${this.arch}`;

    if (!isNullOrUndefined(semver.coerce(this.version))) {
      if (semver.satisfies(this.version, '4.2.x')) {
        name += '-2012plus';
      } else if (semver.lt(this.version, '4.1.0')) {
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

    if (this.arch === 'aarch64') {
      log('getArchiveNameOsx: Arch is "aarch64", using x64 binary');
      this.arch = 'x86_64';
    }

    name += `-${this.arch}-${this.version}.tgz`;

    return name;
  }

  /**
   * Get the archive for Linux
   * (from: https://www.mongodb.org/dl/linux)
   */
  async getArchiveNameLinux(): Promise<string> {
    let osString: string | undefined;

    // the highest version for "i686" seems to be 3.3
    if (this.arch !== 'i686') {
      if (!this.os) {
        this.os = await getOS();
      }

      osString = this.getLinuxOSVersionString(this.os as LinuxOS);
    }

    // this is below, to allow overwriting the arch (like arm64 to aarch64)
    let name = `mongodb-linux-${this.arch}`;

    if (!!osString) {
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
    if (regexHelper(/ubuntu/i, os)) {
      return this.getUbuntuVersionString(os);
    } else if (regexHelper(/amzn/i, os)) {
      return this.getAmazonVersionString(os);
    } else if (regexHelper(/suse/i, os)) {
      return this.getSuseVersionString(os);
    } else if (regexHelper(/(rhel|centos|scientific)/i, os)) {
      return this.getRhelVersionString(os);
    } else if (regexHelper(/fedora/i, os)) {
      return this.getFedoraVersionString(os);
    } else if (regexHelper(/debian/i, os)) {
      return this.getDebianVersionString(os);
    } else if (regexHelper(/alpine/i, os)) {
      console.warn('There is no offical build of MongoDB for Alpine!');
      // Match "arch", "archlinux", "manjaro", "manjarolinux", "arco", "arcolinux"
    } else if (regexHelper(/(arch|manjaro|arco)(?:linux)?$/i, os)) {
      console.warn(
        `There is no official build of MongoDB for ArchLinux (${os.dist}). Falling back to Ubuntu 20.04 release.`
      );

      return this.getUbuntuVersionString({
        os: 'linux',
        dist: 'Ubuntu Linux',
        release: '20.04',
      });
    } else if (regexHelper(/gentoo/i, os)) {
      // it seems like debian binaries work for gentoo too (at least most), see https://github.com/nodkz/mongodb-memory-server/issues/639
      console.warn(
        `There is no official build of MongoDB for Gentoo (${os.dist}). Falling back to Debian.`
      );

      return this.getDebianVersionString({
        os: 'linux',
        dist: 'Debian',
        release: '11',
      });
    } else if (regexHelper(/unknown/i, os)) {
      // "unknown" is likely to happen if no release file / command could be found
      console.warn(
        'Couldnt parse dist information, please report this to https://github.com/nodkz/mongodb-memory-server/issues'
      );
    }

    // warn for the fallback
    console.warn(
      `Unknown/unsupported linux "${os.dist}(${os.id_like?.join(
        ', '
      )})". Falling back to legacy MongoDB build!`
    );

    return this.getLegacyVersionString();
  }

  /**
   * Get the version string for Debian
   * @param os LinuxOS Object
   */
  getDebianVersionString(os: LinuxOS): string {
    let name = 'debian';
    const release: number = parseFloat(os.release);

    if (release >= 11 || ['unstable', 'testing'].includes(os.release)) {
      // Debian 11 is compatible with the binaries for debian 10
      // but does not have binaries for before 5.0.8
      if (semver.lt(this.version, '5.0.8')) {
        log('debian11 detected, but version below 5.0.8 requested, using debian10');
        name += '10';
      } else {
        name += '11';
      }
    } else if (release >= 10) {
      name += '10';
    } else if (release >= 9) {
      name += '92';
    } else if (release >= 8.1) {
      name += '81';
    } else if (release >= 7.1) {
      name += '71';
    }

    if (release >= 10) {
      if (semver.lt(this.version, '4.2.1')) {
        throw new KnownVersionIncompatibilityError(
          `Debian ${release}`,
          this.version,
          '>=4.2.1',
          'Mongodb does not provide binaries for versions before 4.2.1 for Debian 10+ and also cannot be mapped to a previous Debian release'
        );
      }
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

    // 36 and onwards dont ship with libcrypto.so.1.1 anymore and need to be manually installed ("openssl1.1")
    // 34 onward dosnt have "compat-openssl10" anymore, and only build from 4.0.24 are available for "rhel80"
    if (fedoraVer >= 34) {
      name += '80';
    }
    if (fedoraVer < 34 && fedoraVer >= 19) {
      name += '70';
    }
    if (fedoraVer < 19 && fedoraVer >= 12) {
      name += '62';
    }
    if (fedoraVer < 12 && fedoraVer >= 6) {
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
      if (this.arch === 'aarch64') {
        if (!/^8/.test(release)) {
          throw new KnownVersionIncompatibilityError(
            `Rhel ${release}`,
            this.version,
            '>=4.4.2',
            'ARM64(aarch64) support for rhel is only for rhel82 or higher'
          );
        }
        if (semver.satisfies(this.version, '<4.4.2')) {
          throw new KnownVersionIncompatibilityError(`Rhel ${release}`, this.version, '>=4.4.2');
        }

        // rhel aarch64 support is only for rhel 8 and only for 82
        name += '82';
      } else if (/^8/.test(release)) {
        name += '80';
      } else if (/^7/.test(release)) {
        name += '70';
      } else if (/^6/.test(release)) {
        name += '62';
      } else if (/^5/.test(release)) {
        name += '55';
      }
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
  getAmazonVersionString(os: LinuxOS): string {
    let name = 'amazon';
    const release: number = parseInt(os.release, 10);

    if (release >= 2 && release <= 3) {
      name += '2';
    }
    // dont add anthing as fallback, because for "amazon 1", mongodb just uses "amazon"

    return name;
  }

  /**
   * Linux Fallback
   */
  getLegacyVersionString(): string {
    return '';
  }

  /**
   * Get the version string for Suse / OpenSuse
   * @param os LinuxOS Object
   */
  // TODO: add tests for getSuseVersionString
  getSuseVersionString(os: LinuxOS): string {
    const releaseMatch: RegExpMatchArray | null = os.release.match(/(^11|^12|^15)/);

    return releaseMatch ? `suse${releaseMatch[0]}` : '';
  }

  /**
   * Get the version string for Ubuntu
   * @param os LinuxOS Object
   */
  getUbuntuVersionString(os: LinuxOS): string {
    let ubuntuOS: LinuxOS | undefined = undefined;

    // "id_like" processing (version conversion) [this is an block to be collapsible]
    {
      if (/^linux\s?mint\s*$/i.test(os.dist)) {
        const mintToUbuntuRelease: Record<number, string> = {
          17: '14.04',
          18: '16.04',
          19: '18.04',
          20: '20.04',
        };

        ubuntuOS = {
          os: 'linux',
          dist: 'ubuntu',
          release:
            mintToUbuntuRelease[parseInt(os.release.split('.')[0])] || mintToUbuntuRelease[20],
        };
      }

      if (/^elementary\s?os\s*$/i.test(os.dist)) {
        const elementaryToUbuntuRelease: Record<number, string> = {
          3: '14.04',
          4: '16.04',
          5: '18.04',
          6: '20.04',
        };

        // untangle elemenatary versioning from hell https://en.wikipedia.org/wiki/Elementary_OS#Development
        const [elementaryMajor, elementaryMinor] = os.release.split('.').map((el) => parseInt(el));
        const realMajor = elementaryMajor || elementaryMinor;

        ubuntuOS = {
          os: 'linux',
          dist: 'ubuntu',
          release: elementaryToUbuntuRelease[realMajor] || elementaryToUbuntuRelease[6],
        };
      }
    }

    if (isNullOrUndefined(ubuntuOS)) {
      // Warn against distros that have a ID_LIKE set to "ubuntu", but no other upstream information and are not specially mapped (see above)
      if (!/^ubuntu(?:| linux)\s*$/i.test(os.dist)) {
        console.warn(
          `Unmapped distro "${os.dist}" with ID_LIKE "ubuntu", defaulting to highest ubuntu version!\n` +
            'This means that your distro does not have a internal mapping in MMS or does not have a upstream release file (like "/etc/upstream-release/lsb-release"), but has set a ID_LIKE'
        );

        ubuntuOS = {
          os: 'linux',
          dist: 'ubuntu',
          release: '20.04', // TODO: try to keep this up-to-date to the latest LTS
        };
      } else {
        ubuntuOS = os;
      }
    }

    const ubuntuYear: number = parseInt(ubuntuOS.release.split('.')[0], 10);

    if (this.arch === 'aarch64') {
      // this is because, before version 4.1.10, everything for "arm64" / "aarch64" were just "arm64" and for "ubuntu1604"
      if (semver.satisfies(this.version, '<4.1.10')) {
        this.arch = 'arm64';

        return 'ubuntu1604';
      }
      // this is because versions below "4.4.0" did not provide an binary for anything above 1804
      if (semver.satisfies(this.version, '>=4.1.10 <4.4.0')) {
        return 'ubuntu1804';
      }
    }

    if (ubuntuOS.release === '14.10') {
      return 'ubuntu1410-clang';
    }

    // there are no MongoDB 3.x binary distributions for ubuntu >= 18
    // https://www.mongodb.org/dl/linux/x86_64-ubuntu1604
    if (ubuntuYear >= 18 && semver.satisfies(this.version, '3.x.x')) {
      log(
        `getUbuntuVersionString: ubuntuYear is "${ubuntuYear}", which dosnt have an 3.x.x version, defaulting to "1604"`
      );

      return 'ubuntu1604';
    }

    // there are no MongoDB <=4.3.x binary distributions for ubuntu > 18
    // https://www.mongodb.org/dl/linux/x86_64-ubuntu1804
    if (ubuntuYear > 18 && semver.satisfies(this.version, '<=4.3.x')) {
      log(
        `getUbuntuVersionString: ubuntuYear is "${ubuntuYear}", which dosnt have an "<=4.3.x" version, defaulting to "1804"`
      );

      return 'ubuntu1804';
    }

    // there are not binaries for ubuntu 21.04, so defaulting to one version below for now
    // see https://github.com/nodkz/mongodb-memory-server/issues/582
    if (ubuntuYear >= 21) {
      return 'ubuntu2004';
    }

    // TODO: change or remove "14" default, since it no-longer is supported above 4.0
    // the "04" version always exists for ubuntu, use that as default
    return `ubuntu${ubuntuYear || 14}04`;
  }

  /**
   * Translate input platform to mongodb useable platform
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
        return 'linux';
      default:
        throw new UnknownPlatformError(platform);
    }
  }

  /**
   * Translate input arch to mongodb useable arch
   * @example
   * x64 -> x86_64
   * @param platform The Platform to translate
   */
  static translateArch(arch: string, mongoPlatform: string): string {
    switch (arch) {
      case 'ia32':
        deprecate(
          () => {},
          'mongodb-memory-server will fully drop support for ia32 in 9.0',
          'MMS001'
        )();

        if (mongoPlatform === 'linux') {
          return 'i686';
        } else if (mongoPlatform === 'win32') {
          return 'i386';
        }

        throw new UnknownArchitectureError(arch, mongoPlatform);
      case 'x86_64':
      case 'x64':
        return 'x86_64';
      case 'arm64':
      case 'aarch64':
        return 'aarch64';
      default:
        throw new UnknownArchitectureError(arch);
    }
  }
}

export default MongoBinaryDownloadUrl;

/**
 * Helper function to reduce code / regex duplication
 */
function regexHelper(regex: RegExp, os: LinuxOS): boolean {
  return (
    regex.test(os.dist) ||
    (!isNullOrUndefined(os.id_like) ? os.id_like.filter((v) => regex.test(v)).length >= 1 : false)
  );
}
