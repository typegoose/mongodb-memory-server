"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tmp_1 = __importDefault(require("tmp"));
var get_port_1 = __importDefault(require("get-port"));
var db_util_1 = require("./util/db_util");
var MongoInstance_1 = __importDefault(require("./util/MongoInstance"));
var deprecate_1 = require("./util/deprecate");
tmp_1.default.setGracefulCleanup();
var generateConnectionString = function (port, dbName) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, "mongodb://127.0.0.1:" + port + "/" + dbName];
    });
}); };
var MongoMemoryServer = /** @class */ (function () {
    function MongoMemoryServer(opts) {
        var _this = this;
        this.runningInstance = null;
        this.instanceInfoSync = null;
        this.opts = __assign({}, opts);
        this.debug = function (msg) {
            if (_this.opts.debug) {
                console.log(msg);
            }
        };
        if (!(opts && opts.autoStart === false)) {
            this.debug('Autostarting MongoDB instance...');
            this.start();
        }
    }
    MongoMemoryServer.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.debug('Called MongoMemoryServer.start() method:');
                if (this.runningInstance) {
                    throw new Error('MongoDB instance already in status startup/running/error. Use opts.debug = true for more info.');
                }
                this.runningInstance = this._startUpInstance()
                    .catch(function (err) {
                    if (err.message === 'Mongod shutting down' || err === 'Mongod shutting down') {
                        _this.debug("Mongodb does not started. Trying to start on another port one more time...");
                        if (_this.opts.instance && _this.opts.instance.port) {
                            _this.opts.instance.port = null;
                        }
                        return _this._startUpInstance();
                    }
                    throw err;
                })
                    .catch(function (err) {
                    if (!_this.opts.debug) {
                        throw new Error(err.message + "\n\nUse debug option for more info: " +
                            "new MongoMemoryServer({ debug: true })");
                    }
                    throw err;
                });
                return [2 /*return*/, this.runningInstance.then(function (data) {
                        _this.instanceInfoSync = data;
                        return true;
                    })];
            });
        });
    };
    MongoMemoryServer.prototype._startUpInstance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, tmpDir, instOpts, _a, _b, instance;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        data = {};
                        instOpts = this.opts.instance;
                        _a = data;
                        return [4 /*yield*/, get_port_1.default({ port: (instOpts && instOpts.port) || undefined })];
                    case 1:
                        _a.port = _c.sent();
                        data.dbName = db_util_1.generateDbName(instOpts && instOpts.dbName);
                        _b = data;
                        return [4 /*yield*/, generateConnectionString(data.port, data.dbName)];
                    case 2:
                        _b.uri = _c.sent();
                        data.storageEngine = (instOpts && instOpts.storageEngine) || 'ephemeralForTest';
                        data.replSet = instOpts && instOpts.replSet;
                        if (instOpts && instOpts.dbPath) {
                            data.dbPath = instOpts.dbPath;
                        }
                        else {
                            tmpDir = tmp_1.default.dirSync({
                                discardDescriptor: true,
                                mode: 493,
                                prefix: 'mongo-mem-',
                                unsafeCleanup: true,
                            });
                            data.dbPath = tmpDir.name;
                            data.tmpDir = tmpDir;
                        }
                        this.debug("Starting MongoDB instance with following options: " + JSON.stringify(data));
                        return [4 /*yield*/, MongoInstance_1.default.run({
                                instance: {
                                    dbPath: data.dbPath,
                                    debug: this.opts.instance && this.opts.instance.debug,
                                    port: data.port,
                                    storageEngine: data.storageEngine,
                                    replSet: data.replSet,
                                    args: this.opts.instance && this.opts.instance.args,
                                    auth: this.opts.instance && this.opts.instance.auth,
                                    ip: this.opts.instance && this.opts.instance.ip,
                                },
                                binary: this.opts.binary,
                                spawn: this.opts.spawn,
                                debug: this.debug,
                            })];
                    case 3:
                        instance = _c.sent();
                        data.instance = instance;
                        data.childProcess = instance.childProcess;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    MongoMemoryServer.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, instance, port, tmpDir;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.debug('Called MongoMemoryServer.stop() method');
                        return [4 /*yield*/, this.ensureInstance()];
                    case 1:
                        _a = _b.sent(), instance = _a.instance, port = _a.port, tmpDir = _a.tmpDir;
                        this.debug("Shutdown MongoDB server on port " + port + " with pid " + (instance.getPid() || ''));
                        return [4 /*yield*/, instance.kill()];
                    case 2:
                        _b.sent();
                        this.runningInstance = null;
                        this.instanceInfoSync = null;
                        if (tmpDir) {
                            this.debug("Removing tmpDir " + tmpDir.name);
                            tmpDir.removeCallback();
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    MongoMemoryServer.prototype.getInstanceInfo = function () {
        return this.instanceInfoSync || false;
    };
    /* @deprecated 5.0.0 */
    MongoMemoryServer.prototype.getInstanceData = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                deprecate_1.deprecate("method MongoMemoryServer.getInstanceData() will be deprecated. Please use 'MongoMemoryServer.ensureInstance()' method instead.");
                return [2 /*return*/, this.ensureInstance()];
            });
        });
    };
    MongoMemoryServer.prototype.ensureInstance = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.debug('Called MongoMemoryServer.ensureInstance() method:');
                        if (!!this.runningInstance) return [3 /*break*/, 2];
                        this.debug(' - no running instance, call `start()` command');
                        return [4 /*yield*/, this.start()];
                    case 1:
                        _a.sent();
                        this.debug(' - `start()` command was succesfully resolved');
                        _a.label = 2;
                    case 2:
                        if (this.runningInstance) {
                            return [2 /*return*/, this.runningInstance];
                        }
                        throw new Error('Database instance is not running. You should start database by calling start() method. BTW it should start automatically if opts.autoStart!=false. Also you may provide opts.debug=true for more info.');
                }
            });
        });
    };
    MongoMemoryServer.prototype.getUri = function (otherDbName) {
        if (otherDbName === void 0) { otherDbName = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, uri, port;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.ensureInstance()];
                    case 1:
                        _a = _b.sent(), uri = _a.uri, port = _a.port;
                        // IF true OR string
                        if (otherDbName) {
                            if (typeof otherDbName === 'string') {
                                // generate uri with provided DB name on existed DB instance
                                return [2 /*return*/, generateConnectionString(port, otherDbName)];
                            }
                            // generate new random db name
                            return [2 /*return*/, generateConnectionString(port, db_util_1.generateDbName())];
                        }
                        return [2 /*return*/, uri];
                }
            });
        });
    };
    MongoMemoryServer.prototype.getConnectionString = function (otherDbName) {
        if (otherDbName === void 0) { otherDbName = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getUri(otherDbName)];
            });
        });
    };
    MongoMemoryServer.prototype.getPort = function () {
        return __awaiter(this, void 0, void 0, function () {
            var port;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureInstance()];
                    case 1:
                        port = (_a.sent()).port;
                        return [2 /*return*/, port];
                }
            });
        });
    };
    MongoMemoryServer.prototype.getDbPath = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dbPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureInstance()];
                    case 1:
                        dbPath = (_a.sent()).dbPath;
                        return [2 /*return*/, dbPath];
                }
            });
        });
    };
    MongoMemoryServer.prototype.getDbName = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dbName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensureInstance()];
                    case 1:
                        dbName = (_a.sent()).dbName;
                        return [2 /*return*/, dbName];
                }
            });
        });
    };
    return MongoMemoryServer;
}());
exports.default = MongoMemoryServer;
//# sourceMappingURL=MongoMemoryServer.js.map