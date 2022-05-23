---
id: known-issues
title: 'Known Issues'
---

## ArchLinux on Docker

It is known that ArchLinux on Docker does not have an `/etc/os-release` or `/etc/lsb-release`, so detection will not work.

Workaround:

- Create one of these files (either manually, or install `lsb-release`)
- Use a SystemBinary with [`SYSTEM_BINARY`](../api/config-options.md#SYSTEM_BINARY)
- Use an pre-set Archive Name to be used with [`ARCHIVE_NAME`](../api/config-options.md#ARCHIVE_NAME)

## No Build available for Alpine Linux

It is known that [AlpineLinux](./supported-systems.md#Alpine) does not have an official build (and no build like the ubuntu build works).

Workaround:

- Use a SystemBinary with [`SYSTEM_BINARY`](../api/config-options.md#SYSTEM_BINARY)
- Do not use AlpineLinux

## libcurl on slim Docker images

Docker images of the "slim" variety often don't have `libcurl` installed, such as [the official "slim" Node.js image](https://hub.docker.com/_/node) or [sitespeed.io node](https://hub.docker.com/r/sitespeedio/node).  
If you don't install it manually, then `mongodb-memory-server` will not start up in your container, with the following exception message:

> Instance Exited before being ready and without throwing an error!

This can easily be resolved by installing it in your image:

```sh
apt-get install libcurl4
```
