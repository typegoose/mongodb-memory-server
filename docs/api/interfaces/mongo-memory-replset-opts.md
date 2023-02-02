---
id: mongo-memory-replset-opts
title: 'MongoMemoryReplSetOpts'
---

API Documentation of `MongoMemoryReplSetOpts`-Interface

## Values

### instanceOpts

Typings: `instanceOpts: MongoMemoryInstanceOptsBase[]`  
Default: `{}`

Set [`MongoMemoryInstanceOptsBase`](./mongo-memory-instance-opts.md#values-for-mongomemoryinstanceoptsbase) for a instance individually, overwrites existing options from [`replSet`](#replset).

The count of this array deducts from the `replSet.count`, if more than `replSet.count` are specified, the additional ones are also spawned.

### binary

Typings: `binary: MongoBinaryOpts`  
Default: `{}`

Set [`MongoBinaryOpts`](./mongo-binary-opts.md) for the replset instances to use.

### replSet

Typings: `replSet: ReplSetOpts`  
Default: `{}`

Set [`ReplSetOpts`](./replset-opts.md) for the whole ReplSet and default options for the instances to spawn with.
