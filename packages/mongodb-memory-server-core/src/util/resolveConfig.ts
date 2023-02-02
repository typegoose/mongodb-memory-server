import camelCase from 'camelcase';
import { findSync } from 'new-find-package-json';
import debug from 'debug';
import * as path from 'path';
import { readFileSync } from 'fs';
import { isNullOrUndefined } from './utils';

const log = debug('MongoMS:ResolveConfig');

/** Enum of all possible config options */
export enum ResolveConfigVariables {
  DOWNLOAD_DIR = 'DOWNLOAD_DIR',
  PLATFORM = 'PLATFORM',
  ARCH = 'ARCH',
  VERSION = 'VERSION',
  DEBUG = 'DEBUG',
  DOWNLOAD_MIRROR = 'DOWNLOAD_MIRROR',
  DOWNLOAD_URL = 'DOWNLOAD_URL',
  PREFER_GLOBAL_PATH = 'PREFER_GLOBAL_PATH',
  DISABLE_POSTINSTALL = 'DISABLE_POSTINSTALL',
  SYSTEM_BINARY = 'SYSTEM_BINARY',
  MD5_CHECK = 'MD5_CHECK',
  ARCHIVE_NAME = 'ARCHIVE_NAME',
  RUNTIME_DOWNLOAD = 'RUNTIME_DOWNLOAD',
  USE_HTTP = 'USE_HTTP',
  SYSTEM_BINARY_VERSION_CHECK = 'SYSTEM_BINARY_VERSION_CHECK',
  USE_ARCHIVE_NAME_FOR_BINARY_NAME = 'USE_ARCHIVE_NAME_FOR_BINARY_NAME',
}

/** The Prefix for Environmental values */
export const ENV_CONFIG_PREFIX = 'MONGOMS_';
/** This Value exists here, because "defaultValues" can be changed with "setDefaultValue", but this property is constant */
export const DEFAULT_VERSION = '5.0.13';
/** Default values for some config options that require explicit setting, it is constant so that the default values cannot be interfered with */
export const defaultValues = new Map<ResolveConfigVariables, string>([
  // apply app-default values here
  [ResolveConfigVariables.VERSION, DEFAULT_VERSION],
  [ResolveConfigVariables.PREFER_GLOBAL_PATH, 'true'],
  [ResolveConfigVariables.RUNTIME_DOWNLOAD, 'true'],
  [ResolveConfigVariables.USE_HTTP, 'false'],
  [ResolveConfigVariables.SYSTEM_BINARY_VERSION_CHECK, 'true'],
  [ResolveConfigVariables.USE_ARCHIVE_NAME_FOR_BINARY_NAME, 'false'],
  [ResolveConfigVariables.MD5_CHECK, 'true'],
]);

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
export function setDefaultValue(key: ResolveConfigVariables, value: string): void {
  defaultValues.set(key, value);
}

/** Cache the found package.json file */
let packagejson: PackageJSON | undefined = undefined;
/**
 * Find the nearest package.json (that has an non-empty config field) for the provided directory
 * @param directory Set an custom directory to search the config in (default: process.cwd())
 * @returns what "packagejson" variable is
 */
export function findPackageJson(directory?: string): PackageJSON | undefined {
  for (const filename of findSync(directory || process.cwd())) {
    log(`findPackageJson: Found package.json at "${filename}"`);
    const readout: Record<string, any> = JSON.parse(readFileSync(filename).toString());

    /** Shorthand for the long path */
    const config = readout?.config?.mongodbMemoryServer;

    if (!isNullOrUndefined(config) && Object.keys(config ?? {}).length > 0) {
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

/**
 * Apply Proccessing to input options (like resolving paths)
 * @param input The input to process
 * @param filepath The FilePath for the input to resolve relative paths to (needs to be a dirname and absolute)
 * @returns always returns a object
 */
export function processConfigOption(input: unknown, filepath: string): Record<string, string> {
  log('processConfigOption', input, filepath);

  if (typeof input !== 'object') {
    log('processConfigOptions: input was not a object');

    return {};
  }

  // cast because it was tested before that "input" is a object and the key can only be a string in a package.json
  const returnobj = input as Record<string, string>;

  // These are so that "camelCase" doesnt get executed much & de-duplicate code
  // "cc*" means "camelcase"
  const ccDownloadDir = camelCase(ResolveConfigVariables.DOWNLOAD_DIR);
  const ccSystemBinary = camelCase(ResolveConfigVariables.SYSTEM_BINARY);

  if (ccDownloadDir in returnobj) {
    returnobj[ccDownloadDir] = path.resolve(filepath, returnobj[ccDownloadDir]);
  }

  if (ccSystemBinary in returnobj) {
    returnobj[ccSystemBinary] = path.resolve(filepath, returnobj[ccSystemBinary]);
  }

  return returnobj;
}

/**
 * Resolve "variableName" value (process.env | packagejson | default | undefined)
 * @param variableName The variable to search an value for
 */
export function resolveConfig(variableName: ResolveConfigVariables): string | undefined {
  return (
    process.env[envName(variableName)] ??
    packagejson?.config[camelCase(variableName)] ??
    defaultValues.get(variableName)
  )?.toString();
}

export default resolveConfig;

/**
 * Helper Function to add the prefix for "process.env[]"
 */
export function envName(variableName: ResolveConfigVariables): string {
  return `${ENV_CONFIG_PREFIX}${variableName}`;
}

/**
 * Convert "1, on, yes, true" to true (otherwise false)
 * @param env The String / Environment Variable to check
 */
export function envToBool(env: string = ''): boolean {
  if (typeof env !== 'string') {
    log('envToBool: input was not a string!');

    return false;
  }

  return ['1', 'on', 'yes', 'true'].indexOf(env.toLowerCase()) !== -1;
}

// enable debug if "MONGOMS_DEBUG" is true
if (envToBool(resolveConfig(ResolveConfigVariables.DEBUG))) {
  debug.enable('MongoMS:*');
  log('Debug Mode Enabled, through Environment Variable');
}

// run this after env debug enable to be able to debug this function too
findPackageJson();

// enable debug if "config.mongodbMemoryServer.debug" is true
if (envToBool(resolveConfig(ResolveConfigVariables.DEBUG))) {
  debug.enable('MongoMS:*');
  log('Debug Mode Enabled, through package.json');
}
