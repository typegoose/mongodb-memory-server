---
id: migrate8
title: 'Migrate to version 8.0.0'
---

Here are the Important changes made for 8.0.0

:::warning Important, Read this first
This Guide is written for migration from version `7.6.0` to `8.0.0`, for versions `>8.0.0 <9.0.0`, please consult the [CHANGELOG](https://github.com/typegoose/mongodb-memory-server/blob/master/CHANGELOG.md)
:::

## Breaking Changes

### Default MongoDB Server version upgraded to 5.0.3

The Default MongoDB Server version for 8.0 is `5.0.3`, see [MongoDB Server Versions](../mongodb-server-versions.md).

### Mongodb Driver Version upgraded to 4.x

The used MongoDB Driver version is now `4.1.2`.

## Non-Breaking changes / Additions

### Binary file name is now parsed from ARCHIVE_NAME and DOWNLOAD_URL

The Binary file name (like `mongod-x64-ubuntu-4.0.0`) is now parsed from [`ARCHIVE_NAME`](../../api/config-options#archive_name) and [`DOWNLOAD_URL`](../../api/config-options#download_url).

### A Error now gets thrown if Debian 10 (or higher) is used with mongodb version below 4.2.0

A Error now gets thrown, if Debian 10 (or higher) is used with a requested mongodb version of below 4.2.0, because there are no version available for Debian 10 below 4.2.0 and Debian 9 binaries are incompatible with Debian 10. (because of libcurl3)

### `instance.auth` is no longer required to enable Authentication

Option `instance.auth` is now no longer required to be set to enable Authentication when `auth` (top-level) is set.

### More Errors moved to Custom Error classes

More Errors have been moved to a custom Error class.
