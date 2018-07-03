/* @flow */

import MongoBinaryDownload from '../MongoBinaryDownload';

describe('MongoBinaryDownload', () => {
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
});
