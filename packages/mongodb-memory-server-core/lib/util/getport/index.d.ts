/** Linux min port that does not require root permissions */
export declare const MIN_PORT = 1024;
/** u16 max number */
export declare const MAX_PORT = 65535;
/**
 * Try to get a free port.
 * @param firstPort The first port to try or empty for a random port
 * @param max_tries maximum amount of tries to get a port, default to {@link MAX_DEFAULT_TRIES}
 * @returns A valid free port
 * @throws if "max_tries" is exceeded
 */
export declare function getFreePort(firstPort?: number, max_tries?: number): Promise<number>;
export default getFreePort;
/**
 * Ensure that input number is within range of {@link MIN_PORT} and {@link MAX_PORT}.
 * If more than {@link MAX_PORT}, wrap around, if less than {@link MIN_PORT} use {@link MIN_PORT}.
 * @param port The Number to check
 * @returns A Valid number in port range
 */
export declare function validPort(port: number): number;
/**
 * Try a given port.
 * @param port The port to try
 * @returns the port if successful, "-1" in case of `EADDRINUSE`, all other errors reject
 * @throws The error given if the code is not "EADDRINUSE"
 */
export declare function tryPort(port: number): Promise<number>;
/**
 * Reset the {@link PORTS_CACHE} to its initial state.
 *
 * This function is meant for debugging and testing purposes only.
 */
export declare function resetPortsCache(): void;
//# sourceMappingURL=index.d.ts.map