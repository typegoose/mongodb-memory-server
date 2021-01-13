---
id: mongo-binary
title: 'MongoBinary'
---

API Documentation of `MongoBinary`-Class

## Functions

:::note
This class is not actually meant to be constructed, it only consists of static functions & values
:::

### getSystemPath

Typings: `static async getSystemPath(systemBinary: string): Promise<string | undefined>`

Try to stat the given `systemBinary` path, and return it if successfull, otherwise `undefined`

### getDownloadPath

Typings: `static async getDownloadPath(options: Required<MongoBinaryOpts>): Promise<string>`

Get an binary from cache or download it

### getPath

Typings: `static async getPath(opts: MongoBinaryOpts = {}): Promise<string>`

Get an working binary and returns the path to it<br/>
(Calls [`getDownloadPath`](#getdownloadpath))

## Values

### cache

Typings: `static cache: Map<string, string>`

Global Cache for binaries
