import { AnyOS } from './getos';
/** Interface for general options required to pass-around (all optional) */
export interface BaseDryMongoBinaryOptions {
    version?: string;
    downloadDir?: string;
    os?: AnyOS;
    arch?: string;
    platform?: string;
    systemBinary?: string;
}
/** Interface for general options required to pass-aroung (version not optional) */
export interface DryMongoBinaryOptions extends BaseDryMongoBinaryOptions {
    version: NonNullable<BaseDryMongoBinaryOptions['version']>;
}
/** Interface for the options arguments in function "DryMongoBinary.getBinaryName" */
export interface DryMongoBinaryNameOptions {
    version: NonNullable<DryMongoBinaryOptions['version']>;
    arch: NonNullable<DryMongoBinaryOptions['arch']>;
    platform: NonNullable<DryMongoBinaryOptions['version']>;
    os: NonNullable<DryMongoBinaryOptions['os']>;
}
/** Interface to store all generated Paths that would be possible a binary would be in */
export interface DryMongoBinaryPaths {
    /** Path from `DOWNLOAD_DIR` config option */
    resolveConfig: string;
    /** Path for "~/.config/" (user home) */
    homeCache: string;
    /** Path for "PROJECT/node_modules/.cache/" (project local cache) */
    modulesCache: string;
    /** Path for relative to CWD "CWD/" (relative CWD path) */
    relative: string;
}
/**
 * Interface for "DryMongoBinary.parseArchiveNameRegex"'s regex groups
 */
export interface DryMongoBinaryArchiveRegexGroups {
    platform?: string;
    arch?: string;
    dist?: string;
    version?: string;
}
/**
 * Locate an Binary, without downloading / locking
 */
export declare class DryMongoBinary {
    /**
     * Binaries already found, values are: [Version, Path]
     */
    static binaryCache: Map<string, string>;
    /**
     * Try to locate an existing binary
     * @returns The Path to an Binary Found, or undefined
     */
    static locateBinary(opts: DryMongoBinaryOptions): Promise<string | undefined>;
    /**
     * Ensure the given options fulfill {@link DryMongoBinaryOptions} by defaulting them
     * @param opts The options to ensure
     * @returns The ensured options
     */
    static getEnsuredOptions(opts?: BaseDryMongoBinaryOptions): DryMongoBinaryOptions;
    /**
     * Generate All required options for the binary name / path generation
     */
    static generateOptions(opts?: BaseDryMongoBinaryOptions): Promise<Required<DryMongoBinaryOptions>>;
    /**
     * Parse "input" into DryMongoBinaryOptions
     * @param input The Input to be parsed with the regex
     * @param opts The Options which will be augmented with "input"
     * @returns The Augmented options
     */
    static parseArchiveNameRegex(input: string, opts: Required<DryMongoBinaryOptions>): Required<DryMongoBinaryOptions>;
    /**
     * Get the full path with filename
     * @returns Absoulte Path with FileName
     */
    static getBinaryName(opts: DryMongoBinaryNameOptions): Promise<string>;
    /**
     * Combine basePath with binaryName
     */
    static combineBinaryName(basePath: string, binaryName: string): string;
    /**
     * Probe if the provided "systemBinary" is an existing path
     * @param systemBinary The Path to probe for an System-Binary
     * @returns System Binary path or undefined
     */
    static getSystemPath(systemBinary: string): Promise<string | undefined>;
    /**
     * Generate an "MongoBinaryPaths" object
     *
     * This Function should not hit the FileSystem
     * @returns an finished "MongoBinaryPaths" object
     */
    static generatePaths(opts: DryMongoBinaryOptions & DryMongoBinaryNameOptions): Promise<DryMongoBinaryPaths>;
    /**
     * Generate the Path where an Binary will be located
     * @returns "boolean" indicating if the binary exists at the provided path, and "string" the path to use for the binary
     */
    static generateDownloadPath(opts: DryMongoBinaryOptions & DryMongoBinaryNameOptions): Promise<[boolean, string]>;
    /**
     * This function is used, because jest just dosnt want "os.homedir" to be mocked
     * if someone can find an way to actually mock this in an test, please change it
     */
    private static homedir;
}
//# sourceMappingURL=DryMongoBinary.d.ts.map