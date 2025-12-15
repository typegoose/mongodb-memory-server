/*
This script is used as postinstall hook.

When you install mongodb-memory-server package
npm or yarn downloads the latest version of mongodb binaries.

It helps to skip timeout setup `jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;`
when first test run hits MongoDB binary downloading to the cache.
*/

function doesModuleExist(name) {
  try {
    return !!require.resolve(name);
  } catch (e) {
    return false;
  }
}

const modulePath = 'mongodb-memory-server-core/lib/util/postinstallHelper';

if (!doesModuleExist(modulePath)) {
  console.log('Could not find file "postinstall" in core package!');

  return;
}

// no explicit version, but "local"
require(modulePath).postInstallEnsureBinary(undefined, true);
