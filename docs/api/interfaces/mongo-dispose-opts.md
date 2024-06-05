---
id: mongo-memory-dispose-opts
title: 'DisposeOptions'
---

API Documentation of `DisposeOptions`-Interface

## Values for `DisposeOptions`

### enabled

Typings: `enabled?: boolean`

Set whether to stop the manager on `[Symbol.asyncDispose]` calls.

### cleanup

Typings: `cleanup?: Cleanup`

Set custom cleanup options to be used for disposal, see [`cleanup` function](../classes/mongo-memory-server.md#cleanup) (the same options apply for the replset).
