// this file is used by 'mongodb-memory-server' and 'mongodb-memory-server-global' (and '-global-x.x') as an shared install script
// in this file the types for variables are set *explicitly* to prevent issues on type changes

import { MongoBinary } from './util/MongoBinary';
import { envToBool, reInitializePackageJson, resolveConfig } from './util/resolve-config';

reInitializePackageJson(process.env.INIT_CWD);

const envDisablePostinstall: string | undefined = resolveConfig('DISABLE_POSTINSTALL');

if (!!envToBool(envDisablePostinstall)) {
  console.log(
    'Mongodb-Memory-Server* postinstall skipped because "DISABLE_POSTINSTALL" was set to an truthy value'
  );
  process.exit(0);
}

const envSystemBinary: string | undefined = resolveConfig('SYSTEM_BINARY');

// value is ensured to be either an string (with more than 0 length) or being undefined
if (typeof envSystemBinary === 'string') {
  console.log('Mongodb-Memory-Server* postinstall skipped because "SYSTEM_BINARY" was provided');
  process.exit(0);
}

(async () => {
  console.log('Mongodb-Memory-Server* checking MongoDB binaries');
  const binPath = await MongoBinary.getPath().catch((err) => {
    console.warn('Mongodb-Memory-Server* failed to find an binary:\n', err.message);
    process.exit(0); // Exiting with "0" to not fail the install (because it is an problem that can be solved otherwise)
  });
  console.log(`Mongodb-Memory-Server* found binary: "${binPath}"`);
})();
