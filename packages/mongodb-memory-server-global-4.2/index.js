/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

var setDefaultValue = require('../mongodb-memory-server-core/lib/util/resolveConfig')
  .setDefaultValue;
var version = require('./package.json').mongodb_version;
setDefaultValue('VERSION', version);

const tslib = require('tslib');
tslib.__exportStar(require('mongodb-memory-server-core'), exports);
