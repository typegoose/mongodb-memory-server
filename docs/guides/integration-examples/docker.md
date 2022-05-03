---
id: docker
title: 'Integration with Docker'
---

This Guide will show how `mongodb-memory-server` can be used with Docker & dockerfiles.

## Important Notes before Starting

:::caution
It is common that images like `node:16-alpine` are used, which will not work with this package, because mongodb does not provide binaries for Alpine yet.
It is recommended to switch to images like `node:16` (or `node:16-buster`) for Debian builds.

See [No Build available for Alpine Linux](../known-issues.md#no-build-available-for-alpine-linux).
:::

:::caution
Docker Debian builds (at least with `debian:11`), extra packages have to be installed:

```sh
apt-get install libcurl4 # for Debian 10+ to fix CURL_OPENSSL_4
# OR
apt-get install libcurl3 # for Debian 9 (and before) to fix CURL_OPENSSL_3
```

:::

## Writing a dockerfile with mongodb binary caching

Sometimes you want to have the tests isolated from the host system and also have caching working for mongodb-memory-server.

### `.dockerignore`

If no `.dockerignore` is specified or the following instructions added to the `dockerfile`, some cases may happen:

- Best case is just added bloat if the host system is not debian (like having the host's mongodb binary copied into the image)
- If the host system is Debian (and to that not matching version), then the host's mongodb binary is copied in and will be used instead of downloading the actual required mongodb binary

It is not required to have, but preferred over having a additional step in the dockerfile:

```dockerignore
# ignore all node_modules, no matter where, like when having a monorepo
**/node_modules
```

If a dockerignore is not specified, a additional instruction can be used instead:

```dockerfile
# ...
COPY node:node . /project

# Put this Instruction between the 2 other instructions mentioned in this example
# The following deleted all directories it finds that are a directory AND have a name matching "node_modules" (also removes nested directories)
RUN find . -type d -iname "node_modules" -exec rm -rf {} \;

RUN npm install
# ...
```

### `dockerfile`

The following is the recommended way to make a image with mongodb-memory-server

:::note
The following `dockerfile` has examples for 2 package managers: `npm` and `yarn`, be sure to remove the one that will not be used.
:::

```dockerfile
# Using a Debian build
FROM node:16

# Installing "libcurl4" because some Debian images may not come with this package installed, but is required by the mongodb binaries
RUN apt-get install libcurl4

# Settings the CWD (Current Work Directory) to "/project" to have a isolated folder for the project
# Note: it is not recommended to set it to "/home/dockeruser", but to use "/home/dockeruser/project"
WORKDIR /project

# Copy the project (all files) into the image into "/project" as user "node:node"
# User "node:node" is the default nodejs user in the docker images
COPY node:node . /project

# Explicitly set the user that will be used for the next Instructions and ENTRYPOINT
USER node

# Install all required dependencies locked to the package-lock (or yarn.lock)
# Replace "npm install" with your package manager command of choice
RUN npm install --ci
# OR
RUN yarn install --frozen-lockfile

# Set the default command that will be used when running the image
# Replace this with your command / package manager command of choice
ENTRYPOINT ["npm", "run", "test"]
# OR
ENTRYPOINT ["yarn", "run", "test"]
```
