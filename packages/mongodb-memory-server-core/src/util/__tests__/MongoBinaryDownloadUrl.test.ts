import { assertIsError } from '../../__tests__/testUtils/test_utils';
import {
  UnknownPlatformError,
  UnknownArchitectureError,
  KnownVersionIncompatibilityError,
} from '../errors';
import { LinuxOS } from '../getos';
import MongoBinaryDownloadUrl from '../MongoBinaryDownloadUrl';
import { envName, ResolveConfigVariables } from '../resolveConfig';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('MongoBinaryDownloadUrl', () => {
  describe('getDownloadUrl()', () => {
    describe('for mac', () => {
      it('latest', async () => {
        const du = new MongoBinaryDownloadUrl({
          platform: 'darwin',
          arch: 'x64',
          version: 'latest',
        });
        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/osx/mongodb-macos-x86_64-latest.tgz'
        );
      });

      it('4.4', async () => {
        const du = new MongoBinaryDownloadUrl({
          platform: 'darwin',
          arch: 'x64',
          version: '4.4.0',
        });
        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/osx/mongodb-macos-x86_64-4.4.0.tgz'
        );
      });

      it('above 3.0', async () => {
        const du = new MongoBinaryDownloadUrl({
          platform: 'darwin',
          arch: 'x64',
          version: '3.6.3',
        });
        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.6.3.tgz'
        );
      });

      it('below and include 3.0', async () => {
        const du = new MongoBinaryDownloadUrl({
          platform: 'darwin',
          arch: 'x64',
          version: '3.0.0',
        });
        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/osx/mongodb-osx-x86_64-3.0.0.tgz'
        );
      });

      it('arm64 should use the x64 binary', async () => {
        const du = new MongoBinaryDownloadUrl({
          platform: 'darwin',
          arch: 'arm64',
          version: '4.4.0',
        });
        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/osx/mongodb-macos-x86_64-4.4.0.tgz'
        );
      });
    });

    describe('for linux', () => {
      describe('for ubuntu', () => {
        it('for ubuntu x64', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '3.6.3',
            os: {
              os: 'linux',
              dist: 'Ubuntu Linux',
              release: '14.04',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1404-3.6.3.tgz'
          );
        });

        describe('arm64', () => {
          it('for ubuntu arm64 4.0.25 (below 4.1.10)', async () => {
            const du = new MongoBinaryDownloadUrl({
              platform: 'linux',
              arch: 'arm64',
              version: '4.0.25',
              os: {
                os: 'linux',
                dist: 'Ubuntu Linux',
                release: '20.04',
              },
            });
            expect(await du.getDownloadUrl()).toBe(
              'https://fastdl.mongodb.org/linux/mongodb-linux-arm64-ubuntu1604-4.0.25.tgz'
            );
          });

          it('for ubuntu arm64 4.2.14 (above 4.1.10, below 4.4.0)', async () => {
            const du = new MongoBinaryDownloadUrl({
              platform: 'linux',
              arch: 'arm64',
              version: '4.2.14',
              os: {
                os: 'linux',
                dist: 'Ubuntu Linux',
                release: '20.04',
              },
            });
            expect(await du.getDownloadUrl()).toBe(
              'https://fastdl.mongodb.org/linux/mongodb-linux-aarch64-ubuntu1804-4.2.14.tgz'
            );
          });

          it('for ubuntu arm64 4.4.6 & ubuntu1804 (above 4.1.10, above 4.4.0)', async () => {
            const du = new MongoBinaryDownloadUrl({
              platform: 'linux',
              arch: 'arm64',
              version: '4.4.6',
              os: {
                os: 'linux',
                dist: 'Ubuntu Linux',
                release: '18.04',
              },
            });
            expect(await du.getDownloadUrl()).toBe(
              'https://fastdl.mongodb.org/linux/mongodb-linux-aarch64-ubuntu1804-4.4.6.tgz'
            );
          });

          it('for ubuntu arm64 4.4.6 & ubuntu2004 (above 4.1.10, above 4.4.0)', async () => {
            const du = new MongoBinaryDownloadUrl({
              platform: 'linux',
              arch: 'arm64',
              version: '4.4.6',
              os: {
                os: 'linux',
                dist: 'Ubuntu Linux',
                release: '20.04',
              },
            });
            expect(await du.getDownloadUrl()).toBe(
              'https://fastdl.mongodb.org/linux/mongodb-linux-aarch64-ubuntu2004-4.4.6.tgz'
            );
          });
        });
      });

      describe('for debian', () => {
        it('for debian 81 for 3.6.3', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '3.6.3',
            os: {
              os: 'linux',
              dist: 'debian',
              release: '8.1',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian81-3.6.3.tgz'
          );
        });

        it('for debian 10 for 4.2.1', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '4.2.1',
            os: {
              os: 'linux',
              dist: 'debian',
              release: '10',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian10-4.2.1.tgz'
          );
        });

        it('for debian 11 for 4.2.1 (using debian 10 binaries)', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '4.2.1',
            os: {
              os: 'linux',
              dist: 'debian',
              release: '11',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian10-4.2.1.tgz'
          );
        });

        it('should throw a Error when requesting a version below 4.2.1 for debian 10+ [#554] [KnownVersionIncompatibilityError]', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '4.0.25',
            os: {
              os: 'linux',
              dist: 'debian',
              release: '10',
            },
          });

          try {
            await du.getDownloadUrl();
            fail('Expected to throw a KnownVersionIncompatibilityError');
          } catch (err) {
            assertIsError(err);
            expect(err).toBeInstanceOf(KnownVersionIncompatibilityError);
            expect(err.message).toMatchSnapshot();
          }
        });
      });

      it('fallback', async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => void 0);

        const du = new MongoBinaryDownloadUrl({
          platform: 'linux',
          arch: 'x64',
          version: '3.6.3',
          os: {
            os: 'linux',
            dist: 'Gentoo Linux',
            release: '',
          },
        });

        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.6.3.tgz'
        );
        expect(console.warn).toHaveBeenCalledTimes(1);
      });

      it('for manjaro', async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => void 0);

        const du = new MongoBinaryDownloadUrl({
          platform: 'linux',
          arch: 'x64',
          version: '4.4.2',
          os: {
            os: 'linux',
            dist: 'ManjaroLinux',
            release: '20.2',
            id_like: ['arch'],
          },
        });
        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-4.4.2.tgz'
        );
        expect(console.warn).toHaveBeenCalledTimes(1);
      });

      it('for arch', async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => void 0);

        const du = new MongoBinaryDownloadUrl({
          platform: 'linux',
          arch: 'x64',
          version: '4.4.2',
          os: {
            os: 'linux',
            dist: 'Arch',
            release: 'rolling',
            id_like: ['arch'],
          },
        });
        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-4.4.2.tgz'
        );
        expect(console.warn).toHaveBeenCalledTimes(1);
      });

      it('for unpopular arch', async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => void 0);

        const du = new MongoBinaryDownloadUrl({
          platform: 'linux',
          arch: 'x64',
          version: '4.4.2',
          os: {
            os: 'linux',
            dist: 'ArchStrike',
            release: 'rolling',
            id_like: ['arch'],
          },
        });
        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-4.4.2.tgz'
        );
        expect(console.warn).toHaveBeenCalledTimes(1);
      });

      describe('for elementary', () => {
        it('should return a archive name for elementary 0.3', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '4.4.1',
            os: {
              os: 'linux',
              dist: 'elementary OS',
              release: '0.3',
              id_like: ['ubuntu'],
            },
          });

          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1404-4.4.1.tgz'
          );
        });

        it('should return a archive name for elementary 5', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '4.4.1',
            os: {
              os: 'linux',
              dist: 'elementary OS',
              release: '5.1',
              id_like: ['ubuntu'],
            },
          });

          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1804-4.4.1.tgz'
          );
        });
      });

      describe('for LinuxMint', () => {
        let downloadUrl: MongoBinaryDownloadUrl;
        beforeEach(() => {
          downloadUrl = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '4.0.25',
            os: {
              os: 'linux',
              dist: 'Linux Mint',
              release: '',
              id_like: ['ubuntu'],
            },
          });
        });

        it('should default to Mint Version 20, if version cannot be found in lookup table', async () => {
          (downloadUrl.os as LinuxOS).release = '16';
          expect(await downloadUrl.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1804-4.0.25.tgz'
          );
        });

        it('should return a archive name for Linux Mint 17', async () => {
          (downloadUrl.os as LinuxOS).release = '17';
          expect(await downloadUrl.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1404-4.0.25.tgz'
          );
        });

        it('should return a archive name for Linux Mint 18', async () => {
          (downloadUrl.os as LinuxOS).release = '18';
          expect(await downloadUrl.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1604-4.0.25.tgz'
          );
        });

        it('should return a archive name for Linux Mint 19', async () => {
          (downloadUrl.os as LinuxOS).release = '19';
          expect(await downloadUrl.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1804-4.0.25.tgz'
          );
        });

        it('should return a archive name for Linux Mint 20', async () => {
          (downloadUrl.os as LinuxOS).release = '20';
          expect(await downloadUrl.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1804-4.0.25.tgz'
          );
        });
      });

      describe('for fedora', () => {
        it('should return a archive name for Fedora 32', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '4.0.24',
            os: {
              os: 'linux',
              dist: 'fedora',
              release: '32',
            },
          });

          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel70-4.0.24.tgz'
          );
        });

        it('should return a archive name for Fedora 34', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '4.0.24',
            os: {
              os: 'linux',
              dist: 'fedora',
              release: '34',
            },
          });

          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel80-4.0.24.tgz'
          );
        });
      });

      // see https://github.com/nodkz/mongodb-memory-server/issues/527
      describe('for amazon', () => {
        it('should return a archive name for Amazon 1', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '4.0.24',
            os: {
              os: 'linux',
              dist: 'amzn',
              release: '1',
              id_like: ['centos', 'rhel', 'fedora'],
            },
          });

          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-amazon-4.0.24.tgz'
          );
        });

        it('should return a archive name for Amazon 2', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '4.0.24',
            os: {
              os: 'linux',
              dist: 'amzn',
              release: '2',
              id_like: ['centos', 'rhel', 'fedora'],
            },
          });

          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-amazon2-4.0.24.tgz'
          );
        });
      });
    });

    describe('for win32 & windows', () => {
      it('3.6 (win32)', async () => {
        const du = new MongoBinaryDownloadUrl({
          platform: 'win32',
          arch: 'x64',
          version: '3.6.3',
        });
        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-3.6.3.zip'
        );
      });

      it('4.0.14 (win32)', async () => {
        const du = new MongoBinaryDownloadUrl({
          platform: 'win32',
          arch: 'x64',
          version: '4.0.14',
        });
        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2008plus-ssl-4.0.14.zip'
        );
      });

      it('4.2 (win32)', async () => {
        const du = new MongoBinaryDownloadUrl({
          platform: 'win32',
          arch: 'x64',
          version: '4.2.0',
        });
        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2012plus-4.2.0.zip'
        );
      });

      it('4.4 (windows)', async () => {
        const du = new MongoBinaryDownloadUrl({
          platform: 'win32',
          arch: 'x64',
          version: '4.4.0',
        });
        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-4.4.0.zip'
        );
      });

      it('latest (windows)', async () => {
        const du = new MongoBinaryDownloadUrl({
          platform: 'win32',
          arch: 'x64',
          version: 'latest',
        });
        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-latest.zip'
        );
      });
    });

    it('should allow archive overwrite with "ARCHIVE_NAME"', async () => {
      const archiveName = 'mongodb-linux-x86_64-4.0.0.tgz';
      process.env[envName(ResolveConfigVariables.ARCHIVE_NAME)] = archiveName;

      const du = new MongoBinaryDownloadUrl({
        platform: 'linux',
        arch: 'x64',
        version: '3.6.3',
      });
      expect(await du.getDownloadUrl()).toBe(`https://fastdl.mongodb.org/linux/${archiveName}`);
      delete process.env[envName(ResolveConfigVariables.ARCHIVE_NAME)];
    });

    it('should allow full url overwrite with "DOWNLOAD_URL"', async () => {
      const downloadUrl = 'https://custom.org/customarchive.tgz';
      process.env[envName(ResolveConfigVariables.DOWNLOAD_URL)] = downloadUrl;

      const du = new MongoBinaryDownloadUrl({
        platform: 'linux',
        arch: 'x64',
        version: '3.6.3',
      });
      jest.spyOn(du, 'getArchiveName');
      expect(await du.getDownloadUrl()).toBe(downloadUrl);
      expect(du.getArchiveName).not.toHaveBeenCalled();
      delete process.env[envName(ResolveConfigVariables.DOWNLOAD_URL)];
    });

    describe('overwrite with "DOWNLOAD_MIRROR" option', () => {
      const archiveName = 'mongodb-linux-x86_64-ubuntu1804-4.0.0.tgz';
      let mbdu: MongoBinaryDownloadUrl;

      beforeAll(() => {
        mbdu = new MongoBinaryDownloadUrl({
          platform: 'linux',
          arch: 'x64',
          version: '4.0.0',
        });

        jest.spyOn(mbdu, 'getArchiveName').mockImplementation(() => Promise.resolve(archiveName));
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      afterEach(() => {
        delete process.env[envName(ResolveConfigVariables.DOWNLOAD_MIRROR)];
      });

      it('should allow mirror overwrite (only server name) with "DOWNLOAD_MIRROR"', async () => {
        const mirror = 'https://custom.org';
        process.env[envName(ResolveConfigVariables.DOWNLOAD_MIRROR)] = mirror;

        expect(await mbdu.getDownloadUrl()).toBe(`${mirror}/linux/${archiveName}`);
      });

      it('should allow mirror overwrite (with extra path) with "DOWNLOAD_MIRROR" without extra "/"', async () => {
        const mirror = 'https://custom.org/extra/path';
        process.env[envName(ResolveConfigVariables.DOWNLOAD_MIRROR)] = mirror;

        expect(await mbdu.getDownloadUrl()).toBe(`${mirror}/linux/${archiveName}`);
      });

      it('should allow mirror overwrite (with extra path) with "DOWNLOAD_MIRROR" with extra "/"', async () => {
        const mirror = 'https://custom.org/extra/path/';
        process.env[envName(ResolveConfigVariables.DOWNLOAD_MIRROR)] = mirror;

        // no extra "/" because "mirror" already contains it
        expect(await mbdu.getDownloadUrl()).toBe(`${mirror}linux/${archiveName}`);
      });
    });

    it('should throw an error if platform is unknown (getArchiveName)', async () => {
      // this is to test the default case in "getArchiveName"
      const du = new MongoBinaryDownloadUrl({
        platform: 'linux',
        arch: 'x64',
        version: '4.0.0',
      });
      du.platform = 'unknown';
      try {
        await du.getArchiveName();
        fail('Expected "getArchiveName" to throw');
      } catch (err) {
        assertIsError(err);
        expect(err).toBeInstanceOf(UnknownPlatformError);
        expect(err.message).toMatchSnapshot();
      }
    });

    it('should throw an error if platform is unknown (translatePlatform)', async () => {
      // this is to test the default case in "translatePlatform"
      try {
        new MongoBinaryDownloadUrl({
          platform: 'unknown',
          arch: 'x64',
          version: '4.0.0',
        });
        fail('Expected "translatePlatform" to throw');
      } catch (err) {
        assertIsError(err);
        expect(err).toBeInstanceOf(UnknownPlatformError);
        expect(err.message).toMatchSnapshot();
      }
    });
  });

  describe('getUbuntuVersionString()', () => {
    let downloadUrl: MongoBinaryDownloadUrl;
    beforeEach(() => {
      downloadUrl = new MongoBinaryDownloadUrl({
        platform: 'linux',
        arch: 'x64',
        version: '3.6.3',
      });
    });

    it('should return a archive name for Ubuntu 14.10', () => {
      downloadUrl.version = '3.6.3';
      expect(
        downloadUrl.getUbuntuVersionString({
          os: 'linux',
          dist: 'Ubuntu Linux',
          release: '14.10',
        })
      ).toBe('ubuntu1410-clang');
    });

    it('should return a archive name for Ubuntu 14.04', () => {
      downloadUrl.version = '3.6.3';
      expect(
        downloadUrl.getUbuntuVersionString({
          os: 'linux',
          dist: 'Ubuntu Linux',
          release: '14.04',
        })
      ).toBe('ubuntu1404');
    });

    it('should return a archive name for Ubuntu 12.04', () => {
      downloadUrl.version = '3.6.3';
      expect(
        downloadUrl.getUbuntuVersionString({
          os: 'linux',
          dist: 'Ubuntu Linux',
          release: '12.04',
        })
      ).toBe('ubuntu1204');
    });

    it('should return a archive name for Ubuntu 18.04', () => {
      const oldMongoVersion = downloadUrl.version;
      downloadUrl.version = '3.6.3';
      expect(
        downloadUrl.getUbuntuVersionString({
          os: 'linux',
          dist: 'Ubuntu Linux',
          release: '18.04',
        })
      ).toBe('ubuntu1604');
      downloadUrl.version = '4.0.1';
      expect(
        downloadUrl.getUbuntuVersionString({
          os: 'linux',
          dist: 'Ubuntu Linux',
          release: '18.04',
        })
      ).toBe('ubuntu1804');
      downloadUrl.version = oldMongoVersion;
    });

    it('should return a archive name for Ubuntu 20.04', () => {
      const oldMongoVersion = downloadUrl.version;
      downloadUrl.version = '3.6.3';
      expect(
        downloadUrl.getUbuntuVersionString({
          os: 'linux',
          dist: 'Ubuntu Linux',
          release: '20.04',
        })
      ).toBe('ubuntu1604');
      downloadUrl.version = '4.0.1';
      expect(
        downloadUrl.getUbuntuVersionString({
          os: 'linux',
          dist: 'Ubuntu Linux',
          release: '20.04',
        })
      ).toBe('ubuntu1804');
      downloadUrl.version = oldMongoVersion;
    });

    it('should return a archive name for Ubuntu 21.04 using 2004', () => {
      downloadUrl.version = '5.0.3';
      expect(
        downloadUrl.getUbuntuVersionString({
          os: 'linux',
          dist: 'Ubuntu Linux',
          release: '21.04',
        })
      ).toBe('ubuntu2004');
    });
  });

  describe('getDebianVersionString()', () => {
    let downloadUrl: MongoBinaryDownloadUrl;
    beforeEach(() => {
      downloadUrl = new MongoBinaryDownloadUrl({
        platform: 'linux',
        arch: 'x64',
        version: '3.6.3',
      });
    });

    it('should return a archive name for debian 6.2', () => {
      downloadUrl.version = '3.6.3';
      expect(
        downloadUrl.getDebianVersionString({
          os: 'linux',
          dist: 'debian',
          release: '6.2',
        })
      ).toBe('debian');
    });

    it('should return a archive name for debian 7.0', () => {
      downloadUrl.version = '3.6.3';
      expect(
        downloadUrl.getDebianVersionString({
          os: 'linux',
          dist: 'debian',
          release: '7.0',
        })
      ).toBe('debian');
    });

    it('should return a archive name for debian 7.1', () => {
      downloadUrl.version = '3.6.3';
      expect(
        downloadUrl.getDebianVersionString({
          os: 'linux',
          dist: 'debian',
          release: '7.1',
        })
      ).toBe('debian71');
    });

    it('should return a archive name for debian 8.0', () => {
      downloadUrl.version = '3.6.3';
      expect(
        downloadUrl.getDebianVersionString({
          os: 'linux',
          dist: 'debian',
          release: '8.0',
        })
      ).toBe('debian71');
    });

    it('should return a archive name for debian 8.1', () => {
      downloadUrl.version = '3.6.3';
      expect(
        downloadUrl.getDebianVersionString({
          os: 'linux',
          dist: 'debian',
          release: '8.1',
        })
      ).toBe('debian81');
    });

    it('should return a archive name for debian 9.0', () => {
      downloadUrl.version = '3.6.3';
      expect(
        downloadUrl.getDebianVersionString({
          os: 'linux',
          dist: 'debian',
          release: '9.0',
        })
      ).toBe('debian92');
    });

    it('should return debian10 release-archive for debian 10.0 and mongodb 4.4', () => {
      downloadUrl.version = '4.4.0';
      expect(
        downloadUrl.getDebianVersionString({
          os: 'linux',
          dist: 'debian',
          release: '10.0',
        })
      ).toBe('debian10');
    });
  });

  describe('getLegacyVersionString()', () => {
    let downloadUrl: MongoBinaryDownloadUrl;
    beforeEach(() => {
      downloadUrl = new MongoBinaryDownloadUrl({
        platform: 'linux',
        arch: 'x64',
        version: '3.6.3',
      });
    });

    it('should return an empty string', () => {
      downloadUrl.version = '3.6.3';
      expect(downloadUrl.getLegacyVersionString()).toBe('');
    });
  });

  describe('getLinuxOSVersionString()', () => {
    it('should give an warning about "alpine"', () => {
      jest.spyOn(console, 'warn').mockImplementation(() => void 0);
      const du = new MongoBinaryDownloadUrl({
        platform: 'linux',
        arch: 'x64',
        version: '3.6.3',
        os: {
          os: 'linux',
          dist: 'alpine',
          release: '0',
          codename: 'alpine',
        },
      });
      jest.spyOn(du, 'getLegacyVersionString');
      const ret = du.getLinuxOSVersionString(du.os as LinuxOS);
      expect(console.warn).toHaveBeenCalledTimes(2);
      expect(du.getLegacyVersionString).toHaveBeenCalledTimes(1);
      expect(ret).toBe('');
    });

    it('should give an warning about "unknown"', () => {
      jest.spyOn(console, 'warn').mockImplementation(() => void 0);
      const du = new MongoBinaryDownloadUrl({
        platform: 'linux',
        arch: 'x64',
        version: '3.6.3',
        os: {
          os: 'linux',
          dist: 'unknown',
          release: '0',
          codename: 'unknown',
        },
      });
      jest.spyOn(du, 'getLegacyVersionString');
      const ret = du.getLinuxOSVersionString(du.os as LinuxOS);
      expect(console.warn).toHaveBeenCalledTimes(2);
      expect(du.getLegacyVersionString).toHaveBeenCalledTimes(1);
      expect(ret).toBe('');
    });
  });

  describe('translateArch()', () => {
    it('should translate "ia32" and linux to "i686"', () => {
      expect(MongoBinaryDownloadUrl.translateArch('ia32', 'linux')).toBe('i686');
    });

    it('should translate "ia32" and win32 to "i386"', () => {
      expect(MongoBinaryDownloadUrl.translateArch('ia32', 'win32')).toBe('i386');
    });

    it('should throw an error for "ia32" and unsupported platform', () => {
      try {
        MongoBinaryDownloadUrl.translateArch('ia32', 'darwin');
        fail('Expected "translateArch" to fail');
      } catch (err) {
        assertIsError(err);
        expect(err).toBeInstanceOf(UnknownArchitectureError);
        expect(err.message).toMatchSnapshot();
      }
    });

    it('should throw an error for an unsupported architecture', () => {
      try {
        MongoBinaryDownloadUrl.translateArch('risc', 'linux');
        fail('Expected "translateArch" to fail');
      } catch (err) {
        assertIsError(err);
        expect(err).toBeInstanceOf(UnknownArchitectureError);
        expect(err.message).toMatchSnapshot();
      }
    });
  });
});
