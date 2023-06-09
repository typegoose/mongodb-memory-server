---
id: migrate9
title: 'Migrate to version 9.0.0'
---

Here are the Important changes made for 9.0.0

:::caution Important, Read this first
This Guide is written for migration from version `8.13.0` to `9.0.0`, for versions `>9.0.0 <10.0.0`, please consult the [CHANGELOG](https://github.com/nodkz/mongodb-memory-server/blob/master/CHANGELOG.md)
:::

## Breaking Changes

### Mongodb Driver Version upgraded to 5.x

The used MongoDB Driver version is now `5.6.0`.

### Removed platform translations

Some platform translations have been removed, because they are either not needed anymore or werent supported in the first place:

- `sunos` -> `linux`
- `elementary OS` -> `linux`

### Removed architectures

Some architectures were removed because they were not being build by mongodb anymore and support in mongodb-memory-server has been largely untested:

- `ia32` -> `i686` / `i386`

### MongoMemoryServer `instance.auth` option is now ignored

With 9.0.0 the option `instance.auth` option is going to be ignored, because its set via the `auth` option directly.

Example:

`new MongoMemoryServer({ instance: { auth: true } })` is going to be ignored, use `new MongoMemoryServer({ auth: {} })`

### MongoMemoryServer and MongoReplSet `.cleanup(boolean)` and `.stop(boolean)` have been removed

Previously `boolean` was the only option for the `.cleanup` and `.stop` function, but they behaved differently between those 2 function and were replaced with `Cleanup` options and now have been completely removed.

Replace `.stop(true)` with `.stop({ doCleanup: true })`.  
Replace `.cleanup(true)` with `.stop({ doCleanup: true, force: true })`.  

Default is still for both `{ doCleanup: true }`.

### `MD5_CHECK` is now enabled by default

The config option [`MD5_CHECK`](../../api/config-options.md#md5_check) has been enabled by default now, resulting in always comparing the downloaded archive with a md5.

### Merged Error types

Some error classes have been merged:

- `EnsureInstanceError` & `InstanceInfoError` -> `InstanceInfoError`
- `NoSystemBinaryFoundError` & `BinaryNotFoundError` -> `BinaryNotFoundError`

### Removed Storage engine `devnull` and `mmapv1`

Storage Engines `devnull` and `mmapv1` have been removed because they are not supported in newer versions of mongodb anymore, `wiredTiger` should be used instead.

## Non-Breaking changes / Additions

### Compiler target is now `es2019`

The tsconfig `target` option has been updated to `es2019`, which will result in less polyfills.
This should be a non-breaking change

## Crypto function have been changed to use nodejs internals

Crypto functions like for the md5 check and uuidv4 generation have been moved to use the `node:crypto` support, resulting in dropping 2 dependencies.

## Binary childprocess is now also `.unref()`

The Mongodb Binary childprocess is now also `.unref()`, like the killer process has been for some time.

This *should* help with non-closed instances not exiting the nodejs process.
