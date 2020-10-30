import camelCase from 'camelcase';
import finder from 'find-package-json';
import debug from 'debug';

const log = debug('MongoMS:ResolveConfig');

const ENV_CONFIG_PREFIX = 'MONGOMS_';
export const defaultValues = new Map<string, string>();

/**
 * Set an Default value for an specific key
 * Mostly only used internally (for the "global-x.x" packages)
 * @param key The Key the default value should be assigned to
 * @param value The Value what the default should be
 */
export function setDefaultValue(key: string, value: string): void {
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
export const reInitializePackageJson = findPackageJson; // TODO: remove this line on next minor version
findPackageJson();

/**
 * Resolve "variableName" with a prefix of "ENV_CONFIG_PREFIX"
 * @param variableName The variable to use
 */
export function resolveConfig(variableName: string): string | undefined {
  return (
    process.env[`${ENV_CONFIG_PREFIX}${variableName}`] ??
    packageJsonConfig?.[camelCase(variableName)] ??
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
if (envToBool(resolveConfig('DEBUG'))) {
  debug.enable('MongoMS:*');
}
