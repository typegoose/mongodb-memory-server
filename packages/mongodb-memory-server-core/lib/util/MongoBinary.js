"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoBinary = void 0;
const tslib_1 = require("tslib");
const os_1 = tslib_1.__importDefault(require("os"));
const MongoBinaryDownload_1 = tslib_1.__importDefault(require("./MongoBinaryDownload"));
const resolveConfig_1 = tslib_1.__importStar(require("./resolveConfig"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const semver = tslib_1.__importStar(require("semver"));
const utils_1 = require("./utils");
const child_process_1 = require("child_process");
const lockfile_1 = require("./lockfile");
const DryMongoBinary_1 = require("./DryMongoBinary");
const log = (0, debug_1.default)('MongoMS:MongoBinary');
/**
 * Class used to combine "DryMongoBinary" & "MongoBinaryDownload"
 */
class MongoBinary {
    /**
     * Probe download path and download the binary
     * @param options Options Configuring which binary to download and to which path
     * @returns The BinaryPath the binary has been downloaded to
     */
    static async download(options) {
        log('download');
        const { downloadDir, version } = options;
        // create downloadDir
        await (0, utils_1.mkdir)(downloadDir);
        /** Lockfile path */
        const lockfile = (0, utils_1.lockfilePath)(downloadDir, version);
        log(`download: Waiting to acquire Download lock for file "${lockfile}"`);
        // wait to get a lock
        // downloading of binaries may be quite long procedure
        // that's why we are using so big wait/stale periods
        const lock = await lockfile_1.LockFile.lock(lockfile);
        log('download: Download lock acquired');
        // this is to ensure that the lockfile gets removed in case of an error
        try {
            // check cache if it got already added to the cache
            if (!DryMongoBinary_1.DryMongoBinary.binaryCache.has(version)) {
                log(`download: Adding version ${version} to cache`);
                const downloader = new MongoBinaryDownload_1.default(options);
                DryMongoBinary_1.DryMongoBinary.binaryCache.set(version, await downloader.getMongodPath());
            }
        }
        finally {
            log('download: Removing Download lock');
            // remove lock
            await lock.unlock();
            log('download: Download lock removed');
        }
        const cachePath = DryMongoBinary_1.DryMongoBinary.binaryCache.get(version);
        // ensure that "path" exists, so the return type does not change
        (0, utils_1.assertion)(typeof cachePath === 'string', new Error(`No Cache Path for version "${version}" found (and download failed silently?)`));
        return cachePath;
    }
    /**
     * Probe all supported paths for an binary and return the binary path
     * @param opts Options configuring which binary to search for
     * @throws {Error} if no valid BinaryPath has been found
     * @returns The first found BinaryPath
     */
    static async getPath(opts = {}) {
        log('getPath');
        // "||" is still used here, because it should default if the value is false-y (like an empty string)
        const options = {
            ...(await DryMongoBinary_1.DryMongoBinary.generateOptions(opts)),
            platform: opts.platform || (0, resolveConfig_1.default)(resolveConfig_1.ResolveConfigVariables.PLATFORM) || os_1.default.platform(),
            checkMD5: opts.checkMD5 || (0, resolveConfig_1.envToBool)((0, resolveConfig_1.default)(resolveConfig_1.ResolveConfigVariables.MD5_CHECK)),
        };
        log(`getPath: MongoBinary options:`, JSON.stringify(options, null, 2));
        let binaryPath = await DryMongoBinary_1.DryMongoBinary.locateBinary(options);
        // check if the system binary has the same version as requested
        if (!!options.systemBinary) {
            // this case should actually never be false, because if "SYSTEM_BINARY" is set, "locateBinary" will run "getSystemPath" which tests the path for permissions
            if (!(0, utils_1.isNullOrUndefined)(binaryPath)) {
                // dont warn if the versions dont match if "SYSTEM_BINARY_VERSION_CHECK" is false, but still test the binary if it is available to be executed
                if ((0, resolveConfig_1.envToBool)((0, resolveConfig_1.default)(resolveConfig_1.ResolveConfigVariables.SYSTEM_BINARY_VERSION_CHECK))) {
                    log(`getPath: Spawning binaryPath "${binaryPath}" to get version`);
                    const spawnOutput = (0, child_process_1.spawnSync)(binaryPath, ['--version'])
                        // NOTE: "stdout" seemingly can be "undefined", see https://github.com/typegoose/mongodb-memory-server/issues/742#issuecomment-2528284865
                        .stdout?.toString()
                        // this regex is to match the first line of the "mongod --version" output "db version v4.0.25" OR "db version v4.2.19-11-ge2f2736"
                        .match(/^\s*db\s+version\s+v?(\d+\.\d+\.\d+)(-\d*)?(-[a-zA-Z0-9].*)?\s*$/im);
                    (0, utils_1.assertion)(!(0, utils_1.isNullOrUndefined)(spawnOutput), new Error('Couldnt find an version from system binary output!'));
                    log('getPath: Checking & Warning about version conflicts');
                    const binaryVersion = spawnOutput[1];
                    if (semver.neq(options.version, binaryVersion)) {
                        // we will log the version number of the system binary and the version requested so the user can see the difference
                        console.warn('getPath: MongoMemoryServer: Possible version conflict\n' +
                            `  SystemBinary version: "${binaryVersion}"\n` +
                            `  Requested version:    "${options.version}"\n\n` +
                            '  Using SystemBinary!');
                    }
                }
            }
            else {
                throw new Error('Option "SYSTEM_BINARY" was set, but binaryPath was empty! (system binary could not be found?) [This Error should normally not be thrown, please report this]');
            }
        }
        (0, utils_1.assertion)(typeof options.version === 'string', new Error('"MongoBinary.options.version" is not an string!'));
        if (!binaryPath) {
            if ((0, resolveConfig_1.envToBool)((0, resolveConfig_1.default)(resolveConfig_1.ResolveConfigVariables.RUNTIME_DOWNLOAD))) {
                log('getPath: "RUNTIME_DOWNLOAD" is "true", trying to download');
                binaryPath = await this.download(options);
            }
            else {
                log('getPath: "RUNTIME_DOWNLOAD" is "false", not downloading');
            }
        }
        if (!binaryPath) {
            const runtimeDownload = (0, resolveConfig_1.envToBool)((0, resolveConfig_1.default)(resolveConfig_1.ResolveConfigVariables.RUNTIME_DOWNLOAD));
            throw new Error(`MongoBinary.getPath: could not find an valid binary path! (Got: "${binaryPath}", RUNTIME_DOWNLOAD: "${runtimeDownload}")`);
        }
        log(`getPath: Mongod binary path: "${binaryPath}"`);
        return binaryPath;
    }
}
exports.MongoBinary = MongoBinary;
exports.default = MongoBinary;
//# sourceMappingURL=MongoBinary.js.map