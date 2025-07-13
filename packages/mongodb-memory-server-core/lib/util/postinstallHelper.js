"use strict";
// this file is used by 'mongodb-memory-server' and 'mongodb-memory-server-global' (and '-global-x.x') as an shared install script
// in this file the types for variables are set *explicitly* to prevent issues on type changes
Object.defineProperty(exports, "__esModule", { value: true });
exports.postInstallEnsureBinary = void 0;
const os_1 = require("os");
const path_1 = require("path");
const MongoBinary_1 = require("./MongoBinary");
const resolveConfig_1 = require("./resolveConfig");
(0, resolveConfig_1.findPackageJson)(process.env.INIT_CWD);
if (!!(0, resolveConfig_1.envToBool)((0, resolveConfig_1.resolveConfig)(resolveConfig_1.ResolveConfigVariables.DISABLE_POSTINSTALL))) {
    console.log('Mongodb-Memory-Server* postinstall skipped because "DISABLE_POSTINSTALL" was set to an truthy value');
    process.exit(0);
}
// value is ensured to be either an string (with more than 0 length) or being undefined
if (typeof (0, resolveConfig_1.resolveConfig)(resolveConfig_1.ResolveConfigVariables.SYSTEM_BINARY) === 'string') {
    console.log('Mongodb-Memory-Server* postinstall skipped because "SYSTEM_BINARY" was provided');
    process.exit(0);
}
async function postInstallEnsureBinary(version, local) {
    console.log('Mongodb-Memory-Server* checking MongoDB binaries');
    if (!local) {
        // set "DOWNLOAD_DIR" to ~/.cache
        (0, resolveConfig_1.setDefaultValue)(resolveConfig_1.ResolveConfigVariables.DOWNLOAD_DIR, (0, path_1.resolve)((0, os_1.homedir)(), '.cache', 'mongodb-binaries'));
    }
    else {
        (0, resolveConfig_1.setDefaultValue)(resolveConfig_1.ResolveConfigVariables.PREFER_GLOBAL_PATH, 'false');
    }
    if (version) {
        // if "version" is defined, apply it
        (0, resolveConfig_1.setDefaultValue)(resolveConfig_1.ResolveConfigVariables.VERSION, version);
    }
    process.env[(0, resolveConfig_1.envName)(resolveConfig_1.ResolveConfigVariables.RUNTIME_DOWNLOAD)] = 'true'; // To make sure to actually download in an postinstall
    const binPath = await MongoBinary_1.MongoBinary.getPath().catch((err) => {
        console.warn('Mongodb-Memory-Server* failed to find an binary:\n', err.message);
        process.exit(0); // Exiting with "0" to not fail the install (because it is an problem that can be solved otherwise)
    });
    console.log(`Mongodb-Memory-Server* found binary: "${binPath}"`);
}
exports.postInstallEnsureBinary = postInstallEnsureBinary;
//# sourceMappingURL=postinstallHelper.js.map