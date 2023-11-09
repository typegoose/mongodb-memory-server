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
      await expect(getPort.tryPort(20000)).resolves.toStrictEqual(true);
    });

    it('should return "false" on used port', async () => {
      const testPort = 30000;
      const blockingServer = net.createServer();
      blockingServer.unref();
      blockingServer.listen(testPort);
      await expect(getPort.tryPort(testPort)).resolves.toStrictEqual(false);
    });
  });

  describe('getFreePort', () => {
    beforeEach(() => {
      // reset cache to be more consistent in tests
      getPort.resetPortsCache();
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

    it('port should be predictable', async () => {
      const testPort = 23232;
      await expect(getPort.getFreePort(testPort)).resolves.toStrictEqual(testPort);

      const server = await new Promise<net.Server>((res) => {
        const server = net.createServer();
        server.unref();
        server.listen(testPort, () => res(server));
      });

      const foundPort = await getPort.getFreePort(testPort);
      expect(foundPort).toStrictEqual(testPort + 2); // predictable result

      server.close();
    });
  });
});
