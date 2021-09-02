---
id: enable-debug-mode
title: 'Enable Debug Mode'
---

The Debug Mode can be enabled by setting the [`DEBUG`](../api/config-options.md#debug) config options, by either setting it as a [Environment Variable](../api/config-options#how-to-use-them-as-environment-variables) or [`package.json` option](../api/config-options#how-to-use-them-in-the-packagejson).

## Examples

### Via Environment Variable

```sh
# also available case-insensitive values: "on" "yes" "true"
MONGOMS_DEBUG=1 npm run command
```

### Via `package.json` config

```json
{
  "config": {
    "mongodbMemoryServer": {
      "debug": "1", // also available case-insensitive values: "on" "yes" "true"
    }
  }
}
```
