import getos from 'getos';
import { execSync } from 'child_process';
import resolveConfig from './resolve-config';

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

  constructor({ platform, arch, version, os }: MongoBinaryDownloadUrlOpts) {
    this.version = version;
    this.platform = this.translatePlatform(platform);
    this.arch = this.translateArch(arch, this.platform);
    this.os = os;
  }

  async getDownloadUrl(): Promise<string> {
    const archive = await this.getArchiveName();

    const downloadUrl = resolveConfig('DOWNLOAD_URL');
    if (downloadUrl) return downloadUrl;

    return `${resolveConfig('DOWNLOAD_MIRROR') || 'https://fastdl.mongodb.org'}/${
      this.platform
    }/${archive}`;
  }

  async getArchiveName(): Promise<string> {
    switch (this.platform) {
      case 'osx':
        return this.getArchiveNameOsx();
      case 'win32':
        return this.getArchiveNameWin();
      case 'linux':
      default:
        return this.getArchiveNameLinux();
    }
  }

  // https://www.mongodb.org/dl/win32
  async getArchiveNameWin(): Promise<string> {
    let name = `mongodb-${this.platform}`;
    name += `-${this.arch}`;
    if (this.version.indexOf('4.2') === 0) {
      name += '-2012plus';
    }
    else {
      name += '-2008plus-ssl';
    }
    name += `-${this.version}.zip`;
    return name;
  }

  // https://www.mongodb.org/dl/osx
  async getArchiveNameOsx(): Promise<string> {
    let name = `mongodb-osx`;
    if (
      !(
        this.version.indexOf('3.0') === 0 ||
        this.version.indexOf('2.') === 0 ||
        this.version.indexOf('1.') === 0
      )
    ) {
      name += '-ssl';
    }
    if (this.version.indexOf('4.2') === 0) {
      name = `mongodb-macos`;
    }
    name += `-${this.arch}`;
    name += `-${this.version}.tgz`;
    return name;
  }

  // https://www.mongodb.org/dl/linux
  async getArchiveNameLinux(): Promise<string> {
    let name = `mongodb-linux`;
    name += `-${this.arch}`;

    let osString;
    if (this.arch !== 'i686') {
      if (!this.os) this.os = await this.getos();
      osString = this.getLinuxOSVersionString(this.os as getos.LinuxOs);
    }
    if (osString) {
      name += `-${osString}`;
    }

    name += `-${this.version}.tgz`;

    return name;
  }

  async getos(): Promise<getos.Os> {
    return new Promise((resolve, reject) => {
      getos((e: any, os: any) => {
        if (e) reject(e);
        resolve(os);
      });
    });
  }

  getLinuxOSVersionString(os: getos.LinuxOs): string {
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
    } else if (/mint/i.test(os.dist)) {
      return this.getMintVersionString(os);
    }
    console.warn(`Unknown linux distro ${os.dist}, falling back to legacy MongoDB build`);
    return this.getLegacyVersionString(os);
  }

  getDebianVersionString(os: getos.Os): string {
    let name = 'debian';
    const release: number = parseFloat((os as getos.LinuxOs).release);
    if (release >= 9 || (os as getos.LinuxOs).release === 'unstable') {
      name += '92';
    } else if (release >= 8.1) {
      name += '81';
    } else if (release >= 7.1) {
      name += '71';
    }
    return name;
  }

  getFedoraVersionString(os: getos.Os): string {
    let name = 'rhel';
    const fedoraVer: number = parseInt((os as getos.LinuxOs).release, 10);
    if (fedoraVer > 18) {
      name += '70';
    } else if (fedoraVer < 19 && fedoraVer >= 12) {
      name += '62';
    } else if (fedoraVer < 12 && fedoraVer >= 6) {
      name += '55';
    }
    return name;
  }

  getRhelVersionString(os: getos.Os): string {
    let name = 'rhel';
    const { release } = os as getos.LinuxOs;
    if (release) {
      if (/^7/.test(release)) {
        name += '70';
      } else if (/^6/.test(release)) {
        name += '62';
      } else if (/^5/.test(release)) {
        name += '55';
      }
    }
    return name;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getElementaryOSVersionString(os: getos.Os): string {
    const ubuntuVersion = execSync('/usr/bin/lsb_release -u -rs');
    return `ubuntu${ubuntuVersion
      .toString()
      .replace('.', '')
      .trim()}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMintVersionString(os: getos.Os): string {
    // unfortunately getos doesn't return version for Mint
    return 'ubuntu1404';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getLegacyVersionString(os: getos.Os): string {
    return '';
  }

  getSuseVersionString(os: getos.Os): string {
    const releaseMatch: RegExpMatchArray | null = (os as getos.LinuxOs).release.match(/(^11|^12)/);

    if (releaseMatch) {
      return `suse${releaseMatch[0]}`;
    }
    return '';
  }

  getUbuntuVersionString(os: getos.LinuxOs): string {
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

  translatePlatform(platform: string): string {
    switch (platform) {
      case 'darwin':
        return 'osx';
      case 'win32':
        return 'win32';
      case 'linux':
        return 'linux';
      case 'elementary OS':
        return 'linux';
      case 'sunos':
        return 'sunos5';
      default:
        throw new Error(`unsupported OS ${platform}`);
    }
  }

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
