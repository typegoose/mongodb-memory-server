---
id: config-options
title: 'Config Options'
---

List of all Config Options

## List of Config Options

### DOWNLOAD_DIR

Option `DOWNLOAD_DIR` is used to set where the binaries will be located in, this will overwrite all other directories

Directory Priority:

1. DOWNLOAD_DIR (Environment Variable over package.json)
2. `~/.cache/mongodb-binaries` (Home Directory Cache) [Only used if directory exists]
3. `projectRoot/node_modules/.cache/mongodb-binaries` (node-modules cache)
4. `./mongodb-binaries` (relative to `process.cwd()`)

Format:

- `/path/to/binary/` (POSIX)
- `C:/path/to/binary/` (DOS)

### PLATFORM

Option `PLATFORM` is used to overwrite which platform should be downloaded

Valid Options are `win32`, `darwin`, `linux`, `sunos`

### ARCH

Option `ARCH` is used to overwrite the Architecture to download for

Valid Options are `ia32`, `x64`, `arm64`

### VERSION

Option `VERSION` is used to set what mongodb version should be downloaded

Default: `4.0.20`

### DEBUG

Option `DEBUG` is used to enable Debug Output

### DOWNLOAD_MIRROR

Option `DOWNLOAD_MIRROR` is used to set which mirror to use

Default / Format: `https://fastdl.mongodb.org`

### DOWNLOAD_URL

Option `DOWNLOAD_URL` is used to overwrite the ***complete*** URL (including [`DOWNLOAD_MIRROR`](#DOWNLOAD_MIRROR))

Format: `https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1604-4.0.20.tgz`

### PREFER_GLOBAL_PATH

Option `PREFER_GLOBAL_PATH` is used to force download into `~/.cache/mongodb-binaries` instead of local folder

### DISABLE_POSTINSTALL

Option `DISABLE_POSTINSTALL` is used to skip all `postinstall` scripts

### SYSTEM_BINARY

Option `SYSTEM_BINARY` is used to set the path to an system binary already existing on the system

Format:

- `/path/to/binary/mongod` (POSIX)
- `C:/path/to/binary/mongod.exe` (DOS)

### MD5_CHECK

Option `MD5_CHECK` is used to enable an md5 check after download

Default: `false`

### ARCHIVE_NAME

Option `ARCHIVE_NAME` is used to overwrite the complete archive name

Format: `mongodb-linux-x86_64-ubuntu1604-4.0.20.tgz`

### RUNTIME_DOWNLOAD

Option `RUNTIME_DOWNLOAD` is used to disable downloading while being in something like `.start`

Default: `true`

### USE_HTTP

Option `USE_HTTP` is used to use `http` over `https`

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
