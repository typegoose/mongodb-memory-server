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
var getos_1 = __importDefault(require("getos"));
var MongoBinaryDownloadUrl = /** @class */ (function () {
    function MongoBinaryDownloadUrl(_a) {
        var platform = _a.platform, arch = _a.arch, version = _a.version, os = _a.os;
        this.version = version;
        this.platform = this.translatePlatform(platform);
        this.arch = this.translateArch(arch, this.platform);
        this.os = os;
    }
    MongoBinaryDownloadUrl.prototype.getDownloadUrl = function () {
        return __awaiter(this, void 0, void 0, function () {
            var archive;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getArchiveName()];
                    case 1:
                        archive = _a.sent();
                        return [2 /*return*/, (process.env.MONGOMS_DOWNLOAD_MIRROR || 'https://fastdl.mongodb.org') + "/" + this.platform + "/" + archive];
                }
            });
        });
    };
    MongoBinaryDownloadUrl.prototype.getArchiveName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (this.platform) {
                    case 'osx':
                        return [2 /*return*/, this.getArchiveNameOsx()];
                    case 'win32':
                        return [2 /*return*/, this.getArchiveNameWin()];
                    case 'linux':
                    default:
                        return [2 /*return*/, this.getArchiveNameLinux()];
                }
                return [2 /*return*/];
            });
        });
    };
    // https://www.mongodb.org/dl/win32
    MongoBinaryDownloadUrl.prototype.getArchiveNameWin = function () {
        return __awaiter(this, void 0, void 0, function () {
            var name;
            return __generator(this, function (_a) {
                name = "mongodb-" + this.platform;
                name += "-" + this.arch;
                name += '-2008plus-ssl';
                name += "-" + this.version + ".zip";
                return [2 /*return*/, name];
            });
        });
    };
    // https://www.mongodb.org/dl/osx
    MongoBinaryDownloadUrl.prototype.getArchiveNameOsx = function () {
        return __awaiter(this, void 0, void 0, function () {
            var name;
            return __generator(this, function (_a) {
                name = "mongodb-osx";
                if (!(this.version.indexOf('3.0') === 0 ||
                    this.version.indexOf('2.') === 0 ||
                    this.version.indexOf('1.') === 0)) {
                    name += '-ssl';
                }
                name += "-" + this.arch;
                name += "-" + this.version + ".tgz";
                return [2 /*return*/, name];
            });
        });
    };
    // https://www.mongodb.org/dl/linux
    MongoBinaryDownloadUrl.prototype.getArchiveNameLinux = function () {
        return __awaiter(this, void 0, void 0, function () {
            var name, osString, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        name = "mongodb-linux";
                        name += "-" + this.arch;
                        if (!(this.arch !== 'i686')) return [3 /*break*/, 3];
                        if (!!this.os) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.getos()];
                    case 1:
                        _a.os = _b.sent();
                        _b.label = 2;
                    case 2:
                        osString = this.getLinuxOSVersionString(this.os);
                        _b.label = 3;
                    case 3:
                        if (osString) {
                            name += "-" + osString;
                        }
                        name += "-" + this.version + ".tgz";
                        return [2 /*return*/, name];
                }
            });
        });
    };
    MongoBinaryDownloadUrl.prototype.getos = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        getos_1.default(function (e, os) {
                            if (e)
                                reject(e);
                            resolve(os);
                        });
                    })];
            });
        });
    };
    MongoBinaryDownloadUrl.prototype.getLinuxOSVersionString = function (os) {
        if (/ubuntu/i.test(os.dist)) {
            return this.getUbuntuVersionString(os);
        }
        else if (/elementary OS/i.test(os.dist)) {
            return this.getElementaryOSVersionString(os);
        }
        else if (/suse/i.test(os.dist)) {
            return this.getSuseVersionString(os);
        }
        else if (/rhel/i.test(os.dist) || /centos/i.test(os.dist) || /scientific/i.test(os.dist)) {
            return this.getRhelVersionString(os);
        }
        else if (/fedora/i.test(os.dist)) {
            return this.getFedoraVersionString(os);
        }
        else if (/debian/i.test(os.dist)) {
            return this.getDebianVersionString(os);
        }
        else if (/mint/i.test(os.dist)) {
            return this.getMintVersionString(os);
        }
        console.warn("Unknown linux distro " + os.dist + ", falling back to legacy MongoDB build");
        return this.getLegacyVersionString(os);
    };
    MongoBinaryDownloadUrl.prototype.getDebianVersionString = function (os) {
        var name = 'debian';
        var release = parseFloat(os.release);
        if (release >= 9 || os.release === 'unstable') {
            name += '92';
        }
        else if (release >= 8.1) {
            name += '81';
        }
        else if (release >= 7.1) {
            name += '71';
        }
        return name;
    };
    MongoBinaryDownloadUrl.prototype.getFedoraVersionString = function (os) {
        var name = 'rhel';
        var fedoraVer = parseInt(os.release, 10);
        if (fedoraVer > 18) {
            name += '70';
        }
        else if (fedoraVer < 19 && fedoraVer >= 12) {
            name += '62';
        }
        else if (fedoraVer < 12 && fedoraVer >= 6) {
            name += '55';
        }
        return name;
    };
    MongoBinaryDownloadUrl.prototype.getRhelVersionString = function (os) {
        var name = 'rhel';
        var release = os.release;
        if (release) {
            if (/^7/.test(release)) {
                name += '70';
            }
            else if (/^6/.test(release)) {
                name += '62';
            }
            else if (/^5/.test(release)) {
                name += '55';
            }
        }
        return name;
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    MongoBinaryDownloadUrl.prototype.getElementaryOSVersionString = function (os) {
        return 'ubuntu1404';
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    MongoBinaryDownloadUrl.prototype.getMintVersionString = function (os) {
        // unfortunately getos doesn't return version for Mint
        return 'ubuntu1404';
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    MongoBinaryDownloadUrl.prototype.getLegacyVersionString = function (os) {
        return '';
    };
    MongoBinaryDownloadUrl.prototype.getSuseVersionString = function (os) {
        var releaseMatch = os.release.match(/(^11|^12)/);
        if (releaseMatch) {
            return "suse" + releaseMatch[0];
        }
        return '';
    };
    MongoBinaryDownloadUrl.prototype.getUbuntuVersionString = function (os) {
        var name = 'ubuntu';
        var ubuntuVer = os.release ? os.release.split('.') : [];
        var majorVer = parseInt(ubuntuVer[0], 10);
        // const minorVer: string = ubuntuVer[1];
        if (os.release === '12.04') {
            name += '1204';
        }
        else if (os.release === '14.04') {
            name += '1404';
        }
        else if (os.release === '14.10') {
            name += '1410-clang';
        }
        else if (majorVer === 14) {
            name += '1404';
        }
        else if (os.release === '16.04') {
            name += '1604';
        }
        else if (majorVer === 16) {
            name += '1604';
        }
        else if (majorVer === 18) {
            if (this.version && this.version.indexOf('3.') === 0) {
                // For MongoDB 3.x using 1604 binaries, download distro does not have builds for Ubuntu 1804
                // https://www.mongodb.org/dl/linux/x86_64-ubuntu1604
                name += '1604';
            }
            else {
                // See fulllist of versions https://www.mongodb.org/dl/linux/x86_64-ubuntu1804
                name += '1804';
            }
        }
        else {
            name += '1404';
        }
        return name;
    };
    MongoBinaryDownloadUrl.prototype.translatePlatform = function (platform) {
        switch (platform) {
            case 'darwin':
                return 'osx';
            case 'win32':
                return 'win32';
            case 'linux':
                return 'linux';
            case 'elementary OS':
                return 'linux';
            case 'sunos':
                return 'sunos5';
            default:
                throw new Error("unsupported OS " + platform);
        }
    };
    MongoBinaryDownloadUrl.prototype.translateArch = function (arch, mongoPlatform) {
        if (arch === 'ia32') {
            if (mongoPlatform === 'linux') {
                return 'i686';
            }
            else if (mongoPlatform === 'win32') {
                return 'i386';
            }
            throw new Error('unsupported architecture');
        }
        else if (arch === 'x64') {
            return 'x86_64';
        }
        else {
            throw new Error('unsupported architecture, ia32 and x64 are the only valid options');
        }
    };
    return MongoBinaryDownloadUrl;
}());
exports.default = MongoBinaryDownloadUrl;
//# sourceMappingURL=MongoBinaryDownloadUrl.js.map