---
id: mongo-memory-replset
title: 'MongoMemoryReplSet'
---

API Documentation of `MongoMemoryReplSet`-Class

## Functions

### new

Typings: `constructor(opts: Partial<MongoMemoryReplSetOpts> = {})`

Create an new ReplSet without starting it

:::tip
When directly starting the replset, [`create`](#create) should be used
:::

### create

Typings: `static async create(opts?: Partial<MongoMemoryReplSetOpts>): Promise<MongoMemoryReplSet>`

Create an new ReplSet and start it (while being an Promise)

### stateChange

<span class="badge badge--warning">Internal</span>

Typings: `protected stateChange(newState: MongoMemoryReplSetStates, ...args: any[]): void`

Used to change the state of the class, uses [`MongoMemoryReplSetStates` enum](../enums/mongo-memory-replset-states.md), it is `protected` to not accidentally use it

### getInstanceOpts

<span class="badge badge--warning">Internal</span>

Typings: `protected getInstanceOpts(baseOpts: MongoMemoryInstancePropBase = {}): MongoMemoryInstanceProp`

Constructs the options used for an instance

### getUri

Typings: `getUri(otherDb?: string): string`

Get an mongodb-usable uri (can also be used in mongoose)

When no arguments are set, the URI will always use ip `127.0.0.1` and end with `/?replicaSet=ReplSetName` (not setting a database).  
When setting `otherDbName`, the value of `otherDbName` will be appended after `/` and before any query arguments.  
When setting `otherIp`, the ip will be the value of `otherIp` instead of `127.0.0.1` (for all instances).

### start

Typings: `async start(): Promise<void>`

Used to start an new ReplSet or to Re-Start an stopped ReplSet

:::warning
Will Error if ReplSet is already running
:::

### initAllServers

<span class="badge badge--warning">Internal</span>

Typings: `protected async initAllServers(): Promise<void>`

Used by [`start`](#start) and to restart without fully running everything again

### ensureKeyFile

<span class="badge badge--warning">Internal</span>

Typings: `protected async ensureKeyFile(): Promise<string>`

Ensures and returns that [`_keyfiletmp`](#_keyfiletmp) is defined an exists and also that the keyfile is created

### stop

Typings: `async stop(cleanupOptions?: Cleanup): Promise<boolean>`

Stop an running instance, this function will by default call [`.cleanup`](#cleanup) with `{ doCleanup: true, force: false }`.

With `cleanupOptions` options for cleanup can be manually set.

:::warning
Will not Error if instance is not running
:::

### cleanup

Typings: `async cleanup(options?: Cleanup): Promise<void>`

Cleanup all files used by this ReplSet's instances, by default `{ doCleanup: true, force: false }` is used.

With `options` can be set how to run a cleanup.

### waitUntilRunning

Typings: `async waitUntilRunning(): Promise<void>`

Wait until all instances are running.

It is recommended to `await` the promise returned from `start` when available.

Does not start the replset instance if not already starting (unlike [`ensureInstance`](./mongo-memory-server.md#ensureinstance)).

:::warning
Will Error if state is not `running` or `init`.
:::
:::warning
Will **not** Error if a error is encountered while waiting.
:::

### _initReplSet

<span class="badge badge--warning">Internal</span>

Typings: `protected async _initReplSet(): Promise<void>`

This is used to connect to the first server and initiate the ReplSet with an command<br/>
Also enables `auth`

### _initServer

<span class="badge badge--warning">Internal</span>

Typings: `protected _initServer(instanceOpts: MongoMemoryInstanceProp): MongoMemoryServer`

Creates an new [`instance`](./mongo-memory-server.md) for the ReplSet

### _waitForPrimary

<span class="badge badge--warning">Internal</span>

Typings: `protected async _waitForPrimary(timeout: number = 1000 * 30, where?: string): Promise<void>`

Wait until the ReplSet has elected an Primary, the `where` string will be added to the error if the timeout is reached

## Values

### servers

Typings: `servers: MongoMemoryServer[]`

Stores all the servers of this ReplSet

### instanceOpts

Typings:

- `get instanceOpts(): MongoMemoryInstancePropBase[]`
- `set instanceOpts(val: MongoMemoryInstancePropBase[])`

Getter & Setter for [`_instanceOpts`](#_instanceopts)

:::warning
Will Throw an Error if `state` is not `stopped`
:::

### _instanceOpts

<span class="badge badge--warning">Internal</span>

Typings: `protected _instanceOpts!: MongoMemoryInstancePropBase[]`

Stores Options used for an instance

### binaryOpts

Typings:

- `get binaryOpts(): MongoBinaryOpts`
- `set binaryOpts(val: MongoBinaryOpts)`

Getter & Setter for [`_binaryOpts`](#_binaryopts)

:::warning
Will Throw an Error if `state` is not `stopped`
:::

### _binaryOpts

<span class="badge badge--warning">Internal</span>

Typings: `protected _binaryOpts!: MongoBinaryOpts`

Stores the options used for the binary

### replSetOpts

Typings:

- `get replSetOpts(): ReplSetOpts`
- `set replSetOpts(val: ReplSetOpts)`

Getter & Setter for [`_replSetOpts`](#_replsetopts)

:::warning
Will Throw an Error if `state` is not `stopped`
:::

### _replSetOpts

<span class="badge badge--warning">Internal</span>

Typings: `protected _replSetOpts!: Required<ReplSetOpts>`

Stores the options used for the ReplSet Initiation, uses [`ReplSetOpts`](../interfaces/replset-opts.md).

### _keyfiletmp

<span class="badge badge--warning">Internal</span>

Typings: `protected _keyfiletmp?: string`

Stores the path of the created temporary directory for the keyfile location

### state

Typings: `get state(): MongoMemoryReplSetStates`

Getter for [`_state`](#_state)

:::warning
Will Throw an Error if `state` is not `stopped`
:::

### _state

<span class="badge badge--warning">Internal</span>

Typings: `protected _state: MongoMemoryReplSetStates`

Stores the current State, uses [`MongoMemoryReplSetStates` enum](../enums/mongo-memory-replset-states.md).

### _ranCreateAuth

<span class="badge badge--warning">Internal</span>

Typings: `protected _ranCreateAuth: boolean`

Stores if the auth creation has already ran
