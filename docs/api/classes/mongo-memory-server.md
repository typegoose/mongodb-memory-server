---
id: mongo-memory-server
title: 'MongoMemoryServer'
---

API Documentation of `MongoMemoryServer`-Class

## Functions

### new

Typings: `constructor(opts?: MongoMemoryServerOpts)`

Create an new Instance without starting it

:::tip
When directly starting the instance, [`create`](#create) should be used
:::

### create

Typings: `static async create(opts?: MongoMemoryServerOpts): Promise<MongoMemoryServer>`

Create an new Instance and start it (while being an Promise)

### stateChange

<span class="badge badge--warning">Internal</span>

Typings: `protected stateChange(newState: MongoMemoryServerStates): void`

Used to change the state of the class, uses [`MongoMemoryServerStates` enum](../enums/mongo-memory-server-states.md), it is `protected` to not accidentally use it.

### start

Typings: `async start(forceSamePort: boolean = false): Promise<boolean>`

Used to start an new Instance or to Re-Start an stopped instance

with `forceSamePort` set to `true` and having `instance.port` set, it will use that port and not generate a new port.  
with `forceSamePort` set to `true` and not having `instance.port` set, it will generate a new free port.  

:::caution
Will Error if instance is already running
:::

### getNewPort

<span class="badge badge--warning">Internal</span>

Typings: `protected async getNewPort(port?: number): Promise<number>`

Finds an new non-locked port, uses `port` if available or as a starting point.

### getStartOptions

<span class="badge badge--warning">Internal</span>

Typings: `protected async getStartOptions(forceSamePort: boolean = false): Promise<MongoMemoryServerGetStartOptions>`

with `forceSamePort` set to `true` and having `instance.port` set, it will use that port and not generate a new port.  
with `forceSamePort` set to `true` and not having `instance.port` set, it will generate a new free port.  

Constructs the Starting Options

### _startUpInstance

<span class="badge badge--warning">Internal</span>

Typings: `async _startUpInstance(forceSamePort: boolean = false): Promise<void>`

Internal Functions used by [`start`](#start)

### stop

Typings: `async stop(cleanupOptions?: Cleanup): Promise<boolean>`

Stop an running instance, this function will by default call [`.cleanup`](#cleanup) with `{ doCleanup: true, force: false }`.

With `cleanupOptions` options for cleanup can be manually set.

:::caution
Will not Error if instance is not running
:::

### cleanup

Typings: `async cleanup(options?: Cleanup): Promise<void>`

Cleanup all files used by this instance, by default `{ doCleanup: true, force: false }` is used.

With `options` can be set how to run a cleanup.

### ensureInstance

Typings: `async ensureInstance(): Promise<MongoInstanceData>`

Ensure that the instance is running, will run [`start`](#start) if stopped, will wait if state is `starting`.

It is recommended to `await` the promise returned from `start` when available.

:::caution
Will Error if instance cannot be started
:::

### getUri

Typings: `getUri(otherDbName?: string, otherIp?: string): string`

Get an mongodb-usable uri (can also be used in mongoose)

When no arguments are set, the URI will always use ip `127.0.0.1` and end with `/` (not setting a database).  
When setting `otherDbName`, the value of `otherDbName` will be appended after `/` and before any query arguments.  
When setting `otherIp`, the ip will be the value of `otherIp` instead of `127.0.0.1`.

### createAuth

<span class="badge badge--warning">Internal</span>

Typings: `async createAuth(data: StartupInstanceData): Promise<void>`

Logs in into the currently running instance and restarts it with auth enabled

:::info
The Instance will not be restarted if the storage engine is `ephemeralForTest` because data will not persist across restarts<br/>
It is still usefull if an user is always required in connection logic and mongodb throws an error that an user does not exists / cannot login
:::

## Values

### instanceInfo

Typings: `get instanceInfo(): MongoInstanceData | undefined`

Getter for [`_instanceInfo`](#_instanceInfo)

### _instanceInfo

<span class="badge badge--warning">Internal</span>

Typings: `protected _instanceInfo?: MongoInstanceData`

Stores the instance information

### opts

Typings: `opts: MongoMemoryServerOpts`

Store the instance options

### state

Typings: `get state(): MongoMemoryServerStates`

Getter for [`_state_`](#_state)

### _state

<span class="badge badge--warning">Internal</span>

Typings: `protected _state: MongoMemoryServerStates`

Stores the current State, uses [`MongoMemoryServerStates` enum](../enums/mongo-memory-server-states.md).

### auth

Typings: `readonly auth?: Required<AutomaticAuth>`

Stores automatic auth creation options
