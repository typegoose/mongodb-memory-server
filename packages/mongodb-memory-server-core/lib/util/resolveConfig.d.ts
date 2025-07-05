/** Enum of all possible config options */
export declare enum ResolveConfigVariables {
    DOWNLOAD_DIR = "DOWNLOAD_DIR",
    PLATFORM = "PLATFORM",
    ARCH = "ARCH",
    VERSION = "VERSION",
    DEBUG = "DEBUG",
    DOWNLOAD_MIRROR = "DOWNLOAD_MIRROR",
    DOWNLOAD_URL = "DOWNLOAD_URL",
    DOWNLOAD_IGNORE_MISSING_HEADER = "DOWNLOAD_IGNORE_MISSING_HEADER",
    PREFER_GLOBAL_PATH = "PREFER_GLOBAL_PATH",
    DISABLE_POSTINSTALL = "DISABLE_POSTINSTALL",
    SYSTEM_BINARY = "SYSTEM_BINARY",
    MD5_CHECK = "MD5_CHECK",
    ARCHIVE_NAME = "ARCHIVE_NAME",
    RUNTIME_DOWNLOAD = "RUNTIME_DOWNLOAD",
    USE_HTTP = "USE_HTTP",
    SYSTEM_BINARY_VERSION_CHECK = "SYSTEM_BINARY_VERSION_CHECK",
    USE_ARCHIVE_NAME_FOR_BINARY_NAME = "USE_ARCHIVE_NAME_FOR_BINARY_NAME",
    MAX_REDIRECTS = "MAX_REDIRECTS",
    DISTRO = "DISTRO"
}
/** The Prefix for Environmental values */
export declare const ENV_CONFIG_PREFIX = "MONGOMS_";
/** This Value exists here, because "defaultValues" can be changed with "setDefaultValue", but this property is constant */
export declare const DEFAULT_VERSION = "7.0.14";
/** Default values for some config options that require explicit setting, it is constant so that the default values cannot be interfered with */
export declare const defaultValues: Map<ResolveConfigVariables, string>;
/** Interface for storing information about the found package.json from `findPackageJson` */
interface PackageJSON {
    /** The Path where the package.json was found (directory, not the file) */
    filePath: string;
    /** The Options that were parsed from the package.json */
    config: Record<string, string>;
}
/**
 * Set an Default value for an specific key
 * Mostly only used internally (for the "global-x.x" packages)
 * @param key The Key the default value should be assigned to
 * @param value The Value what the default should be
 */
export declare function setDefaultValue(key: ResolveConfigVariables, value: string): void;
/**
 * Find the nearest package.json (that has an non-empty config field) for the provided directory
 * @param directory Set an custom directory to search the config in (default: process.cwd())
 * @returns what "packagejson" variable is
 */
export declare function findPackageJson(directory?: string): PackageJSON | undefined;
/**
 * Apply Proccessing to input options (like resolving paths)
 * @param input The input to process
 * @param filepath The FilePath for the input to resolve relative paths to (needs to be a dirname and absolute)
 * @returns always returns a object
 */
export declare function processConfigOption(input: unknown, filepath: string): Record<string, string>;
/**
 * Resolve "variableName" value (process.env | packagejson | default | undefined)
 * @param variableName The variable to search an value for
 */
export declare function resolveConfig(variableName: ResolveConfigVariables): string | undefined;
/**
 * Get the directory path of the `package.json` with config options, if available
 * @returns The directory of the `package.json`, otherwise `undefined`
 */
export declare function packageJsonPath(): string | undefined;
export default resolveConfig;
/**
 * Helper Function to add the prefix for "process.env[]"
 */
export declare function envName(variableName: ResolveConfigVariables): string;
/**
 * Convert "1, on, yes, true" to true (otherwise false)
 * @param env The String / Environment Variable to check
 */
export declare function envToBool(env?: string): boolean;
//# sourceMappingURL=resolveConfig.d.ts.map