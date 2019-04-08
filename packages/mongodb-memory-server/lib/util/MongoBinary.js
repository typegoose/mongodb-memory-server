"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var fs_1 = __importDefault(require("fs"));
var os_1 = __importDefault(require("os"));
var path_1 = __importDefault(require("path"));
var lockfile_1 = __importDefault(require("lockfile"));
var mkdirp_1 = __importDefault(require("mkdirp"));
var find_cache_dir_1 = __importDefault(require("find-cache-dir"));
var child_process_1 = require("child_process");
var dedent_1 = __importDefault(require("dedent"));
var util_1 = require("util");
var MongoBinaryDownload_1 = __importDefault(require("./MongoBinaryDownload"));
// TODO: return back `latest` version when it will be fixed in MongoDB distro (for now use 4.0.3 😂)
// More details in https://github.com/nodkz/mongodb-memory-server/issues/131
// export const LATEST_VERSION = 'latest';
exports.LATEST_VERSION = '4.0.3';
var MongoBinary = /** @class */ (function () {
    function MongoBinary() {
    }
    MongoBinary.getSystemPath = function (systemBinary) {
        return __awaiter(this, void 0, void 0, function () {
            var binaryPath, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        binaryPath = '';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, util_1.promisify(fs_1.default.access)(systemBinary)];
                    case 2:
                        _a.sent();
                        this.debug("MongoBinary: found sytem binary path at " + systemBinary);
                        binaryPath = systemBinary;
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        this.debug("MongoBinary: can't find system binary at " + systemBinary + ". " + err_1.message);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, binaryPath];
                }
            });
        });
    };
    MongoBinary.getCachePath = function (version) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.cache[version]];
            });
        });
    };
    MongoBinary.getDownloadPath = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var downloadDir, platform, arch, version, lockfile, downloader, _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        downloadDir = options.downloadDir, platform = options.platform, arch = options.arch, version = options.version;
                        // create downloadDir if not exists
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                mkdirp_1.default(downloadDir, function (err) {
                                    if (err)
                                        reject(err);
                                    else
                                        resolve();
                                });
                            })];
                    case 1:
                        // create downloadDir if not exists
                        _c.sent();
                        lockfile = path_1.default.resolve(downloadDir, version + ".lock");
                        // wait lock
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                lockfile_1.default.lock(lockfile, {
                                    wait: 120000,
                                    pollPeriod: 100,
                                    stale: 110000,
                                    retries: 3,
                                    retryWait: 100,
                                }, function (err) {
                                    if (err)
                                        reject(err);
                                    else
                                        resolve();
                                });
                            })];
                    case 2:
                        // wait lock
                        _c.sent();
                        if (!!this.cache[version]) return [3 /*break*/, 4];
                        downloader = new MongoBinaryDownload_1.default({
                            downloadDir: downloadDir,
                            platform: platform,
                            arch: arch,
                            version: version,
                        });
                        downloader.debug = this.debug;
                        _a = this.cache;
                        _b = version;
                        return [4 /*yield*/, downloader.getMongodPath()];
                    case 3:
                        _a[_b] = _c.sent();
                        _c.label = 4;
                    case 4:
                        // remove lock
                        lockfile_1.default.unlock(lockfile, function (err) {
                            _this.debug(err
                                ? "MongoBinary: Error when removing download lock " + err
                                : "MongoBinary: Download lock removed");
                        });
                        return [2 /*return*/, this.cache[version]];
                }
            });
        });
    };
    MongoBinary.getPath = function (opts) {
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var legacyDLDir, defaultOptions, options, version, systemBinary, binaryPath, binaryVersion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        legacyDLDir = path_1.default.resolve(os_1.default.homedir(), '.mongodb-binaries');
                        defaultOptions = {
                            downloadDir: process.env.MONGOMS_DOWNLOAD_DIR ||
                                (fs_1.default.existsSync(legacyDLDir)
                                    ? legacyDLDir
                                    : path_1.default.resolve(find_cache_dir_1.default({
                                        name: 'mongodb-memory-server',
                                        // if we're in postinstall script, npm will set the cwd too deep
                                        cwd: new RegExp("node_modules" + path_1.default.sep + "mongodb-memory-server$").test(process.cwd())
                                            ? path_1.default.resolve(process.cwd(), '..', '..')
                                            : process.cwd(),
                                    }) || '', 'mongodb-binaries')),
                            platform: process.env.MONGOMS_PLATFORM || os_1.default.platform(),
                            arch: process.env.MONGOMS_ARCH || os_1.default.arch(),
                            version: process.env.MONGOMS_VERSION || exports.LATEST_VERSION,
                            systemBinary: process.env.MONGOMS_SYSTEM_BINARY,
                            debug: typeof process.env.MONGOMS_DEBUG === 'string'
                                ? ['1', 'on', 'yes', 'true'].indexOf(process.env.MONGOMS_DEBUG.toLowerCase()) !== -1
                                : false,
                        };
                        if (opts.debug) {
                            if (typeof opts.debug === 'function' && opts.debug.apply && opts.debug.call) {
                                this.debug = opts.debug;
                            }
                            else {
                                this.debug = console.log.bind(null);
                            }
                        }
                        else {
                            this.debug = function (msg) { }; // eslint-disable-line
                        }
                        options = __assign({}, defaultOptions, opts);
                        this.debug("MongoBinary options: " + JSON.stringify(options));
                        version = options.version, systemBinary = options.systemBinary;
                        binaryPath = '';
                        if (!systemBinary) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getSystemPath(systemBinary)];
                    case 1:
                        binaryPath = _a.sent();
                        if (binaryPath) {
                            if (~binaryPath.indexOf(' ')) {
                                binaryPath = "\"" + binaryPath + "\"";
                            }
                            binaryVersion = child_process_1.execSync(binaryPath + " --version")
                                .toString()
                                .split('\n')[0]
                                .split(' ')[2];
                            if (version !== exports.LATEST_VERSION && version !== binaryVersion) {
                                // we will log the version number of the system binary and the version requested so the user can see the difference
                                this.debug(dedent_1.default(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            MongoMemoryServer: Possible version conflict\n              SystemBinary version: ", "\n              Requested version:    ", "\n\n              Using SystemBinary!\n          "], ["\n            MongoMemoryServer: Possible version conflict\n              SystemBinary version: ", "\n              Requested version:    ", "\n\n              Using SystemBinary!\n          "])), binaryVersion, version));
                            }
                        }
                        _a.label = 2;
                    case 2:
                        if (!!binaryPath) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getCachePath(version)];
                    case 3:
                        binaryPath = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!!binaryPath) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getDownloadPath(options)];
                    case 5:
                        binaryPath = _a.sent();
                        _a.label = 6;
                    case 6:
                        this.debug("MongoBinary: Mongod binary path: " + binaryPath);
                        return [2 /*return*/, binaryPath];
                }
            });
        });
    };
    MongoBinary.hasValidBinPath = function (files) {
        if (files.length === 1) {
            return true;
        }
        else if (files.length > 1) {
            return false;
        }
        return false;
    };
    MongoBinary.cache = {};
    return MongoBinary;
}());
exports.default = MongoBinary;
var templateObject_1;
//# sourceMappingURL=MongoBinary.js.map