if (!process.env.MONGOMS_DISABLE_POSTINSTALL) {
  process.env.MONGOMS_DISABLE_POSTINSTALL = require('path').resolve(
    require('os').homedir(),
    '.mongodb-binaries'
  );
}
if (!process.env.MONGOMS_VERSION) {
  process.env.MONGOMS_VERSION = '3.6.12'; // don't use `latest` it's nightly build
}

function isModuleExists(name) {
  try {
    return !!require.resolve(name);
  } catch (e) {
    return false;
  }
}

const script = '../mongodb-memory-server/postinstall.js';
if (isModuleExists(script)) {
  require(script);
} else {
  console.error(`Cannot find script: ${script}`);
}
