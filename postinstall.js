/*
This script is used as postinstall hook.

When you install mongodb-memory-server package
npm or yarn downloads the latest version of mongodb binaries.

It helps to skip timeout setup `jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;`
when first test run hits MongoDB binary downloading to the cache.
*/

function isModuleExists(name) {
  try { return !!require.resolve(name); }
  catch(e) { return false }
}

if (isModuleExists('./lib/util/MongoBinary')) {
  const MongoBinary = require('./lib/util/MongoBinary').default;

  console.log('mongodb-memory-server: checking MongoDB binaries cache...');
  MongoBinary.getPath({
    version: 'latest',
  }).then(binPath => {
    console.log(`mongodb-memory-server: binary path is ${binPath}`);
  });
}
