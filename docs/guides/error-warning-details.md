---
id: error-warning-details
title: 'Details for Errors & Warnings'
---

## StateError

Example:

```txt
Incorrect State for operation: "${gotState}", allowed States: "[${wantedStates.join(',')}]"
This may be because of using a v6.x way of calling functions, look at the following guide if anything applies:
https://nodkz.github.io/mongodb-memory-server/docs/guides/migration/migrate7#no-function-other-than-start-create-ensureinstance-will-be-starting-anything
```

Details:  
This Error gets thrown if an function (or setter) is called, but the state is not what it should be.  
(like calling start again after already being started - or changing options while running)

## UnknownLockfileStatusError

Example: `Unknown LockFile Status: "${status}"`

Details:  
This Error gets thrown if an number outside the `LockFileStatus` Enum is used

## UnableToUnlockLockfileError

Example: `Cannot unlock file "${file}", because it is not locked by this ${thisInstance ? 'instance' : 'process'}`

Details:  
This Error gets thrown when this package cannot get what platform it is running on

## UnknownArchitectureError

Example:

- `Unsupported Architecture-Platform combination: arch: "${arch}", platform: "${platform}"`
- `Unsupported Architecture: "${arch}"`

Details:  
This Error gets thrown when this package runs on an unsupported architecture by mongodb

## UnknownPlatformError

Example: `Unknown Platform: "${platform}"`

Details:  
The Platform `${platform}` is not supported, only supported platform currently are:

- `osx`
- `win32` / `windows`
- `linux`

## WaitForPrimaryTimeoutError

Example: `Timed out after ${timeout}ms while waiting for a Primary (where: "${where}")`

Details:  
Waiting for a Primary has timedout, this originates from 4 common issues:

- Starting instances failed
- A even number of instances started and are unable to elect a Primary
- Internal Problem
- Target System is too slow to start the number of instances

Default Timeout: `1000 * 30` (30 seconds)

## EnsureInstanceError

Example:

- `${baseMesasge} state was "running" but "instanceInfo" was undefined!`
- `${baseMesasge} "instanceInfo" was undefined after running "start"`

Details:

- First Error Message gets thrown when `ensureInstance` is called and the `state` is `running`, but somehow `instanceInfo` is `undefined`
- Second Error Message gets thrown when `ensureInstance` is called and after `start` was called by `ensureInstance` and `instanceInfo` is still `undefined`

In any case this Error gets thrown, it means that some internal problem happened that was not handled with another Error, please report if your get this error and did not mock anything.

Also see [`InstanceInfoError`](#instanceinfoerror).

## NoSystemBinaryFoundError

Example: `Config option "SYSTEM_BINARY" was provided with value "${binaryPath}", but no binary could be found!`

Details:  
Config Options [`SYSTEM_BINARY`](../api/config-options#system_binary) was set, but no binary could be found at the path `${binaryPath}`.
Likely causes are:

- No Binary Exists at the specified path
- The Binary is does not have the necessary permissions and is so ignored (required permissions are `fs.constants.X_OK` (`--x`))

Also see:

- [`InsufficientPermissionsError`](#insufficientpermissionserror)
- [`BinaryNotFoundError`](#binarynotfounderror)

## Md5CheckFailedError

Example: `MD5 check failed! Binary MD5 is "${binarymd5}", Checkfile MD5 is "${checkfilemd5}"`

Details:  
Download MD5 check was enabled ([`MD5_CHECK`](../api/config-options#md5_check)) but failed, listing the local file md5 as `${binarymd5}` and the downloaded md5 as `${checkfilemd5}`

## StartBinaryFailedError

Example: `Starting the Binary Failed (PID is undefined)! Binary: "${binary}"`

Details:  
Trying to start the binary `${binary}` as a childprocess somehow failed by having property `pid` being `undefined`.  

Enable [Debug Mode](./enable-debug-mode) for more information.

## InstanceInfoError

Example: `"instanceInfo" was undefined when expected to be defined! (where: "${where}")`

Details:  
`instanceInfo` was `undefined` when it was expected to have been defined previously. Please Report if this error gets thrown.

Enable [Debug Mode](./enable-debug-mode) for more information.

## KeyFileMissingError

Example: `"keyfileLocation" was undefined when expected!`

Details:  
Option `keyfileLocation` was `undefined` when it was needed. This Options is required when starting a `MongoInstance` and option `replSet` and `auth` are set.

## AuthNotObjectError

Example: `"auth" was not a object when it was expected!`

Details:  
Property `auth` was expect to be of type `object` (transform happens in the setter for `replSetOpts`). Please Report if this error gets thrown.

## InsufficientPermissionsError

Example: `File "${path}" does not have the required Permissions, required Permissions: "--x"`

Details:  
Binary Check was conducted and found that the specified file `${path}` exists, but does not have the required permissions, required permissions are `fs.constants.X_OK` (`--x`).

## BinaryNotFoundError

Example: `No Binary at path "${path}" was found! (ENOENT)`

Details:  
Binary Check was conducted and found that the specified file `${path}` did not exist (`ENOENT`), this may be a result of:

- The Binary Download failed without throwing another Error
- The Path generation had a problem

## AssertionFallbackError

Example: `Assert failed - no custom error`

Details:  
This Error gets thrown when no custom error to `assertion` is given, this should never happen

## ReplsetCountLowError

Example: `ReplSet Count needs to be 1 or higher! (specified count: "${count}")`

Details:  
ReplSet count (like `new MongoMemoryReplSet({ replSet: { count: 0 } })`) needs to be `1` or higher
