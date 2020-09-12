/* eslint @typescript-eslint/no-var-requires: 0 */

function isModuleExists(name) {
  try {
    return !!require.resolve(name);
  } catch (e) {
    return false;
  }
}

if (!isModuleExists('../mongodb-memory-server-core/lib/util/resolve-config')) {
  console.log('Could not resolve postinstall configuration');
  return;
}
const setDefaultValue = require('../mongodb-memory-server-core/lib/util/resolve-config')
  .setDefaultValue;

setDefaultValue(
  'DOWNLOAD_DIR',
  require('path').resolve(require('os').homedir(), '.cache', 'mongodb-binaries')
);

const script = '../mongodb-memory-server/postinstall.js';
if (isModuleExists(script)) {
  require(script);
} else {
  console.error(`Cannot find script: ${script}`);
}
