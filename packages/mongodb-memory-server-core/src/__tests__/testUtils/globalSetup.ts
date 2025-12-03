import MongoBinary from '../../util/MongoBinary';
import resolveConfig, { ResolveConfigVariables } from '../../util/resolveConfig';
import { assertion, isNullOrUndefined } from '../../util/utils';

export = async function globalSetup(): Promise<void> {
  const defaultVersion = resolveConfig(ResolveConfigVariables.VERSION);
  assertion(!isNullOrUndefined(defaultVersion), new Error('Default version is not defined'));
  const versions = [
    defaultVersion,
    '4.0.28',
    '4.2.25',
    '4.4.29',
    '5.0.31',
    '6.0.25',
    '7.0.24',
    '8.0.14',
    '8.2.1',
  ];
  // Ensure all required versions are downloaded for tests
  for (const version of versions) {
    await MongoBinary.getPath({ version });
  }
};
