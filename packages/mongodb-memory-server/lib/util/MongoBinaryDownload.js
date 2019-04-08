"use strict";
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
var os_1 = __importDefault(require("os"));
var url_1 = __importDefault(require("url"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var md5_file_1 = __importDefault(require("md5-file"));
var https_1 = __importDefault(require("https"));
var decompress_1 = __importDefault(require("decompress")); // 💩💩💩 this package does not work with Node@11+Jest+Babel
var MongoBinaryDownloadUrl_1 = __importDefault(require("./MongoBinaryDownloadUrl"));
var MongoBinary_1 = require("./MongoBinary");
var https_proxy_agent_1 = __importDefault(require("https-proxy-agent"));
var MongoBinaryDownload = /** @class */ (function () {
    function MongoBinaryDownload(_a) {
        var platform = _a.platform, arch = _a.arch, downloadDir = _a.downloadDir, version = _a.version, checkMD5 = _a.checkMD5, debug = _a.debug;
        this.platform = platform || os_1.default.platform();
        this.arch = arch || os_1.default.arch();
        this.version = version || MongoBinary_1.LATEST_VERSION;
        this.downloadDir = path_1.default.resolve(downloadDir || 'mongodb-download');
        if (checkMD5 === undefined) {
            this.checkMD5 =
                typeof process.env.MONGOMS_MD5_CHECK === 'string' &&
                    ['1', 'on', 'yes', 'true'].indexOf(process.env.MONGOMS_MD5_CHECK.toLowerCase()) !== -1;
        }
        else {
            this.checkMD5 = checkMD5;
        }
        this.dlProgress = {
            current: 0,
            length: 0,
            totalMb: 0,
            lastPrintedAt: 0,
        };
        if (debug) {
            if (typeof debug === 'function' && debug.apply && debug.call) {
                this.debug = debug;
            }
            else {
                this.debug = console.log.bind(null);
            }
        }
        else {
            this.debug = function () { };
        }
    }
    MongoBinaryDownload.prototype.getMongodPath = function () {
        return __awaiter(this, void 0, void 0, function () {
            var binaryName, mongodPath, mongoDBArchive;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        binaryName = this.platform === 'win32' ? 'mongod.exe' : 'mongod';
                        mongodPath = path_1.default.resolve(this.downloadDir, this.version, binaryName);
                        if (this.locationExists(mongodPath)) {
                            return [2 /*return*/, mongodPath];
                        }
                        return [4 /*yield*/, this.startDownload()];
                    case 1:
                        mongoDBArchive = _a.sent();
                        return [4 /*yield*/, this.extract(mongoDBArchive)];
                    case 2:
                        _a.sent();
                        fs_1.default.unlinkSync(mongoDBArchive);
                        if (this.locationExists(mongodPath)) {
                            return [2 /*return*/, mongodPath];
                        }
                        throw new Error("Cannot find downloaded mongod binary by path " + mongodPath);
                }
            });
        });
    };
    MongoBinaryDownload.prototype.startDownload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mbdUrl, downloadUrl, mongoDBArchive;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mbdUrl = new MongoBinaryDownloadUrl_1.default({
                            platform: this.platform,
                            arch: this.arch,
                            version: this.version,
                        });
                        if (!fs_1.default.existsSync(this.downloadDir)) {
                            fs_1.default.mkdirSync(this.downloadDir);
                        }
                        return [4 /*yield*/, mbdUrl.getDownloadUrl()];
                    case 1:
                        downloadUrl = _a.sent();
                        this._downloadingUrl = downloadUrl;
                        return [4 /*yield*/, this.download(downloadUrl)];
                    case 2:
                        mongoDBArchive = _a.sent();
                        return [4 /*yield*/, this.makeMD5check(downloadUrl + ".md5", mongoDBArchive)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, mongoDBArchive];
                }
            });
        });
    };
    MongoBinaryDownload.prototype.makeMD5check = function (urlForReferenceMD5, mongoDBArchive) {
        return __awaiter(this, void 0, void 0, function () {
            var mongoDBArchiveMd5, signatureContent, m, md5Remote, md5Local;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.checkMD5) {
                            return [2 /*return*/, undefined];
                        }
                        return [4 /*yield*/, this.download(urlForReferenceMD5)];
                    case 1:
                        mongoDBArchiveMd5 = _a.sent();
                        signatureContent = fs_1.default.readFileSync(mongoDBArchiveMd5).toString('UTF-8');
                        m = signatureContent.match(/(.*?)\s/);
                        md5Remote = m ? m[1] : null;
                        md5Local = md5_file_1.default.sync(mongoDBArchive);
                        if (md5Remote !== md5Local) {
                            throw new Error('MongoBinaryDownload: md5 check is failed');
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    MongoBinaryDownload.prototype.download = function (downloadUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var proxy, urlObject, downloadOptions, filename, downloadLocation, tempDownloadLocation, downloadedFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        proxy = process.env['yarn_https-proxy'] ||
                            process.env.yarn_proxy ||
                            process.env['npm_config_https-proxy'] ||
                            process.env.npm_config_proxy ||
                            process.env.https_proxy ||
                            process.env.http_proxy ||
                            process.env.HTTPS_PROXY ||
                            process.env.HTTP_PROXY;
                        urlObject = url_1.default.parse(downloadUrl);
                        if (!urlObject.hostname || !urlObject.path) {
                            throw new Error("Provided incorrect download url: " + downloadUrl);
                        }
                        downloadOptions = {
                            hostname: urlObject.hostname,
                            port: urlObject.port || '443',
                            path: urlObject.path,
                            method: 'GET',
                            agent: proxy ? new https_proxy_agent_1.default(proxy) : undefined,
                        };
                        filename = (urlObject.pathname || '').split('/').pop();
                        if (!filename) {
                            throw new Error("MongoBinaryDownload: missing filename for url " + downloadUrl);
                        }
                        downloadLocation = path_1.default.resolve(this.downloadDir, filename);
                        tempDownloadLocation = path_1.default.resolve(this.downloadDir, filename + ".downloading");
                        this.debug("Downloading" + (proxy ? " via proxy " + proxy : '') + ":", downloadUrl);
                        return [4 /*yield*/, this.httpDownload(downloadOptions, downloadLocation, tempDownloadLocation)];
                    case 1:
                        downloadedFile = _a.sent();
                        return [2 /*return*/, downloadedFile];
                }
            });
        });
    };
    MongoBinaryDownload.prototype.extract = function (mongoDBArchive) {
        return __awaiter(this, void 0, void 0, function () {
            var binaryName, extractDir, filter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        binaryName = this.platform === 'win32' ? 'mongod.exe' : 'mongod';
                        extractDir = path_1.default.resolve(this.downloadDir, this.version);
                        this.debug("extract(): " + extractDir);
                        if (!fs_1.default.existsSync(extractDir)) {
                            fs_1.default.mkdirSync(extractDir);
                        }
                        if (this.platform === 'win32') {
                            filter = function (file) {
                                return /bin\/mongod.exe$/.test(file.path) || /.dll$/.test(file.path);
                            };
                        }
                        else {
                            filter = function (file) { return /bin\/mongod$/.test(file.path); };
                        }
                        return [4 /*yield*/, decompress_1.default(mongoDBArchive, extractDir, {
                                // extract only `bin/mongod` file
                                filter: filter,
                                // extract to root folder
                                map: function (file) {
                                    file.path = path_1.default.basename(file.path); // eslint-disable-line
                                    return file;
                                },
                            })];
                    case 1:
                        _a.sent();
                        if (!this.locationExists(path_1.default.resolve(this.downloadDir, this.version, binaryName))) {
                            throw new Error("MongoBinaryDownload: missing mongod binary in " + mongoDBArchive + " (downloaded from " + (this
                                ._downloadingUrl || '') + "). Broken package in MongoDB distro?");
                        }
                        return [2 /*return*/, extractDir];
                }
            });
        });
    };
    MongoBinaryDownload.prototype.httpDownload = function (httpOptions, downloadLocation, tempDownloadLocation) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var fileStream = fs_1.default.createWriteStream(tempDownloadLocation);
                        var req = https_1.default.get(httpOptions, function (response) {
                            _this.dlProgress.current = 0;
                            _this.dlProgress.length = parseInt(response.headers['content-length'], 10);
                            _this.dlProgress.totalMb = Math.round((_this.dlProgress.length / 1048576) * 10) / 10;
                            response.pipe(fileStream);
                            fileStream.on('finish', function () {
                                if (_this.dlProgress.current < 1000000 && !httpOptions.path.endsWith('.md5')) {
                                    var downloadUrl = _this._downloadingUrl || "https://" + httpOptions.hostname + "/" + httpOptions.path;
                                    reject(new Error("Too small (" + _this.dlProgress.current + " bytes) mongod binary downloaded from " + downloadUrl));
                                    return;
                                }
                                fileStream.close();
                                fs_1.default.renameSync(tempDownloadLocation, downloadLocation);
                                _this.debug("renamed " + tempDownloadLocation + " to " + downloadLocation);
                                resolve(downloadLocation);
                            });
                            response.on('data', function (chunk) {
                                _this.printDownloadProgress(chunk);
                            });
                            req.on('error', function (e) {
                                _this.debug('request error:', e);
                                reject(e);
                            });
                        });
                    })];
            });
        });
    };
    MongoBinaryDownload.prototype.printDownloadProgress = function (chunk) {
        this.dlProgress.current += chunk.length;
        var now = Date.now();
        if (now - this.dlProgress.lastPrintedAt < 2000)
            return;
        this.dlProgress.lastPrintedAt = now;
        var percentComplete = Math.round(((100.0 * this.dlProgress.current) / this.dlProgress.length) * 10) / 10;
        var mbComplete = Math.round((this.dlProgress.current / 1048576) * 10) / 10;
        var crReturn = this.platform === 'win32' ? '\x1b[0G' : '\r';
        process.stdout.write("Downloading MongoDB " + this.version + ": " + percentComplete + " % (" + mbComplete + "mb " +
            ("/ " + this.dlProgress.totalMb + "mb)" + crReturn));
    };
    MongoBinaryDownload.prototype.locationExists = function (location) {
        try {
            fs_1.default.lstatSync(location);
            return true;
        }
        catch (e) {
            if (e.code !== 'ENOENT')
                throw e;
            return false;
        }
    };
    return MongoBinaryDownload;
}());
exports.default = MongoBinaryDownload;
//# sourceMappingURL=MongoBinaryDownload.js.map