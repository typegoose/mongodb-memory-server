"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var mongodb_1 = require("mongodb");
var MongoMemoryServer_1 = __importDefault(require("./MongoMemoryServer"));
var db_util_1 = require("./util/db_util");
var MongoMemoryReplSet = /** @class */ (function (_super) {
    __extends(MongoMemoryReplSet, _super);
    function MongoMemoryReplSet(opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this) || this;
        _this.servers = [];
        var replSetDefaults = {
            auth: false,
            args: [],
            name: 'testset',
            count: 1,
            dbName: db_util_1.generateDbName(),
            ip: '127.0.0.1',
            oplogSize: 1,
            spawn: {},
            storageEngine: 'ephemeralForTest',
        };
        _this._state = 'stopped';
        _this.opts = {
            binary: opts.binary || {},
            debug: !!opts.debug,
            instanceOpts: opts.instanceOpts || [],
            replSet: __assign({}, replSetDefaults, opts.replSet),
        };
        _this.opts.replSet.args.push('--oplogSize', "" + _this.opts.replSet.oplogSize);
        _this.debug = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!_this.opts.debug)
                return;
            console.log.apply(console, args);
        };
        if (!(opts && opts.autoStart === false)) {
            _this.debug('Autostarting MongoMemoryReplSet.');
            setTimeout(function () { return _this.start(); }, 0);
        }
        process.on('beforeExit', function () { return _this.stop(); });
        return _this;
    }
    MongoMemoryReplSet.prototype.getConnectionString = function (otherDb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getUri(otherDb)];
            });
        });
    };
    /**
     * Returns database name.
     */
    MongoMemoryReplSet.prototype.getDbName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // this function is only async for consistency with MongoMemoryServer
                // I don't see much point to either of them being async but don't
                // care enough to change it and introduce a breaking change.
                return [2 /*return*/, this.opts.replSet.dbName];
            });
        });
    };
    /**
     * Returns instance options suitable for a MongoMemoryServer.
     * @param {MongoMemoryInstancePropBaseT} baseOpts
     */
    MongoMemoryReplSet.prototype.getInstanceOpts = function (baseOpts) {
        if (baseOpts === void 0) { baseOpts = {}; }
        var rsOpts = this.opts.replSet;
        var opts = {
            auth: !!rsOpts.auth,
            args: rsOpts.args,
            dbName: rsOpts.dbName,
            ip: rsOpts.ip,
            replSet: rsOpts.name,
            storageEngine: rsOpts.storageEngine,
        };
        if (baseOpts.args)
            opts.args = rsOpts.args.concat(baseOpts.args);
        if (baseOpts.port)
            opts.port = baseOpts.port;
        if (baseOpts.dbPath)
            opts.dbPath = baseOpts.dbPath;
        if (baseOpts.storageEngine)
            opts.storageEngine = baseOpts.storageEngine;
        this.debug('   instance opts:', opts);
        return opts;
    };
    /**
     * Returns a mongodb: URI to connect to a given database.
     */
    MongoMemoryReplSet.prototype.getUri = function (otherDb) {
        return __awaiter(this, void 0, void 0, function () {
            var dbName, ports, hosts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._state === 'init')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._waitForPrimary()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (this._state !== 'running') {
                            throw new Error('Replica Set is not running. Use opts.debug for more info.');
                        }
                        if (otherDb) {
                            dbName = typeof otherDb === 'string' ? otherDb : db_util_1.generateDbName();
                        }
                        else {
                            dbName = this.opts.replSet.dbName;
                        }
                        return [4 /*yield*/, Promise.all(this.servers.map(function (s) { return s.getPort(); }))];
                    case 3:
                        ports = _a.sent();
                        hosts = ports.map(function (port) { return "127.0.0.1:" + port; }).join(',');
                        return [2 /*return*/, "mongodb://" + hosts + "/" + dbName];
                }
            });
        });
    };
    /**
     * Start underlying `mongod` instances.
     */
    MongoMemoryReplSet.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var servers, server;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.debug('start');
                        if (this._state !== 'stopped') {
                            throw new Error("Already in 'init' or 'running' state. Use opts.debug = true for more info.");
                        }
                        this.emit((this._state = 'init'));
                        this.debug('init');
                        servers = this.opts.instanceOpts.map(function (opts) {
                            _this.debug('  starting server from instanceOpts:', opts, '...');
                            return _this._startServer(_this.getInstanceOpts(opts));
                        });
                        while (servers.length < this.opts.replSet.count) {
                            this.debug('  starting a server due to count...');
                            server = this._startServer(this.getInstanceOpts({}));
                            servers.push(server);
                        }
                        this.servers = servers;
                        // Brief delay to wait for servers to start up.
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 1:
                        // Brief delay to wait for servers to start up.
                        _a.sent();
                        return [4 /*yield*/, this._initReplSet()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Stop the underlying `mongod` instance(s).
     */
    MongoMemoryReplSet.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            var servers;
            var _this = this;
            return __generator(this, function (_a) {
                if (this._state === 'stopped')
                    return [2 /*return*/, false];
                servers = this.servers;
                this.servers = [];
                return [2 /*return*/, Promise.all(servers.map(function (s) { return s.stop(); }))
                        .then(function () {
                        _this.emit((_this._state = 'stopped'));
                        return true;
                    })
                        .catch(function (err) {
                        _this.debug(err);
                        _this.emit((_this._state = 'stopped'), err);
                        return false;
                    })];
            });
        });
    };
    MongoMemoryReplSet.prototype.waitUntilRunning = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._state === 'running')
                            return [2 /*return*/];
                        return [4 /*yield*/, new Promise(function (resolve) { return _this.once('running', function () { return resolve(); }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Connects to the first server from the list of servers and issues the `replSetInitiate`
     * command passing in a new replica set configuration object.
     */
    MongoMemoryReplSet.prototype._initReplSet = function () {
        return __awaiter(this, void 0, void 0, function () {
            var uris, conn, db, members, rsConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._state !== 'init') {
                            throw new Error('Not in init phase.');
                        }
                        this.debug('Initializing replica set.');
                        if (!this.servers.length) {
                            throw new Error('One or more server is required.');
                        }
                        return [4 /*yield*/, Promise.all(this.servers.map(function (server) { return server.getUri(); }))];
                    case 1:
                        uris = _a.sent();
                        return [4 /*yield*/, mongodb_1.MongoClient.connect(uris[0], { useNewUrlParser: true })];
                    case 2:
                        conn = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, , 7, 9]);
                        return [4 /*yield*/, conn.db(this.opts.replSet.dbName)];
                    case 4:
                        db = _a.sent();
                        this.admin = db.admin();
                        members = uris.map(function (uri, idx) { return ({ _id: idx, host: db_util_1.getHost(uri) }); });
                        rsConfig = {
                            _id: this.opts.replSet.name,
                            members: members,
                            settings: __assign({ electionTimeoutMillis: 500 }, (this.opts.replSet.configSettings || {})),
                        };
                        return [4 /*yield*/, this.admin.command({ replSetInitiate: rsConfig })];
                    case 5:
                        _a.sent();
                        this.debug('Waiting for replica set to have a PRIMARY member.');
                        return [4 /*yield*/, this._waitForPrimary()];
                    case 6:
                        _a.sent();
                        this.emit((this._state = 'running'));
                        this.debug('running');
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, conn.close()];
                    case 8:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    MongoMemoryReplSet.prototype._startServer = function (instanceOpts) {
        var serverOpts = {
            autoStart: true,
            debug: this.opts.debug,
            binary: this.opts.binary,
            instance: instanceOpts,
            spawn: this.opts.replSet.spawn,
        };
        var server = new MongoMemoryServer_1.default(serverOpts);
        return server;
    };
    MongoMemoryReplSet.prototype._waitForPrimary = function () {
        return __awaiter(this, void 0, void 0, function () {
            var replStatus, hasPrimary;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.admin) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.admin.command({ replSetGetStatus: 1 })];
                    case 1:
                        replStatus = _a.sent();
                        this.debug('   replStatus:', replStatus);
                        hasPrimary = replStatus.members.some(function (m) { return m.stateStr === 'PRIMARY'; });
                        if (!hasPrimary) {
                            this.debug('No PRIMARY yet. Waiting...');
                            return [2 /*return*/, new Promise(function (resolve) { return setTimeout(function () { return resolve(_this._waitForPrimary()); }, 1000); })];
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    return MongoMemoryReplSet;
}(events_1.EventEmitter));
exports.default = MongoMemoryReplSet;
//# sourceMappingURL=MongoMemoryReplSet.js.map