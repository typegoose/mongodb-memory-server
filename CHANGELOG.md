## [10.2.1](https://github.com/typegoose/mongodb-memory-server/compare/v10.2.0...v10.2.1) (2025-09-15)

### Fixes

* **MongoBinaryDownloadUrl:** add "cachyos" as arch-like ([b32b3d2](https://github.com/typegoose/mongodb-memory-server/commit/b32b3d28f1ba72a512503b55cff0383ed9b8c186)), closes [#947](https://github.com/typegoose/mongodb-memory-server/issues/947)
* **MongoBinaryDownloadUrl:** use "rhel90" before mongodb 8.0.0 ([7cc91e6](https://github.com/typegoose/mongodb-memory-server/commit/7cc91e6475018e528103ad8885618099494fd47c)), closes [#942](https://github.com/typegoose/mongodb-memory-server/issues/942) [#941](https://github.com/typegoose/mongodb-memory-server/issues/941)

## [10.2.1-beta.2](https://github.com/typegoose/mongodb-memory-server/compare/v10.2.1-beta.1...v10.2.1-beta.2) (2025-09-15)

### Fixes

* **MongoBinaryDownloadUrl:** add "cachyos" as arch-like ([b32b3d2](https://github.com/typegoose/mongodb-memory-server/commit/b32b3d28f1ba72a512503b55cff0383ed9b8c186)), closes [#947](https://github.com/typegoose/mongodb-memory-server/issues/947)

## [10.2.1-beta.1](https://github.com/typegoose/mongodb-memory-server/compare/v10.2.0...v10.2.1-beta.1) (2025-09-06)

### Fixes

* **MongoBinaryDownloadUrl:** use "rhel90" before mongodb 8.0.0 ([7cc91e6](https://github.com/typegoose/mongodb-memory-server/commit/7cc91e6475018e528103ad8885618099494fd47c)), closes [#942](https://github.com/typegoose/mongodb-memory-server/issues/942) [#941](https://github.com/typegoose/mongodb-memory-server/issues/941)

## [10.2.0](https://github.com/typegoose/mongodb-memory-server/compare/v10.1.4...v10.2.0) (2025-08-02)

### Features

* **MongoBinaryDownloadUrl:** adjust fedora-rhel mapping based on official documentation ([4031b74](https://github.com/typegoose/mongodb-memory-server/commit/4031b740318b897db2bdd346a0be81d372b3431d)), closes [#928](https://github.com/typegoose/mongodb-memory-server/issues/928)
* **MongoBinaryDownloadUrl:** support rhel93 binaries ([dd66037](https://github.com/typegoose/mongodb-memory-server/commit/dd66037aad37abc8e36bb5f0d49e6f70b7251ecb))

### Fixes

* add more retryable status and error codes during downloads ([#936](https://github.com/typegoose/mongodb-memory-server/issues/936)) ([dc82f62](https://github.com/typegoose/mongodb-memory-server/commit/dc82f62ec196f0bbf0044bbcce1c5da6b3b8b6f0))
* add retry logic for downloads with configurable retries and backoff ([27c7d71](https://github.com/typegoose/mongodb-memory-server/commit/27c7d711473833c40024fd822d55eedc7be5d2c3))
* **errors:** add more properties to "DownloadError" ([45007b1](https://github.com/typegoose/mongodb-memory-server/commit/45007b184e6456fe88e9d859cc01e719d13a7442)), closes [#929](https://github.com/typegoose/mongodb-memory-server/issues/929)
* **MongoBinaryDownload::attempDownload:** add experimental feature "EXP_RESUME_DOWNLOAD" ([185c840](https://github.com/typegoose/mongodb-memory-server/commit/185c8402f0728241dd58b8281db2c455137e3532))
* **MongoBinaryDownload::download:** print full error object to debug logs ([b907cb0](https://github.com/typegoose/mongodb-memory-server/commit/b907cb055f555d0c3ee6d94adb11d6aa8b7f4065))
* **MongoBinaryDownload:** add tests for httpDownload ([bbdad60](https://github.com/typegoose/mongodb-memory-server/commit/bbdad60ee1de5eacc11ef82e40fec0575304c11a))
* use DownloadError on max retries exceeded ([b90e086](https://github.com/typegoose/mongodb-memory-server/commit/b90e086c3be6ba49a0ca3dcf51b265bcf9d15a5f))

### Style

* **utils.test:** remove random non-error "ts-expect-error" ([873aa6b](https://github.com/typegoose/mongodb-memory-server/commit/873aa6b457c21e11b9ca8f2d7003521597693e84))

### Dependencies

* **debug:** upgrade to version 4.4.1 ([93b56dd](https://github.com/typegoose/mongodb-memory-server/commit/93b56dd5b58c787a5a3675972e4b3ebca51bc9a9))
* **https-proxy-agent:** upgrade to version 7.0.6 ([39a3393](https://github.com/typegoose/mongodb-memory-server/commit/39a33935ba733759e499e0758e469b53f28f3197))
* **semver:** upgrade to version 7.7.2 ([b7140b1](https://github.com/typegoose/mongodb-memory-server/commit/b7140b1d61e4e7c14ecf4e27501df3cd7a4d66bd))
* **tslib:** upgrade to version 2.8.1 ([a94d970](https://github.com/typegoose/mongodb-memory-server/commit/a94d970eaa5fdc9a074d074e1f109ca246fdbb48))
* **yauzl:** upgrade to version 3.2.0 ([25b2619](https://github.com/typegoose/mongodb-memory-server/commit/25b2619fcfc1d6ea4f79b6ec48db413172014390))

### Dev-Dependencies

* **@types/jest:** upgrade to version 29.5.14 ([5d8ae09](https://github.com/typegoose/mongodb-memory-server/commit/5d8ae09dc829d0a36ed665fd7a7d08943a0a3e39))
* **@types/semver:** upgrade to version 7.7.0 ([fed0d70](https://github.com/typegoose/mongodb-memory-server/commit/fed0d7030664faaab3def72db778bfcf1ac3c500))
* **@types/tar-stream:** upgrade to version 3.1.4 ([1b2cba4](https://github.com/typegoose/mongodb-memory-server/commit/1b2cba46c60c60d21896c1dd56564bcb554e4076))
* **@types/yazl:** upgrade to version 3.3.0 ([d946c4a](https://github.com/typegoose/mongodb-memory-server/commit/d946c4a1759fdef41485d8e5782676306f669060))
* **eslint-plugin-prettier:** upgrade to version 5.5.0 ([7452a8d](https://github.com/typegoose/mongodb-memory-server/commit/7452a8d33f06d4bb2747ca9ad07ae2eacb327239))
* **prettier:** upgrade to version 3.6.0 ([39fe52f](https://github.com/typegoose/mongodb-memory-server/commit/39fe52f92e1874c9557763203ff9d17323451698))
* **ts-jest:** upgrade to version 29.4.0 ([600b708](https://github.com/typegoose/mongodb-memory-server/commit/600b7082a0d6a1f0eff29886aaf6af76435ea7f6))
* **yazl:** upgrade to version 3.3.1 ([4be97b1](https://github.com/typegoose/mongodb-memory-server/commit/4be97b157bfa407331f0b55e65f11bc169565aa9))

## [10.2.0-beta.6](https://github.com/typegoose/mongodb-memory-server/compare/v10.2.0-beta.5...v10.2.0-beta.6) (2025-07-17)

### Fixes

* **MongoBinaryDownload:** add tests for httpDownload ([bbdad60](https://github.com/typegoose/mongodb-memory-server/commit/bbdad60ee1de5eacc11ef82e40fec0575304c11a))

## [10.2.0-beta.5](https://github.com/typegoose/mongodb-memory-server/compare/v10.2.0-beta.4...v10.2.0-beta.5) (2025-07-17)

### Fixes

* **errors:** add more properties to "DownloadError" ([45007b1](https://github.com/typegoose/mongodb-memory-server/commit/45007b184e6456fe88e9d859cc01e719d13a7442)), closes [#929](https://github.com/typegoose/mongodb-memory-server/issues/929)
* **MongoBinaryDownload::attempDownload:** add experimental feature "EXP_RESUME_DOWNLOAD" ([185c840](https://github.com/typegoose/mongodb-memory-server/commit/185c8402f0728241dd58b8281db2c455137e3532))
* **MongoBinaryDownload::download:** print full error object to debug logs ([b907cb0](https://github.com/typegoose/mongodb-memory-server/commit/b907cb055f555d0c3ee6d94adb11d6aa8b7f4065))

## [10.2.0-beta.4](https://github.com/typegoose/mongodb-memory-server/compare/v10.2.0-beta.3...v10.2.0-beta.4) (2025-07-15)

### Fixes

* add more retryable status and error codes during downloads ([#936](https://github.com/typegoose/mongodb-memory-server/issues/936)) ([dc82f62](https://github.com/typegoose/mongodb-memory-server/commit/dc82f62ec196f0bbf0044bbcce1c5da6b3b8b6f0))

## [10.2.0-beta.3](https://github.com/typegoose/mongodb-memory-server/compare/v10.2.0-beta.2...v10.2.0-beta.3) (2025-07-14)

### Fixes

* add retry logic for downloads with configurable retries and backoff ([27c7d71](https://github.com/typegoose/mongodb-memory-server/commit/27c7d711473833c40024fd822d55eedc7be5d2c3))
* use DownloadError on max retries exceeded ([b90e086](https://github.com/typegoose/mongodb-memory-server/commit/b90e086c3be6ba49a0ca3dcf51b265bcf9d15a5f))

## [10.2.0-beta.2](https://github.com/typegoose/mongodb-memory-server/compare/v10.2.0-beta.1...v10.2.0-beta.2) (2025-06-24)

### Reverts

* Revert "deps(mongodb): upgrade to version 6.17.0" ([beba000](https://github.com/typegoose/mongodb-memory-server/commit/beba000f98072e425004bc686545dd074ed20e07))

## [10.2.0-beta.1](https://github.com/typegoose/mongodb-memory-server/compare/v10.1.4...v10.2.0-beta.1) (2025-06-24)

### Features

* **MongoBinaryDownloadUrl:** adjust fedora-rhel mapping based on official documentation ([4031b74](https://github.com/typegoose/mongodb-memory-server/commit/4031b740318b897db2bdd346a0be81d372b3431d)), closes [#928](https://github.com/typegoose/mongodb-memory-server/issues/928)
* **MongoBinaryDownloadUrl:** support rhel93 binaries ([dd66037](https://github.com/typegoose/mongodb-memory-server/commit/dd66037aad37abc8e36bb5f0d49e6f70b7251ecb))

### Style

* **utils.test:** remove random non-error "ts-expect-error" ([873aa6b](https://github.com/typegoose/mongodb-memory-server/commit/873aa6b457c21e11b9ca8f2d7003521597693e84))

### Dependencies

* **debug:** upgrade to version 4.4.1 ([93b56dd](https://github.com/typegoose/mongodb-memory-server/commit/93b56dd5b58c787a5a3675972e4b3ebca51bc9a9))
* **https-proxy-agent:** upgrade to version 7.0.6 ([39a3393](https://github.com/typegoose/mongodb-memory-server/commit/39a33935ba733759e499e0758e469b53f28f3197))
* **mongodb:** upgrade to version 6.17.0 ([76b6d66](https://github.com/typegoose/mongodb-memory-server/commit/76b6d660f71711c537a52ab9c8e0607f909c1c5d))
* **semver:** upgrade to version 7.7.2 ([b7140b1](https://github.com/typegoose/mongodb-memory-server/commit/b7140b1d61e4e7c14ecf4e27501df3cd7a4d66bd))
* **tslib:** upgrade to version 2.8.1 ([a94d970](https://github.com/typegoose/mongodb-memory-server/commit/a94d970eaa5fdc9a074d074e1f109ca246fdbb48))
* **yauzl:** upgrade to version 3.2.0 ([25b2619](https://github.com/typegoose/mongodb-memory-server/commit/25b2619fcfc1d6ea4f79b6ec48db413172014390))

### Dev-Dependencies

* **@types/jest:** upgrade to version 29.5.14 ([5d8ae09](https://github.com/typegoose/mongodb-memory-server/commit/5d8ae09dc829d0a36ed665fd7a7d08943a0a3e39))
* **@types/semver:** upgrade to version 7.7.0 ([fed0d70](https://github.com/typegoose/mongodb-memory-server/commit/fed0d7030664faaab3def72db778bfcf1ac3c500))
* **@types/tar-stream:** upgrade to version 3.1.4 ([1b2cba4](https://github.com/typegoose/mongodb-memory-server/commit/1b2cba46c60c60d21896c1dd56564bcb554e4076))
* **@types/yazl:** upgrade to version 3.3.0 ([d946c4a](https://github.com/typegoose/mongodb-memory-server/commit/d946c4a1759fdef41485d8e5782676306f669060))
* **eslint-plugin-prettier:** upgrade to version 5.5.0 ([7452a8d](https://github.com/typegoose/mongodb-memory-server/commit/7452a8d33f06d4bb2747ca9ad07ae2eacb327239))
* **prettier:** upgrade to version 3.6.0 ([39fe52f](https://github.com/typegoose/mongodb-memory-server/commit/39fe52f92e1874c9557763203ff9d17323451698))
* **ts-jest:** upgrade to version 29.4.0 ([600b708](https://github.com/typegoose/mongodb-memory-server/commit/600b7082a0d6a1f0eff29886aaf6af76435ea7f6))
* **yazl:** upgrade to version 3.3.1 ([4be97b1](https://github.com/typegoose/mongodb-memory-server/commit/4be97b157bfa407331f0b55e65f11bc169565aa9))

## [10.1.4](https://github.com/typegoose/mongodb-memory-server/compare/v10.1.3...v10.1.4) (2025-02-20)


### Fixes

* **MongoInstance::_launchKiller:** set "execArgv" to a empty array ([af01d86](https://github.com/typegoose/mongodb-memory-server/commit/af01d86d043a19d362e88be23a96f85d79e4450a)), closes [#912](https://github.com/typegoose/mongodb-memory-server/issues/912)

## [10.1.4-beta.1](https://github.com/typegoose/mongodb-memory-server/compare/v10.1.3...v10.1.4-beta.1) (2025-02-04)


### Fixes

* **MongoInstance::_launchKiller:** set "execArgv" to a empty array ([af01d86](https://github.com/typegoose/mongodb-memory-server/commit/af01d86d043a19d362e88be23a96f85d79e4450a)), closes [#912](https://github.com/typegoose/mongodb-memory-server/issues/912)

## [10.1.3](https://github.com/typegoose/mongodb-memory-server/compare/v10.1.2...v10.1.3) (2024-12-30)


### Fixes

* **DryMongoBinary::getPath:** always absoluteize System_Binary path ([c0975c3](https://github.com/typegoose/mongodb-memory-server/commit/c0975c32a273c452c7e4353096f48e1addec8460))
* **MongoBinary::getPath:** check that "stdout" actually exists ([613e670](https://github.com/typegoose/mongodb-memory-server/commit/613e6704db78c423afbafc3b88301f6f4ea34d8d)), closes [#742](https://github.com/typegoose/mongodb-memory-server/issues/742) [#issuecomment-2528284865](https://github.com/typegoose/mongodb-memory-server/issues/issuecomment-2528284865)
* **MongoBinary:** dont execute systembinary "--version" cmd if version check is false ([03c8412](https://github.com/typegoose/mongodb-memory-server/commit/03c84129a9a58c9d7325d127eea6fb18b18de461))

## [10.1.3-beta.1](https://github.com/typegoose/mongodb-memory-server/compare/v10.1.2...v10.1.3-beta.1) (2024-12-09)


### Fixes

* **DryMongoBinary::getPath:** always absoluteize System_Binary path ([c0975c3](https://github.com/typegoose/mongodb-memory-server/commit/c0975c32a273c452c7e4353096f48e1addec8460))
* **MongoBinary::getPath:** check that "stdout" actually exists ([613e670](https://github.com/typegoose/mongodb-memory-server/commit/613e6704db78c423afbafc3b88301f6f4ea34d8d)), closes [#742](https://github.com/typegoose/mongodb-memory-server/issues/742) [#issuecomment-2528284865](https://github.com/typegoose/mongodb-memory-server/issues/issuecomment-2528284865)
* **MongoBinary:** dont execute systembinary "--version" cmd if version check is false ([03c8412](https://github.com/typegoose/mongodb-memory-server/commit/03c84129a9a58c9d7325d127eea6fb18b18de461))

## [10.1.2](https://github.com/typegoose/mongodb-memory-server/compare/v10.1.1...v10.1.2) (2024-10-11)


### Fixes

* **MongoBinaryDownloadUrl:** refactor fedora handling to pass through to rhel ([31b4696](https://github.com/typegoose/mongodb-memory-server/commit/31b469642a8decf7d818da78ab89e5c0745a0b48)), closes [#893](https://github.com/typegoose/mongodb-memory-server/issues/893)


### Refactor

* **MongoBinaryDownloadUrl::getFedoraVersionString:** change to use "else if" chain ([194df6f](https://github.com/typegoose/mongodb-memory-server/commit/194df6f7ed5a3f3d9f031a7d0526f71c460a533c))

## [10.1.1](https://github.com/typegoose/mongodb-memory-server/compare/v10.1.0...v10.1.1) (2024-10-10)


### Fixes

* **MongoBinaryDownloadUrl:** fix rhel8 handling for newer versions ([8c20624](https://github.com/typegoose/mongodb-memory-server/commit/8c20624e08244a98213b75198785b33041f2df57)), closes [#893](https://github.com/typegoose/mongodb-memory-server/issues/893)

## [10.1.0](https://github.com/typegoose/mongodb-memory-server/compare/v10.0.1...v10.1.0) (2024-10-09)


### Features

* **MongoBinaryDownloadUrl:** support ubuntu 2404 & 8.0.0 ([1a88c37](https://github.com/typegoose/mongodb-memory-server/commit/1a88c37e7b0a019e152dc493d25256d0b2f3e536))
* **resolveConfig:** update default binary version to 7.0.14 ([946e78e](https://github.com/typegoose/mongodb-memory-server/commit/946e78e761c5b10952a5c35c87fa477fdf83a825))


### Dependencies

* **debug:** upgrade to version 4.3.7 ([d537118](https://github.com/typegoose/mongodb-memory-server/commit/d5371181390518e2ad87a3312556ffc183c542cc))
* **follow-redirects:** upgrade to version 1.15.9 ([a762dd4](https://github.com/typegoose/mongodb-memory-server/commit/a762dd4dbbf9ea922f2726151ff2d77e02582c6d))
* **mongodb:** upgrade to version 6.9.0 ([3d4f898](https://github.com/typegoose/mongodb-memory-server/commit/3d4f89876cc43eab6c7ed96c97f3b224f2e78e10))
* **tslib:** upgrade to version 2.7.0 ([2b702d1](https://github.com/typegoose/mongodb-memory-server/commit/2b702d120ef626a53f730f7cfe26f03d925c2657))


### Dev-Dependencies

* **@types/jest:** upgrade to version 29.5.13 ([4395d50](https://github.com/typegoose/mongodb-memory-server/commit/4395d50f3e15845546240c1b9ce433a9493f948b))
* **rimraf:** upgrade to version 5.0.10 ([52420ba](https://github.com/typegoose/mongodb-memory-server/commit/52420ba2f629eb62bf0bfa336867a88584d287fe))
* **test-jest:** upgrade to version 29.2.5 ([8fa6918](https://github.com/typegoose/mongodb-memory-server/commit/8fa69188579bb4de24b4ffdec00451e9016385a1))

## [10.0.1](https://github.com/typegoose/mongodb-memory-server/compare/v10.0.0...v10.0.1) (2024-09-21)


### Fixes

* **getport:** check new port against cache ([b70d868](https://github.com/typegoose/mongodb-memory-server/commit/b70d868cf5b6766e751ef6fec53e8e4ccccd1de6)), closes [#883](https://github.com/typegoose/mongodb-memory-server/issues/883)
* **getport:** update cache time when last used ([a332b49](https://github.com/typegoose/mongodb-memory-server/commit/a332b491b173d9d3b03578c9f6bcd46fecbaa6d7)), closes [#883](https://github.com/typegoose/mongodb-memory-server/issues/883)

## [10.0.1-beta.1](https://github.com/typegoose/mongodb-memory-server/compare/v10.0.0...v10.0.1-beta.1) (2024-08-03)


### Fixes

* **getport:** check new port against cache ([b70d868](https://github.com/typegoose/mongodb-memory-server/commit/b70d868cf5b6766e751ef6fec53e8e4ccccd1de6)), closes [#883](https://github.com/typegoose/mongodb-memory-server/issues/883)
* **getport:** update cache time when last used ([a332b49](https://github.com/typegoose/mongodb-memory-server/commit/a332b491b173d9d3b03578c9f6bcd46fecbaa6d7)), closes [#883](https://github.com/typegoose/mongodb-memory-server/issues/883)

## [10.0.0](https://github.com/typegoose/mongodb-memory-server/compare/v9.4.1...v10.0.0) (2024-07-18)


### ⚠ BREAKING CHANGES

* **resolveConfig:** Default binary version is now "7.0.11"
* **resolveConfig:** Default binary version is now "7.0.9"
* **tsconfig:** potentially breaking change upgrading "target" to "es2021" in tsconfig
* Lowest supported NodeJS version is now 16.20.1

* **tsconfig:** update "target" to "es2021" ([abde8ca](https://github.com/typegoose/mongodb-memory-server/commit/abde8ca2ff2ebc077666d496520b3ce0f684ef99))


### Features

* add support for "Explicit Resource Management" ([ab7a73c](https://github.com/typegoose/mongodb-memory-server/commit/ab7a73c14fa80e51ec407d08b120b4ae6ee77ece)), closes [#794](https://github.com/typegoose/mongodb-memory-server/issues/794)
* **getport:** use net0listen by default ([887f1a1](https://github.com/typegoose/mongodb-memory-server/commit/887f1a1e932a8993ef3fd69cf1f65b700c89a77b)), closes [#827](https://github.com/typegoose/mongodb-memory-server/issues/827)
* **index:** also top-level export "DryMongoBinary" and all errors ([d11abaa](https://github.com/typegoose/mongodb-memory-server/commit/d11abaaa9e7207756bd6d599b2455e7d5761f638))
* **MongoMemoryServer:** allow setting if port generation is enabeld or not ([6c4daed](https://github.com/typegoose/mongodb-memory-server/commit/6c4daedf82ab86920037c5bb1dd2a15ba4031bbe)), closes [#816](https://github.com/typegoose/mongodb-memory-server/issues/816)
* **resolveConfig:** update default binary version to 7.x ([9d569ac](https://github.com/typegoose/mongodb-memory-server/commit/9d569ac63e7f6bd729e0d98254226f4ed18acb0a))
* **resolveConfig:** update default binary version to 7.x ([2436d63](https://github.com/typegoose/mongodb-memory-server/commit/2436d6300bd863efa3300103a3223d3849d0bda3))
* set lowest supported nodejs version to 16.20.1 ([30b302e](https://github.com/typegoose/mongodb-memory-server/commit/30b302e5518c3df92c4b229035b2b229639dfb3c)), closes [#805](https://github.com/typegoose/mongodb-memory-server/issues/805)


### Fixes

* **MongoBinaryDownloadUrl:** add mapping for Linux Mint 22 ([2ffc024](https://github.com/typegoose/mongodb-memory-server/commit/2ffc024ab6608d2f2d7da230f5ddf7dc4bbf4065))
* **MongoBinaryDownloadUrl:** change default elementary version to 7 ([ecc4ffe](https://github.com/typegoose/mongodb-memory-server/commit/ecc4ffe2bbf47f3a2cd196d2ffa9a0e22aa4c94d))
* **MongoBinaryDownloadUrl:** change default mint version to 21 ([df97ea8](https://github.com/typegoose/mongodb-memory-server/commit/df97ea8f9edfb97c24a53f9bc6638697df70d85e))
* remove deprecated boolean cleanup argument (stop / cleanup) ([eef706f](https://github.com/typegoose/mongodb-memory-server/commit/eef706f7fef6ffe5caa0f0f8b3b99b168d8d7d2a))


### Style

* **MongoMemoryReplSet:** fix lint ([bd8941b](https://github.com/typegoose/mongodb-memory-server/commit/bd8941b331eec9f4317ef8456142db69917528a3))


### Dependencies

* **@types/node:** upgrade to version 16.11.7 ([c8a008a](https://github.com/typegoose/mongodb-memory-server/commit/c8a008aacff628ac0e8e7c77683987659411c8a1))
* **async-mutex:** upgrade to version 0.5.0 ([c9f45c9](https://github.com/typegoose/mongodb-memory-server/commit/c9f45c9f032918cbdc73c0953ecc95936c246bac))
* **https-proxy-agent:** upgrade to version 7.0.5 ([4d5be4d](https://github.com/typegoose/mongodb-memory-server/commit/4d5be4d5aa8330ab73dff8d0c1f5d0090b20e39b))
* **mongodb:** upgrade to version 6.7.0 ([57e575c](https://github.com/typegoose/mongodb-memory-server/commit/57e575ce49344c79f2ae337da6aa43ada6738746)), closes [#804](https://github.com/typegoose/mongodb-memory-server/issues/804)
* **semver:** upgrade to version 7.6.3 ([100e571](https://github.com/typegoose/mongodb-memory-server/commit/100e57100c1c334c29a38ab8efaed0f7942e3235))
* **typescript:** upgrade to version 5.3.3 ([329d79e](https://github.com/typegoose/mongodb-memory-server/commit/329d79e484bf2f7da9e3d0ccf991bdd2cb4282a8))


### Dev-Dependencies

* **@typescript-eslint/*:** upgrade to version 6.21.0 ([b4055a7](https://github.com/typegoose/mongodb-memory-server/commit/b4055a715ee369f675a15059fb88cef38c1aec39))
* **eslint-plugin-prettier:** upgrade to version 5.2.1 ([15990b9](https://github.com/typegoose/mongodb-memory-server/commit/15990b97549a6a8632bab303d4a10204d91d90fe))
* **lint-staged:** upgrade to version 14.0.1 ([0f54d29](https://github.com/typegoose/mongodb-memory-server/commit/0f54d29fe8ab51a806bb103609a7e34346c2b220))
* **prettier:** upgrade to version 3.3.0 ([fe1d62d](https://github.com/typegoose/mongodb-memory-server/commit/fe1d62d4fff1849e3fd76d0db745337e6fb693d7))
* **prettier:** upgrade to version 3.3.3 ([5aba25a](https://github.com/typegoose/mongodb-memory-server/commit/5aba25a865f08184b1db1f433c35f35242d91b55))
* **rimraf:** upgrade to version 5.0.9 ([a6d706a](https://github.com/typegoose/mongodb-memory-server/commit/a6d706a75ab9560beb8c8053ddb7fabf42c453ca))
* **ts-jest:** upgrade to version 29.2.2 ([839e432](https://github.com/typegoose/mongodb-memory-server/commit/839e432c19d878cc4260114604274a439d0be626))
* **typedoc:** upgrade to version 0.25.13 ([0775c60](https://github.com/typegoose/mongodb-memory-server/commit/0775c60f14ec3026849ed70d24535c013b1d3aa7))

## [10.0.0-beta.5](https://github.com/typegoose/mongodb-memory-server/compare/v10.0.0-beta.4...v10.0.0-beta.5) (2024-07-18)


### ⚠ BREAKING CHANGES

* **resolveConfig:** Default binary version is now "7.0.11"

### Features

* **resolveConfig:** update default binary version to 7.x ([9d569ac](https://github.com/typegoose/mongodb-memory-server/commit/9d569ac63e7f6bd729e0d98254226f4ed18acb0a))

## [10.0.0-beta.4](https://github.com/typegoose/mongodb-memory-server/compare/v10.0.0-beta.3...v10.0.0-beta.4) (2024-07-18)


### Features

* **index:** also top-level export "DryMongoBinary" and all errors ([d11abaa](https://github.com/typegoose/mongodb-memory-server/commit/d11abaaa9e7207756bd6d599b2455e7d5761f638))


### Dependencies

* **semver:** upgrade to version 7.6.3 ([100e571](https://github.com/typegoose/mongodb-memory-server/commit/100e57100c1c334c29a38ab8efaed0f7942e3235))


### Dev-Dependencies

* **eslint-plugin-prettier:** upgrade to version 5.2.1 ([15990b9](https://github.com/typegoose/mongodb-memory-server/commit/15990b97549a6a8632bab303d4a10204d91d90fe))

## [10.0.0-beta.3](https://github.com/typegoose/mongodb-memory-server/compare/v10.0.0-beta.2...v10.0.0-beta.3) (2024-07-15)


### Features

* **MongoMemoryServer:** allow setting if port generation is enabeld or not ([6c4daed](https://github.com/typegoose/mongodb-memory-server/commit/6c4daedf82ab86920037c5bb1dd2a15ba4031bbe)), closes [#816](https://github.com/typegoose/mongodb-memory-server/issues/816)


### Style

* **MongoMemoryReplSet:** fix lint ([bd8941b](https://github.com/typegoose/mongodb-memory-server/commit/bd8941b331eec9f4317ef8456142db69917528a3))


### Dependencies

* **https-proxy-agent:** upgrade to version 7.0.5 ([4d5be4d](https://github.com/typegoose/mongodb-memory-server/commit/4d5be4d5aa8330ab73dff8d0c1f5d0090b20e39b))


### Dev-Dependencies

* **prettier:** upgrade to version 3.3.3 ([5aba25a](https://github.com/typegoose/mongodb-memory-server/commit/5aba25a865f08184b1db1f433c35f35242d91b55))
* **rimraf:** upgrade to version 5.0.9 ([a6d706a](https://github.com/typegoose/mongodb-memory-server/commit/a6d706a75ab9560beb8c8053ddb7fabf42c453ca))
* **ts-jest:** upgrade to version 29.2.2 ([839e432](https://github.com/typegoose/mongodb-memory-server/commit/839e432c19d878cc4260114604274a439d0be626))

## [10.0.0-beta.2](https://github.com/typegoose/mongodb-memory-server/compare/v10.0.0-beta.1...v10.0.0-beta.2) (2024-07-13)


### Fixes

* **MongoBinaryDownloadUrl:** add mapping for Linux Mint 22 ([2ffc024](https://github.com/typegoose/mongodb-memory-server/commit/2ffc024ab6608d2f2d7da230f5ddf7dc4bbf4065))
* trigger release ([8c48020](https://github.com/typegoose/mongodb-memory-server/commit/8c48020816fe19fbcc4f886fcfb96302eaff8714))

## [10.0.0-beta.1](https://github.com/nodkz/mongodb-memory-server/compare/v9.4.0...v10.0.0-beta.1) (2024-06-24)


### ⚠ BREAKING CHANGES

* **resolveConfig:** Default binary version is now "7.0.9"
* **tsconfig:** potentially breaking change upgrading "target" to "es2021" in tsconfig
* Lowest supported NodeJS version is now 16.20.1

* **tsconfig:** update "target" to "es2021" ([abde8ca](https://github.com/nodkz/mongodb-memory-server/commit/abde8ca2ff2ebc077666d496520b3ce0f684ef99))


### Features

* add support for "Explicit Resource Management" ([ab7a73c](https://github.com/nodkz/mongodb-memory-server/commit/ab7a73c14fa80e51ec407d08b120b4ae6ee77ece)), closes [#794](https://github.com/nodkz/mongodb-memory-server/issues/794)
* **getport:** use net0listen by default ([887f1a1](https://github.com/nodkz/mongodb-memory-server/commit/887f1a1e932a8993ef3fd69cf1f65b700c89a77b)), closes [#827](https://github.com/nodkz/mongodb-memory-server/issues/827)
* **resolveConfig:** update default binary version to 7.x ([2436d63](https://github.com/nodkz/mongodb-memory-server/commit/2436d6300bd863efa3300103a3223d3849d0bda3))
* set lowest supported nodejs version to 16.20.1 ([30b302e](https://github.com/nodkz/mongodb-memory-server/commit/30b302e5518c3df92c4b229035b2b229639dfb3c)), closes [#805](https://github.com/nodkz/mongodb-memory-server/issues/805)


### Fixes

* **MongoBinaryDownloadUrl:** change default elementary version to 7 ([ecc4ffe](https://github.com/nodkz/mongodb-memory-server/commit/ecc4ffe2bbf47f3a2cd196d2ffa9a0e22aa4c94d))
* **MongoBinaryDownloadUrl:** change default mint version to 21 ([df97ea8](https://github.com/nodkz/mongodb-memory-server/commit/df97ea8f9edfb97c24a53f9bc6638697df70d85e))
* remove deprecated boolean cleanup argument (stop / cleanup) ([eef706f](https://github.com/nodkz/mongodb-memory-server/commit/eef706f7fef6ffe5caa0f0f8b3b99b168d8d7d2a))


### Dependencies

* **@types/node:** upgrade to version 16.11.7 ([c8a008a](https://github.com/nodkz/mongodb-memory-server/commit/c8a008aacff628ac0e8e7c77683987659411c8a1))
* **async-mutex:** upgrade to version 0.5.0 ([c9f45c9](https://github.com/nodkz/mongodb-memory-server/commit/c9f45c9f032918cbdc73c0953ecc95936c246bac))
* **mongodb:** upgrade to version 6.7.0 ([57e575c](https://github.com/nodkz/mongodb-memory-server/commit/57e575ce49344c79f2ae337da6aa43ada6738746)), closes [#804](https://github.com/nodkz/mongodb-memory-server/issues/804)
* **typescript:** upgrade to version 5.3.3 ([329d79e](https://github.com/nodkz/mongodb-memory-server/commit/329d79e484bf2f7da9e3d0ccf991bdd2cb4282a8))


### Dev-Dependencies

* **@typescript-eslint/*:** upgrade to version 6.21.0 ([b4055a7](https://github.com/nodkz/mongodb-memory-server/commit/b4055a715ee369f675a15059fb88cef38c1aec39))
* **lint-staged:** upgrade to version 14.0.1 ([0f54d29](https://github.com/nodkz/mongodb-memory-server/commit/0f54d29fe8ab51a806bb103609a7e34346c2b220))
* **prettier:** upgrade to version 3.3.0 ([fe1d62d](https://github.com/nodkz/mongodb-memory-server/commit/fe1d62d4fff1849e3fd76d0db745337e6fb693d7))
* **typedoc:** upgrade to version 0.25.13 ([0775c60](https://github.com/nodkz/mongodb-memory-server/commit/0775c60f14ec3026849ed70d24535c013b1d3aa7))

## [9.5.0](https://github.com/typegoose/mongodb-memory-server/compare/v9.4.1...v9.5.0) (2024-11-01)


### Fixes

* **MongoBinaryDownloadUrl:** add mapping for Linux Mint 22 ([1589600](https://github.com/typegoose/mongodb-memory-server/commit/15896008f07ca4cbf74fb64bee8cd374efe1a138))
* **MongoBinaryDownloadUrl:** fix rhel8 handling for newer versions ([48e99bf](https://github.com/typegoose/mongodb-memory-server/commit/48e99bf9fe9bc704e89d391acdaa70d10a59a5a2)), closes [#893](https://github.com/typegoose/mongodb-memory-server/issues/893)
* **MongoBinaryDownloadUrl:** refactor fedora handling to pass through to rhel ([5a0dfd3](https://github.com/typegoose/mongodb-memory-server/commit/5a0dfd32e19c8978fc54d43ee393121c42e6adef)), closes [#893](https://github.com/typegoose/mongodb-memory-server/issues/893)


### Refactor

* **MongoBinaryDownloadUrl::getFedoraVersionString:** change to use "else if" chain ([4eb1440](https://github.com/typegoose/mongodb-memory-server/commit/4eb1440282570300a4132b96467eed12a6c67cad))


### Dependencies

* **debug:** upgrade to version 4.3.7 ([2acbfca](https://github.com/typegoose/mongodb-memory-server/commit/2acbfcadd48645bbd4f0ff9bce828b459dcb867d))
* **follow-redirects:** upgrade to version 1.15.9 ([62ed4cb](https://github.com/typegoose/mongodb-memory-server/commit/62ed4cba4dc83b0f4e0c619699b5e40163ebae0b))
* **https-proxy-agent:** upgrade to version 7.0.5 ([fab84c2](https://github.com/typegoose/mongodb-memory-server/commit/fab84c277e609e200f6cbdb1debe1e5ae7d53f4b))
* **semver:** upgrade to version 7.6.3 ([816472f](https://github.com/typegoose/mongodb-memory-server/commit/816472f73f9ffcc76389345f568f66317a12a3f3))


### Dev-Dependencies

* **@types/jest:** upgrade to version 29.5.14 ([bc77bba](https://github.com/typegoose/mongodb-memory-server/commit/bc77bba5ac601b086ce17ed4a6290912b3c59c33))
* **eslint-plugin-prettier:** upgrade to version 5.2.1 ([dcf2049](https://github.com/typegoose/mongodb-memory-server/commit/dcf20492776499ebdb40b158ee5ea800448aae3a))
* **prettier:** upgrade to version 3.3.3 ([ca8af06](https://github.com/typegoose/mongodb-memory-server/commit/ca8af06113e0fcfbfd8d850632dbeab8bd7a169e))
* **rimraf:** upgrade to version 5.0.10 ([749e099](https://github.com/typegoose/mongodb-memory-server/commit/749e099da09d46f4a11f21e2f7dacc28e0df2432))
* **ts-jest:** upgrade to version 29.2.5 ([a2fa28e](https://github.com/typegoose/mongodb-memory-server/commit/a2fa28e35009275f2c810df7344b38e7e3ba563a))

## [9.4.1](https://github.com/typegoose/mongodb-memory-server/compare/v9.4.0...v9.4.1) (2024-07-13)


### Fixes

* trigger release ([8c48020](https://github.com/typegoose/mongodb-memory-server/commit/8c48020816fe19fbcc4f886fcfb96302eaff8714))

## [9.4.0](https://github.com/nodkz/mongodb-memory-server/compare/v9.3.0...v9.4.0) (2024-06-24)


### Fixes

* **MongoMemoryReplSet:** dont warn unless storage engine is set explicitly ([582bf0a](https://github.com/nodkz/mongodb-memory-server/commit/582bf0ae88ffa7ca66258a96344ed2ce6d5abd18))


### Refactor

* **utils::removeDir:** remove nodejs 12 workaround ([a852513](https://github.com/nodkz/mongodb-memory-server/commit/a852513b615b17179837af76f94aafabe1ea7ab7))


### Dependencies

* **async-mutex:** upgrade to version 0.4.1 ([b67c783](https://github.com/nodkz/mongodb-memory-server/commit/b67c7830b3bfce6e23c03ce36fd4a6fea5112933))
* **debug:** upgrade to version 4.3.5 ([72a0b76](https://github.com/nodkz/mongodb-memory-server/commit/72a0b7665d9d63ff99a052220b89c00b909502f8))
* **mongodb:** upgrade to version 5.9.2 ([4c1ccc9](https://github.com/nodkz/mongodb-memory-server/commit/4c1ccc9572460f658dce044e5481f9dd43a4556b))
* **tslib:** upgrade to version 2.6.3 ([a49993b](https://github.com/nodkz/mongodb-memory-server/commit/a49993b85bb23ecdf90f10f2e73b0a64b096878d))

## [9.4.0-beta.1](https://github.com/nodkz/mongodb-memory-server/compare/v9.3.0...v9.4.0-beta.1) (2024-06-05)


### Fixes

* **MongoMemoryReplSet:** dont warn unless storage engine is set explicitly ([582bf0a](https://github.com/nodkz/mongodb-memory-server/commit/582bf0ae88ffa7ca66258a96344ed2ce6d5abd18))


### Refactor

* **utils::removeDir:** remove nodejs 12 workaround ([a852513](https://github.com/nodkz/mongodb-memory-server/commit/a852513b615b17179837af76f94aafabe1ea7ab7))


### Dependencies

* **async-mutex:** upgrade to version 0.4.1 ([b67c783](https://github.com/nodkz/mongodb-memory-server/commit/b67c7830b3bfce6e23c03ce36fd4a6fea5112933))
* **debug:** upgrade to version 4.3.5 ([72a0b76](https://github.com/nodkz/mongodb-memory-server/commit/72a0b7665d9d63ff99a052220b89c00b909502f8))
* **tslib:** upgrade to version 2.6.3 ([a49993b](https://github.com/nodkz/mongodb-memory-server/commit/a49993b85bb23ecdf90f10f2e73b0a64b096878d))

## [9.3.0](https://github.com/nodkz/mongodb-memory-server/compare/v9.2.0...v9.3.0) (2024-05-30)


### Fixes

* **DryMongoBinary::locateBinary:** check if download-lock still exists ([c600609](https://github.com/nodkz/mongodb-memory-server/commit/c60060977e91cd2c235d86d5ac27d194a7a9e3e3)), closes [#872](https://github.com/nodkz/mongodb-memory-server/issues/872)
* **DryMongoBinary:** resolve modulesCache relative to config options package.json ([be934a0](https://github.com/nodkz/mongodb-memory-server/commit/be934a025d9ae3a02ba617a3a478fd6ed23bca24))


### Refactor

* **utils:** add function "lockfilePath" ([9db479f](https://github.com/nodkz/mongodb-memory-server/commit/9db479f6a90ccb84d278ef8c1465e95455d0999c))


### Dependencies

* **semver:** upgrade to version 7.6.2 ([e101c06](https://github.com/nodkz/mongodb-memory-server/commit/e101c060eebc9d8a4750008d4c5e26c78aa9285a))


### Dev-Dependencies

* **rimraf:** upgrade to version 5.0.7 ([4334a5f](https://github.com/nodkz/mongodb-memory-server/commit/4334a5fd319474474699da6eacfe55776c6e8c11))
* **ts-jest:** upgrade to version 29.1.4 ([f2cf51a](https://github.com/nodkz/mongodb-memory-server/commit/f2cf51ae083ccfba64ac15d000820de9cdd8a976))

## [9.3.0-beta.1](https://github.com/nodkz/mongodb-memory-server/compare/v9.2.1-beta.2...v9.3.0-beta.1) (2024-05-30)


### Dependencies

* **semver:** upgrade to version 7.6.2 ([e101c06](https://github.com/nodkz/mongodb-memory-server/commit/e101c060eebc9d8a4750008d4c5e26c78aa9285a))


### Dev-Dependencies

* **rimraf:** upgrade to version 5.0.7 ([4334a5f](https://github.com/nodkz/mongodb-memory-server/commit/4334a5fd319474474699da6eacfe55776c6e8c11))
* **ts-jest:** upgrade to version 29.1.4 ([f2cf51a](https://github.com/nodkz/mongodb-memory-server/commit/f2cf51ae083ccfba64ac15d000820de9cdd8a976))

## [9.2.1-beta.2](https://github.com/nodkz/mongodb-memory-server/compare/v9.2.1-beta.1...v9.2.1-beta.2) (2024-05-17)


### Fixes

* **DryMongoBinary:** resolve modulesCache relative to config options package.json ([be934a0](https://github.com/nodkz/mongodb-memory-server/commit/be934a025d9ae3a02ba617a3a478fd6ed23bca24))

## [9.2.1-beta.1](https://github.com/nodkz/mongodb-memory-server/compare/v9.2.0...v9.2.1-beta.1) (2024-05-16)


### Fixes

* **DryMongoBinary::locateBinary:** check if download-lock still exists ([c600609](https://github.com/nodkz/mongodb-memory-server/commit/c60060977e91cd2c235d86d5ac27d194a7a9e3e3)), closes [#872](https://github.com/nodkz/mongodb-memory-server/issues/872)


### Refactor

* **utils:** add function "lockfilePath" ([9db479f](https://github.com/nodkz/mongodb-memory-server/commit/9db479f6a90ccb84d278ef8c1465e95455d0999c))

## [9.2.0](https://github.com/nodkz/mongodb-memory-server/compare/v9.1.8...v9.2.0) (2024-04-22)


### Features

* add option "DOWNLOAD_IGNORE_MISSING_HEADER" to ignore missing response-headers ([f3f7764](https://github.com/nodkz/mongodb-memory-server/commit/f3f7764dc2c61bb7897cc340f2a1544d87937461)), closes [#865](https://github.com/nodkz/mongodb-memory-server/issues/865)
* update default-4.2-binary to 4.2.24 ([63fcfc2](https://github.com/nodkz/mongodb-memory-server/commit/63fcfc2d6807c87c160971838e7cde057b6da18a))
* update default-4.4-binary to 4.4.28 ([df5eec0](https://github.com/nodkz/mongodb-memory-server/commit/df5eec0b90f71f56e50df04ef2813576b44f94f2))
* update default-binary to 6.0.14 ([47f2bb3](https://github.com/nodkz/mongodb-memory-server/commit/47f2bb3ba0031a879430872f2f01a08be3a0581c))


### Dependencies

* **https-proxy-agent:** upgrade to version 7.0.4 ([d9dedc4](https://github.com/nodkz/mongodb-memory-server/commit/d9dedc4cdc3896ecf83dcf197f3eac61ad86076d))
* **semver:** upgrade to version 7.6.0 ([d0b50aa](https://github.com/nodkz/mongodb-memory-server/commit/d0b50aa285330d95ba134a328be8ccce7b3be216))
* **tar-stream:** upgrade to version 3.1.7 ([abcebd4](https://github.com/nodkz/mongodb-memory-server/commit/abcebd48c5b4ce8112e51bc5ef832fecf984d4ca))
* **yauzl:** upgrade to version 3.1.3 ([ba90289](https://github.com/nodkz/mongodb-memory-server/commit/ba90289c739c31e80b60b472069682afbdeab898))


### Dev-Dependencies

* **@types/jest:** upgrade to version 29.5.12 ([61ce778](https://github.com/nodkz/mongodb-memory-server/commit/61ce778e35c6baa5a7a8384e7afb21bc3a5826a1))
* **@types/semver:** upgrade to version 7.5.8 ([c042b9a](https://github.com/nodkz/mongodb-memory-server/commit/c042b9a7344c5fa9191c3f420276a2397e5d126b))
* **commitlint*:** upgrade to version 17.8.1 ([08141c8](https://github.com/nodkz/mongodb-memory-server/commit/08141c857c699d1f35687bc3aa2daf08276b4c8f))
* **eslint-config-prettier:** upgrade to version 9.1.0 ([dc3dd4f](https://github.com/nodkz/mongodb-memory-server/commit/dc3dd4f417640453c5f3444b49cd68201d2ba689))
* **eslint-plugin-prettier:** upgrade to version 5.1.3 ([dc49e9c](https://github.com/nodkz/mongodb-memory-server/commit/dc49e9c5acd8c5e22f40037319120086972fd03c))
* **eslint:** upgrade to version 8.57.0 ([cfe19a8](https://github.com/nodkz/mongodb-memory-server/commit/cfe19a8297d4088ae62cd2b6de3cc3676bf419d7))
* **prettier:** upgrade to version 3.2.5 ([b13b13c](https://github.com/nodkz/mongodb-memory-server/commit/b13b13c8e0c1eaca8643dfbaae6387bc5f9706bb))

## [9.2.0-beta.1](https://github.com/nodkz/mongodb-memory-server/compare/v9.1.8...v9.2.0-beta.1) (2024-04-19)


### Features

* add option "DOWNLOAD_IGNORE_MISSING_HEADER" to ignore missing response-headers ([f3f7764](https://github.com/nodkz/mongodb-memory-server/commit/f3f7764dc2c61bb7897cc340f2a1544d87937461)), closes [#865](https://github.com/nodkz/mongodb-memory-server/issues/865)
* update default-4.2-binary to 4.2.24 ([63fcfc2](https://github.com/nodkz/mongodb-memory-server/commit/63fcfc2d6807c87c160971838e7cde057b6da18a))
* update default-4.4-binary to 4.4.28 ([df5eec0](https://github.com/nodkz/mongodb-memory-server/commit/df5eec0b90f71f56e50df04ef2813576b44f94f2))
* update default-binary to 6.0.14 ([47f2bb3](https://github.com/nodkz/mongodb-memory-server/commit/47f2bb3ba0031a879430872f2f01a08be3a0581c))


### Dependencies

* **https-proxy-agent:** upgrade to version 7.0.4 ([d9dedc4](https://github.com/nodkz/mongodb-memory-server/commit/d9dedc4cdc3896ecf83dcf197f3eac61ad86076d))
* **semver:** upgrade to version 7.6.0 ([d0b50aa](https://github.com/nodkz/mongodb-memory-server/commit/d0b50aa285330d95ba134a328be8ccce7b3be216))
* **tar-stream:** upgrade to version 3.1.7 ([abcebd4](https://github.com/nodkz/mongodb-memory-server/commit/abcebd48c5b4ce8112e51bc5ef832fecf984d4ca))
* **yauzl:** upgrade to version 3.1.3 ([ba90289](https://github.com/nodkz/mongodb-memory-server/commit/ba90289c739c31e80b60b472069682afbdeab898))


### Dev-Dependencies

* **@types/jest:** upgrade to version 29.5.12 ([61ce778](https://github.com/nodkz/mongodb-memory-server/commit/61ce778e35c6baa5a7a8384e7afb21bc3a5826a1))
* **@types/semver:** upgrade to version 7.5.8 ([c042b9a](https://github.com/nodkz/mongodb-memory-server/commit/c042b9a7344c5fa9191c3f420276a2397e5d126b))
* **commitlint*:** upgrade to version 17.8.1 ([08141c8](https://github.com/nodkz/mongodb-memory-server/commit/08141c857c699d1f35687bc3aa2daf08276b4c8f))
* **eslint-config-prettier:** upgrade to version 9.1.0 ([dc3dd4f](https://github.com/nodkz/mongodb-memory-server/commit/dc3dd4f417640453c5f3444b49cd68201d2ba689))
* **eslint-plugin-prettier:** upgrade to version 5.1.3 ([dc49e9c](https://github.com/nodkz/mongodb-memory-server/commit/dc49e9c5acd8c5e22f40037319120086972fd03c))
* **eslint:** upgrade to version 8.57.0 ([cfe19a8](https://github.com/nodkz/mongodb-memory-server/commit/cfe19a8297d4088ae62cd2b6de3cc3676bf419d7))
* **prettier:** upgrade to version 3.2.5 ([b13b13c](https://github.com/nodkz/mongodb-memory-server/commit/b13b13c8e0c1eaca8643dfbaae6387bc5f9706bb))

## [9.1.8](https://github.com/nodkz/mongodb-memory-server/compare/v9.1.7...v9.1.8) (2024-03-28)


### Fixes

* **MongoBinaryDownloadUrl:** support Debian 12 (Bookworm) ([#858](https://github.com/nodkz/mongodb-memory-server/issues/858)) ([48dbf43](https://github.com/nodkz/mongodb-memory-server/commit/48dbf434d93f1d184401529d2de6cf7943c13cd5))

## [9.1.7](https://github.com/nodkz/mongodb-memory-server/compare/v9.1.6...v9.1.7) (2024-03-11)


### Fixes

* **MongoBinaryDownloadUrl:** spelling mistake ([#854](https://github.com/nodkz/mongodb-memory-server/issues/854)) ([31ae840](https://github.com/nodkz/mongodb-memory-server/commit/31ae8403dddd2ac0bd82cffdde5a95aa74fa2e31))

## [9.1.6](https://github.com/nodkz/mongodb-memory-server/compare/v9.1.5...v9.1.6) (2024-01-17)


### Fixes

* **MongoBinaryDownloadUrl:** clamp ubuntu-year to highest supported year ([9a29af9](https://github.com/nodkz/mongodb-memory-server/commit/9a29af9032931d5105b0189bcddd4fc09c55048c)), closes [#846](https://github.com/nodkz/mongodb-memory-server/issues/846)
* **MongoBinaryDownloadUrl:** support elementaryos 7 ([064c69e](https://github.com/nodkz/mongodb-memory-server/commit/064c69e860514047fe0a6a12648a00648362d51a))
* **MongoBinaryDownloadUrl:** support linux-mint 21 ([e756164](https://github.com/nodkz/mongodb-memory-server/commit/e7561647bef9fa0fe490e797134d003e03b9d362))

## [9.1.6-beta.1](https://github.com/nodkz/mongodb-memory-server/compare/v9.1.5...v9.1.6-beta.1) (2024-01-17)


### Fixes

* **MongoBinaryDownloadUrl:** clamp ubuntu-year to highest supported year ([9a29af9](https://github.com/nodkz/mongodb-memory-server/commit/9a29af9032931d5105b0189bcddd4fc09c55048c)), closes [#846](https://github.com/nodkz/mongodb-memory-server/issues/846)
* **MongoBinaryDownloadUrl:** support elementaryos 7 ([064c69e](https://github.com/nodkz/mongodb-memory-server/commit/064c69e860514047fe0a6a12648a00648362d51a))
* **MongoBinaryDownloadUrl:** support linux-mint 21 ([e756164](https://github.com/nodkz/mongodb-memory-server/commit/e7561647bef9fa0fe490e797134d003e03b9d362))

## [9.1.5](https://github.com/nodkz/mongodb-memory-server/compare/v9.1.4...v9.1.5) (2024-01-13)


### Fixes

* **getport:** randomize first port using crypto.randomInt ([#844](https://github.com/nodkz/mongodb-memory-server/issues/844)) ([4132dbf](https://github.com/nodkz/mongodb-memory-server/commit/4132dbfc1c0d648d48b6fe0fa7c0f1f77195731a)), closes [#827](https://github.com/nodkz/mongodb-memory-server/issues/827)

## [9.1.4](https://github.com/nodkz/mongodb-memory-server/compare/v9.1.3...v9.1.4) (2024-01-04)


### Fixes

* **MongoMemoryServer::getStartOptions:** coerce version to semver before semver checks ([427531e](https://github.com/nodkz/mongodb-memory-server/commit/427531e1e05c038e457593a89c42c0b0dac02f76)), closes [#841](https://github.com/nodkz/mongodb-memory-server/issues/841)

## [9.1.3](https://github.com/nodkz/mongodb-memory-server/compare/v9.1.2...v9.1.3) (2023-12-12)


### Fixes

* **resolveConfig:** let debug mode be enabled through package.json again ([8ba83c7](https://github.com/nodkz/mongodb-memory-server/commit/8ba83c737e693dda4d4e51c073817ff871a899ac)), closes [#834](https://github.com/nodkz/mongodb-memory-server/issues/834)

## [9.1.2](https://github.com/nodkz/mongodb-memory-server/compare/v9.1.1...v9.1.2) (2023-12-12)


### Fixes

* **postinstallHelper:** set "PREFER_GLOBAL_PATH" if "local" ([9f523de](https://github.com/nodkz/mongodb-memory-server/commit/9f523de82a326a5fd57d170934206540fd17e17e)), closes [#833](https://github.com/nodkz/mongodb-memory-server/issues/833)

## [9.1.1](https://github.com/nodkz/mongodb-memory-server/compare/v9.1.0...v9.1.1) (2023-11-16)


### Reverts

* Revert "chore(website): upgrade docusaurus version to 3.0.0" ([c8f628f](https://github.com/nodkz/mongodb-memory-server/commit/c8f628f2f035e09c73bcc498296a9ef66abd717a))
* Revert "chore(website/yarn.lock): lockfile maintenance" ([96ede53](https://github.com/nodkz/mongodb-memory-server/commit/96ede53ad3fb10dfc277ac8fb2fe2f9285cbc238))

## [9.1.0](https://github.com/nodkz/mongodb-memory-server/compare/v9.0.1...v9.1.0) (2023-11-16)


### Features

* **getport:** add experimental "EXP_NET0LISTEN" option ([631ec28](https://github.com/nodkz/mongodb-memory-server/commit/631ec28c57d533438c91cc608014cb05abdd5c61)), closes [#827](https://github.com/nodkz/mongodb-memory-server/issues/827)
* **MongoBinaryDownloadUrl:** re-work rhel to support 9.0 ([c582829](https://github.com/nodkz/mongodb-memory-server/commit/c5828298382da762e37e69c5d46c781c4b4e591e)), closes [#821](https://github.com/nodkz/mongodb-memory-server/issues/821)
* **MongoDownloadUrl:** add support for amazon linux 2023 ([#826](https://github.com/nodkz/mongodb-memory-server/issues/826)) ([ec1ea68](https://github.com/nodkz/mongodb-memory-server/commit/ec1ea6866cdc793c7168f5d7f004d2b6ce1535af))


### Fixes

* **getport:** ignore "ports.has()" if EXP_NET0LISTEN and port == 0 ([682dac6](https://github.com/nodkz/mongodb-memory-server/commit/682dac6ce3a45517fad393661972b47b1e0d5711))
* **MongoInstance::stop:** should not wait too long to open a connection to ReplSet ([#813](https://github.com/nodkz/mongodb-memory-server/issues/813)) ([668b42a](https://github.com/nodkz/mongodb-memory-server/commit/668b42a1d80ce1f282dea0a8971a0a349e23dc98))


### Style

* **getport:** add log whether "EXP_NET0LISTEN" is active or not ([b309a18](https://github.com/nodkz/mongodb-memory-server/commit/b309a1818742749d96d3c0184e5223fb63bbdcbe))
* **MongoMemoryServer:** log instance started log after assigning port ([4a5eacc](https://github.com/nodkz/mongodb-memory-server/commit/4a5eacc86f8d6665636acda743d67f279266afcb))


### Refactor

* **getport:** use "node:net" over "node:http" ([c065147](https://github.com/nodkz/mongodb-memory-server/commit/c065147750c8c57dfb6be6fbcd55444d2cc7a16e))
* **MongoMemoryServer:** try to acquire port later ([f0385d6](https://github.com/nodkz/mongodb-memory-server/commit/f0385d62a7f6e0808023887f8a041ad29d648254))


### Dependencies

* **mongodb:** upgrade to version 5.9.1 ([d328d65](https://github.com/nodkz/mongodb-memory-server/commit/d328d65451d9ec1d17b043408ad1d3ccaa041ab5))


### Dev-Dependencies

* **@types/debug:** upgrade to version 4.1.10 ([7da745a](https://github.com/nodkz/mongodb-memory-server/commit/7da745a34dbff5aa360cae7c65a5bd3955593d53))
* **@types/debug:** upgrade to version 4.1.12 ([0aa128f](https://github.com/nodkz/mongodb-memory-server/commit/0aa128fbf13cf1849328a61cc481aabacc204c00))
* **@types/follow-redirects:** upgrade to version ([b65e643](https://github.com/nodkz/mongodb-memory-server/commit/b65e6432f7ee355dcd62208cb0a37b56a5dcb3a9))
* **@types/follow-redirects:** upgrade to version 1.14.4 ([d651684](https://github.com/nodkz/mongodb-memory-server/commit/d6516848ed496d31ffe4368d400e0eebd0cfab51))
* **@types/jest:** upgrade to version 29.5.6 ([b8acbb3](https://github.com/nodkz/mongodb-memory-server/commit/b8acbb3a51732765a89d00ba9de886538880fe5b))
* **@types/jest:** upgrade to version 29.5.8 ([f258247](https://github.com/nodkz/mongodb-memory-server/commit/f258247fde923b1647e60825297d4a89fa4c028e))
* **@types/semver:** upgrade to version 7.5.4 ([9d430b9](https://github.com/nodkz/mongodb-memory-server/commit/9d430b9560c5c7628a4e9acd6e07445dadd76879))
* **@types/semver:** upgrade to version 7.5.5 ([c6e3953](https://github.com/nodkz/mongodb-memory-server/commit/c6e3953cfda50dd637ef6312cf9d395dedec6d0b))
* **@types/tar-stream:** upgrade to version 3.1.2 ([5ca4ee3](https://github.com/nodkz/mongodb-memory-server/commit/5ca4ee3be02c8dcb8d168136353a4d0ffa82c792))
* **@types/tar-stream:** upgrade to version 3.1.3 ([ceff457](https://github.com/nodkz/mongodb-memory-server/commit/ceff457bc77cc36b0c5f5effff58266f9cf2bd43))
* **@types/yauzl:** upgrade to version 2.10.2 ([31301dc](https://github.com/nodkz/mongodb-memory-server/commit/31301dc33505a999b119c9dfcb9374beb1d67d5f))
* **@types/yauzl:** upgrade to version 2.10.3 ([6832d85](https://github.com/nodkz/mongodb-memory-server/commit/6832d85667da7f1e86a00d6e1bf746d3b48fddeb))
* **@types/yazl:** upgrade to version 2.4.4 ([921aec1](https://github.com/nodkz/mongodb-memory-server/commit/921aec1c4a6b373902787b673566053dafb06ab0))
* **@types/yazl:** upgrade to version 2.4.5 ([a3062ad](https://github.com/nodkz/mongodb-memory-server/commit/a3062ad7672a6b461816beae95f57ca747b27c40))
* **eslint-plugin-prettier:** upgrade to version 5.0.1 ([0885a5f](https://github.com/nodkz/mongodb-memory-server/commit/0885a5f1a88abb4d38a96288d5367920b047a4e4))
* **eslint:** upgrade to version 8.52.0 ([e2c267d](https://github.com/nodkz/mongodb-memory-server/commit/e2c267dae282046257b78c213570148f873aefa8))
* **eslint:** upgrade to version 8.53.0 ([5eb0bbe](https://github.com/nodkz/mongodb-memory-server/commit/5eb0bbecd281a29e25f52e6b6271ed24bfc74d60))
* **prettier:** upgrade to version 3.1.0 ([3c53d48](https://github.com/nodkz/mongodb-memory-server/commit/3c53d48b368d4cdf8a69d5f4765d4dffc2b21641))

## [9.1.0-beta.5](https://github.com/nodkz/mongodb-memory-server/compare/v9.1.0-beta.4...v9.1.0-beta.5) (2023-11-13)


### Fixes

* **getport:** ignore "ports.has()" if EXP_NET0LISTEN and port == 0 ([682dac6](https://github.com/nodkz/mongodb-memory-server/commit/682dac6ce3a45517fad393661972b47b1e0d5711))


### Dev-Dependencies

* **@types/debug:** upgrade to version 4.1.12 ([0aa128f](https://github.com/nodkz/mongodb-memory-server/commit/0aa128fbf13cf1849328a61cc481aabacc204c00))
* **@types/follow-redirects:** upgrade to version 1.14.4 ([d651684](https://github.com/nodkz/mongodb-memory-server/commit/d6516848ed496d31ffe4368d400e0eebd0cfab51))
* **@types/jest:** upgrade to version 29.5.8 ([f258247](https://github.com/nodkz/mongodb-memory-server/commit/f258247fde923b1647e60825297d4a89fa4c028e))
* **@types/semver:** upgrade to version 7.5.5 ([c6e3953](https://github.com/nodkz/mongodb-memory-server/commit/c6e3953cfda50dd637ef6312cf9d395dedec6d0b))
* **@types/tar-stream:** upgrade to version 3.1.3 ([ceff457](https://github.com/nodkz/mongodb-memory-server/commit/ceff457bc77cc36b0c5f5effff58266f9cf2bd43))
* **@types/yauzl:** upgrade to version 2.10.3 ([6832d85](https://github.com/nodkz/mongodb-memory-server/commit/6832d85667da7f1e86a00d6e1bf746d3b48fddeb))
* **@types/yazl:** upgrade to version 2.4.5 ([a3062ad](https://github.com/nodkz/mongodb-memory-server/commit/a3062ad7672a6b461816beae95f57ca747b27c40))
* **eslint:** upgrade to version 8.53.0 ([5eb0bbe](https://github.com/nodkz/mongodb-memory-server/commit/5eb0bbecd281a29e25f52e6b6271ed24bfc74d60))
* **prettier:** upgrade to version 3.1.0 ([3c53d48](https://github.com/nodkz/mongodb-memory-server/commit/3c53d48b368d4cdf8a69d5f4765d4dffc2b21641))

## [9.1.0-beta.4](https://github.com/nodkz/mongodb-memory-server/compare/v9.1.0-beta.3...v9.1.0-beta.4) (2023-11-13)


### Fixes

* **MongoInstance::stop:** should not wait too long to open a connection to ReplSet ([#813](https://github.com/nodkz/mongodb-memory-server/issues/813)) ([668b42a](https://github.com/nodkz/mongodb-memory-server/commit/668b42a1d80ce1f282dea0a8971a0a349e23dc98))

## [9.1.0-beta.3](https://github.com/nodkz/mongodb-memory-server/compare/v9.1.0-beta.2...v9.1.0-beta.3) (2023-11-09)


### Features

* **getport:** add experimental "EXP_NET0LISTEN" option ([631ec28](https://github.com/nodkz/mongodb-memory-server/commit/631ec28c57d533438c91cc608014cb05abdd5c61)), closes [#827](https://github.com/nodkz/mongodb-memory-server/issues/827)


### Refactor

* **getport:** use "node:net" over "node:http" ([c065147](https://github.com/nodkz/mongodb-memory-server/commit/c065147750c8c57dfb6be6fbcd55444d2cc7a16e))
* **MongoMemoryServer:** try to acquire port later ([f0385d6](https://github.com/nodkz/mongodb-memory-server/commit/f0385d62a7f6e0808023887f8a041ad29d648254))

## [9.1.0-beta.2](https://github.com/nodkz/mongodb-memory-server/compare/v9.1.0-beta.1...v9.1.0-beta.2) (2023-11-04)


### Features

* **MongoDownloadUrl:** add support for amazon linux 2023 ([#826](https://github.com/nodkz/mongodb-memory-server/issues/826)) ([ec1ea68](https://github.com/nodkz/mongodb-memory-server/commit/ec1ea6866cdc793c7168f5d7f004d2b6ce1535af))

## [9.1.0-beta.1](https://github.com/nodkz/mongodb-memory-server/compare/v9.0.1...v9.1.0-beta.1) (2023-10-26)


### Features

* **MongoBinaryDownloadUrl:** re-work rhel to support 9.0 ([c582829](https://github.com/nodkz/mongodb-memory-server/commit/c5828298382da762e37e69c5d46c781c4b4e591e)), closes [#821](https://github.com/nodkz/mongodb-memory-server/issues/821)


### Style

* **MongoMemoryServer:** log instance started log after assigning port ([4a5eacc](https://github.com/nodkz/mongodb-memory-server/commit/4a5eacc86f8d6665636acda743d67f279266afcb))


### Dependencies

* **mongodb:** upgrade to version 5.9.1 ([d328d65](https://github.com/nodkz/mongodb-memory-server/commit/d328d65451d9ec1d17b043408ad1d3ccaa041ab5))


### Dev-Dependencies

* **@types/debug:** upgrade to version 4.1.10 ([7da745a](https://github.com/nodkz/mongodb-memory-server/commit/7da745a34dbff5aa360cae7c65a5bd3955593d53))
* **@types/follow-redirects:** upgrade to version ([b65e643](https://github.com/nodkz/mongodb-memory-server/commit/b65e6432f7ee355dcd62208cb0a37b56a5dcb3a9))
* **@types/jest:** upgrade to version 29.5.6 ([b8acbb3](https://github.com/nodkz/mongodb-memory-server/commit/b8acbb3a51732765a89d00ba9de886538880fe5b))
* **@types/semver:** upgrade to version 7.5.4 ([9d430b9](https://github.com/nodkz/mongodb-memory-server/commit/9d430b9560c5c7628a4e9acd6e07445dadd76879))
* **@types/tar-stream:** upgrade to version 3.1.2 ([5ca4ee3](https://github.com/nodkz/mongodb-memory-server/commit/5ca4ee3be02c8dcb8d168136353a4d0ffa82c792))
* **@types/yauzl:** upgrade to version 2.10.2 ([31301dc](https://github.com/nodkz/mongodb-memory-server/commit/31301dc33505a999b119c9dfcb9374beb1d67d5f))
* **@types/yazl:** upgrade to version 2.4.4 ([921aec1](https://github.com/nodkz/mongodb-memory-server/commit/921aec1c4a6b373902787b673566053dafb06ab0))
* **eslint-plugin-prettier:** upgrade to version 5.0.1 ([0885a5f](https://github.com/nodkz/mongodb-memory-server/commit/0885a5f1a88abb4d38a96288d5367920b047a4e4))
* **eslint:** upgrade to version 8.52.0 ([e2c267d](https://github.com/nodkz/mongodb-memory-server/commit/e2c267dae282046257b78c213570148f873aefa8))

## [9.0.1](https://github.com/nodkz/mongodb-memory-server/compare/v9.0.0...v9.0.1) (2023-10-12)


### Fixes

* **kill:** should not try to open a connection to a not running ReplSet ([#811](https://github.com/nodkz/mongodb-memory-server/issues/811)) ([fefa869](https://github.com/nodkz/mongodb-memory-server/commit/fefa86982d1c39f78bb992c22d3d8271f80615c8))


### Style

* **errors:** typo "Could not corece VERSION" ([#808](https://github.com/nodkz/mongodb-memory-server/issues/808)) ([c1f2333](https://github.com/nodkz/mongodb-memory-server/commit/c1f2333c8f667ff4fa21709f481f2cd2e0712372))

## [9.0.0](https://github.com/nodkz/mongodb-memory-server/compare/v8.16.0...v9.0.0) (2023-10-06)


### ⚠ BREAKING CHANGES

* **resolveConfig:** Default binary version is now "6.0.9"
* **DryMongoBinary:** "legacyHomeCache" has been renamed to "homeCache" when using "DryMongoBinary" directly
* **MongoMemoryReplSet:** ReplSet option "auth" can now not be a boolean anymore, use as a object instead
* Authentication now is only created when "{ enable: true }" is given
also "disable" has been removed
* **MongoBinaryDownload:** aliases for ".binaryOpts.*" have been removed, use ".binaryOpts.option" instead
* ".cleanup(boolean)" is now no longer supported, use object options instead
* ".stop(boolean)" is now no longer supported, use object options instead
* **tsconfig:** potentially breaking change upgrading "target" to "es2020" in tsconfig
* Lowest supported NodeJS version is now 14.0
* **MongoBinaryDownloadUrl::translateArch:** "ia32" ("i386" / "i686") are now unsupported by mongodb-memory-server
* **tsconfig:** potentially breaking change upgrading "target" to "es2019" in tsconfig
* **MongoInstance::checkErrorInLine:** potentially breaking change not removing ", terminating" from error
* **MongoBinaryDownloadUrl::translatePlatform:** potentially breaking change removing "sunos" from translation

* **tsconfig:** update "target" to "es2019" ([df41101](https://github.com/nodkz/mongodb-memory-server/commit/df41101b978dbb31e7bf21b6b50ba35ccc68521c))
* **tsconfig:** update "target" to "es2020" ([ff20382](https://github.com/nodkz/mongodb-memory-server/commit/ff20382397677a7693ba83884135c104cdf66c46))


### Features

* change authentication to only happen when "enable" is "true" ([66a5ad3](https://github.com/nodkz/mongodb-memory-server/commit/66a5ad3edcdfd78688637b014a1cfd5c8e8fed66))
* **DryMongoBinary:** rename "legacyHomeCache" to "homeCache" ([eb7b691](https://github.com/nodkz/mongodb-memory-server/commit/eb7b691026f6511c17dddaa920228c415456c1cd))
* enable "MD5_CHECK" by default ([26cc408](https://github.com/nodkz/mongodb-memory-server/commit/26cc40840429412b2130e17267c5c548a3adaa1e))
* merge "EnsureInstanceError" into "InstanceInfoError" ([6962cbe](https://github.com/nodkz/mongodb-memory-server/commit/6962cbec68c7098f491b4c7c6f66b240e03a6659))
* merge "NoSystemBinaryFoundError" into "BinaryNotFoundError" ([d4e4d63](https://github.com/nodkz/mongodb-memory-server/commit/d4e4d6355696afdf71d6b4a288e180f651189d32))
* **MongoBinaryDownload:** remove aliases for "binaryOpts" ([4bb3420](https://github.com/nodkz/mongodb-memory-server/commit/4bb342092f66fb6afb0d8e4ae10b7dc56834d6a6))
* **MongoBinaryDownloadUrl::getUbuntuVersionString:** handle falling back to default version better ([8bf3d88](https://github.com/nodkz/mongodb-memory-server/commit/8bf3d88b9214e338dc689be21494a862688d51dd))
* **MongoBinaryDownloadUrl::translateArch:** remove ia32 translation and support ([a827a28](https://github.com/nodkz/mongodb-memory-server/commit/a827a285e4cdfcef5431b800d1291a891a6d6013)), closes [#638](https://github.com/nodkz/mongodb-memory-server/issues/638)
* **MongoBinaryDownloadUrl::translatePlatform:** remove translation of "elementary OS" ([ca75ef5](https://github.com/nodkz/mongodb-memory-server/commit/ca75ef5b5bc084803d99d353a1e37836fefaf671))
* **MongoBinaryDownloadUrl::translatePlatform:** remove translation of "sunos" ([31060b2](https://github.com/nodkz/mongodb-memory-server/commit/31060b251c53311283ebe427dad87b583d01a4e0)), closes [#661](https://github.com/nodkz/mongodb-memory-server/issues/661)
* **MongoBinaryDownloadUrl:** add ability to overwrite distro used ([f2b1c62](https://github.com/nodkz/mongodb-memory-server/commit/f2b1c62820159bde8d201055b8d3a0898190a2fa)), closes [#753](https://github.com/nodkz/mongodb-memory-server/issues/753)
* **MongoBinaryDownloadUrl:** remove linux fallback binary ([fe76b56](https://github.com/nodkz/mongodb-memory-server/commit/fe76b56191d9a87e1c1702af5de47b8df4b5a809)), closes [#761](https://github.com/nodkz/mongodb-memory-server/issues/761)
* **MongoInstance::checkErrorInLine:** dont remove ", terminating" from error ([793aa0d](https://github.com/nodkz/mongodb-memory-server/commit/793aa0d66efd6f7d587cb29d934eaccf2601ebc0)), closes [#664](https://github.com/nodkz/mongodb-memory-server/issues/664)
* **MongoInstance::start:** error when already having a "mongodProcess" defined ([cb80073](https://github.com/nodkz/mongodb-memory-server/commit/cb80073997d89b9f468bb6d1143bfd349cd17fc3)), closes [#662](https://github.com/nodkz/mongodb-memory-server/issues/662)
* **MongoInstance:** remove storage engine "devnull" ([6e38f99](https://github.com/nodkz/mongodb-memory-server/commit/6e38f99eb35d677423f62295a9333aef56b1619a))
* **MongoInstance:** remove storage engine "mmapv1" ([f689bdd](https://github.com/nodkz/mongodb-memory-server/commit/f689bdd671650e92434571fbec203da1e98638ff))
* **MongoMemoryReplSet:** change "auth" to not be able to be a boolean anymore ([0c6b574](https://github.com/nodkz/mongodb-memory-server/commit/0c6b574536103f8cf165491cc51a39186e6015ec))
* **MongoMemoryServer:** change "instance.auth" to not be manually set-able ([840584b](https://github.com/nodkz/mongodb-memory-server/commit/840584b36a035a571096581487c81f94d332fe2f))
* **MongoMemoryServer:** use storage engine "wiredTiger" if version is 7.0.0 or higher ([952609b](https://github.com/nodkz/mongodb-memory-server/commit/952609bd4963b194b92ddd91e5a447899fa4ee57)), closes [#742](https://github.com/nodkz/mongodb-memory-server/issues/742)
* remove support for ".cleanup(boolean)" ([9bff82e](https://github.com/nodkz/mongodb-memory-server/commit/9bff82e979d2c60963d801df8dac80a5712086a4))
* remove support for ".stop(boolean)" ([f925498](https://github.com/nodkz/mongodb-memory-server/commit/f9254987923300e130f61f65507a35f02ad2ff44))
* **resolveConfig:** update default binary version to 6.x ([3f5d421](https://github.com/nodkz/mongodb-memory-server/commit/3f5d4218f6938e4a6b2163490083872a589b0b40))
* set lowest supported nodejs version to 14.0 ([edc3a31](https://github.com/nodkz/mongodb-memory-server/commit/edc3a31c9c71b53e266606d6eb6b2572f4ccba0f))
* **util:** add module "getport" ([4d139a2](https://github.com/nodkz/mongodb-memory-server/commit/4d139a25345482c4ce54db9b2381edec467cbcf6))


### Fixes

* **DryMongoBinary::generateOptions:** actually use correct type for parameters ([f099597](https://github.com/nodkz/mongodb-memory-server/commit/f099597540be05db5e66ab036bf9b8d7b2dc8a4a))
* **getport:** only run ".unref" if it exists ([73c0c2e](https://github.com/nodkz/mongodb-memory-server/commit/73c0c2e1b5e4ea4ca8a7bc2fa150215eb358089c)), closes [#801](https://github.com/nodkz/mongodb-memory-server/issues/801)
* **MongoBinaryDownload::makeMD5check:** actually hash the content of the file, not the path ([c71dbf3](https://github.com/nodkz/mongodb-memory-server/commit/c71dbf3ae4e04aea3594a4528aadf36bb2411c6d))
* **MongoBinaryDownload:** change "_downloadingUrl" to be protected ([67ae260](https://github.com/nodkz/mongodb-memory-server/commit/67ae260e1643af8c59ee5b5b8c2fa73df0e9170b))
* **MongoInstance::checkErrorinLine:** add more info to "aborting after" error ([12fca33](https://github.com/nodkz/mongodb-memory-server/commit/12fca33a22221bb40dcac8ed755c2575e6df7d06))
* **MongoInstance::stop:** handle "stop" being called multiple times while running ([80e6cd8](https://github.com/nodkz/mongodb-memory-server/commit/80e6cd80a0ede010bf983832b8da1c3bd0992ee5)), closes [#802](https://github.com/nodkz/mongodb-memory-server/issues/802)
* **MongoInstance:** change to call ".unref" on the mongodb process ([59ec785](https://github.com/nodkz/mongodb-memory-server/commit/59ec785e59f206e78093e96a0652466730650136)), closes [#696](https://github.com/nodkz/mongodb-memory-server/issues/696)
* **MongoMemoryServer:** add log for when "instance.auth" is "false" but "opts.auth" is also defined ([7463fdc](https://github.com/nodkz/mongodb-memory-server/commit/7463fdcbdb4e3ee3bad802db3b5b9b7fb92553ae))
* remove usage of "md5-file" ([8096884](https://github.com/nodkz/mongodb-memory-server/commit/809688401ffed1dddc6c175d2fa63795abe0b996))
* remove usage of "uuid" package ([e30209a](https://github.com/nodkz/mongodb-memory-server/commit/e30209a0146181ba706c3ecd062cd20e86d7b815))
* replace "get-port" usage with "getport" module ([9bffeea](https://github.com/nodkz/mongodb-memory-server/commit/9bffeea3c23b0e1249d1d46733e97549fc446c77))


### Style

* apply prettier 3.0.1 formatting ([815a585](https://github.com/nodkz/mongodb-memory-server/commit/815a585b65be3050dad2c81bb868eb073e9a0bed))
* **DryMongoBinary:** remove todo comment ([08353b4](https://github.com/nodkz/mongodb-memory-server/commit/08353b401572d35866f4fff6cf771cfd6dd80f8b))
* **MongoBinaryDownload:** fix comment ([49eb8fc](https://github.com/nodkz/mongodb-memory-server/commit/49eb8fc58bc9236af27ec2c568e3061deebdcc5b))
* **MongoBinaryDownload:** remove unused comment ([ba26346](https://github.com/nodkz/mongodb-memory-server/commit/ba263469fccaf5183df3faa5814932d3905b9d9f))
* **MongoBinaryDownload:** rename error variables from "e" to "err" ([4bc2b22](https://github.com/nodkz/mongodb-memory-server/commit/4bc2b221732b62afe890aa327c9b1c61067e0270))
* **MongoBinaryDownloadUrl:** update tsdoc comments ([2c9c6fe](https://github.com/nodkz/mongodb-memory-server/commit/2c9c6fe8ef2291359cb3bfcfb8b97eb23aa51267))
* **MongoMemoryReplSet:** rename error variables from "e" to "err" ([99d556d](https://github.com/nodkz/mongodb-memory-server/commit/99d556d511833264448e430356ebe62448db2ec4))
* **MongoMemoryServer:** remove todo comment ([ea93afb](https://github.com/nodkz/mongodb-memory-server/commit/ea93afb35e5f1aa7bbb0a337aa0c04211df357a0))


### Refactor

* **MongoMemoryServer::CreateUserMongoDB:** update "roles" to use from mongodb directly ([274499a](https://github.com/nodkz/mongodb-memory-server/commit/274499a91272f704936213e70c0a41d66b1042fb)), closes [#663](https://github.com/nodkz/mongodb-memory-server/issues/663)


### Dependencies

* **@google/semantic-release-replace-plugin:** replace with semantic-release-replace-plugin ([245a70f](https://github.com/nodkz/mongodb-memory-server/commit/245a70f3b0de9f72987232c8603c70d3f9a7e861))
* **@types/debug:** upgrade to version 4.1.8 ([fdaa353](https://github.com/nodkz/mongodb-memory-server/commit/fdaa353c0e6fd888c3d9a79b250d8b983ece7120))
* **@types/debug:** upgrade to version 4.1.9 ([73f265a](https://github.com/nodkz/mongodb-memory-server/commit/73f265aba479f228c78469806e46b2ad9680d551))
* **@types/follow-redirects:** upgrade to version ([27dd371](https://github.com/nodkz/mongodb-memory-server/commit/27dd371a0543a886df89cd6e82f8fbf576b0b67a))
* **@types/jest:** upgrade to version 29.5.2 ([6111f36](https://github.com/nodkz/mongodb-memory-server/commit/6111f3649c103d9696b819a08472c8cdc293dd6f))
* **@types/jest:** upgrade to version 29.5.5 ([4f5d25d](https://github.com/nodkz/mongodb-memory-server/commit/4f5d25d924ca1d4881532a2c61585e37de2fe442))
* **@types/node:** upgrade to version 14.18.45 ([f93397b](https://github.com/nodkz/mongodb-memory-server/commit/f93397be085a6feb6d4076fd3c432f12bd2d948e))
* **@types/node:** upgrade to version 14.18.63 ([9cf137c](https://github.com/nodkz/mongodb-memory-server/commit/9cf137c8f1a829f4953d2cd1812111ddecd1e0ae))
* **@types/semver:** upgrade to version 7.5.0 ([45c6fbc](https://github.com/nodkz/mongodb-memory-server/commit/45c6fbcb7bdf8360338d5a9be4275ccacc9c5653))
* **@types/semver:** upgrade to version 7.5.3 ([3942290](https://github.com/nodkz/mongodb-memory-server/commit/3942290a62f7fb879ed47bf75e109bfc6a77dd1d))
* **@types/tar-stream:** upgrade to version 3.1.1 ([b6ac2c9](https://github.com/nodkz/mongodb-memory-server/commit/b6ac2c967e6f002a9d7df5bed6920bb4b8bd0006))
* **@types/uuid:** upgrade to version 9.0.0 ([1a11854](https://github.com/nodkz/mongodb-memory-server/commit/1a118543a6ff63ecdc10da672ea3e99aaa992219))
* **@types/yauzl:** upgrade to version 2.10.1 ([ce856ec](https://github.com/nodkz/mongodb-memory-server/commit/ce856ecba01b8b04ed4a5609aee7cb7d7de649de))
* **@types/yazl:** upgrade to version 2.4.3 ([0191bb7](https://github.com/nodkz/mongodb-memory-server/commit/0191bb7cbea6e0c34c234447f239dabd80d3e735))
* **@typescript-eslint/*:** upgrade to version 5.50.0 ([6db8e1e](https://github.com/nodkz/mongodb-memory-server/commit/6db8e1e0c56651dfb1ba83665e0ab6b6544aa8ee))
* **@typescript-eslint/*:** upgrade to version 5.59.2 ([834a3bf](https://github.com/nodkz/mongodb-memory-server/commit/834a3bf6b4b2e61248d79c6d665909bcccc444df))
* **@typescript-eslint/*:** upgrade to version 5.59.9 ([a1bf489](https://github.com/nodkz/mongodb-memory-server/commit/a1bf48934a815306a9c8b31dec3138c38db891bb))
* **async-mutx:** upgrade to version 0.4.0 ([ddfebe5](https://github.com/nodkz/mongodb-memory-server/commit/ddfebe570135a2ca8d61ca2d522f3ce061b2d7d1))
* **commitlint:** upgrade to version 17.4.2 ([897fa12](https://github.com/nodkz/mongodb-memory-server/commit/897fa12723816d472fa41fa51b4aa029307f4cf7))
* **commitlint:** upgrade to version 17.6.3 ([1248af6](https://github.com/nodkz/mongodb-memory-server/commit/1248af6a86a96b95b4b21612333bc916f98801d6))
* **commitlint:** upgrade to version 17.6.5 ([86b081b](https://github.com/nodkz/mongodb-memory-server/commit/86b081ba8811bd88bc0df5404ad7d89f67a7d644))
* **commitlint:** upgrade to version 17.6.6 ([6d48006](https://github.com/nodkz/mongodb-memory-server/commit/6d48006b9f2f5b2104664d05ad815cee51c38fff))
* **commitlint:** upgrade to version 17.7.1 ([e0e3408](https://github.com/nodkz/mongodb-memory-server/commit/e0e340819eb7c26dede2c22365b08495dc866b22))
* **commitlint:** upgrade to version 17.7.2 ([60a5a30](https://github.com/nodkz/mongodb-memory-server/commit/60a5a30bfdb9d6c08f787e643fef81a85247354f))
* **conventional-changelog-conventionalcommits:** upgrade to version 6.0.0 ([b199421](https://github.com/nodkz/mongodb-memory-server/commit/b199421e5e7a005e26d8c23ba6c1735111ebb39c))
* **conventional-changelog-conventionalcommits:** upgrade to version 6.1.0 ([ebd01e3](https://github.com/nodkz/mongodb-memory-server/commit/ebd01e376617f23b5939148fee3619b87cdeb311))
* **eslint-config-prettier:** upgrade to version 8.8.0 ([7980800](https://github.com/nodkz/mongodb-memory-server/commit/7980800da955ed98f2922b958b127ce3c513a716))
* **eslint-config-prettier:** upgrade to version 9.0.0 ([2e24d7a](https://github.com/nodkz/mongodb-memory-server/commit/2e24d7a8799e4dc0d125ee3ed946a0a6c9097a11))
* **eslint:** upgrade to version 8.33.0 ([7364aa9](https://github.com/nodkz/mongodb-memory-server/commit/7364aa9a8ecff7296a466c29c854d4f82d97441e))
* **eslint:** upgrade to version 8.40.0 ([4ab49e5](https://github.com/nodkz/mongodb-memory-server/commit/4ab49e5be993a412fdf4bf5b6b542a35d381e9e3))
* **eslint:** upgrade to version 8.42.0 ([b7bbfc9](https://github.com/nodkz/mongodb-memory-server/commit/b7bbfc9fe38180a9b3d9a4268bde045a422ca7c7))
* **eslint:** upgrade to version 8.44.0 ([d8ae174](https://github.com/nodkz/mongodb-memory-server/commit/d8ae1743d4d9d8f154bb8e6d6ed54979f8a36a6d))
* **eslint:** upgrade to version 8.47.0 ([6df5c1d](https://github.com/nodkz/mongodb-memory-server/commit/6df5c1d2c33ac866dac2a72b8fb1857ac2974a83))
* **eslint:** upgrade to version 8.50.0 ([8076a48](https://github.com/nodkz/mongodb-memory-server/commit/8076a483cd2068e01802058b270fc637718a7db0))
* **follow-redirects:** upgrade to version 1.15.3 ([b5a4cc6](https://github.com/nodkz/mongodb-memory-server/commit/b5a4cc63c50401b69c2f7b881def94d0167bafc4))
* **get-port:** remove dependency ([559328b](https://github.com/nodkz/mongodb-memory-server/commit/559328b16e7db7e4ff675b6fa1b2744680257cc7))
* **https-proxy-agent:** upgrade to version 6.1.0 ([9e2ef8d](https://github.com/nodkz/mongodb-memory-server/commit/9e2ef8deced61611b7d315c7cbeaec57f3470aba))
* **https-proxy-agent:** upgrade to version 7.0.1 ([d4d0c94](https://github.com/nodkz/mongodb-memory-server/commit/d4d0c94172fe6210a1cd99051895c6a5f8dcc752))
* **https-proxy-agent:** upgrade to version 7.0.2 ([3f5f457](https://github.com/nodkz/mongodb-memory-server/commit/3f5f457a1763711788d3c89b90a2d81f3054da86))
* **husky:** upgrade to version 8.0.3 ([45deaca](https://github.com/nodkz/mongodb-memory-server/commit/45deaca9a09f2a4c70e2def82b71ac1f27a65cc5))
* **jest:** upgrade to version 29.4.0 ([2e47534](https://github.com/nodkz/mongodb-memory-server/commit/2e47534f048f7dd384b962e7ac55e157f4c1afb7))
* **jest:** upgrade to version 29.5.0 ([0049da6](https://github.com/nodkz/mongodb-memory-server/commit/0049da6260d335e9fec908df6bad02e19991fd4d))
* **jest:** upgrade to version 29.6.1 ([980d280](https://github.com/nodkz/mongodb-memory-server/commit/980d280ac27f903d29c5ddc36ba4849aa0a25ff3))
* **jest:** upgrade to version 29.6.2 ([ef96b98](https://github.com/nodkz/mongodb-memory-server/commit/ef96b98fff50c40b2a9a16b084b81b4b24b58744))
* **jest:** upgrade to version 29.6.3 ([738c715](https://github.com/nodkz/mongodb-memory-server/commit/738c715a258baddb900dcdc39e73873d88e2c1c3))
* **jest:** upgrade to version 29.7.0 ([90af566](https://github.com/nodkz/mongodb-memory-server/commit/90af566416c9efdeda71945a6e84dc4f482fcc6f))
* **lint-staged:** upgrade to version 13.2.2 ([cb81395](https://github.com/nodkz/mongodb-memory-server/commit/cb81395e5d43ebc65024519f65ba603ba327d96b))
* **lint-staged:** upgrade to version 13.2.3 ([ed1df56](https://github.com/nodkz/mongodb-memory-server/commit/ed1df5671f89401180443404542d00ae777acc6f))
* **md5-file:** remove package ([a941c8b](https://github.com/nodkz/mongodb-memory-server/commit/a941c8be9f0b02fd1d447dba09896e04bc9a60ea))
* **mongodb:** upgrade to version 4.16.0 ([6deefda](https://github.com/nodkz/mongodb-memory-server/commit/6deefdafac15c08ab33c793d93b44adee3163a5c))
* **mongodb:** upgrade to version 5.0.0 ([96e61c0](https://github.com/nodkz/mongodb-memory-server/commit/96e61c0a3c0d07d6057bda2201e475dd54449e19))
* **mongodb:** upgrade to version 5.4.0 ([8d9ab97](https://github.com/nodkz/mongodb-memory-server/commit/8d9ab97cc81d9e6a682fd33ea3dd60879d4b5b78))
* **mongodb:** upgrade to version 5.6.0 ([642c274](https://github.com/nodkz/mongodb-memory-server/commit/642c27458e6030f6d9c10e4b3137f697e0dc2477))
* **mongodb:** upgrade to version 5.8.0 ([4bffe5a](https://github.com/nodkz/mongodb-memory-server/commit/4bffe5aae78b3571e2b86c4a17758a07e35c26f5))
* **mongodb:** upgrade to version 5.9.0 ([1e5deef](https://github.com/nodkz/mongodb-memory-server/commit/1e5deef633443643a58c9f7a18e354be79d31539))
* **prettier:** upgrade to version 2.8.3 ([8c4c1c0](https://github.com/nodkz/mongodb-memory-server/commit/8c4c1c05207c28751c3aee65cb04f6b253cc0217))
* **prettier:** upgrade to version 2.8.8 ([c2a5bde](https://github.com/nodkz/mongodb-memory-server/commit/c2a5bdef429142a1ebd48d5ba566b56754abe0fd))
* **prettier:** upgrade to version 3.0.1 ([1cd459b](https://github.com/nodkz/mongodb-memory-server/commit/1cd459b0328b0d2d2437eb8389068d641f174a8a))
* **prettier:** upgrade to version 3.0.2 ([94f9841](https://github.com/nodkz/mongodb-memory-server/commit/94f9841c358e6d4cf0d5f0703e3aa625b9f65594))
* **prettier:** upgrade to version 3.0.3 ([1145757](https://github.com/nodkz/mongodb-memory-server/commit/11457577c1abc683d76e71a3d9f2008cdb7c859e))
* **rimraf:** upgrade to version 4.1.2 ([d1f7b71](https://github.com/nodkz/mongodb-memory-server/commit/d1f7b71d1b8b76ee4d85c87c980b5e112d55f049))
* **rimraf:** upgrade to version 5.0.0 ([05b5663](https://github.com/nodkz/mongodb-memory-server/commit/05b5663f2b75bcffab9a551e04465cb0b90f7f1f))
* **rimraf:** upgrade to version 5.0.1 ([01e39e2](https://github.com/nodkz/mongodb-memory-server/commit/01e39e2bf21f5440a09d7cbb97e7b0cc5d1ed296))
* **rimraf:** upgrade to version 5.0.5 ([a331189](https://github.com/nodkz/mongodb-memory-server/commit/a331189624105fdf6b4b5555b5fede04cdb254b2))
* **saslprep:** add dev-dependency ([db7455c](https://github.com/nodkz/mongodb-memory-server/commit/db7455cd2f8a976dc3ffc693093253be42ccea7d))
* **semantic-release-replace-plugin:** downgrade to version 1.2.0 ([cacf945](https://github.com/nodkz/mongodb-memory-server/commit/cacf9450e99a796411f9b125720f8d876e95ba3b))
* **semantic-release-replace-plugin:** downgrade to version 1.2.3 ([3e52d32](https://github.com/nodkz/mongodb-memory-server/commit/3e52d323ef33f053eb69693c8721f8d925ed538c))
* **semantic-release-replace-plugin:** upgrade to version 1.2.6 ([4530214](https://github.com/nodkz/mongodb-memory-server/commit/4530214262113431865e57491448518a0cd01937))
* **semantic-release:** upgrade to version 19.0.5 ([27e22a7](https://github.com/nodkz/mongodb-memory-server/commit/27e22a7e1edb48a76b68e11c76f974f55b889c67))
* **semver:** upgrade to version 7.5.0 ([791f6ae](https://github.com/nodkz/mongodb-memory-server/commit/791f6ae2bf9eec0a0ca996bb70d091a52598f9a6))
* **semver:** upgrade to version 7.5.1 ([61d5ae8](https://github.com/nodkz/mongodb-memory-server/commit/61d5ae8a4e1cad68a2b6dcf9d5d4a9a74c04285a))
* **tar-stream:** upgrade to version 3.0.0 ([ad86aec](https://github.com/nodkz/mongodb-memory-server/commit/ad86aecf69c93bafc756937b106db55deb89fe1e))
* **ts-jest:** upgrade to version 29.1.0 ([4a2f2aa](https://github.com/nodkz/mongodb-memory-server/commit/4a2f2aa807ca3c8a2136d512967ff5dd57012ebe))
* **ts-jest:** upgrade to version 29.1.1 ([7a82045](https://github.com/nodkz/mongodb-memory-server/commit/7a82045f22edc8c07066d0eaebfd446d40fcffc8))
* **tslib:** upgrade to version 2.5.0 ([d0fad87](https://github.com/nodkz/mongodb-memory-server/commit/d0fad87db3f304ab23bd5dafdf4d5e74c6724a41))
* **tslib:** upgrade to version 2.5.3 ([22e6cb0](https://github.com/nodkz/mongodb-memory-server/commit/22e6cb095fc709613bea13d7a276cee5954dd6be))
* **tslib:** upgrade to version 2.6.2 ([ed17876](https://github.com/nodkz/mongodb-memory-server/commit/ed178764c75c2723162845092f5045bc162dfb22))
* **typedoc:** upgrade to version 0.24.8 ([fefab38](https://github.com/nodkz/mongodb-memory-server/commit/fefab38d415ac82f3367923ea0de744d0d796e9e))
* **typescript:** upgrade to version 4.7.4 ([5a05a49](https://github.com/nodkz/mongodb-memory-server/commit/5a05a49ba663de3677da39f3dec18af22f18edcd)), closes [#588](https://github.com/nodkz/mongodb-memory-server/issues/588)
* **typescript:** upgrade to version 4.9 ([6a27dee](https://github.com/nodkz/mongodb-memory-server/commit/6a27dee9965ae760707bf7442483ecc81596cc68))
* **typescript:** upgrade to version 5.0.4 ([d531dde](https://github.com/nodkz/mongodb-memory-server/commit/d531ddea767cef2c038e228597812507e0590c2a))
* **uuid:** remove package ([41b2551](https://github.com/nodkz/mongodb-memory-server/commit/41b2551a89df0eb806511efb85d5bd5f6419664c))


### Dev-Dependencies

* **saslprep:** remove dev-dependency again ([c3b4bdc](https://github.com/nodkz/mongodb-memory-server/commit/c3b4bdcbc042740163fdfeffc1476cb7cca0c814))

## [9.0.0-beta.4](https://github.com/nodkz/mongodb-memory-server/compare/v9.0.0-beta.3...v9.0.0-beta.4) (2023-10-05)


### Dependencies

* **typedoc:** add dev-dependency ([f8c671c](https://github.com/nodkz/mongodb-memory-server/commit/f8c671c2663d3c2a67314392d5f18cb08933ebfb))
* **typedoc:** upgrade to version 0.24.8 ([fefab38](https://github.com/nodkz/mongodb-memory-server/commit/fefab38d415ac82f3367923ea0de744d0d796e9e))

## [9.0.0-beta.3](https://github.com/nodkz/mongodb-memory-server/compare/v9.0.0-beta.2...v9.0.0-beta.3) (2023-10-05)


### Fixes

* fix binary download on debian testing/unstable ([#787](https://github.com/nodkz/mongodb-memory-server/issues/787)) ([1a8ac8a](https://github.com/nodkz/mongodb-memory-server/commit/1a8ac8a462d4d2cc2c9f99b5f8dc2e97ef224953))
* **getport:** only run ".unref" if it exists ([73c0c2e](https://github.com/nodkz/mongodb-memory-server/commit/73c0c2e1b5e4ea4ca8a7bc2fa150215eb358089c)), closes [#801](https://github.com/nodkz/mongodb-memory-server/issues/801)
* **MongoInstance::stop:** handle "stop" being called multiple times while running ([80e6cd8](https://github.com/nodkz/mongodb-memory-server/commit/80e6cd80a0ede010bf983832b8da1c3bd0992ee5)), closes [#802](https://github.com/nodkz/mongodb-memory-server/issues/802)


### Style

* **MongoBinaryDownloadUrl:** add comment explaining pr 787 ([1821135](https://github.com/nodkz/mongodb-memory-server/commit/1821135b7c59009455992e9a4f064ec46ba381f5))


### Dependencies

* **@types/debug:** upgrade to version 4.1.9 ([73f265a](https://github.com/nodkz/mongodb-memory-server/commit/73f265aba479f228c78469806e46b2ad9680d551))
* **@types/follow-redirects:** upgrade to version ([27dd371](https://github.com/nodkz/mongodb-memory-server/commit/27dd371a0543a886df89cd6e82f8fbf576b0b67a))
* **@types/jest:** upgrade to version 29.5.5 ([4f5d25d](https://github.com/nodkz/mongodb-memory-server/commit/4f5d25d924ca1d4881532a2c61585e37de2fe442))
* **@types/node:** upgrade to version 14.18.63 ([9cf137c](https://github.com/nodkz/mongodb-memory-server/commit/9cf137c8f1a829f4953d2cd1812111ddecd1e0ae))
* **@types/semver:** upgrade to version 7.5.3 ([3942290](https://github.com/nodkz/mongodb-memory-server/commit/3942290a62f7fb879ed47bf75e109bfc6a77dd1d))
* **@types/tar-stream:** upgrade to version 3.1.1 ([b6ac2c9](https://github.com/nodkz/mongodb-memory-server/commit/b6ac2c967e6f002a9d7df5bed6920bb4b8bd0006))
* **@types/yauzl:** upgrade to version 2.10.1 ([ce856ec](https://github.com/nodkz/mongodb-memory-server/commit/ce856ecba01b8b04ed4a5609aee7cb7d7de649de))
* **@types/yazl:** upgrade to version 2.4.3 ([0191bb7](https://github.com/nodkz/mongodb-memory-server/commit/0191bb7cbea6e0c34c234447f239dabd80d3e735))
* **commitlint:** upgrade to version 17.7.2 ([60a5a30](https://github.com/nodkz/mongodb-memory-server/commit/60a5a30bfdb9d6c08f787e643fef81a85247354f))
* **eslint:** upgrade to version 8.50.0 ([8076a48](https://github.com/nodkz/mongodb-memory-server/commit/8076a483cd2068e01802058b270fc637718a7db0))
* **follow-redirects:** upgrade to version 1.15.3 ([b5a4cc6](https://github.com/nodkz/mongodb-memory-server/commit/b5a4cc63c50401b69c2f7b881def94d0167bafc4))
* **https-proxy-agent:** upgrade to version 7.0.2 ([3f5f457](https://github.com/nodkz/mongodb-memory-server/commit/3f5f457a1763711788d3c89b90a2d81f3054da86))
* **jest:** upgrade to version 29.7.0 ([90af566](https://github.com/nodkz/mongodb-memory-server/commit/90af566416c9efdeda71945a6e84dc4f482fcc6f))
* **mongodb:** upgrade to version 5.9.0 ([1e5deef](https://github.com/nodkz/mongodb-memory-server/commit/1e5deef633443643a58c9f7a18e354be79d31539))
* **prettier:** upgrade to version 3.0.3 ([1145757](https://github.com/nodkz/mongodb-memory-server/commit/11457577c1abc683d76e71a3d9f2008cdb7c859e))
* **rimraf:** upgrade to version 5.0.5 ([a331189](https://github.com/nodkz/mongodb-memory-server/commit/a331189624105fdf6b4b5555b5fede04cdb254b2))

## [9.0.0-beta.2](https://github.com/nodkz/mongodb-memory-server/compare/v9.0.0-beta.1...v9.0.0-beta.2) (2023-08-22)


### ⚠ BREAKING CHANGES

* **resolveConfig:** Default binary version is now "6.0.9"

### Features

* **MongoMemoryServer:** use storage engine "wiredTiger" if version is 7.0.0 or higher ([952609b](https://github.com/nodkz/mongodb-memory-server/commit/952609bd4963b194b92ddd91e5a447899fa4ee57)), closes [#742](https://github.com/nodkz/mongodb-memory-server/issues/742)
* **resolveConfig:** update default binary version to 6.x ([3f5d421](https://github.com/nodkz/mongodb-memory-server/commit/3f5d4218f6938e4a6b2163490083872a589b0b40))


### Fixes

* **DryMongoBinary::generateOptions:** actually use correct type for parameters ([f099597](https://github.com/nodkz/mongodb-memory-server/commit/f099597540be05db5e66ab036bf9b8d7b2dc8a4a))


### Dependencies

* **jest:** upgrade to version 29.6.3 ([738c715](https://github.com/nodkz/mongodb-memory-server/commit/738c715a258baddb900dcdc39e73873d88e2c1c3))
* **mongodb:** upgrade to version 5.8.0 ([4bffe5a](https://github.com/nodkz/mongodb-memory-server/commit/4bffe5aae78b3571e2b86c4a17758a07e35c26f5))
* **prettier:** upgrade to version 3.0.2 ([94f9841](https://github.com/nodkz/mongodb-memory-server/commit/94f9841c358e6d4cf0d5f0703e3aa625b9f65594))
* **saslprep:** add dev-dependency ([db7455c](https://github.com/nodkz/mongodb-memory-server/commit/db7455cd2f8a976dc3ffc693093253be42ccea7d))
* **tslib:** upgrade to version 2.6.2 ([ed17876](https://github.com/nodkz/mongodb-memory-server/commit/ed178764c75c2723162845092f5045bc162dfb22))

## [9.0.0-beta.1](https://github.com/nodkz/mongodb-memory-server/compare/v8.15.0...v9.0.0-beta.1) (2023-08-15)


### ⚠ BREAKING CHANGES

* **DryMongoBinary:** "legacyHomeCache" has been renamed to "homeCache" when using "DryMongoBinary" directly
* **MongoMemoryReplSet:** ReplSet option "auth" can now not be a boolean anymore, use as a object instead
* Authentication now is only created when "{ enable: true }" is given
also "disable" has been removed
* **MongoBinaryDownload:** aliases for ".binaryOpts.*" have been removed, use ".binaryOpts.option" instead
* ".cleanup(boolean)" is now no longer supported, use object options instead
* ".stop(boolean)" is now no longer supported, use object options instead
* **tsconfig:** potentially breaking change upgrading "target" to "es2020" in tsconfig
* Lowest supported NodeJS version is now 14.0
* **MongoBinaryDownloadUrl::translateArch:** "ia32" ("i386" / "i686") are now unsupported by mongodb-memory-server
* **tsconfig:** potentially breaking change upgrading "target" to "es2019" in tsconfig
* **MongoInstance::checkErrorInLine:** potentially breaking change not removing ", terminating" from error
* **MongoBinaryDownloadUrl::translatePlatform:** potentially breaking change removing "sunos" from translation

* **tsconfig:** update "target" to "es2019" ([df41101](https://github.com/nodkz/mongodb-memory-server/commit/df41101b978dbb31e7bf21b6b50ba35ccc68521c))
* **tsconfig:** update "target" to "es2020" ([ff20382](https://github.com/nodkz/mongodb-memory-server/commit/ff20382397677a7693ba83884135c104cdf66c46))


### Features

* change authentication to only happen when "enable" is "true" ([66a5ad3](https://github.com/nodkz/mongodb-memory-server/commit/66a5ad3edcdfd78688637b014a1cfd5c8e8fed66))
* **DryMongoBinary:** rename "legacyHomeCache" to "homeCache" ([eb7b691](https://github.com/nodkz/mongodb-memory-server/commit/eb7b691026f6511c17dddaa920228c415456c1cd))
* enable "MD5_CHECK" by default ([26cc408](https://github.com/nodkz/mongodb-memory-server/commit/26cc40840429412b2130e17267c5c548a3adaa1e))
* merge "EnsureInstanceError" into "InstanceInfoError" ([6962cbe](https://github.com/nodkz/mongodb-memory-server/commit/6962cbec68c7098f491b4c7c6f66b240e03a6659))
* merge "NoSystemBinaryFoundError" into "BinaryNotFoundError" ([d4e4d63](https://github.com/nodkz/mongodb-memory-server/commit/d4e4d6355696afdf71d6b4a288e180f651189d32))
* **MongoBinaryDownload:** remove aliases for "binaryOpts" ([4bb3420](https://github.com/nodkz/mongodb-memory-server/commit/4bb342092f66fb6afb0d8e4ae10b7dc56834d6a6))
* **MongoBinaryDownloadUrl::getUbuntuVersionString:** handle falling back to default version better ([8bf3d88](https://github.com/nodkz/mongodb-memory-server/commit/8bf3d88b9214e338dc689be21494a862688d51dd))
* **MongoBinaryDownloadUrl::translateArch:** remove ia32 translation and support ([a827a28](https://github.com/nodkz/mongodb-memory-server/commit/a827a285e4cdfcef5431b800d1291a891a6d6013)), closes [#638](https://github.com/nodkz/mongodb-memory-server/issues/638)
* **MongoBinaryDownloadUrl::translatePlatform:** remove translation of "elementary OS" ([ca75ef5](https://github.com/nodkz/mongodb-memory-server/commit/ca75ef5b5bc084803d99d353a1e37836fefaf671))
* **MongoBinaryDownloadUrl::translatePlatform:** remove translation of "sunos" ([31060b2](https://github.com/nodkz/mongodb-memory-server/commit/31060b251c53311283ebe427dad87b583d01a4e0)), closes [#661](https://github.com/nodkz/mongodb-memory-server/issues/661)
* **MongoBinaryDownloadUrl:** add ability to overwrite distro used ([f2b1c62](https://github.com/nodkz/mongodb-memory-server/commit/f2b1c62820159bde8d201055b8d3a0898190a2fa)), closes [#753](https://github.com/nodkz/mongodb-memory-server/issues/753)
* **MongoBinaryDownloadUrl:** remove linux fallback binary ([fe76b56](https://github.com/nodkz/mongodb-memory-server/commit/fe76b56191d9a87e1c1702af5de47b8df4b5a809)), closes [#761](https://github.com/nodkz/mongodb-memory-server/issues/761)
* **MongoInstance::checkErrorInLine:** dont remove ", terminating" from error ([793aa0d](https://github.com/nodkz/mongodb-memory-server/commit/793aa0d66efd6f7d587cb29d934eaccf2601ebc0)), closes [#664](https://github.com/nodkz/mongodb-memory-server/issues/664)
* **MongoInstance::start:** error when already having a "mongodProcess" defined ([cb80073](https://github.com/nodkz/mongodb-memory-server/commit/cb80073997d89b9f468bb6d1143bfd349cd17fc3)), closes [#662](https://github.com/nodkz/mongodb-memory-server/issues/662)
* **MongoInstance:** remove storage engine "devnull" ([6e38f99](https://github.com/nodkz/mongodb-memory-server/commit/6e38f99eb35d677423f62295a9333aef56b1619a))
* **MongoInstance:** remove storage engine "mmapv1" ([f689bdd](https://github.com/nodkz/mongodb-memory-server/commit/f689bdd671650e92434571fbec203da1e98638ff))
* **MongoMemoryReplSet:** change "auth" to not be able to be a boolean anymore ([0c6b574](https://github.com/nodkz/mongodb-memory-server/commit/0c6b574536103f8cf165491cc51a39186e6015ec))
* **MongoMemoryServer:** change "instance.auth" to not be manually set-able ([840584b](https://github.com/nodkz/mongodb-memory-server/commit/840584b36a035a571096581487c81f94d332fe2f))
* remove support for ".cleanup(boolean)" ([9bff82e](https://github.com/nodkz/mongodb-memory-server/commit/9bff82e979d2c60963d801df8dac80a5712086a4))
* remove support for ".stop(boolean)" ([f925498](https://github.com/nodkz/mongodb-memory-server/commit/f9254987923300e130f61f65507a35f02ad2ff44))
* set lowest supported nodejs version to 14.0 ([edc3a31](https://github.com/nodkz/mongodb-memory-server/commit/edc3a31c9c71b53e266606d6eb6b2572f4ccba0f))
* **util:** add module "getport" ([4d139a2](https://github.com/nodkz/mongodb-memory-server/commit/4d139a25345482c4ce54db9b2381edec467cbcf6))


### Fixes

* **MongoBinaryDownload::makeMD5check:** actually hash the content of the file, not the path ([c71dbf3](https://github.com/nodkz/mongodb-memory-server/commit/c71dbf3ae4e04aea3594a4528aadf36bb2411c6d))
* **MongoBinaryDownload:** change "_downloadingUrl" to be protected ([67ae260](https://github.com/nodkz/mongodb-memory-server/commit/67ae260e1643af8c59ee5b5b8c2fa73df0e9170b))
* **MongoInstance::checkErrorinLine:** add more info to "aborting after" error ([12fca33](https://github.com/nodkz/mongodb-memory-server/commit/12fca33a22221bb40dcac8ed755c2575e6df7d06))
* **MongoInstance:** change to call ".unref" on the mongodb process ([59ec785](https://github.com/nodkz/mongodb-memory-server/commit/59ec785e59f206e78093e96a0652466730650136)), closes [#696](https://github.com/nodkz/mongodb-memory-server/issues/696)
* **MongoMemoryServer:** add log for when "instance.auth" is "false" but "opts.auth" is also defined ([7463fdc](https://github.com/nodkz/mongodb-memory-server/commit/7463fdcbdb4e3ee3bad802db3b5b9b7fb92553ae))
* remove usage of "md5-file" ([8096884](https://github.com/nodkz/mongodb-memory-server/commit/809688401ffed1dddc6c175d2fa63795abe0b996))
* remove usage of "uuid" package ([e30209a](https://github.com/nodkz/mongodb-memory-server/commit/e30209a0146181ba706c3ecd062cd20e86d7b815))
* replace "get-port" usage with "getport" module ([9bffeea](https://github.com/nodkz/mongodb-memory-server/commit/9bffeea3c23b0e1249d1d46733e97549fc446c77))


### Style

* apply prettier 3.0.1 formatting ([815a585](https://github.com/nodkz/mongodb-memory-server/commit/815a585b65be3050dad2c81bb868eb073e9a0bed))
* **DryMongoBinary:** remove todo comment ([08353b4](https://github.com/nodkz/mongodb-memory-server/commit/08353b401572d35866f4fff6cf771cfd6dd80f8b))
* **MongoBinaryDownload:** fix comment ([49eb8fc](https://github.com/nodkz/mongodb-memory-server/commit/49eb8fc58bc9236af27ec2c568e3061deebdcc5b))
* **MongoBinaryDownload:** remove unused comment ([ba26346](https://github.com/nodkz/mongodb-memory-server/commit/ba263469fccaf5183df3faa5814932d3905b9d9f))
* **MongoBinaryDownload:** rename error variables from "e" to "err" ([4bc2b22](https://github.com/nodkz/mongodb-memory-server/commit/4bc2b221732b62afe890aa327c9b1c61067e0270))
* **MongoBinaryDownloadUrl:** update tsdoc comments ([2c9c6fe](https://github.com/nodkz/mongodb-memory-server/commit/2c9c6fe8ef2291359cb3bfcfb8b97eb23aa51267))
* **MongoMemoryReplSet:** rename error variables from "e" to "err" ([99d556d](https://github.com/nodkz/mongodb-memory-server/commit/99d556d511833264448e430356ebe62448db2ec4))
* **MongoMemoryServer:** remove todo comment ([ea93afb](https://github.com/nodkz/mongodb-memory-server/commit/ea93afb35e5f1aa7bbb0a337aa0c04211df357a0))


### Refactor

* **MongoMemoryServer::CreateUserMongoDB:** update "roles" to use from mongodb directly ([274499a](https://github.com/nodkz/mongodb-memory-server/commit/274499a91272f704936213e70c0a41d66b1042fb)), closes [#663](https://github.com/nodkz/mongodb-memory-server/issues/663)


### Dependencies

* **@google/semantic-release-replace-plugin:** replace with semantic-release-replace-plugin ([245a70f](https://github.com/nodkz/mongodb-memory-server/commit/245a70f3b0de9f72987232c8603c70d3f9a7e861))
* **@types/debug:** upgrade to version 4.1.8 ([fdaa353](https://github.com/nodkz/mongodb-memory-server/commit/fdaa353c0e6fd888c3d9a79b250d8b983ece7120))
* **@types/jest:** upgrade to version 29.5.2 ([6111f36](https://github.com/nodkz/mongodb-memory-server/commit/6111f3649c103d9696b819a08472c8cdc293dd6f))
* **@types/node:** upgrade to version 14.18.45 ([f93397b](https://github.com/nodkz/mongodb-memory-server/commit/f93397be085a6feb6d4076fd3c432f12bd2d948e))
* **@types/semver:** upgrade to version 7.5.0 ([45c6fbc](https://github.com/nodkz/mongodb-memory-server/commit/45c6fbcb7bdf8360338d5a9be4275ccacc9c5653))
* **@types/uuid:** upgrade to version 9.0.0 ([1a11854](https://github.com/nodkz/mongodb-memory-server/commit/1a118543a6ff63ecdc10da672ea3e99aaa992219))
* **@typescript-eslint/*:** upgrade to version 5.50.0 ([6db8e1e](https://github.com/nodkz/mongodb-memory-server/commit/6db8e1e0c56651dfb1ba83665e0ab6b6544aa8ee))
* **@typescript-eslint/*:** upgrade to version 5.59.2 ([834a3bf](https://github.com/nodkz/mongodb-memory-server/commit/834a3bf6b4b2e61248d79c6d665909bcccc444df))
* **@typescript-eslint/*:** upgrade to version 5.59.9 ([a1bf489](https://github.com/nodkz/mongodb-memory-server/commit/a1bf48934a815306a9c8b31dec3138c38db891bb))
* **async-mutx:** upgrade to version 0.4.0 ([ddfebe5](https://github.com/nodkz/mongodb-memory-server/commit/ddfebe570135a2ca8d61ca2d522f3ce061b2d7d1))
* **commitlint:** upgrade to version 17.4.2 ([897fa12](https://github.com/nodkz/mongodb-memory-server/commit/897fa12723816d472fa41fa51b4aa029307f4cf7))
* **commitlint:** upgrade to version 17.6.3 ([1248af6](https://github.com/nodkz/mongodb-memory-server/commit/1248af6a86a96b95b4b21612333bc916f98801d6))
* **commitlint:** upgrade to version 17.6.5 ([86b081b](https://github.com/nodkz/mongodb-memory-server/commit/86b081ba8811bd88bc0df5404ad7d89f67a7d644))
* **commitlint:** upgrade to version 17.6.6 ([6d48006](https://github.com/nodkz/mongodb-memory-server/commit/6d48006b9f2f5b2104664d05ad815cee51c38fff))
* **commitlint:** upgrade to version 17.7.1 ([e0e3408](https://github.com/nodkz/mongodb-memory-server/commit/e0e340819eb7c26dede2c22365b08495dc866b22))
* **conventional-changelog-conventionalcommits:** upgrade to version 6.0.0 ([b199421](https://github.com/nodkz/mongodb-memory-server/commit/b199421e5e7a005e26d8c23ba6c1735111ebb39c))
* **conventional-changelog-conventionalcommits:** upgrade to version 6.1.0 ([ebd01e3](https://github.com/nodkz/mongodb-memory-server/commit/ebd01e376617f23b5939148fee3619b87cdeb311))
* **eslint-config-prettier:** upgrade to version 8.8.0 ([7980800](https://github.com/nodkz/mongodb-memory-server/commit/7980800da955ed98f2922b958b127ce3c513a716))
* **eslint-config-prettier:** upgrade to version 9.0.0 ([2e24d7a](https://github.com/nodkz/mongodb-memory-server/commit/2e24d7a8799e4dc0d125ee3ed946a0a6c9097a11))
* **eslint:** upgrade to version 8.33.0 ([7364aa9](https://github.com/nodkz/mongodb-memory-server/commit/7364aa9a8ecff7296a466c29c854d4f82d97441e))
* **eslint:** upgrade to version 8.40.0 ([4ab49e5](https://github.com/nodkz/mongodb-memory-server/commit/4ab49e5be993a412fdf4bf5b6b542a35d381e9e3))
* **eslint:** upgrade to version 8.42.0 ([b7bbfc9](https://github.com/nodkz/mongodb-memory-server/commit/b7bbfc9fe38180a9b3d9a4268bde045a422ca7c7))
* **eslint:** upgrade to version 8.44.0 ([d8ae174](https://github.com/nodkz/mongodb-memory-server/commit/d8ae1743d4d9d8f154bb8e6d6ed54979f8a36a6d))
* **eslint:** upgrade to version 8.47.0 ([6df5c1d](https://github.com/nodkz/mongodb-memory-server/commit/6df5c1d2c33ac866dac2a72b8fb1857ac2974a83))
* **get-port:** remove dependency ([559328b](https://github.com/nodkz/mongodb-memory-server/commit/559328b16e7db7e4ff675b6fa1b2744680257cc7))
* **https-proxy-agent:** upgrade to version 6.1.0 ([9e2ef8d](https://github.com/nodkz/mongodb-memory-server/commit/9e2ef8deced61611b7d315c7cbeaec57f3470aba))
* **https-proxy-agent:** upgrade to version 7.0.1 ([d4d0c94](https://github.com/nodkz/mongodb-memory-server/commit/d4d0c94172fe6210a1cd99051895c6a5f8dcc752))
* **husky:** upgrade to version 8.0.3 ([45deaca](https://github.com/nodkz/mongodb-memory-server/commit/45deaca9a09f2a4c70e2def82b71ac1f27a65cc5))
* **jest:** upgrade to version 29.4.0 ([2e47534](https://github.com/nodkz/mongodb-memory-server/commit/2e47534f048f7dd384b962e7ac55e157f4c1afb7))
* **jest:** upgrade to version 29.5.0 ([0049da6](https://github.com/nodkz/mongodb-memory-server/commit/0049da6260d335e9fec908df6bad02e19991fd4d))
* **jest:** upgrade to version 29.6.1 ([980d280](https://github.com/nodkz/mongodb-memory-server/commit/980d280ac27f903d29c5ddc36ba4849aa0a25ff3))
* **jest:** upgrade to version 29.6.2 ([ef96b98](https://github.com/nodkz/mongodb-memory-server/commit/ef96b98fff50c40b2a9a16b084b81b4b24b58744))
* **lint-staged:** upgrade to version 13.2.2 ([cb81395](https://github.com/nodkz/mongodb-memory-server/commit/cb81395e5d43ebc65024519f65ba603ba327d96b))
* **lint-staged:** upgrade to version 13.2.3 ([ed1df56](https://github.com/nodkz/mongodb-memory-server/commit/ed1df5671f89401180443404542d00ae777acc6f))
* **md5-file:** remove package ([a941c8b](https://github.com/nodkz/mongodb-memory-server/commit/a941c8be9f0b02fd1d447dba09896e04bc9a60ea))
* **mongodb:** upgrade to version 4.16.0 ([6deefda](https://github.com/nodkz/mongodb-memory-server/commit/6deefdafac15c08ab33c793d93b44adee3163a5c))
* **mongodb:** upgrade to version 5.0.0 ([96e61c0](https://github.com/nodkz/mongodb-memory-server/commit/96e61c0a3c0d07d6057bda2201e475dd54449e19))
* **mongodb:** upgrade to version 5.4.0 ([8d9ab97](https://github.com/nodkz/mongodb-memory-server/commit/8d9ab97cc81d9e6a682fd33ea3dd60879d4b5b78))
* **mongodb:** upgrade to version 5.6.0 ([642c274](https://github.com/nodkz/mongodb-memory-server/commit/642c27458e6030f6d9c10e4b3137f697e0dc2477))
* **prettier:** upgrade to version 2.8.3 ([8c4c1c0](https://github.com/nodkz/mongodb-memory-server/commit/8c4c1c05207c28751c3aee65cb04f6b253cc0217))
* **prettier:** upgrade to version 2.8.8 ([c2a5bde](https://github.com/nodkz/mongodb-memory-server/commit/c2a5bdef429142a1ebd48d5ba566b56754abe0fd))
* **prettier:** upgrade to version 3.0.1 ([1cd459b](https://github.com/nodkz/mongodb-memory-server/commit/1cd459b0328b0d2d2437eb8389068d641f174a8a))
* **rimraf:** upgrade to version 4.1.2 ([d1f7b71](https://github.com/nodkz/mongodb-memory-server/commit/d1f7b71d1b8b76ee4d85c87c980b5e112d55f049))
* **rimraf:** upgrade to version 5.0.0 ([05b5663](https://github.com/nodkz/mongodb-memory-server/commit/05b5663f2b75bcffab9a551e04465cb0b90f7f1f))
* **rimraf:** upgrade to version 5.0.1 ([01e39e2](https://github.com/nodkz/mongodb-memory-server/commit/01e39e2bf21f5440a09d7cbb97e7b0cc5d1ed296))
* **semantic-release-replace-plugin:** downgrade to version 1.2.0 ([cacf945](https://github.com/nodkz/mongodb-memory-server/commit/cacf9450e99a796411f9b125720f8d876e95ba3b))
* **semantic-release-replace-plugin:** downgrade to version 1.2.3 ([3e52d32](https://github.com/nodkz/mongodb-memory-server/commit/3e52d323ef33f053eb69693c8721f8d925ed538c))
* **semantic-release-replace-plugin:** upgrade to version 1.2.6 ([4530214](https://github.com/nodkz/mongodb-memory-server/commit/4530214262113431865e57491448518a0cd01937))
* **semantic-release:** upgrade to version 19.0.5 ([27e22a7](https://github.com/nodkz/mongodb-memory-server/commit/27e22a7e1edb48a76b68e11c76f974f55b889c67))
* **semver:** upgrade to version 7.5.0 ([791f6ae](https://github.com/nodkz/mongodb-memory-server/commit/791f6ae2bf9eec0a0ca996bb70d091a52598f9a6))
* **semver:** upgrade to version 7.5.1 ([61d5ae8](https://github.com/nodkz/mongodb-memory-server/commit/61d5ae8a4e1cad68a2b6dcf9d5d4a9a74c04285a))
* **tar-stream:** upgrade to version 3.0.0 ([ad86aec](https://github.com/nodkz/mongodb-memory-server/commit/ad86aecf69c93bafc756937b106db55deb89fe1e))
* **ts-jest:** upgrade to version 29.1.0 ([4a2f2aa](https://github.com/nodkz/mongodb-memory-server/commit/4a2f2aa807ca3c8a2136d512967ff5dd57012ebe))
* **ts-jest:** upgrade to version 29.1.1 ([7a82045](https://github.com/nodkz/mongodb-memory-server/commit/7a82045f22edc8c07066d0eaebfd446d40fcffc8))
* **tslib:** upgrade to version 2.5.0 ([d0fad87](https://github.com/nodkz/mongodb-memory-server/commit/d0fad87db3f304ab23bd5dafdf4d5e74c6724a41))
* **tslib:** upgrade to version 2.5.3 ([22e6cb0](https://github.com/nodkz/mongodb-memory-server/commit/22e6cb095fc709613bea13d7a276cee5954dd6be))
* **typescript:** upgrade to version 4.7.4 ([5a05a49](https://github.com/nodkz/mongodb-memory-server/commit/5a05a49ba663de3677da39f3dec18af22f18edcd)), closes [#588](https://github.com/nodkz/mongodb-memory-server/issues/588)
* **typescript:** upgrade to version 4.9 ([6a27dee](https://github.com/nodkz/mongodb-memory-server/commit/6a27dee9965ae760707bf7442483ecc81596cc68))
* **typescript:** upgrade to version 5.0.4 ([d531dde](https://github.com/nodkz/mongodb-memory-server/commit/d531ddea767cef2c038e228597812507e0590c2a))
* **uuid:** remove package ([41b2551](https://github.com/nodkz/mongodb-memory-server/commit/41b2551a89df0eb806511efb85d5bd5f6419664c))

## [8.16.1](https://github.com/typegoose/mongodb-memory-server/compare/v8.16.0...v8.16.1) (2024-07-13)


### Fixes

* trigger release ([62f43e7](https://github.com/typegoose/mongodb-memory-server/commit/62f43e7c9801ab3541157093b73de158bae48558))


### Style

* **errors:** fix lint ([4137d32](https://github.com/typegoose/mongodb-memory-server/commit/4137d32f1c30ec65bec03191d1ab39679719533d))

## [8.16.0](https://github.com/nodkz/mongodb-memory-server/compare/v8.15.1...v8.16.0) (2023-10-05)


### Dependencies

* **typedoc:** add dev-dependency ([f8c671c](https://github.com/nodkz/mongodb-memory-server/commit/f8c671c2663d3c2a67314392d5f18cb08933ebfb))

## [8.15.1](https://github.com/nodkz/mongodb-memory-server/compare/v8.15.0...v8.15.1) (2023-08-17)


### Fixes

* fix binary download on debian testing/unstable ([#787](https://github.com/nodkz/mongodb-memory-server/issues/787)) ([1a8ac8a](https://github.com/nodkz/mongodb-memory-server/commit/1a8ac8a462d4d2cc2c9f99b5f8dc2e97ef224953))


### Style

* **MongoBinaryDownloadUrl:** add comment explaining pr 787 ([1821135](https://github.com/nodkz/mongodb-memory-server/commit/1821135b7c59009455992e9a4f064ec46ba381f5))

## [8.15.0](https://github.com/nodkz/mongodb-memory-server/compare/v8.14.0...v8.15.0) (2023-08-15)


### Features

* **MongoBinaryDownloadUrl:** add ability to overwrite distro used ([826c72e](https://github.com/nodkz/mongodb-memory-server/commit/826c72e1d56d409bc760949797d62fd10dc8eaf8)), closes [#753](https://github.com/nodkz/mongodb-memory-server/issues/753)


### Dependencies

* **@typescript-eslint/*:** upgrade to version 5.61.0 ([121f0fc](https://github.com/nodkz/mongodb-memory-server/commit/121f0fcfb06919dbe3a778db520031f394aa4ea7))
* **eslint:** upgrade to version 8.44.0 ([f7487b1](https://github.com/nodkz/mongodb-memory-server/commit/f7487b1027eead475f3e1057d2990a624e2d7ba4))
* **semver:** upgrade to version 7.5.3 ([3498c33](https://github.com/nodkz/mongodb-memory-server/commit/3498c33929b54aa9d09c63021d4d2393401ce5f7))
* **tslib:** upgrade to version 2.6.0 ([2cbd3dc](https://github.com/nodkz/mongodb-memory-server/commit/2cbd3dc6d68154295bc572dce2e5b120c629ddb1))


### Style

* **MongoBinaryDownload:** fix comment ([615b681](https://github.com/nodkz/mongodb-memory-server/commit/615b681138dc4e23bb44c94c88fa413268eb26a5))

## [8.14.0](https://github.com/nodkz/mongodb-memory-server/compare/v8.13.0...v8.14.0) (2023-08-04)


### Features

* update default-binary 5.0.19 ([296b2f6](https://github.com/nodkz/mongodb-memory-server/commit/296b2f6a4604d6ab1bfc81130b030df829203dac))
* **MongoBinaryDownload:** add option to configure max amount of redirects ([0d81c81](https://github.com/nodkz/mongodb-memory-server/commit/0d81c816eacf2b149ac01cd6bc18088f8486ccbe))
* **MongoBinaryDownload:** follow redirects ([9ec4aee](https://github.com/nodkz/mongodb-memory-server/commit/9ec4aee40d8ac429599b4b97385db1a4ff860c82)), closes [#785](https://github.com/nodkz/mongodb-memory-server/issues/785)


### Dependencies

* **eslint:** upgrade to version 8.46.0 ([713b1a5](https://github.com/nodkz/mongodb-memory-server/commit/713b1a5f5e2040a5297c1d41cf570f0ef7982316))
* **eslint-config-prettier:** upgrade to version 8.10.0 ([097077f](https://github.com/nodkz/mongodb-memory-server/commit/097077ff170f9907ddc7597179f91babdf0cd41a))
* **semver:** upgrade to version 7.5.4 ([f7c4837](https://github.com/nodkz/mongodb-memory-server/commit/f7c483743fdc90ed1eda0fec901d5673d14827f5))
* **tslib:** upgrade to version 2.6.1 ([db16d8f](https://github.com/nodkz/mongodb-memory-server/commit/db16d8fcc6bd9a6735a3f1414d1d3f4420dd9890))

## [8.14.0-beta.1](https://github.com/nodkz/mongodb-memory-server/compare/v8.13.0...v8.14.0-beta.1) (2023-07-07)

Note: this beta was not actually merged into 8.14.0, use 8.15.0 instead

### Features

* **MongoBinaryDownloadUrl:** add ability to overwrite distro used ([826c72e](https://github.com/nodkz/mongodb-memory-server/commit/826c72e1d56d409bc760949797d62fd10dc8eaf8)), closes [#753](https://github.com/nodkz/mongodb-memory-server/issues/753)


### Dependencies

* **@typescript-eslint/*:** upgrade to version 5.61.0 ([121f0fc](https://github.com/nodkz/mongodb-memory-server/commit/121f0fcfb06919dbe3a778db520031f394aa4ea7))
* **eslint:** upgrade to version 8.44.0 ([f7487b1](https://github.com/nodkz/mongodb-memory-server/commit/f7487b1027eead475f3e1057d2990a624e2d7ba4))
* **semver:** upgrade to version 7.5.3 ([3498c33](https://github.com/nodkz/mongodb-memory-server/commit/3498c33929b54aa9d09c63021d4d2393401ce5f7))
* **tslib:** upgrade to version 2.6.0 ([2cbd3dc](https://github.com/nodkz/mongodb-memory-server/commit/2cbd3dc6d68154295bc572dce2e5b120c629ddb1))


### Style

* **MongoBinaryDownload:** fix comment ([615b681](https://github.com/nodkz/mongodb-memory-server/commit/615b681138dc4e23bb44c94c88fa413268eb26a5))


## [8.13.0](https://github.com/nodkz/mongodb-memory-server/compare/v8.12.2...v8.13.0) (2023-06-09)


### Features

* **errors:** add "DownloadError" ([29cfe8c](https://github.com/nodkz/mongodb-memory-server/commit/29cfe8ca066aa4365d2ed8598775d086bd184205))
* **MongoBinaryDownload:** make use of "DownloadError" ([88a7cce](https://github.com/nodkz/mongodb-memory-server/commit/88a7cce7dfff71e471c9fe00b7807a15c09e22e0))
* update binary 4.2 to 4.2.23 ([49816ee](https://github.com/nodkz/mongodb-memory-server/commit/49816ee82bbea452e12a68cdbb66299d76bdc0b2))
* update binary 4.4 to 4.4.22 ([81acdfe](https://github.com/nodkz/mongodb-memory-server/commit/81acdfe5260d18cae5080f72b89ee748b55cef11))
* update default-binary 5.0.18 ([ba37680](https://github.com/nodkz/mongodb-memory-server/commit/ba37680ce86a81b46e21010452f937769a49b50e))


### Dependencies

* **@types/debug:** upgrade to version 4.1.8 ([93e7656](https://github.com/nodkz/mongodb-memory-server/commit/93e765615ef508a3446ce5e945a45eb049c4b16e))
* **@types/semver:** upgrade to version 7.5.0 ([3ca7b73](https://github.com/nodkz/mongodb-memory-server/commit/3ca7b734e48efec61eb59c9c5c60d2d133b4be2f))
* **@types/uuid:** upgrade to version 9.0.2 ([53062cf](https://github.com/nodkz/mongodb-memory-server/commit/53062cf2fcc72ab582f489fa4ca8a69aa5599a2d))
* **@typescript-eslint/*:** upgrade to version 5.59.2 ([ddecab4](https://github.com/nodkz/mongodb-memory-server/commit/ddecab4e0e57f43513e014e9b83a8f20317bcc5d))
* **@typescript-eslint/*:** upgrade to version 5.59.9 ([9e06e33](https://github.com/nodkz/mongodb-memory-server/commit/9e06e33fe69bccc100cd1bb58ecf45c5fec11e23))
* **eslint:** upgrade to version 8.40.0 ([a81a1e1](https://github.com/nodkz/mongodb-memory-server/commit/a81a1e125f09479440af5d90a8d607f98df47db1))
* **eslint:** upgrade to version 8.42.0 ([e9bc6e6](https://github.com/nodkz/mongodb-memory-server/commit/e9bc6e6a4a17d817cead8358c70e304feb42be9a))
* **eslint-config-prettier:** upgrade to version 8.8.0 ([aa54d30](https://github.com/nodkz/mongodb-memory-server/commit/aa54d30a39390d5ba247cf17101dfd3efe8465fa))
* **mongodb:** upgrade to version 4.16.0 ([b3932d0](https://github.com/nodkz/mongodb-memory-server/commit/b3932d06a2247602fa6c7ada6de102a7a8d3727d))
* **prettier:** upgrade to version 2.8.8 ([8d87060](https://github.com/nodkz/mongodb-memory-server/commit/8d87060470eb096abf5b656b31e60eaed83b44e9))
* **semver:** upgrade to version 7.5.0 ([ea87f23](https://github.com/nodkz/mongodb-memory-server/commit/ea87f234de0f26182dbc12e65a716f7a0dabb5ae))
* **semver:** upgrade to version 7.5.1 ([2856cfd](https://github.com/nodkz/mongodb-memory-server/commit/2856cfdce5e85aa50e09a8d3a6e99ad1b4d06bd4))
* **tslib:** upgrade to version 2.5.3 ([f297cb2](https://github.com/nodkz/mongodb-memory-server/commit/f297cb26a81945f6c4cfed8fa4a38905f5f20b8e))

## [8.12.2](https://github.com/nodkz/mongodb-memory-server/compare/v8.12.1...v8.12.2) (2023-04-04)


### Style

* fix minor grammar mistakes ([#756](https://github.com/nodkz/mongodb-memory-server/issues/756)) ([661468f](https://github.com/nodkz/mongodb-memory-server/commit/661468fafccc91ec276a342111b370d8e349a911))


### Fixes

* **MongoBinaryDownloadUrl:** update mapping for arch to "ubuntu2204" ([20dab94](https://github.com/nodkz/mongodb-memory-server/commit/20dab94e2427771f0d84d58237ba7af083b11d19))

## [8.12.1](https://github.com/nodkz/mongodb-memory-server/compare/v8.12.0...v8.12.1) (2023-03-17)


### Fixes

* **errors:** add helper message if exit code is large on windows for "UnexpectedCloseError" ([d066643](https://github.com/nodkz/mongodb-memory-server/commit/d066643d93fed6e2bd2b5f744891130bf2185b90)), closes [#748](https://github.com/nodkz/mongodb-memory-server/issues/748)
* **MongoInstance::closeHandler:** actually dont error with code 12 on windows ([0668c35](https://github.com/nodkz/mongodb-memory-server/commit/0668c355cf6bc01525a11727633b13716c5af712))

## [8.12.0](https://github.com/nodkz/mongodb-memory-server/compare/v8.11.5...v8.12.0) (2023-03-08)


### Features

* **MongoMemoryReplSet:** remove usage of "tmp" package ([3690a00](https://github.com/nodkz/mongodb-memory-server/commit/3690a00dd32171def601edc28d6debb324e708b2))
* **MongoMemoryServer:** remove usage of "tmp" package ([6911daf](https://github.com/nodkz/mongodb-memory-server/commit/6911dafe3e52e353306ac78883f88ab16c36f442))
* **utils:** add function "createTmpDir" and "removeDir" ([62d7876](https://github.com/nodkz/mongodb-memory-server/commit/62d78761134ae53d54e633c346e9d78518525e1d))


### Dependencies

* **@types/uuid:** upgrade to version 9.0.1 ([5fb105c](https://github.com/nodkz/mongodb-memory-server/commit/5fb105caf41c454193eda7635b40adc8ffa4e791))
* **@typescript-eslint/*:** upgrade to version 5.54.1 ([db3d2b5](https://github.com/nodkz/mongodb-memory-server/commit/db3d2b52c7277e4b2cca7092d441cfae6d97a08c))
* **eslint:** upgrade to version 8.35.0 ([665f90f](https://github.com/nodkz/mongodb-memory-server/commit/665f90f8bde943d00e561021f88a1cb41ed41d0d))
* **eslint-config-prettier:** upgrade to version 8.7.0 ([7260324](https://github.com/nodkz/mongodb-memory-server/commit/72603240eca01908bf1928f0a3b7084ffb7ccb17))
* **prettier:** upgrade to version 2.8.4 ([07196a9](https://github.com/nodkz/mongodb-memory-server/commit/07196a99747e7027e818bd8508f5011531216b1f))
* **tslib:** upgrade to version 2.5.0 ([26166e7](https://github.com/nodkz/mongodb-memory-server/commit/26166e711da9c56a740c54279630785b0e06fc9c))
* remove "tmp" and "@types/tmp" ([5e718ee](https://github.com/nodkz/mongodb-memory-server/commit/5e718ee2b10c830d3f9b8e29f8cdeb5d1884bc89))


### Refactor

* **MongoMemoryServer::cleanup:** use "utils.removeDir" instead of custom ([2f1f2e8](https://github.com/nodkz/mongodb-memory-server/commit/2f1f2e8efd46efd7012d11e0555cc6955dd7495e))

## [8.11.5](https://github.com/nodkz/mongodb-memory-server/compare/v8.11.4...v8.11.5) (2023-02-21)


### Style

* **resolveConfig:** dont enable debug mode twice ([6ae0c73](https://github.com/nodkz/mongodb-memory-server/commit/6ae0c73f3d0563716b823780ca5d14fea4c41a04)), closes [#745](https://github.com/nodkz/mongodb-memory-server/issues/745)


### Fixes

* **MongoBinaryDownloadUrl:** add support for Oracle Linux ([75fa22e](https://github.com/nodkz/mongodb-memory-server/commit/75fa22e9a227d1f82b9014fad535ca31159de00e)), closes [#746](https://github.com/nodkz/mongodb-memory-server/issues/746)

## [8.11.4](https://github.com/nodkz/mongodb-memory-server/compare/v8.11.3...v8.11.4) (2023-01-23)


### Fixes

* **getos:** check if given os is also not UNKNOWN and try different formats ([66541de](https://github.com/nodkz/mongodb-memory-server/commit/66541de422f7a720d49d681c9348005393ce8f09)), closes [#735](https://github.com/nodkz/mongodb-memory-server/issues/735)
* **MongoBinaryDownloadUrl::getUbuntuVersionString:** change "os" for elementary to be optional ([0e90784](https://github.com/nodkz/mongodb-memory-server/commit/0e90784835f4c816e7c9b5bfbb062dc098dd1293)), closes [#735](https://github.com/nodkz/mongodb-memory-server/issues/735)

## [8.11.3](https://github.com/nodkz/mongodb-memory-server/compare/v8.11.2...v8.11.3) (2023-01-19)


### Fixes

* **MongoBinaryDownloadUrl:** support ubuntu 22.04 ^6.0.4 ([6598792](https://github.com/nodkz/mongodb-memory-server/commit/6598792b2fd379a78da97f413fbc4a964f89f785)), closes [#732](https://github.com/nodkz/mongodb-memory-server/issues/732)

## [8.11.2](https://github.com/nodkz/mongodb-memory-server/compare/v8.11.1...v8.11.2) (2023-01-18)


### Fixes

* **errors:** add error "UnknownVersionError" ([5676931](https://github.com/nodkz/mongodb-memory-server/commit/5676931f82f538762f076d7a4efb8f0bd546ea22))
* **MongoBinaryDownload:** use coerced versions for semver ([10d1749](https://github.com/nodkz/mongodb-memory-server/commit/10d17497b8882d6d68400410d6bd7fd0ae8deb97)), closes [#734](https://github.com/nodkz/mongodb-memory-server/issues/734)
* **MongoBinaryDownloadUrl:** handle cases where patch version is checked and "-latest" was requested ([690aa42](https://github.com/nodkz/mongodb-memory-server/commit/690aa426d390f3f7c44700b07dfa41dc74a2d953))
* **MongoBinaryDownloadUrl::getRhelVersionString:** handle versions above 8 ([7c2d490](https://github.com/nodkz/mongodb-memory-server/commit/7c2d4901f7bf2a8fc442cf13e82bada426b30e41))

## [8.11.1](https://github.com/nodkz/mongodb-memory-server/compare/v8.11.0...v8.11.1) (2023-01-13)


### Fixes

* **MongoMemoryReplSet:** pass-through option "launchTimeout" correctly ([575f07a](https://github.com/nodkz/mongodb-memory-server/commit/575f07adbd5df379d31db8cf5d0caba7eed0e43c))

## [8.11.0](https://github.com/nodkz/mongodb-memory-server/compare/v8.10.2...v8.11.0) (2023-01-06)


### Features

* update default-binary 5.0.13 ([5375af3](https://github.com/nodkz/mongodb-memory-server/commit/5375af34526efe0a33f2104ca41d00c8e8589013)), closes [#727](https://github.com/nodkz/mongodb-memory-server/issues/727)


### Fixes

* **MongoBinaryDownloadUrl::getRhelVersionString:** add warning for unhandled rhel versions ([ad71f21](https://github.com/nodkz/mongodb-memory-server/commit/ad71f219146818cdad550d916227b99c9d796f93))
* **MongoBinaryDownloadUrl::getRhelVersionString:** refactor to better compare versions ([6a38d17](https://github.com/nodkz/mongodb-memory-server/commit/6a38d17374fca93d9c4d275320955aaf9432b433)), closes [#726](https://github.com/nodkz/mongodb-memory-server/issues/726)


### Style

* **MongoBinaryDownload:** add status code to "status is not 200" error ([ad304ee](https://github.com/nodkz/mongodb-memory-server/commit/ad304eeed40eca0085d93c1887fc1588a7bba3db)), closes [#720](https://github.com/nodkz/mongodb-memory-server/issues/720)
* **MongoBinaryDownload:** rename error variables from "e" to "err" ([f7d811e](https://github.com/nodkz/mongodb-memory-server/commit/f7d811ee94910a84503a2717092fe60454476a4d))
* **MongoBinaryDownloadUrl:** update tsdoc comments ([4af629c](https://github.com/nodkz/mongodb-memory-server/commit/4af629c409b14ca7e735eb15066ed08ce6d73f60))
* **MongoMemoryReplSet:** rename error variables from "e" to "err" ([57d034d](https://github.com/nodkz/mongodb-memory-server/commit/57d034dff4a633f487388a348d8c5c663c677a3a))


### Dependencies

* **@google/semantic-release-replace-plugin:** upgrade to version 1.2.0 ([28f13d8](https://github.com/nodkz/mongodb-memory-server/commit/28f13d8643944b9cb518d099112aaa74965a36bf))
* **@typescript-eslint/*:** upgrade to version 5.48.0 ([7a919ab](https://github.com/nodkz/mongodb-memory-server/commit/7a919ab13edc7edce749e7c19ffc1178595ed0f6))
* **eslint:** upgrade to version 8.31.0 ([16e5a8a](https://github.com/nodkz/mongodb-memory-server/commit/16e5a8ae8926330a79ea0c3a3ae59d9565b5d82e))
* **eslint-config-prettier:** upgrade to version 8.6.0 ([83d0ca9](https://github.com/nodkz/mongodb-memory-server/commit/83d0ca94395793bc86c720b432daf08cef39dc2d))
* **mongodb:** change "~" to "^" again ([605614d](https://github.com/nodkz/mongodb-memory-server/commit/605614db338a0e7c667dcfbb38439cca337277cd))
* **mongodb:** upgrade to version 4.13.0 ([dfbccc3](https://github.com/nodkz/mongodb-memory-server/commit/dfbccc353ea144f6b3fea9d0a6b2e7e760fd9d97))
* **prettier:** upgrade to version 2.8.1 ([14e3e7d](https://github.com/nodkz/mongodb-memory-server/commit/14e3e7d4113f51045b5192a4b9fc0aea8bd86378))
* **uuid:** upgrade to version 9.0.0 ([1f32d9c](https://github.com/nodkz/mongodb-memory-server/commit/1f32d9cf8c5d7b7546b9a8ec6c9868de5a837ed5))

## [8.10.2](https://github.com/nodkz/mongodb-memory-server/compare/v8.10.1...v8.10.2) (2022-12-11)


### Fixes

* **MongoBinaryDownload::httpDownload:** update 403 error message links ([b9307bd](https://github.com/nodkz/mongodb-memory-server/commit/b9307bd3b615e283d0b43d971ac0981bf23e014b))

## [8.10.1](https://github.com/nodkz/mongodb-memory-server/compare/v8.10.0...v8.10.1) (2022-11-25)


### Fixes

* **MongoInstance:** move getting / downloading the binary before creating the launchTimeout ([619d1fa](https://github.com/nodkz/mongodb-memory-server/commit/619d1fab5cece44865e40261bab9313027dbe44f)), closes [#719](https://github.com/nodkz/mongodb-memory-server/issues/719)

## [8.10.0](https://github.com/nodkz/mongodb-memory-server/compare/v8.9.5...v8.10.0) (2022-11-09)


### Features

* **MongoBinaryDownloadUrl:** support native macos arm64 binaries for 6.0.0 and up ([9b0dfb1](https://github.com/nodkz/mongodb-memory-server/commit/9b0dfb10dd56765d27fad77ecc52f9ad2409412a)), closes [#714](https://github.com/nodkz/mongodb-memory-server/issues/714)


### Dependencies

* **@types/jest:** upgrade to version 28.1.8 ([7eaaeb1](https://github.com/nodkz/mongodb-memory-server/commit/7eaaeb1d55ce44e5ca8903b4875ebabbb6c314cf))
* **@types/semver:** upgrade to version 7.3.13 ([aa5ca3b](https://github.com/nodkz/mongodb-memory-server/commit/aa5ca3baadfb42cd20daae26a1bd77c36c7acc35))
* **@typescript-eslint/*:** upgrade to version 5.42.1 ([038b07e](https://github.com/nodkz/mongodb-memory-server/commit/038b07ef8d741b58a75526504c1236989ab86466))
* **doctoc:** upgrade to version 2.2.1 ([3c1deb9](https://github.com/nodkz/mongodb-memory-server/commit/3c1deb959de058aa07824b458d310e3f342660fb))
* **eslint:** upgrade to version 8.27.0 ([31fece5](https://github.com/nodkz/mongodb-memory-server/commit/31fece53a05d4a1f0e8b4f50c34283efbbd158f7))
* **mongodb:** upgrade to version 4.11.0 ([999bc2c](https://github.com/nodkz/mongodb-memory-server/commit/999bc2cf2fad683d52ffbbe7f34b0fcc78f3275b))
* **semver:** upgrade to version 7.3.8 ([9e09446](https://github.com/nodkz/mongodb-memory-server/commit/9e09446cec4768c6ed7147ea8561fae8a0509ce6))
* **tslib:** upgrade to version 2.4.1 ([5524cf6](https://github.com/nodkz/mongodb-memory-server/commit/5524cf6ad4ee2787bac699d4fe15dd100ccc65ab))

## [8.9.5](https://github.com/nodkz/mongodb-memory-server/compare/v8.9.4...v8.9.5) (2022-10-31)


### Fixes

* **MongoMemoryServer:** pass-through option "launchTimeout" correctly ([6ffe62a](https://github.com/nodkz/mongodb-memory-server/commit/6ffe62a7c4b2e928dc16ca0c6beea6e80e5a107b)), closes [#710](https://github.com/nodkz/mongodb-memory-server/issues/710)

## [8.9.4](https://github.com/nodkz/mongodb-memory-server/compare/v8.9.3...v8.9.4) (2022-10-28)


### Fixes

* **MongoInstance:** add a timeout for the "launch" promise ([f822856](https://github.com/nodkz/mongodb-memory-server/commit/f822856ca4bb9c53a229a0399f00966fa6023e25)), closes [#710](https://github.com/nodkz/mongodb-memory-server/issues/710)

## [8.9.3](https://github.com/nodkz/mongodb-memory-server/compare/v8.9.2...v8.9.3) (2022-09-25)


### Style

* **MongoMemoryReplSet:** update log to more current implementation ([256d65b](https://github.com/nodkz/mongodb-memory-server/commit/256d65b850d80a1d6d499a18982316d216b465f8))
* **MongoMemoryServer.test:** remove unused "ts-expect-error" directive ([5020be8](https://github.com/nodkz/mongodb-memory-server/commit/5020be8c7c2b63da4feb06e8d7b4b10710fb0284))


### Fixes

* **MongoMemoryReplSet:** fix creating auth regardless of "enableAuth" ([78d5aee](https://github.com/nodkz/mongodb-memory-server/commit/78d5aee1869bc494f971391c5c28e06abd57a825))
* **MongoMemoryServer:** dont set "extraConnectionOptions" when auth-object is disabled ([80d6fe1](https://github.com/nodkz/mongodb-memory-server/commit/80d6fe1248371efc94997d0f05bdd38209bb0f4a))

## [8.9.2](https://github.com/nodkz/mongodb-memory-server/compare/v8.9.1...v8.9.2) (2022-09-15)


### Fixes

* **errors::UnexpectedCloseError:** add Error ([ce6462e](https://github.com/nodkz/mongodb-memory-server/commit/ce6462eab69319428c43bea280ef6d3da5ec509d))
* **errors::UnexpectedCloseError:** add extra message on SIGILL ([2c54e1f](https://github.com/nodkz/mongodb-memory-server/commit/2c54e1f5b3a53014f5aacd1522cc7069cdbf9f0f)), closes [#693](https://github.com/nodkz/mongodb-memory-server/issues/693) [#692](https://github.com/nodkz/mongodb-memory-server/issues/692) [#687](https://github.com/nodkz/mongodb-memory-server/issues/687)
* **MongoInstance::closeHandler:** emit "instanceError" on non-0 (or non-12) code ([fbd0747](https://github.com/nodkz/mongodb-memory-server/commit/fbd07478c124920d8efc41c7ddd68973fb4dab1a)), closes [#693](https://github.com/nodkz/mongodb-memory-server/issues/693)


### Style

* **MongoInstance:** change a arrow function to a named function for debugging ([704bc64](https://github.com/nodkz/mongodb-memory-server/commit/704bc64d1f77cc621e51bbd80be07eceb1d610d0))
* **MongoInstance::closeHandler:** add note that "instanceError" gets emitted on signal ([c01fec7](https://github.com/nodkz/mongodb-memory-server/commit/c01fec709a947ff3e3fa8ebd8b5b970c099e7a07))
* **MongoInstance::closeHandler:** correct parameter types to include "null" ([e052aa1](https://github.com/nodkz/mongodb-memory-server/commit/e052aa13ac8c7dd5f49113a277e487c3f54c5090))

## [8.9.1](https://github.com/nodkz/mongodb-memory-server/compare/v8.9.0...v8.9.1) (2022-09-01)


### Fixes

* **MongoInstance::checkErrorInLine:** handle json output of error "DBException in initAndListen" ([2131df2](https://github.com/nodkz/mongodb-memory-server/commit/2131df2d9f6d8a20f0e6d92d92727287ea19ab44))

## [8.9.0](https://github.com/nodkz/mongodb-memory-server/compare/v8.8.0...v8.9.0) (2022-08-22)


### Features

* **errors:** add generic MMS Error ([7fc4acc](https://github.com/nodkz/mongodb-memory-server/commit/7fc4accd8bdd18f82d67a2cb321259a1bc5793c7))
* **MongoBinaryDownload::extract:** dont include ".dll" files in the filter anymore ([a7c685b](https://github.com/nodkz/mongodb-memory-server/commit/a7c685b8a91e898917386f38217f07c346b132ea))


### Style

* **MongoBinaryDownload::extractTarGz:** rename some variables to current convention ([bcb4dab](https://github.com/nodkz/mongodb-memory-server/commit/bcb4dab07b49505c63ec23c3d1f2a65ef2384ece))


### Fixes

* **MongoBinaryDownload::extractTarGz:** wrap error messages in "GenericMMSError" ([a8733dc](https://github.com/nodkz/mongodb-memory-server/commit/a8733dc4d5f14b5f71e086b2c93bf1423e548be2))
* **MongoMemoryReplSet::_initReplSet:** use "extraConnectionOptions" when "_ranCreateAuth" is "true" ([e116128](https://github.com/nodkz/mongodb-memory-server/commit/e1161284addab03b41b51be8c2dfb7617b5bae19))
* **MongoMemoryReplSet::cleanup:** reset "_ranCreateAuth" on cleanup ([2fc87e7](https://github.com/nodkz/mongodb-memory-server/commit/2fc87e77183418b6ed21902afdb35d5b806a9215))


### Refactor

* **MongoBinaryDownloadUrl::translateArch:** combine case "arm64" & "aarch64" ([4eb48da](https://github.com/nodkz/mongodb-memory-server/commit/4eb48dae1fd94934d1c891eecdae745b0d7dd28f))


### Dependencies

* **@types/jest:** upgrade to version 28.1.7 ([db3e729](https://github.com/nodkz/mongodb-memory-server/commit/db3e72936e5696570a12dc706cebaa5bf307e3ac))
* **@types/semver:** upgrade to version 7.3.12 ([8c61c71](https://github.com/nodkz/mongodb-memory-server/commit/8c61c714806cceeefe22fe51b834705eb2e69cba))
* **@typescript-eslint/*:** upgrade to version 5.33.1 ([cb0e223](https://github.com/nodkz/mongodb-memory-server/commit/cb0e223073b41cdb9c0dd6578c14b953cb643cbf))
* **eslint:** upgrade to version 8.22.0 ([01591eb](https://github.com/nodkz/mongodb-memory-server/commit/01591eb3adb7eb75dcb1f5cdf85905857725dab4))
* **mongodb:** upgrade to version 4.9.0 ([a0b5599](https://github.com/nodkz/mongodb-memory-server/commit/a0b5599bad49f0b1f1d554c22f2d46b4c29b1712)), closes [#676](https://github.com/nodkz/mongodb-memory-server/issues/676)
* **ts-jest:** upgrade to version 28.0.8 ([10bb530](https://github.com/nodkz/mongodb-memory-server/commit/10bb53001ad4957f885cd7d525aa5660683c2a25))

## [8.9.0-beta.3](https://github.com/nodkz/mongodb-memory-server/compare/v8.9.0-beta.2...v8.9.0-beta.3) (2022-08-21)


### Dependencies

* **mongodb:** upgrade to version 4.9.0 ([a0b5599](https://github.com/nodkz/mongodb-memory-server/commit/a0b5599bad49f0b1f1d554c22f2d46b4c29b1712)), closes [#676](https://github.com/nodkz/mongodb-memory-server/issues/676)

## [8.9.0-beta.2](https://github.com/nodkz/mongodb-memory-server/compare/v8.9.0-beta.1...v8.9.0-beta.2) (2022-08-17)


### Refactor

* **MongoBinaryDownloadUrl::translateArch:** combine case "arm64" & "aarch64" ([4eb48da](https://github.com/nodkz/mongodb-memory-server/commit/4eb48dae1fd94934d1c891eecdae745b0d7dd28f))

## [8.9.0-beta.1](https://github.com/nodkz/mongodb-memory-server/compare/v8.8.0...v8.9.0-beta.1) (2022-08-17)


### Features

* **errors:** add generic MMS Error ([7fc4acc](https://github.com/nodkz/mongodb-memory-server/commit/7fc4accd8bdd18f82d67a2cb321259a1bc5793c7))
* **MongoBinaryDownload::extract:** dont include ".dll" files in the filter anymore ([a7c685b](https://github.com/nodkz/mongodb-memory-server/commit/a7c685b8a91e898917386f38217f07c346b132ea))


### Style

* **MongoBinaryDownload::extractTarGz:** rename some variables to current convention ([bcb4dab](https://github.com/nodkz/mongodb-memory-server/commit/bcb4dab07b49505c63ec23c3d1f2a65ef2384ece))


### Fixes

* **MongoBinaryDownload::extractTarGz:** wrap error messages in "GenericMMSError" ([a8733dc](https://github.com/nodkz/mongodb-memory-server/commit/a8733dc4d5f14b5f71e086b2c93bf1423e548be2))
* **MongoMemoryReplSet::_initReplSet:** use "extraConnectionOptions" when "_ranCreateAuth" is "true" ([e116128](https://github.com/nodkz/mongodb-memory-server/commit/e1161284addab03b41b51be8c2dfb7617b5bae19))
* **MongoMemoryReplSet::cleanup:** reset "_ranCreateAuth" on cleanup ([2fc87e7](https://github.com/nodkz/mongodb-memory-server/commit/2fc87e77183418b6ed21902afdb35d5b806a9215))


### Dependencies

* **@types/jest:** upgrade to version 28.1.7 ([db3e729](https://github.com/nodkz/mongodb-memory-server/commit/db3e72936e5696570a12dc706cebaa5bf307e3ac))
* **@types/semver:** upgrade to version 7.3.12 ([8c61c71](https://github.com/nodkz/mongodb-memory-server/commit/8c61c714806cceeefe22fe51b834705eb2e69cba))
* **@typescript-eslint/*:** upgrade to version 5.33.1 ([cb0e223](https://github.com/nodkz/mongodb-memory-server/commit/cb0e223073b41cdb9c0dd6578c14b953cb643cbf))
* **eslint:** upgrade to version 8.22.0 ([01591eb](https://github.com/nodkz/mongodb-memory-server/commit/01591eb3adb7eb75dcb1f5cdf85905857725dab4))
* **ts-jest:** upgrade to version 28.0.8 ([10bb530](https://github.com/nodkz/mongodb-memory-server/commit/10bb53001ad4957f885cd7d525aa5660683c2a25))

## [8.8.0](https://github.com/nodkz/mongodb-memory-server/compare/v8.7.2...v8.8.0) (2022-07-24)


### Features

* **MongoBinaryDownloadUrl:** change to use "aarch64" by  default and map to "arm64" where needed ([ddf1991](https://github.com/nodkz/mongodb-memory-server/commit/ddf19917aa07b1872db4e34fd1165d17f472905c)), closes [#678](https://github.com/nodkz/mongodb-memory-server/issues/678)
* **MongoBinaryDownloadUrl::getRhelVersionString:** add support for aarch64 ([62d96e6](https://github.com/nodkz/mongodb-memory-server/commit/62d96e635bec8ced1dedde3bd65d4926c07f9a1f))
* make use of the "localhost exception" for creating users ([b1f4dc0](https://github.com/nodkz/mongodb-memory-server/commit/b1f4dc01e007454aea5fe3c83df1f71fbaed892d)), closes [#670](https://github.com/nodkz/mongodb-memory-server/issues/670) [#671](https://github.com/nodkz/mongodb-memory-server/issues/671)


### Style

* **MongoBinaryDownloadUrl::getFedoraVersionString:** add comment about 36 ([c168c62](https://github.com/nodkz/mongodb-memory-server/commit/c168c62b0457eee48ce671a1e823dc48572e8b1c)), closes [#673](https://github.com/nodkz/mongodb-memory-server/issues/673)
* **MongoBinaryDownloadUrl::getLegacyVersionString:** remove nonexistent parameter from tsdoc ([417d946](https://github.com/nodkz/mongodb-memory-server/commit/417d946bb79a9b7ecd0980e88253534b225a65db))
* **MongoMemoryServer::AutomaticAuth:** fix typo in tsdoc ([770791b](https://github.com/nodkz/mongodb-memory-server/commit/770791b0e98b25573e0a626b1ebdab279b887d81))


### Fixes

* **MongoMemoryServer:** add some extra context to -86 error on macos-arm ([1f0f045](https://github.com/nodkz/mongodb-memory-server/commit/1f0f045ef89b2a94687fe10e4e7ca500f4df7426)), closes [#674](https://github.com/nodkz/mongodb-memory-server/issues/674)


### Dependencies

* **@types/jest:** upgrade to version 28.1.4 ([627a3b5](https://github.com/nodkz/mongodb-memory-server/commit/627a3b5ba90cf87b5249f40e9627f2b08a637f72))
* **@types/jest:** upgrade to version 28.1.6 ([dff909f](https://github.com/nodkz/mongodb-memory-server/commit/dff909facf013e069861c35a105b0666c39832ac))
* **@typescript-eslint/*:** upgrade to version 5.30.5 ([58cfeaf](https://github.com/nodkz/mongodb-memory-server/commit/58cfeafcc36e1c853e0a5dc2b87c124a56d25e27))
* **@typescript-eslint/*:** upgrade to version 5.30.7 ([f73a26e](https://github.com/nodkz/mongodb-memory-server/commit/f73a26ec7adb75168a2fcf18479a97720e9eab03))
* **eslint:** upgrade to version 8.19.0 ([574c252](https://github.com/nodkz/mongodb-memory-server/commit/574c252f804b20776337260fa5bc770c61722c7f))
* **eslint:** upgrade to version 8.20.0 ([76a4a48](https://github.com/nodkz/mongodb-memory-server/commit/76a4a48ba36c3f54302438f8043fd45a4c32919d))
* **eslint-plugin-prettier:** upgrade to version 4.2.1 ([97145a8](https://github.com/nodkz/mongodb-memory-server/commit/97145a8a71c134ded6677cea5061abc534c61ae1))
* **jest:** upgrade to version 28.1.2 ([c7c7303](https://github.com/nodkz/mongodb-memory-server/commit/c7c73037ddaaf619a8395de6764d2e92c73b9b02))
* **jest:** upgrade to version 28.1.3 ([2ade5c3](https://github.com/nodkz/mongodb-memory-server/commit/2ade5c31a6e323aa438b0596a7481d12f4a95d36))
* **mongodb:** set version to be "~" ([8a5552a](https://github.com/nodkz/mongodb-memory-server/commit/8a5552a8db0ac33524f573176240a4b53412546e))
* **ts-jest:** upgrade to version 28.0.7 ([fa9975d](https://github.com/nodkz/mongodb-memory-server/commit/fa9975d20566a704cdebc634d222de61bc475ec4))

## [8.8.0-beta.3](https://github.com/nodkz/mongodb-memory-server/compare/v8.8.0-beta.2...v8.8.0-beta.3) (2022-07-24)


### Features

* **MongoBinaryDownloadUrl:** change to use "aarch64" by  default and map to "arm64" where needed ([ddf1991](https://github.com/nodkz/mongodb-memory-server/commit/ddf19917aa07b1872db4e34fd1165d17f472905c)), closes [#678](https://github.com/nodkz/mongodb-memory-server/issues/678)
* **MongoBinaryDownloadUrl::getRhelVersionString:** add support for aarch64 ([62d96e6](https://github.com/nodkz/mongodb-memory-server/commit/62d96e635bec8ced1dedde3bd65d4926c07f9a1f))


### Dependencies

* **@types/jest:** upgrade to version 28.1.6 ([dff909f](https://github.com/nodkz/mongodb-memory-server/commit/dff909facf013e069861c35a105b0666c39832ac))
* **@typescript-eslint/*:** upgrade to version 5.30.7 ([f73a26e](https://github.com/nodkz/mongodb-memory-server/commit/f73a26ec7adb75168a2fcf18479a97720e9eab03))
* **eslint:** upgrade to version 8.20.0 ([76a4a48](https://github.com/nodkz/mongodb-memory-server/commit/76a4a48ba36c3f54302438f8043fd45a4c32919d))
* **jest:** upgrade to version 28.1.3 ([2ade5c3](https://github.com/nodkz/mongodb-memory-server/commit/2ade5c31a6e323aa438b0596a7481d12f4a95d36))
* **mongodb:** set version to be "~" ([8a5552a](https://github.com/nodkz/mongodb-memory-server/commit/8a5552a8db0ac33524f573176240a4b53412546e))
* **ts-jest:** upgrade to version 28.0.7 ([fa9975d](https://github.com/nodkz/mongodb-memory-server/commit/fa9975d20566a704cdebc634d222de61bc475ec4))

## [8.8.0-beta.2](https://github.com/nodkz/mongodb-memory-server/compare/v8.8.0-beta.1...v8.8.0-beta.2) (2022-07-13)


### Style

* **MongoBinaryDownloadUrl::getFedoraVersionString:** add comment about 36 ([c168c62](https://github.com/nodkz/mongodb-memory-server/commit/c168c62b0457eee48ce671a1e823dc48572e8b1c)), closes [#673](https://github.com/nodkz/mongodb-memory-server/issues/673)
* **MongoBinaryDownloadUrl::getLegacyVersionString:** remove nonexistent parameter from tsdoc ([417d946](https://github.com/nodkz/mongodb-memory-server/commit/417d946bb79a9b7ecd0980e88253534b225a65db))


### Fixes

* **MongoMemoryServer:** add some extra context to -86 error on macos-arm ([1f0f045](https://github.com/nodkz/mongodb-memory-server/commit/1f0f045ef89b2a94687fe10e4e7ca500f4df7426)), closes [#674](https://github.com/nodkz/mongodb-memory-server/issues/674)

## [8.8.0-beta.1](https://github.com/nodkz/mongodb-memory-server/compare/v8.7.2...v8.8.0-beta.1) (2022-07-05)


### Features

* make use of the "localhost exception" for creating users ([b1f4dc0](https://github.com/nodkz/mongodb-memory-server/commit/b1f4dc01e007454aea5fe3c83df1f71fbaed892d)), closes [#670](https://github.com/nodkz/mongodb-memory-server/issues/670) [#671](https://github.com/nodkz/mongodb-memory-server/issues/671)


### Style

* **MongoMemoryServer::AutomaticAuth:** fix typo in tsdoc ([770791b](https://github.com/nodkz/mongodb-memory-server/commit/770791b0e98b25573e0a626b1ebdab279b887d81))


### Dependencies

* **@types/jest:** upgrade to version 28.1.4 ([627a3b5](https://github.com/nodkz/mongodb-memory-server/commit/627a3b5ba90cf87b5249f40e9627f2b08a637f72))
* **@typescript-eslint/*:** upgrade to version 5.30.5 ([58cfeaf](https://github.com/nodkz/mongodb-memory-server/commit/58cfeafcc36e1c853e0a5dc2b87c124a56d25e27))
* **eslint:** upgrade to version 8.19.0 ([574c252](https://github.com/nodkz/mongodb-memory-server/commit/574c252f804b20776337260fa5bc770c61722c7f))
* **eslint-plugin-prettier:** upgrade to version 4.2.1 ([97145a8](https://github.com/nodkz/mongodb-memory-server/commit/97145a8a71c134ded6677cea5061abc534c61ae1))
* **jest:** upgrade to version 28.1.2 ([c7c7303](https://github.com/nodkz/mongodb-memory-server/commit/c7c73037ddaaf619a8395de6764d2e92c73b9b02))

## [8.7.2](https://github.com/nodkz/mongodb-memory-server/compare/v8.7.1...v8.7.2) (2022-06-29)


### Style

* **MongoInstance::closeHandler:** add explanation in log what value is what ([69f7261](https://github.com/nodkz/mongodb-memory-server/commit/69f726163b92bc1ec2e0df436e37660bb409d41a))
* **utils::killProcess:** remove duplicated function identifier from log ([6d49741](https://github.com/nodkz/mongodb-memory-server/commit/6d497416f7d4965467ba9df41b90f835d4a45be3))


### Fixes

* **MongoMemoryReplSet::_initReplSet:** attempt to fix "server selection timed out" when using auth ([17522dc](https://github.com/nodkz/mongodb-memory-server/commit/17522dc069b5954473fb66221a0f6789482e8226))

## [8.7.1](https://github.com/nodkz/mongodb-memory-server/compare/v8.7.0...v8.7.1) (2022-06-22)


### Fixes

* **utils::killProcess:** handle case where input could be undefined at runtime ([209520f](https://github.com/nodkz/mongodb-memory-server/commit/209520f124307ab6e8518d78e64a612d6393ac36)), closes [#666](https://github.com/nodkz/mongodb-memory-server/issues/666)

## [8.7.0](https://github.com/nodkz/mongodb-memory-server/compare/v8.6.1...v8.7.0) (2022-06-20)


### Dependencies

* **@types/jest:** upgrade to version 28.1.2 ([fc76c9c](https://github.com/nodkz/mongodb-memory-server/commit/fc76c9cbae0bd158071f54c1caaf6c364111fb94))
* **@types/semver:** upgrade to version 7.3.10 ([2a41ccf](https://github.com/nodkz/mongodb-memory-server/commit/2a41ccfcfc201bdd454c9f0739de47f93bf1d16d))
* **@typescript-eslint/*:** upgrade to version 5.28.0 ([d4f7d45](https://github.com/nodkz/mongodb-memory-server/commit/d4f7d4552ee4ded43ec3237cd0227f3f103730dc))
* **conventional-changelog-conventionalcommits:** upgrade to version 5.0.0 ([e4474f0](https://github.com/nodkz/mongodb-memory-server/commit/e4474f0bd89b5b2d85b76b39aaacc3ee3d0406c2))
* **eslint:** upgrade to version 8.18.0 ([cde8a0d](https://github.com/nodkz/mongodb-memory-server/commit/cde8a0d059f5446695bcd187f1994a124f4b8e68))
* **jest:** upgrade to version 28.1.1 ([d53fa0f](https://github.com/nodkz/mongodb-memory-server/commit/d53fa0fa30294e3f02090408f5670ec9f7933b0c))
* **mongodb:** upgrade to version 4.7.0 ([8abb888](https://github.com/nodkz/mongodb-memory-server/commit/8abb8888d7315708a218bf9a1bec6735d83761ad))
* **new-find-package-json:** upgrade to version 2.0.0 ([a22d7cb](https://github.com/nodkz/mongodb-memory-server/commit/a22d7cbc6ec0d1577bdcb18996c74553d1321c81))
* **prettier:** upgrade to version 2.7.1 ([74196ad](https://github.com/nodkz/mongodb-memory-server/commit/74196ada571cd93843048844519768d2c46891a8))
* **ts-jest:** upgrade to version 28.0.5 ([695d367](https://github.com/nodkz/mongodb-memory-server/commit/695d3671473b819d9b458b823ff4a9a078752117))

### [8.6.1](https://github.com/nodkz/mongodb-memory-server/compare/v8.6.0...v8.6.1) (2022-06-15)


### Style

* **MongoBinary::MongoBinaryOpts:** remove double parameter definition ([880c445](https://github.com/nodkz/mongodb-memory-server/commit/880c445b062a68dcef88e4cf0587c9fdda917d43))
* **MongoBinaryDownloadUrl:** deprecate "sunos" ([5ba9835](https://github.com/nodkz/mongodb-memory-server/commit/5ba9835f2b55141f5de426fe24e0459570c28ebd))
* **MongoInstance::MongoMemoryInstanceOptsBase:** fix missing argument in tsdoc ([b937ce4](https://github.com/nodkz/mongodb-memory-server/commit/b937ce4e0966b52d1f5077ff41287a827548bb52))
* **MongoInstance::ReplicaMemberConfig:** change "defaultValue" to "default" in tsdoc ([7b0c98e](https://github.com/nodkz/mongodb-memory-server/commit/7b0c98ed69f7ecb8575248464c85b564c74cb04e))


### Fixes

* **MongoInstance::checkErrorInLine:** optimize "exception in initAndListen" regex ([473c278](https://github.com/nodkz/mongodb-memory-server/commit/473c278d9eb790c48e8fa32d9fe6b2c95173e6f9)), closes [#560](https://github.com/nodkz/mongodb-memory-server/issues/560)
* **MongoInstance::checkErrorInLine:** optimize "libsomething: cannot open shared object" regex ([2b733b4](https://github.com/nodkz/mongodb-memory-server/commit/2b733b42dd50ad6cb060c7bf81a8bf8f30a06141)), closes [#560](https://github.com/nodkz/mongodb-memory-server/issues/560)
* **MongoInstance::checkErrorInLine:** replace "replaceAll" with "replace" ([9546cf9](https://github.com/nodkz/mongodb-memory-server/commit/9546cf9db5ed4ad0c37f5979d832b242ad1d390e))

## [8.6.0](https://github.com/nodkz/mongodb-memory-server/compare/v8.5.2...v8.6.0) (2022-05-23)


### Features

* **MongoBinaryDownloadUrl:** add archive generation for gentoo ([39b0a3d](https://github.com/nodkz/mongodb-memory-server/commit/39b0a3da5253180e5a87dec61cfd33258bd6d68d))
* **MongoMemoryReplSet:** change generic "instanceinfo missing" errors to "InstanceInfoError" ([27934a4](https://github.com/nodkz/mongodb-memory-server/commit/27934a4420ac7347248039e7f23886de3b3f419a))
* add environment variable to use archive name for binary name ([2fc0e1a](https://github.com/nodkz/mongodb-memory-server/commit/2fc0e1a52295e88dd78505fff03613a6a0741c07)), closes [#609](https://github.com/nodkz/mongodb-memory-server/issues/609)
* update binary 4.0 to 4.0.28 ([f26f739](https://github.com/nodkz/mongodb-memory-server/commit/f26f73920edfbf55c09e8b0e1df633fa89a6b251))
* update binary 4.2 to 4.2.18 ([3a47739](https://github.com/nodkz/mongodb-memory-server/commit/3a477395f4730b2455ac4260f713d252d5033c9c))
* update binary 4.4 to 4.4.12 ([cde2a4a](https://github.com/nodkz/mongodb-memory-server/commit/cde2a4a3fdc7631045cdbf8251611f87dbf26bad))
* update binary 4.4 to 4.4.13 ([ddaf3f9](https://github.com/nodkz/mongodb-memory-server/commit/ddaf3f988efd85fa71f72dcc94aa3950dfda6f0a))
* **MongoBinaryDownloadUrl::getDebianVersionString:** use debian11 when possible ([8100b2f](https://github.com/nodkz/mongodb-memory-server/commit/8100b2ff42b404831d8f87f7f2040df528f33a09))
* update binary 5.0 to 5.0.8 ([a56e02b](https://github.com/nodkz/mongodb-memory-server/commit/a56e02b7a1dfa889a57dbed3bd6bcf0d6fece9d1))


### Reverts

* Revert "test(MongoMemoryReplSet): enable debug for often open-handle test" ([29e11e1](https://github.com/nodkz/mongodb-memory-server/commit/29e11e1a94ece0f4dcf5d61b629844d9f0ef6278))


### Style

* **DryMongoBinary:** add tsdoc to interfaces ([ba0349c](https://github.com/nodkz/mongodb-memory-server/commit/ba0349ca7373e4974e449a1da270ec1f72edb490))
* **MongoBinaryDownload::makeMD5Check:** change variable names to better represent what they do ([f8c2f05](https://github.com/nodkz/mongodb-memory-server/commit/f8c2f05c7b307a597076fbfef09d0bc9d4e45872))
* **MongoBinaryDownloadUrl:** add more todo notes ([1a1bfa7](https://github.com/nodkz/mongodb-memory-server/commit/1a1bfa7521a01133c774a47811a90edb8a970947))
* **MongoBinaryDownloadUrl:** add todo for ubuntu "14" default ([75d8d24](https://github.com/nodkz/mongodb-memory-server/commit/75d8d244133f0c2c4e7da67886294d44f4005a11))
* **MongoBinaryDownloadUrl:** change comment to be more helpful ([2f70f53](https://github.com/nodkz/mongodb-memory-server/commit/2f70f5378bd26490df8c664c56058b630e06296d))
* **MongoMemoryReplSet::_initReplSet:** add todo ([884bda5](https://github.com/nodkz/mongodb-memory-server/commit/884bda5d49adc8eb0f2c48b0e09d2a05c643cfbb))
* **MongoMemoryReplSet::stop:** rename internal variable to make more sense ([a86c321](https://github.com/nodkz/mongodb-memory-server/commit/a86c321a9340ffc0de5eff0a709bcfc2cf21c870))
* **MongoMemoryServer::createAuth:** change comment to make more sense ([4df5b41](https://github.com/nodkz/mongodb-memory-server/commit/4df5b4182d1a09fed673dcab8ecd30421e2b4797))
* **resolveConfig:** add tsdoc to some values and interfaces ([9b9f327](https://github.com/nodkz/mongodb-memory-server/commit/9b9f327a3a952ce155129e3d08ec54ba5406802c))
* **resolveConfig:** remove commented out variable ([ac854c9](https://github.com/nodkz/mongodb-memory-server/commit/ac854c920ca53c55f8cb249533de7bffe4735ad9))


### Refactor

* change uses of deprecated ".stop(false)" to explicit object ([dbcd00a](https://github.com/nodkz/mongodb-memory-server/commit/dbcd00a8342f2293c26d103523c7f0828492c974))


### Fixes

* **MongoBinaryDownloadUrl::translateArch:** add deprecation notice for "ia32" ([2614d18](https://github.com/nodkz/mongodb-memory-server/commit/2614d181c4cecf96540ca8c52d44b8be7fe4cf12)), closes [#638](https://github.com/nodkz/mongodb-memory-server/issues/638)
* **MongoBinaryDownloadUrl.ts:** Add current openSUSE Leap relase version ([2904d7e](https://github.com/nodkz/mongodb-memory-server/commit/2904d7e88e9c4db1a68a071d5994b4c4b30070e2))
* **MongoMemoryServer::createAuth:** handle connection erroring and maybe not closing ([9bad913](https://github.com/nodkz/mongodb-memory-server/commit/9bad91302b503c7627829ae2359fb8832909b7ac))


### Dependencies

* **@types/jest:** upgrade to version 27.5.0 ([7749b59](https://github.com/nodkz/mongodb-memory-server/commit/7749b595709055dc56e62cb769a36178da57e1f7))
* **@types/jest:** upgrade to version 27.5.1 ([7d678c7](https://github.com/nodkz/mongodb-memory-server/commit/7d678c7231cf5677e4e572c64ac596f83377127d))
* **@typescript-eslint/*:** upgrade to version 5.22.0 ([e495884](https://github.com/nodkz/mongodb-memory-server/commit/e495884991e94c03fc8a1f082fe83db1aa183881))
* **@typescript-eslint/*:** upgrade to version 5.26.0 ([b7f53af](https://github.com/nodkz/mongodb-memory-server/commit/b7f53af7ce32c201c35757bbe600ff6ce7c7753c))
* **commitlint:** upgrade to version 16.2.4 ([ad3b242](https://github.com/nodkz/mongodb-memory-server/commit/ad3b242de7df80e74aeb17efe053f3b415ee14c7))
* **doctoc:** upgrade to version 2.2.0 ([7591372](https://github.com/nodkz/mongodb-memory-server/commit/7591372c8679f40a32ee451d14e340dbf2685f10))
* **eslint:** upgrade to version 8.14.0 ([08fb188](https://github.com/nodkz/mongodb-memory-server/commit/08fb188a6cb90a8ad5e3fdc16792b02f4dabb6e2))
* **eslint:** upgrade to version 8.16.0 ([1b19581](https://github.com/nodkz/mongodb-memory-server/commit/1b1958188325a64c828ca5528ac0706f50ed42da))
* **jest:** upgrade to version 28.0.3 ([1521838](https://github.com/nodkz/mongodb-memory-server/commit/15218382d94bdd4402507b11ae88ea99f9a45970))
* **jest:** upgrade to version 28.1.0 ([1ef0f1f](https://github.com/nodkz/mongodb-memory-server/commit/1ef0f1f8358b98701459521a4a837ee710a592db))
* **ts-jest:** upgrade to version 28.0.2 ([8b8a40d](https://github.com/nodkz/mongodb-memory-server/commit/8b8a40dd9102059efc9b858566c24d9746951ca3))
* **tslib:** upgrade to version 2.4.0 ([0f4713d](https://github.com/nodkz/mongodb-memory-server/commit/0f4713db2ec091d2fca7a3627f9dab0159c5e93d))

## [8.6.0-beta.8](https://github.com/nodkz/mongodb-memory-server/compare/v8.6.0-beta.7...v8.6.0-beta.8) (2022-05-23)


### Reverts

* Revert "test(MongoMemoryReplSet): enable debug for often open-handle test" ([29e11e1](https://github.com/nodkz/mongodb-memory-server/commit/29e11e1a94ece0f4dcf5d61b629844d9f0ef6278))

## [8.6.0-beta.7](https://github.com/nodkz/mongodb-memory-server/compare/v8.6.0-beta.6...v8.6.0-beta.7) (2022-05-23)


### Dependencies

* **@types/jest:** upgrade to version 27.5.1 ([7d678c7](https://github.com/nodkz/mongodb-memory-server/commit/7d678c7231cf5677e4e572c64ac596f83377127d))
* **@typescript-eslint/*:** upgrade to version 5.26.0 ([b7f53af](https://github.com/nodkz/mongodb-memory-server/commit/b7f53af7ce32c201c35757bbe600ff6ce7c7753c))
* **doctoc:** upgrade to version 2.2.0 ([7591372](https://github.com/nodkz/mongodb-memory-server/commit/7591372c8679f40a32ee451d14e340dbf2685f10))
* **eslint:** upgrade to version 8.16.0 ([1b19581](https://github.com/nodkz/mongodb-memory-server/commit/1b1958188325a64c828ca5528ac0706f50ed42da))
* **jest:** upgrade to version 28.1.0 ([1ef0f1f](https://github.com/nodkz/mongodb-memory-server/commit/1ef0f1f8358b98701459521a4a837ee710a592db))
* **ts-jest:** upgrade to version 28.0.2 ([8b8a40d](https://github.com/nodkz/mongodb-memory-server/commit/8b8a40dd9102059efc9b858566c24d9746951ca3))

## [8.6.0-beta.6](https://github.com/nodkz/mongodb-memory-server/compare/v8.6.0-beta.5...v8.6.0-beta.6) (2022-05-19)


### Fixes

* **MongoBinaryDownloadUrl::translateArch:** add deprecation notice for "ia32" ([2614d18](https://github.com/nodkz/mongodb-memory-server/commit/2614d181c4cecf96540ca8c52d44b8be7fe4cf12)), closes [#638](https://github.com/nodkz/mongodb-memory-server/issues/638)
* **MongoMemoryServer::createAuth:** handle connection erroring and maybe not closing ([9bad913](https://github.com/nodkz/mongodb-memory-server/commit/9bad91302b503c7627829ae2359fb8832909b7ac))

## [8.6.0-beta.5](https://github.com/nodkz/mongodb-memory-server/compare/v8.6.0-beta.4...v8.6.0-beta.5) (2022-05-19)


### Features

* **MongoBinaryDownloadUrl:** add archive generation for gentoo ([39b0a3d](https://github.com/nodkz/mongodb-memory-server/commit/39b0a3da5253180e5a87dec61cfd33258bd6d68d))

## [8.6.0-beta.4](https://github.com/nodkz/mongodb-memory-server/compare/v8.6.0-beta.3...v8.6.0-beta.4) (2022-05-04)


### Features

* **MongoMemoryReplSet:** change generic "instanceinfo missing" errors to "InstanceInfoError" ([27934a4](https://github.com/nodkz/mongodb-memory-server/commit/27934a4420ac7347248039e7f23886de3b3f419a))


### Style

* **MongoMemoryReplSet::_initReplSet:** add todo ([884bda5](https://github.com/nodkz/mongodb-memory-server/commit/884bda5d49adc8eb0f2c48b0e09d2a05c643cfbb))
* **MongoMemoryReplSet::stop:** rename internal variable to make more sense ([a86c321](https://github.com/nodkz/mongodb-memory-server/commit/a86c321a9340ffc0de5eff0a709bcfc2cf21c870))
* **MongoMemoryServer::createAuth:** change comment to make more sense ([4df5b41](https://github.com/nodkz/mongodb-memory-server/commit/4df5b4182d1a09fed673dcab8ecd30421e2b4797))


### Refactor

* change uses of deprecated ".stop(false)" to explicit object ([dbcd00a](https://github.com/nodkz/mongodb-memory-server/commit/dbcd00a8342f2293c26d103523c7f0828492c974))

## [8.6.0-beta.3](https://github.com/nodkz/mongodb-memory-server/compare/v8.6.0-beta.2...v8.6.0-beta.3) (2022-05-03)


### Features

* update binary 4.4 to 4.4.13 ([ddaf3f9](https://github.com/nodkz/mongodb-memory-server/commit/ddaf3f988efd85fa71f72dcc94aa3950dfda6f0a))


### Style

* **DryMongoBinary:** add tsdoc to interfaces ([ba0349c](https://github.com/nodkz/mongodb-memory-server/commit/ba0349ca7373e4974e449a1da270ec1f72edb490))
* **MongoBinaryDownload::makeMD5Check:** change variable names to better represent what they do ([f8c2f05](https://github.com/nodkz/mongodb-memory-server/commit/f8c2f05c7b307a597076fbfef09d0bc9d4e45872))
* **resolveConfig:** add tsdoc to some values and interfaces ([9b9f327](https://github.com/nodkz/mongodb-memory-server/commit/9b9f327a3a952ce155129e3d08ec54ba5406802c))
* **resolveConfig:** remove commented out variable ([ac854c9](https://github.com/nodkz/mongodb-memory-server/commit/ac854c920ca53c55f8cb249533de7bffe4735ad9))

## [8.6.0-beta.2](https://github.com/nodkz/mongodb-memory-server/compare/v8.6.0-beta.1...v8.6.0-beta.2) (2022-05-03)


### Features

* **MongoBinaryDownloadUrl::getDebianVersionString:** use debian11 when possible ([8100b2f](https://github.com/nodkz/mongodb-memory-server/commit/8100b2ff42b404831d8f87f7f2040df528f33a09))
* update binary 4.0 to 4.0.28 ([f26f739](https://github.com/nodkz/mongodb-memory-server/commit/f26f73920edfbf55c09e8b0e1df633fa89a6b251))
* update binary 4.2 to 4.2.18 ([3a47739](https://github.com/nodkz/mongodb-memory-server/commit/3a477395f4730b2455ac4260f713d252d5033c9c))
* update binary 4.4 to 4.4.12 ([cde2a4a](https://github.com/nodkz/mongodb-memory-server/commit/cde2a4a3fdc7631045cdbf8251611f87dbf26bad))
* update binary 5.0 to 5.0.8 ([a56e02b](https://github.com/nodkz/mongodb-memory-server/commit/a56e02b7a1dfa889a57dbed3bd6bcf0d6fece9d1))


### Style

* **MongoBinaryDownloadUrl:** add more todo notes ([1a1bfa7](https://github.com/nodkz/mongodb-memory-server/commit/1a1bfa7521a01133c774a47811a90edb8a970947))
* **MongoBinaryDownloadUrl:** add todo for ubuntu "14" default ([75d8d24](https://github.com/nodkz/mongodb-memory-server/commit/75d8d244133f0c2c4e7da67886294d44f4005a11))
* **MongoBinaryDownloadUrl:** change comment to be more helpful ([2f70f53](https://github.com/nodkz/mongodb-memory-server/commit/2f70f5378bd26490df8c664c56058b630e06296d))

## [8.6.0-beta.1](https://github.com/nodkz/mongodb-memory-server/compare/v8.5.3-beta.1...v8.6.0-beta.1) (2022-05-03)


### Features

* add environment variable to use archive name for binary name ([2fc0e1a](https://github.com/nodkz/mongodb-memory-server/commit/2fc0e1a52295e88dd78505fff03613a6a0741c07)), closes [#609](https://github.com/nodkz/mongodb-memory-server/issues/609)


### Dependencies

* **@types/jest:** upgrade to version 27.5.0 ([7749b59](https://github.com/nodkz/mongodb-memory-server/commit/7749b595709055dc56e62cb769a36178da57e1f7))
* **@typescript-eslint/*:** upgrade to version 5.22.0 ([e495884](https://github.com/nodkz/mongodb-memory-server/commit/e495884991e94c03fc8a1f082fe83db1aa183881))
* **commitlint:** upgrade to version 16.2.4 ([ad3b242](https://github.com/nodkz/mongodb-memory-server/commit/ad3b242de7df80e74aeb17efe053f3b415ee14c7))
* **eslint:** upgrade to version 8.14.0 ([08fb188](https://github.com/nodkz/mongodb-memory-server/commit/08fb188a6cb90a8ad5e3fdc16792b02f4dabb6e2))
* **jest:** upgrade to version 28.0.3 ([1521838](https://github.com/nodkz/mongodb-memory-server/commit/15218382d94bdd4402507b11ae88ea99f9a45970))
* **tslib:** upgrade to version 2.4.0 ([0f4713d](https://github.com/nodkz/mongodb-memory-server/commit/0f4713db2ec091d2fca7a3627f9dab0159c5e93d))

### [8.5.3-beta.1](https://github.com/nodkz/mongodb-memory-server/compare/v8.5.2...v8.5.3-beta.1) (2022-05-03)


Note: this release is a "error" because this change was included earlier, but had the wrong merge branch on merge

### Fixes

* **MongoBinaryDownloadUrl.ts:** Add current openSUSE Leap relase version ([2904d7e](https://github.com/nodkz/mongodb-memory-server/commit/2904d7e88e9c4db1a68a071d5994b4c4b30070e2))

### [8.5.2](https://github.com/nodkz/mongodb-memory-server/compare/v8.5.1...v8.5.2) (2022-04-29)


### Fixes

* **MongoMemory*::start:** add log of the error when async chain throws ([c57da4c](https://github.com/nodkz/mongodb-memory-server/commit/c57da4c3f0e4112c9305e62e217d282923343d4e))
* **MongoMemory*::start:** change error warning to include the error ([238350c](https://github.com/nodkz/mongodb-memory-server/commit/238350c72699c9b558aea2a3a350207244a1f6c4))

### [8.5.1](https://github.com/nodkz/mongodb-memory-server/compare/v8.5.0...v8.5.1) (2022-04-22)


### Fixes

* **MongoInstance:** change that stderrHandler also runs error checks ([4b57634](https://github.com/nodkz/mongodb-memory-server/commit/4b57634ef4f7b96e8250f6fa1f206889715e4a0e)), closes [#632](https://github.com/nodkz/mongodb-memory-server/issues/632)
* **MongoInstance::checkErrorInLine:** fix regex for "cannot open shared object" ([287bcb9](https://github.com/nodkz/mongodb-memory-server/commit/287bcb943f8afb9c6ea6cdb31a1011be8a6d97a0))
* **MongoInstance::checkErrorInLine:** improve error message for "cannot open shared object" ([e930248](https://github.com/nodkz/mongodb-memory-server/commit/e93024830c7a83981d73ce17fca87021aa95d00a))

## [8.5.0](https://github.com/nodkz/mongodb-memory-server/compare/v8.4.2...v8.5.0) (2022-04-16)


### Dependencies

* **@types/jest:** upgrade to version 27.4.1 ([2d5a4da](https://github.com/nodkz/mongodb-memory-server/commit/2d5a4dab7740eb87cffe251bdedd88f73fe0c3da))
* **@types/yauzl:** upgrade to version 2.10.0 ([a1eb48d](https://github.com/nodkz/mongodb-memory-server/commit/a1eb48d870e1324f1df826ecdc85539f3f8c5b25))
* **@typescript-eslint/*:** upgrade to version 5.19.0 ([62b115e](https://github.com/nodkz/mongodb-memory-server/commit/62b115e9eca76b6521259e076bea19ae159dcdce))
* **commitlint:** upgrade to version 16.2.3 ([2ab1d39](https://github.com/nodkz/mongodb-memory-server/commit/2ab1d39be862cc45cd68ba5a07bbff431ee1df4f))
* **debug:** upgrade to version 4.3.4 ([4d99ac6](https://github.com/nodkz/mongodb-memory-server/commit/4d99ac646bf351ba8f2e598b7f200fbc8abf5778))
* **eslint:** upgrade to version 8.13.0 ([6fa2ddd](https://github.com/nodkz/mongodb-memory-server/commit/6fa2dddc188600c6fc0cc060c39cf01befaaea5f))
* **eslint-config-prettier:** upgrade to version 8.5.0 ([ff5b6cc](https://github.com/nodkz/mongodb-memory-server/commit/ff5b6cce0ca6370f9826142d131202b6b9a2f259))
* **https-proxy-agent:** upgrade to version 5.0.1 ([0abccc4](https://github.com/nodkz/mongodb-memory-server/commit/0abccc4230631b455a3a87a4e62f523186de4591))
* **mongodb:** upgrade to version 4.5.0 ([72501f0](https://github.com/nodkz/mongodb-memory-server/commit/72501f05a800db79eefa988dace56b3f95625c5d))
* **prettier:** upgrade to version 2.6.2 ([6bd115b](https://github.com/nodkz/mongodb-memory-server/commit/6bd115b18a7a3745f49f0f742e81531683245221))
* **semver:** upgrade to version 7.3.7 ([e839d72](https://github.com/nodkz/mongodb-memory-server/commit/e839d722487989a60814a5b3387bad7cf79a58a7))
* **ts-jest:** upgrade to version 27.1.4 ([aade2be](https://github.com/nodkz/mongodb-memory-server/commit/aade2bee1dc6e3087b99a9cb848860c1ce5b13b5))

### [8.4.2](https://github.com/nodkz/mongodb-memory-server/compare/v8.4.1...v8.4.2) (2022-03-29)


### Fixes

* **MongoBinary::getPath:** fix mongo binary version matching regex ([#625](https://github.com/nodkz/mongodb-memory-server/issues/625)) ([79911d7](https://github.com/nodkz/mongodb-memory-server/commit/79911d7a006849da76b0346e8cbcf26c6f6aec34)), closes [#624](https://github.com/nodkz/mongodb-memory-server/issues/624)

### [8.4.1](https://github.com/nodkz/mongodb-memory-server/compare/v8.4.0...v8.4.1) (2022-03-14)


### Fixes

* **MongoBinaryDownloadUrl::getUbuntuVersionString:** guard against no mapping ([b28b104](https://github.com/nodkz/mongodb-memory-server/commit/b28b104dd6070e594838fe1e409c1fa5b4b63348)), closes [#616](https://github.com/nodkz/mongodb-memory-server/issues/616)

## [8.4.0](https://github.com/nodkz/mongodb-memory-server/compare/v8.3.0...v8.4.0) (2022-02-21)


### Features

* change cleanup to use object instead of just boolean ([19849e2](https://github.com/nodkz/mongodb-memory-server/commit/19849e2333e5e10196cd454a9032ce05f20865aa)), closes [#581](https://github.com/nodkz/mongodb-memory-server/issues/581)


### Dependencies

* **@typescript-eslint/*:** upgrade to version 5.12.0 ([96427cb](https://github.com/nodkz/mongodb-memory-server/commit/96427cbb29ea2b3ef2a7b089c4fb62747a6137af))
* **commitlint:** upgrade to version 16.2.1 ([e379d8f](https://github.com/nodkz/mongodb-memory-server/commit/e379d8fe5b475ec475d683c6e0b70adca44639a4))
* **eslint:** upgrade to version 8.9.0 ([84ab0a0](https://github.com/nodkz/mongodb-memory-server/commit/84ab0a0564a57d95d223f706b973515e1ff49b85))
* **eslint-config-prettier:** upgrade to version 8.4.0 ([71fed0e](https://github.com/nodkz/mongodb-memory-server/commit/71fed0ebd95673cf05fe7d71728baed52122287e))
* **jest:** upgrade to version 27.5.1 ([60ac034](https://github.com/nodkz/mongodb-memory-server/commit/60ac034787ba4ff360e7b62625b42e877576ad73))
* **mongodb:** upgrade to version 4.4.0 ([124551b](https://github.com/nodkz/mongodb-memory-server/commit/124551b14835fed498918714fef147551c6fd95d))

## [8.3.0](https://github.com/nodkz/mongodb-memory-server/compare/v8.2.1...v8.3.0) (2022-02-05)


### Dependencies

* **@types/node:** upgrade to version 14.14.45 ([73e408f](https://github.com/nodkz/mongodb-memory-server/commit/73e408f2d7df18b6a17f56ecc324f7680059a252))
* **@typescript-eslint/*:** upgrade to version 5.10.2 ([1546e4e](https://github.com/nodkz/mongodb-memory-server/commit/1546e4e183f40731e4f66d680d0bda3c0be66fff))
* **camelcase:** upgrade to version 6.3.0 ([7579fda](https://github.com/nodkz/mongodb-memory-server/commit/7579fda0c487389324032e07be40a01152754986))
* **commitlint:** upgrade to version 16.1.0 ([8fa251c](https://github.com/nodkz/mongodb-memory-server/commit/8fa251c2e89fc8741b10726afb2418252f354178))
* **eslint:** upgrade to version 8.8.0 ([5b9fcf8](https://github.com/nodkz/mongodb-memory-server/commit/5b9fcf83d5a2daf2bbe4006ec361f715416d0a71))
* **jest:** upgrade to version 27.5.0 ([3d28ded](https://github.com/nodkz/mongodb-memory-server/commit/3d28ded11d08a4ccd69959ae2960abba460ea8ac))
* **mongodb:** upgrade to version 4.3.1 ([92e2680](https://github.com/nodkz/mongodb-memory-server/commit/92e2680bf896cf1c7d803a8949d3a5e565f45214))

### [8.2.1](https://github.com/nodkz/mongodb-memory-server/compare/v8.2.0...v8.2.1) (2022-02-05)


### Fixes

* **MongoBinaryDownloadUrl.ts:** Add current openSUSE Leap relase version ([a9ccdbf](https://github.com/nodkz/mongodb-memory-server/commit/a9ccdbfb1fc20d7322d15a01d3e02919aab5a3c9))

## [8.2.0](https://github.com/nodkz/mongodb-memory-server/compare/v8.1.0...v8.2.0) (2022-01-16)


### Features

* run "stop" when startup throws a error ([235a09f](https://github.com/nodkz/mongodb-memory-server/commit/235a09f4d060f49dafaa1c759b25264ab1cc87c2))
* still run "stop" even if state is "stopped" ([ca38110](https://github.com/nodkz/mongodb-memory-server/commit/ca38110ce34c0303170abc26d4c7c7c28669bd83))


### Dependencies

* **@types/jest:** upgrade to version 27.4.0 ([bed1767](https://github.com/nodkz/mongodb-memory-server/commit/bed17678b46cc4d3948dad472e519bbadf88f15b))
* **@types/uuid:** upgrade to version 8.3.4 ([3bc4fcf](https://github.com/nodkz/mongodb-memory-server/commit/3bc4fcfd8173382fa71b06f70c71237e29f5008b))
* **@typescipt-eslint/*:** upgrade to version 5.9.1 ([9c3d950](https://github.com/nodkz/mongodb-memory-server/commit/9c3d95023f21e49d49aea47d0e6ef61659824a2e))
* **commitlint:** upgrade to version 16.0.2 ([0c90e4d](https://github.com/nodkz/mongodb-memory-server/commit/0c90e4d84f238eaebb28914c8998fb2f4b35fbb7))
* **conventional-changelog-conventionalcommits:** upgrade to version 4.6.3 ([d7758fd](https://github.com/nodkz/mongodb-memory-server/commit/d7758fd0f350fb8ad102d2752a7ec0125ce9aa70))
* **eslint:** upgrade to version 7.6.0 ([904aacc](https://github.com/nodkz/mongodb-memory-server/commit/904aacc69b0271ddaad6d46ecbd20a67dcdce9ef))
* **jest:** upgrade to version 27.4.7 ([b9f8a1f](https://github.com/nodkz/mongodb-memory-server/commit/b9f8a1fca57e52619729f343b69875b6360ebb70))
* **ts-jest:** upgrade to version 27.1.3 ([de4e235](https://github.com/nodkz/mongodb-memory-server/commit/de4e2359db389eaf5d039692a4f6e820e7bfaec5))

## [8.1.0](https://github.com/nodkz/mongodb-memory-server/compare/v8.0.4...v8.1.0) (2021-12-22)


### Features

* change "getUri" to always return ip "127.0.0.1" instead of "ip" property ([2409489](https://github.com/nodkz/mongodb-memory-server/commit/24094899b792c55bbaf8404c988c9cb226a2948b)), closes [#586](https://github.com/nodkz/mongodb-memory-server/issues/586)


### Dependencies

* **@types/jest:** upgrade to version 27.0.3 ([202aef2](https://github.com/nodkz/mongodb-memory-server/commit/202aef2454b69dfa0f5edf333335c7b5fcaf9bd2))
* **@types/tmp:** upgrade to version 0.2.3 ([4a18cb9](https://github.com/nodkz/mongodb-memory-server/commit/4a18cb985538105460bcadf5628560f9b08ec89e))
* **@types/uuid:** upgrade to version 8.3.3 ([4ea1aef](https://github.com/nodkz/mongodb-memory-server/commit/4ea1aef2d3d170420488d25f28e90e38a06a3ebe))
* **@typescript-eslint/*:** upgrade to version 5.8.0 ([dc67374](https://github.com/nodkz/mongodb-memory-server/commit/dc673745666b8ee2e4d1ef78fa5ab83073df13e5))
* **camelcase:** upgrade to version 6.2.1 ([42e535d](https://github.com/nodkz/mongodb-memory-server/commit/42e535d5f87b5f405001730771dd5042f5159321))
* **commitlint:** upgrade to version 15.0.0 ([e3700d0](https://github.com/nodkz/mongodb-memory-server/commit/e3700d029ae6ee5e77d0fcdbccc6689c64e98150))
* **debug:** upgrade to version 4.3.3 ([0f2384d](https://github.com/nodkz/mongodb-memory-server/commit/0f2384dd1d45965dbc97b750ff9e2f8b3ef855d5))
* **eslint:** upgrade to version 8.5.0 ([5ed28f8](https://github.com/nodkz/mongodb-memory-server/commit/5ed28f81fdd9ea9c3af0f7d030efdd426f4b2ab6))
* **jest:** upgrade to version 27.4.5 ([014d42f](https://github.com/nodkz/mongodb-memory-server/commit/014d42fd7a96cc74755381410c2e9bf6ba633ec0))
* **mongodb:** upgrade to version 4.2.2 ([d7c2430](https://github.com/nodkz/mongodb-memory-server/commit/d7c2430503d0bdef557a5012b9c529caa0e6f52b))
* **prettier:** upgrade to version 2.5.1 ([53f574b](https://github.com/nodkz/mongodb-memory-server/commit/53f574be5881db30a8632eda8662750d140c3c2f))
* **ts-jest:** upgrade to version 27.1.2 ([3b979d7](https://github.com/nodkz/mongodb-memory-server/commit/3b979d74de309b0220de6beb6bf3039ffd0700df))

### [8.0.4](https://github.com/nodkz/mongodb-memory-server/compare/v8.0.3...v8.0.4) (2021-11-30)


### Fixes

* **MongoBinaryDownloadUrl:** translate ubuntu 2104 to 2004 ([1ad603f](https://github.com/nodkz/mongodb-memory-server/commit/1ad603ffc10b929312cbb98788da4f5bc5291819)), closes [#582](https://github.com/nodkz/mongodb-memory-server/issues/582)

### [8.0.3](https://github.com/nodkz/mongodb-memory-server/compare/v8.0.2...v8.0.3) (2021-11-25)


### Fixes

* **MongoMemoryServer::getStartOptions:** use "forceSamePort", even when instance is not defined ([1170ad5](https://github.com/nodkz/mongodb-memory-server/commit/1170ad568936242171780e53905d6ff535a017bc)), closes [#578](https://github.com/nodkz/mongodb-memory-server/issues/578)


### Refactor

* **MongoMemoryServer::stop:** remove assertion for typescript types ([df5b888](https://github.com/nodkz/mongodb-memory-server/commit/df5b888aeb6731b3a6fd54f9109d49caa920fcbc))

### [8.0.2](https://github.com/nodkz/mongodb-memory-server/compare/v8.0.1...v8.0.2) (2021-11-07)


### Fixes

* **MongoMemoryServer:** use non-static password for authentication creation ([c72427d](https://github.com/nodkz/mongodb-memory-server/commit/c72427d700a4241ce584b61dc4be3ed0f2deb1f5)), closes [#575](https://github.com/nodkz/mongodb-memory-server/issues/575)

### [8.0.1](https://github.com/nodkz/mongodb-memory-server/compare/v8.0.0...v8.0.1) (2021-11-05)


### Fixes

* **MongoMemoryServer:** invert `isNew` for dbPaths ([6b8845e](https://github.com/nodkz/mongodb-memory-server/commit/6b8845e20c22a43f09ac588a87834cc2f16363e3))


### Style

* update migration docs urls to include new /migration/ path ([#572](https://github.com/nodkz/mongodb-memory-server/issues/572)) ([b3897ed](https://github.com/nodkz/mongodb-memory-server/commit/b3897ed3c67c94ac66ff93ac0ef5a9c3cbc77c3f))

## [8.0.0](https://github.com/nodkz/mongodb-memory-server/compare/v7.6.0...v8.0.0) (2021-11-01)


### ⚠ BREAKING CHANGES

* There is now no more "beforeExit" listener added
* **resolveConfig:** Default MongoDB Binary version is now "5.0.3"
* **mongodb:** Upgrade to mongodb(nodejs) 4.1

### Features

* **errors:** add Error "StdoutInstanceError" ([382e7c6](https://github.com/nodkz/mongodb-memory-server/commit/382e7c68916a5fb661dd1a49415e49e5ed73d27f))
* **errors:** add errors "ParseArchiveRegexError" and "NoRegexMatchError" ([fb02eac](https://github.com/nodkz/mongodb-memory-server/commit/fb02eac6371c98ae1ff334db50d068be8ac5d843))
* **MongoBinaryDownloadUrl:** change to throw a error when debian 10 used for versions below 4.2.0 ([bfb0ec4](https://github.com/nodkz/mongodb-memory-server/commit/bfb0ec4c1ab8d8991bdf735d64cc130d7863f0a1)), closes [#554](https://github.com/nodkz/mongodb-memory-server/issues/554) [#448](https://github.com/nodkz/mongodb-memory-server/issues/448)
* **MongoInstance::stdoutHandler:** change "instanceError" events to use "StdoutInstanceError" ([3daa5ea](https://github.com/nodkz/mongodb-memory-server/commit/3daa5ea1ff5b68eceb1722e29b1f15285587043a))
* **MongoInstance::stdoutHandler:** change to handle "expection in initAndListen" ([7774e9e](https://github.com/nodkz/mongodb-memory-server/commit/7774e9e17055b59f64bc5bcd40cff3425bd2f606))
* remove all "beforeExit" listeners ([f3d8a19](https://github.com/nodkz/mongodb-memory-server/commit/f3d8a19161afd319be6acf877da1f131275e6e70)), closes [#563](https://github.com/nodkz/mongodb-memory-server/issues/563)
* **resolveConfig:** upgrade default mongodb version to 5.0.3 ([75a722a](https://github.com/nodkz/mongodb-memory-server/commit/75a722ab12c6b8055be731fdd85634acb337a1e0)), closes [#555](https://github.com/nodkz/mongodb-memory-server/issues/555)
* **resolveConfig::findPackageJson:** re-write internals to be more maintainable ([8f16a2a](https://github.com/nodkz/mongodb-memory-server/commit/8f16a2a004a23f42b119ec96490b42a88eaded16))
* replace "mkdirp" with "utils.mkdir" ([7579b47](https://github.com/nodkz/mongodb-memory-server/commit/7579b47aa61d4135ca8700f86a6c9c67419469b3))
* **DryMongoBinary::generateOptions:** parse options from ARCHIVE_NAME or DOWNLOAD_URL ([808cc7e](https://github.com/nodkz/mongodb-memory-server/commit/808cc7e6566893ff4243420af718aa5514b72f72)), closes [#528](https://github.com/nodkz/mongodb-memory-server/issues/528)
* **MongoBinaryDownloadUrl::translateArch:** handle more variations of the same arch ([0a22679](https://github.com/nodkz/mongodb-memory-server/commit/0a22679d01a3792b6534b7de6c5d838c91c6646a))
* **utils:** add function "mkdir" ([44eeb53](https://github.com/nodkz/mongodb-memory-server/commit/44eeb5393b994482740712c3130f02e7f1e90e56))


### Reverts

* Revert "docs(test-runners): add note to mocha / chai that process exit event may not be called" ([a7c3c98](https://github.com/nodkz/mongodb-memory-server/commit/a7c3c986c2899dae7319f87caecece539dcc388a))


### Style

* **DryMongoBinary::generatePaths:** log options ([02befa8](https://github.com/nodkz/mongodb-memory-server/commit/02befa87016fc9384c89b07858fc83dbf05bdf0b))
* **MongoBinaryDownloadUrl:** add note for debian 11 ([81c85f1](https://github.com/nodkz/mongodb-memory-server/commit/81c85f1675fe3af549b4781fecb35c66e811a992))


### Fixes

* **DryMongoBinary::parseArchiveNameRegex:** change regex to include "macos" ([#562](https://github.com/nodkz/mongodb-memory-server/issues/562)) ([9d5bdbf](https://github.com/nodkz/mongodb-memory-server/commit/9d5bdbfb711223f36d284bd4f435c938cddb4a0c))
* **resolveConfig:** fix debug enable ([9c8cbb7](https://github.com/nodkz/mongodb-memory-server/commit/9c8cbb7674c05c978d0fcdc3c6123ecc9afc1fb0))


### Dependencies

* **@types/jest:** upgrade to version 27.0.2 ([e079f0d](https://github.com/nodkz/mongodb-memory-server/commit/e079f0d7af18e4a7a39b6c16b51a9dd39c910b8a))
* **@types/semver:** upgrade to version 7.3.9 ([53f0354](https://github.com/nodkz/mongodb-memory-server/commit/53f0354bf5c8d5f060adca7efeed61c3613a23d4))
* **@types/tar-stream:** upgrade to version 2.2.2 ([babce7f](https://github.com/nodkz/mongodb-memory-server/commit/babce7fb2dd2af082483129e568e38c35d88bc03))
* **@typescript-eslint/*:** upgrade to version 5.2.0 ([41f2a9a](https://github.com/nodkz/mongodb-memory-server/commit/41f2a9a0029884d10dced567a5f45b913011f65a))
* **commitlint:** upgrade to version 14.1.0 ([5ea0921](https://github.com/nodkz/mongodb-memory-server/commit/5ea0921240a8f564003e7e8de7e75696bd658a1b))
* **conventional-changelog-conventionalcommits:** upgrade to version 4.6.1 ([d00f6a9](https://github.com/nodkz/mongodb-memory-server/commit/d00f6a9b4fd6717292a3133dba77fa0ce878f4ce))
* **doctoc:** upgrade to version 2.1.0 ([8cb7243](https://github.com/nodkz/mongodb-memory-server/commit/8cb72437f52423e279c1d650e3e80569e8adb4be))
* **eslint:** upgrade to version 8.1.0 ([6790a0c](https://github.com/nodkz/mongodb-memory-server/commit/6790a0c8284f3ebff42743697a719e7093aead12))
* **husky:** upgrade to version 7.0.4 ([65a7042](https://github.com/nodkz/mongodb-memory-server/commit/65a70428d9b85cd1797466220991d22669648af3))
* **jest:** upgrade to version 27.3.1 ([8577380](https://github.com/nodkz/mongodb-memory-server/commit/85773802a251a5257d666eb5cebc07d4a26e90fc))
* **lint-staged:** upgrade to version 11.2.6 ([493d894](https://github.com/nodkz/mongodb-memory-server/commit/493d8942b640ad464a1910c6edc1822a1c0d24a4))
* **mkdirp:** remove unused dependency ([c078ae8](https://github.com/nodkz/mongodb-memory-server/commit/c078ae8a6777855bdada3461b9f6ea9750975de6))
* **mongodb:** upgrade to version 4.1.3 ([9516bed](https://github.com/nodkz/mongodb-memory-server/commit/9516bedf9a2bd55bfe78b86528430f4c8a235f2a))
* **prettier:** upgrade to version 2.4.1 ([36cd70f](https://github.com/nodkz/mongodb-memory-server/commit/36cd70f13ba229a718a941a3f113170abf794c51))
* **ts-jest:** upgrade to version 27.0.7 ([9b0fb3c](https://github.com/nodkz/mongodb-memory-server/commit/9b0fb3cd295b873500f2323e8d949832c5aa1ea1))
* **tslib:** upgrade to version 2.3.1 ([1a36352](https://github.com/nodkz/mongodb-memory-server/commit/1a36352fcaaa6c45796cb1d1c2a0e4b509acbfdd))
* **typescript:** upgrade to version 4.4.4 ([63606e4](https://github.com/nodkz/mongodb-memory-server/commit/63606e4186fc05f00ffe67abb7fbcc6d4b8cd76e))

## [8.0.0-beta.11](https://github.com/nodkz/mongodb-memory-server/compare/v8.0.0-beta.10...v8.0.0-beta.11) (2021-11-01)


### Features

* **errors:** add Error "StdoutInstanceError" ([382e7c6](https://github.com/nodkz/mongodb-memory-server/commit/382e7c68916a5fb661dd1a49415e49e5ed73d27f))
* **MongoInstance::stdoutHandler:** change "instanceError" events to use "StdoutInstanceError" ([3daa5ea](https://github.com/nodkz/mongodb-memory-server/commit/3daa5ea1ff5b68eceb1722e29b1f15285587043a))
* **MongoInstance::stdoutHandler:** change to handle "expection in initAndListen" ([7774e9e](https://github.com/nodkz/mongodb-memory-server/commit/7774e9e17055b59f64bc5bcd40cff3425bd2f606))


### Dependencies

* **@types/semver:** upgrade to version 7.3.9 ([53f0354](https://github.com/nodkz/mongodb-memory-server/commit/53f0354bf5c8d5f060adca7efeed61c3613a23d4))
* **@types/tar-stream:** upgrade to version 2.2.2 ([babce7f](https://github.com/nodkz/mongodb-memory-server/commit/babce7fb2dd2af082483129e568e38c35d88bc03))
* **@types/tmp:** upgrade to version 0.2.2 ([8f5efe3](https://github.com/nodkz/mongodb-memory-server/commit/8f5efe34e92c4ff360cd776a61cc45d18b9f373c))
* **@typescript-eslint/*:** upgrade to version 5.2.0 ([41f2a9a](https://github.com/nodkz/mongodb-memory-server/commit/41f2a9a0029884d10dced567a5f45b913011f65a))
* **commitlint:** upgrade to version 14.1.0 ([5ea0921](https://github.com/nodkz/mongodb-memory-server/commit/5ea0921240a8f564003e7e8de7e75696bd658a1b))
* **doctoc:** upgrade to version 2.1.0 ([8cb7243](https://github.com/nodkz/mongodb-memory-server/commit/8cb72437f52423e279c1d650e3e80569e8adb4be))
* **eslint:** upgrade to version 8.1.0 ([6790a0c](https://github.com/nodkz/mongodb-memory-server/commit/6790a0c8284f3ebff42743697a719e7093aead12))
* **husky:** upgrade to version 7.0.4 ([65a7042](https://github.com/nodkz/mongodb-memory-server/commit/65a70428d9b85cd1797466220991d22669648af3))
* **jest:** upgrade to version 27.3.1 ([8577380](https://github.com/nodkz/mongodb-memory-server/commit/85773802a251a5257d666eb5cebc07d4a26e90fc))
* **lint-staged:** upgrade to version 11.2.6 ([493d894](https://github.com/nodkz/mongodb-memory-server/commit/493d8942b640ad464a1910c6edc1822a1c0d24a4))
* **mongodb:** upgrade to version 3.7.3 ([fcc2f70](https://github.com/nodkz/mongodb-memory-server/commit/fcc2f706f5d1066001dad6760b47ff084465ee4f))
* **mongodb:** upgrade to version 4.1.3 ([9516bed](https://github.com/nodkz/mongodb-memory-server/commit/9516bedf9a2bd55bfe78b86528430f4c8a235f2a))
* **ts-jest:** upgrade to version 27.0.7 ([9b0fb3c](https://github.com/nodkz/mongodb-memory-server/commit/9b0fb3cd295b873500f2323e8d949832c5aa1ea1))
* **typescript:** upgrade to version 4.4.4 ([63606e4](https://github.com/nodkz/mongodb-memory-server/commit/63606e4186fc05f00ffe67abb7fbcc6d4b8cd76e))

## [8.0.0-beta.10](https://github.com/nodkz/mongodb-memory-server/compare/v8.0.0-beta.9...v8.0.0-beta.10) (2021-10-26)


### ⚠ BREAKING CHANGES

* There is now no more "beforeExit" listener added

### Features

* remove all "beforeExit" listeners ([f3d8a19](https://github.com/nodkz/mongodb-memory-server/commit/f3d8a19161afd319be6acf877da1f131275e6e70)), closes [#563](https://github.com/nodkz/mongodb-memory-server/issues/563)

## [8.0.0-beta.9](https://github.com/nodkz/mongodb-memory-server/compare/v8.0.0-beta.8...v8.0.0-beta.9) (2021-10-22)


### Fixes

* **DryMongoBinary::parseArchiveNameRegex:** change regex to include "macos" ([#562](https://github.com/nodkz/mongodb-memory-server/issues/562)) ([9d5bdbf](https://github.com/nodkz/mongodb-memory-server/commit/9d5bdbfb711223f36d284bd4f435c938cddb4a0c))

## [8.0.0-beta.8](https://github.com/nodkz/mongodb-memory-server/compare/v8.0.0-beta.7...v8.0.0-beta.8) (2021-10-20)


### Features

* upgrade default mongodb binary version to 4.0.27 ([c82e56c](https://github.com/nodkz/mongodb-memory-server/commit/c82e56ce452f6859477f46c321cc6b44ac9e91ba))
* upgrade mongodb patch version for "-global-*" packages ([01a6ded](https://github.com/nodkz/mongodb-memory-server/commit/01a6deda21ffe8c52e5b7ebbab532ab7ef88583e))


### Style

* fix tsdoc "[@return](https://github.com/return)" -> "[@returns](https://github.com/returns)" ([ffbc0ca](https://github.com/nodkz/mongodb-memory-server/commit/ffbc0caa9bf67ff669a9369ba030ecae92f2f7dc))


### Fixes

* **MongoInstance:** try to fix some CodeQL redos ([9fc3a33](https://github.com/nodkz/mongodb-memory-server/commit/9fc3a338326f9e0d3e511aff5794236ba133ac5d))

## [8.0.0-beta.7](https://github.com/nodkz/mongodb-memory-server/compare/v8.0.0-beta.6...v8.0.0-beta.7) (2021-10-19)


### ⚠ BREAKING CHANGES

* **resolveConfig:** Default MongoDB Binary version is now "5.0.3"

### Features

* **resolveConfig:** upgrade default mongodb version to 5.0.3 ([75a722a](https://github.com/nodkz/mongodb-memory-server/commit/75a722ab12c6b8055be731fdd85634acb337a1e0)), closes [#555](https://github.com/nodkz/mongodb-memory-server/issues/555)


### Fixes

* **resolveConfig:** change default version to be a constant (non-changeable) ([11c9547](https://github.com/nodkz/mongodb-memory-server/commit/11c95471ef7a400374491fe8055708a133f4ae6d))

## [8.0.0-beta.6](https://github.com/nodkz/mongodb-memory-server/compare/v8.0.0-beta.5...v8.0.0-beta.6) (2021-10-19)


### Style

* **MongoInstance:** add more tsdoc ([36c1971](https://github.com/nodkz/mongodb-memory-server/commit/36c19715e7820a902f6533899b4a9ecd3cb91348))


### Fixes

* add "@types/mongodb" to dependencies, because of exposing a mongodb type ([6346922](https://github.com/nodkz/mongodb-memory-server/commit/634692225201ed38e4fa306e40497a434ad6a4be)), closes [#558](https://github.com/nodkz/mongodb-memory-server/issues/558)
* **MongoMemoryServer:** change that "instance.auth" is not required to be set for enabling auth ([4e4a41d](https://github.com/nodkz/mongodb-memory-server/commit/4e4a41d8d9975f8739ac0e92cdce040917e4d9cd))
* **MongoMemoryServer:** change to log value "createAuth" ([9c3fea0](https://github.com/nodkz/mongodb-memory-server/commit/9c3fea0f08e875382c0c1e9dfd62a315aee8a2e1))
* **resolveConfig:** fix debug enable ([aff6838](https://github.com/nodkz/mongodb-memory-server/commit/aff68382cb681b55516c053e9d4864d0b590ab25))
* **resolveConfig::findPackageJson:** actually apply processing to path options ([25c4119](https://github.com/nodkz/mongodb-memory-server/commit/25c41195a245a0c22bba65c91b798cb088c5e885)), closes [#548](https://github.com/nodkz/mongodb-memory-server/issues/548)

## [8.0.0-beta.5](https://github.com/nodkz/mongodb-memory-server/compare/v8.0.0-beta.4...v8.0.0-beta.5) (2021-10-08)


### Features

* **MongoBinaryDownloadUrl:** change to throw a error when debian 10 used for versions below 4.2.0 ([bfb0ec4](https://github.com/nodkz/mongodb-memory-server/commit/bfb0ec4c1ab8d8991bdf735d64cc130d7863f0a1)), closes [#554](https://github.com/nodkz/mongodb-memory-server/issues/554) [#448](https://github.com/nodkz/mongodb-memory-server/issues/448)


### Style

* **MongoBinaryDownloadUrl:** add note for debian 11 ([81c85f1](https://github.com/nodkz/mongodb-memory-server/commit/81c85f1675fe3af549b4781fecb35c66e811a992))

## [8.0.0-beta.4](https://github.com/nodkz/mongodb-memory-server/compare/v8.0.0-beta.3...v8.0.0-beta.4) (2021-10-05)


### Features

* **resolveConfig::findPackageJson:** re-write internals to be more maintainable ([8f16a2a](https://github.com/nodkz/mongodb-memory-server/commit/8f16a2a004a23f42b119ec96490b42a88eaded16))


### Style

* **DryMongoBinary::generatePaths:** log options ([02befa8](https://github.com/nodkz/mongodb-memory-server/commit/02befa87016fc9384c89b07858fc83dbf05bdf0b))

## [8.0.0-beta.3](https://github.com/nodkz/mongodb-memory-server/compare/v8.0.0-beta.2...v8.0.0-beta.3) (2021-09-30)


### Features

* replace "mkdirp" with "utils.mkdir" ([7579b47](https://github.com/nodkz/mongodb-memory-server/commit/7579b47aa61d4135ca8700f86a6c9c67419469b3))
* **utils:** add function "mkdir" ([44eeb53](https://github.com/nodkz/mongodb-memory-server/commit/44eeb5393b994482740712c3130f02e7f1e90e56))


### Dependencies

* **mkdirp:** remove unused dependency ([c078ae8](https://github.com/nodkz/mongodb-memory-server/commit/c078ae8a6777855bdada3461b9f6ea9750975de6))

## [8.0.0-beta.2](https://github.com/nodkz/mongodb-memory-server/compare/v8.0.0-beta.1...v8.0.0-beta.2) (2021-09-29)


### Features

* **DryMongoBinary::generateOptions:** parse options from ARCHIVE_NAME or DOWNLOAD_URL ([808cc7e](https://github.com/nodkz/mongodb-memory-server/commit/808cc7e6566893ff4243420af718aa5514b72f72)), closes [#528](https://github.com/nodkz/mongodb-memory-server/issues/528)
* **errors:** add errors "ParseArchiveRegexError" and "NoRegexMatchError" ([fb02eac](https://github.com/nodkz/mongodb-memory-server/commit/fb02eac6371c98ae1ff334db50d068be8ac5d843))
* **MongoBinaryDownloadUrl::translateArch:** handle more variations of the same arch ([0a22679](https://github.com/nodkz/mongodb-memory-server/commit/0a22679d01a3792b6534b7de6c5d838c91c6646a))


### Fixes

* **resolveConfig:** fix debug enable ([9c8cbb7](https://github.com/nodkz/mongodb-memory-server/commit/9c8cbb7674c05c978d0fcdc3c6123ecc9afc1fb0))

## [8.0.0-beta.1](https://github.com/nodkz/mongodb-memory-server/compare/v7.4.1...v8.0.0-beta.1) (2021-09-23)


### ⚠ BREAKING CHANGES

* **mongodb:** Upgrade to mongodb(nodejs) 4.1

### Dependencies

* **@types/jest:** upgrade to version 27.0.2 ([e079f0d](https://github.com/nodkz/mongodb-memory-server/commit/e079f0d7af18e4a7a39b6c16b51a9dd39c910b8a))
* **@typescript-eslint/*:** upgrade to version 4.31.2 ([c8d34b1](https://github.com/nodkz/mongodb-memory-server/commit/c8d34b1fb7b957a391fff93fc2f2013972492274))
* **conventional-changelog-conventionalcommits:** upgrade to version 4.6.1 ([d00f6a9](https://github.com/nodkz/mongodb-memory-server/commit/d00f6a9b4fd6717292a3133dba77fa0ce878f4ce))
* **jest:** upgrade to version 27.2.1 ([695527f](https://github.com/nodkz/mongodb-memory-server/commit/695527fb999cd2b16316dd6a240d2622b13c5b96))
* **mongodb:** upgrade to version 4.1 ([6cf5502](https://github.com/nodkz/mongodb-memory-server/commit/6cf55023c2ace7448a80c88d6067f8dbb7742572))
* **prettier:** upgrade to version 2.4.1 ([36cd70f](https://github.com/nodkz/mongodb-memory-server/commit/36cd70f13ba229a718a941a3f113170abf794c51))
* **tslib:** upgrade to version 2.3.1 ([1a36352](https://github.com/nodkz/mongodb-memory-server/commit/1a36352fcaaa6c45796cb1d1c2a0e4b509acbfdd))
* **typescript:** upgrade to version 4.4.3 ([84e407b](https://github.com/nodkz/mongodb-memory-server/commit/84e407b6b14ae986ab9d4ac6a1d5caa3f694861b))

## [7.6.0](https://github.com/nodkz/mongodb-memory-server/compare/v7.5.1...v7.6.0) (2021-10-31)


### Dependencies

* **@types/tmp:** upgrade to version 0.2.2 ([8f5efe3](https://github.com/nodkz/mongodb-memory-server/commit/8f5efe34e92c4ff360cd776a61cc45d18b9f373c))
* **mongodb:** upgrade to version 3.7.3 ([fcc2f70](https://github.com/nodkz/mongodb-memory-server/commit/fcc2f706f5d1066001dad6760b47ff084465ee4f))

### [7.5.1](https://github.com/nodkz/mongodb-memory-server/compare/v7.5.0...v7.5.1) (2021-10-19)


### Fixes

* **MongoInstance:** try to fix some CodeQL redos ([9fc3a33](https://github.com/nodkz/mongodb-memory-server/commit/9fc3a338326f9e0d3e511aff5794236ba133ac5d))

## [7.5.0](https://github.com/nodkz/mongodb-memory-server/compare/v7.4.6...v7.5.0) (2021-10-19)


### Features

* upgrade default mongodb binary version to 4.0.27 ([c82e56c](https://github.com/nodkz/mongodb-memory-server/commit/c82e56ce452f6859477f46c321cc6b44ac9e91ba))
* upgrade mongodb patch version for "-global-*" packages ([01a6ded](https://github.com/nodkz/mongodb-memory-server/commit/01a6deda21ffe8c52e5b7ebbab532ab7ef88583e))


### Style

* fix tsdoc "[@return](https://github.com/return)" -> "[@returns](https://github.com/returns)" ([ffbc0ca](https://github.com/nodkz/mongodb-memory-server/commit/ffbc0caa9bf67ff669a9369ba030ecae92f2f7dc))

### [7.4.6](https://github.com/nodkz/mongodb-memory-server/compare/v7.4.5...v7.4.6) (2021-10-19)


### Fixes

* **resolveConfig:** change default version to be a constant (non-changeable) ([11c9547](https://github.com/nodkz/mongodb-memory-server/commit/11c95471ef7a400374491fe8055708a133f4ae6d))

### [7.4.5](https://github.com/nodkz/mongodb-memory-server/compare/v7.4.4...v7.4.5) (2021-10-19)


### Fixes

* add "@types/mongodb" to dependencies, because of exposing a mongodb type ([6346922](https://github.com/nodkz/mongodb-memory-server/commit/634692225201ed38e4fa306e40497a434ad6a4be)), closes [#558](https://github.com/nodkz/mongodb-memory-server/issues/558)

### [7.4.4](https://github.com/nodkz/mongodb-memory-server/compare/v7.4.3...v7.4.4) (2021-10-14)


### Fixes

* **MongoMemoryServer:** change that "instance.auth" is not required to be set for enabling auth ([4e4a41d](https://github.com/nodkz/mongodb-memory-server/commit/4e4a41d8d9975f8739ac0e92cdce040917e4d9cd))
* **MongoMemoryServer:** change to log value "createAuth" ([9c3fea0](https://github.com/nodkz/mongodb-memory-server/commit/9c3fea0f08e875382c0c1e9dfd62a315aee8a2e1))


### Style

* **MongoInstance:** add more tsdoc ([36c1971](https://github.com/nodkz/mongodb-memory-server/commit/36c19715e7820a902f6533899b4a9ecd3cb91348))

### [7.4.3](https://github.com/nodkz/mongodb-memory-server/compare/v7.4.2...v7.4.3) (2021-10-05)


### Fixes

* **resolveConfig::findPackageJson:** actually apply processing to path options ([25c4119](https://github.com/nodkz/mongodb-memory-server/commit/25c41195a245a0c22bba65c91b798cb088c5e885)), closes [#548](https://github.com/nodkz/mongodb-memory-server/issues/548)

### [7.4.2](https://github.com/nodkz/mongodb-memory-server/compare/v7.4.1...v7.4.2) (2021-09-29)


### Fixes

* **resolveConfig:** fix debug enable ([aff6838](https://github.com/nodkz/mongodb-memory-server/commit/aff68382cb681b55516c053e9d4864d0b590ab25))

### [7.4.1](https://github.com/nodkz/mongodb-memory-server/compare/v7.4.0...v7.4.1) (2021-09-20)


### Fixes

* **MongoInstance:** fix typo ([#542](https://github.com/nodkz/mongodb-memory-server/issues/542)) ([7124f2d](https://github.com/nodkz/mongodb-memory-server/commit/7124f2dfbbc8d3dc92a7f462376c49211f8a8935))

## [7.4.0](https://github.com/nodkz/mongodb-memory-server/compare/v7.3.6...v7.4.0) (2021-09-02)


### Features

* **errors:** add "EnsureInstanceError" ([e5aaebf](https://github.com/nodkz/mongodb-memory-server/commit/e5aaebf90a16f5f84fdd3497c48c30e0b8687d94))
* **errors:** add "Md5CheckFailedError" ([6ca70f0](https://github.com/nodkz/mongodb-memory-server/commit/6ca70f0a83ceee14818436a6295a020b0e44be6a))
* **errors:** add "NoSystemBinaryFoundError" ([e1206c7](https://github.com/nodkz/mongodb-memory-server/commit/e1206c7b14097883763cc5110542fd7f5c390203))
* **errors:** add "StartBinaryFailedError" ([83626e0](https://github.com/nodkz/mongodb-memory-server/commit/83626e00d843eb81be5dc935eeac5c5381a2c78c))
* **errors:** add "UnableToUnlockLockfileError" ([c1d1426](https://github.com/nodkz/mongodb-memory-server/commit/c1d1426fcfb678236ea45f6d89a1a512bf3f2bb2))
* **errors:** add error "WaitForPrimaryTimeoutError" ([db1a3aa](https://github.com/nodkz/mongodb-memory-server/commit/db1a3aab866966ce66f51d5885ff531f4f4a60f7))
* **errors:** rename "UnknownArchitecture" to "UnknownArchitectureError" ([c546ab0](https://github.com/nodkz/mongodb-memory-server/commit/c546ab05427482e703ddbfa6bc481c450244aafd))
* **errors:** rename "UnknownLockfileStatus" to "UnknownLockfileStatusError" ([f0fb208](https://github.com/nodkz/mongodb-memory-server/commit/f0fb208be8cce7f35dc9a962bd367754065b0d13))
* **errors:** rename "UnknownPlatform" to "UnknownPlatformError" ([2800029](https://github.com/nodkz/mongodb-memory-server/commit/28000295fe5f3e530b6786ca27ac36d11a446e06))
* **errors:** unfiy binary X_OK checking and throwing errors ([4401834](https://github.com/nodkz/mongodb-memory-server/commit/440183493bebe709e76705c947ea265e6d3b051f))
* **getos:** support multiple "id_like" ([ce42fad](https://github.com/nodkz/mongodb-memory-server/commit/ce42fad3f249c885fb2f8f23ae0eaf7b5c4a6741)), closes [#525](https://github.com/nodkz/mongodb-memory-server/issues/525)
* **MongoBinary:** add ability to disable SYSTEM_BINARY version check ([331d820](https://github.com/nodkz/mongodb-memory-server/commit/331d820d2493bdfbdf37652c5387eeaeccae64e5)), closes [#529](https://github.com/nodkz/mongodb-memory-server/issues/529)
* **MongoMemoryReplSet:** add named error for "count" assertion ([d67202b](https://github.com/nodkz/mongodb-memory-server/commit/d67202b98157bb876377ae17d89b164f19d1f4e6))
* actually change "auth" to work on non-inmemory storageEngines ([7ac3758](https://github.com/nodkz/mongodb-memory-server/commit/7ac3758418dc89146d2b8f31bb0412e30c402905)), closes [#533](https://github.com/nodkz/mongodb-memory-server/issues/533)
* **MongoBinaryDownloadUrl:** add support for Amazon Distro ([a7e14b5](https://github.com/nodkz/mongodb-memory-server/commit/a7e14b5fd2b3f8d1e0ba415c0140412022476f91)), closes [#527](https://github.com/nodkz/mongodb-memory-server/issues/527)


### Refactor

* **MongoInstance:** debug: passthrough any extra arguments to the logger to handle ([5dbdded](https://github.com/nodkz/mongodb-memory-server/commit/5dbdded2b326796f730a5ae00895bcf828d2ecde))
* **MongoMemoryServer:** improve logging ([0326b37](https://github.com/nodkz/mongodb-memory-server/commit/0326b3762c8a6ce126b81b287f27dfb5f31d5e14))


### Dependencies

* **@google/semantic-release-replace-plugin:** upgrade to version 1.1.0 ([809f6f6](https://github.com/nodkz/mongodb-memory-server/commit/809f6f6980d63caefa515b2839a25ef67219c109))
* **@types/debug:** upgrade to 4.1.7 ([557d40c](https://github.com/nodkz/mongodb-memory-server/commit/557d40c24705485d41d7333a871e1f5c1c4beb05))
* **@types/find-cache-dir:** upgrade to version 3.2.1 ([5814d48](https://github.com/nodkz/mongodb-memory-server/commit/5814d48d670124b6b8c1d2f8a3ccd808e198adad))
* **@types/jest:** upgrade to version 26.0.24 ([387c4da](https://github.com/nodkz/mongodb-memory-server/commit/387c4da1cae179bae1fd528e9766af73ff67a9d6))
* **@types/jest:** upgrade to version 27.0.1 ([c26feae](https://github.com/nodkz/mongodb-memory-server/commit/c26feae8def054ebceb5ccfba720eb42b4aa05da))
* **@types/mkdirp:** upgrade to version 1.0.2 ([4f273db](https://github.com/nodkz/mongodb-memory-server/commit/4f273dbd47e7eac46cfbad7c1d94a346190ca1e6))
* **@types/mongodb:** upgrade to version 3.6.20 ([02aef1a](https://github.com/nodkz/mongodb-memory-server/commit/02aef1a664892c8293aefe568470a30ae6277c65))
* **@types/semver:** upgrade to version 7.3.8 ([ae728f7](https://github.com/nodkz/mongodb-memory-server/commit/ae728f7ae7a56593d318b7734cc375da26be201b))
* **@typescript-eslint/*:** upgrade to version 4.29.0 ([38b42a9](https://github.com/nodkz/mongodb-memory-server/commit/38b42a9f1863b8119c31aee294c29f2cdf8ede69))
* **@typescript-eslint/*:** upgrade to version 4.30.0 ([efd914e](https://github.com/nodkz/mongodb-memory-server/commit/efd914e9c5287d22e7640210a9af0eb20301db0f))
* **async-mutex:** upgrade to version 0.3.2 ([01e662a](https://github.com/nodkz/mongodb-memory-server/commit/01e662afc100388f9d1518c0d7691c9565f33830))
* **commitlint:** upgrade to version 13.1.0 ([8497e9f](https://github.com/nodkz/mongodb-memory-server/commit/8497e9f8a3f7eb51c181adbb476ab2cd12f2b991))
* **eslint:** upgrade to 7.32.0 ([9202186](https://github.com/nodkz/mongodb-memory-server/commit/92021864b8701c1f0c4d6fee352e1a5fb7d22702))
* **eslint-plugin-prettier:** upgrade to version 4.0.0 ([79e1b2d](https://github.com/nodkz/mongodb-memory-server/commit/79e1b2d27c4496157ace7406269b5e0894b4a273))
* **find-cache-dir:** upgrade to version 3.3.2 ([2ef3e00](https://github.com/nodkz/mongodb-memory-server/commit/2ef3e005d9a88c2f000c9b6fe7552232e612b5df))
* **husky:** upgrade to version 7.0.1 ([2b37bda](https://github.com/nodkz/mongodb-memory-server/commit/2b37bda489eab9401ad0831caf830631d0ce466c))
* **husky:** upgrade to version 7.0.2 ([3b33ff8](https://github.com/nodkz/mongodb-memory-server/commit/3b33ff8c3b97dab209984e5fdcbf2d3658f825ec))
* **jest:** upgrade to version 27.1.0 ([fbe852b](https://github.com/nodkz/mongodb-memory-server/commit/fbe852bba7d914889a1e92566a3dbba7cfd24303))
* **lerna:** remove dependency ([1266a57](https://github.com/nodkz/mongodb-memory-server/commit/1266a57a67b8f05228fcb5599f2331f9019cd7f1)), closes [#537](https://github.com/nodkz/mongodb-memory-server/issues/537)
* **lint-staged:** upgrade to version 11.1.2 ([e8d3575](https://github.com/nodkz/mongodb-memory-server/commit/e8d357545ff65c14cf594932d1a135248a1a8f60))
* **semantic-release:** upgrade to version 17.4.7 ([c67b291](https://github.com/nodkz/mongodb-memory-server/commit/c67b29136e016ef02c4fabd49ca593b2fa538961))
* **ts-jest:** upgrade to version 27.0.4 ([377a0d2](https://github.com/nodkz/mongodb-memory-server/commit/377a0d25f2cc0f00bdf44deec88f63598a78795b))
* **ts-jest:** upgrade to version 27.0.5 ([07f3e38](https://github.com/nodkz/mongodb-memory-server/commit/07f3e38c17d3e00df4a4da06f3206f7c8f4c671b))
* **typescript:** upgrade to version 4.4.2 ([e89df5a](https://github.com/nodkz/mongodb-memory-server/commit/e89df5a3ea1ee6142983026d55c5f4d7ff1712c8))


### Fixes

* **MongoInstance:** change "instanceReplState" to get triggered on "transition" ([923aae6](https://github.com/nodkz/mongodb-memory-server/commit/923aae63af73a30a58a4cc6e9f49ddcb23f9d42b))
* **MongoInstance:** closeHandler: also log the exit signal ([a9f42ea](https://github.com/nodkz/mongodb-memory-server/commit/a9f42ea541f352cfb38f80e1523cf8497c94e47a))
* **MongoInstance:** fix resetting "isInstancePrimary" in the same line ([c91b703](https://github.com/nodkz/mongodb-memory-server/commit/c91b703dd1b09b0c4e17e7b4658d87e00dace54a))
* **MongoInstance:** stop: use "this.debug" over "log" ([00740ac](https://github.com/nodkz/mongodb-memory-server/commit/00740ac5764edcb68ce1a775d161e819978d13f6))
* **MongoInstance:** update nodejs version warning (forgot in 7.0) ([2741434](https://github.com/nodkz/mongodb-memory-server/commit/274143467058ec9f333198f4f3d96ebb69e7cc71))
* **MongoInstance:** use "shutdown" on all replset members instead of "replSetStepDown" on primary ([40af0a0](https://github.com/nodkz/mongodb-memory-server/commit/40af0a06d5b185304b593db8f1555613bc1c26b8))
* **MongoMemoryReplset:** improve logging & disable "writeConcernMajorityJournalDefault" when memory ([8427df8](https://github.com/nodkz/mongodb-memory-server/commit/8427df84d8ea4da9a70a516d2552e93d83253ae4))
* **resolveConfig:** enable debug mode when defined through package config ([20b121f](https://github.com/nodkz/mongodb-memory-server/commit/20b121f6e7d6ba3b65193dad0581c8669c869b7d))
* **utils:** killProcess: use better logging ([aa75e42](https://github.com/nodkz/mongodb-memory-server/commit/aa75e420008f929ef1b010a655e9ef941e3fd894))
* **utils::assertion:** change to use named fallback error ([88ae810](https://github.com/nodkz/mongodb-memory-server/commit/88ae8107af5c4ca9f2cf9a1fc65d0f00f95f85e5))


### Style

* **errors:** add REFACTOR comment ([e9dd68f](https://github.com/nodkz/mongodb-memory-server/commit/e9dd68f44a247660e483526c2e89869bf15afa2f))
* **MongoBinaryDownload::download:** add "[@returns](https://github.com/returns)" tsdoc ([ddb88c4](https://github.com/nodkz/mongodb-memory-server/commit/ddb88c469e59edbd3d4a7aa2370fdfb98c4026f9))
* **MongoInstance:** ignore nodejs warning from coverage ([68adbbf](https://github.com/nodkz/mongodb-memory-server/commit/68adbbf3f6e922364cbe40106d9fe1a9985af4ca))
* **MongoMemoryReplSet:** add todo ([0bbc346](https://github.com/nodkz/mongodb-memory-server/commit/0bbc34673fae548f6083806912cf3e1d0de6abf5))
* **MongoMemoryServer:** move protected function to other protected functions ([3b1dc73](https://github.com/nodkz/mongodb-memory-server/commit/3b1dc735c75818ab6f6b13f0af8d8860161b69c2))
* fix some typos "an" -> "a" ([ad0a930](https://github.com/nodkz/mongodb-memory-server/commit/ad0a930b052fd2267612ae65d3568895b64d497c))

## [7.4.0-beta.8](https://github.com/nodkz/mongodb-memory-server/compare/v7.4.0-beta.7...v7.4.0-beta.8) (2021-08-31)


### Features

* **MongoMemoryReplSet:** add named error for "count" assertion ([d67202b](https://github.com/nodkz/mongodb-memory-server/commit/d67202b98157bb876377ae17d89b164f19d1f4e6))


### Dependencies

* **@google/semantic-release-replace-plugin:** upgrade to version 1.1.0 ([809f6f6](https://github.com/nodkz/mongodb-memory-server/commit/809f6f6980d63caefa515b2839a25ef67219c109))
* **@types/jest:** upgrade to version 27.0.1 ([c26feae](https://github.com/nodkz/mongodb-memory-server/commit/c26feae8def054ebceb5ccfba720eb42b4aa05da))
* **@typescript-eslint/*:** upgrade to version 4.30.0 ([efd914e](https://github.com/nodkz/mongodb-memory-server/commit/efd914e9c5287d22e7640210a9af0eb20301db0f))
* **async-mutex:** upgrade to version 0.3.2 ([01e662a](https://github.com/nodkz/mongodb-memory-server/commit/01e662afc100388f9d1518c0d7691c9565f33830))
* **eslint-plugin-prettier:** upgrade to version 4.0.0 ([79e1b2d](https://github.com/nodkz/mongodb-memory-server/commit/79e1b2d27c4496157ace7406269b5e0894b4a273))
* **find-cache-dir:** upgrade to version 3.3.2 ([2ef3e00](https://github.com/nodkz/mongodb-memory-server/commit/2ef3e005d9a88c2f000c9b6fe7552232e612b5df))
* **husky:** upgrade to version 7.0.2 ([3b33ff8](https://github.com/nodkz/mongodb-memory-server/commit/3b33ff8c3b97dab209984e5fdcbf2d3658f825ec))
* **jest:** upgrade to version 27.1.0 ([fbe852b](https://github.com/nodkz/mongodb-memory-server/commit/fbe852bba7d914889a1e92566a3dbba7cfd24303))
* **lerna:** remove dependency ([1266a57](https://github.com/nodkz/mongodb-memory-server/commit/1266a57a67b8f05228fcb5599f2331f9019cd7f1)), closes [#537](https://github.com/nodkz/mongodb-memory-server/issues/537)
* **semantic-release:** upgrade to version 17.4.7 ([c67b291](https://github.com/nodkz/mongodb-memory-server/commit/c67b29136e016ef02c4fabd49ca593b2fa538961))
* **ts-jest:** upgrade to version 27.0.5 ([07f3e38](https://github.com/nodkz/mongodb-memory-server/commit/07f3e38c17d3e00df4a4da06f3206f7c8f4c671b))
* **typescript:** upgrade to version 4.4.2 ([e89df5a](https://github.com/nodkz/mongodb-memory-server/commit/e89df5a3ea1ee6142983026d55c5f4d7ff1712c8))


### Fixes

* **utils::assertion:** change to use named fallback error ([88ae810](https://github.com/nodkz/mongodb-memory-server/commit/88ae8107af5c4ca9f2cf9a1fc65d0f00f95f85e5))

## [7.4.0-beta.7](https://github.com/nodkz/mongodb-memory-server/compare/v7.4.0-beta.6...v7.4.0-beta.7) (2021-08-28)


### Features

* **MongoBinary:** add ability to disable SYSTEM_BINARY version check ([331d820](https://github.com/nodkz/mongodb-memory-server/commit/331d820d2493bdfbdf37652c5387eeaeccae64e5)), closes [#529](https://github.com/nodkz/mongodb-memory-server/issues/529)

## [7.4.0-beta.6](https://github.com/nodkz/mongodb-memory-server/compare/v7.4.0-beta.5...v7.4.0-beta.6) (2021-08-27)


### Features

* **errors:** unfiy binary X_OK checking and throwing errors ([4401834](https://github.com/nodkz/mongodb-memory-server/commit/440183493bebe709e76705c947ea265e6d3b051f))


### Fixes

* **MongoInstance:** update nodejs version warning (forgot in 7.0) ([2741434](https://github.com/nodkz/mongodb-memory-server/commit/274143467058ec9f333198f4f3d96ebb69e7cc71))


### Style

* **MongoInstance:** ignore nodejs warning from coverage ([68adbbf](https://github.com/nodkz/mongodb-memory-server/commit/68adbbf3f6e922364cbe40106d9fe1a9985af4ca))

## [7.4.0-beta.5](https://github.com/nodkz/mongodb-memory-server/compare/v7.4.0-beta.4...v7.4.0-beta.5) (2021-08-27)


### Features

* actually change "auth" to work on non-inmemory storageEngines ([7ac3758](https://github.com/nodkz/mongodb-memory-server/commit/7ac3758418dc89146d2b8f31bb0412e30c402905)), closes [#533](https://github.com/nodkz/mongodb-memory-server/issues/533)


### Refactor

* **MongoInstance:** debug: passthrough any extra arguments to the logger to handle ([5dbdded](https://github.com/nodkz/mongodb-memory-server/commit/5dbdded2b326796f730a5ae00895bcf828d2ecde))
* **MongoMemoryServer:** improve logging ([0326b37](https://github.com/nodkz/mongodb-memory-server/commit/0326b3762c8a6ce126b81b287f27dfb5f31d5e14))


### Style

* **MongoMemoryReplSet:** add todo ([0bbc346](https://github.com/nodkz/mongodb-memory-server/commit/0bbc34673fae548f6083806912cf3e1d0de6abf5))
* **MongoMemoryServer:** move protected function to other protected functions ([3b1dc73](https://github.com/nodkz/mongodb-memory-server/commit/3b1dc735c75818ab6f6b13f0af8d8860161b69c2))


### Fixes

* **MongoInstance:** change "instanceReplState" to get triggered on "transition" ([923aae6](https://github.com/nodkz/mongodb-memory-server/commit/923aae63af73a30a58a4cc6e9f49ddcb23f9d42b))
* **MongoInstance:** fix resetting "isInstancePrimary" in the same line ([c91b703](https://github.com/nodkz/mongodb-memory-server/commit/c91b703dd1b09b0c4e17e7b4658d87e00dace54a))
* **MongoMemoryReplset:** improve logging & disable "writeConcernMajorityJournalDefault" when memory ([8427df8](https://github.com/nodkz/mongodb-memory-server/commit/8427df84d8ea4da9a70a516d2552e93d83253ae4))

## [7.4.0-beta.4](https://github.com/nodkz/mongodb-memory-server/compare/v7.4.0-beta.3...v7.4.0-beta.4) (2021-08-12)


### Fixes

* **resolveConfig:** enable debug mode when defined through package config ([20b121f](https://github.com/nodkz/mongodb-memory-server/commit/20b121f6e7d6ba3b65193dad0581c8669c869b7d))

## [7.4.0-beta.3](https://github.com/nodkz/mongodb-memory-server/compare/v7.4.0-beta.2...v7.4.0-beta.3) (2021-08-12)


### Features

* **errors:** add "EnsureInstanceError" ([e5aaebf](https://github.com/nodkz/mongodb-memory-server/commit/e5aaebf90a16f5f84fdd3497c48c30e0b8687d94))
* **errors:** add "Md5CheckFailedError" ([6ca70f0](https://github.com/nodkz/mongodb-memory-server/commit/6ca70f0a83ceee14818436a6295a020b0e44be6a))
* **errors:** add "NoSystemBinaryFoundError" ([e1206c7](https://github.com/nodkz/mongodb-memory-server/commit/e1206c7b14097883763cc5110542fd7f5c390203))
* **errors:** add "StartBinaryFailedError" ([83626e0](https://github.com/nodkz/mongodb-memory-server/commit/83626e00d843eb81be5dc935eeac5c5381a2c78c))
* **errors:** add "UnableToUnlockLockfileError" ([c1d1426](https://github.com/nodkz/mongodb-memory-server/commit/c1d1426fcfb678236ea45f6d89a1a512bf3f2bb2))
* **errors:** add error "WaitForPrimaryTimeoutError" ([db1a3aa](https://github.com/nodkz/mongodb-memory-server/commit/db1a3aab866966ce66f51d5885ff531f4f4a60f7))
* **errors:** rename "UnknownArchitecture" to "UnknownArchitectureError" ([c546ab0](https://github.com/nodkz/mongodb-memory-server/commit/c546ab05427482e703ddbfa6bc481c450244aafd))
* **errors:** rename "UnknownLockfileStatus" to "UnknownLockfileStatusError" ([f0fb208](https://github.com/nodkz/mongodb-memory-server/commit/f0fb208be8cce7f35dc9a962bd367754065b0d13))
* **errors:** rename "UnknownPlatform" to "UnknownPlatformError" ([2800029](https://github.com/nodkz/mongodb-memory-server/commit/28000295fe5f3e530b6786ca27ac36d11a446e06))


### Style

* fix some typos "an" -> "a" ([ad0a930](https://github.com/nodkz/mongodb-memory-server/commit/ad0a930b052fd2267612ae65d3568895b64d497c))


### Fixes

* **MongoInstance:** closeHandler: also log the exit signal ([a9f42ea](https://github.com/nodkz/mongodb-memory-server/commit/a9f42ea541f352cfb38f80e1523cf8497c94e47a))
* **MongoInstance:** stop: use "this.debug" over "log" ([00740ac](https://github.com/nodkz/mongodb-memory-server/commit/00740ac5764edcb68ce1a775d161e819978d13f6))
* **MongoInstance:** use "shutdown" on all replset members instead of "replSetStepDown" on primary ([40af0a0](https://github.com/nodkz/mongodb-memory-server/commit/40af0a06d5b185304b593db8f1555613bc1c26b8))
* **utils:** killProcess: use better logging ([aa75e42](https://github.com/nodkz/mongodb-memory-server/commit/aa75e420008f929ef1b010a655e9ef941e3fd894))

## [7.4.0-beta.2](https://github.com/nodkz/mongodb-memory-server/compare/v7.4.0-beta.1...v7.4.0-beta.2) (2021-08-09)


### Features

* **MongoBinaryDownloadUrl:** add support for Amazon Distro ([a7e14b5](https://github.com/nodkz/mongodb-memory-server/commit/a7e14b5fd2b3f8d1e0ba415c0140412022476f91)), closes [#527](https://github.com/nodkz/mongodb-memory-server/issues/527)


### Fixes

* **MongoBinaryDownloadUrl:** getRhelVersionString: fallback to "70" ([55293a1](https://github.com/nodkz/mongodb-memory-server/commit/55293a102be964a93d274edfc1558635ff1d7202))


### Dependencies

* **@types/debug:** upgrade to 4.1.7 ([557d40c](https://github.com/nodkz/mongodb-memory-server/commit/557d40c24705485d41d7333a871e1f5c1c4beb05))
* **@types/find-cache-dir:** upgrade to version 3.2.1 ([5814d48](https://github.com/nodkz/mongodb-memory-server/commit/5814d48d670124b6b8c1d2f8a3ccd808e198adad))
* **@types/jest:** upgrade to version 26.0.24 ([387c4da](https://github.com/nodkz/mongodb-memory-server/commit/387c4da1cae179bae1fd528e9766af73ff67a9d6))
* **@types/mkdirp:** upgrade to version 1.0.2 ([4f273db](https://github.com/nodkz/mongodb-memory-server/commit/4f273dbd47e7eac46cfbad7c1d94a346190ca1e6))
* **@types/mongodb:** upgrade to version 3.6.20 ([02aef1a](https://github.com/nodkz/mongodb-memory-server/commit/02aef1a664892c8293aefe568470a30ae6277c65))
* **@types/semver:** upgrade to version 7.3.8 ([ae728f7](https://github.com/nodkz/mongodb-memory-server/commit/ae728f7ae7a56593d318b7734cc375da26be201b))
* **@typescript-eslint/*:** upgrade to version 4.29.0 ([38b42a9](https://github.com/nodkz/mongodb-memory-server/commit/38b42a9f1863b8119c31aee294c29f2cdf8ede69))
* **commitlint:** upgrade to version 13.1.0 ([8497e9f](https://github.com/nodkz/mongodb-memory-server/commit/8497e9f8a3f7eb51c181adbb476ab2cd12f2b991))
* **eslint:** upgrade to 7.32.0 ([9202186](https://github.com/nodkz/mongodb-memory-server/commit/92021864b8701c1f0c4d6fee352e1a5fb7d22702))
* **husky:** upgrade to version 7.0.1 ([2b37bda](https://github.com/nodkz/mongodb-memory-server/commit/2b37bda489eab9401ad0831caf830631d0ce466c))
* **lint-staged:** upgrade to version 11.1.2 ([e8d3575](https://github.com/nodkz/mongodb-memory-server/commit/e8d357545ff65c14cf594932d1a135248a1a8f60))
* **ts-jest:** upgrade to version 27.0.4 ([377a0d2](https://github.com/nodkz/mongodb-memory-server/commit/377a0d25f2cc0f00bdf44deec88f63598a78795b))

## [7.4.0-beta.1](https://github.com/nodkz/mongodb-memory-server/compare/v7.3.5...v7.4.0-beta.1) (2021-08-07)


### Features

* **getos:** support multiple "id_like" ([ce42fad](https://github.com/nodkz/mongodb-memory-server/commit/ce42fad3f249c885fb2f8f23ae0eaf7b5c4a6741)), closes [#525](https://github.com/nodkz/mongodb-memory-server/issues/525)

### [7.3.6](https://github.com/nodkz/mongodb-memory-server/compare/v7.3.5...v7.3.6) (2021-08-09)


### Fixes

* **MongoBinaryDownloadUrl:** getRhelVersionString: fallback to "70" ([55293a1](https://github.com/nodkz/mongodb-memory-server/commit/55293a102be964a93d274edfc1558635ff1d7202))

### [7.3.5](https://github.com/nodkz/mongodb-memory-server/compare/v7.3.4...v7.3.5) (2021-08-07)


### Fixes

* **getos:** fix OSRegex "id" & "id_like" including ending quotes ([8609c49](https://github.com/nodkz/mongodb-memory-server/commit/8609c498ab54d161494e1893a4417ce299af8a94)), closes [#525](https://github.com/nodkz/mongodb-memory-server/issues/525)

### [7.3.4](https://github.com/nodkz/mongodb-memory-server/compare/v7.3.3...v7.3.4) (2021-07-27)


### Fixes

* **MongoInstance:** assert "this.mongodProcess.pid" before usage (childprocess pid can be undefined) ([394ea3a](https://github.com/nodkz/mongodb-memory-server/commit/394ea3a2ed3859797d85b7c9b7571bdd532b68d2))
* **MongoInstance:** stdoutHandler: try to apply CodeQL suggestions for CWE-730 ([e17dc7c](https://github.com/nodkz/mongodb-memory-server/commit/e17dc7cb7350150823a0b17e381d1c84d36be955))
* **utils:** allow optional parameter and test if undefined (childprocess pid can be undefined) ([84f59a5](https://github.com/nodkz/mongodb-memory-server/commit/84f59a55918ff4845b003470e075a245e5c90b75))

### [7.3.3](https://github.com/nodkz/mongodb-memory-server/compare/v7.3.2...v7.3.3) (2021-07-27)


### Fixes

* **MongoBinaryDownload:** handle all options from "MongoBinaryOpts" in constructor ([5ce583e](https://github.com/nodkz/mongodb-memory-server/commit/5ce583eaa0d27993ad8e2c014dd965472faf76f3)), closes [#514](https://github.com/nodkz/mongodb-memory-server/issues/514)

### [7.3.2](https://github.com/nodkz/mongodb-memory-server/compare/v7.3.1...v7.3.2) (2021-07-24)


### Fixes

* **MongoBinaryDownload:** getDownloadUrl: allow DOWNLOAD_MIRROR to add extra paths ([ae7ddab](https://github.com/nodkz/mongodb-memory-server/commit/ae7ddab79fcbb637cdcd2c193554e9ba2907cf9e)), closes [#512](https://github.com/nodkz/mongodb-memory-server/issues/512)

### [7.3.1](https://github.com/nodkz/mongodb-memory-server/compare/v7.3.0...v7.3.1) (2021-07-21)


### Fixes

* **DryMongoBinary:** generateDownloadPath: return sytemBinary if exists ([91ab2b0](https://github.com/nodkz/mongodb-memory-server/commit/91ab2b06f64a5103e1039fbbf152347433dbe44b))
* **DryMongoBinary:** use provided systembinary (and not ignore it) ([bc89da3](https://github.com/nodkz/mongodb-memory-server/commit/bc89da33a4cddaa3b4dda8480a2ba480d3cd3051))

## [7.3.0](https://github.com/nodkz/mongodb-memory-server/compare/v7.2.1...v7.3.0) (2021-07-19)


### Features

* **MongoMemoryReplSet:** add replicaMemberConfig to replica instance ([#508](https://github.com/nodkz/mongodb-memory-server/issues/508)) ([3752c72](https://github.com/nodkz/mongodb-memory-server/commit/3752c72dbdb7a265ffe003459b2198e89b024d61))

### [7.2.1](https://github.com/nodkz/mongodb-memory-server/compare/v7.2.0...v7.2.1) (2021-07-15)


### Fixes

* **utils:** statPath: do not throw on EACCES ([#506](https://github.com/nodkz/mongodb-memory-server/issues/506)) ([d07eb3b](https://github.com/nodkz/mongodb-memory-server/commit/d07eb3b6791701f26613cd4e296aca19ee2f2902))

## [7.2.0](https://github.com/nodkz/mongodb-memory-server/compare/v7.1.0...v7.2.0) (2021-07-06)


### Features

* **MongoMemoryServer:** getUri: throw StateError instead of assertionError ([2e632ab](https://github.com/nodkz/mongodb-memory-server/commit/2e632abaa170c0750137f44077ec4f5b6d3f01f7)), closes [#501](https://github.com/nodkz/mongodb-memory-server/issues/501) [#497](https://github.com/nodkz/mongodb-memory-server/issues/497) [#458](https://github.com/nodkz/mongodb-memory-server/issues/458)


### Fixes

* **errors:** StateError: add link to migration guide ([d1be861](https://github.com/nodkz/mongodb-memory-server/commit/d1be861cdf222de3a4bcd95c30b6769f7e255270))

## [7.1.0](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0...v7.1.0) (2021-07-05)


### Features

* **resolveConfig:** replace "find-package-json" with "new-find-package-json" ([90b6d1b](https://github.com/nodkz/mongodb-memory-server/commit/90b6d1b91e433ac378172270fa5970d6f388467b)), closes [#495](https://github.com/nodkz/mongodb-memory-server/issues/495) [#494](https://github.com/nodkz/mongodb-memory-server/issues/494)

## [7.0.0](https://github.com/nodkz/mongodb-memory-server/compare/v6.9.6...v7.0.0) (2021-07-01)


### ⚠ BREAKING CHANGES

* Lowest supported NodeJS version is now 12.22
* `getUri`'s parameter got changed to use  ""(empty) by default
* `getUri`'s parameter got changed to what the actual definition is, and uses "admin" by default
* **MongoMemoryServer:** "MongoMemoryServer" now implements "ManagerAdvanced"
* **MongoInstance:** "MongoInstance" now implements "ManagerBase"
* **MongoInstance:** renaming "MongoInstance.childProcess" to "MongoInstance.mongodProcess" can break some api's
* **utils:** Default-export from "utils" got removed, import it now with "{ generateDbName }"
* **MongoInstance:** MongoInstance's functions got renamed to make more clear what they do
(create,start,stop - instead of run,run,kill)
* **getos:** All "USE*" and "SKIP*" Environment Variables got removed in favor of an better handling
* **MongoInstance:** remove function "MongoInstance.getPid", replace with "MongoInstance.childProcess?.pid"
* **MongoBinary:** remove function "MongoBinary.getCachePath", replace with "MongoBinary.cache.get"
* **MongoBinaryDownload:** remove "MongoBinaryDownload.locationExists", replace with "utils.pathExists"
* **MongoBinary:** remove value "LATEST_VERSION" in favor of using resolveConfig Value "VERSION"
* **resolveConfig:** removing alias "reInitializePackageJson", replace with "findPackageJson"
* **MongoMemoryReplSet:** not resetting "servers" after calling "stop" on an replSet can be breaking for some cases
* **MongoMemoryServer:** allow the re-use of instances & dbPath's meant to change some things internally, which could be breaking
* **MongoMemoryReplSet:** change "getUri" to be sync (dosnt wait until running anymore)
* **MongoMemoryReplSet:** remove option "oplogSize", replace with ".replSetOpts.args.push('--oplogSize', '1')"
* **MongoMemoryReplSet:** remove function "getDbName", replace with ".opts.replSet.dbName"
* **MongoMemoryReplSet:** removing function "getConnectionString" could break some code
* **MongoMemoryReplSet:** removing "async" / modifing return type "Promise<string>" can break code
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
* **MongoInstance:** changing "null" to "undefined" can break some code
* **MongoInstance:** throwing an error if 2 values are now undefined/null can break some code
* **MongoInstance:** removing the possibility to overwrite 2 functions this can break some use-cases
* **MongoInstance:** removing an function can break some use-cases
* **MongoMemoryReplSet:** "_waitForPrimary" now uses events instead of calling function "waitPrimaryReady"
* **MongoInstance:** because of changing values to "required" this can break some use-cases
* **MongoInstance:** removing the "dynamic" part can break some code with custom debug-logging
* **MongoInstance:** because of the rename it can break some use-cases

### Features

* set lowest supported nodejs version to 12.22 ([7d6d018](https://github.com/nodkz/mongodb-memory-server/commit/7d6d018a6fd3357a2ed82f663fd5218143ec0a2a))
* **db_util:** add function "assertion" ([c059500](https://github.com/nodkz/mongodb-memory-server/commit/c059500f946fa248260b686ec4ffaaa58c942a74))
* **db_util:** add function "ensureAsync" ([971b02d](https://github.com/nodkz/mongodb-memory-server/commit/971b02d07453b46dd37dace8d91efd74b20c3575))
* **db_util:** rename function "getUriBase" to "uriTemplate" ([c888b95](https://github.com/nodkz/mongodb-memory-server/commit/c888b952891fc6e5e54d8ac29994fb8e679b9f59)), closes [#404](https://github.com/nodkz/mongodb-memory-server/issues/404)
* **DryMongoBinary:** add new "DryMongoBinary" ([3841312](https://github.com/nodkz/mongodb-memory-server/commit/3841312fd414df47223c0f9d59636f910bc2bc8b))
* **DryMongoBinary:** add new function "generateOptions" ([2d89ba1](https://github.com/nodkz/mongodb-memory-server/commit/2d89ba1df74a90e9663228e7a1101c8d3222dd86))
* **DryMongoBinary:** combineBinaryName: remove unused parameter ([edee483](https://github.com/nodkz/mongodb-memory-server/commit/edee4836ba240908b377b4588477c205fbcd2f88))
* **errors:** add error "StateError" ([e582407](https://github.com/nodkz/mongodb-memory-server/commit/e582407cf0904244465e56012de9a7c9caf410a9))
* **errors:** add error "UnknownArchitecture" ([e2c39d6](https://github.com/nodkz/mongodb-memory-server/commit/e2c39d6b448aac4a81be23dfb4d6cef33aaef90f))
* **errors:** add error "UnknownLockfileStatus" ([186df5b](https://github.com/nodkz/mongodb-memory-server/commit/186df5b1ccd81714826d2880eb07bf4e3d80d0de))
* **errors:** add error "UnknownPlatform" ([747d893](https://github.com/nodkz/mongodb-memory-server/commit/747d893b57c51ec85a10d4343cb17044c6eb4715))
* **getos:** remove all "USE*" and "SKIP*" environment variables ([e389c3e](https://github.com/nodkz/mongodb-memory-server/commit/e389c3e68715f38e9012a7a758dd1dbaad38a3e6))
* **getos:** simplify reading an release file ([e5e6521](https://github.com/nodkz/mongodb-memory-server/commit/e5e6521eb339e54de481c532062dd143bfb33a61))
* **lockfile:** add custom lockfile implementation ([e6a2237](https://github.com/nodkz/mongodb-memory-server/commit/e6a223713277f6f3eae2fc6f0d620f3ded04b8bb))
* **lockfile:** replace custom errors with "UnknownLockfileStatus" ([5ea5662](https://github.com/nodkz/mongodb-memory-server/commit/5ea56626454ff1852ccc07ad95630e1db130000f))
* **MongoBinary:** add option to disable automatic download ([2c0639b](https://github.com/nodkz/mongodb-memory-server/commit/2c0639b0d860c0f9f1cea0f8b7fd15bdd78f9317))
* **MongoBinary:** implement usage of "DryMongoBinary" ([4a13cea](https://github.com/nodkz/mongodb-memory-server/commit/4a13cead837e6f6005c07c741cb64ad704c5d4ca))
* **MongoBinary:** remove function "getCachePath" ([af164c1](https://github.com/nodkz/mongodb-memory-server/commit/af164c19007699ec79a9077d9ac7409e79c6f651))
* **MongoBinary:** remove value "LATEST_VERSION" ([22c6dfd](https://github.com/nodkz/mongodb-memory-server/commit/22c6dfd1a710cda5cf465c590f4947c916de46c0))
* **MongoBinaryDownload:** add option to use "http" over "https" ([b178a97](https://github.com/nodkz/mongodb-memory-server/commit/b178a970239e7a40398c4bf085ab09b9d63b7e7e)), closes [#172](https://github.com/nodkz/mongodb-memory-server/issues/172)
* **MongoBinaryDownload:** remove function "locationExists" ([0ba071a](https://github.com/nodkz/mongodb-memory-server/commit/0ba071abfac93d4abe016ad0ed7c9e3a5235a28f))
* **MongoBinaryDownload:** startDownload: add check that the downloadDir has sufficient permissions ([310cdae](https://github.com/nodkz/mongodb-memory-server/commit/310cdae9299b505b32cd9f2d633ab72119480022))
* **MongoBinaryDownloadUrl:** add support for "arch/manjaro" (ubuntu workaround) ([21449d6](https://github.com/nodkz/mongodb-memory-server/commit/21449d64e53204cb60b43451be5ed551420a0af3))
* **MongoBinaryDownloadUrl:** add support for ubuntu-arm64 ([5733a0f](https://github.com/nodkz/mongodb-memory-server/commit/5733a0f391453d7375ee1046722f744a049ea339)), closes [#443](https://github.com/nodkz/mongodb-memory-server/issues/443)
* **MongoBinaryDownloadUrl:** allow overwrite of archiveName ([c19d216](https://github.com/nodkz/mongodb-memory-server/commit/c19d2167a88977a67c886f651bf0a70dcf51a806)), closes [#295](https://github.com/nodkz/mongodb-memory-server/issues/295)
* **MongoBinaryDownloadUrl:** refactor getUbuntuVersionString ([fc08c25](https://github.com/nodkz/mongodb-memory-server/commit/fc08c25d95964cffd6eee83037d60b228c38e2a4))
* **MongoBinaryDownloadUrl:** remove function "getMintVersionString" ([d66e28a](https://github.com/nodkz/mongodb-memory-server/commit/d66e28ade0eeeaf3bc9b8bcc276c9e560920d439))
* **MongoBinaryDownloadUrl:** replace custom errors with "UnknownArchitecture" ([6755554](https://github.com/nodkz/mongodb-memory-server/commit/67555547060d233fc3eca3a22452dbcd76b86c20))
* **MongoBinaryDownloadUrl:** replace custom errors with "UnknownPlatform" ([86aac73](https://github.com/nodkz/mongodb-memory-server/commit/86aac73a768ca912527eaa30e50c0ad7a856ca26))
* **MongoBinaryDownloadUrl:** support more arm64 (aarch64) versions ([8b5434c](https://github.com/nodkz/mongodb-memory-server/commit/8b5434c65217af87458a704bd93f6ffabb18de6c)), closes [#482](https://github.com/nodkz/mongodb-memory-server/issues/482)
* **MongoInstance:** add value "isReplSet" ([3ba31e2](https://github.com/nodkz/mongodb-memory-server/commit/3ba31e249c6ea4cd883979a1a5799863bf9ae971))
* **MongoInstance:** change options to be readonly ([e599372](https://github.com/nodkz/mongodb-memory-server/commit/e5993727c618e08e1196b61d1d768bee34657738))
* **MongoInstance:** change root values of "MongodOpts" to be required ([9779721](https://github.com/nodkz/mongodb-memory-server/commit/97797210bddbb117bfabb28f5b0be898a543bb3e))
* **MongoInstance:** extend EventEmitter ([10965c7](https://github.com/nodkz/mongodb-memory-server/commit/10965c7ac5c6a0877561221608f80d508cbfe30a)), closes [#365](https://github.com/nodkz/mongodb-memory-server/issues/365)
* **MongoInstance:** graceful ReplSet shutdown ([017239c](https://github.com/nodkz/mongodb-memory-server/commit/017239c953fd44018855a55d417bfc4573c9f684))
* **MongoInstance:** implement "ManagerBase" ([e6e4e6b](https://github.com/nodkz/mongodb-memory-server/commit/e6e4e6b1de4a2635e195217bca9de36f0634c90e))
* **MongoInstance:** make "port" and "dbPath" required ([749c3e3](https://github.com/nodkz/mongodb-memory-server/commit/749c3e3dc9bc93d1506e034bf24a74b4420a4139))
* **MongoInstance:** outsource "MongodOpts.instance" ([d9dd6f8](https://github.com/nodkz/mongodb-memory-server/commit/d9dd6f81f84a69b412cdb5198baaabbdfaa156f7))
* **MongoInstance:** remove function "getPid" ([f40da9a](https://github.com/nodkz/mongodb-memory-server/commit/f40da9ac167ba0da65459687c5cfcc990d07a9b0))
* **MongoInstance:** remove function "waitPrimaryReady" ([1536dc2](https://github.com/nodkz/mongodb-memory-server/commit/1536dc26f8548e95abc3baa0dba4b9b333b9e140))
* **MongoInstance:** rename functions to unify all classes ([655d295](https://github.com/nodkz/mongodb-memory-server/commit/655d29575aa2a39c4edee91d0f5771e25ab5b83b))
* **MongoInstance:** rename interface "MongodOps" to "MongodOpts" ([edd4d39](https://github.com/nodkz/mongodb-memory-server/commit/edd4d39e0f8c0d1ed9c21f95f462e7bb8f42737f))
* **MongoInstance:** rename property "childProcess" to "mongodProcess" ([46c56d8](https://github.com/nodkz/mongodb-memory-server/commit/46c56d8556a7d033cd32f6b02cfadd28b0473d67))
* **MongoInstance:** run: add check that the mongoBinary has sufficient permissions ([d9c1019](https://github.com/nodkz/mongodb-memory-server/commit/d9c101937bd3ad1af99ec32c0a3375246df3cafc))
* **MongoMemoryReplSet:** add basic "createAuth" support ([6c118a9](https://github.com/nodkz/mongodb-memory-server/commit/6c118a900d9daf272898d0f39134f7919499f299))
* **MongoMemoryReplSet:** add error if replSet count is 0 or lower ([0202e8f](https://github.com/nodkz/mongodb-memory-server/commit/0202e8fefb835fb256e8c1bd4573e15f8ac5c6f5))
* **MongoMemoryReplSet:** add getter "state" ([65135a8](https://github.com/nodkz/mongodb-memory-server/commit/65135a83a27a932937fe3989e1c56f8c33ea5f5c))
* **MongoMemoryReplSet:** allow re-use of instances & dbPath ([3d64705](https://github.com/nodkz/mongodb-memory-server/commit/3d64705c7406a0eb7e0ef7f1b9dbeb7685050494))
* **MongoMemoryReplSet:** change more errors to "StateError" & more consistent logs ([64780ee](https://github.com/nodkz/mongodb-memory-server/commit/64780ee35ca332a416610c4dfe5b0d0e79227234))
* **MongoMemoryReplSet:** getUri: allow executing while state is "init" ([b3ebac2](https://github.com/nodkz/mongodb-memory-server/commit/b3ebac256006a5339d578f23d70f5f00d2be57d0))
* **MongoMemoryReplSet:** remove function "getConnectionString" ([dbe844e](https://github.com/nodkz/mongodb-memory-server/commit/dbe844e8f972925391ba9edd983fc3043bc39efa))
* **MongoMemoryReplSet:** remove function "getDbName" ([6ebafbd](https://github.com/nodkz/mongodb-memory-server/commit/6ebafbd762c208f60bc9132773edfee07e6d2821))
* **MongoMemoryReplSet:** remove option "autoStart" ([90ed578](https://github.com/nodkz/mongodb-memory-server/commit/90ed57865db4f629d0efd00df5ac0ccbf1fda65a))
* **MongoMemoryReplSet:** remove option "oplogSize" ([07937e2](https://github.com/nodkz/mongodb-memory-server/commit/07937e2fd8ebce9759f4a837a6b013574488b7eb))
* **MongoMemoryReplSet:** rename "opts.*" to "*Opts" & add getters & setters ([c701f09](https://github.com/nodkz/mongodb-memory-server/commit/c701f0980762b21761361ef485b6282569b9741a))
* **MongoMemoryReplSet:** replace custom errors with "StateError" ([f49d7a1](https://github.com/nodkz/mongodb-memory-server/commit/f49d7a1c54f6ff39c5f5b91bdae32f3fc01f5c87))
* **MongoMemoryServer:** add (protected) function "getNewPort" ([662a69b](https://github.com/nodkz/mongodb-memory-server/commit/662a69b9b60b0c29a76cb1ee6f24eade095eb7a7))
* **MongoMemoryServer:** add ability to automatically create auth ([d5bf77a](https://github.com/nodkz/mongodb-memory-server/commit/d5bf77a16fe8cf4ca43383c5c371e218a487f314)), closes [#299](https://github.com/nodkz/mongodb-memory-server/issues/299)
* **MongoMemoryServer:** add ability to force same port on restart ([18c77e2](https://github.com/nodkz/mongodb-memory-server/commit/18c77e27cb4ed80514a3c4e893711a933c9bfe8a))
* **MongoMemoryServer:** add function "create" ([6dcb12a](https://github.com/nodkz/mongodb-memory-server/commit/6dcb12ad4a7f96739b0e11e13e3fb9c473633b11))
* **MongoMemoryServer:** add function "getStartOptions" ([f057ea7](https://github.com/nodkz/mongodb-memory-server/commit/f057ea765785f4acf094f7df2f799fb11acee9fd))
* **MongoMemoryServer:** add getter function "state" ([c19493f](https://github.com/nodkz/mongodb-memory-server/commit/c19493fd5243e66dc9afee7052178ee921d11369))
* **MongoMemoryServer:** allow re-use of instances & dbPath ([e2ae879](https://github.com/nodkz/mongodb-memory-server/commit/e2ae87961fa817e1d885487c9edc8ed89ac82260))
* **MongoMemoryServer:** change more errors to "StateError" & more consistent logs ([b05ec44](https://github.com/nodkz/mongodb-memory-server/commit/b05ec44d5319b34ff61b8aead819c11b9543a9bd))
* **MongoMemoryServer:** extend EventEmitter ([04ca3d7](https://github.com/nodkz/mongodb-memory-server/commit/04ca3d750b83174400409c073d709e7642dc819e))
* **MongoMemoryServer:** implement "ManagerAdvanced" ([709f733](https://github.com/nodkz/mongodb-memory-server/commit/709f733c737a84885d32675639b7cc0ac760b32b))
* **MongoMemoryServer:** remove "MongoInstanceDataT.childProcess" ([c71d8d4](https://github.com/nodkz/mongodb-memory-server/commit/c71d8d46ad52dbecc37470ccd182829b1afbc61e))
* **MongoMemoryServer:** remove "StartupInstanceData.uri" ([dec17a4](https://github.com/nodkz/mongodb-memory-server/commit/dec17a4379c54aab99a881faec2d6e88c949969b))
* **MongoMemoryServer:** remove deprecated function "getConnectionString" ([198f4c0](https://github.com/nodkz/mongodb-memory-server/commit/198f4c032ba0746c7b03ca509b16d8cd772ac875))
* **MongoMemoryServer:** remove function "getDbPath" ([2343771](https://github.com/nodkz/mongodb-memory-server/commit/2343771c9c7f1c780889cfea94e3f3947550edcd))
* **MongoMemoryServer:** remove function "getPort" ([5eb7017](https://github.com/nodkz/mongodb-memory-server/commit/5eb701741d6f650b72cfbda5394b4ccfab030766))
* **MongoMemoryServer:** remove option "autoStart" ([347085f](https://github.com/nodkz/mongodb-memory-server/commit/347085f890be05a28dc2b01c6ddb5011744f12dc))
* **MongoMemoryServer:** rename function "getInstanceInfo" into "get instanceInfo" ([ae8a9f8](https://github.com/nodkz/mongodb-memory-server/commit/ae8a9f82743df91a13716ab954bac510c30832af))
* **MongoMemoryServer:** replace custom error with "StateError" ([e965ef5](https://github.com/nodkz/mongodb-memory-server/commit/e965ef55c073f81d49934ffa86683bf06c1ed1ab))
* **resolveConfig:** add enum for all resolveConfig Variables ([7bd9160](https://github.com/nodkz/mongodb-memory-server/commit/7bd91609393f8151529b6827ef8c2f1a5be2fadb))
* **resolveConfig:** remove alias "reInitializePackageJson" ([acc4b0a](https://github.com/nodkz/mongodb-memory-server/commit/acc4b0a41f70cee240a4c062140cd14e694414ab))
* **utils:** add "ManagerBase" and "ManagerAdvanced" classes ([40190ef](https://github.com/nodkz/mongodb-memory-server/commit/40190ef3af9da8fd152a0db802a411fe20452f41))
* **utils:** uriTemplate: allow "port" to be undefined so that "host" can be an list of hosts ([e101162](https://github.com/nodkz/mongodb-memory-server/commit/e101162c2ca870ed34d420b2b7a8fa5cc47bb5db))
* change binary from "base/version/mongod" to "base/mongod-arch-dist-version" ([2682704](https://github.com/nodkz/mongodb-memory-server/commit/26827045298dc9b2bdecda024fabab2b7e8e8fec)), closes [#256](https://github.com/nodkz/mongodb-memory-server/issues/256)
* change package "mongodb" to be non-optional ([2b14552](https://github.com/nodkz/mongodb-memory-server/commit/2b14552beb5f2bdb1dd1978c8cf391d25adba4b1))
* remove cross-spawn ([c67ee8f](https://github.com/nodkz/mongodb-memory-server/commit/c67ee8f9330ade069dd00f9d49dd0f132f908048))
* **MongoMemoryServer:** remove function "getDbName" ([e2fc23f](https://github.com/nodkz/mongodb-memory-server/commit/e2fc23f62797aeb4e61a21924e7413621e767da8))
* **utils:** add function "pathExists" ([4114d27](https://github.com/nodkz/mongodb-memory-server/commit/4114d27d73a6b34a7b59edc1b86d22723061ec89))


### Reverts

* Revert "dependencies(semantic-release): upgrade to 17.4.4 (and related)" ([9825c63](https://github.com/nodkz/mongodb-memory-server/commit/9825c63c289f0d4dfc51e72d8bf870c638114719))
* "chore: remove unused file "tsconfig.test"" ([cc053c7](https://github.com/nodkz/mongodb-memory-server/commit/cc053c7f78ff29f67aabae30d180376c26ca96d8))
* "chore(codecov): add codecov config" ([1e66e8c](https://github.com/nodkz/mongodb-memory-server/commit/1e66e8cb2b244d4c7b7100da7d89b643c2ae802f))
* "fix(MongoMemoryReplSet): add extra fail-save to the timout" ([b2d63d9](https://github.com/nodkz/mongodb-memory-server/commit/b2d63d9b0234a09b6507616ce6301c36e915b399))
* "test(replset-single): add in-detail error printing on error" ([7989082](https://github.com/nodkz/mongodb-memory-server/commit/7989082f9572e55b85ee934691a9bd404d6ed883))


### Refactor

* ***index:** use "tslib.__exportStar" ([2e9faec](https://github.com/nodkz/mongodb-memory-server/commit/2e9faec7a27a13652378d4cdd4d5bd632dc0fa8c))
* **db_util:** uriTemplate: change "query" to be an string-array ([8dffa64](https://github.com/nodkz/mongodb-memory-server/commit/8dffa64ee4d56523cefd993b1158d2a9e224cd8a))
* **getos:** replace "promisify" with "fs.promises" ([60e184b](https://github.com/nodkz/mongodb-memory-server/commit/60e184bb294031e151a40cf668ebff2fd09734ed))
* **index:** directly export instead of import-export ([ee2e62b](https://github.com/nodkz/mongodb-memory-server/commit/ee2e62bf1ed9d3fed2eb508ca67bbc967017db5e))
* **MongoBinary:** change "cache" to be an Map ([74d30a0](https://github.com/nodkz/mongodb-memory-server/commit/74d30a0244f1d4797129dc9b577ef50d5aae8d41)), closes [#374](https://github.com/nodkz/mongodb-memory-server/issues/374)
* **MongoBinary:** getSystemPath: return "undefined" instead of empty string ([10039f9](https://github.com/nodkz/mongodb-memory-server/commit/10039f99ceea0321ddfa8a42e5039059cfeba6c4))
* **MongoBinary:** remove unused interface "MongoBinaryCache" ([025df2e](https://github.com/nodkz/mongodb-memory-server/commit/025df2ea32b0b4233c6d2be57646570311c21139))
* **MongoBinary:** replace "promisify" with "fs.promises" ([5a769f3](https://github.com/nodkz/mongodb-memory-server/commit/5a769f3fbd32b1be3e6b1413d07362047838f995))
* **MongoBinary:** use "DryMongoBinary.generateOptions" ([0e7e73f](https://github.com/nodkz/mongodb-memory-server/commit/0e7e73f9d3d00f4427411a75f3ffa92158f39979))
* **MongoBinaryDownload:** enhance md5 regex ([becac06](https://github.com/nodkz/mongodb-memory-server/commit/becac06f1a81a6d4f1cb5f21810e1784c13dce1a))
* **MongoBinaryDownload:** extract: combine win32 and linux regex ([702eaa9](https://github.com/nodkz/mongodb-memory-server/commit/702eaa93570df5429ef7503cc97f6bcc7dff3c8a))
* **MongoBinaryDownload:** extract: combine win32 filter regex ([28cfc7c](https://github.com/nodkz/mongodb-memory-server/commit/28cfc7ccf480512672af33ecd4e8010d9aba9f8c))
* **MongoBinaryDownload:** replace "existsSync" with "utils.pathExists" ([d8de1cc](https://github.com/nodkz/mongodb-memory-server/commit/d8de1cc8d0601f48146d7ae34a00af058a87e5db))
* **MongoBinaryDownload:** replace "promisify" with "fs.promises" ([911a922](https://github.com/nodkz/mongodb-memory-server/commit/911a922c92e8cf177604f33813adfb6fb98c694c))
* **MongoBinaryDownload:** unify path resolving ([4258eb7](https://github.com/nodkz/mongodb-memory-server/commit/4258eb7a5d6c4db1e51523de2c2681316f5b8d8f))
* **MongoBinaryDownloadUrl:** add helper function for regex de-duplication ([3d96e5e](https://github.com/nodkz/mongodb-memory-server/commit/3d96e5effbb0fced5c408633623fb8d360659494))
* **MongoBinaryDownloadUrl:** change "translateArch" to be static ([ba87378](https://github.com/nodkz/mongodb-memory-server/commit/ba873789e37f87ebcdc56cbe9ae85506c0ae8872))
* **MongoBinaryDownloadUrl:** minify "getUbuntuVersionString" ([04b0ee9](https://github.com/nodkz/mongodb-memory-server/commit/04b0ee9c5685107a1db67a6edc19bb3b2762bbc4))
* **MongoBinaryDownloadUrl:** remove "async" where not needed ([7970fbb](https://github.com/nodkz/mongodb-memory-server/commit/7970fbbaa8a32979a9634765f726419a00bd385c))
* **MongoBinaryDownloadUrl:** translatePlatform: change default error ([61685e0](https://github.com/nodkz/mongodb-memory-server/commit/61685e04c14a45c410a8c258be58f2ed7962820a))
* **MongoInstance:** add debug log to "prepareCommandArgs" ([64e2304](https://github.com/nodkz/mongodb-memory-server/commit/64e2304b65c98118ef5a573e2f5f0af4f8b688bb))
* **MongoInstance:** change "null" to "undefined" for "childProcess" & "killerProcess" ([232b812](https://github.com/nodkz/mongodb-memory-server/commit/232b812c7799da392955f6e4d4e49f67b8e10597))
* **MongoInstance:** kill_internal: rename "process" to "childProcess" ([1af3db2](https://github.com/nodkz/mongodb-memory-server/commit/1af3db265a1f84eaa3c679de84c1ec7e89210e64))
* **MongoInstance:** move "debug" into an private function ([3d23d5b](https://github.com/nodkz/mongodb-memory-server/commit/3d23d5b6d6dbac3c7b365bad3bc9bb03021ddfc6))
* **MongoInstance:** remove case for "shutting down with code" ([a7e7874](https://github.com/nodkz/mongodb-memory-server/commit/a7e78741c773e53acf8d25240de74c36d629755d))
* **MongoInstance:** remove redundant "debug.enabled" check ([104cf42](https://github.com/nodkz/mongodb-memory-server/commit/104cf42acc4bbe53fc12f6d8a9ed9750b5ab376b))
* **MongoInstance:** remove splitting of value "this.instanceOpts" ([6bd1b98](https://github.com/nodkz/mongodb-memory-server/commit/6bd1b985d63ce8694e2dc3e19c6f930e525ca411))
* **MongoInstance:** remove unused return value ([96cd1d9](https://github.com/nodkz/mongodb-memory-server/commit/96cd1d9638e544290238de05aeb56d22541473f6))
* **MongoInstance:** remove value "childProcessList" ([207263b](https://github.com/nodkz/mongodb-memory-server/commit/207263bdbd8f09411866a50801104c404d2fab7e))
* **MongoInstance:** rename event "instanceState" to "instanceReplState" ([f9aed77](https://github.com/nodkz/mongodb-memory-server/commit/f9aed773d685253b6bb7014876b160c786e49987))
* **MongoInstance:** replace "instanceReady" and "instanceFailed" with events ([6925c45](https://github.com/nodkz/mongodb-memory-server/commit/6925c45a15d4ab14d4bd134ebcad1e96c6349580))
* **MongoInstance:** shorten "constructor" ([efb31d9](https://github.com/nodkz/mongodb-memory-server/commit/efb31d9bb62d03e859b6e8b781ff2045e9a422f4))
* **MongoInstance:** split value "opts" ([91edfa3](https://github.com/nodkz/mongodb-memory-server/commit/91edfa3bd0c30acbb425c972bd9786460102b466))
* **MongoMemoryReplSet:** _initReplSet: directly use db "admin" ([a335500](https://github.com/nodkz/mongodb-memory-server/commit/a33550022244b023c21d16e667c5c8697b1c22b8))
* **MongoMemoryReplSet:** _initReplSet: reassign "adminDb" ([19ae688](https://github.com/nodkz/mongodb-memory-server/commit/19ae688d9ccc623ac42d032fada381268c10df93))
* **MongoMemoryReplSet:** _initReplSet: remove redundant object assignment ([8e6e312](https://github.com/nodkz/mongodb-memory-server/commit/8e6e312dfc2b9e430854f9868ee68f9cfdfdb8d8))
* **MongoMemoryReplSet:** _initReplSet: rename "conn" to "con" ([335780e](https://github.com/nodkz/mongodb-memory-server/commit/335780e295f0abe7f6d0d7f67aaf1f2e8f0ac8ba))
* **MongoMemoryReplSet:** _waitForPrimary: remove value "timeoutPromise" ([18b9a58](https://github.com/nodkz/mongodb-memory-server/commit/18b9a587b2f6b1185d6253f549abda380f018dec))
* **MongoMemoryReplSet:** "_waitForPrimary" use new events ([ed4b9e9](https://github.com/nodkz/mongodb-memory-server/commit/ed4b9e9c448435ff05cd504ed4e8a1a0e515b649))
* **MongoMemoryReplSet:** add function "stateChange" ([3c3d6fb](https://github.com/nodkz/mongodb-memory-server/commit/3c3d6fb6abe094ecf26bb55af1140041134eed27))
* **MongoMemoryReplSet:** change "_initReplSet" to be "protected" ([f46d113](https://github.com/nodkz/mongodb-memory-server/commit/f46d113497ea0c8685439abae7e3467b25ff8498))
* **MongoMemoryReplSet:** change "_initServer" to be "protected" ([4c32f45](https://github.com/nodkz/mongodb-memory-server/commit/4c32f458bb2957a6a33e783c990eaffe4b77637e))
* **MongoMemoryReplSet:** change "_state" to be "protected" ([415fc8f](https://github.com/nodkz/mongodb-memory-server/commit/415fc8fce60b8ca12dc1d352eddfa304ce77a70b))
* **MongoMemoryReplSet:** change "_waitForPrimary" to be "protected" ([d0d62e2](https://github.com/nodkz/mongodb-memory-server/commit/d0d62e2b9c4824ac6b238d97889d9bab96057bf6))
* **MongoMemoryReplSet:** change "getInstanceOpts" to be "protected" ([e954806](https://github.com/nodkz/mongodb-memory-server/commit/e9548062793340c78ff160afb41c7e3c9229a2d9))
* **MongoMemoryReplSet:** change "getUri" to be sync ([13f3f1d](https://github.com/nodkz/mongodb-memory-server/commit/13f3f1d3ee636b20005f233cb6f50530885659fc))
* **MongoMemoryReplSet:** change "if not state 'stopped'" to switch ([df1af0c](https://github.com/nodkz/mongodb-memory-server/commit/df1af0cac6690ccf5ac3d8b946a13f75d581ca62))
* **MongoMemoryReplSet:** change if-error to "assertion" ([179bdbb](https://github.com/nodkz/mongodb-memory-server/commit/179bdbb417548ce42b02d31c1e545c96595f0a56))
* **MongoMemoryReplSet:** improve "start" ([c2311cb](https://github.com/nodkz/mongodb-memory-server/commit/c2311cb4601404f08175f166d4c5114bca3f1d35))
* **MongoMemoryReplSet:** refactor "_state" into an enum ([e3d4678](https://github.com/nodkz/mongodb-memory-server/commit/e3d4678d34d7165a9726866234a1e25b898dd338))
* **MongoMemoryReplSet:** refactor multiple "if" into one switch ([8b8a609](https://github.com/nodkz/mongodb-memory-server/commit/8b8a6095f415f4daa5761f25c998bd594b0e3f4d))
* **MongoMemoryReplSet:** remove "?" from "MongoMemoryReplSetOptsT" ([138e21d](https://github.com/nodkz/mongodb-memory-server/commit/138e21d6433bfb431243ed9c0c83cef6ec71adfd))
* **MongoMemoryReplSet:** remove "async" from "getDbName" ([2775b4f](https://github.com/nodkz/mongodb-memory-server/commit/2775b4fcc6afcaab99414faf7100021f4047629e))
* **MongoMemoryReplSet:** remove commented out HACK ([1ad5bdc](https://github.com/nodkz/mongodb-memory-server/commit/1ad5bdc879a8f90620ba572e9ec9ab5ca686744c))
* **MongoMemoryReplSet:** remove dynamic import "mongodb" ([fb958ae](https://github.com/nodkz/mongodb-memory-server/commit/fb958aef5a604f636956c2d8656a45ade9595895))
* **MongoMemoryReplSet:** rename "MongoMemoryReplSetEventEnum" to "MongoMemoryReplSetEvents" ([bfd5441](https://github.com/nodkz/mongodb-memory-server/commit/bfd5441f0e18a38e324e8c49a4adaa05adfdf3ec))
* **MongoMemoryReplSet:** rename "MongoMemoryReplSetStateEnum" to "MongoMemoryReplSetStates" ([c02e21d](https://github.com/nodkz/mongodb-memory-server/commit/c02e21d36be0439bc1ea19f2c9cd6733b4fd1074))
* **MongoMemoryReplSet:** setup proper events ([644a335](https://github.com/nodkz/mongodb-memory-server/commit/644a335089cf6a078a055a6780f4cf48630e6506))
* **MongoMemoryReplSet:** shorten constructor ([e17762d](https://github.com/nodkz/mongodb-memory-server/commit/e17762db2ffbbfa77aef0de24ba6752c0326401a))
* **MongoMemoryReplSet:** small improvements ([9b17925](https://github.com/nodkz/mongodb-memory-server/commit/9b179254099f3d07607f3fbb97b627ea0c323b5f))
* **MongoMemoryReplSet:** stop: reset "servers" after stopping them ([0aa2293](https://github.com/nodkz/mongodb-memory-server/commit/0aa2293168b8081fcf2e1391c6096d30e31e0c38))
* **MongoMemoryReplSet:** waitUntilRunning: shorten function ([0fc27d6](https://github.com/nodkz/mongodb-memory-server/commit/0fc27d6b308a34ab27ae71e113872999549d098c))
* **MongoMemoryServer:** add sanity check to "stop" ([8aff4ef](https://github.com/nodkz/mongodb-memory-server/commit/8aff4efe4356c12fcbe6153d8f33c03779b0626f))
* **MongoMemoryServer:** always reset "port" to "undefined" ([8ca0729](https://github.com/nodkz/mongodb-memory-server/commit/8ca0729cade0f1dd82c0eaefd81a5d2bf2b8fd6c))
* **MongoMemoryServer:** change "_state" to be "protected" ([b716c2c](https://github.com/nodkz/mongodb-memory-server/commit/b716c2cef8b6b74e90930ae08f2390abd3775206))
* **MongoMemoryServer:** change "getDbName" to be sync ([85a97e0](https://github.com/nodkz/mongodb-memory-server/commit/85a97e056c2d407a2d949e94b872403231c164d1))
* **MongoMemoryServer:** change "getDbPath" to be sync ([281fa1c](https://github.com/nodkz/mongodb-memory-server/commit/281fa1c716704f0142b022c7e0555f13c0b63b4f))
* **MongoMemoryServer:** change "getInstanceInfo" to return undefined ([27349a3](https://github.com/nodkz/mongodb-memory-server/commit/27349a3ddabd956038165d94932b5df4d9c0941f))
* **MongoMemoryServer:** change "getPort" to be sync ([e849f2c](https://github.com/nodkz/mongodb-memory-server/commit/e849f2caa5b2c84cb2901269162b8d92351be944))
* **MongoMemoryServer:** change "getUri" to be sync ([5b53f03](https://github.com/nodkz/mongodb-memory-server/commit/5b53f03f25be9946df236977cfb65c7fb72ba4c6))
* **MongoMemoryServer:** change "instanceInfo" to be "protected" ([7390eee](https://github.com/nodkz/mongodb-memory-server/commit/7390eee23bf5edb23b29ddeb33fb1ebf962eae53))
* **MongoMemoryServer:** ensureInstance: move "return instanceInfo" into case "running" ([4214aa5](https://github.com/nodkz/mongodb-memory-server/commit/4214aa56362d5cad139acf2c134f410ddb765aba))
* **MongoMemoryServer:** merge "runningInstance" and "instanceInfoSync" into "instanceInfo" ([7642c75](https://github.com/nodkz/mongodb-memory-server/commit/7642c754f25a20ebee99fe974a008b522be75c0a))
* **MongoMemoryServer:** refactor "start" to be more readable ([7fb31c1](https://github.com/nodkz/mongodb-memory-server/commit/7fb31c151081ef1ada4062966a85eb9aaaace214))
* **MongoMemoryServer:** remove "await" from "getUriBase" call ([ca536b6](https://github.com/nodkz/mongodb-memory-server/commit/ca536b6a3c1059132b0a767653f70e7441b687bd))
* **MongoMemoryServer:** remove "null" use "undefined" ([086abef](https://github.com/nodkz/mongodb-memory-server/commit/086abef19eefb9fd8ac2e6e3304ea2cbafab9e0a))
* **MongoMemoryServer:** remove call to "ensureInstance" inside "stop" ([57801cf](https://github.com/nodkz/mongodb-memory-server/commit/57801cf3e08e95084a73a5e0b8ef3258c098c83b))
* **MongoMemoryServer:** remove destructuring of "promises" ([a828506](https://github.com/nodkz/mongodb-memory-server/commit/a828506ec749ebb9b0d081a77cff0036d97e5e41))
* **MongoMemoryServer:** rename "instanceInfo" to "_instanceInfo" ([d3ddcb4](https://github.com/nodkz/mongodb-memory-server/commit/d3ddcb41a55aeb012aeb92c2303eec7b2472cda7))
* **MongoMemoryServer:** rename "MongoMemoryServerEventEnum" to "MongoMemoryServerEvents" ([251c7ed](https://github.com/nodkz/mongodb-memory-server/commit/251c7ede0dd56e7ac0f98f75c278066ea5333272))
* **MongoMemoryServer:** rename "MongoMemoryServerStateEnum" to "MongoMemoryServerStates" ([139d3fd](https://github.com/nodkz/mongodb-memory-server/commit/139d3fd9c1175c0abc66cc1b0c7c49738f231658))
* **MongoMemoryServer:** rename function "assertionInstanceInfoSync" to "assertionInstanceInfo" ([03c8343](https://github.com/nodkz/mongodb-memory-server/commit/03c834379c306464ede6667a53916f4dfbbe5b39))
* **MongoMemoryServer:** start: check "state" instead of "instanceInfo" ([4fd1ede](https://github.com/nodkz/mongodb-memory-server/commit/4fd1ede502acb67be052957b3907eb1f5a57212f))
* **postinstall:** rename function "postInstall" to "postInstallEnsureBinary" ([aca8262](https://github.com/nodkz/mongodb-memory-server/commit/aca826211351e73458c56e6d0dce99d068e05941))
* **resolveConfig:** remove unnecessary optional chain ([1c6578d](https://github.com/nodkz/mongodb-memory-server/commit/1c6578d22a311c686ba49eec2ad8afb856eca4a4))
* **utils:** assertion: remove error code from default error ([bbad7c4](https://github.com/nodkz/mongodb-memory-server/commit/bbad7c4d7036aa608262b7ee2fd41d1dedd4e6dc))
* apply suggested changes ([2a9aab7](https://github.com/nodkz/mongodb-memory-server/commit/2a9aab7738e6512ce0e03135f4c8a8d217d62816))
* remove file "types.ts" ([23cdc65](https://github.com/nodkz/mongodb-memory-server/commit/23cdc656562e662780ae5b314d2da3243116e800)), closes [#406](https://github.com/nodkz/mongodb-memory-server/issues/406)
* rename "-test.ts" to ".test.ts" ([deb0098](https://github.com/nodkz/mongodb-memory-server/commit/deb00984281d3e7e7e37fb7bd0358390176d6a79))
* rename file "db_util" to "utils" ([f3df9c8](https://github.com/nodkz/mongodb-memory-server/commit/f3df9c81b4b614ff6cac15579051fd11921c09ce))
* rename file "postinstall-helper" to "postinstallHelper" ([fdf2d09](https://github.com/nodkz/mongodb-memory-server/commit/fdf2d09a33a3d8ed893f0ba01e0022814f3b2089))
* rename file "resolve-config" to "resolveConfig" ([7ee646c](https://github.com/nodkz/mongodb-memory-server/commit/7ee646c2479e8237c0c14096a8ac026d45a8c96e))
* unify interface names (remove "T") ([78a78cd](https://github.com/nodkz/mongodb-memory-server/commit/78a78cdc8c1d67d780aaca064169b8324d04d0c3)), closes [#395](https://github.com/nodkz/mongodb-memory-server/issues/395)
* **MongoMemoryServer:** shorten "getUri" ([f1024e5](https://github.com/nodkz/mongodb-memory-server/commit/f1024e551b594783e580a8d6b13dd243c25240dc))
* **MongoMemoryServer:** start: remove first ".catch" ([fafaa29](https://github.com/nodkz/mongodb-memory-server/commit/fafaa29116683c2ce08d027eef8cdcae4c50c991))
* **postinstall:** change all packages to depend on "core" ([de41060](https://github.com/nodkz/mongodb-memory-server/commit/de41060cae7e4fcc1af286d18b90d473bca5864e)), closes [#378](https://github.com/nodkz/mongodb-memory-server/issues/378) [#174](https://github.com/nodkz/mongodb-memory-server/issues/174)
* **replset-single:** shorten "state errors" ([2559117](https://github.com/nodkz/mongodb-memory-server/commit/2559117b69c0476b9835b87e1f1cbd702f69e863))
* **tsconfig.test:** extend "core" tsconfig ([a8081a6](https://github.com/nodkz/mongodb-memory-server/commit/a8081a68851284742cb02ae9cbab691280ddf30c))
* move function "kill_internal" to "db_util" ([fd27986](https://github.com/nodkz/mongodb-memory-server/commit/fd2798612da0a0736280bbd857b247e0a7977c08)), closes [/github.com/nodkz/mongodb-memory-server/pull/389#discussion_r496997760](https://github.com/nodkz//github.com/nodkz/mongodb-memory-server/pull/389/issues/discussion_r496997760)
* normal export and default export classes & functions ([33bb12c](https://github.com/nodkz/mongodb-memory-server/commit/33bb12ca5420a9fe1e8a906b38181825103e77be))


### Style

* **db_util:** add link on why "ensureAsync" is needed ([412e615](https://github.com/nodkz/mongodb-memory-server/commit/412e61589077b8f2ebcc7d046466ffc652a4fe32))
* **DryMongoBinary:** locateBinary: simplify "if-condition" ([3219315](https://github.com/nodkz/mongodb-memory-server/commit/3219315e6eea96258df87aaf29a686eccd3135e1))
* **DryMongoBinary:** remove unused optional chaning ([06cfccb](https://github.com/nodkz/mongodb-memory-server/commit/06cfccb2e242983465af550a5579227590bddbed))
* **eslintrc:** add environment "node" ([8f3ed19](https://github.com/nodkz/mongodb-memory-server/commit/8f3ed194f0a2a19c551be076c99ff2af763fe9f5))
* **eslintrc:** add rule "padding-line-between-statements" for "function" & "class" ([6a0ebd4](https://github.com/nodkz/mongodb-memory-server/commit/6a0ebd43d63785c3457487d2d9834950adf08b30))
* **eslintrc:** add rule "padding-line-between-statements" for "if" ([3efdb47](https://github.com/nodkz/mongodb-memory-server/commit/3efdb4770b27b996ad75f6b645d99369ebb672f4))
* **eslintrc:** add rule "padding-line-between-statements" for "import" ([3bfc4ef](https://github.com/nodkz/mongodb-memory-server/commit/3bfc4ef8783557b2e451093f95be8b03c5d1696a))
* **eslintrc:** add rule "padding-line-between-statements" for "return" ([05b02d2](https://github.com/nodkz/mongodb-memory-server/commit/05b02d231eb70d77e87005943632539a7ddeec49))
* **eslintrc:** comma-dangle: change "functions" to "never" ([0bf9c3e](https://github.com/nodkz/mongodb-memory-server/commit/0bf9c3e5935ef493877110607ca2e4904942df9e))
* **eslintrc:** set rule "no-else-return" to "warn" ([cb242e9](https://github.com/nodkz/mongodb-memory-server/commit/cb242e97e738652aba493e80850dfd39059c2dd8))
* **eslintrc:** set rule "no-unused-expressions" to warn ([d08b293](https://github.com/nodkz/mongodb-memory-server/commit/d08b293f9be929fe159951427a72c030c0e776c1))
* **lockfile:** add log when "readout" is for not for self ([1b669ad](https://github.com/nodkz/mongodb-memory-server/commit/1b669ad310075a9ea3ba876fb89701e2d9c95b69))
* **lockfile:** add more commentation ([6d4576a](https://github.com/nodkz/mongodb-memory-server/commit/6d4576ae64ba92526854836ed41624f8f05743a8))
* **lockfile.test:** increase timeouts ([c541b0e](https://github.com/nodkz/mongodb-memory-server/commit/c541b0e83989d6513b334f0e57f4d05035d37878))
* **MongoBinary:** add tsdoc to describe what the class is for ([36f1118](https://github.com/nodkz/mongodb-memory-server/commit/36f1118bc548edc33241eebd91f07dd86886564d))
* **MongoBinary:** getPath: combine "defaultOptions" & "options" into single assignment ([b107d54](https://github.com/nodkz/mongodb-memory-server/commit/b107d54bb934901c12243a06f8366c472ac9ffb1))
* **MongoBinary:** getPath: simplify "if-condition" ([7584b56](https://github.com/nodkz/mongodb-memory-server/commit/7584b564fb3dabb5e6c26fbe5f64d9a0c20c3a94))
* **MongoBinary:** remove duplicated definitions from interface ([87a3ca8](https://github.com/nodkz/mongodb-memory-server/commit/87a3ca86601db1efe317b02653709053750b1710))
* **MongoBinaryDownload:** makeMD5check: add more tsdoc ([911a09a](https://github.com/nodkz/mongodb-memory-server/commit/911a09a141143bf4fa6190b3b52dc47594ac2af3))
* **MongoBinaryDownload:** rename interface "DownloadProgress" to "MongoBinaryDownloadProgress" ([2bad87c](https://github.com/nodkz/mongodb-memory-server/commit/2bad87c18ab1bf4fc2c6a723af5893fa57de747f))
* **MongoBinaryDownloadUrl:** "Debain" to "Debian" ([1879e4b](https://github.com/nodkz/mongodb-memory-server/commit/1879e4bb1241db4fae1a794895fd042cb18fb501)), closes [#424](https://github.com/nodkz/mongodb-memory-server/issues/424)
* **MongoBinaryDownloadUrl:** getArchiveNameLinux: combine "name" assignments ([50878b3](https://github.com/nodkz/mongodb-memory-server/commit/50878b3414280c86759c65ea0e347fee49427e88))
* **MongoBinaryDownloadUrl:** getArchiveNameOsx: combine "name" assignments ([c4bbf79](https://github.com/nodkz/mongodb-memory-server/commit/c4bbf79b750df80e45a135aac8326c556fd3793d))
* **MongoBinaryDownloadUrl:** getArchiveNameWin: combine "name" assignments ([258a6a1](https://github.com/nodkz/mongodb-memory-server/commit/258a6a110a76633bb84e3f4e9e25cf3e014faca4))
* **MongoInstance:** _launchKiller: remove commented-out code ([132917f](https://github.com/nodkz/mongodb-memory-server/commit/132917fac63745b351dfd73eb30f7f54962ddf37))
* **MongoInstance:** add "[@fires](https://github.com/fires)" to all functions that emit an event ([0e2ede3](https://github.com/nodkz/mongodb-memory-server/commit/0e2ede3d30b0d08ce08a1952caa9b04df8874189))
* **MongoInstance:** add TODO comments ([5e320ca](https://github.com/nodkz/mongodb-memory-server/commit/5e320cad6cd277e0e87da7beb4dd35d3bb92e5c5))
* **MongoInstance:** add tsdoc ([9896641](https://github.com/nodkz/mongodb-memory-server/commit/9896641d181e6d01092073722e5df79bb5dfac5e))
* **MongoInstance:** add tsdoc to the variables in "Mongoinstance" ([7ac9728](https://github.com/nodkz/mongodb-memory-server/commit/7ac9728e8c8b3075f02972bc32ba8e4a15bdc285))
* **MongoInstance:** change comments into tsdoc ([278619c](https://github.com/nodkz/mongodb-memory-server/commit/278619c0e1ea8ca870ca5cb0a9544cf1c143e43c))
* **MongoInstance:** improve tsdoc for "waitPrimaryReady" ([f3475b5](https://github.com/nodkz/mongodb-memory-server/commit/f3475b53d8b8f17b5d5868d7c46e51dce940860a))
* **MongoInstance:** move comment into tsdoc ([d749abb](https://github.com/nodkz/mongodb-memory-server/commit/d749abbd756436c2eff7cdca80622531557992bb))
* **MongoInstance:** move some comments ([9832760](https://github.com/nodkz/mongodb-memory-server/commit/9832760b51e3b985fc00a7508f66a64d860ae48c))
* **MongoInstance:** overwrite EventEmitter functions to use enum ([999f5e2](https://github.com/nodkz/mongodb-memory-server/commit/999f5e2777afff0d24fc8ac5bfeb1b764fe5c37f))
* **MongoInstance:** remove "null" from "port" ([75d805f](https://github.com/nodkz/mongodb-memory-server/commit/75d805f1472e570bc1a081a7593ad94cc2b1fe5d))
* **MongoInstance:** rename interface to have an better name ([60858b1](https://github.com/nodkz/mongodb-memory-server/commit/60858b10264389605cd698d87d95fff79edd0033))
* **MongoInstance:** rename interface to have an better name ([916aa11](https://github.com/nodkz/mongodb-memory-server/commit/916aa1127ff22b5b52bebfec75c899b351c2799c))
* **MongoInstance:** simplify imports ([5621da9](https://github.com/nodkz/mongodb-memory-server/commit/5621da9b4e40dfd1889a103a2d4b7e78a05b3458))
* **MongoInstance:** unify promise variable names ([73691da](https://github.com/nodkz/mongodb-memory-server/commit/73691da74147b07cf53405f09f6541fbe563181b))
* **MongoMemoryReplSet:** _initReplSet: change logs to be more clear ([561c883](https://github.com/nodkz/mongodb-memory-server/commit/561c8832c5504382d6b70b9a8ff3fa581cbc46e8))
* **MongoMemoryReplSet:** _initReplSet: remove "await" from non-Promise functions ([846f969](https://github.com/nodkz/mongodb-memory-server/commit/846f969893586050476383622cbed412608d69e9))
* **MongoMemoryReplSet:** _waitForPrimary: add log that function got called ([c5f66a3](https://github.com/nodkz/mongodb-memory-server/commit/c5f66a38122fedba3d42f47178c4b5f470ce955e))
* **MongoMemoryReplSet:** add log to "stop" ([d3dff26](https://github.com/nodkz/mongodb-memory-server/commit/d3dff2605ee0837a3d655a0f31096edc5e33cb7c))
* **MongoMemoryReplSet:** add more logs ([a3a911f](https://github.com/nodkz/mongodb-memory-server/commit/a3a911fda1e083cd4964e57ae34dbe74b7f3a721))
* **MongoMemoryReplSet:** add more tsdoc ([6b60a71](https://github.com/nodkz/mongodb-memory-server/commit/6b60a71e0c9c81197f2a42b59e8b6f96660cf410))
* **MongoMemoryReplSet:** add tsdoc to "initAllServers" ([ba46aee](https://github.com/nodkz/mongodb-memory-server/commit/ba46aee6efbff6228279d60e0ac260214b2ea331))
* **MongoMemoryReplSet:** remove commented-out case ([8e3ae46](https://github.com/nodkz/mongodb-memory-server/commit/8e3ae46b8f13aaea1ac0e1eac0c1c6f25e484e38))
* **MongoMemoryReplSet:** remove TODO ([5645a87](https://github.com/nodkz/mongodb-memory-server/commit/5645a8750d0da6cb31425820616d43e234eb4c37)), closes [#392](https://github.com/nodkz/mongodb-memory-server/issues/392)
* **MongoMemoryReplSet:** replace templating string with normal ([9add2bc](https://github.com/nodkz/mongodb-memory-server/commit/9add2bcf983e2b7c7c981753c9ca447db49ea2eb))
* **MongoMemoryReplSet:** trim error message & add "_" to unused parameter ([6be0c00](https://github.com/nodkz/mongodb-memory-server/commit/6be0c00449d7050b38ed58cd222d07c935b9f6e5))
* **MongoMemoryServer:** change "StartupInstanceData" to depend on "MongoMemoryInstanceOpts" ([26af098](https://github.com/nodkz/mongodb-memory-server/commit/26af098e25707aff1976eb7ba06a9aa6fa8b6514))
* **MongoMemoryServer:** getStartOptions: use "spread" instead of many lines ([9a01529](https://github.com/nodkz/mongodb-memory-server/commit/9a01529073da47d23486efc4274012c5b21788f8))
* **MongoMemoryServer:** inherit type instead of redefining ([eb41f81](https://github.com/nodkz/mongodb-memory-server/commit/eb41f8112e40a810b6c675b89083db737be7b458))
* **MongoMemoryServer:** remove comment & change log ([b098941](https://github.com/nodkz/mongodb-memory-server/commit/b0989411f39fe1397cecb8423e93bdf3245af0ea))
* **README:** environment variables: add legend for booleans ([17b1937](https://github.com/nodkz/mongodb-memory-server/commit/17b193714870427878058da2ee353808179545c0))
* **README:** fix missing "MONGOMS_" on "SKIP_OS_RELEASE" ([e352495](https://github.com/nodkz/mongodb-memory-server/commit/e35249523a275fe7b83a31420aa3c0210349cb60))
* **resolveConfig:** add "filename" to logs ([7809fcd](https://github.com/nodkz/mongodb-memory-server/commit/7809fcdda809350784816342d2c1d0f69b9bb1a3))
* **resolveConfig:** update tsdoc ([4e5469c](https://github.com/nodkz/mongodb-memory-server/commit/4e5469c6dd32603a580a947b1194f4c5ca7c7476))
* **utils:** add more tsdoc to "statPath" & "pathExists" ([3b36143](https://github.com/nodkz/mongodb-memory-server/commit/3b36143c243497118d4f4fc757bf42305bd36b79))
* **utils:** authDefault: add tsdoc ([aab1647](https://github.com/nodkz/mongodb-memory-server/commit/aab16477cb96d63d2ed3b7a4e90b5761b51c2212))
* remove "uri" value when only used once ([150494e](https://github.com/nodkz/mongodb-memory-server/commit/150494e8d736d1cb61fc5fdd9306215a599f0b1d))
* rename import "promises" (from fs) to "fspromises" everywhere ([f876670](https://github.com/nodkz/mongodb-memory-server/commit/f876670aaecc3b74ca4a85a80d804c137a40d572))


### Fixes

* **DryMongoBinary:** generatePaths: this function should now not hit the filesystem anymore ([8aefba5](https://github.com/nodkz/mongodb-memory-server/commit/8aefba5abd75c0fbb186c942d1281d3ea27734a3))
* **DryMongoBinary:** only use global path when not empty ([9d176b2](https://github.com/nodkz/mongodb-memory-server/commit/9d176b22a4867d1887a06c11a1955767f0696285)), closes [#478](https://github.com/nodkz/mongodb-memory-server/issues/478)
* **DryMongoBinary:** use "INIT_CWD" when available ([cc2da32](https://github.com/nodkz/mongodb-memory-server/commit/cc2da3298de00b199d9f9ca134951b72e4c1a8ab)), closes [#478](https://github.com/nodkz/mongodb-memory-server/issues/478)
* **errors:** StateError: fix type for "wantedStates" ([6297275](https://github.com/nodkz/mongodb-memory-server/commit/6297275b0908cb8e4083b4b8ca43eff4968d0f3e))
* **MongoBinary:** add information about "RUNTIME_DOWNLOAD" to no binary found error ([94ee82d](https://github.com/nodkz/mongodb-memory-server/commit/94ee82d201eeaf9580684601d6113e404f3c6242))
* **MongoBinary:** change to match with regex instead of string splitting ([ab1cd36](https://github.com/nodkz/mongodb-memory-server/commit/ab1cd3697a12181f117b9587af89027a2594523a))
* **MongoBinary:** enhance systemBinary version regex ([0d990d3](https://github.com/nodkz/mongodb-memory-server/commit/0d990d3e9a2958628dce5aef1e6b5025165b705d))
* **MongoBinary:** remove using "binaryVersion" for version, because "version" cannot be undefined ([72c8199](https://github.com/nodkz/mongodb-memory-server/commit/72c819971b5e24e6f79ee27d181d4bd2b4ad9cf4))
* **MongoBinary:** use ".stdout.toString" for command output parsing ([d8d6749](https://github.com/nodkz/mongodb-memory-server/commit/d8d6749f585afb76037a35956a7160e330ed28a3)), closes [#487](https://github.com/nodkz/mongodb-memory-server/issues/487)
* **MongoBinary:** use less variables & extend error ([8b448db](https://github.com/nodkz/mongodb-memory-server/commit/8b448db73a24479273e6da12cdb5bdca8ff30a7d))
* **MongoBinary:** use semver for version comparison ([d1f181a](https://github.com/nodkz/mongodb-memory-server/commit/d1f181ac98e044f85c1633b4466afcd789758300))
* **MongoBinaryDownload:** clear line before writing progress ([db3796a](https://github.com/nodkz/mongodb-memory-server/commit/db3796a60f766200abf510f6a34b4645edafbdd6))
* **MongoBinaryDownload:** download: escape paths in log & errors ([5d2703e](https://github.com/nodkz/mongodb-memory-server/commit/5d2703ee565b384611194690a11dd56aeb97d2c3))
* **MongoBinaryDownload:** enhance progress message ([ada4f2a](https://github.com/nodkz/mongodb-memory-server/commit/ada4f2ae7b09c278594f89b356477dc1bc06816b))
* **MongoBinaryDownload:** extract: remove only once used variable & escape paths in errors ([3d5e9cb](https://github.com/nodkz/mongodb-memory-server/commit/3d5e9cb6b966d97cfb669736d94c093b81963e3d))
* **MongoBinaryDownload:** getMongodPath: add more logging & escape path in error ([962cc9f](https://github.com/nodkz/mongodb-memory-server/commit/962cc9ff69cf9d25c79f49df7faa0b3a6dc599b0))
* **MongoBinaryDownload:** getPath: reduce some calls ([43b746a](https://github.com/nodkz/mongodb-memory-server/commit/43b746af35be6ba2ffc8ca7d4e3ac38ab4026a42))
* **MongoBinaryDownload:** httpDownload: open filestream only on successful response ([57f3c7c](https://github.com/nodkz/mongodb-memory-server/commit/57f3c7cd78ddcad8b8506db3336d162165451205))
* **MongoBinaryDownload:** makeMD5check: unlink md5 file after check ([c0b707d](https://github.com/nodkz/mongodb-memory-server/commit/c0b707df3e6a7d002abdd5d3d679f29f12d31f42))
* **MongoBinaryDownload:** unify how the downloadUrl is represented ([23f057e](https://github.com/nodkz/mongodb-memory-server/commit/23f057edb735ebd0b7140a207ff6fbf581f0075e))
* **MongoBinaryDownloadUrl:** add fedora version 34+ handling ([8f33ef4](https://github.com/nodkz/mongodb-memory-server/commit/8f33ef4ba5c238fc72cf55b3fb7c934152b7eafe)), closes [#304](https://github.com/nodkz/mongodb-memory-server/issues/304)
* **MongoBinaryDownloadUrl:** change interface to actual needs ([a906acb](https://github.com/nodkz/mongodb-memory-server/commit/a906acb15401574ec0dd01f63152c432f7fdc7f5))
* **MongoBinaryDownloadUrl:** getArchiveName: change tsdoc & simplify "if-condition" ([aaab616](https://github.com/nodkz/mongodb-memory-server/commit/aaab616199d19de8cf3fdf2a74ae237222b3b406))
* **MongoBinaryDownloadUrl:** getDownloadUrl: try "DOWNLOAD_URL" before getArchiveName ([7a8a4c3](https://github.com/nodkz/mongodb-memory-server/commit/7a8a4c34c44aa588277b2ea94f541c2f28b1730d))
* **MongoBinaryDownloadUrl:** use debian92 for versions <4.2.0 ([79306c5](https://github.com/nodkz/mongodb-memory-server/commit/79306c59917f96ddf6e997670c2cc848e873746d)), closes [#448](https://github.com/nodkz/mongodb-memory-server/issues/448)
* **MongoBinaryUrl:** getDownloadUrl: try to create an "URL" to check if the url is valid ([25c865c](https://github.com/nodkz/mongodb-memory-server/commit/25c865c0a71e7d682eccb6f0e2895a11f9f092ef))
* **MongoInstance:** change logs to be more up-to-date ([d421e01](https://github.com/nodkz/mongodb-memory-server/commit/d421e015c0362b178c29a819392b938ac6c25b5a))
* **MongoInstance:** debug: change to be "protected" instead of "private" ([633a35e](https://github.com/nodkz/mongodb-memory-server/commit/633a35e968acb8107eef69c5c6cd357a5e9315d2))
* **MongoInstance:** remove interface "MongoInstanceOpts" in favor of "MongoMemoryInstanceProp" ([7efb4ff](https://github.com/nodkz/mongodb-memory-server/commit/7efb4ffe19ae676de4f69be283ac6a51f04c49c2))
* **MongoInstance:** start: update logs to reflect actual function name ([1e5a2d7](https://github.com/nodkz/mongodb-memory-server/commit/1e5a2d7c7ea742acb62f00a2ae18bbb81a0bf145))
* **MongoInstance:** stdoutHandler: dont use "else if" ([03184d4](https://github.com/nodkz/mongodb-memory-server/commit/03184d47e7e3f54d96834711c028a9fb43454441))
* **MongoInstance:** stop: fix log & remove double "con.close" ([bb2697c](https://github.com/nodkz/mongodb-memory-server/commit/bb2697c35b41c02cc6149d723ef209e12463f8f2))
* **MongoInstance:** update tsdoc & enhance logging ([2d9e8f5](https://github.com/nodkz/mongodb-memory-server/commit/2d9e8f502ac93f9369352fa629ce906e94990ea4))
* **MongoMemoryReplSet:** _initReplSet: add more logs ([952fbf5](https://github.com/nodkz/mongodb-memory-server/commit/952fbf58eb5fbc55837c26de0fbe7a08e118b94e))
* **MongoMemoryReplSet:** dont generate an "otherDb" if "othereDb" is false ([63497c0](https://github.com/nodkz/mongodb-memory-server/commit/63497c0ae4d8a67cfcab36beb8727a02eae7711e))
* **MongoMemoryReplSet:** getUri: loop over less arrays ([dec9bac](https://github.com/nodkz/mongodb-memory-server/commit/dec9bac889e334317f872d51109c27e268ae58c8))
* **MongoMemoryReplSet:** getUri: use "uriTemplate" instead of re-doing ([c6c9321](https://github.com/nodkz/mongodb-memory-server/commit/c6c9321cdcd55b4f305280b4f5783513200870ff))
* **MongoMemoryReplSet:** implement "ManagerAdvanced" & add logging to "create" ([94e3092](https://github.com/nodkz/mongodb-memory-server/commit/94e3092e47adbb335cbadda1db20d96e49bbe986))
* **MongoMemoryReplSet:** start: change state on error ([20433b5](https://github.com/nodkz/mongodb-memory-server/commit/20433b5fa27854c30f30d602d186d9413bf0563f))
* **MongoMemoryReplSet:** start: move "beforeExit" listener setup before starting instances ([d1cc648](https://github.com/nodkz/mongodb-memory-server/commit/d1cc6481bbf0e475171e23f679363b83229d83ec))
* **MongoMemoryServer:** add some tsdoc & change an if-throw to assertion ([5c7acb4](https://github.com/nodkz/mongodb-memory-server/commit/5c7acb489cdce3c385b5b101255ccd14f5d11775))
* **MongoMemoryServer:** change options instead of creating new instance for auth creation ([171f1fb](https://github.com/nodkz/mongodb-memory-server/commit/171f1fbe34873dcd898e15dfa418ca9e2c99b4eb))
* **MongoMemoryServer:** change state to stopped when start fails ([e9134a7](https://github.com/nodkz/mongodb-memory-server/commit/e9134a7f4c05d741d25742b11d2d6a5862c35fcc))
* **MongoMemoryServer:** createAuth: fix typo in "customData" & add "customData" to extra users ([31c98c9](https://github.com/nodkz/mongodb-memory-server/commit/31c98c9f2fd5b45cf56880f238c35c9c3458c47e))
* **MongoMemoryServer:** dont trigger "otherDb" if "otherDbName" is false ([ffb096d](https://github.com/nodkz/mongodb-memory-server/commit/ffb096dd3530fb4fb98d8660e1c0fc88f645a66e))
* **MongoMemoryServer:** ensureInstance: change logs to be consistent with others ([3d430c1](https://github.com/nodkz/mongodb-memory-server/commit/3d430c19167608d902a0a6accfb4cceaeda347ba))
* **MongoMemoryServer:** fix typo in warning ([532bc09](https://github.com/nodkz/mongodb-memory-server/commit/532bc0905ff47a425d50bcd212bd49de2d0b2082))
* **MongoMemoryServer:** resolve nodejs warning "DEP0147" ([c498e22](https://github.com/nodkz/mongodb-memory-server/commit/c498e223df7aa4ba2ac462ed5097060e254db7bb))
* **MongoMemoryServer:** start: dont add "beforeExit" listener if being in an replset ([f9c555d](https://github.com/nodkz/mongodb-memory-server/commit/f9c555d5cf78b087c142d8232c51f4cd105b68b4))
* **MongoMemoryServer:** stop: change log to be better sounding ([a009693](https://github.com/nodkz/mongodb-memory-server/commit/a0096932947b5e57d6b30587d1c103eda1d65680))
* **postinstallHelper:** reduce variables ([b42bac3](https://github.com/nodkz/mongodb-memory-server/commit/b42bac3e40817c303ed82ea499b772a380271138))
* **resolveConfig:** envToBool: return "false" if input is somehow not an string ([6d78971](https://github.com/nodkz/mongodb-memory-server/commit/6d78971a36aa4f77c6a2ec932527798dd1b38bda))
* **resolveConfig:** move executing "findPackageJson" after enabling debug ([7e4c8dc](https://github.com/nodkz/mongodb-memory-server/commit/7e4c8dc5878c1e2f9bf092a8a17b02649fb25426))
* **resolveConfig:** resolveConfig: always convert any value to string ([27f1f5c](https://github.com/nodkz/mongodb-memory-server/commit/27f1f5c0a57828780410d843378042e9ad131f6b))
* change "generateDbName" to return an empty string by default ([840be19](https://github.com/nodkz/mongodb-memory-server/commit/840be19d3affae664be61c10ec357292c04922b7)), closes [#141](https://github.com/nodkz/mongodb-memory-server/issues/141)
* change default version to "4.0.25" ([ffe2875](https://github.com/nodkz/mongodb-memory-server/commit/ffe28755b5aab143b3681f78eed6d22a1cf4b23d))
* fix description & usage of "dbName" in mongo URI ([7b986e1](https://github.com/nodkz/mongodb-memory-server/commit/7b986e15dd1c060706b670116739f51bd2ea909b)), closes [#141](https://github.com/nodkz/mongodb-memory-server/issues/141)
* **-global:** change "mongodb_version" to latest patch version ([adcbdcf](https://github.com/nodkz/mongodb-memory-server/commit/adcbdcfa3240f4182466a70b8c731d0d97fa5287))
* **db_util:** killProcess: fix "SIGINT"-"SIGKILL" warn condition ([4113d94](https://github.com/nodkz/mongodb-memory-server/commit/4113d9457874c660b550e4ce5929582091f19d0a))
* **DryBinary:** use "modulesCache/version/binary" instead of "modulesCache/mongodb-binaries/version/binary" ([072abde](https://github.com/nodkz/mongodb-memory-server/commit/072abdeb3c0504c9a5bf17547274f78db141356e))
* **DryMongoBinary:** only use "resolveConfigValue" when not empty ([08e71cf](https://github.com/nodkz/mongodb-memory-server/commit/08e71cfa82bb2a4f41021579339f72f6c3e1f9c5))
* **getos:** add lsb-release file pattern to regex ([0cc7dd5](https://github.com/nodkz/mongodb-memory-server/commit/0cc7dd5e8e05b223a7ed3231b36f5dd46efe0364))
* **getos:** add tests for "parseOS" and "parseLSB" ([6cdf482](https://github.com/nodkz/mongodb-memory-server/commit/6cdf4823341446c4b7c2f1ed2b97c03992ca29ea))
* **getos:** replace "not undefined" with "envToBool" ([7fde8be](https://github.com/nodkz/mongodb-memory-server/commit/7fde8beec831edf5d5f6cb2c03646ab182a7ccbe))
* **getos:** tryFirstReleaseFile: simplify file match ([7a46fac](https://github.com/nodkz/mongodb-memory-server/commit/7a46fac70f3a1c8b398d4c9d6bc07499a84f7343))
* **global:** use an absolute module path to core in global index scripts ([2428fd8](https://github.com/nodkz/mongodb-memory-server/commit/2428fd805e1389e6374435a238749a1d654dee2e))
* **lockfile:** add uuid to lock instance ([75574a1](https://github.com/nodkz/mongodb-memory-server/commit/75574a173a326dc9688677e93f1fb74e2f49ff64))
* **lockfile:** checkLock: handle ENOENT ([7d3e998](https://github.com/nodkz/mongodb-memory-server/commit/7d3e998fca6f964e0f4100ec920125b2acb0a4f2))
* **lockfile:** ignore lockfile unlink fail ([ceea1a7](https://github.com/nodkz/mongodb-memory-server/commit/ceea1a770299dcc18473eb1a3389d063fe34d7af))
* **MongoBinary:** add more logs ([e980a79](https://github.com/nodkz/mongodb-memory-server/commit/e980a795a39c8fcaf17e5f8048c032d64852329b)), closes [#434](https://github.com/nodkz/mongodb-memory-server/issues/434)
* **MongoBinary:** change "LATEST_VERSION" to latest patch version "4.0.20" ([23e6eaa](https://github.com/nodkz/mongodb-memory-server/commit/23e6eaa89c82efeb27fe71fd012cf438b54b006a))
* **MongoBinary:** ensure lockfile gets unlocked in case of error ([e81db43](https://github.com/nodkz/mongodb-memory-server/commit/e81db4345dd0b3dd5bcad0100fb4f995456252b4))
* **MongoBinary:** getSystemPath: also check for execute permission ([a501842](https://github.com/nodkz/mongodb-memory-server/commit/a501842e6c64575542cf976628f66a775a3c7d39))
* **MongoBinaryDownload:** add more logging ([b63f629](https://github.com/nodkz/mongodb-memory-server/commit/b63f6291359fb7c29c0dbf1022c5caadb1864da9))
* **MongoBinaryDownload:** change "downloadDir" to be required ([d2f2e30](https://github.com/nodkz/mongodb-memory-server/commit/d2f2e306b857fba08f6478f27731b0c2808a596f))
* **MongoBinaryDownload:** force an status print on download finish ([62337fd](https://github.com/nodkz/mongodb-memory-server/commit/62337fd509b63396e85ae210811e1e84b07fe14c))
* **MongoBinaryDownload:** use "mkdirp" over "fs.mkdir" ([c64a321](https://github.com/nodkz/mongodb-memory-server/commit/c64a3211363be5fb3f6f4dbeccac426605fb49df))
* **MongoBinaryDownload:** use "MongoBinaryOpts" over "MongoBinaryDownloadOpts" ([ce193ce](https://github.com/nodkz/mongodb-memory-server/commit/ce193ce4758eb31ab670c829ea4f3ebf975371cd))
* **MongoBinaryDownload:** use new "URL" class instead of deprecated "url.parse" ([70af5d2](https://github.com/nodkz/mongodb-memory-server/commit/70af5d28b98738b733c075d3eeeb674233d04751))
* **MongoBinaryDownloadUrl:** getArchiveName: throw error if platform is unkown ([9fc358b](https://github.com/nodkz/mongodb-memory-server/commit/9fc358b9b2997333b2121eabff16e91e543f3897))
* **MongoBinaryDownloadUrl:** handle Debian "testing" release ([#430](https://github.com/nodkz/mongodb-memory-server/issues/430)) ([9c2c834](https://github.com/nodkz/mongodb-memory-server/commit/9c2c834bfc436ce86623e0e8b9f0d0e92fce452e))
* **MongoBinaryDownloadUrl:** remove unused parameter ([d72ed42](https://github.com/nodkz/mongodb-memory-server/commit/d72ed42a16d19e71b2b98168d896bb76736a6e98))
* **MongoBinaryDownloadUrl:** support macos arm64 to x64 archive translation ([2aa9b38](https://github.com/nodkz/mongodb-memory-server/commit/2aa9b38c6ea49035eaf9ee64cc772a364e2ad2fe))
* **MongoBinaryDownloadUrl:** use DryBinary.generateOptions's "os" instead of calling "getOS" directly ([ac025d9](https://github.com/nodkz/mongodb-memory-server/commit/ac025d98393125533a02f0143036108f23769f43))
* **MongoInstance:** add more logs ([e8d2d4b](https://github.com/nodkz/mongodb-memory-server/commit/e8d2d4bae36f424233d9d877c697172f356d7e1c)), closes [#434](https://github.com/nodkz/mongodb-memory-server/issues/434)
* **MongoInstance:** give better error reporting when library file is missing ([692455a](https://github.com/nodkz/mongodb-memory-server/commit/692455ab30e30c8ed9964ca0281fd6a6f5ec4f05)), closes [#408](https://github.com/nodkz/mongodb-memory-server/issues/408)
* **MongoInstance:** handle code "12" on windows ([718aed7](https://github.com/nodkz/mongodb-memory-server/commit/718aed7281c25c7198ea068a87b06924d77de8ba)), closes [#411](https://github.com/nodkz/mongodb-memory-server/issues/411)
* **MongoInstance:** kill: ensure only error ignored is the actual error to be ignored ([5e377fa](https://github.com/nodkz/mongodb-memory-server/commit/5e377fad20604a4fde89c3aee717b3e19123092b))
* **MongoInstance:** remove resetting "port" inside "start" ([7861a6f](https://github.com/nodkz/mongodb-memory-server/commit/7861a6faaf9fbdf229cd5792e7f515931f5a64b8)), closes [#393](https://github.com/nodkz/mongodb-memory-server/issues/393)
* **MongoInstance:** reset "childProcess" and "killerProcess" after "kill" ([49c710d](https://github.com/nodkz/mongodb-memory-server/commit/49c710df5b2fcaba1163c2d86b81e4eb1728bdff))
* **MongoInstance:** run: reset all booleans on ([188d333](https://github.com/nodkz/mongodb-memory-server/commit/188d3330fead506e66250d761dd9c53326b97f92))
* **MongoMemoryReplSet:** _initReplSet: check if there is already an PRIMARY ([a1c9264](https://github.com/nodkz/mongodb-memory-server/commit/a1c92648c8e3ac114b211e86c31b310d00c1c140))
* **MongoMemoryReplSet:** _initReplSet: throw error if "this.servers.length" is "<= 0" ([019b118](https://github.com/nodkz/mongodb-memory-server/commit/019b1188b8f77bcbf47aced7e07aba67336ec3f4))
* **MongoMemoryReplSet:** _waitForPrimary: check if instance is already primary ([8f65696](https://github.com/nodkz/mongodb-memory-server/commit/8f6569646cf8a8953a3db00f2488244b86152403))
* **MongoMemoryReplSet:** "getUri" now uses "waitUntilRunning" ([18428d5](https://github.com/nodkz/mongodb-memory-server/commit/18428d5a7f46fdf47f88154f833fcf896d4c3bb5))
* **MongoMemoryReplSet:** add more logs ([41a0be0](https://github.com/nodkz/mongodb-memory-server/commit/41a0be0b3784b4326b8c46fa3c7c44e888a140b4)), closes [#434](https://github.com/nodkz/mongodb-memory-server/issues/434)
* **MongoMemoryReplSet:** change "_waitForPrimary" timout message to be an error ([89c8af6](https://github.com/nodkz/mongodb-memory-server/commit/89c8af6399b81a42bf38a14418aee967d4559d9c))
* **MongoMemoryReplSet:** ensure "start" is async ([765b5b1](https://github.com/nodkz/mongodb-memory-server/commit/765b5b13ded44c68d109552391d0581bbbdddf84))
* **MongoMemoryReplSet:** initAllServers: execute "stateChange" with "init" ([28bcf5b](https://github.com/nodkz/mongodb-memory-server/commit/28bcf5bd26b7950a14fd4c5f17688320038b38f9))
* **MongoMemoryReplSet:** move "removeListener" before "_state" check ([60646eb](https://github.com/nodkz/mongodb-memory-server/commit/60646eb4829b0c09bf6b88ade4a55f010f8bca6f))
* **MongoMemoryReplSet:** register listener for event "beforeExit" inside "start" ([7859d6c](https://github.com/nodkz/mongodb-memory-server/commit/7859d6c60e47b6f1bbfb2a0c3a39ce417f200470))
* **MongoMemoryReplSet:** remove unnecessary default to empty array ([2035845](https://github.com/nodkz/mongodb-memory-server/commit/203584526ff4b76f7998dfa12a182b50a206bf28))
* **MongoMemoryReplSet:** throw error if state is not "running" or "init" ([27f6215](https://github.com/nodkz/mongodb-memory-server/commit/27f62155c219ed4a8685c360dfa9bf822d62b38d))
* **MongoMemoryReplSet:** update when "cleanup" is run and added ([836dc9c](https://github.com/nodkz/mongodb-memory-server/commit/836dc9c5bb162052375b957aec97cb16b0c66759))
* **MongoMemoryServer:** add more logs ([9d12b04](https://github.com/nodkz/mongodb-memory-server/commit/9d12b041ff42557da53fc5a6803958e34077bfd7)), closes [#434](https://github.com/nodkz/mongodb-memory-server/issues/434)
* **MongoMemoryServer:** stop: return "false" if already stopped ([b3c868e](https://github.com/nodkz/mongodb-memory-server/commit/b3c868e4b04281d4f4ca98d88af6ca8899da4a31))
* **postinstall:** use an absolute module path to core in postinstall scripts ([d71ea48](https://github.com/nodkz/mongodb-memory-server/commit/d71ea48293d4beab94a373b6f0a2b38733a4f98a))
* **resolveConfig:** add helper function to add the prefix to an variable name ([8334c45](https://github.com/nodkz/mongodb-memory-server/commit/8334c4598cc3a8e3032a6333b2de976b1f3aaf36))
* **resolveConfig:** change to use the first found package.json with an non-empty config field ([4d9de37](https://github.com/nodkz/mongodb-memory-server/commit/4d9de376cea99eee2c7c2a500edb94cbb13b8980)), closes [#439](https://github.com/nodkz/mongodb-memory-server/issues/439)
* **resolveConfig:** findPackageJson: resolve file paths directly ([0bec0bf](https://github.com/nodkz/mongodb-memory-server/commit/0bec0bf1b63904e82e357dc6dc646db3c0fa6df4)), closes [#440](https://github.com/nodkz/mongodb-memory-server/issues/440)
* **resolveConfig:** resolve download dir and system binary relative to found package.json ([bc6ee8e](https://github.com/nodkz/mongodb-memory-server/commit/bc6ee8e4a6928f42f4357e090c0ffbea4ec0f384))
* **resolveConfig:** simplify packageJson type ([fac363d](https://github.com/nodkz/mongodb-memory-server/commit/fac363d27b8af34072752a12d2bb1e1e060af54d))
* "infomation" to "information" ([da6c89d](https://github.com/nodkz/mongodb-memory-server/commit/da6c89d615f7eba3f083419f69f357eec5a53a21)), closes [#424](https://github.com/nodkz/mongodb-memory-server/issues/424)
* "unkown" to "unknown" ([798b0db](https://github.com/nodkz/mongodb-memory-server/commit/798b0db03c547a5b1b680d28d8a942e6ba4770b6)), closes [#424](https://github.com/nodkz/mongodb-memory-server/issues/424)
* broken build (Cannot find module 'mongodb-memory-server') ([3c7d102](https://github.com/nodkz/mongodb-memory-server/commit/3c7d1027137257913b4648525a51703a95f07ac4))
* **types:** remove alias "SpawnOptions" ([8b963c5](https://github.com/nodkz/mongodb-memory-server/commit/8b963c52da9b1acf901a8e5c52074c9c7778aff4))
* **types:** remove unused types ([ab2944b](https://github.com/nodkz/mongodb-memory-server/commit/ab2944b76c9fc5ffa33b15cbfad822ab77a19301))
* **utils:** ensureAsync: change from "setImmediate" to "process.nextTick" ([3da59cc](https://github.com/nodkz/mongodb-memory-server/commit/3da59cc896872dee10f08272890efc0847128b3c))
* **utils:** getHost: reduce calls by combining regex ([1b46769](https://github.com/nodkz/mongodb-memory-server/commit/1b46769eb34a568d8b3915e25c4dc0f29b909667))
* **utils:** killProcess: check if the childProcess PID is still alive ([96c30de](https://github.com/nodkz/mongodb-memory-server/commit/96c30deee12e295738b93e28fad056e24ccaf40e))
* **utils:** killProcess: unify log and variable names with other code ([5605ea0](https://github.com/nodkz/mongodb-memory-server/commit/5605ea0a067fab0d2064787e042f7ec07ad9bf76))
* **utils:** remove default export ([102e4b0](https://github.com/nodkz/mongodb-memory-server/commit/102e4b05479f8f2433de447bd10b334f6b80301a))
* remove unused file "deprecate" ([bb3e0f4](https://github.com/nodkz/mongodb-memory-server/commit/bb3e0f4e1c2564632516bf069c25c2bbd1a9e67a))


### Dependencies

* **@types/debug:** upgrade to 4.1.6 ([dd112af](https://github.com/nodkz/mongodb-memory-server/commit/dd112affc4dbeacec5fdce45f712ccae11e4360e))
* **@types/dedent:** remove unused dependency ([1cb479d](https://github.com/nodkz/mongodb-memory-server/commit/1cb479d21030f910fb414e470d56a447151a091f))
* **@types/find-package-json:** upgrade to 1.2.0 ([d2dc5c6](https://github.com/nodkz/mongodb-memory-server/commit/d2dc5c6305377170f291ca0a6c0caa395fd5c791))
* **@types/find-package-json:** upgrade to 1.2.1 ([8103713](https://github.com/nodkz/mongodb-memory-server/commit/810371371d921ba51da0eacd6cc25dc3f7b11ea5))
* **@types/jest:** upgrade to 26.0.23 ([f804224](https://github.com/nodkz/mongodb-memory-server/commit/f8042244143bc7025d499962b10182112033b4d9))
* **@types/lockfile:** remove unused dependency ([fa3d6c8](https://github.com/nodkz/mongodb-memory-server/commit/fa3d6c8313362991d25a6630dc277cb4c1212d26))
* **@types/md5-file:** remove stub types package ([ad8aec4](https://github.com/nodkz/mongodb-memory-server/commit/ad8aec46c7859aebc90a2108fe253a4d453ba23c))
* **@types/mongodb:** upgrade to 3.6.18 ([2adc43e](https://github.com/nodkz/mongodb-memory-server/commit/2adc43e9cc45e93fe70dd0f90564770acdf080aa))
* **@types/mongodb:** upgrade to 3.6.19 ([a539022](https://github.com/nodkz/mongodb-memory-server/commit/a539022b7154be600d2fddc0846e9d480c6e6644))
* **@types/node:** change from "^" to "~" ([000d601](https://github.com/nodkz/mongodb-memory-server/commit/000d6015ced54ec3c0538fbd313a7130cf0ab977))
* **@types/semver:** upgrade to 7.3.6 ([754c565](https://github.com/nodkz/mongodb-memory-server/commit/754c5653bf7be4191ef307e6fda24cd0ec9e1a97))
* **@typescript-eslint/*:** upgrade to 4.28.1 ([87e98e6](https://github.com/nodkz/mongodb-memory-server/commit/87e98e6adf39f5d8c23f519814869a4b387b12f6))
* **commitlint:** upgrade to 12.1.4 (and related) ([935e460](https://github.com/nodkz/mongodb-memory-server/commit/935e46082774dadedf0be4981de844d06888da8d))
* **conventional-changelog-conventionalcommits:** upgrade to 4.6.0 ([d8a22a4](https://github.com/nodkz/mongodb-memory-server/commit/d8a22a441c52a6772e81c2f1ad3bd676e606306f))
* **cross-env:** upgrade to 7.0.3 ([b412ce2](https://github.com/nodkz/mongodb-memory-server/commit/b412ce2e8cdbfd08e13971d547ce5b64ec19fbec))
* **doctoc:** upgrade to 2.0.0 ([8e1a091](https://github.com/nodkz/mongodb-memory-server/commit/8e1a091de229531c0be945e8637d33f7d4133e84))
* **doctoc:** upgrade to 2.0.1 ([b40dfdc](https://github.com/nodkz/mongodb-memory-server/commit/b40dfdcfbd87af63fda7f18ae872b395ec0cd1ac))
* **eslint:** upgrade to 7.18.0 ([6dc0b75](https://github.com/nodkz/mongodb-memory-server/commit/6dc0b751f26d2bc2e32f5e703b94a6cbb9c29c81))
* **eslint:** upgrade to 7.20.0 (and related) ([715fdbd](https://github.com/nodkz/mongodb-memory-server/commit/715fdbd21afd35f9bf4939dd4b8bb9e0d9b2de10))
* **eslint:** upgrade to 7.29.0 (and related) ([e118e7d](https://github.com/nodkz/mongodb-memory-server/commit/e118e7db29b144b545e54694abc7c93292995072))
* **eslint-config-prettier:** upgrade to 6.15.0 ([7bbcc33](https://github.com/nodkz/mongodb-memory-server/commit/7bbcc3355f441549f98f7560a308f78e9ba603de))
* **husky:** upgrade to 5.1.1 ([4e93d29](https://github.com/nodkz/mongodb-memory-server/commit/4e93d29c5f376a0ab22199fa65fe338267829879))
* **husky:** upgrade to 6.0.0 ([3fdf792](https://github.com/nodkz/mongodb-memory-server/commit/3fdf792256e2f63891ef31d730697f97d91bf9f1))
* **husky:** upgrade to 7.0.0 ([c58a9ec](https://github.com/nodkz/mongodb-memory-server/commit/c58a9ec638393c3ee61e77dfe28e9d238888047c))
* **jest:** upgrade to 26.6.3 ([8adf360](https://github.com/nodkz/mongodb-memory-server/commit/8adf3600180480e1f83d8544214224d0cd7ac504))
* **jest:** upgrade to 27.0.5 (and related) ([e7f43a3](https://github.com/nodkz/mongodb-memory-server/commit/e7f43a3da167fd214f528f3e014e2d2e532fe545))
* **jest:** upgrade to 27.0.6 ([7a6e051](https://github.com/nodkz/mongodb-memory-server/commit/7a6e0513273e17e592c8a2620980591cfa38b90d))
* **lerna:** upgrade to 4.0.0 ([9176e50](https://github.com/nodkz/mongodb-memory-server/commit/9176e50e4db1bcb7317847d9402a786208260547))
* **lint-staged:** upgrade to 10.5.1 ([6339aaa](https://github.com/nodkz/mongodb-memory-server/commit/6339aaa375a37a3c70830f69acd361e625a17859))
* **lint-staged:** upgrade to 11.0.0 ([3429e69](https://github.com/nodkz/mongodb-memory-server/commit/3429e695cf6608f51d450edb86c0f0527f39d348))
* **mongodb:** upgrade to 3.6.5 ([d0eabf6](https://github.com/nodkz/mongodb-memory-server/commit/d0eabf6a51a91c60a70a84767fc3d2000452e6b0))
* **mongodb:** upgrade to 3.6.9 ([bfc4b5e](https://github.com/nodkz/mongodb-memory-server/commit/bfc4b5ef731b64b8c31d37de01271571da6d6738))
* **os:** remove unused dependency ([ab027c7](https://github.com/nodkz/mongodb-memory-server/commit/ab027c795120a16b20d055976bba7b6cdd797f4f))
* **prettier:** upgrade to 2.3.1 ([abff587](https://github.com/nodkz/mongodb-memory-server/commit/abff5873ccec8c35f56b60da29059d02226db766))
* **prettier:** upgrade to 2.3.2 ([21efc3d](https://github.com/nodkz/mongodb-memory-server/commit/21efc3d7e64bad5fe16f370fade3ea508095f359))
* **semantic-release:** upgrade to 17.2.2 ([1cb1fec](https://github.com/nodkz/mongodb-memory-server/commit/1cb1fecb0a8c3a37e4287df53d2b1db6bd67c565))
* **semantic-release:** upgrade to 17.3.9 (and related) ([d433278](https://github.com/nodkz/mongodb-memory-server/commit/d43327878ca0de52f54cf81bfe052cedca9f2d4e))
* **semantic-release:** upgrade to 17.4.4 (and related) ([16ccef1](https://github.com/nodkz/mongodb-memory-server/commit/16ccef1570e9992902709b3b2a88bc6650236a42))
* **semver:** upgrade to 7.3.5 ([b4d30a4](https://github.com/nodkz/mongodb-memory-server/commit/b4d30a49ed99418763f12e6b9bcddc4f514f56fd))
* **ts-jest:** upgrade to 26.4.4 ([b8f1fae](https://github.com/nodkz/mongodb-memory-server/commit/b8f1fae86b48f8be93783335ebff9b66840f0084))
* **ts-jest:** upgrade to 26.5.2 ([5c07ee7](https://github.com/nodkz/mongodb-memory-server/commit/5c07ee744ef9b663cc67c8346277cde001db2046))
* **tslib:** include tslib dependency in non-core packages ([6125d2f](https://github.com/nodkz/mongodb-memory-server/commit/6125d2f83cf791833c09a5a590613072929cecf5))
* **tslib:** upgrade to 2.3.0 ([2dccb71](https://github.com/nodkz/mongodb-memory-server/commit/2dccb71495b19141f245767d2cb2753ad780e9b9))
* **typescript:** upgrade to 4.1.3 ([30ea057](https://github.com/nodkz/mongodb-memory-server/commit/30ea057253c69b00cdbcb62810004b78ce35b94d))
* **typescript:** upgrade to 4.3.4 ([efebaa8](https://github.com/nodkz/mongodb-memory-server/commit/efebaa8bf70b7ee313027634c3c36ca09f539fc4))
* **typescript:** upgrade to 4.3.5 ([b778965](https://github.com/nodkz/mongodb-memory-server/commit/b778965fee9b867fa3f07054031c7bfc73a82153))
* allow "^" range for all type packages ([37c01d8](https://github.com/nodkz/mongodb-memory-server/commit/37c01d8bf7d0bf7668e56bdfe4f8e9d46e308d8d))
* pin all non-types devDependencies ([b647153](https://github.com/nodkz/mongodb-memory-server/commit/b647153a1a05295b55eddc5576ab9c52ba92ad0e))
* remove devDependency "mongodb" ([dbd82a7](https://github.com/nodkz/mongodb-memory-server/commit/dbd82a7d4b7ca831c4c4e4292b2a239e54b112da))
* update lockfile ([7ca52da](https://github.com/nodkz/mongodb-memory-server/commit/7ca52da78809aea23739ca6e64c7a8b433079cc8))
* upgrade subdependencies (yarn upgrade) ([b7030ae](https://github.com/nodkz/mongodb-memory-server/commit/b7030ae4bdabb7ce64a816c8afe95b0807a44dbe))
* **uuid:** add "^" ([e12396e](https://github.com/nodkz/mongodb-memory-server/commit/e12396eb8368358c69d2d8c23e7d787a42b669db))

## [7.0.0-beta.52](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.51...v7.0.0-beta.52) (2021-07-01)


### Dependencies

* **@types/debug:** upgrade to 4.1.6 ([dd112af](https://github.com/nodkz/mongodb-memory-server/commit/dd112affc4dbeacec5fdce45f712ccae11e4360e))
* **@types/mongodb:** upgrade to 3.6.19 ([a539022](https://github.com/nodkz/mongodb-memory-server/commit/a539022b7154be600d2fddc0846e9d480c6e6644))
* **@types/node:** change from "^" to "~" ([000d601](https://github.com/nodkz/mongodb-memory-server/commit/000d6015ced54ec3c0538fbd313a7130cf0ab977))
* **@typescript-eslint/*:** upgrade to 4.28.1 ([87e98e6](https://github.com/nodkz/mongodb-memory-server/commit/87e98e6adf39f5d8c23f519814869a4b387b12f6))
* **husky:** upgrade to 7.0.0 ([c58a9ec](https://github.com/nodkz/mongodb-memory-server/commit/c58a9ec638393c3ee61e77dfe28e9d238888047c))
* **jest:** upgrade to 27.0.6 ([7a6e051](https://github.com/nodkz/mongodb-memory-server/commit/7a6e0513273e17e592c8a2620980591cfa38b90d))
* **prettier:** upgrade to 2.3.2 ([21efc3d](https://github.com/nodkz/mongodb-memory-server/commit/21efc3d7e64bad5fe16f370fade3ea508095f359))
* **typescript:** upgrade to 4.3.5 ([b778965](https://github.com/nodkz/mongodb-memory-server/commit/b778965fee9b867fa3f07054031c7bfc73a82153))

## [7.0.0-beta.51](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.50...v7.0.0-beta.51) (2021-06-28)


### Fixes

* **resolveConfig:** move executing "findPackageJson" after enabling debug ([7e4c8dc](https://github.com/nodkz/mongodb-memory-server/commit/7e4c8dc5878c1e2f9bf092a8a17b02649fb25426))
* **resolveConfig:** resolveConfig: always convert any value to string ([27f1f5c](https://github.com/nodkz/mongodb-memory-server/commit/27f1f5c0a57828780410d843378042e9ad131f6b))

## [7.0.0-beta.50](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.49...v7.0.0-beta.50) (2021-06-28)


### Fixes

* **DryMongoBinary:** generatePaths: this function should now not hit the filesystem anymore ([8aefba5](https://github.com/nodkz/mongodb-memory-server/commit/8aefba5abd75c0fbb186c942d1281d3ea27734a3))
* **resolveConfig:** envToBool: return "false" if input is somehow not an string ([6d78971](https://github.com/nodkz/mongodb-memory-server/commit/6d78971a36aa4f77c6a2ec932527798dd1b38bda))

## [7.0.0-beta.49](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.48...v7.0.0-beta.49) (2021-06-25)


### ⚠ BREAKING CHANGES

* Lowest supported NodeJS version is now 12.22

### Features

* set lowest supported nodejs version to 12.22 ([7d6d018](https://github.com/nodkz/mongodb-memory-server/commit/7d6d018a6fd3357a2ed82f663fd5218143ec0a2a))


### Dependencies

* **lint-staged:** upgrade to 11.0.0 ([3429e69](https://github.com/nodkz/mongodb-memory-server/commit/3429e695cf6608f51d450edb86c0f0527f39d348))
* **semantic-release:** upgrade to 17.4.4 (and related) ([16ccef1](https://github.com/nodkz/mongodb-memory-server/commit/16ccef1570e9992902709b3b2a88bc6650236a42))


### Fixes

* change default version to "4.0.25" ([ffe2875](https://github.com/nodkz/mongodb-memory-server/commit/ffe28755b5aab143b3681f78eed6d22a1cf4b23d))

## [7.0.0-beta.48](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.47...v7.0.0-beta.48) (2021-06-25)


### Reverts

* Revert "dependencies(semantic-release): upgrade to 17.4.4 (and related)" ([9825c63](https://github.com/nodkz/mongodb-memory-server/commit/9825c63c289f0d4dfc51e72d8bf870c638114719))


### Fixes

* **dependencies:** allow patch versions ([237177b](https://github.com/nodkz/mongodb-memory-server/commit/237177b82baf11610cf695bca9f3a81d8cbfb51f)), closes [#433](https://github.com/nodkz/mongodb-memory-server/issues/433)
* **MongoBinaryDownloadUrl:** add support for ubuntu-arm64 ([c432e24](https://github.com/nodkz/mongodb-memory-server/commit/c432e24c9c28ee08b2995d3da32909996f6582c7)), closes [#443](https://github.com/nodkz/mongodb-memory-server/issues/443)
* **MongoBinaryDownloadUrl:** handle Debian "testing" release ([#430](https://github.com/nodkz/mongodb-memory-server/issues/430)) ([e4ffecf](https://github.com/nodkz/mongodb-memory-server/commit/e4ffecf1eb2ceb06931feb90bb3f7fbbe0a6237a))
* **MongoBinaryDownloadUrl:** use debian92 for versions <4.2.0 ([7bb5097](https://github.com/nodkz/mongodb-memory-server/commit/7bb5097020502ff140e1e55176f997ab7fe11715)), closes [#448](https://github.com/nodkz/mongodb-memory-server/issues/448)


### Dependencies

* **@types/find-package-json:** upgrade to 1.2.1 ([8103713](https://github.com/nodkz/mongodb-memory-server/commit/810371371d921ba51da0eacd6cc25dc3f7b11ea5))
* **@types/jest:** upgrade to 26.0.23 ([f804224](https://github.com/nodkz/mongodb-memory-server/commit/f8042244143bc7025d499962b10182112033b4d9))
* **@types/md5-file:** remove stub types package ([ad8aec4](https://github.com/nodkz/mongodb-memory-server/commit/ad8aec46c7859aebc90a2108fe253a4d453ba23c))
* **@types/mongodb:** upgrade to 3.6.18 ([2adc43e](https://github.com/nodkz/mongodb-memory-server/commit/2adc43e9cc45e93fe70dd0f90564770acdf080aa))
* **@types/semver:** upgrade to 7.3.6 ([754c565](https://github.com/nodkz/mongodb-memory-server/commit/754c5653bf7be4191ef307e6fda24cd0ec9e1a97))
* **commitlint:** upgrade to 12.1.4 (and related) ([935e460](https://github.com/nodkz/mongodb-memory-server/commit/935e46082774dadedf0be4981de844d06888da8d))
* **conventional-changelog-conventionalcommits:** upgrade to 4.6.0 ([d8a22a4](https://github.com/nodkz/mongodb-memory-server/commit/d8a22a441c52a6772e81c2f1ad3bd676e606306f))
* **doctoc:** upgrade to 2.0.1 ([b40dfdc](https://github.com/nodkz/mongodb-memory-server/commit/b40dfdcfbd87af63fda7f18ae872b395ec0cd1ac))
* **eslint:** upgrade to 7.29.0 (and related) ([e118e7d](https://github.com/nodkz/mongodb-memory-server/commit/e118e7db29b144b545e54694abc7c93292995072))
* **husky:** upgrade to 6.0.0 ([3fdf792](https://github.com/nodkz/mongodb-memory-server/commit/3fdf792256e2f63891ef31d730697f97d91bf9f1))
* **jest:** upgrade to 27.0.5 (and related) ([e7f43a3](https://github.com/nodkz/mongodb-memory-server/commit/e7f43a3da167fd214f528f3e014e2d2e532fe545))
* **lerna:** upgrade to 4.0.0 ([9176e50](https://github.com/nodkz/mongodb-memory-server/commit/9176e50e4db1bcb7317847d9402a786208260547))
* **mongodb:** upgrade to 3.6.9 ([bfc4b5e](https://github.com/nodkz/mongodb-memory-server/commit/bfc4b5ef731b64b8c31d37de01271571da6d6738))
* **prettier:** upgrade to 2.3.1 ([abff587](https://github.com/nodkz/mongodb-memory-server/commit/abff5873ccec8c35f56b60da29059d02226db766))
* **semver:** upgrade to 7.3.5 ([b4d30a4](https://github.com/nodkz/mongodb-memory-server/commit/b4d30a49ed99418763f12e6b9bcddc4f514f56fd))
* **tslib:** upgrade to 2.3.0 ([2dccb71](https://github.com/nodkz/mongodb-memory-server/commit/2dccb71495b19141f245767d2cb2753ad780e9b9))
* **typescript:** upgrade to 4.3.4 ([efebaa8](https://github.com/nodkz/mongodb-memory-server/commit/efebaa8bf70b7ee313027634c3c36ca09f539fc4))

## [7.0.0-beta.47](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.46...v7.0.0-beta.47) (2021-06-25)


### Fixes

* **MongoBinary:** enhance systemBinary version regex ([0d990d3](https://github.com/nodkz/mongodb-memory-server/commit/0d990d3e9a2958628dce5aef1e6b5025165b705d))
* **MongoBinary:** use ".stdout.toString" for command output parsing ([d8d6749](https://github.com/nodkz/mongodb-memory-server/commit/d8d6749f585afb76037a35956a7160e330ed28a3)), closes [#487](https://github.com/nodkz/mongodb-memory-server/issues/487)

## [7.0.0-beta.46](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.45...v7.0.0-beta.46) (2021-06-17)


### ⚠ BREAKING CHANGES

* `getUri`'s parameter got changed to use  ""(empty) by default

### Fixes

* change "generateDbName" to return an empty string by default ([840be19](https://github.com/nodkz/mongodb-memory-server/commit/840be19d3affae664be61c10ec357292c04922b7)), closes [#141](https://github.com/nodkz/mongodb-memory-server/issues/141)

## [7.0.0-beta.45](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.44...v7.0.0-beta.45) (2021-06-17)


### ⚠ BREAKING CHANGES

* `getUri`'s parameter got changed to what the actual definition is, and uses "admin" by default

### Fixes

* fix description & usage of "dbName" in mongo URI ([7b986e1](https://github.com/nodkz/mongodb-memory-server/commit/7b986e15dd1c060706b670116739f51bd2ea909b)), closes [#141](https://github.com/nodkz/mongodb-memory-server/issues/141)

## [7.0.0-beta.44](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.43...v7.0.0-beta.44) (2021-06-13)


### Features

* **MongoBinaryDownloadUrl:** support more arm64 (aarch64) versions ([8b5434c](https://github.com/nodkz/mongodb-memory-server/commit/8b5434c65217af87458a704bd93f6ffabb18de6c)), closes [#482](https://github.com/nodkz/mongodb-memory-server/issues/482)

## [7.0.0-beta.43](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.42...v7.0.0-beta.43) (2021-06-02)


### Fixes

* **DryMongoBinary:** only use global path when not empty ([9d176b2](https://github.com/nodkz/mongodb-memory-server/commit/9d176b22a4867d1887a06c11a1955767f0696285)), closes [#478](https://github.com/nodkz/mongodb-memory-server/issues/478)
* **DryMongoBinary:** use "INIT_CWD" when available ([cc2da32](https://github.com/nodkz/mongodb-memory-server/commit/cc2da3298de00b199d9f9ca134951b72e4c1a8ab)), closes [#478](https://github.com/nodkz/mongodb-memory-server/issues/478)

## [7.0.0-beta.42](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.41...v7.0.0-beta.42) (2021-05-10)


### Fixes

* **MongoMemoryServer:** resolve nodejs warning "DEP0147" ([c498e22](https://github.com/nodkz/mongodb-memory-server/commit/c498e223df7aa4ba2ac462ed5097060e254db7bb))

## [7.0.0-beta.41](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.40...v7.0.0-beta.41) (2021-05-09)


### Fixes

* **MongoBinaryDownload:** clear line before writing progress ([db3796a](https://github.com/nodkz/mongodb-memory-server/commit/db3796a60f766200abf510f6a34b4645edafbdd6))

## [7.0.0-beta.40](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.39...v7.0.0-beta.40) (2021-05-06)


### Fixes

* **resolveConfig:** resolve download dir and system binary relative to found package.json ([bc6ee8e](https://github.com/nodkz/mongodb-memory-server/commit/bc6ee8e4a6928f42f4357e090c0ffbea4ec0f384))

## [7.0.0-beta.39](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.38...v7.0.0-beta.39) (2021-05-05)


### Fixes

* **MongoBinaryDownloadUrl:** add fedora version 34+ handling ([8f33ef4](https://github.com/nodkz/mongodb-memory-server/commit/8f33ef4ba5c238fc72cf55b3fb7c934152b7eafe)), closes [#304](https://github.com/nodkz/mongodb-memory-server/issues/304)

## [7.0.0-beta.38](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.37...v7.0.0-beta.38) (2021-03-23)


### ⚠ BREAKING CHANGES

* **MongoMemoryServer:** "MongoMemoryServer" now implements "ManagerAdvanced"
* **MongoInstance:** "MongoInstance" now implements "ManagerBase"
* **MongoInstance:** renaming "MongoInstance.childProcess" to "MongoInstance.mongodProcess" can break some api's

### Features

* **DryMongoBinary:** combineBinaryName: remove unused parameter ([edee483](https://github.com/nodkz/mongodb-memory-server/commit/edee4836ba240908b377b4588477c205fbcd2f88))
* **MongoInstance:** implement "ManagerBase" ([e6e4e6b](https://github.com/nodkz/mongodb-memory-server/commit/e6e4e6b1de4a2635e195217bca9de36f0634c90e))
* **MongoInstance:** rename property "childProcess" to "mongodProcess" ([46c56d8](https://github.com/nodkz/mongodb-memory-server/commit/46c56d8556a7d033cd32f6b02cfadd28b0473d67))
* **MongoMemoryServer:** implement "ManagerAdvanced" ([709f733](https://github.com/nodkz/mongodb-memory-server/commit/709f733c737a84885d32675639b7cc0ac760b32b))
* **utils:** add "ManagerBase" and "ManagerAdvanced" classes ([40190ef](https://github.com/nodkz/mongodb-memory-server/commit/40190ef3af9da8fd152a0db802a411fe20452f41))


### Style

* **DryMongoBinary:** locateBinary: simplify "if-condition" ([3219315](https://github.com/nodkz/mongodb-memory-server/commit/3219315e6eea96258df87aaf29a686eccd3135e1))
* **MongoBinary:** getPath: combine "defaultOptions" & "options" into single assignment ([b107d54](https://github.com/nodkz/mongodb-memory-server/commit/b107d54bb934901c12243a06f8366c472ac9ffb1))
* **MongoBinary:** getPath: simplify "if-condition" ([7584b56](https://github.com/nodkz/mongodb-memory-server/commit/7584b564fb3dabb5e6c26fbe5f64d9a0c20c3a94))
* **MongoBinaryDownloadUrl:** getArchiveNameLinux: combine "name" assignments ([50878b3](https://github.com/nodkz/mongodb-memory-server/commit/50878b3414280c86759c65ea0e347fee49427e88))
* **MongoBinaryDownloadUrl:** getArchiveNameOsx: combine "name" assignments ([c4bbf79](https://github.com/nodkz/mongodb-memory-server/commit/c4bbf79b750df80e45a135aac8326c556fd3793d))
* **MongoBinaryDownloadUrl:** getArchiveNameWin: combine "name" assignments ([258a6a1](https://github.com/nodkz/mongodb-memory-server/commit/258a6a110a76633bb84e3f4e9e25cf3e014faca4))
* **MongoInstance:** change comments into tsdoc ([278619c](https://github.com/nodkz/mongodb-memory-server/commit/278619c0e1ea8ca870ca5cb0a9544cf1c143e43c))
* **MongoInstance:** move some comments ([9832760](https://github.com/nodkz/mongodb-memory-server/commit/9832760b51e3b985fc00a7508f66a64d860ae48c))
* **MongoInstance:** simplify imports ([5621da9](https://github.com/nodkz/mongodb-memory-server/commit/5621da9b4e40dfd1889a103a2d4b7e78a05b3458))
* **MongoInstance:** unify promise variable names ([73691da](https://github.com/nodkz/mongodb-memory-server/commit/73691da74147b07cf53405f09f6541fbe563181b))


### Fixes

* **MongoBinaryDownload:** download: escape paths in log & errors ([5d2703e](https://github.com/nodkz/mongodb-memory-server/commit/5d2703ee565b384611194690a11dd56aeb97d2c3))
* **MongoBinaryDownload:** extract: remove only once used variable & escape paths in errors ([3d5e9cb](https://github.com/nodkz/mongodb-memory-server/commit/3d5e9cb6b966d97cfb669736d94c093b81963e3d))
* **MongoBinaryDownload:** getMongodPath: add more logging & escape path in error ([962cc9f](https://github.com/nodkz/mongodb-memory-server/commit/962cc9ff69cf9d25c79f49df7faa0b3a6dc599b0))
* **MongoBinaryDownload:** httpDownload: open filestream only on successful response ([57f3c7c](https://github.com/nodkz/mongodb-memory-server/commit/57f3c7cd78ddcad8b8506db3336d162165451205))
* **MongoBinaryDownload:** makeMD5check: unlink md5 file after check ([c0b707d](https://github.com/nodkz/mongodb-memory-server/commit/c0b707df3e6a7d002abdd5d3d679f29f12d31f42))
* **MongoBinaryDownloadUrl:** change interface to actual needs ([a906acb](https://github.com/nodkz/mongodb-memory-server/commit/a906acb15401574ec0dd01f63152c432f7fdc7f5))
* **MongoBinaryDownloadUrl:** getArchiveName: change tsdoc & simplify "if-condition" ([aaab616](https://github.com/nodkz/mongodb-memory-server/commit/aaab616199d19de8cf3fdf2a74ae237222b3b406))
* **MongoInstance:** debug: change to be "protected" instead of "private" ([633a35e](https://github.com/nodkz/mongodb-memory-server/commit/633a35e968acb8107eef69c5c6cd357a5e9315d2))
* **MongoInstance:** start: update logs to reflect actual function name ([1e5a2d7](https://github.com/nodkz/mongodb-memory-server/commit/1e5a2d7c7ea742acb62f00a2ae18bbb81a0bf145))
* **MongoInstance:** stop: fix log & remove double "con.close" ([bb2697c](https://github.com/nodkz/mongodb-memory-server/commit/bb2697c35b41c02cc6149d723ef209e12463f8f2))
* **MongoInstance:** update tsdoc & enhance logging ([2d9e8f5](https://github.com/nodkz/mongodb-memory-server/commit/2d9e8f502ac93f9369352fa629ce906e94990ea4))
* **MongoMemoryReplSet:** implement "ManagerAdvanced" & add logging to "create" ([94e3092](https://github.com/nodkz/mongodb-memory-server/commit/94e3092e47adbb335cbadda1db20d96e49bbe986))

## [7.0.0-beta.37](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.36...v7.0.0-beta.37) (2021-03-22)


### Style

* **MongoMemoryServer:** getStartOptions: use "spread" instead of many lines ([9a01529](https://github.com/nodkz/mongodb-memory-server/commit/9a01529073da47d23486efc4274012c5b21788f8))
* **resolveConfig:** update tsdoc ([4e5469c](https://github.com/nodkz/mongodb-memory-server/commit/4e5469c6dd32603a580a947b1194f4c5ca7c7476))
* **utils:** authDefault: add tsdoc ([aab1647](https://github.com/nodkz/mongodb-memory-server/commit/aab16477cb96d63d2ed3b7a4e90b5761b51c2212))


### Fixes

* **MongoMemoryReplSet:** start: change state on error ([20433b5](https://github.com/nodkz/mongodb-memory-server/commit/20433b5fa27854c30f30d602d186d9413bf0563f))
* **MongoMemoryReplSet:** start: move "beforeExit" listener setup before starting instances ([d1cc648](https://github.com/nodkz/mongodb-memory-server/commit/d1cc6481bbf0e475171e23f679363b83229d83ec))
* **MongoMemoryServer:** add some tsdoc & change an if-throw to assertion ([5c7acb4](https://github.com/nodkz/mongodb-memory-server/commit/5c7acb489cdce3c385b5b101255ccd14f5d11775))
* **MongoMemoryServer:** createAuth: fix typo in "customData" & add "customData" to extra users ([31c98c9](https://github.com/nodkz/mongodb-memory-server/commit/31c98c9f2fd5b45cf56880f238c35c9c3458c47e))
* **MongoMemoryServer:** ensureInstance: change logs to be consistent with others ([3d430c1](https://github.com/nodkz/mongodb-memory-server/commit/3d430c19167608d902a0a6accfb4cceaeda347ba))
* **MongoMemoryServer:** fix typo in warning ([532bc09](https://github.com/nodkz/mongodb-memory-server/commit/532bc0905ff47a425d50bcd212bd49de2d0b2082))
* **MongoMemoryServer:** start: dont add "beforeExit" listener if being in an replset ([f9c555d](https://github.com/nodkz/mongodb-memory-server/commit/f9c555d5cf78b087c142d8232c51f4cd105b68b4))
* **MongoMemoryServer:** stop: change log to be better sounding ([a009693](https://github.com/nodkz/mongodb-memory-server/commit/a0096932947b5e57d6b30587d1c103eda1d65680))
* **postinstallHelper:** reduce variables ([b42bac3](https://github.com/nodkz/mongodb-memory-server/commit/b42bac3e40817c303ed82ea499b772a380271138))
* **utils:** ensureAsync: change from "setImmediate" to "process.nextTick" ([3da59cc](https://github.com/nodkz/mongodb-memory-server/commit/3da59cc896872dee10f08272890efc0847128b3c))
* **utils:** killProcess: unify log and variable names with other code ([5605ea0](https://github.com/nodkz/mongodb-memory-server/commit/5605ea0a067fab0d2064787e042f7ec07ad9bf76))

## [7.0.0-beta.36](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.35...v7.0.0-beta.36) (2021-03-20)


### Features

* **MongoMemoryReplSet:** change more errors to "StateError" & more consistent logs ([64780ee](https://github.com/nodkz/mongodb-memory-server/commit/64780ee35ca332a416610c4dfe5b0d0e79227234))
* **MongoMemoryServer:** change more errors to "StateError" & more consistent logs ([b05ec44](https://github.com/nodkz/mongodb-memory-server/commit/b05ec44d5319b34ff61b8aead819c11b9543a9bd))


### Fixes

* **errors:** StateError: fix type for "wantedStates" ([6297275](https://github.com/nodkz/mongodb-memory-server/commit/6297275b0908cb8e4083b4b8ca43eff4968d0f3e))
* **utils:** getHost: reduce calls by combining regex ([1b46769](https://github.com/nodkz/mongodb-memory-server/commit/1b46769eb34a568d8b3915e25c4dc0f29b909667))

## [7.0.0-beta.35](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.34...v7.0.0-beta.35) (2021-03-19)


### Fixes

* **MongoBinaryDownload:** getPath: reduce some calls ([43b746a](https://github.com/nodkz/mongodb-memory-server/commit/43b746af35be6ba2ffc8ca7d4e3ac38ab4026a42))

## [7.0.0-beta.34](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.33...v7.0.0-beta.34) (2021-03-19)


### Fixes

* **MongoInstance:** change logs to be more up-to-date ([d421e01](https://github.com/nodkz/mongodb-memory-server/commit/d421e015c0362b178c29a819392b938ac6c25b5a))
* **MongoMemoryReplSet:** _initReplSet: add more logs ([952fbf5](https://github.com/nodkz/mongodb-memory-server/commit/952fbf58eb5fbc55837c26de0fbe7a08e118b94e))
* **MongoMemoryServer:** change options instead of creating new instance for auth creation ([171f1fb](https://github.com/nodkz/mongodb-memory-server/commit/171f1fbe34873dcd898e15dfa418ca9e2c99b4eb))


### Dependencies

* **mongodb:** upgrade to 3.6.5 ([d0eabf6](https://github.com/nodkz/mongodb-memory-server/commit/d0eabf6a51a91c60a70a84767fc3d2000452e6b0))

## [7.0.0-beta.33](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.32...v7.0.0-beta.33) (2021-03-17)


### Fixes

* **MongoBinary:** add information about "RUNTIME_DOWNLOAD" to no binary found error ([94ee82d](https://github.com/nodkz/mongodb-memory-server/commit/94ee82d201eeaf9580684601d6113e404f3c6242))
* **MongoBinary:** change to match with regex instead of string splitting ([ab1cd36](https://github.com/nodkz/mongodb-memory-server/commit/ab1cd3697a12181f117b9587af89027a2594523a))
* **MongoBinary:** remove using "binaryVersion" for version, because "version" cannot be undefined ([72c8199](https://github.com/nodkz/mongodb-memory-server/commit/72c819971b5e24e6f79ee27d181d4bd2b4ad9cf4))
* **MongoBinary:** use less variables & extend error ([8b448db](https://github.com/nodkz/mongodb-memory-server/commit/8b448db73a24479273e6da12cdb5bdca8ff30a7d))
* **MongoBinary:** use semver for version comparison ([d1f181a](https://github.com/nodkz/mongodb-memory-server/commit/d1f181ac98e044f85c1633b4466afcd789758300))

## [7.0.0-beta.32](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.31...v7.0.0-beta.32) (2021-03-16)


### Fixes

* **MongoMemoryServer:** change state to stopped when start fails ([e9134a7](https://github.com/nodkz/mongodb-memory-server/commit/e9134a7f4c05d741d25742b11d2d6a5862c35fcc))

## [7.0.0-beta.31](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.30...v7.0.0-beta.31) (2021-03-15)


### Features

* **errors:** add error "StateError" ([e582407](https://github.com/nodkz/mongodb-memory-server/commit/e582407cf0904244465e56012de9a7c9caf410a9))
* **errors:** add error "UnknownArchitecture" ([e2c39d6](https://github.com/nodkz/mongodb-memory-server/commit/e2c39d6b448aac4a81be23dfb4d6cef33aaef90f))
* **errors:** add error "UnknownLockfileStatus" ([186df5b](https://github.com/nodkz/mongodb-memory-server/commit/186df5b1ccd81714826d2880eb07bf4e3d80d0de))
* **errors:** add error "UnknownPlatform" ([747d893](https://github.com/nodkz/mongodb-memory-server/commit/747d893b57c51ec85a10d4343cb17044c6eb4715))
* **lockfile:** replace custom errors with "UnknownLockfileStatus" ([5ea5662](https://github.com/nodkz/mongodb-memory-server/commit/5ea56626454ff1852ccc07ad95630e1db130000f))
* **MongoBinaryDownloadUrl:** replace custom errors with "UnknownArchitecture" ([6755554](https://github.com/nodkz/mongodb-memory-server/commit/67555547060d233fc3eca3a22452dbcd76b86c20))
* **MongoBinaryDownloadUrl:** replace custom errors with "UnknownPlatform" ([86aac73](https://github.com/nodkz/mongodb-memory-server/commit/86aac73a768ca912527eaa30e50c0ad7a856ca26))
* **MongoMemoryReplSet:** replace custom errors with "StateError" ([f49d7a1](https://github.com/nodkz/mongodb-memory-server/commit/f49d7a1c54f6ff39c5f5b91bdae32f3fc01f5c87))
* **MongoMemoryServer:** replace custom error with "StateError" ([e965ef5](https://github.com/nodkz/mongodb-memory-server/commit/e965ef55c073f81d49934ffa86683bf06c1ed1ab))

## [7.0.0-beta.30](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.29...v7.0.0-beta.30) (2021-03-14)


### ⚠ BREAKING CHANGES

* **utils:** Default-export from "utils" got removed, import it now with "{ generateDbName }"

### Fixes

* **MongoBinaryDownloadUrl:** getDownloadUrl: try "DOWNLOAD_URL" before getArchiveName ([7a8a4c3](https://github.com/nodkz/mongodb-memory-server/commit/7a8a4c34c44aa588277b2ea94f541c2f28b1730d))
* **MongoBinaryUrl:** getDownloadUrl: try to create an "URL" to check if the url is valid ([25c865c](https://github.com/nodkz/mongodb-memory-server/commit/25c865c0a71e7d682eccb6f0e2895a11f9f092ef))
* **utils:** remove default export ([102e4b0](https://github.com/nodkz/mongodb-memory-server/commit/102e4b05479f8f2433de447bd10b334f6b80301a))

## [7.0.0-beta.29](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.28...v7.0.0-beta.29) (2021-03-12)


### Features

* **utils:** uriTemplate: allow "port" to be undefined so that "host" can be an list of hosts ([e101162](https://github.com/nodkz/mongodb-memory-server/commit/e101162c2ca870ed34d420b2b7a8fa5cc47bb5db))


### Fixes

* **MongoInstance:** remove interface "MongoInstanceOpts" in favor of "MongoMemoryInstanceProp" ([7efb4ff](https://github.com/nodkz/mongodb-memory-server/commit/7efb4ffe19ae676de4f69be283ac6a51f04c49c2))
* **MongoMemoryReplSet:** dont generate an "otherDb" if "othereDb" is false ([63497c0](https://github.com/nodkz/mongodb-memory-server/commit/63497c0ae4d8a67cfcab36beb8727a02eae7711e))
* **MongoMemoryReplSet:** getUri: loop over less arrays ([dec9bac](https://github.com/nodkz/mongodb-memory-server/commit/dec9bac889e334317f872d51109c27e268ae58c8))
* **MongoMemoryReplSet:** getUri: use "uriTemplate" instead of re-doing ([c6c9321](https://github.com/nodkz/mongodb-memory-server/commit/c6c9321cdcd55b4f305280b4f5783513200870ff))
* **MongoMemoryServer:** dont trigger "otherDb" if "otherDbName" is false ([ffb096d](https://github.com/nodkz/mongodb-memory-server/commit/ffb096dd3530fb4fb98d8660e1c0fc88f645a66e))


### Style

* **MongoInstance:** move comment into tsdoc ([d749abb](https://github.com/nodkz/mongodb-memory-server/commit/d749abbd756436c2eff7cdca80622531557992bb))
* **MongoInstance:** remove "null" from "port" ([75d805f](https://github.com/nodkz/mongodb-memory-server/commit/75d805f1472e570bc1a081a7593ad94cc2b1fe5d))
* **MongoInstance:** rename interface to have an better name ([60858b1](https://github.com/nodkz/mongodb-memory-server/commit/60858b10264389605cd698d87d95fff79edd0033))
* **MongoInstance:** rename interface to have an better name ([916aa11](https://github.com/nodkz/mongodb-memory-server/commit/916aa1127ff22b5b52bebfec75c899b351c2799c))
* **MongoMemoryReplSet:** add tsdoc to "initAllServers" ([ba46aee](https://github.com/nodkz/mongodb-memory-server/commit/ba46aee6efbff6228279d60e0ac260214b2ea331))
* **MongoMemoryServer:** change "StartupInstanceData" to depend on "MongoMemoryInstanceOpts" ([26af098](https://github.com/nodkz/mongodb-memory-server/commit/26af098e25707aff1976eb7ba06a9aa6fa8b6514))
* **MongoMemoryServer:** inherit type instead of redefining ([eb41f81](https://github.com/nodkz/mongodb-memory-server/commit/eb41f8112e40a810b6c675b89083db737be7b458))

## [7.0.0-beta.28](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.27...v7.0.0-beta.28) (2021-03-10)


### Dependencies

* **@types/dedent:** remove unused dependency ([1cb479d](https://github.com/nodkz/mongodb-memory-server/commit/1cb479d21030f910fb414e470d56a447151a091f))
* **@types/lockfile:** remove unused dependency ([fa3d6c8](https://github.com/nodkz/mongodb-memory-server/commit/fa3d6c8313362991d25a6630dc277cb4c1212d26))
* **os:** remove unused dependency ([ab027c7](https://github.com/nodkz/mongodb-memory-server/commit/ab027c795120a16b20d055976bba7b6cdd797f4f))

## [7.0.0-beta.27](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.26...v7.0.0-beta.27) (2021-03-10)


### Features

* change binary from "base/version/mongod" to "base/mongod-arch-dist-version" ([2682704](https://github.com/nodkz/mongodb-memory-server/commit/26827045298dc9b2bdecda024fabab2b7e8e8fec)), closes [#256](https://github.com/nodkz/mongodb-memory-server/issues/256)


### Style

* **DryMongoBinary:** remove unused optional chaning ([06cfccb](https://github.com/nodkz/mongodb-memory-server/commit/06cfccb2e242983465af550a5579227590bddbed))

## [7.0.0-beta.26](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.25...v7.0.0-beta.26) (2021-03-09)


### Reverts

* "test(replset-single): add in-detail error printing on error" ([7989082](https://github.com/nodkz/mongodb-memory-server/commit/7989082f9572e55b85ee934691a9bd404d6ed883))


### Style

* **MongoMemoryReplSet:** _waitForPrimary: add log that function got called ([c5f66a3](https://github.com/nodkz/mongodb-memory-server/commit/c5f66a38122fedba3d42f47178c4b5f470ce955e))
* **MongoMemoryReplSet:** trim error message & add "_" to unused parameter ([6be0c00](https://github.com/nodkz/mongodb-memory-server/commit/6be0c00449d7050b38ed58cd222d07c935b9f6e5))


### Fixes

* **MongoInstance:** stdoutHandler: dont use "else if" ([03184d4](https://github.com/nodkz/mongodb-memory-server/commit/03184d47e7e3f54d96834711c028a9fb43454441))

## [7.0.0-beta.25](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.24...v7.0.0-beta.25) (2021-03-08)


### Fixes

* **MongoBinaryDownloadUrl:** use debian92 for versions <4.2.0 ([79306c5](https://github.com/nodkz/mongodb-memory-server/commit/79306c59917f96ddf6e997670c2cc848e873746d)), closes [#448](https://github.com/nodkz/mongodb-memory-server/issues/448)

## [7.0.0-beta.24](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.23...v7.0.0-beta.24) (2021-03-08)


### Dependencies

* **@types/find-package-json:** upgrade to 1.2.0 ([d2dc5c6](https://github.com/nodkz/mongodb-memory-server/commit/d2dc5c6305377170f291ca0a6c0caa395fd5c791))

## [7.0.0-beta.23](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.22...v7.0.0-beta.23) (2021-03-02)


### Features

* **DryMongoBinary:** add new "DryMongoBinary" ([3841312](https://github.com/nodkz/mongodb-memory-server/commit/3841312fd414df47223c0f9d59636f910bc2bc8b))
* **DryMongoBinary:** add new function "generateOptions" ([2d89ba1](https://github.com/nodkz/mongodb-memory-server/commit/2d89ba1df74a90e9663228e7a1101c8d3222dd86))
* **MongoBinary:** add option to disable automatic download ([2c0639b](https://github.com/nodkz/mongodb-memory-server/commit/2c0639b0d860c0f9f1cea0f8b7fd15bdd78f9317))
* **MongoBinary:** implement usage of "DryMongoBinary" ([4a13cea](https://github.com/nodkz/mongodb-memory-server/commit/4a13cead837e6f6005c07c741cb64ad704c5d4ca))
* **MongoBinaryDownload:** add option to use "http" over "https" ([b178a97](https://github.com/nodkz/mongodb-memory-server/commit/b178a970239e7a40398c4bf085ab09b9d63b7e7e)), closes [#172](https://github.com/nodkz/mongodb-memory-server/issues/172)


### Refactor

* **MongoBinary:** use "DryMongoBinary.generateOptions" ([0e7e73f](https://github.com/nodkz/mongodb-memory-server/commit/0e7e73f9d3d00f4427411a75f3ffa92158f39979))
* **MongoBinaryDownload:** enhance md5 regex ([becac06](https://github.com/nodkz/mongodb-memory-server/commit/becac06f1a81a6d4f1cb5f21810e1784c13dce1a))
* **MongoBinaryDownload:** extract: combine win32 and linux regex ([702eaa9](https://github.com/nodkz/mongodb-memory-server/commit/702eaa93570df5429ef7503cc97f6bcc7dff3c8a))
* **MongoBinaryDownload:** extract: combine win32 filter regex ([28cfc7c](https://github.com/nodkz/mongodb-memory-server/commit/28cfc7ccf480512672af33ecd4e8010d9aba9f8c))
* **MongoBinaryDownloadUrl:** change "translateArch" to be static ([ba87378](https://github.com/nodkz/mongodb-memory-server/commit/ba873789e37f87ebcdc56cbe9ae85506c0ae8872))


### Style

* **MongoBinary:** add tsdoc to describe what the class is for ([36f1118](https://github.com/nodkz/mongodb-memory-server/commit/36f1118bc548edc33241eebd91f07dd86886564d))
* **MongoBinary:** remove duplicated definitions from interface ([87a3ca8](https://github.com/nodkz/mongodb-memory-server/commit/87a3ca86601db1efe317b02653709053750b1710))


### Fixes

* **DryBinary:** use "modulesCache/version/binary" instead of "modulesCache/mongodb-binaries/version/binary" ([072abde](https://github.com/nodkz/mongodb-memory-server/commit/072abdeb3c0504c9a5bf17547274f78db141356e))
* **DryMongoBinary:** only use "resolveConfigValue" when not empty ([08e71cf](https://github.com/nodkz/mongodb-memory-server/commit/08e71cfa82bb2a4f41021579339f72f6c3e1f9c5))
* **MongoBinaryDownload:** add more logging ([b63f629](https://github.com/nodkz/mongodb-memory-server/commit/b63f6291359fb7c29c0dbf1022c5caadb1864da9))
* **MongoBinaryDownload:** change "downloadDir" to be required ([d2f2e30](https://github.com/nodkz/mongodb-memory-server/commit/d2f2e306b857fba08f6478f27731b0c2808a596f))
* **MongoBinaryDownload:** enhance progress message ([ada4f2a](https://github.com/nodkz/mongodb-memory-server/commit/ada4f2ae7b09c278594f89b356477dc1bc06816b))
* **MongoBinaryDownload:** force an status print on download finish ([62337fd](https://github.com/nodkz/mongodb-memory-server/commit/62337fd509b63396e85ae210811e1e84b07fe14c))
* **MongoBinaryDownload:** unify how the downloadUrl is represented ([23f057e](https://github.com/nodkz/mongodb-memory-server/commit/23f057edb735ebd0b7140a207ff6fbf581f0075e))
* **MongoBinaryDownload:** use "mkdirp" over "fs.mkdir" ([c64a321](https://github.com/nodkz/mongodb-memory-server/commit/c64a3211363be5fb3f6f4dbeccac426605fb49df))
* **MongoBinaryDownload:** use "MongoBinaryOpts" over "MongoBinaryDownloadOpts" ([ce193ce](https://github.com/nodkz/mongodb-memory-server/commit/ce193ce4758eb31ab670c829ea4f3ebf975371cd))
* **MongoBinaryDownload:** use new "URL" class instead of deprecated "url.parse" ([70af5d2](https://github.com/nodkz/mongodb-memory-server/commit/70af5d28b98738b733c075d3eeeb674233d04751))
* **MongoBinaryDownloadUrl:** remove unused parameter ([d72ed42](https://github.com/nodkz/mongodb-memory-server/commit/d72ed42a16d19e71b2b98168d896bb76736a6e98))
* **MongoBinaryDownloadUrl:** use DryBinary.generateOptions's "os" instead of calling "getOS" directly ([ac025d9](https://github.com/nodkz/mongodb-memory-server/commit/ac025d98393125533a02f0143036108f23769f43))
* **resolveConfig:** add helper function to add the prefix to an variable name ([8334c45](https://github.com/nodkz/mongodb-memory-server/commit/8334c4598cc3a8e3032a6333b2de976b1f3aaf36))

## [7.0.0-beta.22](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.21...v7.0.0-beta.22) (2021-02-26)


### Fixes

* **MongoBinaryDownloadUrl:** support macos arm64 to x64 archive translation ([2aa9b38](https://github.com/nodkz/mongodb-memory-server/commit/2aa9b38c6ea49035eaf9ee64cc772a364e2ad2fe))

## [7.0.0-beta.21](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.20...v7.0.0-beta.21) (2021-02-25)


### ⚠ BREAKING CHANGES

* **MongoInstance:** MongoInstance's functions got renamed to make more clear what they do
(create,start,stop - instead of run,run,kill)

### Features

* **MongoInstance:** rename functions to unify all classes ([655d295](https://github.com/nodkz/mongodb-memory-server/commit/655d29575aa2a39c4edee91d0f5771e25ab5b83b))


### Dependencies

* update lockfile ([7ca52da](https://github.com/nodkz/mongodb-memory-server/commit/7ca52da78809aea23739ca6e64c7a8b433079cc8))
* **cross-env:** upgrade to 7.0.3 ([b412ce2](https://github.com/nodkz/mongodb-memory-server/commit/b412ce2e8cdbfd08e13971d547ce5b64ec19fbec))
* **doctoc:** upgrade to 2.0.0 ([8e1a091](https://github.com/nodkz/mongodb-memory-server/commit/8e1a091de229531c0be945e8637d33f7d4133e84))
* **eslint:** upgrade to 7.20.0 (and related) ([715fdbd](https://github.com/nodkz/mongodb-memory-server/commit/715fdbd21afd35f9bf4939dd4b8bb9e0d9b2de10))
* **husky:** upgrade to 5.1.1 ([4e93d29](https://github.com/nodkz/mongodb-memory-server/commit/4e93d29c5f376a0ab22199fa65fe338267829879))
* **semantic-release:** upgrade to 17.3.9 (and related) ([d433278](https://github.com/nodkz/mongodb-memory-server/commit/d43327878ca0de52f54cf81bfe052cedca9f2d4e))
* **ts-jest:** upgrade to 26.5.2 ([5c07ee7](https://github.com/nodkz/mongodb-memory-server/commit/5c07ee744ef9b663cc67c8346277cde001db2046))


### Fixes

* **lockfile:** add uuid to lock instance ([75574a1](https://github.com/nodkz/mongodb-memory-server/commit/75574a173a326dc9688677e93f1fb74e2f49ff64))
* **MongoInstance:** give better error reporting when library file is missing ([692455a](https://github.com/nodkz/mongodb-memory-server/commit/692455ab30e30c8ed9964ca0281fd6a6f5ec4f05)), closes [#408](https://github.com/nodkz/mongodb-memory-server/issues/408)

## [7.0.0-beta.20](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.19...v7.0.0-beta.20) (2021-02-24)


### Features

* **MongoBinaryDownloadUrl:** add support for ubuntu-arm64 ([5733a0f](https://github.com/nodkz/mongodb-memory-server/commit/5733a0f391453d7375ee1046722f744a049ea339)), closes [#443](https://github.com/nodkz/mongodb-memory-server/issues/443)


### Style

* **lockfile:** add log when "readout" is for not for self ([1b669ad](https://github.com/nodkz/mongodb-memory-server/commit/1b669ad310075a9ea3ba876fb89701e2d9c95b69))


### Refactor

* **MongoBinaryDownload:** unify path resolving ([4258eb7](https://github.com/nodkz/mongodb-memory-server/commit/4258eb7a5d6c4db1e51523de2c2681316f5b8d8f))


### Fixes

* **lockfile:** checkLock: handle ENOENT ([7d3e998](https://github.com/nodkz/mongodb-memory-server/commit/7d3e998fca6f964e0f4100ec920125b2acb0a4f2))
* **MongoBinary:** ensure lockfile gets unlocked in case of error ([e81db43](https://github.com/nodkz/mongodb-memory-server/commit/e81db4345dd0b3dd5bcad0100fb4f995456252b4))

## [7.0.0-beta.19](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.18...v7.0.0-beta.19) (2021-02-24)


### Fixes

* **global:** use an absolute module path to core in global index scripts ([2428fd8](https://github.com/nodkz/mongodb-memory-server/commit/2428fd805e1389e6374435a238749a1d654dee2e))
* **postinstall:** use an absolute module path to core in postinstall scripts ([d71ea48](https://github.com/nodkz/mongodb-memory-server/commit/d71ea48293d4beab94a373b6f0a2b38733a4f98a))


### Dependencies

* **tslib:** include tslib dependency in non-core packages ([6125d2f](https://github.com/nodkz/mongodb-memory-server/commit/6125d2f83cf791833c09a5a590613072929cecf5))

## [7.0.0-beta.18](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.17...v7.0.0-beta.18) (2021-02-22)


### Fixes

* **resolveConfig:** change to use the first found package.json with an non-empty config field ([4d9de37](https://github.com/nodkz/mongodb-memory-server/commit/4d9de376cea99eee2c7c2a500edb94cbb13b8980)), closes [#439](https://github.com/nodkz/mongodb-memory-server/issues/439)


### Style

* **resolveConfig:** add "filename" to logs ([7809fcd](https://github.com/nodkz/mongodb-memory-server/commit/7809fcdda809350784816342d2c1d0f69b9bb1a3))

## [7.0.0-beta.17](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.16...v7.0.0-beta.17) (2021-02-20)


### Fixes

* **lockfile:** ignore lockfile unlink fail ([ceea1a7](https://github.com/nodkz/mongodb-memory-server/commit/ceea1a770299dcc18473eb1a3389d063fe34d7af))
* **resolveConfig:** findPackageJson: resolve file paths directly ([0bec0bf](https://github.com/nodkz/mongodb-memory-server/commit/0bec0bf1b63904e82e357dc6dc646db3c0fa6df4)), closes [#440](https://github.com/nodkz/mongodb-memory-server/issues/440)
* **resolveConfig:** simplify packageJson type ([fac363d](https://github.com/nodkz/mongodb-memory-server/commit/fac363d27b8af34072752a12d2bb1e1e060af54d))

## [7.0.0-beta.16](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.15...v7.0.0-beta.16) (2021-02-19)


### ⚠ BREAKING CHANGES

* **getos:** All "USE*" and "SKIP*" Environment Variables got removed in favor of an better handling

### Features

* **getos:** remove all "USE*" and "SKIP*" environment variables ([e389c3e](https://github.com/nodkz/mongodb-memory-server/commit/e389c3e68715f38e9012a7a758dd1dbaad38a3e6))
* **getos:** simplify reading an release file ([e5e6521](https://github.com/nodkz/mongodb-memory-server/commit/e5e6521eb339e54de481c532062dd143bfb33a61))
* **MongoBinaryDownloadUrl:** add support for "arch/manjaro" (ubuntu workaround) ([21449d6](https://github.com/nodkz/mongodb-memory-server/commit/21449d64e53204cb60b43451be5ed551420a0af3))
* **MongoBinaryDownloadUrl:** refactor getUbuntuVersionString ([fc08c25](https://github.com/nodkz/mongodb-memory-server/commit/fc08c25d95964cffd6eee83037d60b228c38e2a4))
* **MongoBinaryDownloadUrl:** remove function "getMintVersionString" ([d66e28a](https://github.com/nodkz/mongodb-memory-server/commit/d66e28ade0eeeaf3bc9b8bcc276c9e560920d439))


### Fixes

* **getos:** add lsb-release file pattern to regex ([0cc7dd5](https://github.com/nodkz/mongodb-memory-server/commit/0cc7dd5e8e05b223a7ed3231b36f5dd46efe0364))
* **getos:** add tests for "parseOS" and "parseLSB" ([6cdf482](https://github.com/nodkz/mongodb-memory-server/commit/6cdf4823341446c4b7c2f1ed2b97c03992ca29ea))
* **getos:** tryFirstReleaseFile: simplify file match ([7a46fac](https://github.com/nodkz/mongodb-memory-server/commit/7a46fac70f3a1c8b398d4c9d6bc07499a84f7343))


### Refactor

* **MongoBinaryDownloadUrl:** add helper function for regex de-duplication ([3d96e5e](https://github.com/nodkz/mongodb-memory-server/commit/3d96e5effbb0fced5c408633623fb8d360659494))

## [7.0.0-beta.15](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.14...v7.0.0-beta.15) (2021-02-10)


### Features

* **lockfile:** add custom lockfile implementation ([e6a2237](https://github.com/nodkz/mongodb-memory-server/commit/e6a223713277f6f3eae2fc6f0d620f3ded04b8bb))


### Dependencies

* **eslint:** upgrade to 7.18.0 ([6dc0b75](https://github.com/nodkz/mongodb-memory-server/commit/6dc0b751f26d2bc2e32f5e703b94a6cbb9c29c81))
* **jest:** upgrade to 26.6.3 ([8adf360](https://github.com/nodkz/mongodb-memory-server/commit/8adf3600180480e1f83d8544214224d0cd7ac504))
* **ts-jest:** upgrade to 26.4.4 ([b8f1fae](https://github.com/nodkz/mongodb-memory-server/commit/b8f1fae86b48f8be93783335ebff9b66840f0084))
* **typescript:** upgrade to 4.1.3 ([30ea057](https://github.com/nodkz/mongodb-memory-server/commit/30ea057253c69b00cdbcb62810004b78ce35b94d))


### Fixes

* **MongoBinary:** add more logs ([e980a79](https://github.com/nodkz/mongodb-memory-server/commit/e980a795a39c8fcaf17e5f8048c032d64852329b)), closes [#434](https://github.com/nodkz/mongodb-memory-server/issues/434)
* **MongoInstance:** add more logs ([e8d2d4b](https://github.com/nodkz/mongodb-memory-server/commit/e8d2d4bae36f424233d9d877c697172f356d7e1c)), closes [#434](https://github.com/nodkz/mongodb-memory-server/issues/434)
* **MongoMemoryReplSet:** add more logs ([41a0be0](https://github.com/nodkz/mongodb-memory-server/commit/41a0be0b3784b4326b8c46fa3c7c44e888a140b4)), closes [#434](https://github.com/nodkz/mongodb-memory-server/issues/434)
* **MongoMemoryServer:** add more logs ([9d12b04](https://github.com/nodkz/mongodb-memory-server/commit/9d12b041ff42557da53fc5a6803958e34077bfd7)), closes [#434](https://github.com/nodkz/mongodb-memory-server/issues/434)


### Style

* **lockfile:** add more commentation ([6d4576a](https://github.com/nodkz/mongodb-memory-server/commit/6d4576ae64ba92526854836ed41624f8f05743a8))
* **lockfile.test:** increase timeouts ([c541b0e](https://github.com/nodkz/mongodb-memory-server/commit/c541b0e83989d6513b334f0e57f4d05035d37878))

## [7.0.0-beta.14](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.13...v7.0.0-beta.14) (2021-01-20)


### Fixes

* "infomation" to "information" ([da6c89d](https://github.com/nodkz/mongodb-memory-server/commit/da6c89d615f7eba3f083419f69f357eec5a53a21)), closes [#424](https://github.com/nodkz/mongodb-memory-server/issues/424)
* "unkown" to "unknown" ([798b0db](https://github.com/nodkz/mongodb-memory-server/commit/798b0db03c547a5b1b680d28d8a942e6ba4770b6)), closes [#424](https://github.com/nodkz/mongodb-memory-server/issues/424)
* **MongoMemoryReplSet:** update when "cleanup" is run and added ([836dc9c](https://github.com/nodkz/mongodb-memory-server/commit/836dc9c5bb162052375b957aec97cb16b0c66759))
* **MongoMemoryServer:** stop: return "false" if already stopped ([b3c868e](https://github.com/nodkz/mongodb-memory-server/commit/b3c868e4b04281d4f4ca98d88af6ca8899da4a31))


### Style

* **MongoBinaryDownloadUrl:** "Debain" to "Debian" ([1879e4b](https://github.com/nodkz/mongodb-memory-server/commit/1879e4bb1241db4fae1a794895fd042cb18fb501)), closes [#424](https://github.com/nodkz/mongodb-memory-server/issues/424)

## [7.0.0-beta.13](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.12...v7.0.0-beta.13) (2021-01-13)


### Fixes

* **MongoBinaryDownloadUrl:** handle Debian "testing" release ([#430](https://github.com/nodkz/mongodb-memory-server/issues/430)) ([9c2c834](https://github.com/nodkz/mongodb-memory-server/commit/9c2c834bfc436ce86623e0e8b9f0d0e92fce452e))

## [7.0.0-beta.12](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.11...v7.0.0-beta.12) (2020-12-16)


### ⚠ BREAKING CHANGES

* **MongoInstance:** remove function "MongoInstance.getPid", replace with "MongoInstance.childProcess?.pid"

### Features

* **MongoInstance:** remove function "getPid" ([f40da9a](https://github.com/nodkz/mongodb-memory-server/commit/f40da9ac167ba0da65459687c5cfcc990d07a9b0))


### Fixes

* **MongoMemoryReplSet:** remove unnecessary default to empty array ([2035845](https://github.com/nodkz/mongodb-memory-server/commit/203584526ff4b76f7998dfa12a182b50a206bf28))


### Style

* **MongoMemoryReplSet:** remove commented-out case ([8e3ae46](https://github.com/nodkz/mongodb-memory-server/commit/8e3ae46b8f13aaea1ac0e1eac0c1c6f25e484e38))
* **MongoMemoryReplSet:** remove TODO ([5645a87](https://github.com/nodkz/mongodb-memory-server/commit/5645a8750d0da6cb31425820616d43e234eb4c37)), closes [#392](https://github.com/nodkz/mongodb-memory-server/issues/392)


### Refactor

* **MongoBinary:** getSystemPath: return "undefined" instead of empty string ([10039f9](https://github.com/nodkz/mongodb-memory-server/commit/10039f99ceea0321ddfa8a42e5039059cfeba6c4))
* **MongoBinary:** remove unused interface "MongoBinaryCache" ([025df2e](https://github.com/nodkz/mongodb-memory-server/commit/025df2ea32b0b4233c6d2be57646570311c21139))

## [7.0.0-beta.11](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.10...v7.0.0-beta.11) (2020-11-11)


### Features

* remove cross-spawn ([c67ee8f](https://github.com/nodkz/mongodb-memory-server/commit/c67ee8f9330ade069dd00f9d49dd0f132f908048))


### Style

* **MongoInstance:** _launchKiller: remove commented-out code ([132917f](https://github.com/nodkz/mongodb-memory-server/commit/132917fac63745b351dfd73eb30f7f54962ddf37))

## [7.0.0-beta.10](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.9...v7.0.0-beta.10) (2020-11-06)


### ⚠ BREAKING CHANGES

* **MongoBinary:** remove function "MongoBinary.getCachePath", replace with "MongoBinary.cache.get"
* **MongoBinaryDownload:** remove "MongoBinaryDownload.locationExists", replace with "utils.pathExists"
* **MongoBinary:** remove value "LATEST_VERSION" in favor of using resolveConfig Value "VERSION"
* **resolveConfig:** removing alias "reInitializePackageJson", replace with "findPackageJson"

### Features

* **MongoBinary:** remove function "getCachePath" ([af164c1](https://github.com/nodkz/mongodb-memory-server/commit/af164c19007699ec79a9077d9ac7409e79c6f651))
* **MongoBinary:** remove value "LATEST_VERSION" ([22c6dfd](https://github.com/nodkz/mongodb-memory-server/commit/22c6dfd1a710cda5cf465c590f4947c916de46c0))
* **MongoBinaryDownload:** remove function "locationExists" ([0ba071a](https://github.com/nodkz/mongodb-memory-server/commit/0ba071abfac93d4abe016ad0ed7c9e3a5235a28f))
* **MongoBinaryDownload:** startDownload: add check that the downloadDir has sufficient permissions ([310cdae](https://github.com/nodkz/mongodb-memory-server/commit/310cdae9299b505b32cd9f2d633ab72119480022))
* **MongoInstance:** run: add check that the mongoBinary has sufficient permissions ([d9c1019](https://github.com/nodkz/mongodb-memory-server/commit/d9c101937bd3ad1af99ec32c0a3375246df3cafc))
* **resolveConfig:** add enum for all resolveConfig Variables ([7bd9160](https://github.com/nodkz/mongodb-memory-server/commit/7bd91609393f8151529b6827ef8c2f1a5be2fadb))
* **resolveConfig:** remove alias "reInitializePackageJson" ([acc4b0a](https://github.com/nodkz/mongodb-memory-server/commit/acc4b0a41f70cee240a4c062140cd14e694414ab))
* **utils:** add function "pathExists" ([4114d27](https://github.com/nodkz/mongodb-memory-server/commit/4114d27d73a6b34a7b59edc1b86d22723061ec89))


### Refactor

* **getos:** replace "promisify" with "fs.promises" ([60e184b](https://github.com/nodkz/mongodb-memory-server/commit/60e184bb294031e151a40cf668ebff2fd09734ed))
* **MongoBinary:** replace "promisify" with "fs.promises" ([5a769f3](https://github.com/nodkz/mongodb-memory-server/commit/5a769f3fbd32b1be3e6b1413d07362047838f995))
* **MongoBinaryDownload:** replace "existsSync" with "utils.pathExists" ([d8de1cc](https://github.com/nodkz/mongodb-memory-server/commit/d8de1cc8d0601f48146d7ae34a00af058a87e5db))
* **MongoBinaryDownload:** replace "promisify" with "fs.promises" ([911a922](https://github.com/nodkz/mongodb-memory-server/commit/911a922c92e8cf177604f33813adfb6fb98c694c))
* **resolveConfig:** remove unnecessary optional chain ([1c6578d](https://github.com/nodkz/mongodb-memory-server/commit/1c6578d22a311c686ba49eec2ad8afb856eca4a4))
* **utils:** assertion: remove error code from default error ([bbad7c4](https://github.com/nodkz/mongodb-memory-server/commit/bbad7c4d7036aa608262b7ee2fd41d1dedd4e6dc))


### Fixes

* **getos:** replace "not undefined" with "envToBool" ([7fde8be](https://github.com/nodkz/mongodb-memory-server/commit/7fde8beec831edf5d5f6cb2c03646ab182a7ccbe))
* **MongoBinary:** getSystemPath: also check for execute permission ([a501842](https://github.com/nodkz/mongodb-memory-server/commit/a501842e6c64575542cf976628f66a775a3c7d39))


### Style

* **README:** environment variables: add legend for booleans ([17b1937](https://github.com/nodkz/mongodb-memory-server/commit/17b193714870427878058da2ee353808179545c0))
* rename import "promises" (from fs) to "fspromises" everywhere ([f876670](https://github.com/nodkz/mongodb-memory-server/commit/f876670aaecc3b74ca4a85a80d804c137a40d572))
* **eslintrc:** add environment "node" ([8f3ed19](https://github.com/nodkz/mongodb-memory-server/commit/8f3ed194f0a2a19c551be076c99ff2af763fe9f5))
* **eslintrc:** add rule "padding-line-between-statements" for "function" & "class" ([6a0ebd4](https://github.com/nodkz/mongodb-memory-server/commit/6a0ebd43d63785c3457487d2d9834950adf08b30))
* **eslintrc:** add rule "padding-line-between-statements" for "if" ([3efdb47](https://github.com/nodkz/mongodb-memory-server/commit/3efdb4770b27b996ad75f6b645d99369ebb672f4))
* **eslintrc:** add rule "padding-line-between-statements" for "import" ([3bfc4ef](https://github.com/nodkz/mongodb-memory-server/commit/3bfc4ef8783557b2e451093f95be8b03c5d1696a))
* **eslintrc:** add rule "padding-line-between-statements" for "return" ([05b02d2](https://github.com/nodkz/mongodb-memory-server/commit/05b02d231eb70d77e87005943632539a7ddeec49))
* **eslintrc:** comma-dangle: change "functions" to "never" ([0bf9c3e](https://github.com/nodkz/mongodb-memory-server/commit/0bf9c3e5935ef493877110607ca2e4904942df9e))
* **eslintrc:** set rule "no-else-return" to "warn" ([cb242e9](https://github.com/nodkz/mongodb-memory-server/commit/cb242e97e738652aba493e80850dfd39059c2dd8))
* **eslintrc:** set rule "no-unused-expressions" to warn ([d08b293](https://github.com/nodkz/mongodb-memory-server/commit/d08b293f9be929fe159951427a72c030c0e776c1))
* **MongoBinaryDownload:** makeMD5check: add more tsdoc ([911a09a](https://github.com/nodkz/mongodb-memory-server/commit/911a09a141143bf4fa6190b3b52dc47594ac2af3))
* **README:** fix missing "MONGOMS_" on "SKIP_OS_RELEASE" ([e352495](https://github.com/nodkz/mongodb-memory-server/commit/e35249523a275fe7b83a31420aa3c0210349cb60))
* **utils:** add more tsdoc to "statPath" & "pathExists" ([3b36143](https://github.com/nodkz/mongodb-memory-server/commit/3b36143c243497118d4f4fc757bf42305bd36b79))

## [7.0.0-beta.9](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.8...v7.0.0-beta.9) (2020-11-02)


### Dependencies

* upgrade subdependencies (yarn upgrade) ([b7030ae](https://github.com/nodkz/mongodb-memory-server/commit/b7030ae4bdabb7ce64a816c8afe95b0807a44dbe))
* **eslint-config-prettier:** upgrade to 6.15.0 ([7bbcc33](https://github.com/nodkz/mongodb-memory-server/commit/7bbcc3355f441549f98f7560a308f78e9ba603de))
* **lint-staged:** upgrade to 10.5.1 ([6339aaa](https://github.com/nodkz/mongodb-memory-server/commit/6339aaa375a37a3c70830f69acd361e625a17859))
* **semantic-release:** upgrade to 17.2.2 ([1cb1fec](https://github.com/nodkz/mongodb-memory-server/commit/1cb1fecb0a8c3a37e4287df53d2b1db6bd67c565))
* allow "^" range for all type packages ([37c01d8](https://github.com/nodkz/mongodb-memory-server/commit/37c01d8bf7d0bf7668e56bdfe4f8e9d46e308d8d))
* pin all non-types devDependencies ([b647153](https://github.com/nodkz/mongodb-memory-server/commit/b647153a1a05295b55eddc5576ab9c52ba92ad0e))
* remove devDependency "mongodb" ([dbd82a7](https://github.com/nodkz/mongodb-memory-server/commit/dbd82a7d4b7ca831c4c4e4292b2a239e54b112da))

## [7.0.0-beta.8](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.7...v7.0.0-beta.8) (2020-11-01)


### Features

* **MongoBinaryDownloadUrl:** allow overwrite of archiveName ([c19d216](https://github.com/nodkz/mongodb-memory-server/commit/c19d2167a88977a67c886f651bf0a70dcf51a806)), closes [#295](https://github.com/nodkz/mongodb-memory-server/issues/295)


### Style

* **README:** update "packages/*/README.md" to new bages ([3acd086](https://github.com/nodkz/mongodb-memory-server/commit/3acd0866831ddff5f1c3deb5e96a7cc97be56ace))


### Fixes

* **MongoBinaryDownloadUrl:** add case for Linux Mint 20 ([01a6bc6](https://github.com/nodkz/mongodb-memory-server/commit/01a6bc63f0e13a4528ee39ccae64390a8de48582))
* **MongoBinaryDownloadUrl:** detect "linuxmint" and "linux mint" as linux mint ([fda4f72](https://github.com/nodkz/mongodb-memory-server/commit/fda4f7224d156680ac68c743c5a5a963070171dd)), closes [#403](https://github.com/nodkz/mongodb-memory-server/issues/403)
* **MongoBinaryDownloadUrl:** fix win32 download generation ([d62b489](https://github.com/nodkz/mongodb-memory-server/commit/d62b4891a01fe40b5f00c21ee02f08b24a55d80c)), closes [#399](https://github.com/nodkz/mongodb-memory-server/issues/399)
* **MongoBinaryDownloadUrl:** getArchiveName: throw error if platform is unknown ([9fc358b](https://github.com/nodkz/mongodb-memory-server/commit/9fc358b9b2997333b2121eabff16e91e543f3897))
* **MongoInstance:** handle code "12" on windows ([718aed7](https://github.com/nodkz/mongodb-memory-server/commit/718aed7281c25c7198ea068a87b06924d77de8ba)), closes [#411](https://github.com/nodkz/mongodb-memory-server/issues/411)


### Refactor

* **MongoBinaryDownloadUrl:** minify "getUbuntuVersionString" ([04b0ee9](https://github.com/nodkz/mongodb-memory-server/commit/04b0ee9c5685107a1db67a6edc19bb3b2762bbc4))
* **MongoBinaryDownloadUrl:** remove "async" where not needed ([7970fbb](https://github.com/nodkz/mongodb-memory-server/commit/7970fbbaa8a32979a9634765f726419a00bd385c))
* **MongoBinaryDownloadUrl:** translatePlatform: change default error ([61685e0](https://github.com/nodkz/mongodb-memory-server/commit/61685e04c14a45c410a8c258be58f2ed7962820a))
* **MongoMemoryReplSet:** rename "MongoMemoryReplSetEventEnum" to "MongoMemoryReplSetEvents" ([bfd5441](https://github.com/nodkz/mongodb-memory-server/commit/bfd5441f0e18a38e324e8c49a4adaa05adfdf3ec))
* **MongoMemoryReplSet:** rename "MongoMemoryReplSetStateEnum" to "MongoMemoryReplSetStates" ([c02e21d](https://github.com/nodkz/mongodb-memory-server/commit/c02e21d36be0439bc1ea19f2c9cd6733b4fd1074))
* **MongoMemoryReplSet:** setup proper events ([644a335](https://github.com/nodkz/mongodb-memory-server/commit/644a335089cf6a078a055a6780f4cf48630e6506))
* **MongoMemoryServer:** rename "MongoMemoryServerEventEnum" to "MongoMemoryServerEvents" ([251c7ed](https://github.com/nodkz/mongodb-memory-server/commit/251c7ede0dd56e7ac0f98f75c278066ea5333272))
* **MongoMemoryServer:** rename "MongoMemoryServerStateEnum" to "MongoMemoryServerStates" ([139d3fd](https://github.com/nodkz/mongodb-memory-server/commit/139d3fd9c1175c0abc66cc1b0c7c49738f231658))

## [7.0.0-beta.7](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.6...v7.0.0-beta.7) (2020-10-27)


### Fixes

* broken build (Cannot find module 'mongodb-memory-server') ([3c7d102](https://github.com/nodkz/mongodb-memory-server/commit/3c7d1027137257913b4648525a51703a95f07ac4))

## [7.0.0-beta.6](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.5...v7.0.0-beta.6) (2020-10-27)


### ⚠ BREAKING CHANGES

* **MongoMemoryReplSet:** not resetting "servers" after calling "stop" on an replSet can be breaking for some cases
* **MongoMemoryServer:** allow the re-use of instances & dbPath's meant to change some things internally, which could be breaking

### Features

* **db_util:** rename function "getUriBase" to "uriTemplate" ([c888b95](https://github.com/nodkz/mongodb-memory-server/commit/c888b952891fc6e5e54d8ac29994fb8e679b9f59)), closes [#404](https://github.com/nodkz/mongodb-memory-server/issues/404)
* **MongoMemoryReplSet:** add basic "createAuth" support ([6c118a9](https://github.com/nodkz/mongodb-memory-server/commit/6c118a900d9daf272898d0f39134f7919499f299))
* **MongoMemoryReplSet:** allow re-use of instances & dbPath ([3d64705](https://github.com/nodkz/mongodb-memory-server/commit/3d64705c7406a0eb7e0ef7f1b9dbeb7685050494))
* **MongoMemoryReplSet:** getUri: allow executing while state is "init" ([b3ebac2](https://github.com/nodkz/mongodb-memory-server/commit/b3ebac256006a5339d578f23d70f5f00d2be57d0))
* **MongoMemoryServer:** add (protected) function "getNewPort" ([662a69b](https://github.com/nodkz/mongodb-memory-server/commit/662a69b9b60b0c29a76cb1ee6f24eade095eb7a7))
* **MongoMemoryServer:** add ability to automatically create auth ([d5bf77a](https://github.com/nodkz/mongodb-memory-server/commit/d5bf77a16fe8cf4ca43383c5c371e218a487f314)), closes [#299](https://github.com/nodkz/mongodb-memory-server/issues/299)
* **MongoMemoryServer:** add ability to force same port on restart ([18c77e2](https://github.com/nodkz/mongodb-memory-server/commit/18c77e27cb4ed80514a3c4e893711a933c9bfe8a))
* **MongoMemoryServer:** add function "getStartOptions" ([f057ea7](https://github.com/nodkz/mongodb-memory-server/commit/f057ea765785f4acf094f7df2f799fb11acee9fd))
* **MongoMemoryServer:** allow re-use of instances & dbPath ([e2ae879](https://github.com/nodkz/mongodb-memory-server/commit/e2ae87961fa817e1d885487c9edc8ed89ac82260))


### Fixes

* **MongoInstance:** kill: ensure only error ignored is the actual error to be ignored ([5e377fa](https://github.com/nodkz/mongodb-memory-server/commit/5e377fad20604a4fde89c3aee717b3e19123092b))
* **MongoInstance:** run: reset all booleans on ([188d333](https://github.com/nodkz/mongodb-memory-server/commit/188d3330fead506e66250d761dd9c53326b97f92))
* **MongoMemoryReplSet:** _waitForPrimary: check if instance is already primary ([8f65696](https://github.com/nodkz/mongodb-memory-server/commit/8f6569646cf8a8953a3db00f2488244b86152403))
* **MongoMemoryReplSet:** initAllServers: execute "stateChange" with "init" ([28bcf5b](https://github.com/nodkz/mongodb-memory-server/commit/28bcf5bd26b7950a14fd4c5f17688320038b38f9))
* **utils:** killProcess: check if the childProcess PID is still alive ([96c30de](https://github.com/nodkz/mongodb-memory-server/commit/96c30deee12e295738b93e28fad056e24ccaf40e))


### Refactor

* **MongoMemoryReplSet:** _initReplSet: reassign "adminDb" ([19ae688](https://github.com/nodkz/mongodb-memory-server/commit/19ae688d9ccc623ac42d032fada381268c10df93))
* **MongoMemoryServer:** ensureInstance: move "return instanceInfo" into case "running" ([4214aa5](https://github.com/nodkz/mongodb-memory-server/commit/4214aa56362d5cad139acf2c134f410ddb765aba))
* **MongoMemoryServer:** remove destructuring of "promises" ([a828506](https://github.com/nodkz/mongodb-memory-server/commit/a828506ec749ebb9b0d081a77cff0036d97e5e41))
* **MongoMemoryServer:** start: check "state" instead of "instanceInfo" ([4fd1ede](https://github.com/nodkz/mongodb-memory-server/commit/4fd1ede502acb67be052957b3907eb1f5a57212f))
* remove file "types.ts" ([23cdc65](https://github.com/nodkz/mongodb-memory-server/commit/23cdc656562e662780ae5b314d2da3243116e800)), closes [#406](https://github.com/nodkz/mongodb-memory-server/issues/406)
* rename "-test.ts" to ".test.ts" ([deb0098](https://github.com/nodkz/mongodb-memory-server/commit/deb00984281d3e7e7e37fb7bd0358390176d6a79))
* rename file "db_util" to "utils" ([f3df9c8](https://github.com/nodkz/mongodb-memory-server/commit/f3df9c81b4b614ff6cac15579051fd11921c09ce))
* rename file "postinstall-helper" to "postinstallHelper" ([fdf2d09](https://github.com/nodkz/mongodb-memory-server/commit/fdf2d09a33a3d8ed893f0ba01e0022814f3b2089))
* rename file "resolve-config" to "resolveConfig" ([7ee646c](https://github.com/nodkz/mongodb-memory-server/commit/7ee646c2479e8237c0c14096a8ac026d45a8c96e))
* **db_util:** uriTemplate: change "query" to be an string-array ([8dffa64](https://github.com/nodkz/mongodb-memory-server/commit/8dffa64ee4d56523cefd993b1158d2a9e224cd8a))
* unify interface names (remove "T") ([78a78cd](https://github.com/nodkz/mongodb-memory-server/commit/78a78cdc8c1d67d780aaca064169b8324d04d0c3)), closes [#395](https://github.com/nodkz/mongodb-memory-server/issues/395)
* **MongoBinary:** change "cache" to be an Map ([74d30a0](https://github.com/nodkz/mongodb-memory-server/commit/74d30a0244f1d4797129dc9b577ef50d5aae8d41)), closes [#374](https://github.com/nodkz/mongodb-memory-server/issues/374)


### Style

* **MongoBinaryDownload:** rename interface "DownloadProgress" to "MongoBinaryDownloadProgress" ([2bad87c](https://github.com/nodkz/mongodb-memory-server/commit/2bad87c18ab1bf4fc2c6a723af5893fa57de747f))
* **MongoInstance:** add TODO comments ([5e320ca](https://github.com/nodkz/mongodb-memory-server/commit/5e320cad6cd277e0e87da7beb4dd35d3bb92e5c5))
* **MongoMemoryReplSet:** _initReplSet: change logs to be more clear ([561c883](https://github.com/nodkz/mongodb-memory-server/commit/561c8832c5504382d6b70b9a8ff3fa581cbc46e8))
* **MongoMemoryReplSet:** _initReplSet: remove "await" from non-Promise functions ([846f969](https://github.com/nodkz/mongodb-memory-server/commit/846f969893586050476383622cbed412608d69e9))

## [7.0.0-beta.5](https://github.com/nodkz/mongodb-memory-server/compare/v7.0.0-beta.4...v7.0.0-beta.5) (2020-10-12)


### ⚠ BREAKING CHANGES

* **MongoMemoryReplSet:** change "getUri" to be sync (dosnt wait until running anymore)
* **MongoMemoryReplSet:** remove option "oplogSize", replace with ".replSetOpts.args.push('--oplogSize', '1')"
* **MongoMemoryReplSet:** remove function "getDbName", replace with ".opts.replSet.dbName"
* **MongoMemoryReplSet:** removing function "getConnectionString" could break some code
* **MongoMemoryReplSet:** removing "async" / modifing return type "Promise<string>" can break code

### Features

* change package "mongodb" to be non-optional ([2b14552](https://github.com/nodkz/mongodb-memory-server/commit/2b14552beb5f2bdb1dd1978c8cf391d25adba4b1))
* **db_util:** add function "ensureAsync" ([971b02d](https://github.com/nodkz/mongodb-memory-server/commit/971b02d07453b46dd37dace8d91efd74b20c3575))
* **MongoInstance:** add value "isReplSet" ([3ba31e2](https://github.com/nodkz/mongodb-memory-server/commit/3ba31e249c6ea4cd883979a1a5799863bf9ae971))
* **MongoInstance:** graceful ReplSet shutdown ([017239c](https://github.com/nodkz/mongodb-memory-server/commit/017239c953fd44018855a55d417bfc4573c9f684))
* **MongoMemoryReplSet:** add error if replSet count is 0 or lower ([0202e8f](https://github.com/nodkz/mongodb-memory-server/commit/0202e8fefb835fb256e8c1bd4573e15f8ac5c6f5))
* **MongoMemoryReplSet:** add getter "state" ([65135a8](https://github.com/nodkz/mongodb-memory-server/commit/65135a83a27a932937fe3989e1c56f8c33ea5f5c))
* **MongoMemoryReplSet:** remove function "getConnectionString" ([dbe844e](https://github.com/nodkz/mongodb-memory-server/commit/dbe844e8f972925391ba9edd983fc3043bc39efa))
* **MongoMemoryReplSet:** remove function "getDbName" ([6ebafbd](https://github.com/nodkz/mongodb-memory-server/commit/6ebafbd762c208f60bc9132773edfee07e6d2821))
* **MongoMemoryReplSet:** remove option "autoStart" ([90ed578](https://github.com/nodkz/mongodb-memory-server/commit/90ed57865db4f629d0efd00df5ac0ccbf1fda65a))
* **MongoMemoryReplSet:** remove option "oplogSize" ([07937e2](https://github.com/nodkz/mongodb-memory-server/commit/07937e2fd8ebce9759f4a837a6b013574488b7eb))
* **MongoMemoryReplSet:** rename "opts.*" to "*Opts" & add getters & setters ([c701f09](https://github.com/nodkz/mongodb-memory-server/commit/c701f0980762b21761361ef485b6282569b9741a))
* **MongoMemoryServer:** add function "create" ([6dcb12a](https://github.com/nodkz/mongodb-memory-server/commit/6dcb12ad4a7f96739b0e11e13e3fb9c473633b11))


### Style

* **MongoMemoryReplSet:** add more tsdoc ([6b60a71](https://github.com/nodkz/mongodb-memory-server/commit/6b60a71e0c9c81197f2a42b59e8b6f96660cf410))
* remove "uri" value when only used once ([150494e](https://github.com/nodkz/mongodb-memory-server/commit/150494e8d736d1cb61fc5fdd9306215a599f0b1d))
* **db_util:** add link on why "ensureAsync" is needed ([412e615](https://github.com/nodkz/mongodb-memory-server/commit/412e61589077b8f2ebcc7d046466ffc652a4fe32))
* **MongoMemoryReplSet:** add log to "stop" ([d3dff26](https://github.com/nodkz/mongodb-memory-server/commit/d3dff2605ee0837a3d655a0f31096edc5e33cb7c))
* **MongoMemoryReplSet:** add more logs ([a3a911f](https://github.com/nodkz/mongodb-memory-server/commit/a3a911fda1e083cd4964e57ae34dbe74b7f3a721))
* **MongoMemoryReplSet:** replace templating string with normal ([9add2bc](https://github.com/nodkz/mongodb-memory-server/commit/9add2bcf983e2b7c7c981753c9ca447db49ea2eb))


### Dependencies

* **uuid:** add "^" ([e12396e](https://github.com/nodkz/mongodb-memory-server/commit/e12396eb8368358c69d2d8c23e7d787a42b669db))


### Refactor

* **MongoMemoryReplSet:** _initReplSet: directly use db "admin" ([a335500](https://github.com/nodkz/mongodb-memory-server/commit/a33550022244b023c21d16e667c5c8697b1c22b8))
* **MongoMemoryReplSet:** _initReplSet: remove redundant object assignment ([8e6e312](https://github.com/nodkz/mongodb-memory-server/commit/8e6e312dfc2b9e430854f9868ee68f9cfdfdb8d8))
* **MongoMemoryReplSet:** _initReplSet: rename "conn" to "con" ([335780e](https://github.com/nodkz/mongodb-memory-server/commit/335780e295f0abe7f6d0d7f67aaf1f2e8f0ac8ba))
* **MongoMemoryReplSet:** _waitForPrimary: remove value "timeoutPromise" ([18b9a58](https://github.com/nodkz/mongodb-memory-server/commit/18b9a587b2f6b1185d6253f549abda380f018dec))
* **MongoMemoryReplSet:** add function "stateChange" ([3c3d6fb](https://github.com/nodkz/mongodb-memory-server/commit/3c3d6fb6abe094ecf26bb55af1140041134eed27))
* **MongoMemoryReplSet:** change "_initReplSet" to be "protected" ([f46d113](https://github.com/nodkz/mongodb-memory-server/commit/f46d113497ea0c8685439abae7e3467b25ff8498))
* **MongoMemoryReplSet:** change "_initServer" to be "protected" ([4c32f45](https://github.com/nodkz/mongodb-memory-server/commit/4c32f458bb2957a6a33e783c990eaffe4b77637e))
* **MongoMemoryReplSet:** change "_state" to be "protected" ([415fc8f](https://github.com/nodkz/mongodb-memory-server/commit/415fc8fce60b8ca12dc1d352eddfa304ce77a70b))
* **MongoMemoryReplSet:** change "_waitForPrimary" to be "protected" ([d0d62e2](https://github.com/nodkz/mongodb-memory-server/commit/d0d62e2b9c4824ac6b238d97889d9bab96057bf6))
* **MongoMemoryReplSet:** change "getInstanceOpts" to be "protected" ([e954806](https://github.com/nodkz/mongodb-memory-server/commit/e9548062793340c78ff160afb41c7e3c9229a2d9))
* **MongoMemoryReplSet:** change "getUri" to be sync ([13f3f1d](https://github.com/nodkz/mongodb-memory-server/commit/13f3f1d3ee636b20005f233cb6f50530885659fc))
* **MongoMemoryReplSet:** change "if not state 'stopped'" to switch ([df1af0c](https://github.com/nodkz/mongodb-memory-server/commit/df1af0cac6690ccf5ac3d8b946a13f75d581ca62))
* **MongoMemoryReplSet:** change if-error to "assertion" ([179bdbb](https://github.com/nodkz/mongodb-memory-server/commit/179bdbb417548ce42b02d31c1e545c96595f0a56))
* **MongoMemoryReplSet:** improve "start" ([c2311cb](https://github.com/nodkz/mongodb-memory-server/commit/c2311cb4601404f08175f166d4c5114bca3f1d35))
* **MongoMemoryReplSet:** refactor "_state" into an enum ([e3d4678](https://github.com/nodkz/mongodb-memory-server/commit/e3d4678d34d7165a9726866234a1e25b898dd338))
* **MongoMemoryReplSet:** refactor multiple "if" into one switch ([8b8a609](https://github.com/nodkz/mongodb-memory-server/commit/8b8a6095f415f4daa5761f25c998bd594b0e3f4d))
* **MongoMemoryReplSet:** remove "?" from "MongoMemoryReplSetOptsT" ([138e21d](https://github.com/nodkz/mongodb-memory-server/commit/138e21d6433bfb431243ed9c0c83cef6ec71adfd))
* **MongoMemoryReplSet:** remove "async" from "getDbName" ([2775b4f](https://github.com/nodkz/mongodb-memory-server/commit/2775b4fcc6afcaab99414faf7100021f4047629e))
* **MongoMemoryReplSet:** remove commented out HACK ([1ad5bdc](https://github.com/nodkz/mongodb-memory-server/commit/1ad5bdc879a8f90620ba572e9ec9ab5ca686744c))
* **MongoMemoryReplSet:** remove dynamic import "mongodb" ([fb958ae](https://github.com/nodkz/mongodb-memory-server/commit/fb958aef5a604f636956c2d8656a45ade9595895))
* **MongoMemoryReplSet:** shorten constructor ([e17762d](https://github.com/nodkz/mongodb-memory-server/commit/e17762db2ffbbfa77aef0de24ba6752c0326401a))
* **MongoMemoryReplSet:** small improvements ([9b17925](https://github.com/nodkz/mongodb-memory-server/commit/9b179254099f3d07607f3fbb97b627ea0c323b5f))
* **MongoMemoryReplSet:** waitUntilRunning: shorten function ([0fc27d6](https://github.com/nodkz/mongodb-memory-server/commit/0fc27d6b308a34ab27ae71e113872999549d098c))
* **replset-single:** shorten "state errors" ([2559117](https://github.com/nodkz/mongodb-memory-server/commit/2559117b69c0476b9835b87e1f1cbd702f69e863))


### Fixes

* **MongoMemoryReplSet:** _initReplSet: throw error if "this.servers.length" is "<= 0" ([019b118](https://github.com/nodkz/mongodb-memory-server/commit/019b1188b8f77bcbf47aced7e07aba67336ec3f4))
* **MongoMemoryReplSet:** "getUri" now uses "waitUntilRunning" ([18428d5](https://github.com/nodkz/mongodb-memory-server/commit/18428d5a7f46fdf47f88154f833fcf896d4c3bb5))
* **MongoMemoryReplSet:** change "_waitForPrimary" timout message to be an error ([89c8af6](https://github.com/nodkz/mongodb-memory-server/commit/89c8af6399b81a42bf38a14418aee967d4559d9c))
* **MongoMemoryReplSet:** ensure "start" is async ([765b5b1](https://github.com/nodkz/mongodb-memory-server/commit/765b5b13ded44c68d109552391d0581bbbdddf84))
* **MongoMemoryReplSet:** move "removeListener" before "_state" check ([60646eb](https://github.com/nodkz/mongodb-memory-server/commit/60646eb4829b0c09bf6b88ade4a55f010f8bca6f))
* **MongoMemoryReplSet:** register listener for event "beforeExit" inside "start" ([7859d6c](https://github.com/nodkz/mongodb-memory-server/commit/7859d6c60e47b6f1bbfb2a0c3a39ce417f200470))
* **MongoMemoryReplSet:** throw error if state is not "running" or "init" ([27f6215](https://github.com/nodkz/mongodb-memory-server/commit/27f62155c219ed4a8685c360dfa9bf822d62b38d))

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

## [6.9.6](https://github.com/nodkz/mongodb-memory-server/compare/v6.9.5...v6.9.6) (2021-03-08)


### Bug Fixes

* **dependencies:** allow patch versions ([237177b](https://github.com/nodkz/mongodb-memory-server/commit/237177b82baf11610cf695bca9f3a81d8cbfb51f)), closes [#433](https://github.com/nodkz/mongodb-memory-server/issues/433)

## [6.9.5](https://github.com/nodkz/mongodb-memory-server/compare/v6.9.4...v6.9.5) (2021-03-08)


### Bug Fixes

* **MongoBinaryDownloadUrl:** add support for ubuntu-arm64 ([c432e24](https://github.com/nodkz/mongodb-memory-server/commit/c432e24c9c28ee08b2995d3da32909996f6582c7)), closes [#443](https://github.com/nodkz/mongodb-memory-server/issues/443)

## [6.9.4](https://github.com/nodkz/mongodb-memory-server/compare/v6.9.3...v6.9.4) (2021-03-08)


### Bug Fixes

* **MongoBinaryDownloadUrl:** use debian92 for versions <4.2.0 ([7bb5097](https://github.com/nodkz/mongodb-memory-server/commit/7bb5097020502ff140e1e55176f997ab7fe11715)), closes [#448](https://github.com/nodkz/mongodb-memory-server/issues/448)

## [6.9.3](https://github.com/nodkz/mongodb-memory-server/compare/v6.9.2...v6.9.3) (2021-01-13)


### Bug Fixes

* **MongoBinaryDownloadUrl:** handle Debian "testing" release ([#430](https://github.com/nodkz/mongodb-memory-server/issues/430)) ([e4ffecf](https://github.com/nodkz/mongodb-memory-server/commit/e4ffecf1eb2ceb06931feb90bb3f7fbbe0a6237a))

## [6.9.2](https://github.com/nodkz/mongodb-memory-server/compare/v6.9.1...v6.9.2) (2020-10-09)


### Bug Fixes

* **MongoBinaryDownloadUrl:** add case for Linux Mint 20 ([01a6bc6](https://github.com/nodkz/mongodb-memory-server/commit/01a6bc63f0e13a4528ee39ccae64390a8de48582))
* **MongoBinaryDownloadUrl:** detect "linuxmint" and "linux mint" as linux mint ([fda4f72](https://github.com/nodkz/mongodb-memory-server/commit/fda4f7224d156680ac68c743c5a5a963070171dd)), closes [#403](https://github.com/nodkz/mongodb-memory-server/issues/403)

## [6.9.1](https://github.com/nodkz/mongodb-memory-server/compare/v6.9.0...v6.9.1) (2020-10-07)


### Bug Fixes

* **MongoBinaryDownloadUrl:** fix win32 download generation ([d62b489](https://github.com/nodkz/mongodb-memory-server/commit/d62b4891a01fe40b5f00c21ee02f08b24a55d80c)), closes [#399](https://github.com/nodkz/mongodb-memory-server/issues/399)

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
