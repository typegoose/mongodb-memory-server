---
id: migrate9
title: 'Migrate to version 9.0.0'
---

Here are the Important changes made for 9.0.0

:::warning Important, Read this first
This Guide is written for migration from version `8.16.0` to `9.0.0`, for versions `>9.0.0 <10.0.0`, please consult the [CHANGELOG](https://github.com/typegoose/mongodb-memory-server/blob/master/CHANGELOG.md)
:::

## Breaking Changes

### Minimal NodeJS version is now `14`

With 9.0.0 the minimal nodejs required is `14.20.1`.

### Mongodb Driver Version upgraded to 5.x

The used MongoDB Driver version is now `5.9.0`.

### Default binary version is now 6.x

The default binary version has been upgraded from `5.0.x` to `6.0.x`. For more specifics see [mongodb-server-versions](../mongodb-server-versions.md).

### Removed platform translations

Some platform translations have been removed, because they are either not needed anymore or werent properly supported in the first place:

- `sunos` -> `linux`
- `elementary OS` -> `linux`

### Removed architectures

Some architectures were removed because they were not being build by mongodb anymore and support in mongodb-memory-server has been largely untested:

- `ia32` -> `i686` / `i386`

### MongoMemoryServer `instance.auth` option is now ignored

With 9.0.0 the option `instance.auth` option is going to be ignored, because its set via the (top-level) `auth` option directly.

Example:

`new MongoMemoryServer({ instance: { auth: true } })` is going to be ignored, use `new MongoMemoryServer({ auth: { enable: true } })`

### `AutomaticAuth` changes

`AutomaticAuth` has been changed to **not** be enabled anymore by just having a empty object. Also property `disable` has been removed and `enable` has been added.

Replace `auth: {}` with `auth: { enable: true }`.  
Replace `auth: { disable: true }` with `auth: { enable: false }`.  
Replace `auth: { disable: false }` with `auth: { enable: true }`.  

### MongoMemoryServer and MongoReplSet `.cleanup(boolean)` and `.stop(boolean)` have been removed

Previously `boolean` was the only option for the `.cleanup` and `.stop` function, but they behaved differently between those 2 function and were replaced with `Cleanup` object-options and now have been completely removed.

Replace `.stop(true)` with `.stop({ doCleanup: true })`.  
Replace `.cleanup(true)` with `.stop({ doCleanup: true, force: true })`.  

Default is still for both `{ doCleanup: true, force: false }`.

### `MD5_CHECK` is now enabled by default

The config option [`MD5_CHECK`](../../api/config-options.md#md5_check) has been enabled by default now, resulting in always comparing the downloaded archive with a md5 after a download.

### Merged Error types

Some error classes have been merged:

- `EnsureInstanceError` & `InstanceInfoError` -> `InstanceInfoError`
- `NoSystemBinaryFoundError` & `BinaryNotFoundError` -> `BinaryNotFoundError`

### Removed Storage engine `devnull` and `mmapv1`

Storage Engines `devnull` and `mmapv1` have been removed because they are not supported in newer versions of mongodb anymore, `wiredTiger` should be used instead.

### Linux fallback binary has been removed

Previously there was a code-path for a fallback linux binary, but this has been removed because mongodb has stopped shipping generic linux binaries since versions after 4.0.

If a fallback is still required, try to use the ubuntu binary via [Config Options `DISTRO`](../../api/config-options.md#distro).

### Ubuntu fallback year has been updated

The ubuntu fallback year has been updated to `22`, instead of the previous `14`, because newer versions of mongodb dont ship for any EOL ubuntu version anymore.

This fallback is only used if the ubuntu year could not be parsed from the os-file.  
This can also be overwritten with [Config Option `DISTRO`](../../api/config-options.md#distro).

## Non-Breaking changes / Additions

### Compiler target is now `es2019`

The tsconfig `target` option has been updated to `es2019`, which will result in less polyfills.
This should be a non-breaking change

## Crypto function have been changed to use nodejs internals

Crypto functions like for the md5 check and uuidv4 generation have been moved to use the `node:crypto` support, resulting in dropping 2 dependencies.

Dropped dependencies are `md5-file` and `uuid`.

## Binary childprocess is now also `.unref()`

The Mongodb Binary childprocess is now also `.unref()`, like the killer process has been for some time.

This *should* help with non-closed instances not exiting the nodejs process.

## The port testing package has been replaced

Previously MMS used `get-port`, but it caused some big memory-leakage across big projects, so it has been replaced with one that uses less maps.

It also has been replaced because newer versions were ESM only, but we couldnt switch to ESM yet (and using ESM in CommonJS is not a great experience)

## Mongodb version 7.0.0 is now supported

Mongob version `7.0.0` removed storage engine `ephemeralForTest`, with mongodb-memory-server 9.0.0 storage engine `wiredTiger` is the default for binary versions `7.0.0` and higher.
Older versions (before `7.0.0`) will still continue to use `ephemeralForTest` by default.

:::info
The version used for the decision is the version provided via the resolved [`VERSION`](../../api/config-options.md#version) config option.  
This mean it needs to match the version the system binary is (a warning is printed if they are not the same).

If the option is unset, the default version will be used, which is likely not correct for the system binary.

If the decision should not be automatic, the storage engine can be explicitly defined as a instance option.
:::

It is recommended to run those instances with a db path which is equivalent to [`tmpfs`](https://wiki.archlinux.org/title/tmpfs).
