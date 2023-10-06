import * as http from 'node:http';

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
  /** Store last used number, reduces amount of tries needed */
  lastNumber: number;
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
  lastNumber: MIN_PORT,
};

/** Max default tries before giving up */
const MAX_DEFAULT_TRIES = 10;

/**
 * Try to get a free port
 * @param firstPort The first port to try or empty for semi-random port
 * @param max_tries maximum amount of tries to get a port, default to {@link MAX_DEFAULT_TRIES}
 * @returns A valid free port
 * @throws if "max_tries" is exceeded
 */
export async function getFreePort(
  firstPort?: number,
  max_tries: number = MAX_DEFAULT_TRIES
): Promise<number> {
  // use "Date" as a semi-random value to lessen conflicts between simultaneous tests
  firstPort = firstPort || validPort(Date.now());

  // clear ports cache after some time, but not on a interval
  if (PORTS_CACHE.timeSet && Date.now() - PORTS_CACHE.timeSet > PORTS_CACHE_CLEAN_TIME) {
    PORTS_CACHE.ports.clear();
    PORTS_CACHE.timeSet = Date.now();
  } else if (!PORTS_CACHE.timeSet) {
    PORTS_CACHE.timeSet = Date.now();
  }

  let tries = 0;
  while (tries <= max_tries) {
    tries += 1;

    // use "startPort" at first try, otherwise increase from last number
    const nextPort = tries === 1 ? firstPort : validPort(PORTS_CACHE.lastNumber + tries);

    // try next port, because it is already in the cache
    if (PORTS_CACHE.ports.has(nextPort)) {
      continue;
    }

    PORTS_CACHE.ports.add(nextPort);
    // only set "lastNumber" if the "nextPort" was not in the cache
    PORTS_CACHE.lastNumber = nextPort;

    if (await tryPort(nextPort)) {
      return nextPort;
    }
  }

  throw new Error('Max port tries exceeded');
}

export default getFreePort;

/**
 * Check that input number is within range of {@link MIN_PORT} and {@link MAX_PORT}
 * If more than {@link MAX_PORT}, wrap around, if less than {@link MIN_PORT} use {@link MIN_PORT}
 * @param port The Number to check
 * @returns A Valid number in port range
 */
export function validPort(port: number): number {
  const mod = port % MAX_PORT;

  return mod < MIN_PORT ? MIN_PORT : mod;
}

/**
 * Try a given port
 * @param port The port to try
 * @returns "true" if the port is not in use, "false" if in use
 * @throws The error given if the code is not "EADDRINUSE"
 */
export function tryPort(port: number): Promise<boolean> {
  return new Promise((res, rej) => {
    const server = http.createServer();

    // some engines dont support ".unref"(net / tcp.unref), like "deno" in the past and now "bun"
    if (typeof server.unref === 'function') {
      server.unref(); // dont keep this server from exiting the application
    }

    server.on('error', (err) => {
      if ((err as any)?.code !== 'EADDRINUSE') {
        rej(err);
      }

      res(false);
    });
    server.listen(port, () => {
      server.close();

      res(true);
    });
  });
}

/**
 * Reset the {@link PORTS_CACHE} to its initial state
 *
 * This function is meant for debugging and testing purposes only
 */
export function resetPortsCache() {
  PORTS_CACHE.lastNumber = MIN_PORT;
  PORTS_CACHE.timeSet = undefined;
  PORTS_CACHE.ports.clear();
}
