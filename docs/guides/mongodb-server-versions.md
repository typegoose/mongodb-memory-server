---
id: mongodb-server-versions
title: 'Mongodb Server Versions'
---


This Guide will show what MongoDB Server versions are / were the default for versions of `mongodb-memory-server-core` and the guidelines of when a version gets changed.

*<sub>Some expressions will use [npm's semver convention](https://www.npmjs.com/package/semver).</sub>*

## When a Version gets upgraded

In a new major version of `mongodb-memory-server-core` (`X.0.0`), the default mongodb binary version may be upgraded to any newer version (`X.X.X`).  
In a minor version of `mongodb-memory-server-core` (`0.X.0`), the default mongodb binary version may be upgraded to the latest patch version `0.0.X`.  
In a patch version of `mongodb-memory-server-core` (`0.0.X`), the default mongodb binary version will not be changed.

There are some exceptions:

- A mongodb binary may go offline (not being able to download it anymore), then the default version will be changed and a *minor* (`0.X.0`) release will happen.
- A mongodb binary may be broken, then the default version will be changed and a *minor* (`0.X.0`) release will happen.

The versions with a broken default binary may get deprecated (when possible).

For Packages that are named with a version (like `mongodb-memory-server-global-4.2`), the patch version (`0.0.X`) of a binary may be changed with minor (`0.X.0`) releases.

:::note
Starting with MongoDB version 5.0, the default versions for `mongodb-memory-server-core` will only be major `X.0.0` versions (no `X.X.0` versions), see [MongoDB Versioning](https://docs.mongodb.com/manual/reference/versioning/#std-label-release-version-numbers).
:::

## `mongodb-memory-server-core` Version Table

| `mongodb-memory-server-core` Version | Default MongoDB Version |
| :----------------------------------: | :---------------------: |
|           8.13.x - 8.13.x            |         5.0.18          |
|           8.11.x - 8.12.x            |         5.0.13          |
|            8.6.x - 8.10.x            |          5.0.8          |
|            8.0.x - 8.5.x             |          5.0.3          |
|            7.5.x - 7.5.x             |         4.0.27          |
|            7.0.x - 7.4.x             |         4.0.25          |
|            6.4.x - 6.9.x             |         4.0.14          |
|            6.0.x - 6.4.x             |          4.0.3          |

## `mongodb-memory-server-global-*` Version Table

This Section will show all `mongodb-memory-server-global-*` packages that ever existed for this Project, what Version they provide in the latest version and what Branch they will be updated from.

If the branch is named like `old/`, then it means that this package will not be updated for new major MMS versions anymore. (Example if the package is in `old/6.x`, then it will not get any updates to MMS 7.0 or higher)

|            Package Name            | Provided MongoDB Version | Current Branch |
| :--------------------------------: | :----------------------: | :------------: |
| `mongodb-memory-server-global-4.4` |          4.4.22          |    `master`    |
| `mongodb-memory-server-global-4.2` |          4.2.18          |    `master`    |
| `mongodb-memory-server-global-4.0` |          4.0.28          |    `master`    |
| `mongodb-memory-server-global-3.6` |          3.6.23          |   `old/7.x`    |
| `mongodb-memory-server-global-3.4` |          3.4.20          |   `old/6.x`    |
