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
const resolveConfig = require('../mongodb-memory-server-core/lib/util/resolve-config').default;

if (!resolveConfig('DOWNLOAD_DIR')) {
  process.env.MONGOMS_DOWNLOAD_DIR = require('path').resolve(
    require('os').homedir(),
    '.cache',
    'mongodb-binaries'
  );
}
if (!resolveConfig('VERSION')) {
  process.env.MONGOMS_VERSION = '3.4.20'; // don't use `latest` it's nightly build
}

const script = '../mongodb-memory-server/postinstall.js';
if (isModuleExists(script)) {
  require(script);
} else {
  console.error(`Cannot find script: ${script}`);
}
