/* eslint @typescript-eslint/no-var-requires: 0 */

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

// no explicit version and not local
require(modulePath).postInstallEnsureBinary();
