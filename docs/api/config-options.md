---
id: config-options
title: 'Config Options'
---

List of all Config Options

## List of Config Options

### DOWNLOAD_DIR

|  Environment Variable  |  PackageJson  |
| :--------------------: | :-----------: |
| `MONGOMS_DOWNLOAD_DIR` | `downloadDir` |

Option `DOWNLOAD_DIR` is used to set where the binaries will be located in, this will overwrite all other directories

Directory Priority:

1. DOWNLOAD_DIR (Environment Variable over package.json)
2. `~/.cache/mongodb-binaries` (Home Directory Cache) (if [`PREFER_GLOBAL_PATH`](#prefer_global_path) is active, or binary already exists)
3. `projectRoot/node_modules/.cache/mongodb-binaries` (node-modules cache)
4. `./mongodb-binaries` (relative to `process.cwd()`)

:::note
Resolving the `node_modules/.cache` can be rather inconsistent depending on what package manager is used and from where the script is started.

A way to force a more specific `node_modules/.cache` to be used (like a workspace's) is to set the package.json config for mongodb-memory-server (there needs to be at least one key, it does not matter if it is a actual config option or not), see [How to use them in the package.json](#how-to-use-them-in-the-packagejson).
Example:

```json
{
  "name": "workspace",
  // along with your other workspace keys
  "config": {
    "mongodbMemoryServer": {
      "_": 0
    }
  }
}
```

:::

Format:

- `/path/to/binary/` (POSIX)
- `C:/path/to/binary/` (DOS)

### PLATFORM

| Environment Variable | PackageJson |
| :------------------: | :---------: |
|  `MONGOMS_PLATFORM`  | `platform`  |

Option `PLATFORM` is used to overwrite which platform should be downloaded

Valid Options are `win32`, `darwin`, `linux`, ~~`sunos`~~(never actually supported, [will be removed in 9.0](../guides/error-warning-details.md#mms002))

### ARCH

| Environment Variable | PackageJson |
| :------------------: | :---------: |
|    `MONGOMS_ARCH`    |   `arch`    |

Option `ARCH` is used to overwrite the Architecture to download for

Valid Options are `x64`, `arm64`

[See here for what versions are available for what architectures](https://www.mongodb.com/download-center/community/releases/archive)

### DISTRO

| Environment Variable | PackageJson |
| :------------------: | :---------: |
|   `MONGOMS_DISTRO`   |  `distro`   |

Option `DISTRO` is used to overwrite the Distribution used instead of the detected one.

Only works for when [`PLATFORM`](#platform) (automatic or manually set) is `linux`.

Format is `distro-release`, both distro and release need to be always defined.

Example: `ubuntu-18.04`

[See here for what versions are available for what distros](https://www.mongodb.com/download-center/community/releases/archive)

### VERSION

| Environment Variable | PackageJson |
| :------------------: | :---------: |
|  `MONGOMS_VERSION`   |  `version`  |

Option `VERSION` is used to set what mongodb version should be downloaded

Default: `8.2.1` (see [Mongodb Server Versions](../guides/mongodb-server-versions.md) for a complete list and policy)

This Option does not have a effect when [`ARCHIVE_NAME`](#archive_name) or [`DOWNLOAD_URL`](#download_url) is defined.

Common MongoDB Version formats (`X` is a number):

- `X.X.X`
- `vX.X-latest`

[Search for what Versions are available](https://www.mongodb.com/download-center/community/releases/archive)

:::note
When using [`SYSTEM_BINARY`](#system_binary) and [`SYSTEM_BINARY_VERSION_CHECK`](#system_binary_version_check), ONLY the major, minor, and patch versions of the system binary will be compared against the desired binary.

That is, a system binary version of `4.2.19-11-ge2f2736a` will match a mongodb required version of `4.2.19`. DO NOT set the mongodb required version to the full `4.2.19-11-ge2f2736a` version as the check which examines the binary version will strip the additional tags.
:::

### DEBUG

| Environment Variable | PackageJson |
| :------------------: | :---------: |
|   `MONGOMS_DEBUG`    |   `debug`   |

Option `DEBUG` is used to enable Debug Output

### DOWNLOAD_MIRROR

|   Environment Variable    |   PackageJson    |
| :-----------------------: | :--------------: |
| `MONGOMS_DOWNLOAD_MIRROR` | `downloadMirror` |

Option `DOWNLOAD_MIRROR` is used to set which mirror to use

Default / Format: `https://fastdl.mongodb.org` (protocol needs to be included)

Also supported is adding an path `https://someserver.com/some/path/for/mongodb`.  

:::note
It is discouraged to use query parameters, they may work, but not officially supported
:::

### DOWNLOAD_URL

|  Environment Variable  |  PackageJson  |
| :--------------------: | :-----------: |
| `MONGOMS_DOWNLOAD_URL` | `downloadUrl` |

Option `DOWNLOAD_URL` is used to overwrite the ***complete*** URL (including [`DOWNLOAD_MIRROR`](#download_mirror))

Format: `https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2404-8.0.1.tgz`

### DOWNLOAD_IGNORE_MISSING_HEADER

|       Environment Variable       |          PackageJson          |
| :------------------------------: | :---------------------------: |
| `DOWNLOAD_IGNORE_MISSING_HEADER` | `downloadIgnoreMissingHeader` |

Option `DOWNLOAD_IGNORE_MISSING_HEADER` can be set to `true` to ignore missing response headers like `content-length`.

Default: `false`

### PREFER_GLOBAL_PATH

|     Environment Variable     |    PackageJson     |
| :--------------------------: | :----------------: |
| `MONGOMS_PREFER_GLOBAL_PATH` | `preferGlobalPath` |

Option `PREFER_GLOBAL_PATH` is used to force download into `~/.cache/mongodb-binaries` instead of local folder

### DISABLE_POSTINSTALL

|     Environment Variable      |     PackageJson      |
| :---------------------------: | :------------------: |
| `MONGOMS_DISABLE_POSTINSTALL` | `disablePostinstall` |

Option `DISABLE_POSTINSTALL` is used to skip all `postinstall` scripts

### SYSTEM_BINARY

|  Environment Variable   |  PackageJson   |
| :---------------------: | :------------: |
| `MONGOMS_SYSTEM_BINARY` | `systemBinary` |

Option `SYSTEM_BINARY` is used to set the path to an system binary already existing on the system

Format:

- `/path/to/binary/mongod` (POSIX)
- `C:/path/to/binary/mongod.exe` (DOS)

### SYSTEM_BINARY_VERSION_CHECK

|         Environment Variable          |        PackageJson         |
| :-----------------------------------: | :------------------------: |
| `MONGOMS_SYSTEM_BINARY_VERSION_CHECK` | `systemBinaryVersionCheck` |

Option `SYSTEM_BINARY_VERSION_CHECK` is used to disable the version conflict check if [`SYSTEM_BINARY`](#system_binary) is set and version returned from `mongod_system_binary --version` does not match [`VERSION`](#version)

Default: `true`

### MD5_CHECK

| Environment Variable | PackageJson |
| :------------------: | :---------: |
| `MONGOMS_MD5_CHECK`  | `md5Check`  |

Option `MD5_CHECK` is used to enable an md5 check after download

Default: `true`

### ARCHIVE_NAME

|  Environment Variable  |  PackageJson  |
| :--------------------: | :-----------: |
| `MONGOMS_ARCHIVE_NAME` | `archiveName` |

Option `ARCHIVE_NAME` is used to overwrite the complete archive name

Format: `mongodb-linux-x86_64-ubuntu2404-8.0.1.tgz`

[See here for what archive names are available](https://www.mongodb.com/download-center/community/releases/archive)

This Option does not have a effect when [`DOWNLOAD_URL`](#download_url) is defined.

### RUNTIME_DOWNLOAD

|    Environment Variable    |    PackageJson    |
| :------------------------: | :---------------: |
| `MONGOMS_RUNTIME_DOWNLOAD` | `runtimeDownload` |

Option `RUNTIME_DOWNLOAD` is used to disable downloading while being in something like `.start`

Default: `true`

### USE_HTTP

| Environment Variable | PackageJson |
| :------------------: | :---------: |
|  `MONGOMS_USE_HTTP`  |  `useHttp`  |

Option `USE_HTTP` is used to use `http` over `https`

Default: `false`

### MAX_REDIRECTS

|  Environment Variable   |  PackageJson   |
| :---------------------: | :------------: |
| `MONGOMS_MAX_REDIRECTS` | `maxRedirects` |

Option `MAX_REDIRECTS` is used to set the maximal amount of redirects to follow

Default: `2`

### USE_ARCHIVE_NAME_FOR_BINARY_NAME

|            Environment Variable            |          PackageJson          |
| :----------------------------------------: | :---------------------------: |
| `MONGOMS_USE_ARCHIVE_NAME_FOR_BINARY_NAME` | `useArchiveNameForBinaryName` |

Option `USE_ARCHIVE_NAME_FOR_BINARY_NAME` is used to use the archive name as binary

Default: `false`

This can resolve conflicts when resolving binary names for different systems changes between versions (like support for ubuntu 22.04 becoming available instead of using 20.04) or if the same cache is shared between different distros (like docker pass-through).

Example:  

By default the binary name gets set like `mongod-ARCH-CURRENT_DISTRO-VERSION` (`mongod-x64-ubuntu-6.0.4`), but with this option it will use the downloaded archive name (without extension) like `mongodb-linux-x86_64-ubuntu2004-6.0.4`.

Also see [ARCHIVE_NAME](#archive_name).

:::note
Keep in mind that downloaded binaries will never be automatically deleted.
:::

### MAX_RETRIES

| Environment Variable  | PackageJson  |
| :-------------------: | :----------: |
| `MONGOMS_MAX_RETRIES` | `maxRetries` |

Option `MAX_RETRIES` is used to set the maximum number of retry attempts for downloading binaries when a retryable error occurs.

Default: `3`

Set this to control how many times the downloader will attempt to recover from transient errors (like network issues) before failing.

### RESUME_DOWNLOAD

|   Environment Variable    |     PackageJson     |
| :-----------------------: | :-----------------: |
| `MONGOMS_RESUME_DOWNLOAD` | `expResumeDownload` |

Option `RESUME_DOWNLOAD` is used to enable / disable resuming a download of a binary instead of starting over on retries or interruptions.

Default: `false`

## How to use them in the package.json

To use the config options in the `package.json`, they need to be camelCased (and without `_`), and need to be in the property `config.mongodbMemoryServer`

Example:

```json
{
  "config": {
    "mongodbMemoryServer": {
      "downloadDir": "/path/to/DownloadDir"
    }
  }
}
```

By default it uses the nearest (upwards) `package.json` to `process.cwd()`.
To change this:

```ts
import { findPackageJson } from "mongodb-memory-server-core/lib/util/resolveConfig";

findPackageJson('/custom/path');

// OR

process.chdir('/custom/path'); // not recommended
```

## How to use them as Environment Variables

For Environment Variables an config option must be prefixed with `MONGOMS_`

Example: `MONGOMS_DOWNLOAD_DIR`

For boolean Variables, the following will be interpreted as `true`: `true 1 on yes`
