import camelCase from 'camelcase';
import finder from 'find-package-json';
import debug from 'debug';

const log = debug('MongoMS:ResolveConfig');

export enum ResolveConfigVariables {
  DOWNLOAD_DIR = 'DOWNLOAD_DIR',
  PLATFORM = 'PLATFORM',
  ARCH = 'ARCH',
  VERSION = 'VERSION',
  DEBUG = 'DEBUG',
  DOWNLOAD_MIRROR = 'DOWNLOAD_MIRROR',
  DOWNLOAD_URL = 'DOWNLOAD_URL',
  DISABLE_POSTINSTALL = 'DISABLE_POSTINSTALL',
  SYSTEM_BINARY = 'SYSTEM_BINARY',
  MD5_CHECK = 'MD5_CHECK',
  USE_LINUX_LSB_RELEASE = 'USE_LINUX_LSB_RELEASE',
  USE_LINUX_OS_RELEASE = 'USE_LINUX_OS_RELEASE',
  USE_LINUX_ANY_RELEASE = 'USE_LINUX_ANY_RELEASE',
  SKIP_OS_RELEASE = 'SKIP_OS_RELEASE',
  ARCHIVE_NAME = 'ARCHIVE_NAME',
}

export const ENV_CONFIG_PREFIX = 'MONGOMS_';
export const defaultValues = new Map<ResolveConfigVariables, string>([
  // apply app-default values here
  [ResolveConfigVariables.VERSION, '4.0.20'],
]);

/**
 * Set an Default value for an specific key
 * Mostly only used internally (for the "global-x.x" packages)
 * @param key The Key the default value should be assigned to
 * @param value The Value what the default should be
 */
export function setDefaultValue(key: ResolveConfigVariables, value: string): void {
  defaultValues.set(key, value);
}

let packageJsonConfig: {
  [key: string]: string;
} = {};
/**
 * Find the nearest package.json for the provided directory
 * @param directory Set an custom directory to search the config in (default: process.cwd())
 */
export function findPackageJson(directory?: string): void {
  const finderIterator = finder(directory || process.cwd()).next();
  log(`Using package.json at "${finderIterator.filename}"`);
  packageJsonConfig = finderIterator.value?.config?.mongodbMemoryServer ?? {};
}
findPackageJson();

/**
 * Resolve "variableName" with a prefix of "ENV_CONFIG_PREFIX"
 * @param variableName The variable to use
 */
export function resolveConfig(variableName: ResolveConfigVariables): string | undefined {
  return (
    process.env[`${ENV_CONFIG_PREFIX}${variableName}`] ??
    packageJsonConfig[camelCase(variableName)] ??
    defaultValues.get(variableName)
  );
}

export default resolveConfig;

/**
 * Convert "1, on, yes, true" to true (otherwise false)
 * @param env The String / Environment Variable to check
 */
export function envToBool(env: string = ''): boolean {
  return ['1', 'on', 'yes', 'true'].indexOf(env.toLowerCase()) !== -1;
}

// enable debug if "MONGOMS_DEBUG" is true
if (envToBool(resolveConfig(ResolveConfigVariables.DEBUG))) {
  debug.enable('MongoMS:*');
}
