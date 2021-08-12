import { AnyOS, LinuxOS } from './getos';
import { resolveConfig, ResolveConfigVariables } from './resolveConfig';
import debug from 'debug';
import * as semver from 'semver';
import { isNullOrUndefined } from './utils';
import { BaseDryMongoBinaryOptions, DryMongoBinary } from './DryMongoBinary';
import { URL } from 'url';
import { UnknownArchitecture, UnknownPlatform } from './errors';

const log = debug('MongoMS:MongoBinaryDownloadUrl');

export interface MongoBinaryDownloadUrlOpts {
  version: NonNullable<BaseDryMongoBinaryOptions['version']>;
  platform: string;
  arch: NonNullable<BaseDryMongoBinaryOptions['arch']>;
  os?: BaseDryMongoBinaryOptions['os'];
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
        throw new UnknownPlatform(this.platform);
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

    if (this.arch === 'arm64') {
      log('getArchiveNameOsx: Arch is "arm64", using x64 binary');
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
        this.os = (await DryMongoBinary.generateOptions()).os;
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
    } else if (regexHelper(/unknown/i, os)) {
      // "unknown" is likely to happen if no release file / command could be found
      console.warn(
        'Couldnt parse dist information, please report this to https://github.com/nodkz/mongodb-memory-server/issues'
      );
    }

    // warn for the fallback
    console.warn(
      `Unknown/unsupported linux "${os.dist}(${os.id_like})". Falling back to legacy MongoDB build!`
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

    if (release >= 10 || ['unstable', 'testing'].includes(os.release)) {
      if (semver.lte(this.version, '4.2.0')) {
        log(
          `getDebianVersionString: requested version "${this.version}" not available for osrelease "${release}", using "92"`
        );
        name += '92';
      } else {
        name += '10';
      }
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
  // TODO: add tests for RHEL
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
    // fallback
    if (name === 'rhel') {
      log('getRhelVersionString: falling back to "70"');
      // fallback to "70", because that is what currently is supporting 3.6 to 5.0 and should work with many
      name += '70';
    }

    return name;
  }

  /**
   * Linux Fallback
   * @param os LinuxOS Object
   */
  getLegacyVersionString(): string {
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
    const ubuntuOS: LinuxOS = {
      ...os,
      dist: 'ubuntu',
    };

    // "id_like" processing (version conversion) [this is an block to be collapsible]
    {
      if (/^linux\s?mint\s*$/i.test(os.dist)) {
        const mintToUbuntuRelease: Record<number, string> = {
          17: '14.04',
          18: '16.04',
          19: '18.04',
          20: '20.04',
        };

        ubuntuOS.release =
          mintToUbuntuRelease[parseInt(os.release.split('.')[0])] || mintToUbuntuRelease[20];
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

        ubuntuOS.release = elementaryToUbuntuRelease[realMajor] || elementaryToUbuntuRelease[6];
      }
    }

    const ubuntuYear: number = parseInt(ubuntuOS.release.split('.')[0], 10);

    // this is, because currently mongodb only really provides arm64 binaries for "ubuntu1604"
    if (this.arch === 'arm64') {
      // this is because, before version 4.1.10, everything for "arm64" / "aarch64" were just "arm64" and for "ubuntu1604"
      if (semver.satisfies(this.version, '<4.1.10')) {
        this.arch = 'arm64';

        return 'ubuntu1604';
      }
      if (semver.satisfies(this.version, '>=4.1.10')) {
        // this is because mongodb changed since 4.1.0 to use "aarch64" instead of "arm64"
        this.arch = 'aarch64';

        // this is because since versions below "4.4.0" did not provide an binary for something like "20.04"
        if (semver.satisfies(this.version, '<4.4.0')) {
          return 'ubuntu1804';
        }

        return `ubuntu${ubuntuYear || 18}04`;
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
      case 'elementary OS':
        return 'linux';
      case 'sunos':
        return 'sunos5';
      default:
        throw new UnknownPlatform(platform);
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
        if (mongoPlatform === 'linux') {
          return 'i686';
        } else if (mongoPlatform === 'win32') {
          return 'i386';
        }

        throw new UnknownArchitecture(arch, mongoPlatform);
      case 'x64':
        return 'x86_64';
      case 'arm64':
        return 'arm64';
      default:
        throw new UnknownArchitecture(arch);
    }
  }
}

export default MongoBinaryDownloadUrl;

/**
 * Helper function to reduce code / regex duplication
 */
function regexHelper(regex: RegExp, os: LinuxOS): boolean {
  return regex.test(os.dist) || (!isNullOrUndefined(os.id_like) ? regex.test(os.id_like) : false);
}
