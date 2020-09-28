'use strict';
function __export(m) {
  for (var p in m) {
    if (p === "default") exports.default = m[p];
    if (!exports.hasOwnProperty(p)) exports[p] = m[p];
  }
}

var setDefaultValue = require('../mongodb-memory-server-core/lib/util/resolve-config')
  .setDefaultValue;
var version = require('./package.json').mongodb_version;
setDefaultValue('VERSION', version);

Object.defineProperty(exports, '__esModule', { value: true });
__export(require('mongodb-memory-server-core'));
