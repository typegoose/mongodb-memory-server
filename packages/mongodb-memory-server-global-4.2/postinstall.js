/* eslint @typescript-eslint/no-var-requires: 0 */

function doesModuleExist(name) {
  try {
    return !!require.resolve(name);
  } catch (e) {
    return false;
  }
}

const resolveConfigPath = '../mongodb-memory-server-core/lib/util/resolve-config';

if (!doesModuleExist(resolveConfigPath)) {
  console.log('Could not find file "resolve-config" in core package!');
  return;
}

const setDefaultValue = require(resolveConfigPath).setDefaultValue;

setDefaultValue(
  'DOWNLOAD_DIR',
  require('path').resolve(require('os').homedir(), '.cache', 'mongodb-binaries')
);

var version = require('./package.json').mongodb_version;
setDefaultValue('VERSION', version);

const modulePath = '../mongodb-memory-server-core/lib/postinstall';

if (!doesModuleExist(modulePath)) {
  console.log('Could not find file "postinstall" in core package!');
  return;
}

require(modulePath);
