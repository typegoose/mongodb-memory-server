---
id: supported-systems
title: 'Supported Systems'
---

Currently Supported platforms:
<!--Platfrom taken from "MongoBinaryDownloadUrl.get*"-->
- `win32` / `windows`
- `macos` / `osx` / `darwin`
- `linux`

Officially Supported Architectures:
<!--Platfrom taken from "MongoBinaryDownloadUrl.translateArch"-->
- `x64` / `x86_64`
- `ia32` / `i686` / `i386`

:::note
On systems with native translation, will work when overwriting the architecture with `MONGOMS_ARCH=x64`
:::

## Windows

Should just work out of the box

## MacOS

On x64 systems, it should work right out of the box<br/>
On Arm64 systems, the architecture needs to be overwritten with `MONGOMS_ARCH=x64`

## Linux

Depends on the distribution, many common ones should just work right out of the box

### Ubuntu (and based on systems)

(uses mongodb's `ubuntu` release)<br/>
Lowest supported Distribution version is `1404`<br/>
Highest version (default to) is `1804` (because there dont exist higher-dist versions of mongod's lower versions)

### Debian

(uses mongodb's `debian` release)<br/>
Lowest supported Distribution version is `71`<br/>
Highest version (default to) is `10`

### Fedora

(uses mongodb's `rhel` release)<br/>
Lowest supported Distribution version is `6`<br/>
Highest version (default to) is `18`

### Rhel

(uses mongodb's `rhel` release)<br/>
Lowest supported Distribution version is `5`<br/>
Highest version (default to) is `8`

### ElementaryOS

(uses mongodb's `ubuntu` release)<br/>
Lowest supported Distribution version is `?` (direct translation of lsb_release)<br/>
Highest version (default to) is `?` (direct translation of lsb_release)

### Linux Mint

(uses mongodb's `ubuntu` release)<br/>
Lowest supported Distribution version is `17`<br/>
Highest version (default to) is `20`

### Suse

(uses mongodb's `suse` release)<br/>
Lowest supported Distribution version is `11`<br/>
Highest version (default to) is `12`
