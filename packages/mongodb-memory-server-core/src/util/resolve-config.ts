import camelCase from 'camelcase';
import finder, { Package } from 'find-package-json';

const ENV_CONFIG_PREFIX = 'MONGOMS_';
const defaultValues = new Map<string, string>();

function getPackageJson(): Package | undefined {
  const pjIterator = finder(__dirname);
  let next = pjIterator.next();
  let packageJson = next.value;
  while (!next.done) {
    packageJson = next.value;
    next = pjIterator.next();
  }
  return packageJson;
}
const packageJson = getPackageJson();

export function setDefaultValue(key: string, value: string): void {
  defaultValues.set(key, value);
}

export default function resolveConfig(variableName: string): string | undefined {
  return (
    process.env[`${ENV_CONFIG_PREFIX}${variableName}`] ||
    (packageJson &&
      packageJson.config &&
      packageJson.config.mongodbMemoryServer &&
      packageJson.config.mongodbMemoryServer[camelCase(variableName)]) ||
    defaultValues.get(variableName)
  );
}
