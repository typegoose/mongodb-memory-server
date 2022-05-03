---
id: quick-start-guide
title: 'Quick Start Guide'
---

This Guide will show how to setup this package for basic use

:::note
The Examples on this page assume Top-Level async-await for readability.  
If Top-Level async-await is not available for your case, the code can in most cases be wrapped like:

```ts
(async () => {
  // async code in where
})();
```

:::

## Requirements

- NodeJS: 12.22+
- Typescript: 4.4+ (if used)

When on Linux, one of the following are required:

- having `lsb-core` installed (or any that provides the `lsb_release` command)
- having an `/etc/os-release` file that is compliant to the [OS-Release Spec](https://www.freedesktop.org/software/systemd/man/os-release.html)
- having an `/etc/*-release` file that is compliant to the [OS-Release Spec](https://www.freedesktop.org/software/systemd/man/os-release.html) (and does not include `lsb`)
- manually specify which version & system should be used

On Linux, you will also need `libcurl` (or `libcurl3` on some older distro versions). This will probably only be an issue on "slim" Docker images.

## Choose the right package

There are multiple packages for this project, here are the differences:

- `mongodb-memory-server-core` is the main package, which does not have any hooks on install
- `mongodb-memory-server` adds hooks to install on `yarn install` or `npm install` to install the *latest package locally*
- `mongodb-memory-server-global` adds hooks to install on `yarn install` or `npm install` to install the *latest package globally* (into $HOME)
- `mongodb-memory-server-global-X.X` adds hooks to install on `yarn install` or `npm install` to install *MongoDB with version `X.X` globally* (into $HOME)

## Normal Server

A Normal Server can be easily started with:

```ts
import { MongoMemoryServer } from 'mongodb-memory-server';

// This will create an new instance of "MongoMemoryServer" and automatically start it
const mongod = await MongoMemoryServer.create();

const uri = mongod.getUri();

// The Server can be stopped again with
await mongod.stop();
```

## ReplicaSet

A ReplicaSet can be easily started with:

```ts
import { MongoMemoryReplSet } from 'mongodb-memory-server';

// This will create an new instance of "MongoMemoryReplSet" and automatically start all Servers
const replset = await MongoMemoryReplSet.create({ replSet: { count: 4 } }); // This will create an ReplSet with 4 members
// To use Transactions, the "storageEngine" needs to be changed to `wiredTiger`
const replset = await MongoMemoryReplSet.create({ replSet: { count: 4, storageEngine: 'wiredTiger' } }); // This will create an ReplSet with 4 members and storage-engine "wiredTiger"

const uri = replset.getUri();

// The ReplSet can be stopped again with
await replset.stop();
```

## Final Notes

:::danger
When not using an global instance for tests and use multi-threaded tests, it can cause Race Conditions
:::
