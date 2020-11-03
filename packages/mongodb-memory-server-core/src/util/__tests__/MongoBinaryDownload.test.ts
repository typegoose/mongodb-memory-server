import fs from 'fs';
import md5file from 'md5-file';
import MongoBinaryDownload from '../MongoBinaryDownload';
import { ENV_CONFIG_PREFIX, ResolveConfigVariables } from '../resolveConfig';

jest.mock('fs');
jest.mock('md5-file');

describe('MongoBinaryDownload', () => {
  afterEach(() => {
    delete process.env[ENV_CONFIG_PREFIX + ResolveConfigVariables.MD5_CHECK];
  });

  it('checkMD5 attribute can be set via constructor parameter', () => {
    expect(new MongoBinaryDownload({ checkMD5: true }).checkMD5).toBe(true);
    expect(new MongoBinaryDownload({ checkMD5: false }).checkMD5).toBe(false);
  });

  it(`if checkMD5 input parameter is missing, then it checks
MONGOMS_MD5_CHECK environment variable`, () => {
    expect(new MongoBinaryDownload({}).checkMD5).toBe(false);
    process.env[ENV_CONFIG_PREFIX + ResolveConfigVariables.MD5_CHECK] = '1';
    expect(new MongoBinaryDownload({}).checkMD5).toBe(true);
  });

  it('should use direct download', async () => {
    process.env['yarn_https-proxy'] = '';
    process.env['yarn_proxy'] = '';
    process.env['npm_config_https-proxy'] = '';
    process.env['npm_config_proxy'] = '';
    process.env['https_proxy'] = '';
    process.env['http_proxy'] = '';

    const du = new MongoBinaryDownload({});
    du.httpDownload = jest.fn();
    du.locationExists = jest.fn().mockReturnValue(false);

    await du.download('https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.6.3.tgz');
    expect(du.httpDownload).toHaveBeenCalledTimes(1);
    const callArg1 = (du.httpDownload as jest.Mock).mock.calls[0][0];
    expect(callArg1.agent).toBeUndefined();
  });

  it('should skip download if binary tar exists', async () => {
    const du = new MongoBinaryDownload({});
    du.httpDownload = jest.fn();
    du.locationExists = jest.fn().mockReturnValue(true);

    await du.download('https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.6.3.tgz');

    expect(du.httpDownload).not.toHaveBeenCalled();
  });

  it('should pick up proxy from env vars', async () => {
    process.env['yarn_https-proxy'] = 'http://user:pass@proxy:8080';

    const du = new MongoBinaryDownload({});
    // $FlowFixMe
    du.httpDownload = jest.fn();
    du.locationExists = jest.fn().mockReturnValue(false);

    await du.download('https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.6.3.tgz');
    expect(du.httpDownload).toHaveBeenCalledTimes(1);
    const callArg1 = (du.httpDownload as jest.Mock).mock.calls[0][0];
    expect(callArg1.agent).toBeDefined();
    expect(callArg1.agent.proxy.href).toBe('http://user:pass@proxy:8080/');
  });

  it('should not reject unauthorized when npm strict-ssl config is false', async () => {
    // npm sets false config value as empty string in env vars
    process.env['npm_config_strict_ssl'] = '';

    const du = new MongoBinaryDownload({});
    du.httpDownload = jest.fn();
    du.locationExists = jest.fn().mockReturnValue(false);

    await du.download('https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.6.3.tgz');
    expect(du.httpDownload).toHaveBeenCalledTimes(1);
    const callArg1 = (du.httpDownload as jest.Mock).mock.calls[0][0];
    expect(callArg1.rejectUnauthorized).toBeDefined();
    expect(callArg1.rejectUnauthorized).toBe(false);
  });

  it('should reject unauthorized when npm strict-ssl config is true', async () => {
    // npm sets true config value as string 'true' in env vars
    process.env['npm_config_strict_ssl'] = 'true';

    const du = new MongoBinaryDownload({});
    du.httpDownload = jest.fn();
    du.locationExists = jest.fn().mockReturnValue(false);

    await du.download('https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.6.3.tgz');
    expect(du.httpDownload).toHaveBeenCalledTimes(1);
    const callArg1 = (du.httpDownload as jest.Mock).mock.calls[0][0];
    expect(callArg1.rejectUnauthorized).toBeDefined();
    expect(callArg1.rejectUnauthorized).toBe(true);
  });

  it(`makeMD5check returns true if md5 of downloaded mongoDBArchive is
the same as in the reference result`, () => {
    const someMd5 = 'md5';
    (fs.readFileSync as jest.Mock).mockImplementationOnce(() => `${someMd5} fileName`);
    (md5file.sync as jest.Mock).mockImplementationOnce(() => someMd5);
    const mongoDBArchivePath = '/some/path';
    const fileWithReferenceMd5 = '/another/path';
    const du = new MongoBinaryDownload({});
    // $FlowFixMe
    du.download = jest.fn(() => Promise.resolve(fileWithReferenceMd5));
    const urlToMongoDBArchivePath = 'some-url';
    du.checkMD5 = true;
    return du.makeMD5check(urlToMongoDBArchivePath, mongoDBArchivePath).then((res) => {
      expect(res).toBe(true);
      expect(du.download).toBeCalledWith(urlToMongoDBArchivePath);
      expect(fs.readFileSync).toBeCalledWith(fileWithReferenceMd5);
      expect(md5file.sync).toBeCalledWith(mongoDBArchivePath);
    });
  });

  it(`makeMD5check throws an error if md5 of downloaded mongoDBArchive is NOT
  the same as in the reference result`, () => {
    (fs.readFileSync as jest.Mock).mockImplementationOnce(() => 'someMd5 fileName');
    (md5file.sync as jest.Mock).mockImplementationOnce(() => 'anotherMd5');
    const du = new MongoBinaryDownload({});
    du.checkMD5 = true;
    du.download = jest.fn(() => Promise.resolve(''));
    expect(du.makeMD5check('', '')).rejects.toMatchInlineSnapshot(
      `[Error: MongoBinaryDownload: md5 check failed]`
    );
  });

  it('false value of checkMD5 attribute disables makeMD5check validation', async () => {
    expect.assertions(1);
    (fs.readFileSync as jest.Mock).mockImplementationOnce(() => 'someMd5 fileName');
    (md5file.sync as jest.Mock).mockImplementationOnce(() => 'anotherMd5');
    const du = new MongoBinaryDownload({});
    du.checkMD5 = false;
    const result = await du.makeMD5check('', '');
    expect(result).toBe(undefined);
  });
});
