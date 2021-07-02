---
id: migrate7
title: 'Migrate to version 7.0.0'
---

Here are the Important changes made for 7.0.0

:::info
This Guide is written for migration from the latest 6.x to 7.0.x
:::

## Requirement Changes

If using NodeJS below 12.22, package `rimraf` needs to be installed (when using cleanup with `force`)

## Breaking Changes

### no function other than start, create, ensureInstance will be starting anything

For 7.0.0, the only functions that start / wait for an starting instance will be `create`, `start` and `ensureInstance`

Example:

```ts
// this no longer works
const mongo = new MongoMemoryServer();
const uri = await getUri(); // ERROR: instance not started

// it is now
const mongo = await MongoMemoryServer.create();
const uri = getUri();
```

### getUri is no longer async

For 7.0.0, all `.getUri` are now sync, see [this change](#no-function-other-than-start-create-ensureinstance-will-be-starting-anything)

### new no longer automatically starts

Until 7.0.0, `new` (`constructor`) automatically started the instance, which is no longer the case, for this behaviour use `.create`, see [this change](#no-function-other-than-start-create-ensureinstance-will-be-starting-anything)

### mongod binaries storage path changed

`mongod` binary path changed from `basePath/version/mongod` to `basePath/mongod-arch-dist-version`  
This will make it easier to work with sharing the project folder (like host to docker)

:::note
This package will **not** delete the old binaries, these need to be manually deleted, see [storage paths](../api/config-options.md#download_dir) for where binaries are stored
:::

### getConnectionString got removed

Function `getConnectionString` got removed in favor of just `getUri`

### MongoInstance.waitPrimaryReady got removed

Function `MongoInstance.waitPrimaryReady` got removed, in favor of listening to event `instancePrimary`

### Functions that returned public values on classes got removed

Functions like `MongoMemoryServer.getInstanceInfo` got removed in favor of `MongoMemoryServer.instanceInfo` (readonly value)

These include:

- `MongoMemoryServer.getInstanceInfo` -> `MongoMemoryServer.instanceInfo` (readonly value)
- `MongoMemoryServer.getPort` -> `MongoMemoryServer.instanceInfo.port` (readonly value)
- `MongoMemoryServer.getDbPath` -> `MongoMemoryServer.instanceInfo.dbPath` (readonly value)
- `MongoMemoryServer.getDbName` -> `MongoMemoryServer.instanceInfo.dbName` (readonly value)
- `MongoMemoryReplSet.getDbName` -> `MongoMemoryReplSet.opts.replSet.db` (readonly value)
- `MongoInstance.getPid` -> `MongoInstance.mongodProcess.pid` (readonly value)

### Manager Class functions got unified

Manager-Classes got unified, these include `MongoMemoryServer`, `MongoMemoryReplSet`, `MongoInstance`  
This means that all of them have unified typings for `start`, `stop`, `create`, `getUri`, `cleanup`

This also includes function renames:

- (static) `MongoInstance.run` -> `MongoInstance.create`
- `MongoInstance.run` -> `MongoInstance.start`
- `MongoInstance.kill` -> `MongoInstance.stop`

### getUri by default does not include any dbName anymore

This was changed to allow mongodb and mongoose URI's to work at the same time (they slightly differ).

[See the code comment for more information](https://github.com/nodkz/mongodb-memory-server/blob/3624253f509a54cff04997943894b9eb7e7e64fe/packages/mongodb-memory-server-core/src/util/utils.ts#L13-L17)

## Non-Breaking changes / Additions

### Config Values are now collected in an enum

Config values like `DOWNLOAD_DIR` are now collected in an enum called `ResolveConfigVariables`, [see more here](../api/config-options.md)

### Config helper function "envName"

An helper function named `envName` is introduced into 7.0.0, which does:

```ts
// previously
process.env[ENV_CONFIG_PREFIX + ResolveConfigVariables.DOWNLOAD_DIR] = 'someValue';

// now
process.env(envName(ResolveConfigVariables.DOWNLOAD_DIR)) = 'someValue';
```

this does not only save space, but also provide direct auto-completion-suggestions for `ResolveConfigVariables`

### All Manager Classes are now extending EventEmitter

All Manager-Classes are now extending `EventEmitter`, which makes them easier to use and listen for changes

### Automatic Authentication creation

For 7.0.0 there is now Automatic Authentication created, which can be enabled by providing config option `auth` in the code

Example:

```ts
// This will create an Auth-enabled instance with default auth-values
const mongoServer = await MongoMemoryServer.create({
  auth: {}, // anything else than "undefined / null" will enable auth, can be explicitly disabled with "auth: { disable: true }"
  instance: {
    auth: true,
    storageEngine: 'wiredTiger',
  },
});
```

:::info
The Instance will not be restarted if the storage engine is `ephemeralForTest` because data will not persist across restarts<br/>
:::

For available Values look into either the source code or let intellisense show values

### Explicit & Implicit Cleanup

Cleanup behaviour can now be controlled, default is an `tmpDir` that will get automatically removed on instance-stop / process exit, if it is not an `tmpDir` then `.cleanup` needs to be manually called with `true` (force)  

If persistence between restarts is wanted (even if it is an `tmpDir`), then call `.stop` with `false` (`cleanup` for `tmpDir` will still be run on process exit)

### ReplSet's can now gracefully exit

Since Mongod ~4.2 replset's dont exit anymore on `SIGTERM` if they cannot step-down (no other instance to give primary to)  
In 7.0.0 this is now handled with mongodb command `replSetStepDown: 1, force: true`

### Linux Distribution Detection enhanced

For 7.0.0, the Linux Distribution Detection got enhanced, now preferring to use `/etc/upstream-release/lsb-release` instead of the `/etc/` ones, which enables based-on distributions to be easier mapped (and fallback correctly)

This mostly impacts Debian based distros and Ubuntu based distros

### ArchLinux got somewhat supported

Some reports said that the ubuntu binaries work on arch, so there is now an automatic fallback to ubuntu binaries (MongoDB still dosnt have binaries for arch)

### Runtime downloads can now be disabled or explicitly enabled

Version 7.0.0 brings an new config value named `RUNTIME_DOWNLOAD`, which is an boolean, to disable Runtime Downloads or explicitly enable them

### Unified Common Errors

In pre-7.0.0, errors were all over the place, now the most common are unified into custom errors
