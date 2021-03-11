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

Used to change the state of the class, it is `protected` to not accidentally use it

### start

Typings: `async start(forceSamePort: boolean = false): Promise<boolean>`

Used to start an new Instance or to Re-Start an stopped instance

:::caution
Will Error if instance is already running
:::

### getNewPort

<span class="badge badge--warning">Internal</span>

Typings: `protected async getNewPort(port?: number): Promise<number>`

Finds an new non-locked port

### getStartOptions

<span class="badge badge--warning">Internal</span>

Typings: `protected async getStartOptions(): Promise<MongoMemoryServerGetStartOptions>`

Constructs the Starting Options

### _startUpInstance

<span class="badge badge--warning">Internal</span>

Typings: `async _startUpInstance(forceSamePort: boolean = false): Promise<void>`

Internal Functions used by [`start`](#start)

### stop

Typings: `async stop(runCleanup: boolean = true): Promise<boolean>`

Stop an running instance

:::caution
Will not Error if instance is not running
:::

### cleanup

Typings: `async cleanup(force: boolean): Promise<void>`

Cleanup all files used by this instance

:::tip
Runs automatically on `process.on('beforeExit')` [This can add many listeners if many instances are used without an replset]
:::

### ensureInstance

Typings: `async ensureInstance(): Promise<MongoInstanceData>`

Ensure that the instance is running, will run [`start`](#start) if stopped, will wait if state is `starting`

:::caution
Will Error if instance cannot be started
:::

### getUri

Typings: `getUri(otherDbName?: string | boolean): string`

Get an mongodb-usable uri (can also be used in mongoose)

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

Stores the current State

### auth

Typings: `readonly auth?: Required<AutomaticAuth>`

Stores automatic auth creation options
