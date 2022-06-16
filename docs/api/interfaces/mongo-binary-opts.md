---
id: mongo-memory-binary-opts
title: 'MongoBinaryOpts'
---

API Documentation of `MongoBinaryOpts`-Interface

## Values for `MongoBinaryOpts`

Inherits most values from [`BaseDryMongoBinaryOptions`](#values-for-basedrymongobinaryoptions).

### checkMD5

Typings: `checkMD5?: boolean`

Set wheter to perform a MD5 check on the downloaded archive.

## Values for `BaseDryMongoBinaryOptions`

### version

Typings: `version?: string`

Set which binary version to download, see [config option `VERSION`](../config-options.md#version) for more.

### downloadDir

Typings: `downloadDir?: string`

Set the directory where binaries will be downloaded to, when a download needs to happen. If a binary is not found in this directory, the other default directories will also be searched.

### os

Typings: `os?: AnyOS`

Set OS information that is necessary for generating the archive name, uses [`AnyOS`](#helper-type-anyos).

### arch

Typings: `arch?: string`

Set which Architecture to use,supports the same values as [config option `ARCH`](../config-options.md#arch).

### platform

Typings: `platform?: string`

Set which Platform to use,supports the same values as [config option `PLATFORM`](../config-options.md#platform).

### systemBinary

Typings: `systemBinary?: string`

Set the SystemBinary path, if set this path will be used instead of finding a binary.  
If this path does not exist or does not have the required permissions, a error will be thrown instead of downloading.

## Helper Type `AnyOS`

Typings: `AnyOS = OtherOS | LinuxOS`

Uses either [`OtherOS`](#values-for-otheros) or [`LinuxOS`](#values-for-linuxos).

## Values for `OtherOS`

### os {#otheros-os}

Typings: `os: 'aix' | 'android' | 'darwin' | 'freebsd' | 'openbsd' | 'sunos' | 'win32' | 'cygwin' | string`

Set the Platform the current system is on.

## Values for `LinuxOS`

Inherits from [`OtherOS`](#values-for-otheros).

### os {#linuxos-os}

Typings: `os: 'linux'`

Value of the current Platform the system is on. In [`LinuxOS`](#values-for-linuxos), this value can only be `linux`.

### dist

Typings: `dist: string`

Value of the current Distribution the current system is on.

### release

Typings: `release: string`

Value of the current Release the Distribution is on.

### codename

Typings: `codename?: string`

Value of the codename of the current Distribution Release.

### id_like

Typings: `id_like?: string[]`

List of Distributions this Distribution is like.
