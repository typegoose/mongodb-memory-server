---
id: migrate11
title: 'Migrate to version 11.0.0'
---

Here are the Important changes made for 11.0.0

:::warning Important, Read this first
This Guide is written for migration from version `10.4.0` to `11.0.0`, for versions `>11.0.0 <12.0.0`, please consult the [CHANGELOG](https://github.com/typegoose/mongodb-memory-server/blob/master/CHANGELOG.md)
:::

## Breaking Changes

### Minimal NodeJS version is now `20`

With 10.0.0 the minimal nodejs required is `20.19.0`.

<!-- ### Mongodb Driver Version upgraded to 6.x

The used MongoDB Driver version is now `6.7.0`.

### Default binary version is now 7.x

The default binary version has been upgraded from `6.0.x` to `7.0.x`. For more specifics see [mongodb-server-versions](../mongodb-server-versions.md).

:::note
In mongodb `7.0.0` storage engine `ephemeralForTest` has been removed, mongodb-memory-server will automatically translate any occurrence to `wiredTiger` with a warning.

It is recommended to run the tests against a tmpfs or equivalent (default `/tmp` on linux / macos).
:::

## Non-Breaking changes / Additions

### Compiler target is now `es2021`

The tsconfig `target` option has been updated to `es2021`, which will result in less polyfills.
This should be a non-breaking change. -->
