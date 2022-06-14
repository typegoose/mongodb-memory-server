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
- ~~`ia32` / `i686` / `i386`~~ (There are only binaries up to ~3.2 and [will be removed with the next MMS version](https://github.com/nodkz/mongodb-memory-server/issues/638))

:::note
On systems with native translation, will work when overwriting the architecture with `MONGOMS_ARCH=x64`
:::

---

Legend:

- <span class="badge badge--success">Supported</span> means that it is supported by mongodb natively or is a distro that is based on a supported distro.
- <span class="badge badge--warning">Untested</span> means that it is not tested on hardware and so not verified to work.
- <span class="badge badge--warning">Outdated</span> means that the current mappings for MMS are outdated and may not have proper tests.
- <span class="badge badge--danger">Unsupported</span> means that it is unsupported by MMS *and* mongodb.
- <span class="badge badge--secondary">Working</span> means that it is supported by MMS but not by mongodb natively and not based on a supported distro.

## Windows

<span class="badge badge--success">Supported</span>

Should just work out of the box

## MacOS

<span class="badge badge--success">Supported</span>

On x64 systems, it should work right out of the box<br/>
On Arm64 systems, the architecture needs to be overwritten with `MONGOMS_ARCH=x64`, only exception being (and based on) `ubuntu`

## Linux

Depends on the distribution, many common ones should just work right out of the box

### Ubuntu (and based on systems)

<span class="badge badge--success">Supported</span>

(uses mongodb's `ubuntu` release)<br/>
Lowest supported Distribution version is `1404`<br/>
Highest version is `2204`<br/>
Default version is `1404`
:::note
Lower Versions than `2004` may be used if mongodb dosnt provide binaries for an lower version of mongodb for an higher version of ubuntu
:::
:::note
For Arm64 MongoDB only provides binaries for `ubuntu1604`
:::
:::note
There are currently no native binaries for `2204`, so it is mapped to `2004` and will require `libssl1.1` to be installed.  
See [this mongodb issue](https://jira.mongodb.org/browse/SERVER-62300).
:::

### Debian

<span class="badge badge--success">Supported</span>

(uses mongodb's `debian` release)<br/>
Lowest supported Distribution version is `71`<br/>
Highest version is `11`<br/>
Default version is `10` (when in `unstable` or `testing`, otherwise none)

### Fedora

<span class="badge badge--success">Supported</span>

(uses mongodb's `rhel` release)<br/>
Lowest supported Distribution version is `6`<br/>
Highest version is `18`<br/>
Default version is `34` (when above or equal to `34`, otherwise none)

### Rhel

<span class="badge badge--warning">Untested</span> <span class="badge badge--warning">Outdated</span>

(uses mongodb's `rhel` release)<br/>
Lowest supported Distribution version is `5`<br/>
Highest version is `8`<br/>
Default version is `70`

### Amazon

<span class="badge badge--success">Supported</span>

(uses mongodb's `amazon` release)<br/>
Lowest supported Distribution version is `1`<br/>
Highest version is `2`<br/>
Default version is `1`

### ElementaryOS

<span class="badge badge--warning">Outdated</span>

(uses mongodb's `ubuntu` release)<br/>
Lowest supported Distribution version is `3` (or `0.3`)<br/>
Highest version is `6`<br/>
Default version is `6`

### Linux Mint

<span class="badge badge--success">Supported</span>

(uses mongodb's `ubuntu` release)<br/>
Lowest supported Distribution version is `17`<br/>
Highest version is `20`<br/>
Default version is `20`

### Suse

<span class="badge badge--warning">Untested</span> <span class="badge badge--warning">Outdated</span>

(uses mongodb's `suse` release)<br/>
Lowest supported Distribution version is `11`<br/>
Highest version is `12`<br/>
Default version is none

### Arch

<span class="badge badge--danger">Unsupported</span> <span class="badge badge--secondary">Working</span>

There are no official mongodb builds for Arch Distributions, but the `ubuntu` binaries work on most Arch systems, so they are used.<br/>
Currently Mapping to: `ubuntu2004`

:::note
Because Arch* dosnt base on ubuntu, there is no specific ubuntu version associated with an arch version, so it defaults to highest supported `ubuntu` version
:::

### Gentoo

<span class="badge badge--danger">Unsupported</span> <span class="badge badge--secondary">Working</span>

There are no official mongodb builds for Gentoo Distributions, but the `debian` binaries work on most Gentoo systems, so they are used.<br/>
Currently Mapping to: `debain11`

:::note
Because Gentoo dosnt base on debian, there is no specific debian version associated with an gentoo version, so it defaults to highest supported `debian` version
:::

### Alpine

<span class="badge badge--danger">Unsupported</span>

There are no official mongodb builds alpine, though there are some unoffical build of mongodb build for it which can be used
