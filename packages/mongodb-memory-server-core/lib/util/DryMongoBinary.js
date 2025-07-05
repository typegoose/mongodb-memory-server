"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DryMongoBinary = void 0;
const tslib_1 = require("tslib");
const debug_1 = tslib_1.__importDefault(require("debug"));
const resolveConfig_1 = require("./resolveConfig");
const utils_1 = require("./utils");
const path = tslib_1.__importStar(require("path"));
const os_1 = require("os");
const find_cache_dir_1 = tslib_1.__importDefault(require("find-cache-dir"));
const getos_1 = require("./getos");
const errors_1 = require("./errors");
const MongoBinaryDownloadUrl_1 = require("./MongoBinaryDownloadUrl");
const log = (0, debug_1.default)('MongoMS:DryMongoBinary');
/**
 * Locate an Binary, without downloading / locking
 */
class DryMongoBinary {
    /**
     * Try to locate an existing binary
     * @returns The Path to an Binary Found, or undefined
     */
    static async locateBinary(opts) {
        log(`locateBinary: Trying to locate Binary for version "${opts.version}"`);
        const useOpts = await this.generateOptions(opts);
        if (!!useOpts.systemBinary) {
            log(`locateBinary: env "SYSTEM_BINARY" was provided with value: "${useOpts.systemBinary}"`);
            const systemReturn = await this.getSystemPath(path.resolve(useOpts.systemBinary));
            if ((0, utils_1.isNullOrUndefined)(systemReturn)) {
                throw new errors_1.BinaryNotFoundError(useOpts.systemBinary, ' (systemBinary)');
            }
            return systemReturn;
        }
        if (this.binaryCache.has(opts.version)) {
            const binary = this.binaryCache.get(opts.version);
            log(`locateBinary: Requested Version found in cache: "[${opts.version}, ${binary}]"`);
            return binary;
        }
        log('locateBinary: running generateDownloadPath');
        const returnValue = await this.generateDownloadPath(useOpts);
        if (!returnValue[0]) {
            log('locateBinary: could not find a existing binary');
            return undefined;
        }
        // check for the race-condition of "extraction started, but not finished"
        // or said differently, the file "exists" but is not fully extracted yet
        // see https://github.com/typegoose/mongodb-memory-server/issues/872
        if (returnValue[0] &&
            (await (0, utils_1.pathExists)((0, utils_1.lockfilePath)(path.dirname(returnValue[1]), useOpts.version)))) {
            log('locateBinary: binary found, but also a download-lock, trying to resolve lock');
            return undefined;
        }
        log(`locateBinary: found binary at "${returnValue[1]}"`);
        this.binaryCache.set(opts.version, returnValue[1]);
        return returnValue[1];
    }
    /**
     * Ensure the given options fulfill {@link DryMongoBinaryOptions} by defaulting them
     * @param opts The options to ensure
     * @returns The ensured options
     */
    static getEnsuredOptions(opts) {
        const defaultVersion = (0, resolveConfig_1.resolveConfig)(resolveConfig_1.ResolveConfigVariables.VERSION) ?? resolveConfig_1.DEFAULT_VERSION;
        return (0, utils_1.isNullOrUndefined)(opts)
            ? { version: defaultVersion }
            : { ...opts, version: opts.version || defaultVersion };
    }
    /**
     * Generate All required options for the binary name / path generation
     */
    static async generateOptions(opts) {
        log('generateOptions');
        const ensuredOpts = DryMongoBinary.getEnsuredOptions(opts);
        const final = {
            version: ensuredOpts.version,
            downloadDir: (0, resolveConfig_1.resolveConfig)(resolveConfig_1.ResolveConfigVariables.DOWNLOAD_DIR) || ensuredOpts.downloadDir || '',
            os: ensuredOpts.os ?? (await (0, getos_1.getOS)()),
            platform: ensuredOpts.platform || (0, os_1.platform)(),
            arch: ensuredOpts.arch || (0, os_1.arch)(),
            systemBinary: (0, resolveConfig_1.resolveConfig)(resolveConfig_1.ResolveConfigVariables.SYSTEM_BINARY) || ensuredOpts.systemBinary || '',
        };
        final.downloadDir = path.dirname((await this.generateDownloadPath(final))[1]);
        // if truthy
        if ((0, resolveConfig_1.resolveConfig)(resolveConfig_1.ResolveConfigVariables.ARCHIVE_NAME) ||
            (0, resolveConfig_1.resolveConfig)(resolveConfig_1.ResolveConfigVariables.DOWNLOAD_URL)) {
            // "DOWNLOAD_URL" will be used over "ARCHIVE_NAME"
            // the "as string" cast is there because it is already checked that one of the 2 exists, and "resolveConfig" ensures it only returns strings
            const input = ((0, resolveConfig_1.resolveConfig)(resolveConfig_1.ResolveConfigVariables.DOWNLOAD_URL) ||
                (0, resolveConfig_1.resolveConfig)(resolveConfig_1.ResolveConfigVariables.ARCHIVE_NAME));
            log(`generateOptions: ARCHIVE_NAME or DOWNLOAD_URL defined, generating options based on that (input: "${input}")`);
            return this.parseArchiveNameRegex(input, final);
        }
        return final;
    }
    /**
     * Parse "input" into DryMongoBinaryOptions
     * @param input The Input to be parsed with the regex
     * @param opts The Options which will be augmented with "input"
     * @returns The Augmented options
     */
    static parseArchiveNameRegex(input, opts) {
        log(`parseArchiveNameRegex (input: "${input}")`);
        const archiveMatches = /mongodb-(?<platform>linux|win32|osx|macos)(?:-ssl-|-)(?<arch>\w{4,})(?:-(?<dist>\w+)|)(?:-ssl-|-)(?:v|)(?<version>[\d.]+(?:-latest|))\./gim.exec(input);
        (0, utils_1.assertion)(!(0, utils_1.isNullOrUndefined)(archiveMatches), new errors_1.NoRegexMatchError('input'));
        // this error is kinda impossible to test, because the regex we use either has matches that are groups or no matches
        (0, utils_1.assertion)(!(0, utils_1.isNullOrUndefined)(archiveMatches.groups), new errors_1.NoRegexMatchError('input', 'groups'));
        const groups = archiveMatches.groups;
        (0, utils_1.assertion)(typeof groups.version === 'string' && groups.version.length > 1, new errors_1.ParseArchiveRegexError('version'));
        // the following 2 assertions are hard to test, because the regex has restrictions that are more strict than the assertions
        (0, utils_1.assertion)(typeof groups.platform === 'string' && groups.platform.length > 1, new errors_1.ParseArchiveRegexError('platform'));
        (0, utils_1.assertion)(typeof groups.arch === 'string' && groups.arch.length >= 4, new errors_1.ParseArchiveRegexError('arch'));
        opts.version = groups.version;
        opts.arch = groups.arch;
        if (groups.platform === 'linux') {
            const distMatches = !!groups.dist ? /([a-z]+)(\d*)/gim.exec(groups.dist) : null;
            opts.os = {
                os: 'linux',
                dist: typeof distMatches?.[1] === 'string' ? distMatches[1] : 'unknown',
                // "release" should be able to be discarded in this case
                release: '',
            };
        }
        else {
            opts.os = { os: groups.platform };
        }
        return opts;
    }
    /**
     * Get the full path with filename
     * @returns Absoulte Path with FileName
     */
    static async getBinaryName(opts) {
        log('getBinaryName');
        let binaryName;
        if ((0, resolveConfig_1.envToBool)((0, resolveConfig_1.resolveConfig)(resolveConfig_1.ResolveConfigVariables.USE_ARCHIVE_NAME_FOR_BINARY_NAME))) {
            const archiveName = await new MongoBinaryDownloadUrl_1.MongoBinaryDownloadUrl(opts).getArchiveName();
            binaryName = path.parse(archiveName).name;
        }
        else {
            const addExe = opts.platform === 'win32' ? '.exe' : '';
            const dist = (0, getos_1.isLinuxOS)(opts.os) ? opts.os.dist : opts.os.os;
            binaryName = `mongod-${opts.arch}-${dist}-${opts.version}${addExe}`;
        }
        return binaryName;
    }
    /**
     * Combine basePath with binaryName
     */
    static combineBinaryName(basePath, binaryName) {
        log('combineBinaryName');
        return path.resolve(basePath, binaryName);
    }
    /**
     * Probe if the provided "systemBinary" is an existing path
     * @param systemBinary The Path to probe for an System-Binary
     * @returns System Binary path or undefined
     */
    static async getSystemPath(systemBinary) {
        log('getSystempath');
        try {
            await (0, utils_1.checkBinaryPermissions)(systemBinary);
            log(`getSystemPath: found system binary path at "${systemBinary}"`);
            return systemBinary; // returns if "access" is successful
        }
        catch (err) {
            log(`getSystemPath: can't find system binary at "${systemBinary}".\n${err instanceof Error ? err.message : err}`);
        }
        return undefined;
    }
    /**
     * Generate an "MongoBinaryPaths" object
     *
     * This Function should not hit the FileSystem
     * @returns an finished "MongoBinaryPaths" object
     */
    static async generatePaths(opts) {
        log('generatePaths', opts);
        const final = {
            homeCache: '',
            modulesCache: '',
            relative: '',
            resolveConfig: '',
        };
        const binaryName = await this.getBinaryName(opts);
        // Assign "node_modules/.cache" to modulesCache
        // if we're in postinstall script, npm will set the cwd too deep
        // when in postinstall, npm will provide an "INIT_CWD" env variable
        let nodeModulesDLDir = process.env['INIT_CWD'] || process.cwd();
        // as long as "node_modules/mongodb-memory-server*" is included in the path, go the paths up
        while (nodeModulesDLDir.includes(`node_modules${path.sep}mongodb-memory-server`)) {
            nodeModulesDLDir = path.resolve(nodeModulesDLDir, '..', '..');
        }
        const configPackagePath = (0, resolveConfig_1.packageJsonPath)();
        // use the same "node_modules/.cache" as the package.json that was found for config options, if available
        if (configPackagePath && (await (0, utils_1.pathExists)(path.resolve(configPackagePath, 'node_modules')))) {
            nodeModulesDLDir = configPackagePath;
        }
        const tmpModulesCache = (0, find_cache_dir_1.default)({
            name: 'mongodb-memory-server',
            cwd: nodeModulesDLDir,
        });
        if (!(0, utils_1.isNullOrUndefined)(tmpModulesCache)) {
            final.modulesCache = this.combineBinaryName(path.resolve(tmpModulesCache), binaryName);
        }
        const homeCache = path.resolve(this.homedir(), '.cache/mongodb-binaries');
        final.homeCache = this.combineBinaryName(homeCache, binaryName);
        // Resolve the config value "DOWNLOAD_DIR" if provided, otherwise remove from list
        const resolveConfigValue = opts.downloadDir || (0, resolveConfig_1.resolveConfig)(resolveConfig_1.ResolveConfigVariables.DOWNLOAD_DIR);
        if (!(0, utils_1.isNullOrUndefined)(resolveConfigValue) && resolveConfigValue.length > 0) {
            log(`generatePaths: resolveConfigValue is not empty`);
            final.resolveConfig = this.combineBinaryName(resolveConfigValue, binaryName);
        }
        // Resolve relative to cwd if no other has been found
        final.relative = this.combineBinaryName(path.resolve(process.cwd(), 'mongodb-binaries'), binaryName);
        return final;
    }
    /**
     * Generate the Path where an Binary will be located
     * @returns "boolean" indicating if the binary exists at the provided path, and "string" the path to use for the binary
     */
    static async generateDownloadPath(opts) {
        const preferGlobal = (0, resolveConfig_1.envToBool)((0, resolveConfig_1.resolveConfig)(resolveConfig_1.ResolveConfigVariables.PREFER_GLOBAL_PATH));
        log(`generateDownloadPath: Generating Download Path, preferGlobal: "${preferGlobal}"`);
        const paths = await this.generatePaths(opts);
        log('generateDownloadPath: Paths:', paths, opts.systemBinary);
        // SystemBinary will only be returned if defined and paths exists
        if (!!opts.systemBinary && (await (0, utils_1.pathExists)(opts.systemBinary))) {
            const sysPath = await this.getSystemPath(opts.systemBinary);
            if (!(0, utils_1.isNullOrUndefined)(sysPath)) {
                return [true, sysPath];
            }
        }
        // Section where paths are probed for an existing binary
        if (await (0, utils_1.pathExists)(paths.resolveConfig)) {
            log(`generateDownloadPath: Found binary in resolveConfig (DOWNLOAD_DIR): "${paths.resolveConfig}"`);
            return [true, paths.resolveConfig];
        }
        if (await (0, utils_1.pathExists)(paths.homeCache)) {
            log(`generateDownloadPath: Found binary in homeCache: "${paths.homeCache}"`);
            return [true, paths.homeCache];
        }
        if (await (0, utils_1.pathExists)(paths.modulesCache)) {
            log(`generateDownloadPath: Found binary in modulesCache: "${paths.modulesCache}"`);
            return [true, paths.modulesCache];
        }
        if (await (0, utils_1.pathExists)(paths.relative)) {
            log(`generateDownloadPath: Found binary in relative: "${paths.relative}"`);
            return [true, paths.relative];
        }
        // Section where binary path gets generated when no binary was found
        log(`generateDownloadPath: no existing binary for version "${opts.version}" was found`);
        if (paths.resolveConfig.length > 0) {
            log(`generateDownloadPath: using resolveConfig (DOWNLOAD_DIR) "${paths.resolveConfig}"`);
            return [false, paths.resolveConfig];
        }
        if (preferGlobal && !!paths.homeCache) {
            log(`generateDownloadPath: using global (preferGlobal) "${paths.homeCache}"`);
            return [false, paths.homeCache];
        }
        // this case may not happen, if somehow the cwd gets changed outside of "node_modules" reach
        if (paths.modulesCache.length > 0) {
            log(`generateDownloadPath: using modulesCache "${paths.modulesCache}"`);
            return [false, paths.modulesCache];
        }
        log(`generateDownloadPath: using relative "${paths.relative}"`);
        return [false, paths.relative];
    }
    /**
     * This function is used, because jest just dosnt want "os.homedir" to be mocked
     * if someone can find an way to actually mock this in an test, please change it
     */
    static homedir() {
        return (0, os_1.homedir)();
    }
}
exports.DryMongoBinary = DryMongoBinary;
/**
 * Binaries already found, values are: [Version, Path]
 */
DryMongoBinary.binaryCache = new Map();
//# sourceMappingURL=DryMongoBinary.js.map