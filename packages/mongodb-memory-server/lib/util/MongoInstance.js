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
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var path_1 = __importDefault(require("path"));
var MongoBinary_1 = __importDefault(require("./MongoBinary"));
var MongoInstance = /** @class */ (function () {
    function MongoInstance(opts) {
        this.opts = opts;
        this.isInstanceReady = false;
        this.childProcess = null;
        this.killerProcess = null;
        if (this.opts.debug) {
            if (!this.opts.instance)
                this.opts.instance = {};
            if (!this.opts.binary)
                this.opts.binary = {};
            this.opts.instance.debug = this.opts.debug;
            this.opts.binary.debug = this.opts.debug;
        }
        if (this.opts.instance && this.opts.instance.debug) {
            if (typeof this.opts.instance.debug === 'function' &&
                this.opts.instance.debug.apply &&
                this.opts.instance.debug.call) {
                this.debug = this.opts.instance.debug;
            }
            else {
                this.debug = console.log.bind(null);
            }
        }
        else {
            this.debug = function () { };
        }
        // add instance's port to debug output
        var debugFn = this.debug;
        var port = this.opts.instance && this.opts.instance.port;
        this.debug = function (msg) {
            debugFn("Mongo[" + port + "]: " + msg);
        };
    }
    MongoInstance.run = function (opts) {
        var instance = new this(opts);
        return instance.run();
    };
    MongoInstance.prototype.prepareCommandArgs = function () {
        var _a = this.opts.instance, ip = _a.ip, port = _a.port, storageEngine = _a.storageEngine, dbPath = _a.dbPath, replSet = _a.replSet, auth = _a.auth, args = _a.args;
        var result = [];
        result.push('--bind_ip', ip || '127.0.0.1');
        if (port)
            result.push('--port', port.toString());
        if (storageEngine)
            result.push('--storageEngine', storageEngine);
        if (dbPath)
            result.push('--dbpath', dbPath);
        if (!auth)
            result.push('--noauth');
        else if (auth)
            result.push('--auth');
        if (replSet)
            result.push('--replSet', replSet);
        return result.concat(args || []);
    };
    MongoInstance.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var launch, mongoBin;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        launch = new Promise(function (resolve, reject) {
                            _this.instanceReady = function () {
                                _this.isInstanceReady = true;
                                _this.debug('MongodbInstance: is ready!');
                                resolve(__assign({}, _this.childProcess));
                            };
                            _this.instanceFailed = function (err) {
                                _this.debug("MongodbInstance: is failed: " + err.toString());
                                if (_this.killerProcess)
                                    _this.killerProcess.kill();
                                reject(err);
                            };
                        });
                        return [4 /*yield*/, MongoBinary_1.default.getPath(this.opts.binary)];
                    case 1:
                        mongoBin = _a.sent();
                        this.childProcess = this._launchMongod(mongoBin);
                        this.killerProcess = this._launchKiller(process.pid, this.childProcess.pid);
                        return [4 /*yield*/, launch];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    MongoInstance.prototype.kill = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.debug('Called MongoInstance.kill():');
                        if (!(this.childProcess && !this.childProcess.killed)) return [3 /*break*/, 2];
                        return [4 /*yield*/, new Promise(function (resolve) {
                                if (_this.childProcess) {
                                    _this.childProcess.once("exit", function () {
                                        _this.debug(' - childProcess: got exit signal. Ok!');
                                        resolve();
                                    });
                                    _this.childProcess.kill();
                                    _this.debug(' - childProcess: send kill cmd...');
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.debug(' - childProcess: nothing to kill, skipping.');
                        _a.label = 3;
                    case 3:
                        if (!(this.killerProcess && !this.killerProcess.killed)) return [3 /*break*/, 5];
                        return [4 /*yield*/, new Promise(function (resolve) {
                                if (_this.killerProcess) {
                                    _this.killerProcess.once("exit", function () {
                                        _this.debug(' - killerProcess: got exit signal. Ok!');
                                        resolve();
                                    });
                                    _this.killerProcess.kill();
                                    _this.debug(' - killerProcess: send kill cmd...');
                                }
                            })];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        this.debug(' - killerProcess: nothing to kill, skipping.');
                        _a.label = 6;
                    case 6: return [2 /*return*/, this];
                }
            });
        });
    };
    MongoInstance.prototype.getPid = function () {
        return this.childProcess ? this.childProcess.pid : undefined;
    };
    MongoInstance.prototype._launchMongod = function (mongoBin) {
        var spawnOpts = this.opts.spawn || {};
        if (!spawnOpts.stdio)
            spawnOpts.stdio = 'pipe';
        var childProcess = child_process_1.spawn(mongoBin, this.prepareCommandArgs(), spawnOpts);
        if (childProcess.stderr) {
            childProcess.stderr.on('data', this.stderrHandler.bind(this));
        }
        if (childProcess.stdout) {
            childProcess.stdout.on('data', this.stdoutHandler.bind(this));
        }
        childProcess.on('close', this.closeHandler.bind(this));
        childProcess.on('error', this.errorHandler.bind(this));
        return childProcess;
    };
    MongoInstance.prototype._launchKiller = function (parentPid, childPid) {
        var _this = this;
        this.debug("Called MongoInstance._launchKiller(parent: " + parentPid + ", child: " + childPid + "):");
        // spawn process which kills itself and mongo process if current process is dead
        var killer = child_process_1.spawn(process.argv[0], [
            path_1.default.resolve(__dirname, '../../scripts/mongo_killer.js'),
            parentPid.toString(),
            childPid.toString(),
        ], { stdio: 'pipe' });
        ['exit', 'message', 'disconnect', 'error'].forEach(function (e) {
            killer.on(e, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                _this.debug("[MongoKiller]: " + e + " - " + JSON.stringify(args));
            });
        });
        return killer;
    };
    MongoInstance.prototype.errorHandler = function (err) {
        this.instanceFailed(err);
    };
    MongoInstance.prototype.closeHandler = function (code) {
        this.debug("CLOSE: " + code);
    };
    MongoInstance.prototype.stderrHandler = function (message) {
        this.debug("STDERR: " + message.toString());
    };
    MongoInstance.prototype.stdoutHandler = function (message) {
        this.debug("" + message.toString());
        var log = message.toString();
        if (/waiting for connections on port/i.test(log)) {
            this.instanceReady();
        }
        else if (/addr already in use/i.test(log)) {
            this.instanceFailed("Port " + this.opts.instance.port + " already in use");
        }
        else if (/mongod instance already running/i.test(log)) {
            this.instanceFailed('Mongod already running');
        }
        else if (/permission denied/i.test(log)) {
            this.instanceFailed('Mongod permission denied');
        }
        else if (/Data directory .*? not found/i.test(log)) {
            this.instanceFailed('Data directory not found');
        }
        else if (/shutting down with code/i.test(log)) {
            // if mongod started succesfully then no error on shutdown!
            if (!this.isInstanceReady) {
                this.instanceFailed('Mongod shutting down');
            }
        }
        else if (/\*\*\*aborting after/i.test(log)) {
            this.instanceFailed('Mongod internal error');
        }
    };
    MongoInstance.childProcessList = [];
    return MongoInstance;
}());
exports.default = MongoInstance;
//# sourceMappingURL=MongoInstance.js.map