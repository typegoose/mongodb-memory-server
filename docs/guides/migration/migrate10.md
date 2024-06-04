---
id: migrate10
title: 'Migrate to version 10.0.0'
---

Here are the Important changes made for 10.0.0

:::caution Important, Read this first
This Guide is written for migration from version `9.4.0` to `10.0.0`, for versions `>10.0.0 <11.0.0`, please consult the [CHANGELOG](https://github.com/nodkz/mongodb-memory-server/blob/master/CHANGELOG.md)
:::

## Breaking Changes

### Minimal NodeJS version is now `16`

With 10.0.0 the minimal nodejs required is `16.20.1`.

<!-- ### Mongodb Driver Version upgraded to 5.x

The used MongoDB Driver version is now `5.9.0`.

### Default binary version is now 6.x

The default binary version has been upgraded from `5.0.x` to `6.0.x`. For more specifics see [mongodb-server-versions](../mongodb-server-versions.md). -->

## Non-Breaking changes / Additions

### Compiler target is now `es2021`

The tsconfig `target` option has been updated to `es2021`, which will result in less polyfills.
This should be a non-breaking change.
