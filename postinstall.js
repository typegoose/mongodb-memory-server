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

const skipDownload = (typeof process.env.MONGOMS_DISABLE_POSTINSTALL === 'string') &&
  (['1', 'on', 'yes', 'true'].indexOf(process.env.MONGOMS_DISABLE_POSTINSTALL.toLowerCase()) !== -1)

if (skipDownload) {
  console.log("Download is skipped by MONGOMS_DISABLE_POSTINSTALL variable");
  process.exit(0);
}

if (isModuleExists('./lib/util/MongoBinary')) {
  const MongoBinary = require('./lib/util/MongoBinary').default;

  console.log('mongodb-memory-server: checking MongoDB binaries cache...');
  MongoBinary.getPath({}).then(binPath => {
    console.log(`mongodb-memory-server: binary path is ${binPath}`);
  })
  .catch((err) => {
    console.log(`failed to download/install MongoDB binaries. The error:
${err}`)
    process.exit(1)
  });
} else {
  console.log("Can't resolve MongoBinary module");
}
