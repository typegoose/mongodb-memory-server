import * as getos from '../index';

// This File will use example input, it should be formatted with multiple template strings

describe('getos', () => {
  describe('parseLSB', () => {
    it('should return defaults when no input is given', () => {
      const output = getos.parseLSB('');

      expect(output).toEqual<getos.LinuxOS>({
        os: 'linux',
        dist: 'unknown',
        release: '',
      });
    });

    it('should parse full lsb-release file', () => {
      // output taken from @hasezoey (locally)
      const example = `DISTRIB_ID=LinuxMint
DISTRIB_RELEASE=20.1
DISTRIB_CODENAME=ulyssa
DISTRIB_DESCRIPTION="Linux Mint 20.1 Ulyssa"`;

      expect(getos.parseLSB(example)).toEqual<getos.LinuxOS>({
        os: 'linux',
        dist: 'linuxmint',
        release: '20.1',
        codename: 'ulyssa',
      });
    });

    it('should parse to UNKNOWN for different formats', () => {
      // output taken from "elementary/docker:fe08f970723a" at "/etc/upstream-release/lsb-release"
      const example = `ID=Ubuntu
VERSION_ID=20.04
VERSION_CODENAME=focal
PRETTY_NAME="Ubuntu 20.04.5 LTS"`;

      expect(getos.parseLSB(example)).toEqual<getos.LinuxOS>({
        os: 'linux',
        dist: getos.UNKNOWN,
        release: '',
        codename: undefined,
      });
    });
  });

  describe('parseOS', () => {
    it('should return defaults when no input is given', () => {
      const output = getos.parseOS('');

      expect(output).toEqual<getos.LinuxOS>({
        os: 'linux',
        dist: 'unknown',
        release: '',
      });
    });

    it('should parse an full os-release file', () => {
      // output taken from @hasezoey (locally)
      const example = `NAME="Linux Mint"
VERSION="20.1 (Ulyssa)"
ID=linuxmint
ID_LIKE=ubuntu
PRETTY_NAME="Linux Mint 20.1"
VERSION_ID="20.1"
HOME_URL="https://www.linuxmint.com/"
SUPPORT_URL="https://forums.linuxmint.com/"
BUG_REPORT_URL="http://linuxmint-troubleshooting-guide.readthedocs.io/en/latest/"
PRIVACY_POLICY_URL="https://www.linuxmint.com/"
VERSION_CODENAME=ulyssa
UBUNTU_CODENAME=focal`;

      expect(getos.parseOS(example)).toEqual<getos.LinuxOS>({
        os: 'linux',
        dist: 'linuxmint',
        release: '20.1',
        codename: 'ulyssa',
        id_like: ['ubuntu'],
      });
    });

    it('should parse an full os-release file with quotes', () => {
      // output taken from @hasezoey (locally) but modified to test specific case
      const example = `NAME="Linux Mint"
VERSION="20.2 (Uma)"
ID="linuxmint"
ID_LIKE="ubuntu"
PRETTY_NAME="Linux Mint 20.2"
VERSION_ID="20.2"
HOME_URL="https://www.linuxmint.com/"
SUPPORT_URL="https://forums.linuxmint.com/"
BUG_REPORT_URL="http://linuxmint-troubleshooting-guide.readthedocs.io/en/latest/"
PRIVACY_POLICY_URL="https://www.linuxmint.com/"
VERSION_CODENAME=uma
UBUNTU_CODENAME=focal`;

      expect(getos.parseOS(example)).toEqual<getos.LinuxOS>({
        os: 'linux',
        dist: 'linuxmint',
        release: '20.2',
        codename: 'uma',
        id_like: ['ubuntu'],
      });
    });

    it('should parse multiple "id_like"', () => {
      // output taken from https://github.com/typegoose/mongodb-memory-server/issues/525#issuecomment-894279720
      const example = `NAME="Amazon Linux"
VERSION="2"
ID="amzn"
ID_LIKE="centos rhel fedora"
VERSION_ID="2"
PRETTY_NAME="Amazon Linux 2"
ANSI_COLOR="0;33"
CPE_NAME="cpe:2.3:o:amazon:amazon_linux:2"
HOME_URL="https://amazonlinux.com/"`;

      expect(getos.parseOS(example)).toEqual<getos.LinuxOS>({
        os: 'linux',
        dist: 'amzn',
        release: '2',
        codename: undefined,
        id_like: ['centos', 'rhel', 'fedora'],
      });
    });
  });

  describe('isValidOs', () => {
    it('should return FALSE if undefined / null', () => {
      expect(getos.isValidOs(undefined)).toStrictEqual(false);
      expect(getos.isValidOs(null as any)).toStrictEqual(false);
    });

    it('should return FALSE if distro is UNKNOWN', () => {
      expect(getos.isValidOs({ dist: getos.UNKNOWN, os: 'linux', release: '0' })).toStrictEqual(
        false
      );
    });

    it('should return TRUE if distro is not UNKNOWN', () => {
      expect(getos.isValidOs({ dist: 'ubuntu', os: 'linux', release: '20.04' })).toStrictEqual(
        true
      );
    });
  });
});
