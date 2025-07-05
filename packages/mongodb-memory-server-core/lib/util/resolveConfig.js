"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envToBool = exports.envName = exports.packageJsonPath = exports.resolveConfig = exports.processConfigOption = exports.findPackageJson = exports.setDefaultValue = exports.defaultValues = exports.DEFAULT_VERSION = exports.ENV_CONFIG_PREFIX = exports.ResolveConfigVariables = void 0;
const tslib_1 = require("tslib");
const camelcase_1 = tslib_1.__importDefault(require("camelcase"));
const new_find_package_json_1 = require("new-find-package-json");
const debug_1 = tslib_1.__importDefault(require("debug"));
const path = tslib_1.__importStar(require("path"));
const fs_1 = require("fs");
const utils_1 = require("./utils");
// polyfills
// @ts-expect-error they are marked "read-only", but are set-able if not implemented by the runtime
Symbol.dispose ??= Symbol('Symbol.dispose');
// @ts-expect-error they are marked "read-only", but are set-able if not implemented by the runtime
Symbol.asyncDispose ??= Symbol('Symbol.asyncDispose');
const log = (0, debug_1.default)('MongoMS:ResolveConfig');
/** Enum of all possible config options */
var ResolveConfigVariables;
(function (ResolveConfigVariables) {
    ResolveConfigVariables["DOWNLOAD_DIR"] = "DOWNLOAD_DIR";
    ResolveConfigVariables["PLATFORM"] = "PLATFORM";
    ResolveConfigVariables["ARCH"] = "ARCH";
    ResolveConfigVariables["VERSION"] = "VERSION";
    ResolveConfigVariables["DEBUG"] = "DEBUG";
    ResolveConfigVariables["DOWNLOAD_MIRROR"] = "DOWNLOAD_MIRROR";
    ResolveConfigVariables["DOWNLOAD_URL"] = "DOWNLOAD_URL";
    ResolveConfigVariables["DOWNLOAD_IGNORE_MISSING_HEADER"] = "DOWNLOAD_IGNORE_MISSING_HEADER";
    ResolveConfigVariables["PREFER_GLOBAL_PATH"] = "PREFER_GLOBAL_PATH";
    ResolveConfigVariables["DISABLE_POSTINSTALL"] = "DISABLE_POSTINSTALL";
    ResolveConfigVariables["SYSTEM_BINARY"] = "SYSTEM_BINARY";
    ResolveConfigVariables["MD5_CHECK"] = "MD5_CHECK";
    ResolveConfigVariables["ARCHIVE_NAME"] = "ARCHIVE_NAME";
    ResolveConfigVariables["RUNTIME_DOWNLOAD"] = "RUNTIME_DOWNLOAD";
    ResolveConfigVariables["USE_HTTP"] = "USE_HTTP";
    ResolveConfigVariables["SYSTEM_BINARY_VERSION_CHECK"] = "SYSTEM_BINARY_VERSION_CHECK";
    ResolveConfigVariables["USE_ARCHIVE_NAME_FOR_BINARY_NAME"] = "USE_ARCHIVE_NAME_FOR_BINARY_NAME";
    ResolveConfigVariables["MAX_REDIRECTS"] = "MAX_REDIRECTS";
    ResolveConfigVariables["DISTRO"] = "DISTRO";
})(ResolveConfigVariables || (exports.ResolveConfigVariables = ResolveConfigVariables = {}));
/** The Prefix for Environmental values */
exports.ENV_CONFIG_PREFIX = 'MONGOMS_';
/** This Value exists here, because "defaultValues" can be changed with "setDefaultValue", but this property is constant */
exports.DEFAULT_VERSION = '7.0.14';
/** Default values for some config options that require explicit setting, it is constant so that the default values cannot be interfered with */
exports.defaultValues = new Map([
    // apply app-default values here
    [ResolveConfigVariables.VERSION, exports.DEFAULT_VERSION],
    [ResolveConfigVariables.PREFER_GLOBAL_PATH, 'true'],
    [ResolveConfigVariables.RUNTIME_DOWNLOAD, 'true'],
    [ResolveConfigVariables.USE_HTTP, 'false'],
    [ResolveConfigVariables.SYSTEM_BINARY_VERSION_CHECK, 'true'],
    [ResolveConfigVariables.USE_ARCHIVE_NAME_FOR_BINARY_NAME, 'false'],
    [ResolveConfigVariables.MD5_CHECK, 'true'],
    [ResolveConfigVariables.MAX_REDIRECTS, '2'],
]);
/**
 * Set an Default value for an specific key
 * Mostly only used internally (for the "global-x.x" packages)
 * @param key The Key the default value should be assigned to
 * @param value The Value what the default should be
 */
function setDefaultValue(key, value) {
    exports.defaultValues.set(key, value);
}
exports.setDefaultValue = setDefaultValue;
/** Cache the found package.json file */
let packagejson = undefined;
/**
 * Find the nearest package.json (that has an non-empty config field) for the provided directory
 * @param directory Set an custom directory to search the config in (default: process.cwd())
 * @returns what "packagejson" variable is
 */
function findPackageJson(directory) {
    for (const filename of (0, new_find_package_json_1.findSync)(directory || process.cwd())) {
        log(`findPackageJson: Found package.json at "${filename}"`);
        const readout = JSON.parse((0, fs_1.readFileSync)(filename).toString());
        /** Shorthand for the long path */
        const config = readout?.config?.mongodbMemoryServer;
        if (!(0, utils_1.isNullOrUndefined)(config) && Object.keys(config ?? {}).length > 0) {
            log(`findPackageJson: Found package with non-empty config field at "${filename}"`);
            const filepath = path.dirname(filename);
            packagejson = {
                filePath: filepath,
                config: processConfigOption(config, filepath),
            };
            break;
        }
    }
    return packagejson;
}
exports.findPackageJson = findPackageJson;
/**
 * Apply Proccessing to input options (like resolving paths)
 * @param input The input to process
 * @param filepath The FilePath for the input to resolve relative paths to (needs to be a dirname and absolute)
 * @returns always returns a object
 */
function processConfigOption(input, filepath) {
    log('processConfigOption', input, filepath);
    if (typeof input !== 'object') {
        log('processConfigOptions: input was not a object');
        return {};
    }
    // cast because it was tested before that "input" is a object and the key can only be a string in a package.json
    const returnobj = input;
    // These are so that "camelCase" doesnt get executed much & de-duplicate code
    // "cc*" means "camelcase"
    const ccDownloadDir = (0, camelcase_1.default)(ResolveConfigVariables.DOWNLOAD_DIR);
    const ccSystemBinary = (0, camelcase_1.default)(ResolveConfigVariables.SYSTEM_BINARY);
    if (ccDownloadDir in returnobj) {
        returnobj[ccDownloadDir] = path.resolve(filepath, returnobj[ccDownloadDir]);
    }
    if (ccSystemBinary in returnobj) {
        returnobj[ccSystemBinary] = path.resolve(filepath, returnobj[ccSystemBinary]);
    }
    return returnobj;
}
exports.processConfigOption = processConfigOption;
/**
 * Resolve "variableName" value (process.env | packagejson | default | undefined)
 * @param variableName The variable to search an value for
 */
function resolveConfig(variableName) {
    return (process.env[envName(variableName)] ??
        packagejson?.config[(0, camelcase_1.default)(variableName)] ??
        exports.defaultValues.get(variableName))?.toString();
}
exports.resolveConfig = resolveConfig;
/**
 * Get the directory path of the `package.json` with config options, if available
 * @returns The directory of the `package.json`, otherwise `undefined`
 */
function packageJsonPath() {
    return packagejson?.filePath;
}
exports.packageJsonPath = packageJsonPath;
exports.default = resolveConfig;
/**
 * Helper Function to add the prefix for "process.env[]"
 */
function envName(variableName) {
    return `${exports.ENV_CONFIG_PREFIX}${variableName}`;
}
exports.envName = envName;
/**
 * Convert "1, on, yes, true" to true (otherwise false)
 * @param env The String / Environment Variable to check
 */
function envToBool(env = '') {
    if (typeof env !== 'string') {
        log('envToBool: input was not a string!');
        return false;
    }
    return ['1', 'on', 'yes', 'true'].indexOf(env.toLowerCase()) !== -1;
}
exports.envToBool = envToBool;
/**
 * This exists because "debug.enabled('MongoMS:*')" will always return "true"
 * This is used to not double-enable / double-print the enablement message
 */
let debug_enabled = false;
// enable debug if "MONGOMS_DEBUG" is true
if (envToBool(resolveConfig(ResolveConfigVariables.DEBUG))) {
    debug_1.default.enable('MongoMS:*');
    log('Debug Mode Enabled, through Environment Variable');
    debug_enabled = true;
}
// run this after env debug enable to be able to debug this function too
findPackageJson();
// enable debug if "config.mongodbMemoryServer.debug" is true
if (envToBool(resolveConfig(ResolveConfigVariables.DEBUG)) && !debug_enabled) {
    debug_1.default.enable('MongoMS:*');
    log('Debug Mode Enabled, through package.json');
    debug_enabled = true;
}
//# sourceMappingURL=resolveConfig.js.map