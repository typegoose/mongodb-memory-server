---
id: mongo-memory-instance-replicamemberconfig
title: 'ReplicaMemberConfig'
---

API Documentation of `ReplicaMemberConfig`-Interface

## Values

### arbiterOnly

Typings: `arbiterOnly?: boolean`  
Default: `false`

Set a member to be a arbiter, see [MongoDB ReplSet Arbiter](https://www.mongodb.com/docs/manual/core/replica-set-arbiter/) and [MongoDB add an Arbiter to the ReplSet](https://www.mongodb.com/docs/manual/tutorial/add-replica-set-arbiter/).

### buildIndexes

Typings: `buildIndexes?: boolean`  
Default: `true`

Set whether to automatically build indexes.

### hidden

Typings: `hidden?: boolean`  
Default: `true`

Set a the instance to not show up in the command `hello`.

### priority

Typings: `priority?: number`  
Default: `1`

Set the priority in becoming a Primary. Higher is more likely. `0` is only for arbiters.

### tags

Typings: `tags?: any`  
Default: `null`

Set custom tags for a member, see [MongoDB ReplSet tags](https://www.mongodb.com/docs/manual/tutorial/configure-replica-set-tag-sets/).

### slaveDelay

Typings: `slaveDelay?: number`  
Default: `0`

Set how long behind the secondary members should be behind the primary, for more see [MongoDB 4.x Configure a Delayed Replica Set Member](https://www.mongodb.com/docs/v4.2/tutorial/configure-a-delayed-replica-set-member/).  
This option is only for MongoDB `4.x`, for `5.0` or higher use [`secondaryDelaySecs`](#secondarydelaysecs).

### secondaryDelaySecs

Typings: `secondaryDelaySecs?: number`  
Default: `0`

Set how long behind the secondary members should be behind the primary, for more see [MongoDB Configure a Delayed Replica Set Member](https://www.mongodb.com/docs/manual/tutorial/configure-a-delayed-replica-set-member/).  
This option is a for MongoDB `5.0` or higher.

### votes

Typings: `votes?: number`  
Default: `1`

Set how many votes this member has for electing a primary. Arbiters only have a static vote of `1`.
