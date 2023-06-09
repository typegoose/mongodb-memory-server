import MongoBinary from '../../util/MongoBinary';
import resolveConfig, { ResolveConfigVariables } from '../../util/resolveConfig';
import { assertion, isNullOrUndefined } from '../../util/utils';

export = async function globalSetup(): Promise<void> {
  const defaultVersion = resolveConfig(ResolveConfigVariables.VERSION);
  assertion(!isNullOrUndefined(defaultVersion), new Error('Default version is not defined'));
  const versions = [defaultVersion, '4.0.28', '4.2.18', '4.4.13', '5.0.18', '6.0.0'];
  // Ensure all required versions are downloaded for tests
  for (const version of versions) {
    await MongoBinary.getPath({ version });
  }
};
