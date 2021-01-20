---
id: quick-start-guide
title: 'Quick Start Guide'
---

This Guide will show how to setup this package

## Requirements

- NodeJS: 10.15+
- Typescript: 3.8+ (if used)

:::info
When using NodeJS below 12.10, package `rimraf` needs to be installed (when using cleanup with `force`)
:::

When on Linux, one of the following are required:

- having `lsb-core` installed (or any that provides the `lsb_release` command)
- having an `/etc/os-release` file that is compliant to the [OS-Release Spec](https://www.freedesktop.org/software/systemd/man/os-release.html)
- having an `/etc/*-release` file that is compliant to the [OS-Release Spec](https://www.freedesktop.org/software/systemd/man/os-release.html) (and does not include `lsb`)
- manually specify which version & system should be used

## Choose the right package

There are multiple packages for this project, here are the differences:

- `mongodb-memory-server-core` is the main package, which dosnt have any hooks
- `mongodb-memory-server` adds hooks to install on `yarn install` or `npm install` to install the latest package locally
- `mongodb-memory-server-global` adds hooks to install on `yarn install` or `npm install` to install the latest package globally (into $HOME)
- `mongodb-memory-server-global-X.X` adds hooks to install on `yarn install` or `npm install` to install MongoDB with version `X.X` globally (into $HOME)

## Normal Server

*needs to be extended*

## ReplicaSet

*needs to be extended*
