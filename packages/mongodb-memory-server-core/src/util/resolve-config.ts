import camelCase from 'camelcase';
import finder, { Package } from 'find-package-json';

const ENV_CONFIG_PREFIX = 'MONGOMS_';
const defaultValues = new Map<string, string>();

function getPackageJson(directory: string): Package | undefined {
  const pjIterator = finder(directory);
  return pjIterator.next().value;
}

export function setDefaultValue(key: string, value: string): void {
  defaultValues.set(key, value);
}

let packageJson: Package | undefined;
export function reInitializePackageJson(directory?: string): void {
  packageJson = getPackageJson(directory || process.cwd());
}
reInitializePackageJson();

/**
 * Resolve "variableName" with a prefix of "ENV_CONFIG_PREFIX"
 * @param variableName The variable to use
 */
export default function resolveConfig(variableName: string): string | undefined {
  return (
    process.env[`${ENV_CONFIG_PREFIX}${variableName}`] ??
    packageJson?.config?.mongodbMemoryServer?.[camelCase(variableName)] ??
    defaultValues.get(variableName)
  );
}

/**
 * Convert "1, on, yes, true" to true (otherwise false)
 * @param env The String / Environment Variable to check
 */
export function envToBool(env: string) {
  return ['1', 'on', 'yes', 'true'].indexOf(env.toLowerCase()) !== -1;
}
