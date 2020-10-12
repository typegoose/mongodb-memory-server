## [7.0.0-beta.4](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.3...v7.0.0-beta.4) (2020-10-12)


### Fixes

* **-global:** change "mongodb_version" to latest patch version ([adcbdcf](https://github.com/nodkz/mongodb-memory-server/commit/adcbdcfa3240f4182466a70b8c731d0d97fa5287))
* **MongoBinary:** change "LATEST_VERSION" to latest patch version "4.0.20" ([23e6eaa](https://github.com/nodkz/mongodb-memory-server/commit/23e6eaa89c82efeb27fe71fd012cf438b54b006a))
* **MongoMemoryReplSet:** _initReplSet: check if there is already an PRIMARY ([a1c9264](https://github.com/nodkz/mongodb-memory-server/commit/a1c92648c8e3ac114b211e86c31b310d00c1c140))


### Refactor

* **postinstall:** rename function "postInstall" to "postInstallEnsureBinary" ([aca8262](https://github.com/nodkz/mongodb-memory-server/commit/aca826211351e73458c56e6d0dce99d068e05941))
* apply suggested changes ([2a9aab7](https://github.com/nodkz/mongodb-memory-server/commit/2a9aab7738e6512ce0e03135f4c8a8d217d62816))
* ***index:** use "tslib.__exportStar" ([2e9faec](https://github.com/nodkz/mongodb-memory-server/commit/2e9faec7a27a13652378d4cdd4d5bd632dc0fa8c))
* **postinstall:** change all packages to depend on "core" ([de41060](https://github.com/nodkz/mongodb-memory-server/commit/de41060cae7e4fcc1af286d18b90d473bca5864e)), closes [#378](https://github.com/nodkz/mongodb-memory-server/issues/378) [#174](https://github.com/nodkz/mongodb-memory-server/issues/174)

## [7.0.0-beta.3](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.2...v7.0.0-beta.3) (2020-10-08)


### ⚠ BREAKING CHANGES

* **MongoMemoryServer:** remove function "getDbName", can be replaced with "instanceInfo.dbName"
* **MongoMemoryServer:** remove function "getDbPath", can be replaced with "instanceInfo.dbPath"
* **MongoMemoryServer:** remove function "getPort", can be replaced with "instanceInfo.port"
* **MongoInstance:** change "start" to not reset "port" to "undefined"
* **MongoInstance:** change "instanceOpts" to be readonly and Readonly
change "binaryOpts" to be readonly and Readonly
change "spawnOpts" to be readonly and Readonly
* **MongoMemoryServer:** removing ".uri" because of function "getUri"
* **MongoMemoryServer:** removing ".childProcess" because it is an alias for ".instance.childProcess"
* **MongoMemoryServer:** remove option "autoStart"
change "MongoMemoryServer.create" to always call "MongoMemoryServer.start"
* **MongoMemoryServer:** change "MongoMemoryServer.getInstanceInfo" to return "undefined" instead of "false"
* **MongoMemoryServer:** change "MongoMemoryServer.getUri" to be sync
* **MongoMemoryServer:** remove deprecated function "getConnectionString" (replace with "getUri")
* **MongoMemoryServer:** change "MongoMemoryServer.getDbName" to be sync
* **MongoMemoryServer:** change "MongoMemoryServer.getDbPath" to be sync
* **MongoMemoryServer:** change "MongoMemoryServer.getPort" to be sync
* **MongoMemoryServer:** change "MongoMemoryServer.runningInstance" to be "undefined" instead of "null"
change "MongoMemoryServer.instanceInfoSync" to be "undefined" instead of "null"

### Features

* **MongoInstance:** change options to be readonly ([e599372](https://github.com/nodkz/mongodb-memory-server/commit/e5993727c618e08e1196b61d1d768bee34657738))
* **MongoMemoryServer:** add getter function "state" ([c19493f](https://github.com/nodkz/mongodb-memory-server/commit/c19493fd5243e66dc9afee7052178ee921d11369))
* **MongoMemoryServer:** extend EventEmitter ([04ca3d7](https://github.com/nodkz/mongodb-memory-server/commit/04ca3d750b83174400409c073d709e7642dc819e))
* **MongoMemoryServer:** remove "MongoInstanceDataT.childProcess" ([c71d8d4](https://github.com/nodkz/mongodb-memory-server/commit/c71d8d46ad52dbecc37470ccd182829b1afbc61e))
* **MongoMemoryServer:** remove "StartupInstanceData.uri" ([dec17a4](https://github.com/nodkz/mongodb-memory-server/commit/dec17a4379c54aab99a881faec2d6e88c949969b))
* **MongoMemoryServer:** remove deprecated function "getConnectionString" ([198f4c0](https://github.com/nodkz/mongodb-memory-server/commit/198f4c032ba0746c7b03ca509b16d8cd772ac875))
* **MongoMemoryServer:** remove function "getDbName" ([e2fc23f](https://github.com/nodkz/mongodb-memory-server/commit/e2fc23f62797aeb4e61a21924e7413621e767da8))
* **MongoMemoryServer:** remove function "getDbPath" ([2343771](https://github.com/nodkz/mongodb-memory-server/commit/2343771c9c7f1c780889cfea94e3f3947550edcd))
* **MongoMemoryServer:** remove function "getPort" ([5eb7017](https://github.com/nodkz/mongodb-memory-server/commit/5eb701741d6f650b72cfbda5394b4ccfab030766))
* **MongoMemoryServer:** remove option "autoStart" ([347085f](https://github.com/nodkz/mongodb-memory-server/commit/347085f890be05a28dc2b01c6ddb5011744f12dc))
* **MongoMemoryServer:** rename function "getInstanceInfo" into "get instanceInfo" ([ae8a9f8](https://github.com/nodkz/mongodb-memory-server/commit/ae8a9f82743df91a13716ab954bac510c30832af))


### Reverts

* "chore: remove unused file "tsconfig.test"" ([cc053c7](https://github.com/nodkz/mongodb-memory-server/commit/cc053c7f78ff29f67aabae30d180376c26ca96d8))


### Style

* **MongoMemoryServer:** remove comment & change log ([b098941](https://github.com/nodkz/mongodb-memory-server/commit/b0989411f39fe1397cecb8423e93bdf3245af0ea))


### Fixes

* **db_util:** killProcess: fix "SIGINT"-"SIGKILL" warn condition ([4113d94](https://github.com/nodkz/mongodb-memory-server/commit/4113d9457874c660b550e4ce5929582091f19d0a))
* **MongoInstance:** remove resetting "port" inside "start" ([7861a6f](https://github.com/nodkz/mongodb-memory-server/commit/7861a6faaf9fbdf229cd5792e7f515931f5a64b8)), closes [#393](https://github.com/nodkz/mongodb-memory-server/issues/393)


### Refactor

* **MongoMemoryReplSet:** stop: reset "servers" after stopping them ([0aa2293](https://github.com/nodkz/mongodb-memory-server/commit/0aa2293168b8081fcf2e1391c6096d30e31e0c38))
* **MongoMemoryServer:** add sanity check to "stop" ([8aff4ef](https://github.com/nodkz/mongodb-memory-server/commit/8aff4efe4356c12fcbe6153d8f33c03779b0626f))
* **MongoMemoryServer:** always reset "port" to "undefined" ([8ca0729](https://github.com/nodkz/mongodb-memory-server/commit/8ca0729cade0f1dd82c0eaefd81a5d2bf2b8fd6c))
* **MongoMemoryServer:** change "_state" to be "protected" ([b716c2c](https://github.com/nodkz/mongodb-memory-server/commit/b716c2cef8b6b74e90930ae08f2390abd3775206))
* **MongoMemoryServer:** change "getDbName" to be sync ([85a97e0](https://github.com/nodkz/mongodb-memory-server/commit/85a97e056c2d407a2d949e94b872403231c164d1))
* **MongoMemoryServer:** change "getDbPath" to be sync ([281fa1c](https://github.com/nodkz/mongodb-memory-server/commit/281fa1c716704f0142b022c7e0555f13c0b63b4f))
* **MongoMemoryServer:** change "getInstanceInfo" to return undefined ([27349a3](https://github.com/nodkz/mongodb-memory-server/commit/27349a3ddabd956038165d94932b5df4d9c0941f))
* **MongoMemoryServer:** change "getPort" to be sync ([e849f2c](https://github.com/nodkz/mongodb-memory-server/commit/e849f2caa5b2c84cb2901269162b8d92351be944))
* **MongoMemoryServer:** change "getUri" to be sync ([5b53f03](https://github.com/nodkz/mongodb-memory-server/commit/5b53f03f25be9946df236977cfb65c7fb72ba4c6))
* **MongoMemoryServer:** change "instanceInfo" to be "protected" ([7390eee](https://github.com/nodkz/mongodb-memory-server/commit/7390eee23bf5edb23b29ddeb33fb1ebf962eae53))
* **MongoMemoryServer:** merge "runningInstance" and "instanceInfoSync" into "instanceInfo" ([7642c75](https://github.com/nodkz/mongodb-memory-server/commit/7642c754f25a20ebee99fe974a008b522be75c0a))
* **MongoMemoryServer:** refactor "start" to be more readable ([7fb31c1](https://github.com/nodkz/mongodb-memory-server/commit/7fb31c151081ef1ada4062966a85eb9aaaace214))
* **MongoMemoryServer:** remove "await" from "getUriBase" call ([ca536b6](https://github.com/nodkz/mongodb-memory-server/commit/ca536b6a3c1059132b0a767653f70e7441b687bd))
* **MongoMemoryServer:** remove "null" use "undefined" ([086abef](https://github.com/nodkz/mongodb-memory-server/commit/086abef19eefb9fd8ac2e6e3304ea2cbafab9e0a))
* **MongoMemoryServer:** remove call to "ensureInstance" inside "stop" ([57801cf](https://github.com/nodkz/mongodb-memory-server/commit/57801cf3e08e95084a73a5e0b8ef3258c098c83b))
* **MongoMemoryServer:** rename "instanceInfo" to "_instanceInfo" ([d3ddcb4](https://github.com/nodkz/mongodb-memory-server/commit/d3ddcb41a55aeb012aeb92c2303eec7b2472cda7))
* **MongoMemoryServer:** rename function "assertionInstanceInfoSync" to "assertionInstanceInfo" ([03c8343](https://github.com/nodkz/mongodb-memory-server/commit/03c834379c306464ede6667a53916f4dfbbe5b39))
* **MongoMemoryServer:** shorten "getUri" ([f1024e5](https://github.com/nodkz/mongodb-memory-server/commit/f1024e551b594783e580a8d6b13dd243c25240dc))
* **MongoMemoryServer:** start: remove first ".catch" ([fafaa29](https://github.com/nodkz/mongodb-memory-server/commit/fafaa29116683c2ce08d027eef8cdcae4c50c991))

# [7.0.0-beta.2](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.1...v7.0.0-beta.2) (2020-10-07)


### Bug Fixes

* **types:** remove alias "SpawnOptions" ([8b963c5](https://github.com/nodkz/mongodb-memory-server/commit/8b963c52da9b1acf901a8e5c52074c9c7778aff4))
* **types:** remove unused types ([ab2944b](https://github.com/nodkz/mongodb-memory-server/commit/ab2944b76c9fc5ffa33b15cbfad822ab77a19301))
* remove unused file "deprecate" ([bb3e0f4](https://github.com/nodkz/mongodb-memory-server/commit/bb3e0f4e1c2564632516bf069c25c2bbd1a9e67a))

# [7.0.0-beta.1](https://github.com/nodkz/mongodb-memory-server/compare/v6.9.0...v7.0.0-beta.1) (2020-10-01)


### Bug Fixes

* **MongoInstance:** reset "childProcess" and "killerProcess" after "kill" ([49c710d](https://github.com/nodkz/mongodb-memory-server/commit/49c710df5b2fcaba1163c2d86b81e4eb1728bdff))


### Code Refactoring

* **MongoInstance:** change "null" to "undefined" for "childProcess" & "killerProcess" ([232b812](https://github.com/nodkz/mongodb-memory-server/commit/232b812c7799da392955f6e4d4e49f67b8e10597))
* **MongoInstance:** move "debug" into an private function ([3d23d5b](https://github.com/nodkz/mongodb-memory-server/commit/3d23d5b6d6dbac3c7b365bad3bc9bb03021ddfc6))
* **MongoInstance:** replace "instanceReady" and "instanceFailed" with events ([6925c45](https://github.com/nodkz/mongodb-memory-server/commit/6925c45a15d4ab14d4bd134ebcad1e96c6349580))
* **MongoMemoryReplSet:** "_waitForPrimary" use new events ([ed4b9e9](https://github.com/nodkz/mongodb-memory-server/commit/ed4b9e9c448435ff05cd504ed4e8a1a0e515b649))


### Features

* **db_util:** add function "assertion" ([c059500](https://github.com/nodkz/mongodb-memory-server/commit/c059500f946fa248260b686ec4ffaaa58c942a74))
* **MongoInstance:** change root values of "MongodOpts" to be required ([9779721](https://github.com/nodkz/mongodb-memory-server/commit/97797210bddbb117bfabb28f5b0be898a543bb3e))
* **MongoInstance:** extend EventEmitter ([10965c7](https://github.com/nodkz/mongodb-memory-server/commit/10965c7ac5c6a0877561221608f80d508cbfe30a)), closes [#365](https://github.com/nodkz/mongodb-memory-server/issues/365)
* **MongoInstance:** make "port" and "dbPath" required ([749c3e3](https://github.com/nodkz/mongodb-memory-server/commit/749c3e3dc9bc93d1506e034bf24a74b4420a4139))
* **MongoInstance:** outsource "MongodOpts.instance" ([d9dd6f8](https://github.com/nodkz/mongodb-memory-server/commit/d9dd6f81f84a69b412cdb5198baaabbdfaa156f7))
* **MongoInstance:** remove function "waitPrimaryReady" ([1536dc2](https://github.com/nodkz/mongodb-memory-server/commit/1536dc26f8548e95abc3baa0dba4b9b333b9e140))
* **MongoInstance:** rename interface "MongodOps" to "MongodOpts" ([edd4d39](https://github.com/nodkz/mongodb-memory-server/commit/edd4d39e0f8c0d1ed9c21f95f462e7bb8f42737f))


### BREAKING CHANGES

* **MongoInstance:** changing "null" to "undefined" can break some code
* **MongoInstance:** throwing an error if 2 values are now undefined/null can break some code
* **MongoInstance:** removing the possibility to overwrite 2 functions this can break some use-cases
* **MongoInstance:** removing an function can break some use-cases
* **MongoMemoryReplSet:** "_waitForPrimary" now uses events instead of calling function "waitPrimaryReady"
* **MongoInstance:** because of changing values to "required" this can break some use-cases
* **MongoInstance:** removing the "dynamic" part can break some code with custom debug-logging
* **MongoInstance:** because of the rename it can break some use-cases

# [6.9.0](https://github.com/nodkz/mongodb-memory-server/compare/v6.8.1...v6.9.0) (2020-09-30)


### Bug Fixes

* **MongoInstance:** try "SIGKILL" after timeout ([f2a06bc](https://github.com/nodkz/mongodb-memory-server/commit/f2a06bcd08922dccd11a8ade9d637cb2efcd157f))
* **MongoMemoryReplSet:** change "process.on" to "process.once" for "beforeExit" ([0e07953](https://github.com/nodkz/mongodb-memory-server/commit/0e0795341ff914b4aca059317aa7cd41bae6db68))
* **MongoMemoryReplSet:** remove "beforeExit" listener inside "stop" ([c7328c9](https://github.com/nodkz/mongodb-memory-server/commit/c7328c9a1a2f68da5463a4fd2cb6a7e588aef6dc))
* **MongoMemoryServer:** remove double check ([b99f3a4](https://github.com/nodkz/mongodb-memory-server/commit/b99f3a4b855e5630ff1b26285dae4942601c0735))


### Features

* **MongoInstance:** warn if nodejs version is below "10.15.0" ([8693b46](https://github.com/nodkz/mongodb-memory-server/commit/8693b4613e3cac078b611f1c581f268a37a38680)), closes [#379](https://github.com/nodkz/mongodb-memory-server/issues/379)
* **MongoMemoryReplSet:** deprecate "getConnectionString" ([b088af2](https://github.com/nodkz/mongodb-memory-server/commit/b088af2fad9660a685b15efdffeb03b16ce58579))
* **MongoMemoryServer:** deprecate "getConnectionString" ([9abf04f](https://github.com/nodkz/mongodb-memory-server/commit/9abf04f23188e1ad4eb47b0797c33e8210b8056b))

# [6.9.0-beta.2](https://github.com/nodkz/mongodb-memory-server/compare/v6.9.0-beta.1...v6.9.0-beta.2) (2020-09-30)


### Features

* **MongoMemoryReplSet:** deprecate "getConnectionString" ([b088af2](https://github.com/nodkz/mongodb-memory-server/commit/b088af2fad9660a685b15efdffeb03b16ce58579))
* **MongoMemoryServer:** deprecate "getConnectionString" ([9abf04f](https://github.com/nodkz/mongodb-memory-server/commit/9abf04f23188e1ad4eb47b0797c33e8210b8056b))

# [6.9.0-beta.1](https://github.com/nodkz/mongodb-memory-server/compare/v6.8.1...v6.9.0-beta.1) (2020-09-29)


### Bug Fixes

* **MongoInstance:** try "SIGKILL" after timeout ([f2a06bc](https://github.com/nodkz/mongodb-memory-server/commit/f2a06bcd08922dccd11a8ade9d637cb2efcd157f))
* **MongoMemoryReplSet:** change "process.on" to "process.once" for "beforeExit" ([0e07953](https://github.com/nodkz/mongodb-memory-server/commit/0e0795341ff914b4aca059317aa7cd41bae6db68))
* **MongoMemoryReplSet:** remove "beforeExit" listener inside "stop" ([c7328c9](https://github.com/nodkz/mongodb-memory-server/commit/c7328c9a1a2f68da5463a4fd2cb6a7e588aef6dc))
* **MongoMemoryServer:** remove double check ([b99f3a4](https://github.com/nodkz/mongodb-memory-server/commit/b99f3a4b855e5630ff1b26285dae4942601c0735))


### Features

* **MongoInstance:** warn if nodejs version is below "10.15.0" ([8693b46](https://github.com/nodkz/mongodb-memory-server/commit/8693b4613e3cac078b611f1c581f268a37a38680)), closes [#379](https://github.com/nodkz/mongodb-memory-server/issues/379)

## [6.8.1](https://github.com/nodkz/mongodb-memory-server/compare/v6.8.0...v6.8.1) (2020-09-28)


### Bug Fixes

* explicitly re-export "default" ([d3a1f6e](https://github.com/nodkz/mongodb-memory-server/commit/d3a1f6e624399ffcdbe2c8ffb8f174692d007169)), closes [nodkz/mongodb-memory-server#386](https://github.com/nodkz/mongodb-memory-server/issues/386)
* **MongoInstance:** add call to "instanceFailed" to "closeHandler" ([c6010f4](https://github.com/nodkz/mongodb-memory-server/commit/c6010f411d5c72f100e55d0b918b7c252e47a5ec)), closes [#385](https://github.com/nodkz/mongodb-memory-server/issues/385)
* **MongoInstance:** fix log in "run" ([38b2f0d](https://github.com/nodkz/mongodb-memory-server/commit/38b2f0dd9737299fd9b0f750be0594779b5df0ac))

## [6.8.1-beta.2](https://github.com/nodkz/mongodb-memory-server/compare/v6.8.1-beta.1...v6.8.1-beta.2) (2020-09-28)


### Bug Fixes

* explicitly re-export "default" ([d3a1f6e](https://github.com/nodkz/mongodb-memory-server/commit/d3a1f6e624399ffcdbe2c8ffb8f174692d007169)), closes [nodkz/mongodb-memory-server#386](https://github.com/nodkz/mongodb-memory-server/issues/386)

## [6.8.1-beta.1](https://github.com/nodkz/mongodb-memory-server/compare/v6.8.0...v6.8.1-beta.1) (2020-09-26)


### Bug Fixes

* **MongoInstance:** add call to "instanceFailed" to "closeHandler" ([c6010f4](https://github.com/nodkz/mongodb-memory-server/commit/c6010f411d5c72f100e55d0b918b7c252e47a5ec)), closes [#385](https://github.com/nodkz/mongodb-memory-server/issues/385)
* **MongoInstance:** fix log in "run" ([38b2f0d](https://github.com/nodkz/mongodb-memory-server/commit/38b2f0dd9737299fd9b0f750be0594779b5df0ac))

# [6.8.0](https://github.com/nodkz/mongodb-memory-server/compare/v6.7.6...v6.8.0) (2020-09-21)


### Features

* skip binary download when binary tar exists ([31ac64c](https://github.com/nodkz/mongodb-memory-server/commit/31ac64c1db82118d76c9defd42597daf1031f7c6))

## [6.7.6](https://github.com/nodkz/mongodb-memory-server/compare/v6.7.5...v6.7.6) (2020-09-16)


### Bug Fixes

* **MongoBinary:** change "LockFile.unlock" to be async ([87c7b33](https://github.com/nodkz/mongodb-memory-server/commit/87c7b33b28de18c6e0701f4b2540c4b0518ee17b))
* **MongoBinary:** improve code ([39ca575](https://github.com/nodkz/mongodb-memory-server/commit/39ca5754acdb26e822262d56189c2ddc203857a8))
* **resolve-config:** improve code ([22d765d](https://github.com/nodkz/mongodb-memory-server/commit/22d765da9f61ffd3abe0bbf37796c562dec80755))

## [6.7.5](https://github.com/nodkz/mongodb-memory-server/compare/v6.7.4...v6.7.5) (2020-09-12)


### Bug Fixes

* **postinstall:** skip postinstall if "SYSTEM_BINARY" is set ([34b1f1f](https://github.com/nodkz/mongodb-memory-server/commit/34b1f1f052c628bf8b434e2d07e801643dc5ad14)), closes [#370](https://github.com/nodkz/mongodb-memory-server/issues/370)

## [6.7.4](https://github.com/nodkz/mongodb-memory-server/compare/v6.7.3...v6.7.4) (2020-09-11)


### Bug Fixes

* **MongoMemoryReplSet:** comment-out older hack ([c9679d8](https://github.com/nodkz/mongodb-memory-server/commit/c9679d8129b2e4c0afec980f78a5b5e91f5a9f3b)), closes [#366](https://github.com/nodkz/mongodb-memory-server/issues/366)

## [6.7.3](https://github.com/nodkz/mongodb-memory-server/compare/v6.7.2...v6.7.3) (2020-09-11)


### Bug Fixes

* **Dependencies:** update mongodb version ([fe53081](https://github.com/nodkz/mongodb-memory-server/commit/fe5308180afb8b0600596cf3d5b7fe3219777967)), closes [#349](https://github.com/nodkz/mongodb-memory-server/issues/349)

## [6.7.2](https://github.com/nodkz/mongodb-memory-server/compare/v6.7.1...v6.7.2) (2020-09-10)


### Bug Fixes

* **MongoBinaryDownload:** extend 404 error ([4a034f0](https://github.com/nodkz/mongodb-memory-server/commit/4a034f069278e052ca305e409363408ff5cf53cc))
* **MongoInstance:** modify "kill"'s debug logs ([d00a96e](https://github.com/nodkz/mongodb-memory-server/commit/d00a96edd4d1c3feddb7dbc302729ae905df8b62))
* use "db_util.isNullOrUndefined" ([83ce9fe](https://github.com/nodkz/mongodb-memory-server/commit/83ce9fed76ce68eaccb87a9ee72f97339f62ae5c))
* **MongoMemoryReplSet:** remove unused variable ([d32aec1](https://github.com/nodkz/mongodb-memory-server/commit/d32aec165e5fb8db6861cf4443d2f1006dfcae3c))

## [6.7.1](https://github.com/nodkz/mongodb-memory-server/compare/v6.7.0...v6.7.1) (2020-09-09)


### Bug Fixes

* **MongoBinaryDownload:** print used URL in 404 Error ([788c12d](https://github.com/nodkz/mongodb-memory-server/commit/788c12d38dc5308f58a4379e7496960dbb454c08))

# [6.7.0](https://github.com/nodkz/mongodb-memory-server/compare/v6.6.9...v6.7.0) (2020-09-08)


### Features

* add packages `mongodb-memory-server-global-4.2`, `mongodb-memory-server-global-4.4` ([7c97997](https://github.com/nodkz/mongodb-memory-server/commit/7c9799723e35b65f1a37204bdbc637fb0a7f622c))


## [6.6.9](https://github.com/nodkz/mongodb-memory-server/compare/v6.6.8...v6.6.9) (2020-09-08)


### Bug Fixes

* **mongo_killer:** refactor mongo_killer to make more sense ([2dd1fae](https://github.com/nodkz/mongodb-memory-server/commit/2dd1fae2dc87468d3b1e32d0baf2f74543edfe4c))
* **MongoInstance:** de-duplicate killer code & actually log output from "mongo_killer" ([76889a6](https://github.com/nodkz/mongodb-memory-server/commit/76889a6eb678a3b3994315bfc0cbee916a622564))
* **MongoInstance:** use environment variable "NODE" before "argv[0]" ([611f227](https://github.com/nodkz/mongodb-memory-server/commit/611f2274cca178bd8cca5fb48bc1b2a23bd16d88)), closes [#177](https://github.com/nodkz/mongodb-memory-server/issues/177)





## [6.6.8](https://github.com/nodkz/mongodb-memory-server/compare/v6.6.7...v6.6.8) (2020-09-08)


### Bug Fixes

* **package:** move non-exposed [@types](https://github.com/types) to devDependencies ([6ff2e8e](https://github.com/nodkz/mongodb-memory-server/commit/6ff2e8e57d59203d2400339a27398f0eb2ed169a)), closes [#286](https://github.com/nodkz/mongodb-memory-server/issues/286)





## [6.6.7](https://github.com/nodkz/mongodb-memory-server/compare/v6.6.6...v6.6.7) (2020-08-29)


### Bug Fixes

* resolve "Invalid Semver version" problem [#345](https://github.com/nodkz/mongodb-memory-server/issues/345) [#335](https://github.com/nodkz/mongodb-memory-server/issues/335) ([#346](https://github.com/nodkz/mongodb-memory-server/issues/346)) ([3cb858b](https://github.com/nodkz/mongodb-memory-server/commit/3cb858ba6fbd2bba64e27d59a5db18fa99e91978))





## [6.6.6](https://github.com/nodkz/mongodb-memory-server/compare/v6.6.5...v6.6.6) (2020-08-25)


### Bug Fixes

* return back `checkMD5` config option which `false` by default ([#342](https://github.com/nodkz/mongodb-memory-server/issues/342)) ([d2c6cc0](https://github.com/nodkz/mongodb-memory-server/commit/d2c6cc0bee8fb03201ea3b138821235028b47971))





## [6.6.5](https://github.com/nodkz/mongodb-memory-server/compare/v6.6.4...v6.6.5) (2020-08-24)


### Bug Fixes

* change mongodb version tests to use semver ([31183dd](https://github.com/nodkz/mongodb-memory-server/commit/31183ddcb3f75e3270d1cd15157636aa167b8035)), closes [nodkz/mongodb-memory-server#340](https://github.com/nodkz/mongodb-memory-server/issues/340) [nodkz/mongodb-memory-server#318](https://github.com/nodkz/mongodb-memory-server/issues/318)





## [6.6.4](https://github.com/nodkz/mongodb-memory-server/compare/v6.6.3...v6.6.4) (2020-08-17)


### Bug Fixes

* URL generation for MongoDB 4.4 ([#329](https://github.com/nodkz/mongodb-memory-server/issues/329)) ([9cd80f9](https://github.com/nodkz/mongodb-memory-server/commit/9cd80f9ec82a7f05f99f2551bccbdd7485dafae8))





## [6.6.3](https://github.com/nodkz/mongodb-memory-server/compare/v6.6.2...v6.6.3) (2020-07-28)


### Bug Fixes

* remove stub package "@types/get-port" ([#328](https://github.com/nodkz/mongodb-memory-server/issues/328)) ([c49c582](https://github.com/nodkz/mongodb-memory-server/commit/c49c5821b2d7704d47532753e9ae37dcab4179c1)), closes [nodkz/mongodb-memory-server#298](https://github.com/nodkz/mongodb-memory-server/issues/298)
* **MongoBinaryDownload:** add debug log for url ([#327](https://github.com/nodkz/mongodb-memory-server/issues/327)) ([d4c9edb](https://github.com/nodkz/mongodb-memory-server/commit/d4c9edb61c59026fe0e49cb2d3de47e3e8f34f8e))





## [6.6.2](https://github.com/nodkz/mongodb-memory-server/compare/v6.6.1...v6.6.2) (2020-07-27)


### Bug Fixes

* lint ([218b057](https://github.com/nodkz/mongodb-memory-server/commit/218b057425eafa2463d8167fe1ba29a0a4590476))
* update Dependencies (audit problems) ([2782166](https://github.com/nodkz/mongodb-memory-server/commit/278216667929379c43c70314b437cc34db6f07fa))





## [6.6.1](https://github.com/nodkz/mongodb-memory-server/compare/v6.6.0...v6.6.1) (2020-05-20)


### Bug Fixes

* read strict-ssl from npm config ([#310](https://github.com/nodkz/mongodb-memory-server/issues/310)) ([3ede8d1](https://github.com/nodkz/mongodb-memory-server/commit/3ede8d1)), closes [#308](https://github.com/nodkz/mongodb-memory-server/issues/308)





# [6.6.0](https://github.com/nodkz/mongodb-memory-server/compare/v6.5.2...v6.6.0) (2020-05-11)


### Features

* read strict-ssl from npm config ([#306](https://github.com/nodkz/mongodb-memory-server/issues/306)) ([6e3dbc8](https://github.com/nodkz/mongodb-memory-server/commit/6e3dbc8)), closes [#162](https://github.com/nodkz/mongodb-memory-server/issues/162)





## [6.5.2](https://github.com/nodkz/mongodb-memory-server/compare/v6.5.1...v6.5.2) (2020-04-05)


### Bug Fixes

* insensitive the regexp when a primary is elected ([#294](https://github.com/nodkz/mongodb-memory-server/issues/294)) ([746ccb1](https://github.com/nodkz/mongodb-memory-server/commit/746ccb1)), closes [#292](https://github.com/nodkz/mongodb-memory-server/issues/292)





## [6.5.1](https://github.com/nodkz/mongodb-memory-server/compare/v6.5.0...v6.5.1) (2020-04-02)


### Bug Fixes

* change "waiting for connections on port" to "waiting for connections"  ([02228c3](https://github.com/nodkz/mongodb-memory-server/commit/02228c3))





# [6.5.0](https://github.com/nodkz/mongodb-memory-server/compare/v6.4.1...v6.5.0) (2020-03-24)


### Features

* add support for rhel & coreos 8 ([#288](https://github.com/nodkz/mongodb-memory-server/issues/288)) ([2d15e6a](https://github.com/nodkz/mongodb-memory-server/commit/2d15e6a))





## [6.4.1](https://github.com/nodkz/mongodb-memory-server/compare/v6.4.0...v6.4.1) (2020-03-19)


### Bug Fixes

* **MongoBinaryDownload:** Resolve in extractTarGz ([58faef2](https://github.com/nodkz/mongodb-memory-server/commit/58faef2))





# [6.4.0](https://github.com/nodkz/mongodb-memory-server/compare/v6.3.3...v6.4.0) (2020-03-19)


### Bug Fixes

* set timeout per test ([b3f9a10](https://github.com/nodkz/mongodb-memory-server/commit/b3f9a10))


### Features

* add try/catch for reinit of repl set ([ab7f5f6](https://github.com/nodkz/mongodb-memory-server/commit/ab7f5f6))





## [6.3.3](https://github.com/nodkz/mongodb-memory-server/compare/v6.3.2...v6.3.3) (2020-03-11)


### Bug Fixes

* update Dependencies ([#281](https://github.com/nodkz/mongodb-memory-server/issues/281)) ([054cbe5](https://github.com/nodkz/mongodb-memory-server/commit/054cbe5)), closes [#280](https://github.com/nodkz/mongodb-memory-server/issues/280)





## [6.3.2](https://github.com/nodkz/mongodb-memory-server/compare/v6.3.1...v6.3.2) (2020-03-03)


### Bug Fixes

* **MongoBinaryDownload:** handle Status Codes other than 200 ([#273](https://github.com/nodkz/mongodb-memory-server/issues/273)) ([3d68233](https://github.com/nodkz/mongodb-memory-server/commit/3d68233)), closes [#226](https://github.com/nodkz/mongodb-memory-server/issues/226)





## [6.3.1](https://github.com/nodkz/mongodb-memory-server/compare/v6.3.0...v6.3.1) (2020-02-28)

**Note:** Version bump only for package lerna-monorepo





# [6.3.0](https://github.com/nodkz/mongodb-memory-server/compare/v6.2.4...v6.3.0) (2020-02-28)


### Features

* rewrite Logging via debug package under `DEBUG=MongoMS:*` key ([#270](https://github.com/nodkz/mongodb-memory-server/issues/270)) ([f2885c0](https://github.com/nodkz/mongodb-memory-server/commit/f2885c0))





## [6.2.4](https://github.com/nodkz/mongodb-memory-server/compare/v6.2.3...v6.2.4) (2020-01-27)


### Bug Fixes

* add @types/tmp to dependencies ([#266](https://github.com/nodkz/mongodb-memory-server/issues/266)) ([ffbf1ea](https://github.com/nodkz/mongodb-memory-server/commit/ffbf1ea))





## [6.2.3](https://github.com/nodkz/mongodb-memory-server/compare/v6.2.2...v6.2.3) (2020-01-20)


### Bug Fixes

* change import for `tmp` package ([4477b9b](https://github.com/nodkz/mongodb-memory-server/commit/4477b9b))





## [6.2.2](https://github.com/nodkz/mongodb-memory-server/compare/v6.2.1...v6.2.2) (2020-01-15)


### Bug Fixes

* add TSDoc to MongoInstance; code refactoring ([#261](https://github.com/nodkz/mongodb-memory-server/issues/261)) ([6865520](https://github.com/nodkz/mongodb-memory-server/commit/6865520))





## [6.2.1](https://github.com/nodkz/mongodb-memory-server/compare/v6.2.0...v6.2.1) (2019-12-30)


### Bug Fixes

* **ArchLinux:** binary not downloaded when no release file is found. Plus other code fixes and cleanups (tnx [@hasezoey](https://github.com/hasezoey)) ([8723187](https://github.com/nodkz/mongodb-memory-server/commit/8723187)), closes [#248](https://github.com/nodkz/mongodb-memory-server/issues/248) [#255](https://github.com/nodkz/mongodb-memory-server/issues/255)





# [6.2.0](https://github.com/nodkz/mongodb-memory-server/compare/v6.1.1...v6.2.0) (2019-12-26)


### Features

* add static async `MongoMemoryServer.create()`; improve Example code & add TSDoc (tnx [@hasezoey](https://github.com/hasezoey)) ([a2b0fc4](https://github.com/nodkz/mongodb-memory-server/commit/a2b0fc4)), closes [#211](https://github.com/nodkz/mongodb-memory-server/issues/211) [/github.com/nodkz/mongodb-memory-server/issues/184#issuecomment-568782496](https://github.com//github.com/nodkz/mongodb-memory-server/issues/184/issues/issuecomment-568782496)





## [6.1.1](https://github.com/nodkz/mongodb-memory-server/compare/v6.1.0...v6.1.1) (2019-12-20)

**Note:** Version bump only for package lerna-monorepo





# [6.1.0](https://github.com/nodkz/mongodb-memory-server/compare/v6.0.2...v6.1.0) (2019-12-20)


### Features

* add support for Linux Mint (tnx [@hasezoey](https://github.com/hasezoey)) ([92a9381](https://github.com/nodkz/mongodb-memory-server/commit/92a9381))





## [6.0.2](https://github.com/nodkz/mongodb-memory-server/compare/v6.0.1...v6.0.2) (2019-12-03)


### Bug Fixes

* compatibility with debian 10 (works for Mongo >= v4.2.1) ([837d98e](https://github.com/nodkz/mongodb-memory-server/commit/837d98e))





## [6.0.1](https://github.com/nodkz/mongodb-memory-server/compare/v6.0.0...v6.0.1) (2019-10-22)


### Bug Fixes

* **MongoMemoryServer:** add `?` character to the connection string (uri) by default (hotfix for v6.0.0) ([505b7c2](https://github.com/nodkz/mongodb-memory-server/commit/505b7c2))





# [6.0.0](https://github.com/nodkz/mongodb-memory-server/compare/v5.2.11...v6.0.0) (2019-10-22)


### Bug Fixes

* **MongoMemoryReplSet:** `getConnectionString()` now returns uri with `?replicaSet=` option. ([401441c](https://github.com/nodkz/mongodb-memory-server/commit/401441c))


### chore

* update cross-spawn ([c99fda8](https://github.com/nodkz/mongodb-memory-server/commit/c99fda8))


### BREAKING CHANGES

* drop support for Node.js < 8
* **MongoMemoryReplSet:** `getConnectionString()` now returns uri with `?replicaSet=` option.





## [5.2.11](https://github.com/nodkz/mongodb-memory-server/compare/v5.2.10...v5.2.11) (2019-10-22)


### Bug Fixes

* upgrade https-proxy-agent till 3.0.0 ([c554faa](https://github.com/nodkz/mongodb-memory-server/commit/c554faa))





## [5.2.10](https://github.com/nodkz/mongodb-memory-server/compare/v5.2.9...v5.2.10) (2019-10-22)


### Bug Fixes

* **ReplSet:** add HACK for "Maximum call stack size exceeded" in MongoClient topology ([470f094](https://github.com/nodkz/mongodb-memory-server/commit/470f094)), closes [#221](https://github.com/nodkz/mongodb-memory-server/issues/221)





## [5.2.9](https://github.com/nodkz/mongodb-memory-server/compare/v5.2.8...v5.2.9) (2019-10-22)


### Bug Fixes

* upgrade `https-proxy-agent` package due high sev. vulnerability ([f44ebe4](https://github.com/nodkz/mongodb-memory-server/commit/f44ebe4))





## [5.2.8](https://github.com/nodkz/mongodb-memory-server/compare/v5.2.7...v5.2.8) (2019-10-09)


### Bug Fixes

* revert add debian v10 downloads ([ffa95cd](https://github.com/nodkz/mongodb-memory-server/commit/ffa95cd))





## [5.2.7](https://github.com/nodkz/mongodb-memory-server/compare/v5.2.6...v5.2.7) (2019-10-08)


### Bug Fixes

* add debian v10 downloads ([012d652](https://github.com/nodkz/mongodb-memory-server/commit/012d652)), closes [#204](https://github.com/nodkz/mongodb-memory-server/issues/204)





## [5.2.6](https://github.com/nodkz/mongodb-memory-server/compare/v5.2.5...v5.2.6) (2019-09-30)


### Bug Fixes

* using "useUnifiedTopology" to avoid deprecation msg ([00e022d](https://github.com/nodkz/mongodb-memory-server/commit/00e022d))





## [5.2.5](https://github.com/nodkz/mongodb-memory-server/compare/v5.2.4...v5.2.5) (2019-09-23)


### Bug Fixes

* **ReplSet:** typescript definitions ReplSetOpts.dbName is optional ([d1e4b53](https://github.com/nodkz/mongodb-memory-server/commit/d1e4b53))





## [5.2.4](https://github.com/nodkz/mongodb-memory-server/compare/v5.2.3...v5.2.4) (2019-09-23)

**Note:** Version bump only for package lerna-monorepo





## [5.2.3](https://github.com/nodkz/mongodb-memory-server/compare/v5.2.2...v5.2.3) (2019-09-11)


### Bug Fixes

* clearTimeout when waiting for primary ([08aa26f](https://github.com/nodkz/mongodb-memory-server/commit/08aa26f))





## [5.2.2](https://github.com/nodkz/mongodb-memory-server/compare/v5.2.1...v5.2.2) (2019-09-09)


### Bug Fixes

* download url exception for win32 & v4.2.0 ([bf8ff9e](https://github.com/nodkz/mongodb-memory-server/commit/bf8ff9e))





## [5.2.1](https://github.com/nodkz/mongodb-memory-server/compare/v5.2.0...v5.2.1) (2019-09-04)


### Bug Fixes

* URL for macos change for 4.2.0 ([0452cbd](https://github.com/nodkz/mongodb-memory-server/commit/0452cbd))





# [5.2.0](https://github.com/nodkz/mongodb-memory-server/compare/v5.1.10...v5.2.0) (2019-08-10)


### Features

* add MONGOMS_DOWNLOAD_URL env variable for downloading binary from url ([8b31ff5](https://github.com/nodkz/mongodb-memory-server/commit/8b31ff5))





## [5.1.10](https://github.com/nodkz/mongodb-memory-server/compare/v5.1.9...v5.1.10) (2019-08-02)


### Bug Fixes

* **ReplicaSet:** detect primary from stdout instead of admin call ([c081ece](https://github.com/nodkz/mongodb-memory-server/commit/c081ece))





## [5.1.9](https://github.com/nodkz/mongodb-memory-server/compare/v5.1.8...v5.1.9) (2019-07-24)


### Bug Fixes

* add fail message when mongod cannot find CURL_OPENSSL_3 ([2ba4ae5](https://github.com/nodkz/mongodb-memory-server/commit/2ba4ae5))
* avoid infinite loop when waiting Primary ([b19c4bf](https://github.com/nodkz/mongodb-memory-server/commit/b19c4bf))





## [5.1.8](https://github.com/nodkz/mongodb-memory-server/compare/v5.1.7...v5.1.8) (2019-07-23)


### Bug Fixes

* wait until primary is transitioned from secondary for replicaSet ([596fed8](https://github.com/nodkz/mongodb-memory-server/commit/596fed8))





## [5.1.7](https://github.com/nodkz/mongodb-memory-server/compare/v5.1.6...v5.1.7) (2019-07-19)

**Note:** Version bump only for package lerna-monorepo





## [5.1.6](https://github.com/nodkz/mongodb-memory-server/compare/v5.1.5...v5.1.6) (2019-07-16)


### Bug Fixes

* global-3.4, global-3.6, global-4.0 now properly set default mongod version ([5fc1652](https://github.com/nodkz/mongodb-memory-server/commit/5fc1652))





## [5.1.5](https://github.com/nodkz/mongodb-memory-server/compare/v5.1.4...v5.1.5) (2019-06-18)


### Bug Fixes

* re-initialise configuration using INIT_CWD in postinstall.js ([9641bf4](https://github.com/nodkz/mongodb-memory-server/commit/9641bf4))





## [5.1.4](https://github.com/nodkz/mongodb-memory-server/compare/v5.1.3...v5.1.4) (2019-06-11)


### Bug Fixes

* simplify postinstall path check for Windows' users ([0b010bf](https://github.com/nodkz/mongodb-memory-server/commit/0b010bf))





## [5.1.3](https://github.com/nodkz/mongodb-memory-server/compare/v5.1.2...v5.1.3) (2019-06-06)


### Bug Fixes

* resolve to config from closest package.json ([34b6e27](https://github.com/nodkz/mongodb-memory-server/commit/34b6e27))
* use cross-spawn to help with Windows issues ([efad669](https://github.com/nodkz/mongodb-memory-server/commit/efad669))





## [5.1.2](https://github.com/nodkz/mongodb-memory-server/compare/v5.1.1...v5.1.2) (2019-05-16)

**Note:** Version bump only for package lerna-monorepo





## [5.1.1](https://github.com/nodkz/mongodb-memory-server/compare/v5.1.0...v5.1.1) (2019-05-09)


### Bug Fixes

* fallback on ubuntu 18 binaries for newest versions ([#183](https://github.com/nodkz/mongodb-memory-server/issues/183)) ([d5a1bfc](https://github.com/nodkz/mongodb-memory-server/commit/d5a1bfc))





# [5.1.0](https://github.com/nodkz/mongodb-memory-server/compare/v5.0.4...v5.1.0) (2019-04-21)


### Features

* configure installation from package.json ([c8dbbb9](https://github.com/nodkz/mongodb-memory-server/commit/c8dbbb9))





## [5.0.4](https://github.com/nodkz/mongodb-memory-server/compare/v5.0.3...v5.0.4) (2019-04-15)

**Note:** Version bump only for package lerna-monorepo





## [5.0.3](https://github.com/nodkz/mongodb-memory-server/compare/v5.0.2...v5.0.3) (2019-04-14)


### Bug Fixes

* **downloadUrl:** elementaryOS support fixed for versions up to 0.3 ([232c33f](https://github.com/nodkz/mongodb-memory-server/commit/232c33f))





## [5.0.2](https://github.com/nodkz/mongodb-memory-server/compare/v5.0.1...v5.0.2) (2019-04-11)


### Bug Fixes

* **MongoBinary:** unwrap deeply nested cache directory ([dcb9c9c](https://github.com/nodkz/mongodb-memory-server/commit/dcb9c9c)), closes [#168](https://github.com/nodkz/mongodb-memory-server/issues/168)





## [5.0.1](https://github.com/nodkz/mongodb-memory-server/compare/v5.0.0...v5.0.1) (2019-04-10)

**Note:** Version bump only for package lerna-monorepo





# [5.0.0](https://github.com/nodkz/mongodb-memory-server/compare/v4.2.2...v5.0.0) (2019-04-10)


### Code Refactoring

* using Lerna multiple packages ([e80e0f2](https://github.com/nodkz/mongodb-memory-server/commit/e80e0f2)), closes [/github.com/nodkz/mongodb-memory-server/issues/159#issuecomment-474398550](https://github.com//github.com/nodkz/mongodb-memory-server/issues/159/issues/issuecomment-474398550)


### Features

* add additional packages with specific default configs ([9cca8f6](https://github.com/nodkz/mongodb-memory-server/commit/9cca8f6))


### BREAKING CHANGES

* Remove `MomgoMemoryServer.getInstanceData()` method. Use `MomgoMemoryServer.ensureInstance()` instead.





# Change Log

## 0.0.0-semantically-released (May 11, 2017)

This package publishing automated by [semantic-release](https://github.com/semantic-release/semantic-release).
[Changelog](https://github.com/nodkz/mongodb-memory-server/releases) is generated automatically and can be found here: https://github.com/nodkz/mongodb-memory-server/releases

## 0.0.1 (May 11, 2017)

- First commit
