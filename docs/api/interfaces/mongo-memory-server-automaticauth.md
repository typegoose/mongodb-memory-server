---
id: mongo-memory-server-automaticauth
title: 'AutomaticAuth'
---

API Documentation of `AutomaticAuth`-Interface

## Values

### enable

Typings: `enable?: boolean`  
Default: `false`

Enable or disable Authentication creation.  

### extraUsers

Typings: `extraUsers?: CreateUser[]`  
Default: `[]`

Add extra users after the root user has been created, uses [`CreateUser`](./mongo-memory-server-createuser.md).

### customRootName

Typings: `customRootName?: string`  
Default: `mongodb-memory-server-root`

Set a Custom Root User Name.

### customRootPwd

Typings: `customRootPwd?: string`  
Default: `rootuser`

Set a Custom Root User Password.

### force

Typings: `force?: boolean`  
Default: `false`

Force to run `createAuth`, by default `createAuth` is only run when the instance is new.

### keyfileContent

Typings: `keyfileContent?: string`  
Default: `0123456789`

Set custom content for the keyfile.  
This field only has a effect in a [`MongoMemoryReplSet`](../classes/mongo-memory-replset.md).  

A Keyfile is required in ReplSet's since ~5.0 for other replset instances to connect to eachother without having to use a password, and keyfiles only work for authenticating other instances, not clients, for more see [MongoDB Keyfile Documentation](https://www.mongodb.com/docs/manual/tutorial/enforce-keyfile-access-control-in-existing-replica-set/).
