---
id: migrate12
title: 'Migrate to version 12.0.0'
---

Here are the Important changes made for 11.0.0

:::warning Important, Read this first
This Guide is written for migration from version `11.4.0` to `12.0.0`, for versions `>12.0.0 <13.0.0`, please consult the [CHANGELOG](https://github.com/typegoose/mongodb-memory-server/blob/master/CHANGELOG.md)
:::

## Breaking Changes

### Minimal mongodb version is now `4.4.0`

Mongodb version before `4.4.0` have been dropped (`4.2`) as they are now unsupported by the latest mongodb drivers
and are EOL for a couple of years.

This also means `mongodb-memory-server-global-4.2` has been dropped and wont receive a update to 12.0.0.

Distribution support has been adjusted to only contain 4.4.0 and higher as well, this means the following are now the minimal versions:

- Ubuntu: 16.04
- Elemtaryos: 4
- Linux mint: 18
- Debian: 9.2
- Rhel: 6.2
- Fedora: 12

### Mongodb Driver Version upgraded to 7.9

The used MongoDB Driver version is now `7.9.0`.

See [Minimal mongodb version is now `4.4.0`](#minimal-mongodb-version-is-now-440).

### Default binary version is now 8.3.x

The default binary version has been upgraded from `8.2.x` to `8.3.x`. For more specifics see [mongodb-server-versions](../mongodb-server-versions.md). -->

<!-- ## Non-Breaking changes / Additions
