---
id: quick-start-guide
title: 'Quick Start Guide'
---

This Guide will show how to setup this package for basic use

## Requirements

- NodeJS: 10.15+
- Typescript: 3.8+ (if used)

:::info
When using NodeJS below 12.10, package `rimraf` needs to be installed (when using cleanup with `force`)
:::

When on Linux, one of the following are required:

- having `lsb-core` installed (or any that provides the `lsb_release` command)
- having an `/etc/os-release` file that is compliant to the [OS-Release Spec](https://www.freedesktop.org/software/systemd/man/os-release.html)
- having an `/etc/*-release` file that is compliant to the [OS-Release Spec](https://www.freedesktop.org/software/systemd/man/os-release.html) (and does not include `lsb`)
- manually specify which version & system should be used

## Choose the right package

There are multiple packages for this project, here are the differences:

- `mongodb-memory-server-core` is the main package, which dosnt have any hooks
- `mongodb-memory-server` adds hooks to install on `yarn install` or `npm install` to install the latest package locally
- `mongodb-memory-server-global` adds hooks to install on `yarn install` or `npm install` to install the latest package globally (into $HOME)
- `mongodb-memory-server-global-X.X` adds hooks to install on `yarn install` or `npm install` to install MongoDB with version `X.X` globally (into $HOME)

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

const uri = replset.getUri();

// The ReplSet can be stopped again with
await replset.stop();
```

## Final Notes

:::danger
When not using an global instance for tests and use multi-threaded tests, it can cause Race Conditions
:::
