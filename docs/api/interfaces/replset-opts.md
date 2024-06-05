---
id: replset-opts
title: 'ReplSetOpts'
---

API Documentation of `ReplSetOpts`-Interface

## Values

### auth

Typings: `auth?: AutomaticAuth`  
Default: `{ enable: false }`

Set whether to enable Authentication, with configuration from [`AutomaticAuth`](./mongo-memory-server-automaticauth.md).

Also see [`MongoMemoryInstanceOpts.auth`](./mongo-memory-instance-opts.md#auth).

### args

Typings: `args?: string[]`  
Default: `[]`

Set custom arguments to passs to the `mongod` binary.

Also see [`MongoMemoryInstanceOpts.args`](./mongo-memory-instance-opts.md#args).

### dbName

Typings: `dbName?: string`  
Default: `""`

**Currently unused**.

Set a custom dbname to use in `getUri`.

Also see [`MongoMemoryInstanceOpts.dbName`](./mongo-memory-instance-opts.md#dbname).

### ip

Typings: `ip?: string`  
Default: `"127.0.0.1"`

Set which ip to bind to.

Also see [`MongoMemoryInstanceOpts.ip`](./mongo-memory-instance-opts.md#ip).

### name

Typings: `name?: string`  
Default: `"testset"`

Set which replset name to use.

See [MongoDB `replication.replSetName`](https://www.mongodb.com/docs/manual/reference/configuration-options/#mongodb-setting-replication.replSetName)

### spawn

Typings: `spawn?: SpawnOptions`  
Default: `{}`

Set extra spawn options to pass to `childProcess.spawn`.

Also see [`MongoMemoryInstanceOpts.spawn`](./mongo-memory-instance-opts.md#spawn).

### storageEngine

Typings: `storageEngine?: StorageEngine`  
Default: `"ephemeralForTest"` (unless mongodb version is `7.0.0`, where its `wiredTiger`)

Set which Storage Engine to use, uses [`StorageEngine`](./mongo-memory-instance-opts.md#helper-type-storageengine).

Also see [`MongoMemoryInstanceOpts.storageEngine`](./mongo-memory-instance-opts.md#storageengine).

### configSettings

Typings: `configSettings?: MongoMemoryReplSetConfigSettings`  
Default: `{}`

Set custom ReplSet config options

See [MongoDB Replica Set Configuration](https://www.mongodb.com/docs/manual/reference/replica-configuration/).

### count

Typings: `count?: number`  
Default: `1`

Set how many ReplSet members to spawn, this number will be deducted from length of [`instanceOpts`](./mongo-memory-replset-opts.md#instanceopts) array.

:::tip
It is recommended to set this number to a **odd** number, and try to never have it be **even**, see [MongoDB Deploy an Odd Number of Members](https://www.mongodb.com/docs/v5.2/core/replica-set-architectures/#deploy-an-odd-number-of-members).
:::

### dispose

Typings: `dispose?: DisposeOptions`

Set custom behavior for when `[Symbol.asyncDispose]` is called, uses [`DisposeOptions`](./mongo-dispose-opts.md).
