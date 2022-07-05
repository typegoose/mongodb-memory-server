---
id: dry-mongo-binary
title: 'DryMongoBinary'
---

API Documentation of `DryMongoBinary`-Class

## Functions

:::note
This class is not actually meant to be constructed, it only consists of static functions & values
:::

### locateBinary

Typings: `static async locateBinary(opts: DryMongoBinaryOptions): Promise<string | undefined>`

Try to locate a existing binary without downloading or touching the filesystem much.

### generateOptions

Typings: `static async generateOptions(opts?: DryMongoBinaryOptions): Promise<Required<DryMongoBinaryOptions>>`

Generate a full `DryMongoBinaryOptions` from partial input.

### parseArchiveNameRegex

Typings: `static parseArchiveNameRegex(input: string, opts: Required<DryMongoBinaryOptions>): Required<DryMongoBinaryOptions>`

Parse a archive name into useable options.

### getBinaryName

Typings: `static async getBinaryName(opts: DryMongoBinaryNameOptions): Promise<string>`

Get what the binary name should be formatted like.  
If [`USE_ARCHIVE_NAME_FOR_BINARY_NAME`](../config-options.md#use_archive_name_for_binary_name) is `true`, then the archive name will be used instead of what MMS uses by default.

### combineBinaryName

Typings: `static combineBinaryName(basePath: string, binaryName: string): string`

Helper function to consistently combine a `basePath` with the `binaryName` (eg. `/path/to/binary`)

### getSytemPath

Typings: `static async getSystemPath(systemBinary: string): Promise<string | undefined>`

Check if the given path has all the permissions required to be executed.

### generatePaths

Typings: `static async generatePaths(opts: DryMongoBinaryOptions & DryMongoBinaryNameOptions): Promise<DryMongoBinaryPaths>`

Get the Paths where binaries may be located in.

### generateDownloadPath

Typings: `static async generateDownloadPath(opts: DryMongoBinaryOptions & DryMongoBinaryNameOptions): Promise<[boolean, string]>`

Get the path where the binary will be downloaded to.

### homedir

<span class="badge badge--warning">Internal</span>

Typings: `private static homedir(): string`

Used to get the Home-Dir of the current user, it is a function on the class for easy-mocking, because `os.homedir` cannot be easily be mocked in jest.

## Values

### binaryCache

Typings: `static binaryCache: Map<string, string> = new Map()`

Cache for already found binaries to not hit the filesystem too much.
