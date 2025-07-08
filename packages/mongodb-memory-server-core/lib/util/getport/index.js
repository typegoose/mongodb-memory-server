"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPortsCache = exports.tryPort = exports.validPort = exports.getFreePort = exports.MAX_PORT = exports.MIN_PORT = void 0;
const tslib_1 = require("tslib");
const net = tslib_1.__importStar(require("node:net"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const log = (0, debug_1.default)('MongoMS:GetPort');
/** Linux min port that does not require root permissions */
exports.MIN_PORT = 1024;
/** u16 max number */
exports.MAX_PORT = 65535;
/**
 * Time before {@link PORTS_CACHE} gets cleared
 * 10 seconds
 */
const PORTS_CACHE_CLEAN_TIME = 1000 * 10;
/**
 * Ports cache, so that locked ports are quickly ignored and hoping for less port stealing
 */
const PORTS_CACHE = {
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
async function getFreePort(firstPort, max_tries = MAX_DEFAULT_TRIES) {
    // use "0" as a fallback to use net0listen, which generates a random free port
    firstPort = firstPort || 0;
    // clear ports cache after some time, but not on an interval
    if (PORTS_CACHE.timeSet && Date.now() - PORTS_CACHE.timeSet > PORTS_CACHE_CLEAN_TIME) {
        PORTS_CACHE.ports.clear();
        PORTS_CACHE.timeSet = Date.now();
    }
    else if (!PORTS_CACHE.timeSet) {
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
            // check if triedPort is already in the cache (ie the vm executed another instance's getport before binary startup)
            // and that the triedPort is not a custom port
            const inCacheAndNotSame = PORTS_CACHE.ports.has(triedPort) && nextPort !== triedPort;
            log(`getFreePort: found free port ${triedPort}, in cache and not custom: ${inCacheAndNotSame}`);
            // returned port can be different than the "nextPort" (if net0listen)
            PORTS_CACHE.ports.add(nextPort);
            // ensure that no other instance can get the same port if the vm decides to run the other instance's getport before starting the last one
            if (inCacheAndNotSame) {
                continue;
            }
            // reset the cache time as we now have just added new ports
            PORTS_CACHE.timeSet = Date.now();
            return triedPort;
        }
    }
    throw new Error('Max port tries exceeded');
}
exports.getFreePort = getFreePort;
exports.default = getFreePort;
/**
 * Ensure that input number is within range of {@link MIN_PORT} and {@link MAX_PORT}.
 * If more than {@link MAX_PORT}, wrap around, if less than {@link MIN_PORT} use {@link MIN_PORT}.
 * @param port The Number to check
 * @returns A Valid number in port range
 */
function validPort(port) {
    const mod = port % exports.MAX_PORT;
    return mod < exports.MIN_PORT ? exports.MIN_PORT : mod;
}
exports.validPort = validPort;
/**
 * Try a given port.
 * @param port The port to try
 * @returns the port if successful, "-1" in case of `EADDRINUSE`, all other errors reject
 * @throws The error given if the code is not "EADDRINUSE"
 */
function tryPort(port) {
    return new Promise((res, rej) => {
        const server = net.createServer();
        // some engines dont support ".unref"(net / tcp.unref), like "deno" in the past and now "bun"
        if (typeof server.unref === 'function') {
            server.unref(); // dont keep this server from exiting the application
        }
        server.on('error', (err) => {
            if (err?.code !== 'EADDRINUSE') {
                rej(err);
            }
            res(-1);
        });
        server.listen(port, () => {
            const address = server.address();
            const port = address.port;
            server.close();
            res(port);
        });
    });
}
exports.tryPort = tryPort;
/**
 * Reset the {@link PORTS_CACHE} to its initial state.
 *
 * This function is meant for debugging and testing purposes only.
 */
function resetPortsCache() {
    PORTS_CACHE.timeSet = undefined;
    PORTS_CACHE.ports.clear();
}
exports.resetPortsCache = resetPortsCache;
//# sourceMappingURL=index.js.map