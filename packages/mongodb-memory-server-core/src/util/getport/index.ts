import * as net from 'node:net';
import debug from 'debug';

const log = debug('MongoMS:GetPort');

/** Linux min port that does not require root permissions */
export const MIN_PORT = 1024;
/** u16 max number */
export const MAX_PORT = 65535;

/** Storage for the ports that were already tried */
interface IPortsCache {
  /** The time the set was last used */
  timeSet: undefined | number;
  /** The ports that were tried */
  ports: Set<number>;
}

/**
 * Time before {@link PORTS_CACHE} gets cleared
 * 10 seconds
 */
const PORTS_CACHE_CLEAN_TIME = 1000 * 10;

/**
 * Ports cache, so that locked ports are quickly ignored and hoping for less port stealing
 */
const PORTS_CACHE: IPortsCache = {
  timeSet: undefined,
  ports: new Set(),
};

/** Max default tries before giving up */
const MAX_DEFAULT_TRIES = 10;

/**
 * Try to get a free port.
 * @param firstPort The first port to try or empty for a random port
 * @param max_tries maximum amount of tries to get a port, default to {@link MAX_DEFAULT_TRIES}
 * @returns A valid free port
 * @throws if "max_tries" is exceeded
 */
export async function getFreePort(
  firstPort?: number,
  max_tries: number = MAX_DEFAULT_TRIES
): Promise<number> {
  // use "0" as a fallback to use net0listen, which generates a random free port
  firstPort = firstPort || 0;

  // clear ports cache after some time, but not on an interval
  if (PORTS_CACHE.timeSet && Date.now() - PORTS_CACHE.timeSet > PORTS_CACHE_CLEAN_TIME) {
    PORTS_CACHE.ports.clear();
    PORTS_CACHE.timeSet = Date.now();
  } else if (!PORTS_CACHE.timeSet) {
    PORTS_CACHE.timeSet = Date.now();
  }

  let tries = 0;
  while (tries <= max_tries) {
    tries += 1;

    // "0" means to use have ".listen" use a random port
    const nextPort = tries === 1 ? firstPort : 0;

    // try next port, because it is already in the cache
    // unless port is "0" which will use "net.listen(0)"
    if (PORTS_CACHE.ports.has(nextPort) && nextPort !== 0) {
      continue;
    }

    PORTS_CACHE.ports.add(nextPort);

    const triedPort = await tryPort(nextPort);

    if (triedPort > 0) {
      log('getFreePort: found free port', triedPort);

      // returned port can be different than the "nextPort" (if net0listen)
      PORTS_CACHE.ports.add(nextPort);

      return triedPort;
    }
  }

  throw new Error('Max port tries exceeded');
}

export default getFreePort;

/**
 * Ensure that input number is within range of {@link MIN_PORT} and {@link MAX_PORT}.
 * If more than {@link MAX_PORT}, wrap around, if less than {@link MIN_PORT} use {@link MIN_PORT}.
 * @param port The Number to check
 * @returns A Valid number in port range
 */
export function validPort(port: number): number {
  const mod = port % MAX_PORT;

  return mod < MIN_PORT ? MIN_PORT : mod;
}

/**
 * Try a given port.
 * @param port The port to try
 * @returns the port if successful, "-1" in case of `EADDRINUSE`, all other errors reject
 * @throws The error given if the code is not "EADDRINUSE"
 */
export function tryPort(port: number): Promise<number> {
  return new Promise((res, rej) => {
    const server = net.createServer();

    // some engines dont support ".unref"(net / tcp.unref), like "deno" in the past and now "bun"
    if (typeof server.unref === 'function') {
      server.unref(); // dont keep this server from exiting the application
    }

    server.on('error', (err) => {
      if ((err as any)?.code !== 'EADDRINUSE') {
        rej(err);
      }

      res(-1);
    });
    server.listen(port, () => {
      const address = server.address();
      const port = (address as net.AddressInfo).port;
      server.close();

      res(port);
    });
  });
}

/**
 * Reset the {@link PORTS_CACHE} to its initial state.
 *
 * This function is meant for debugging and testing purposes only.
 */
export function resetPortsCache() {
  PORTS_CACHE.timeSet = undefined;
  PORTS_CACHE.ports.clear();
}
