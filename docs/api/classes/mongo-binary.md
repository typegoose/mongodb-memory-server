---
id: mongo-binary
title: 'MongoBinary'
---

API Documentation of `MongoBinary`-Class

## Functions

:::note
This class is not actually meant to be constructed, it only consists of static functions & values
:::

### download

Typings: `static async download(options: Required<MongoBinaryOpts>): Promise<string>`

Try to find the binary and if not found download the binary.

### getPath

Typings: `static async getPath(opts: MongoBinaryOpts = {}): Promise<string>`

Get a working binary and returns the path to it.  
(Calls [`download`](#download) if [`RUNTIME_DOWNLOAD`](../config-options.md#runtime_download) is `true`)
