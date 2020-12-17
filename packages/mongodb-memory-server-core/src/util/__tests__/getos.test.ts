import { promises as fsPromises, Stats } from 'fs';
import getOS, { LinuxOS } from '../getos';
import os from 'os';
import { FileNotFoundError } from '../errors';

const UbuntuLSB = `DISTRIB_ID=Ubuntu
DISTRIB_RELEASE=20.04
DISTRIB_CODENAME=focal
DISTRIB_DESCRIPTION="Ubuntu 20.04.1 LTS"`;

const UbuntuOSRelease = `NAME="Ubuntu"
VERSION="20.04.1 LTS (Focal Fossa)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 20.04.1 LTS"
VERSION_ID="20.04"
VERSION_CODENAME=focal
UBUNTU_CODENAME=focal`;

const MintLSB = `DISTRIB_ID=LinuxMint
DISTRIB_RELEASE=20
DISTRIB_CODENAME=whatever
DISTRIB_DESCRIPTION="Linux Mint 20 IDK"`;

// only testing linux systems anyways
jest.spyOn(os, 'platform').mockReturnValueOnce('linux');

describe('getLinuxInformation', () => {
  it('should return ubuntu info', async () => {
    jest.spyOn(fsPromises, 'stat').mockRejectedValueOnce({ code: 'ENOENT' });

    jest.spyOn(fsPromises, 'readFile').mockImplementation((filePath) => {
      if (filePath === '/etc/lsb-release') {
        return new Promise((resolve) => {
          resolve(UbuntuLSB);
        });
      }

      if (filePath === '/etc/os-release') {
        return new Promise((resolve) => {
          resolve(UbuntuOSRelease);
        });
      }

      throw new FileNotFoundError();
    });

    const result = (await getOS()) as LinuxOS;

    expect(result.os).toBe('linux');
    expect(result.dist).toBe('Ubuntu');
    expect(result.id_like).toBe('debian');
  });

  it('linux mint should fall back to ubuntu', async () => {
    jest.spyOn(fsPromises, 'stat').mockResolvedValueOnce({} as Stats);

    jest.spyOn(fsPromises, 'readFile').mockImplementation((filePath) => {
      if (filePath === '/etc/lsb-release') {
        return new Promise((resolve) => {
          resolve(MintLSB);
        });
      }

      if (filePath === '/etc/os-release') {
        return new Promise((resolve) => {
          resolve(UbuntuOSRelease);
        });
      }

      if (filePath === '/etc/upstream-release/lsb-release') {
        return new Promise((resolve) => {
          resolve(UbuntuLSB);
        });
      }

      throw new FileNotFoundError();
    });

    const result = (await getOS()) as LinuxOS;

    expect(result.os).toBe('linux');
    expect(result.dist).toBe('Ubuntu');
    expect(result.id_like).toBe('debian');
  });
});
