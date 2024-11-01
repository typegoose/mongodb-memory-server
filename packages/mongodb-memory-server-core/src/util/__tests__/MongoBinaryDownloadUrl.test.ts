import { assertIsError } from '../../__tests__/testUtils/test_utils';
import {
  UnknownPlatformError,
  UnknownArchitectureError,
  KnownVersionIncompatibilityError,
  UnknownVersionError,
  UnknownLinuxDistro,
} from '../errors';
import { LinuxOS } from '../getos';
import MongoBinaryDownloadUrl from '../MongoBinaryDownloadUrl';
import { envName, ResolveConfigVariables } from '../resolveConfig';
import * as semver from 'semver';
import { assertion } from '../utils';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('MongoBinaryDownloadUrl', () => {
  // the following is to make sure that semver works in expected ways and as examples of how we use it
  describe('semver correctly coerces mongodb versions', () => {
    it('should convert a normal semver version', () => {
      const normal5 = semver.coerce('5.0.0');
      assertion(normal5);
      expect(normal5.version).toStrictEqual('5.0.0');

      const normalAll = semver.coerce('4.4.2');
      assertion(normalAll);
      expect(normalAll.version).toStrictEqual('4.4.2');
    });

    it('should convert "-latest" version correctly', () => {
      const latest5 = semver.coerce('v5.0-latest');
      assertion(latest5);
      expect(latest5.version).toStrictEqual('5.0.0');

      const latest44 = semver.coerce('v4.4-latest');
      assertion(latest44);
      expect(latest44.version).toStrictEqual('4.4.0');
    });
  });

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

      it('should work with mongodb 6.0', async () => {
        const du = new MongoBinaryDownloadUrl({
          platform: 'darwin',
          arch: 'x64',
          version: '6.0.0',
        });

        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/osx/mongodb-macos-x86_64-6.0.0.tgz'
        );
      });

      it('arm64 should use the x64 binary for versions below 6.0.0', async () => {
        const du = new MongoBinaryDownloadUrl({
          platform: 'darwin',
          arch: 'arm64',
          version: '4.4.0',
        });
        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/osx/mongodb-macos-x86_64-4.4.0.tgz'
        );
      });

      it('arm64 should use the arm64 binary for versions above and equal to 6.0.0', async () => {
        const du = new MongoBinaryDownloadUrl({
          platform: 'darwin',
          arch: 'arm64',
          version: '6.0.0',
        });
        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/osx/mongodb-macos-arm64-6.0.0.tgz'
        );
      });

      it('should work with mongodb 7.0 (x86_64)', async () => {
        const du = new MongoBinaryDownloadUrl({
          platform: 'darwin',
          arch: 'x64',
          version: '7.0.14',
        });

        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/osx/mongodb-macos-x86_64-7.0.14.tgz'
        );
      });

      it('should work with mongodb 7.0 (arm64)', async () => {
        const du = new MongoBinaryDownloadUrl({
          platform: 'darwin',
          arch: 'arm64',
          version: '7.0.14',
        });

        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/osx/mongodb-macos-arm64-7.0.14.tgz'
        );
      });

      it('should allow v5.0-latest x64', async () => {
        const du = new MongoBinaryDownloadUrl({
          platform: 'darwin',
          arch: 'x64',
          version: 'v5.0-latest',
        });
        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/osx/mongodb-macos-x86_64-v5.0-latest.tgz'
        );
      });

      it('should allow v5.0-latest arm64', async () => {
        const du = new MongoBinaryDownloadUrl({
          platform: 'darwin',
          arch: 'arm64',
          version: 'v5.0-latest',
        });
        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/osx/mongodb-macos-x86_64-v5.0-latest.tgz'
        );
      });
    });

    describe('for linux', () => {
      describe('for ubuntu', () => {
        it('should default to Ubuntu 22.04, if version cannot be parsed', async () => {
          const spy = jest.spyOn(console, 'warn').mockImplementationOnce(() => void 0);
          // TODO: try to keep this up-to-date to the latest mongodb supported ubuntu version
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '7.0.4',
            os: {
              os: 'linux',
              dist: 'ubuntu',
              release: '',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2204-7.0.4.tgz'
          );
          expect(console.warn).toHaveBeenCalledTimes(1);
          expect(spy.mock.calls).toMatchSnapshot();
        });

        it('for ubuntu 14.04 for 3.6', async () => {
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

        it('for ubuntu 20.04 for 4.0', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '4.0.0',
            os: {
              os: 'linux',
              dist: 'ubuntu',
              release: '20.04',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1804-4.0.0.tgz'
          );
        });

        it('for ubuntu 22.04 for 4.0 (using 1804)', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '4.0.0',
            os: {
              os: 'linux',
              dist: 'ubuntu',
              release: '22.04',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1804-4.0.0.tgz'
          );
        });

        it('for ubuntu 22.04 for 4.4 (using 2004)', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '4.4.0',
            os: {
              os: 'linux',
              dist: 'ubuntu',
              release: '22.04',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-4.4.0.tgz'
          );
        });

        it('for ubuntu 20.04 for 5.0', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '5.0.8',
            os: {
              os: 'linux',
              dist: 'ubuntu',
              release: '20.04',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-5.0.8.tgz'
          );
        });

        it('for ubuntu 22.04 for 5.0 (using 2004)', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '5.0.8',
            os: {
              os: 'linux',
              dist: 'ubuntu',
              release: '22.04',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-5.0.8.tgz'
          );
        });

        it('for ubuntu 20.04 for 6.0', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '6.0.0',
            os: {
              os: 'linux',
              dist: 'ubuntu',
              release: '20.04',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-6.0.0.tgz'
          );
        });

        it('for ubuntu 22.04 for 6.0 (using 2004)', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '6.0.0',
            os: {
              os: 'linux',
              dist: 'ubuntu',
              release: '22.04',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-6.0.0.tgz'
          );
        });

        it('for ubuntu 22.04 for 6.0.4', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '6.0.4',
            os: {
              os: 'linux',
              dist: 'ubuntu',
              release: '22.04',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2204-6.0.4.tgz'
          );
        });

        it('for ubuntu 22.04 for 7.0.14', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '7.0.14',
            os: {
              os: 'linux',
              dist: 'ubuntu',
              release: '22.04',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2204-7.0.14.tgz'
          );
        });

        it('for ubuntu 24.04 for 7.0.14', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '7.0.14',
            os: {
              os: 'linux',
              dist: 'ubuntu',
              release: '24.04',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2204-7.0.14.tgz'
          );
        });

        it('for ubuntu 22.04 for 8.0.1', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '8.0.1',
            os: {
              os: 'linux',
              dist: 'ubuntu',
              release: '22.04',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2204-8.0.1.tgz'
          );
        });

        it('for ubuntu 24.04 for 8.0.1', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '8.0.1',
            os: {
              os: 'linux',
              dist: 'ubuntu',
              release: '24.04',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2404-8.0.1.tgz'
          );
        });

        it('should allow v5.0-latest', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: 'v5.0-latest',
            os: {
              os: 'linux',
              dist: 'ubuntu',
              release: '20.04',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-v5.0-latest.tgz'
          );
        });

        it('should throw a Error when the provided version could not be coerced [UnknownVersionError]', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: 'vvv',
            os: {
              os: 'linux',
              dist: 'ubuntu',
              release: '20.04',
            },
          });

          try {
            await du.getDownloadUrl();
            fail('Expected to throw a UnknownVersionError');
          } catch (err) {
            assertIsError(err);
            expect(err).toBeInstanceOf(UnknownVersionError);
            expect(err.message).toMatchSnapshot();
          }
        });

        it('should clamp to highest supported ubuntu year', async () => {
          // TODO: try to keep this up-to-date to the latest mongodb supported ubuntu version
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '8.0.1', // highest released mongodb version
            os: {
              os: 'linux',
              dist: 'ubuntu',
              release: '24.04', // highest released ubuntu version
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2404-8.0.1.tgz'
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

          it('for ubuntu arm64 5.0.0 & ubuntu2004 (above 4.4.0)', async () => {
            const du = new MongoBinaryDownloadUrl({
              platform: 'linux',
              arch: 'arm64',
              version: '5.0.0',
              os: {
                os: 'linux',
                dist: 'Ubuntu Linux',
                release: '20.04',
              },
            });
            expect(await du.getDownloadUrl()).toBe(
              'https://fastdl.mongodb.org/linux/mongodb-linux-aarch64-ubuntu2004-5.0.0.tgz'
            );
          });

          it('for ubuntu arm64 5.0.0 & ubuntu2204 (above 4.4.0)', async () => {
            const du = new MongoBinaryDownloadUrl({
              platform: 'linux',
              arch: 'arm64',
              version: '5.0.0',
              os: {
                os: 'linux',
                dist: 'Ubuntu Linux',
                release: '22.04',
              },
            });
            expect(await du.getDownloadUrl()).toBe(
              'https://fastdl.mongodb.org/linux/mongodb-linux-aarch64-ubuntu2004-5.0.0.tgz'
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

        it('for debian 11 for 5.0.7 (using debian 10 binaries)', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '5.0.7',
            os: {
              os: 'linux',
              dist: 'debian',
              release: '11',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian10-5.0.7.tgz'
          );
        });

        it('for debian 11 for 5.0.8', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '5.0.8',
            os: {
              os: 'linux',
              dist: 'debian',
              release: '11',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian11-5.0.8.tgz'
          );
        });

        it('for debian 11 for v5.0-latest', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: 'v5.0-latest',
            os: {
              os: 'linux',
              dist: 'debian',
              release: '11',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian11-v5.0-latest.tgz'
          );
        });

        it('for debian 11 for 6.0.0', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '6.0.0',
            os: {
              os: 'linux',
              dist: 'debian',
              release: '11',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian11-6.0.0.tgz'
          );
        });

        it('for debian 12 for 7.0.3', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '7.0.3',
            os: {
              os: 'linux',
              dist: 'debian',
              release: '12',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian12-7.0.3.tgz'
          );
        });

        it('should allow v5.0-latest', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: 'v5.0-latest',
            os: {
              os: 'linux',
              dist: 'debian',
              release: '10',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian10-v5.0-latest.tgz'
          );
        });

        it('for debian testing/unstable', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '7.0.3',
            os: {
              os: 'linux',
              dist: 'debian',
              release: '',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian12-7.0.3.tgz'
          );
        });

        it('should throw a Error when the provided version could not be coerced [UnknownVersionError]', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: 'vvv',
            os: {
              os: 'linux',
              dist: 'debian',
              release: '10',
            },
          });

          try {
            await du.getDownloadUrl();
            fail('Expected to throw a UnknownVersionError');
          } catch (err) {
            assertIsError(err);
            expect(err).toBeInstanceOf(UnknownVersionError);
            expect(err.message).toMatchSnapshot();
          }
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

        it('should not throw a error for v4.2-latest for debian 10+', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: 'v4.2-latest',
            os: {
              os: 'linux',
              dist: 'debian',
              release: '10',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian10-v4.2-latest.tgz'
          );
        });

        it('should throw a Error when requesting a version below 4.2.1 for debian 11+ [#554] [KnownVersionIncompatibilityError]', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '4.0.25',
            os: {
              os: 'linux',
              dist: 'debian',
              release: '11',
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

        it('should throw an error when requesting a version below 7.0.3 for debian 12+ [#797] [KnownVersionIncompatibilityError]', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '7.0.2',
            os: {
              os: 'linux',
              dist: 'debian',
              release: '12',
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

        it('should not throw an error for v7.0-latest for debian 12', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: 'v7.0-latest',
            os: {
              os: 'linux',
              dist: 'debian',
              release: '12',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian12-v7.0-latest.tgz'
          );
        });

        it('should throw a Error when requesting a version below 7.0.3 for debian testing [KnownVersionIncompatibilityError]', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '7.0.2',
            os: {
              os: 'linux',
              dist: 'debian',
              codename: 'trixie',
              release: '',
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

      // for arch and arch based systems (no specific extra mapping)
      describe('for arch', () => {
        it('for arch for 4.4.2', async () => {
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

        it('for arch for 5.0.0', async () => {
          jest.spyOn(console, 'warn').mockImplementation(() => void 0);

          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '5.0.0',
            os: {
              os: 'linux',
              dist: 'Arch',
              release: 'rolling',
              id_like: ['arch'],
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-5.0.0.tgz'
          );
          expect(console.warn).toHaveBeenCalledTimes(1);
        });

        it('for arch for 6.0.4', async () => {
          jest.spyOn(console, 'warn').mockImplementation(() => void 0);

          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '6.0.4',
            os: {
              os: 'linux',
              dist: 'Arch',
              release: 'rolling',
              id_like: ['arch'],
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2204-6.0.4.tgz'
          );
          expect(console.warn).toHaveBeenCalledTimes(1);
        });

        it('for manjaro for 4.4.2', async () => {
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

        it('for archstrike for 4.4.2', async () => {
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
      });

      describe('for gentoo', () => {
        it('for gentoo 5.0.8', async () => {
          jest.spyOn(console, 'warn').mockImplementation(() => void 0);

          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '5.0.8',
            os: {
              os: 'linux',
              dist: 'gentoo',
              release: '',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian11-5.0.8.tgz'
          );
          expect(console.warn).toHaveBeenCalledTimes(1);
        });

        it('for gentoo 4.4', async () => {
          jest.spyOn(console, 'warn').mockImplementation(() => void 0);

          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '4.4.0',
            os: {
              os: 'linux',
              dist: 'gentoo',
              release: '',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian10-4.4.0.tgz'
          );
          expect(console.warn).toHaveBeenCalledTimes(1);
        });
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

        it('should return a archive name for elementary 6.1', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '5.0.0',
            // from "elementary/docker:odin-stable" (id: 1a8a0700e015)
            os: {
              os: 'linux',
              dist: 'elementary',
              codename: 'jolnir',
              release: '6.1',
              id_like: ['ubuntu'],
            },
          });

          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-5.0.0.tgz'
          );
        });

        it('should return a archive name for elementary 7.0', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '6.0.4',
            // from "elementary/docker:horus-stable" (id: a43c2a2e2cf2)
            os: {
              os: 'linux',
              dist: 'elementary',
              codename: 'horus',
              release: '7',
              id_like: ['ubuntu'],
            },
          });

          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2204-6.0.4.tgz'
          );
        });
      });

      describe('for LinuxMint', () => {
        let downloadUrl: MongoBinaryDownloadUrl;
        beforeEach(() => {
          downloadUrl = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '0.0.0',
            os: {
              os: 'linux',
              dist: 'Linux Mint',
              release: '',
              id_like: ['ubuntu'],
            },
          });
        });

        it('should default to Mint Version 20, if version cannot be found in lookup table', async () => {
          (downloadUrl.os as LinuxOS).release = '16'; // out-of-range version
          downloadUrl.version = '6.0.4';
          expect(await downloadUrl.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-6.0.4.tgz'
          );
        });

        it('should return a archive name for Linux Mint 17', async () => {
          (downloadUrl.os as LinuxOS).release = '17';
          downloadUrl.version = '4.0.25';
          expect(await downloadUrl.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1404-4.0.25.tgz'
          );
        });

        it('should return a archive name for Linux Mint 18', async () => {
          (downloadUrl.os as LinuxOS).release = '18';
          downloadUrl.version = '4.0.25';
          expect(await downloadUrl.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1604-4.0.25.tgz'
          );
        });

        it('should return a archive name for Linux Mint 19', async () => {
          (downloadUrl.os as LinuxOS).release = '19';
          downloadUrl.version = '4.0.25';
          expect(await downloadUrl.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1804-4.0.25.tgz'
          );
        });

        it('should return a archive name for Linux Mint 20', async () => {
          (downloadUrl.os as LinuxOS).release = '20';
          downloadUrl.version = '6.0.4';
          expect(await downloadUrl.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-6.0.4.tgz'
          );
        });

        it('should return a archive name for Linux Mint 21', async () => {
          (downloadUrl.os as LinuxOS).release = '21';
          downloadUrl.version = '6.0.4';
          expect(await downloadUrl.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2204-6.0.4.tgz'
          );
        });

        it('should return a archive name for Linux Mint 21', async () => {
          (downloadUrl.os as LinuxOS).release = '22';
          downloadUrl.version = '7.0.14';
          // NOTE: there are currently no binaries for ubuntu 24.04, but 22.04 still work
          expect(await downloadUrl.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2204-7.0.14.tgz'
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

        it('should return a archive name for Fedora 35', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '5.0.8',
            os: {
              os: 'linux',
              dist: 'fedora',
              release: '35',
            },
          });

          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel80-5.0.8.tgz'
          );
        });

        it('should return a archive name for Fedora 36', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '5.0.8',
            os: {
              os: 'linux',
              dist: 'fedora',
              release: '36',
            },
          });

          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel80-5.0.8.tgz'
          );
        });

        it('should return a archive name for Fedora 36', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '6.0.0',
            os: {
              os: 'linux',
              dist: 'fedora',
              release: '36',
            },
          });

          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel80-6.0.0.tgz'
          );
        });

        it('fedora 36 & 7.0.13 x86_64', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '7.0.13',
            os: {
              os: 'linux',
              dist: 'fedora',
              release: '36',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel8-7.0.13.tgz'
          );
        });
      });

      // see https://github.com/typegoose/mongodb-memory-server/issues/527
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

        it('should return a archive name for Amazon 2023', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '7.0.2',
            os: {
              os: 'linux',
              dist: 'amzn',
              release: '2023',
              id_like: ['fedora'],
            },
          });

          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-amazon2023-7.0.2.tgz'
          );
        });
      });

      describe('for rhel', () => {
        // These tests are made based on how the current implementation is, no actual rhel testing was done, so the data might be inaccurate
        it('rhel 8 & 4.2.0 x86_64', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '4.2.0',
            os: {
              os: 'linux',
              dist: 'rhel',
              release: '8.2',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel80-4.2.0.tgz'
          );
        });

        it('rhel 8 & 5.0.0 x86_64', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '5.0.0',
            os: {
              os: 'linux',
              dist: 'rhel',
              release: '8.2',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel80-5.0.0.tgz'
          );
        });

        describe('rhel 8 download name change (JIRA SERVER-92375)', () => {
          it('rhel 8 & 5.0.29 x86_64', async () => {
            const du = new MongoBinaryDownloadUrl({
              platform: 'linux',
              arch: 'x64',
              version: '5.0.29',
              os: {
                os: 'linux',
                dist: 'rhel',
                release: '8.2',
              },
            });
            expect(await du.getDownloadUrl()).toBe(
              'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel8-5.0.29.tgz'
            );
          });

          it('rhel 8 & 6.0.17 x86_64', async () => {
            const du = new MongoBinaryDownloadUrl({
              platform: 'linux',
              arch: 'x64',
              version: '6.0.17',
              os: {
                os: 'linux',
                dist: 'rhel',
                release: '8.2',
              },
            });
            expect(await du.getDownloadUrl()).toBe(
              'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel8-6.0.17.tgz'
            );
          });

          it('rhel 8 & 7.0.13 x86_64', async () => {
            const du = new MongoBinaryDownloadUrl({
              platform: 'linux',
              arch: 'x64',
              version: '7.0.13',
              os: {
                os: 'linux',
                dist: 'rhel',
                release: '8.2',
              },
            });
            expect(await du.getDownloadUrl()).toBe(
              'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel8-7.0.13.tgz'
            );
          });

          it('rhel 8 & 8.0.0 x86_64', async () => {
            const du = new MongoBinaryDownloadUrl({
              platform: 'linux',
              arch: 'x64',
              version: '8.0.0',
              os: {
                os: 'linux',
                dist: 'rhel',
                release: '8.2',
              },
            });
            expect(await du.getDownloadUrl()).toBe(
              'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel8-8.0.0.tgz'
            );
          });

          it('rhel 8.2 & 5.0.29 arm64', async () => {
            const du = new MongoBinaryDownloadUrl({
              platform: 'linux',
              arch: 'arm64',
              version: '5.0.29',
              os: {
                os: 'linux',
                dist: 'rhel',
                release: '8.2',
              },
            });
            expect(await du.getDownloadUrl()).toBe(
              'https://fastdl.mongodb.org/linux/mongodb-linux-aarch64-rhel8-5.0.29.tgz'
            );
          });

          it('rhel 8.2 & 6.0.17 arm64', async () => {
            const du = new MongoBinaryDownloadUrl({
              platform: 'linux',
              arch: 'arm64',
              version: '6.0.17',
              os: {
                os: 'linux',
                dist: 'rhel',
                release: '8.2',
              },
            });
            expect(await du.getDownloadUrl()).toBe(
              'https://fastdl.mongodb.org/linux/mongodb-linux-aarch64-rhel8-6.0.17.tgz'
            );
          });

          it('rhel 8.2 & 7.0.13 arm64', async () => {
            const du = new MongoBinaryDownloadUrl({
              platform: 'linux',
              arch: 'arm64',
              version: '7.0.13',
              os: {
                os: 'linux',
                dist: 'rhel',
                release: '8.2',
              },
            });
            expect(await du.getDownloadUrl()).toBe(
              'https://fastdl.mongodb.org/linux/mongodb-linux-aarch64-rhel8-7.0.13.tgz'
            );
          });

          it('rhel 8.2 & 8.0.0 arm64', async () => {
            const du = new MongoBinaryDownloadUrl({
              platform: 'linux',
              arch: 'arm64',
              version: '8.0.0',
              os: {
                os: 'linux',
                dist: 'rhel',
                release: '8.2',
              },
            });
            expect(await du.getDownloadUrl()).toBe(
              'https://fastdl.mongodb.org/linux/mongodb-linux-aarch64-rhel8-8.0.0.tgz'
            );
          });
        });

        it('rhel 8.2 & 4.4.2 arm64', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'arm64',
            version: '4.4.2',
            os: {
              os: 'linux',
              dist: 'rhel',
              release: '8.2',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-aarch64-rhel82-4.4.2.tgz'
          );
        });

        it('rhel 8.2 & 5.0.0 arm64', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'arm64',
            version: '5.0.0',
            os: {
              os: 'linux',
              dist: 'rhel',
              release: '8.2',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-aarch64-rhel82-5.0.0.tgz'
          );
        });

        it('rhel 8.2 & 6.0.10 arm64', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'arm64',
            version: '6.0.10',
            os: {
              os: 'linux',
              dist: 'rhel',
              release: '8.2',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-aarch64-rhel82-6.0.10.tgz'
          );
        });

        it('rhel 8.2 & 7.0.0 arm64', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'arm64',
            version: '7.0.0',
            os: {
              os: 'linux',
              dist: 'rhel',
              release: '8.2',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-aarch64-rhel82-7.0.0.tgz'
          );
        });

        it('rhel 9 & 6.0.4 x86_64', async () => {
          // lowest rhel 9 x64 supported version is 6.0.4
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '6.0.4',
            os: {
              os: 'linux',
              dist: 'rhel',
              release: '9',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel90-6.0.4.tgz'
          );
        });

        it('rhel 9 & 7.0.0 x86_64', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '7.0.0',
            os: {
              os: 'linux',
              dist: 'rhel',
              release: '9',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel90-7.0.0.tgz'
          );
        });

        it('rhel 9 & 6.0.7 arm64', async () => {
          // lowest rhel 9 arm64 supported version is 6.0.7
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'arm64',
            version: '6.0.7',
            os: {
              os: 'linux',
              dist: 'rhel',
              release: '9',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-aarch64-rhel90-6.0.7.tgz'
          );
        });

        it('rhel 9 & 7.0.0 arm64', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'arm64',
            version: '7.0.0',
            os: {
              os: 'linux',
              dist: 'rhel',
              release: '9',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-aarch64-rhel90-7.0.0.tgz'
          );
        });

        it('should allow v5.0-latest', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: 'v5.0-latest',
            os: {
              os: 'linux',
              dist: 'rhel',
              release: '8',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel80-v5.0-latest.tgz'
          );
        });

        it('rocky linux 9.2 & 6.0.4 x86_64', async () => {
          // lowest rhel 9 x64 supported version is 6.0.4
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '6.0.4',
            os: {
              os: 'linux',
              dist: 'rocky',
              release: '9.2',
              id_like: ['rhel', 'centos', 'fedora'],
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel90-6.0.4.tgz'
          );
        });

        it('rocky linux 9.2 & 6.0.7 arm64', async () => {
          // lowest rhel 9 arm64 supported version is 6.0.7
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'arm64',
            version: '6.0.7',
            os: {
              os: 'linux',
              dist: 'rocky',
              release: '9.2',
              id_like: ['rhel', 'centos', 'fedora'],
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-aarch64-rhel90-6.0.7.tgz'
          );
        });

        it('should Error when ARM64 and rhel below 8 [KnownVersionIncompatibilityError]', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'arm64',
            version: '4.4.2',
            os: {
              os: 'linux',
              dist: 'rhel',
              release: '7',
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

        it('should Error when ARM64 rhel 9 and mongodb before 6.0.7 are requested [KnownVersionIncompatibilityError]', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'arm64',
            version: '6.0.6',
            os: {
              os: 'linux',
              dist: 'rhel',
              release: '9',
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

        it('should Error when ARM64 and version below 4.4.2 is requested [KnownVersionIncompatibilityError]', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'arm64',
            version: '4.4.0',
            os: {
              os: 'linux',
              dist: 'rhel',
              release: '8',
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

        it('should not throw a error for arm64 v4.4-latest', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'arm64',
            version: 'v4.4-latest',
            os: {
              os: 'linux',
              dist: 'rhel',
              release: '8.2',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-aarch64-rhel82-v4.4-latest.tgz'
          );
        });

        it('should warn when a unhandled RHEL release is used', async () => {
          const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementationOnce(() => void 0);

          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x86_64',
            version: '5.0.0',
            os: {
              os: 'linux',
              dist: 'rhel',
              release: '0',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel70-5.0.0.tgz'
          );

          expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
          expect(consoleWarnSpy).toHaveBeenCalledWith('Unhandled RHEL version: "0"("x86_64")');
        });

        it('should warn when a RHEL release could not be coerced', async () => {
          const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementationOnce(() => void 0);

          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x86_64',
            version: '5.0.0',
            os: {
              os: 'linux',
              dist: 'rhel',
              release: 'a',
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel70-5.0.0.tgz'
          );

          expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
          expect(consoleWarnSpy).toHaveBeenCalledWith('Couldnt coerce RHEL version "a"');
        });

        it('should throw a Error when the provided version could not be coerced [UnknownVersionError]', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: 'vvv',
            os: {
              os: 'linux',
              dist: 'rhel',
              release: '9',
            },
          });

          try {
            await du.getDownloadUrl();
            fail('Expected to throw a UnknownVersionError');
          } catch (err) {
            assertIsError(err);
            expect(err).toBeInstanceOf(UnknownVersionError);
            expect(err.message).toMatchSnapshot();
          }
        });
      });

      describe('Oracle Linux', () => {
        it('ol 8.7 & 5.0.0 x86_64', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '5.0.0',
            os: {
              os: 'linux',
              dist: 'ol',
              release: '8.7',
              id_like: ['fedora'],
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel80-5.0.0.tgz'
          );
        });

        it('ol 8.7 & 4.4.17 x86_64', async () => {
          const du = new MongoBinaryDownloadUrl({
            platform: 'linux',
            arch: 'x64',
            version: '4.4.17',
            os: {
              os: 'linux',
              dist: 'ol',
              release: '8.7',
              id_like: ['fedora'],
            },
          });
          expect(await du.getDownloadUrl()).toBe(
            'https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel80-4.4.17.tgz'
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

      it('7.0.14 (windows)', async () => {
        const du = new MongoBinaryDownloadUrl({
          platform: 'win32',
          arch: 'x64',
          version: '7.0.14',
        });
        expect(await du.getDownloadUrl()).toBe(
          'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.14.zip'
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
          os: {
            os: 'linux',
            dist: 'Ubuntu Linux',
            release: '18.04',
          },
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

    it('should return a archive name for Ubuntu 22.04 using 1804 4.0', () => {
      downloadUrl.version = '4.0.0';
      expect(
        downloadUrl.getUbuntuVersionString({
          os: 'linux',
          dist: 'Ubuntu Linux',
          release: '22.04',
        })
      ).toBe('ubuntu1804');
    });

    it('should return a archive name for Ubuntu 22.04 using 2004 4.4', () => {
      downloadUrl.version = '4.4.0';
      expect(
        downloadUrl.getUbuntuVersionString({
          os: 'linux',
          dist: 'Ubuntu Linux',
          release: '22.04',
        })
      ).toBe('ubuntu2004');
    });

    it('should return default version with warning when using ID_LIKE but not being ubuntu', () => {
      // Test for https://github.com/typegoose/mongodb-memory-server/issues/616
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementationOnce(() => void 0);

      downloadUrl.version = '6.0.4';
      expect(
        downloadUrl.getUbuntuVersionString({
          os: 'linux',
          dist: 'zorin',
          release: '16',
          id_like: ['ubuntu'],
        })
      ).toBe('ubuntu2204');

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    });

    it('should fallback to default version if release is not parsed correctly', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementationOnce(() => void 0);

      downloadUrl.version = '6.0.4';
      expect(
        downloadUrl.getUbuntuVersionString({
          os: 'linux',
          dist: 'Ubuntu Linux',
          release: 'nan',
        })
      ).toBe('ubuntu2204');

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
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

  describe('getLinuxOSVersionString()', () => {
    it('should give a throw when distro is "alpine"', () => {
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

      try {
        du.getLinuxOSVersionString(du.os as LinuxOS);
        fail('Expected to throw');
      } catch (err) {
        assertIsError(err);
        expect(err).toBeInstanceOf(UnknownLinuxDistro);
        expect(err.message).toStrictEqual('Unknown/unsupported linux "alpine" id_like\'s: []');
      }
      expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it('should give a error when distro is "unknown"', () => {
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

      try {
        du.getLinuxOSVersionString(du.os as LinuxOS);
        fail('Expected to throw');
      } catch (err) {
        assertIsError(err);
        expect(err).toBeInstanceOf(UnknownLinuxDistro);
        expect(err.message).toStrictEqual('Unknown/unsupported linux "unknown" id_like\'s: []');
      }
    });

    describe('wrap config options', () => {
      const originalEnv = process.env;

      beforeEach(() => {
        process.env = originalEnv;
      });

      afterAll(() => {
        process.env = originalEnv;
      });

      it('should apply config option DISTRO', async () => {
        const du = new MongoBinaryDownloadUrl({
          platform: 'linux',
          arch: 'x64',
          version: '5.0.0',
          os: {
            os: 'linux',
            dist: 'unknown',
            release: '0',
            codename: 'unknown',
          },
        });
        // @ts-expect-error "overwriteDistro" is protected
        jest.spyOn(du, 'overwriteDistro');

        process.env[envName(ResolveConfigVariables.DISTRO)] = 'ubuntu-18.04';

        expect((await du.getArchiveNameLinux()).includes('ubuntu1804')).toBeTruthy();

        // @ts-expect-error "overwriteDistro" is protected
        expect(du.overwriteDistro).toBeCalledTimes(1);
      });
    });

    describe('wrap config options', () => {
      const originalEnv = process.env;

      beforeEach(() => {
        process.env = originalEnv;
      });

      afterAll(() => {
        process.env = originalEnv;
      });

      it('should apply config option DISTRO', async () => {
        const du = new MongoBinaryDownloadUrl({
          platform: 'linux',
          arch: 'x64',
          version: '5.0.0',
          os: {
            os: 'linux',
            dist: 'unknown',
            release: '0',
            codename: 'unknown',
          },
        });
        // @ts-expect-error "overwriteDistro" is protected
        jest.spyOn(du, 'overwriteDistro');

        process.env[envName(ResolveConfigVariables.DISTRO)] = 'ubuntu-18.04';

        expect((await du.getArchiveNameLinux()).includes('ubuntu1804')).toBeTruthy();

        // @ts-expect-error "overwriteDistro" is protected
        expect(du.overwriteDistro).toBeCalledTimes(1);
      });
    });
  });

  describe('translateArch()', () => {
    it('should throw error when "ia32" is used', () => {
      try {
        MongoBinaryDownloadUrl.translateArch('ia32');
        fail('Expected "translateArch" to fail');
      } catch (err) {
        assertIsError(err);
        expect(err).toBeInstanceOf(UnknownArchitectureError);
        expect(err.message).toMatchSnapshot();
      }
    });

    it('should throw an error for an unsupported architecture', () => {
      try {
        MongoBinaryDownloadUrl.translateArch('risc');
        fail('Expected "translateArch" to fail');
      } catch (err) {
        assertIsError(err);
        expect(err).toBeInstanceOf(UnknownArchitectureError);
        expect(err.message).toMatchSnapshot();
      }
    });

    it('should translate "x64" and "x86_64" to "x86_64"', () => {
      expect(MongoBinaryDownloadUrl.translateArch('x64')).toStrictEqual('x86_64');
      expect(MongoBinaryDownloadUrl.translateArch('x86_64')).toStrictEqual('x86_64');
    });

    it('should translate "arm64" and "aarch64" to "aarch64"', () => {
      expect(MongoBinaryDownloadUrl.translateArch('arm64')).toStrictEqual('aarch64');
      expect(MongoBinaryDownloadUrl.translateArch('aarch64')).toStrictEqual('aarch64');
    });
  });

  describe('translatePlatform()', () => {
    it('should translate "darwin" to "osx"', () => {
      const du = new MongoBinaryDownloadUrl({
        platform: 'darwin',
        arch: 'x64',
        version: '5.0.8',
        os: {
          os: 'darwin',
        },
      });
      expect(du.translatePlatform('darwin')).toBe('osx');
    });

    it('should translate "linux" to "linux"', () => {
      const du = new MongoBinaryDownloadUrl({
        platform: 'linux',
        arch: 'x64',
        version: '5.0.8',
        os: {
          os: 'linux',
          dist: 'ubuntu',
          release: '20.04',
        },
      });
      expect(du.translatePlatform('linux')).toBe('linux');
    });

    it('should translate "win32" to "win32" for below 4.3.0', () => {
      const du = new MongoBinaryDownloadUrl({
        platform: 'win32',
        arch: 'x64',
        version: '4.2.0',
        os: {
          os: 'win32',
        },
      });
      expect(du.translatePlatform('win32')).toBe('win32');
    });

    it('should translate "win32" to "windows" for above & equal to 4.3.0', () => {
      const du = new MongoBinaryDownloadUrl({
        platform: 'win32',
        arch: 'x64',
        version: '4.3.0',
        os: {
          os: 'win32',
        },
      });
      expect(du.translatePlatform('win32')).toBe('windows');
    });

    it('should throw when using "sunos"', () => {
      const du = new MongoBinaryDownloadUrl({
        platform: 'win32', // mock to use later call for actual testing
        arch: 'x64',
        version: '0.0.0',
        os: {
          os: 'win32',
        },
      });
      expect(() => du.translatePlatform('sunos')).toThrowError(UnknownPlatformError);
    });
  });

  describe('getArchiveNameWin()', () => {
    const downloadUrlBase: ConstructorParameters<typeof MongoBinaryDownloadUrl>[0] = {
      platform: 'win32',
      arch: 'x64',
      version: '6.0.0',
    };
    let downloadUrl: MongoBinaryDownloadUrl;
    beforeEach(() => {
      downloadUrl = new MongoBinaryDownloadUrl(downloadUrlBase);
    });

    it('for mongodb 6.0', () => {
      downloadUrl.version = '6.0.0';
      expect(downloadUrl.getArchiveNameWin()).toBe('mongodb-windows-x86_64-6.0.0.zip');
    });

    it('for mongodb 5.0', () => {
      downloadUrl.version = '5.0.0';
      expect(downloadUrl.getArchiveNameWin()).toBe('mongodb-windows-x86_64-5.0.0.zip');
    });

    it('for mongodb 4.4', () => {
      downloadUrl.version = '4.4.0';
      expect(downloadUrl.getArchiveNameWin()).toBe('mongodb-windows-x86_64-4.4.0.zip');
    });

    it('for mongodb 4.2', () => {
      // custom reset, because of versions below 4.3.0 using win32 (setting in translatePlatform)
      downloadUrl = new MongoBinaryDownloadUrl({
        ...downloadUrlBase,
        version: '4.2.0',
      });
      expect(downloadUrl.getArchiveNameWin()).toBe('mongodb-win32-x86_64-2012plus-4.2.0.zip');
    });

    it('for mongodb 4.0', () => {
      // custom reset, because of versions below 4.3.0 using win32 (setting in translatePlatform)
      downloadUrl = new MongoBinaryDownloadUrl({
        ...downloadUrlBase,
        version: '4.0.0',
      });
      expect(downloadUrl.getArchiveNameWin()).toBe('mongodb-win32-x86_64-2008plus-ssl-4.0.0.zip');
    });

    it('should allow v5.0-latest', () => {
      downloadUrl.version = 'v5.0-latest';
      expect(downloadUrl.getArchiveNameWin()).toBe('mongodb-windows-x86_64-v5.0-latest.zip');
    });
  });
});
