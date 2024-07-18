---
id: mongo-memory-server-opts
title: 'MongoMemoryServerOpts'
---

API Documentation of `MongoMemoryServerOpts`-Interface

## Values

### instance

Typings: `instance?: MemoryServerInstanceOpts & ExtraOptions`

Set custom options based on [`MongoMemoryInstanceOpts`](./mongo-memory-instance-opts.md), but ignores some properties:

- `auth` is ignored because it is set via [auth](#auth) property.

Extra options specific to [`MongoMemoryServer` class](../classes/mongo-memory-server.md):

- `portGeneration`: enable / disable port generation, enabled by default.

### binary

Typings: `binary?: MongoBinaryOpts`

Set custom options for finding the binary, uses [`MongoBinaryOpts`](./mongo-binary-opts.md).

### spawn

Typings: `spawn?: SpawnOptions`

Set custom spawn options for spawning processes, uses [`SpawnOptions`](https://nodejs.org/api/child_process.html#child_processspawncommand-args-options)

### auth

Typings: `auth?: AutomaticAuth`

Set custom Authentication options for the instance, uses [`AutomaticAuth`](./mongo-memory-server-automaticauth.md).

### dispose

Typings: `dispose?: DisposeOptions`

Set custom behavior for when `[Symbol.asyncDispose]` is called, uses [`DisposeOptions`](./mongo-dispose-opts.md).
