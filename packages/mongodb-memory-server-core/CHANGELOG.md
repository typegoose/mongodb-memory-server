# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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

**Note:** Version bump only for package mongodb-memory-server-core





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

**Note:** Version bump only for package mongodb-memory-server-core





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

**Note:** Version bump only for package mongodb-memory-server-core





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

**Note:** Version bump only for package mongodb-memory-server-core





## [5.1.1](https://github.com/nodkz/mongodb-memory-server/compare/v5.1.0...v5.1.1) (2019-05-09)


### Bug Fixes

* fallback on ubuntu 18 binaries for newest versions ([#183](https://github.com/nodkz/mongodb-memory-server/issues/183)) ([d5a1bfc](https://github.com/nodkz/mongodb-memory-server/commit/d5a1bfc))





# [5.1.0](https://github.com/nodkz/mongodb-memory-server/compare/v5.0.4...v5.1.0) (2019-04-21)


### Features

* configure installation from package.json ([c8dbbb9](https://github.com/nodkz/mongodb-memory-server/commit/c8dbbb9))





## [5.0.4](https://github.com/nodkz/mongodb-memory-server/compare/v5.0.3...v5.0.4) (2019-04-15)

**Note:** Version bump only for package mongodb-memory-server-core





## [5.0.3](https://github.com/nodkz/mongodb-memory-server/compare/v5.0.2...v5.0.3) (2019-04-14)


### Bug Fixes

* **downloadUrl:** elementaryOS support fixed for versions up to 0.3 ([232c33f](https://github.com/nodkz/mongodb-memory-server/commit/232c33f))





## [5.0.2](https://github.com/nodkz/mongodb-memory-server/compare/v5.0.1...v5.0.2) (2019-04-11)


### Bug Fixes

* **MongoBinary:** unwrap deeply nested cache directory ([dcb9c9c](https://github.com/nodkz/mongodb-memory-server/commit/dcb9c9c)), closes [#168](https://github.com/nodkz/mongodb-memory-server/issues/168)





## [5.0.1](https://github.com/nodkz/mongodb-memory-server/compare/v5.0.0...v5.0.1) (2019-04-10)

**Note:** Version bump only for package mongodb-memory-server-core





# [5.0.0](https://github.com/nodkz/mongodb-memory-server/compare/v4.2.2...v5.0.0) (2019-04-10)


### Code Refactoring

* using Lerna multiple packages ([e80e0f2](https://github.com/nodkz/mongodb-memory-server/commit/e80e0f2)), closes [/github.com/nodkz/mongodb-memory-server/issues/159#issuecomment-474398550](https://github.com//github.com/nodkz/mongodb-memory-server/issues/159/issues/issuecomment-474398550)


### Features

* add additional packages with specific default configs ([9cca8f6](https://github.com/nodkz/mongodb-memory-server/commit/9cca8f6))


### BREAKING CHANGES

* Remove `MomgoMemoryServer.getInstanceData()` method. Use `MomgoMemoryServer.ensureInstance()` instead.
