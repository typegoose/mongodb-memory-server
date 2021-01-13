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

### static-run

Typings: `static async run(opts: Partial<MongodOpts>): Promise<MongoInstance>`

Create an new Instance and start it (while being an Promise)

### prepareCommandArgs

Typings: `prepareCommandArgs(): string[]`

Constructs the Command Arguments

### run

Typings: `async run(): Promise<this>`

Start the `mongod` process

### kill

Typings: `async kill(): Promise<MongoInstance>`

Stop the `mongod` process

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

Typings: `closeHandler(code: number): void`

Close handler for the `mongod` process

### stderrHandler

<span class="badge badge--warning">Internal</span>

Typings: `stderrHandler(message: string | Buffer): void`

STDERR handler for the `mongod` process

### stdoutHandler

<span class="badge badge--warning">Internal</span>

Typings: `stdoutHandler(message: string | Buffer): void`

STDOUT handler for the `mongod` process<br/>
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

### childProcess

<span class="badge badge--warning">Internal</span>

Typings: `childProcess?: ChildProcess`

Stores the active process reference for the `mongod` process

### killerProcess

<span class="badge badge--warning">Internal</span>

Typings: `killerProcess?: ChildProcess`

Stores the active process reference for the killer process

### isInstancePrimary

Typings: `isInstancePrimary: boolean`

Stores that the process is an Primary (ReplSet)

### isInstanceReady

Typings: `isInstanceReady: boolean`

Stores that the process is fully started

### isReplSet

Typings: `isReplSet: boolean`

Stores that the process is in an ReplSet
