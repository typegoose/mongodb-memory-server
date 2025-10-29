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
    '4.4.28',
    '5.0.19',
    '6.0.14',
    '7.0.14',
    '8.0.1',
  ];
  // Ensure all required versions are downloaded for tests
  for (const version of versions) {
    await MongoBinary.getPath({ version });
  }
};
