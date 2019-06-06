import camelCase from 'camelcase';
import finder, { Package } from 'find-package-json';

const ENV_CONFIG_PREFIX = 'MONGOMS_';
const defaultValues = new Map<string, string>();

function getPackageJson(): Package | undefined {
  const pjIterator = finder(process.cwd());
  return pjIterator.next().value;
}

export function setDefaultValue(key: string, value: string): void {
  defaultValues.set(key, value);
}

let packageJson: Package | undefined;
export function reInitializePackageJson(): void {
  packageJson = getPackageJson();
}
reInitializePackageJson();

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
