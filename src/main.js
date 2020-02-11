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
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
exports.__esModule = true;
var shelljs_1 = require("shelljs");
var path_1 = require("path");
var lodash_1 = require("lodash");
var fs_1 = require("fs");
var walk = require("walkdir");
exports.N_shebang = '#!/usr/bin/env node';
function exfy(opt) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, path, extensions, output_dir, shebang, keep_extensions, level, match, cwd, parts, re;
        return __generator(this, function (_b) {
            _a = __assign({ shebang: exports.N_shebang }, opt), path = _a.path, extensions = _a.extensions, output_dir = _a.output_dir, shebang = _a.shebang, keep_extensions = _a.keep_extensions, level = _a.level, match = _a.match;
            if (!path.startsWith('/')) {
                cwd = get_cwd();
                path = path_1.resolve(cwd, path);
            }
            console.info("Start converting at: " + path);
            parts = parse_regex_str(match);
            re = new RegExp(parts[0], parts[1]);
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var e = walk(path, { max_depth: level }, function (path, stat) {
                        if (stat.isFile()) {
                            var ext = lodash_1.trim(path_1.extname(path), '.');
                            if (!ext || !extensions.includes(ext)) {
                                return;
                            }
                            var o = (fs_1.readFileSync(path)).toString();
                            var n = o;
                            if (re.test(o)) {
                                if (!o.startsWith(shebang)) {
                                    n = o.replace(re, shebang);
                                }
                            }
                            else {
                                n = shebang + '\n\n' + o;
                            }
                            if (keep_extensions) {
                                ext = '';
                            }
                            var n_path = lodash_1.trimEnd(path.slice(0, -(ext.length)), '.');
                            fs_1.writeFileSync(n_path, n);
                        }
                    });
                    e.on('end', function () {
                        resolve();
                    });
                    e.on('error', reject);
                })];
        });
    });
}
exports.exfy = exfy;
function get_cwd() {
    return shelljs_1.pwd().toString();
}
function parse_regex_str(str) {
    return lodash_1.trim(str, '/').split('/');
}
exports.parse_regex_str = parse_regex_str;
