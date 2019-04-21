import camelCase from 'camelcase';
import finder, { Package } from 'find-package-json';

const ENV_CONFIG_PREFIX = 'MONGOMS_';

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

export default function resolveConfig(variableName: string): string | undefined {
  const packageJson = getPackageJson();
  return (
    process.env[`${ENV_CONFIG_PREFIX}${variableName}`] ||
    (packageJson &&
      packageJson.config &&
      packageJson.config.mongoDbMemoryServer &&
      packageJson.config.mongoDbMemoryServer[camelCase(variableName)])
  );
}
