/* @flow */

import fs from 'fs';
import md5file from 'md5-file';
import MongoBinaryDownload from '../MongoBinaryDownload';

jest.mock('fs');
jest.mock('md5-file');

describe('MongoBinaryDownload', () => {
  afterEach(() => {
    delete process.env.MONGOMS_SKIP_MD5_CHECK;
  });

  it('skipMD5 attribute can be set via constructor parameter', () => {
    expect(new MongoBinaryDownload({ skipMD5: true }).skipMD5).toBe(true);
    expect(new MongoBinaryDownload({ skipMD5: false }).skipMD5).toBe(false);
  });

  it(`if skipMD5 input parameter is missing, then it checks 
MONGOMS_SKIP_MD5_CHECK environment variable`, () => {
    expect(new MongoBinaryDownload({}).skipMD5).toBe(false);
    process.env.MONGOMS_SKIP_MD5_CHECK = '1';
    expect(new MongoBinaryDownload({}).skipMD5).toBe(true);
  });

  it('should use direct download', async () => {
    process.env['yarn_https-proxy'] = '';
    process.env.yarn_proxy = '';
    process.env['npm_config_https-proxy'] = '';
    process.env.npm_config_proxy = '';
    process.env.https_proxy = '';
    process.env.http_proxy = '';

    const du = new MongoBinaryDownload({});
    // $FlowFixMe
    du.httpDownload = jest.fn();

    await du.download('https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.6.3.tgz');
    expect(du.httpDownload).toHaveBeenCalledTimes(1);
    const callArg1 = du.httpDownload.mock.calls[0][0];
    expect(callArg1.agent).toBeUndefined();
  });

  it('should pick up proxy from env vars', async () => {
    process.env['yarn_https-proxy'] = 'http://user:pass@proxy:8080';

    const du = new MongoBinaryDownload({});
    // $FlowFixMe
    du.httpDownload = jest.fn();

    await du.download('https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.6.3.tgz');
    expect(du.httpDownload).toHaveBeenCalledTimes(1);
    const callArg1 = du.httpDownload.mock.calls[0][0];
    expect(callArg1.agent).toBeDefined();
    expect(callArg1.agent.options.href).toBe('http://user:pass@proxy:8080/');
  });

  it(`checkMD5 returns true if md5 of downloaded mongoDBArchive is
the same as in the reference result`, () => {
    const someMd5 = 'md5';
    fs.readFileSync.mockImplementationOnce(() => `${someMd5} fileName`);
    md5file.sync.mockImplementationOnce(() => someMd5);
    const mongoDBArchivePath = '/some/path';
    const fileWithReferenceMd5 = '/another/path';
    const du = new MongoBinaryDownload({});
    // $FlowFixMe
    du.download = jest.fn(() => Promise.resolve(fileWithReferenceMd5));
    const urlToMongoDBArchivePath = 'some-url';
    return du.checkMD5(urlToMongoDBArchivePath, mongoDBArchivePath).then(res => {
      expect(res).toBe(true);
      expect(du.download).toBeCalledWith(urlToMongoDBArchivePath);
      expect(fs.readFileSync).toBeCalledWith(fileWithReferenceMd5);
      expect(md5file.sync).toBeCalledWith(mongoDBArchivePath);
    });
  });

  it(`checkMD5 throws an error if md5 of downloaded mongoDBArchive is NOT
  the same as in the reference result`, () => {
    fs.readFileSync.mockImplementationOnce(() => 'someMd5 fileName');
    md5file.sync.mockImplementationOnce(() => 'anotherMd5');
    const du = new MongoBinaryDownload({});
    // $FlowFixMe
    du.download = jest.fn(() => Promise.resolve(''));
    expect(du.checkMD5('', '')).rejects.toMatchInlineSnapshot(
      `[Error: MongoBinaryDownload: md5 check is failed]`
    );
  });

  it('true value of skipMD5 attribute disables checkMD5 validation', () => {
    expect.assertions(1);
    fs.readFileSync.mockImplementationOnce(() => 'someMd5 fileName');
    md5file.sync.mockImplementationOnce(() => 'anotherMd5');
    const du = new MongoBinaryDownload({});
    du.skipMD5 = true;
    return du.checkMD5('', '').then(res => {
      expect(res).toBe(undefined);
    });
  });
});
