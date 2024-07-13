---
name: Distribution Support
about: Add support for a Linux Distribution or a Windows Version or a MacOS version
title: 'Add Support for "Your Distro here"'
labels: Distribution support
assignees: 'hasezoey'
---

<!--
Make sure you read [Mastering-Markdown](https://guides.github.com/features/mastering-markdown/)

List of currently [Supported Systems](https://typegoose.github.io/mongodb-memory-server/docs/guides/supported-systems)
-->

## Versions

<!--
"Wanted System" formatting like: "Windows 10 1804" / "Ubuntu 20.04" / "MacOS 10"
Possible "Architecture": "x86_64" / "aarch64" / "arm64"
-->

- Wanted System: `Distro / System here`
- Architecture: `arch here`

## Detection

<!--Please Provide the following Outputs, depending on what System you are using
Comment out the appropiate one-->

<!--Linux
Please provide the following Output of the Commands even if the files do not exist

```sh
$ cat /etc/upstream-release/lsb-release

Output Here

$ cat /etc/os-release

Output Here

$ cat /usr/lib/os-release

Output Here

$ cat /etc/lsb-release

Output Here
```
-->

<!--Windows
NodeJS REPL or save as script and execute
```js
const os = require('os);

console.log("Platform", os.platform());
console.log("Arch", os.arch());
```
-->

<!--Macos
NodeJS REPL or save as script and execute
```js
const os = require('os);

console.log("Platform", os.platform());
console.log("Arch", os.arch());
```
-->

## Current Error

<!--Please include the current error you are having, if any-->
<!--Also if you see any "Falling back to legacy MongoDB build!" please include Debug Output, see https://typegoose.github.io/mongodb-memory-server/docs/guides/enable-debug-mode -->

```txt
Paste Error in Here
```

## Extra

<!--Extra Comments here-->
