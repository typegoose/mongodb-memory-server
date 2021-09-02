---
id: mongo-instance
title: 'MongoInstance'
---

API Documentation of `MongoInstance`-Class

## Functions

### new

Typings: `constructor(opts: Partial<MongodOpts>)`

Create an new Instance without starting it

:::tip
When directly starting the instance, [`run`](#static-run) should be used
:::

### debug

Typings: `private debug(msg: string): void`

Format input with debug-message template

### create

Typings: `static async create(opts: Partial<MongodOpts>): Promise<MongoInstance>`

Create an new Instance and start it (while being an Promise)

### prepareCommandArgs

Typings: `prepareCommandArgs(): string[]`

Constructs the Command Arguments

### start

Typings: `async start(): Promise<void>`

Start the `mongod` and the watcher processes

### stop

Typings: `async stop(): Promise<boolean>`

Stop the `mongod` and the watcher processes

:::caution
Will not Error if instance is not running
:::

### _launchMongod

<span class="badge badge--warning">Internal</span>

Typings: `_launchMongod(mongoBin: string): ChildProcess`

Actually spawn the `mongod` process with `ChildProcess`, used by [`run`](#run)

### _launchKiller

<span class="badge badge--warning">Internal</span>

Typings: `_launchKiller(parentPid: number, childPid: number): ChildProcess`

Spawn an killer process that keeps watch over the `mongod` process

### errorHandler

<span class="badge badge--warning">Internal</span>

Typings: `errorHandler(err: string): void`

Error handler for the `mongod` process

### closeHandler

<span class="badge badge--warning">Internal</span>

Typings: `closeHandler(code: number, signal: string): void`

Close handler for the `mongod` process

### stderrHandler

<span class="badge badge--warning">Internal</span>

Typings: `stderrHandler(message: string | Buffer): void`

STDERR handler for the `mongod` process

### stdoutHandler

<span class="badge badge--warning">Internal</span>

Typings: `stdoutHandler(message: string | Buffer): void`

STDOUT handler for the `mongod` process  
Matches process output against known formats and raise events

## Values

### instanceOpts

Typings: `instanceOpts: MongoInstanceOpts`

Stores the Instance Options

### binaryOpts

Typings: `readonly binaryOpts: Readonly<MongoBinaryOpts>`

Stores the Binary Options

### spawnOpts

Typings: `readonly spawnOpts: Readonly<SpawnOptions>`

Stores the Spawn Options

### extraConnectionOptions

<span class="badge badge--warning">Internal</span>

Typings: `extraConnectionOptions?: MongoClientOptions`

Contains extra Connection options used for `mongoClient.connect`, this is mainly used for authentication

### mongodProcess

<span class="badge badge--warning">Internal</span>

Typings: `mongodProcess?: ChildProcess`

Stores the active process reference for the `mongod` process

### killerProcess

<span class="badge badge--warning">Internal</span>

Typings: `killerProcess?: ChildProcess`

Stores the active process reference for the killer process

### isInstancePrimary

Typings: `isInstancePrimary: boolean`

Stores that the process is an Primary (ReplSet) (event emitted when found in STDOUT)

### isInstanceReady

Typings: `isInstanceReady: boolean` (event emitted when found in STDOUT)

Stores that the process is fully started

### isReplSet

Typings: `isReplSet: boolean`

Stores that the process is in an ReplSet, is `true` when [`instanceOpts.replSet`](#instanceopts) is defined and truthy
