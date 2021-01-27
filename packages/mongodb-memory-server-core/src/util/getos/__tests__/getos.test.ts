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
        id_like: 'ubuntu',
      });
    });
  });
});
