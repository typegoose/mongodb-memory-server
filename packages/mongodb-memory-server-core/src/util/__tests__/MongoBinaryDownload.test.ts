import { createWriteStream, promises as fspromises } from 'fs';
import md5file from 'md5-file';
import { assertIsError } from '../../__tests__/testUtils/test_utils';
import { DryMongoBinary } from '../DryMongoBinary';
import { Md5CheckFailedError } from '../errors';
import { MongoBinaryOpts } from '../MongoBinary';
import MongoBinaryDownload from '../MongoBinaryDownload';
import MongoBinaryDownloadUrl from '../MongoBinaryDownloadUrl';
import { envName, ResolveConfigVariables } from '../resolveConfig';
import * as utils from '../utils';
import * as path from 'path';
import * as yazl from 'yazl';
import { pack } from 'tar-stream';
import { createGzip } from 'zlib';

jest.mock('md5-file');

describe('MongoBinaryDownload', () => {
  afterEach(() => {
    delete process.env[envName(ResolveConfigVariables.MD5_CHECK)];
    jest.restoreAllMocks();
  });

  it('checkMD5 attribute can be set via constructor parameter', () => {
    expect(new MongoBinaryDownload({ checkMD5: true, downloadDir: '/' }).checkMD5).toBe(true);
    expect(new MongoBinaryDownload({ checkMD5: false, downloadDir: '/' }).checkMD5).toBe(false);
  });

  it('"checkMD5" should be disabled when config option is "false" and if config options is "true" it should be enabled', () => {
    process.env[envName(ResolveConfigVariables.MD5_CHECK)] = '0';
    expect(new MongoBinaryDownload({ downloadDir: '/' }).checkMD5).toBe(false);
    process.env[envName(ResolveConfigVariables.MD5_CHECK)] = '1';
    expect(new MongoBinaryDownload({ downloadDir: '/' }).checkMD5).toBe(true);
  });

  it('should use direct download', async () => {
    process.env['yarn_https-proxy'] = '';
    process.env['yarn_proxy'] = '';
    process.env['npm_config_https-proxy'] = '';
    process.env['npm_config_proxy'] = '';
    process.env['https_proxy'] = '';
    process.env['http_proxy'] = '';

    const du = new MongoBinaryDownload({ downloadDir: '/' });
    jest.spyOn(du, 'httpDownload').mockResolvedValue('/tmp/someFile.tgz');
    jest.spyOn(utils, 'pathExists').mockResolvedValue(false);

    await du.download('https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.6.3.tgz');
    expect(du.httpDownload).toHaveBeenCalledTimes(1);
    const callArg1 = (
      (du.httpDownload as jest.Mock).mock.calls[0] as Parameters<
        MongoBinaryDownload['httpDownload']
      >
    )[1];
    expect(callArg1.agent).toBeUndefined();
  });

  it('should skip download if binary tar exists', async () => {
    const du = new MongoBinaryDownload({ downloadDir: '/' });
    jest.spyOn(du, 'httpDownload').mockResolvedValue('/tmp/someFile.tgz');
    jest.spyOn(utils, 'pathExists').mockResolvedValue(true);

    await du.download('https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.6.3.tgz');

    expect(du.httpDownload).not.toHaveBeenCalled();
  });

  it('should pick up proxy from env vars', async () => {
    process.env['yarn_https-proxy'] = 'http://user:pass@proxy:8080';

    const du = new MongoBinaryDownload({ downloadDir: '/' });
    jest.spyOn(du, 'httpDownload').mockResolvedValue('/tmp/someFile.tgz');
    jest.spyOn(utils, 'pathExists').mockResolvedValue(false);

    await du.download('https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.6.3.tgz');
    expect(du.httpDownload).toHaveBeenCalledTimes(1);
    const callArg1 = (
      (du.httpDownload as jest.Mock).mock.calls[0] as Parameters<
        MongoBinaryDownload['httpDownload']
      >
    )[1];
    utils.assertion(
      !utils.isNullOrUndefined(callArg1.agent),
      new Error('Expected "callArg1.agent" to be defined')
    );
    // @ts-expect-error because "proxy" if soft-private
    expect(callArg1.agent.proxy.href).toBe('http://user:pass@proxy:8080/');
  });

  it('should not reject unauthorized when npm strict-ssl config is false', async () => {
    // npm sets false config value as empty string in env vars
    process.env['npm_config_strict_ssl'] = '';

    const du = new MongoBinaryDownload({ downloadDir: '/' });
    jest.spyOn(du, 'httpDownload').mockResolvedValue('/tmp/someFile.tgz');
    jest.spyOn(utils, 'pathExists').mockResolvedValue(false);

    await du.download('https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.6.3.tgz');
    expect(du.httpDownload).toHaveBeenCalledTimes(1);
    const callArg1 = (
      (du.httpDownload as jest.Mock).mock.calls[0] as Parameters<
        MongoBinaryDownload['httpDownload']
      >
    )[1];
    expect(callArg1.rejectUnauthorized).toEqual(false);
  });

  it('should reject unauthorized when npm strict-ssl config is true', async () => {
    // npm sets true config value as string 'true' in env vars
    process.env['npm_config_strict_ssl'] = 'true';

    const du = new MongoBinaryDownload({ downloadDir: '/' });
    jest.spyOn(du, 'httpDownload').mockResolvedValue('/tmp/someFile.tgz');
    jest.spyOn(utils, 'pathExists').mockResolvedValue(false);

    await du.download('https://fastdl.mongodb.org/osx/mongodb-osx-ssl-x86_64-3.6.3.tgz');
    expect(du.httpDownload).toHaveBeenCalledTimes(1);
    const callArg1 = (
      (du.httpDownload as jest.Mock).mock.calls[0] as Parameters<
        MongoBinaryDownload['httpDownload']
      >
    )[1];
    expect(callArg1.rejectUnauthorized).toEqual(true);
  });

  it('makeMD5check returns true if md5 of downloaded mongoDBArchive is the same as in the reference result', async () => {
    const someMd5 = 'md5';
    const mongoDBArchivePath = '/some/path';
    const fileWithReferenceMd5 = '/another/path';

    jest.spyOn(fspromises, 'readFile').mockResolvedValueOnce(`${someMd5} fileName`);
    jest.spyOn(md5file, 'sync').mockImplementationOnce(() => someMd5);
    jest.spyOn(fspromises, 'unlink').mockResolvedValue(void 0);

    const du = new MongoBinaryDownload({ downloadDir: '/', checkMD5: true });
    jest.spyOn(du, 'download').mockResolvedValue(fileWithReferenceMd5);
    const urlToMongoDBArchivePath = 'some-url';
    const res = await du.makeMD5check(urlToMongoDBArchivePath, mongoDBArchivePath);

    expect(res).toBe(true);
    expect(du.download).toBeCalledWith(urlToMongoDBArchivePath);
    expect(fspromises.readFile).toBeCalledWith(fileWithReferenceMd5);
    expect(fspromises.unlink).toBeCalledTimes(1);
    expect(md5file.sync).toBeCalledWith(mongoDBArchivePath);
  });

  it('makeMD5check throws an error if md5 of downloaded mongoDBArchive is NOT the same as in the reference result', async () => {
    jest.spyOn(fspromises, 'readFile').mockResolvedValueOnce(`someMD5 fileName`);
    jest.spyOn(md5file, 'sync').mockImplementationOnce(() => 'anotherMD5');

    const du = new MongoBinaryDownload({ downloadDir: '/', checkMD5: true });
    jest.spyOn(du, 'download').mockResolvedValue('');

    try {
      await du.makeMD5check('', '');
      fail('Expected "makeMD5check" to fail');
    } catch (err) {
      expect(err).toBeInstanceOf(Md5CheckFailedError);
      expect(JSON.stringify(err)).toMatchSnapshot(); // this is to test all the custom values on the error
    }
  });

  it('false value of checkMD5 attribute disables makeMD5check validation', async () => {
    jest.spyOn(fspromises, 'readFile').mockResolvedValueOnce(`someMD5 fileName`);
    jest.spyOn(md5file, 'sync').mockImplementationOnce(() => 'anotherMD5');

    const du = new MongoBinaryDownload({ downloadDir: '/', checkMD5: false });
    const result = await du.makeMD5check('', '');
    expect(result).toEqual(undefined);
  });

  it('should return the correct path to binary name (getPath)', async () => {
    const downloadDir = '/path/to/downloadDir';
    jest.spyOn(DryMongoBinary, 'generateOptions').mockResolvedValue({
      arch: 'x64',
      version: '4.0.25',
      downloadDir: downloadDir,
      systemBinary: '',
      os: {
        os: 'linux',
        dist: 'ubuntu',
        release: '14',
      },
      platform: 'linux',
    });

    const du = new MongoBinaryDownload({ downloadDir });

    // @ts-expect-error because "getPath" is "protected"
    const path = await du.getPath();
    expect(path).toEqual(`${downloadDir}/mongod-x64-ubuntu-4.0.25`);
  });

  it('should print the download progress (printDownloadProgress)', () => {
    const version = '4.0.25';
    process.stdout.isTTY = false;
    jest.spyOn(console, 'log').mockImplementation(() => void 0);
    jest.spyOn(process.stdout, 'write').mockImplementation(() => true);

    const du = new MongoBinaryDownload({
      downloadDir: '/',
      checkMD5: false,
      version,
      platform: 'linux',
    });
    expect(du.dlProgress.current).toBe(0);
    du.dlProgress.length = 5242880;
    du.dlProgress.totalMb = Math.round((du.dlProgress.length / 1048576) * 10) / 10;

    du.printDownloadProgress({ length: 1048576 });
    expect(console.log).toHaveBeenCalledWith(
      `Downloading MongoDB "${version}": 20% (1mb / ${du.dlProgress.totalMb}mb)\r`
    );
    expect(console.log).toBeCalledTimes(1);
    expect(process.stdout.write).not.toHaveBeenCalled();

    du.printDownloadProgress({ length: 10 });
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(process.stdout.write).not.toHaveBeenCalled();
    expect(du.dlProgress.current).toBe(1048576 + 10);

    process.stdout.isTTY = true;
    du.printDownloadProgress({ length: 0 }, true);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(process.stdout.write).toHaveBeenCalledWith(
      // its still "20" and "1" because of rounding
      `Downloading MongoDB "${version}": 20% (1mb / ${du.dlProgress.totalMb}mb)\r`
    );
    expect(process.stdout.write).toHaveBeenCalledTimes(2); // once for clearing the line and once for the actual line
  });

  it('should directly return the path if already exists', async () => {
    const binaryPath = '/path/to/binary';
    jest.spyOn(utils, 'pathExists').mockResolvedValue(true);

    const du = new MongoBinaryDownload({ downloadDir: '/' });
    jest
      .spyOn(du, 'startDownload')
      .mockImplementation(() => fail('Expected this function not to be called'));
    // @ts-expect-error because "getPath" is "protected"
    jest.spyOn(du, 'getPath').mockResolvedValue(binaryPath);

    const returnValue = await du.getMongodPath();
    expect(returnValue).toEqual(binaryPath);
    expect(du.startDownload).not.toHaveBeenCalled();
    expect(
      // @ts-expect-error because "getPath" is "protected"
      du.getPath
    ).toHaveBeenCalledTimes(1);
  });

  it('should return the mongodb archive path (startDownload)', async () => {
    const downloadUrl = 'https://fastdl.mongodb.org/linux/mongod-something-something.tgz';
    const archivePath = '/path/to/archive.tgz';
    jest.spyOn(utils, 'mkdir').mockResolvedValue(void 0);
    jest.spyOn(fspromises, 'access').mockResolvedValue(void 0);
    jest.spyOn(MongoBinaryDownloadUrl.prototype, 'getDownloadUrl').mockResolvedValue(downloadUrl);

    const du = new MongoBinaryDownload({ downloadDir: '/' });
    jest.spyOn(du, 'download').mockResolvedValue(archivePath); // mocking to not actually download a binary
    jest.spyOn(du, 'makeMD5check').mockResolvedValue(true); // mocking because archive path does not exist to be tested

    const returnValue = await du.startDownload();
    expect(returnValue).toEqual(archivePath);
    expect(du.makeMD5check).toHaveBeenCalledWith(`${downloadUrl}.md5`, archivePath);
    expect(du.download).toHaveBeenCalledWith(downloadUrl);
  });

  it('should return the mongodb archive path (startDownload)', async () => {
    const customError = new Error('custom fs error');
    jest.spyOn(utils, 'mkdir').mockResolvedValue(void 0);
    jest.spyOn(fspromises, 'access').mockRejectedValue(customError);
    jest.spyOn(console, 'error').mockImplementation(() => void 0);

    const du = new MongoBinaryDownload({ downloadDir: '/' });

    try {
      await du.startDownload();
      fail('Expected "startDownload" to fail');
    } catch (err) {
      assertIsError(err);
      expect(err.message).toEqual(customError.message);
      expect(console.error).toHaveBeenCalledTimes(1);
    }
  });

  it('should passthrough options to MongoBinaryDownloadUrl', async () => {
    const options: MongoBinaryOpts = {
      arch: 'x64',
      downloadDir: '/path/to/somewhere',
      os: {
        os: 'linux',
        dist: 'custom',
        release: '100.0',
      },
      version: '4.0.0',
    };
    const mbd = new MongoBinaryDownload(options);
    jest.spyOn(DryMongoBinary, 'generateOptions');
    // @ts-expect-error "getPath" is protected
    const path = await mbd.getPath();
    expect(DryMongoBinary.generateOptions).toBeCalledWith(expect.objectContaining(options));
    expect(path).toMatchSnapshot();
  });

  describe('extract()', () => {
    let tmpdir: string;

    beforeEach(async () => {
      tmpdir = await utils.createTmpDir('mongo-mem-test-extract-');
    });
    afterEach(async () => {
      await utils.removeDir(tmpdir);
    });

    it('should extract zip archives', async () => {
      const zipPath = path.join(tmpdir, 'archive.zip');
      const outPath = path.join(tmpdir, 'binary.exe');
      const options: MongoBinaryOpts = {
        arch: 'x64',
        downloadDir: path.join(outPath, 'downloadDir'),
        os: {
          os: 'linux',
          dist: 'custom',
          release: '100.0',
        },
        version: '4.0.0',
      };
      const mbd = new MongoBinaryDownload(options);
      // @ts-expect-error "getPath" is "protected"
      jest.spyOn(mbd, 'getPath').mockResolvedValue(outPath);

      // prepare the archive
      await new Promise((res, rej) => {
        const zipfile = new yazl.ZipFile();
        const writeStream = createWriteStream(zipPath);
        writeStream.once('close', res);
        writeStream.once('error', rej);
        zipfile.outputStream.once('error', rej);
        zipfile.outputStream.pipe(writeStream);

        const rootdir = 'mongodb-platform-arch-platform-version/';

        zipfile.addBuffer(Buffer.from('main exec'), rootdir + 'bin/mongod.exe'); // add the mongod exectueable that will only be extracted
        zipfile.addBuffer(Buffer.from('some dll'), rootdir + 'bin/some.dll'); // add the a random dll, should not be extracted
        zipfile.addBuffer(Buffer.from('random1'), rootdir + 'bin/random1'); // add the a random random file in "bin/" to be sure it is not extracted
        zipfile.addBuffer(Buffer.from('random2'), rootdir + 'random2'); // add the a random random file in "/" to be sure it is not extracted

        zipfile.end();
      });

      // actually test the extraction of the archive
      const binaryFile = await mbd.extract(zipPath);

      expect(binaryFile).toBeTruthy();
      expect(binaryFile.includes('binary.exe')).toBeTruthy();

      const outPathStat = await utils.statPath(outPath);
      expect(outPathStat).toBeTruthy();
      utils.assertion(!utils.isNullOrUndefined(outPathStat)); // checked above, for typescript
      expect(outPathStat.isFile()).toBeTruthy();

      expect((await fspromises.readFile(outPath)).toString()).toMatchSnapshot();
    });

    it('should extract tar.gz archives', async () => {
      const tarPath = path.join(tmpdir, 'archive.tgz');
      const outPath = path.join(tmpdir, 'binary');
      const options: MongoBinaryOpts = {
        arch: 'x64',
        downloadDir: path.join(outPath, 'downloadDir'),
        os: {
          os: 'linux',
          dist: 'custom',
          release: '100.0',
        },
        version: '4.0.0',
      };
      const mbd = new MongoBinaryDownload(options);
      // @ts-expect-error "getPath" is "protected"
      jest.spyOn(mbd, 'getPath').mockResolvedValue(outPath);

      // prepare the archive
      await new Promise((res, rej) => {
        const tarPack = pack();
        const gzipStream = createGzip();
        const writeStream = createWriteStream(tarPath);
        writeStream.once('close', res);
        writeStream.once('error', rej);
        gzipStream.once('error', rej);
        tarPack.once('error', rej);
        tarPack.pipe(gzipStream);
        gzipStream.pipe(writeStream);

        const rootdir = 'mongodb-platform-arch-platform-version/';

        tarPack.entry({ name: rootdir + 'bin/mongod' }, 'main exec'); // add the mongod exectueable that will only be extracted
        tarPack.entry({ name: rootdir + 'bin/random1' }, 'random1'); // add the a random random file in "bin/" to be sure it is not extracted
        tarPack.entry({ name: rootdir + 'random2' }, 'random2'); // add the a random random file in "/" to be sure it is not extracted

        tarPack.finalize();
      });

      // actually test the extraction of the archive
      const binaryFile = await mbd.extract(tarPath);

      expect(binaryFile).toBeTruthy();
      expect(binaryFile.includes('binary')).toBeTruthy();

      const outPathStat = await utils.statPath(outPath);
      expect(outPathStat).toBeTruthy();
      utils.assertion(!utils.isNullOrUndefined(outPathStat)); // checked above, for typescript
      expect(outPathStat.isFile()).toBeTruthy();

      expect((await fspromises.readFile(outPath)).toString()).toMatchSnapshot();
    });
  });
});
