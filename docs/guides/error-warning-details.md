---
id: error-warning-details
title: 'Details for Errors & Warnings'
---

## StateError

Example: `Incorrect State for operation: "running", allowed States: "[init]"`

Details:  
This Error gets thrown if an function (or setter) is called, but the state is not what it should be.  
(like calling start again after already being started - or changing options while running)

## UnknownLockfileStatusError

Example: `Unknown LockFile Status: "-1"`

Details:  
This Error gets thrown if an number outside the `LockFileStatus` Enum is used

## UnableToUnlockLockfileError

Example: `Unknown Platform: "unknown"`

Details:  
This Error gets thrown when this package cannot get what platform it is running on

## UnknownArchitectureError

Example: `Unsupported Architecture: "risc"`

Details:  
This Error gets thrown when this package runs on an unsupported architecture by mongodb

## UnknownPlatformError

*extend documentation*

## WaitForPrimaryTimeoutError

*extend documentation*

## EnsureInstanceError

*extend documentation*

## NoSystemBinaryFoundError

*extend documentation*

## Md5CheckFailedError

*extend documentation*

## StartBinaryFailedError

*extend documentation*

## InstanceInfoError

*extend documentation*

## KeyFileMissingError

*extend documentation*

## AuthNotObjectError

*extend documentation*

## InsufficientPermissionsError

*extend documentation*

## BinaryNotFoundError

*extend documentation*

## AssertionFallbackError

Example: `Assert failed - no custom error`

Details:  
This Error gets thrown when no custom error to `assertion` is given, this should never happen

## ReplsetCountLowError

Example: `ReplSet Count needs to be 1 or higher! (specified count: "${count}")`

Details:  
ReplSet count (like `new MongoMemoryReplSet({ replSet: { count: 0 } })`) needs to be `1` or higher
