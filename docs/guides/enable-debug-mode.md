---
id: enable-debug-mode
title: 'Enable Debug Mode'
---

The Debug Mode can be enabled by setting the [`DEBUG`](../api/config-options.md#debug) config options, which can be done by either setting it as a [Environment Variable](../api/config-options#how-to-use-them-as-environment-variables) or [`package.json` option](../api/config-options#how-to-use-them-in-the-packagejson).

## Examples

### Via Environment Variable

```sh
# also available case-insensitive values: "on" "yes" "true"
MONGOMS_DEBUG=1 npm run test
```

### Via `package.json` config

```json
{
  "config": {
    "mongodbMemoryServer": {
      "debug": "1" // also available case-insensitive values: "on" "yes" "true"
    }
  }
}
```

## Extra Notes

### npm quirks

Starting with NPM 7, scripts (like `postinstall`) will run in parallel and will not output any logging, but sometimes in `mongodb-memory-server` it is required to provide the Debug Log from a `postinstall` script.

Logging can be temporarly enabled with:

```sh
# Change scripts to be executed on the NPM main proccess instead of workers AND log script output
MONGOMS_DEBUG=1 npm install --foreground-scripts
```
