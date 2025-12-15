This website is built using [Docusaurus 2](https://v2.docusaurus.io/), a modern static website generator.

Note: `npm` is required otherwise, some plugins don't work

## Installation

```sh
npm i
```

## Local Development

```sh
npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```sh
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

```sh
GIT_USER=<Your GitHub username> USE_SSH=true npm run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
