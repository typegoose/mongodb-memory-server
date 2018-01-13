/* @flow */

import MongoBinaryDownloadUrl from '../MongoBinaryDownloadUrl';

describe('MongoBinaryDownloadUrl', () => {
  describe('getDownloadUrl()', () => {
    it('for ubuntu', async () => {
      const du = new MongoBinaryDownloadUrl({
        platform: 'linux',
        arch: 'x64',
        version: '3.4.4',
        os: {
          dist: 'Ubuntu Linux',
          release: '14.04',
        },
      });
      expect(await du.getDownloadUrl()).toBe(
        'https://downloads.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1404-3.4.4.tgz'
      );
    });

    it('for debian', async () => {
      const du = new MongoBinaryDownloadUrl({
        platform: 'linux',
        arch: 'x64',
        version: '3.4.4',
        os: {
          dist: 'debian',
          release: '8.1',
        },
      });
      expect(await du.getDownloadUrl()).toBe(
        'https://downloads.mongodb.org/linux/mongodb-linux-x86_64-debian81-3.4.4.tgz'
      );
    });

    it('for win32', async () => {
      const du = new MongoBinaryDownloadUrl({
        platform: 'win32',
        arch: 'x64',
        version: '3.4.4',
      });
      expect(await du.getDownloadUrl()).toBe(
        'https://downloads.mongodb.org/win32/mongodb-win32-x86_64-3.4.4.zip'
      );
    });
  });

  describe('getUbuntuVersionString()', () => {
    const downloadUrl = new MongoBinaryDownloadUrl({
      platform: 'linux',
      arch: 'x64',
      version: '3.4.4',
    });

    it('should return a archive name for Ubuntu 14.10', () => {
      expect(
        downloadUrl.getUbuntuVersionString({
          dist: 'Ubuntu Linux',
          release: '14.10',
        })
      ).toBe('ubuntu1410-clang');
    });

    it('should return a archive name for Ubuntu 14.04', () => {
      expect(
        downloadUrl.getUbuntuVersionString({
          dist: 'Ubuntu Linux',
          release: '14.04',
        })
      ).toBe('ubuntu1404');
    });

    it('should return a archive name for Ubuntu 12.04', () => {
      expect(
        downloadUrl.getUbuntuVersionString({
          dist: 'Ubuntu Linux',
          release: '12.04',
        })
      ).toBe('ubuntu1204');
    });
  });

  describe('getDebianVersionString()', () => {
    const downloadUrl = new MongoBinaryDownloadUrl({
      platform: 'linux',
      arch: 'x64',
      version: '3.4.4',
    });

    it('should return a archive name for debian 6.2', () => {
      expect(
        downloadUrl.getDebianVersionString({
          dist: 'debian',
          release: '6.2',
        })
      ).toBe('debian');
    });

    it('should return a archive name for debian 7.0', () => {
      expect(
        downloadUrl.getDebianVersionString({
          dist: 'debian',
          release: '7.0',
        })
      ).toBe('debian');
    });

    it('should return a archive name for debian 7.1', () => {
      expect(
        downloadUrl.getDebianVersionString({
          dist: 'debian',
          release: '7.1',
        })
      ).toBe('debian71');
    });

    it('should return a archive name for debian 8.0', () => {
      expect(
        downloadUrl.getDebianVersionString({
          dist: 'debian',
          release: '8.0',
        })
      ).toBe('debian71');
    });

    it('should return a archive name for debian 8.1', () => {
      expect(
        downloadUrl.getDebianVersionString({
          dist: 'debian',
          release: '8.1',
        })
      ).toBe('debian81');
    });

    it('should return a archive name for debian 9.0', () => {
      expect(
        downloadUrl.getDebianVersionString({
          dist: 'debian',
          release: '9.0',
        })
      ).toBe('debian81');
    });
  });

  describe('getMintVersionString', () => {
    const downloadUrl = new MongoBinaryDownloadUrl({
      platform: 'linux',
      arch: 'x64',
      version: '3.4.4',
    });

    it('should return an archive name for Linux Mint', () => {
      expect(downloadUrl.getMintVersionString({ dist: 'Linux Mint' })).toBe('ubuntu1404');
    });
  });
});
