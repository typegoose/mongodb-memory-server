---
id: error-warning-details
title: 'Details for Errors & Warnings'
---

## StateError

Example: `Incorrect State for operation: "running", allowed States: "[init]"`

Details:  
This Error gets thrown if an function (or setter) is called, but the state is not what it should be.  
(like calling start again after already being started - or changing options while running)

## UnknownLockfileStatus

Example: `Unknown LockFile Status: "-1"`

Details:  
This Error gets thrown if an number outside the `LockFileStatus` Enum is used

## UnknownPlatform

Example: `Unknown Platform: "unknown"`

Details:  
This Error gets thrown when this package cannot get what platform it is running on

## UnknownArchitecture

Example: `Unsupported Architecture: "risc"`

Details:  
This Error gets thrown when this package runs on an unsupported architecture by mongodb
