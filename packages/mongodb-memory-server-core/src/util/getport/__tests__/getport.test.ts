import { defaultValues } from '../../resolveConfig';
import * as getPort from '../index';
import * as net from 'node:net';

// the following tests may fail on systems with actual ports being used in those ranges (20000 to 40000)

describe('getport', () => {
  describe('validPort', () => {
    it('should return input unmodified if valid', () => {
      expect(getPort.validPort(2000)).toStrictEqual(2000);
    });

    it('should return minimal amount if below', () => {
      expect(getPort.validPort(0)).toStrictEqual(getPort.MIN_PORT);
    });

    it('should return wrap around if over max port', () => {
      expect(getPort.validPort(getPort.MAX_PORT + 10)).toStrictEqual(getPort.MIN_PORT);
    });

    it('should return wrap around if over max port more than MIN', () => {
      expect(getPort.validPort(getPort.MAX_PORT + getPort.MIN_PORT + 10)).toStrictEqual(
        getPort.MIN_PORT + 10
      );
    });
  });

  describe('tryPort', () => {
    it('should return "true" on unused port', async () => {
      await expect(getPort.tryPort(20000)).resolves.toStrictEqual(20000);
    });

    it('should return "-1" on used port', async () => {
      const testPort = 30000;
      const blockingServer = net.createServer();
      blockingServer.unref();
      blockingServer.listen(testPort);
      await expect(getPort.tryPort(testPort)).resolves.toStrictEqual(-1);
    });
  });

  describe('getFreePort', () => {
    const originalResolve = new Map(defaultValues.entries());
    beforeEach(() => {
      // reset cache to be more consistent in tests
      getPort.resetPortsCache();
      defaultValues.clear();

      for (const [key, val] of originalResolve.entries()) {
        defaultValues.set(key, val);
      }
    });

    it('should give a free port from default', async () => {
      await expect(getPort.getFreePort()).resolves.toBeTruthy();
    });

    it('should respect max_tries', async () => {
      const testPort = 40000;
      await expect(getPort.getFreePort(testPort, 0)).resolves.toBeTruthy();
      await expect(getPort.getFreePort(testPort, 0)).rejects.toBeTruthy();
    });

    it('should return start port', async () => {
      const testPort = 23000;
      await expect(getPort.getFreePort(testPort)).resolves.toStrictEqual(testPort);
    });

    it('port should not be predictable (net0listen)', async () => {
      const testPort = 23233;
      await expect(getPort.getFreePort(testPort)).resolves.toStrictEqual(testPort);

      const server = await new Promise<net.Server>((res) => {
        const server = net.createServer();
        server.unref();
        server.listen(testPort, () => res(server));
      });

      const foundPort = await getPort.getFreePort(testPort);
      expect(foundPort).not.toStrictEqual(testPort); // not predictable port, so not testable to be a exact number

      server.close();
    });
  });
});
