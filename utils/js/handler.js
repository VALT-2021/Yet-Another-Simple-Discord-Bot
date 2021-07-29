"use strict";
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
var fs_1 = require("fs");
var Handler = /** @class */ (function () {
    function Handler(commandsFolder, componentsFolder, lang) {
        this.commands = new Map();
        this.components = new Map();
        this.commandsFolder = commandsFolder;
        this.componentsFolder = componentsFolder;
        this.lang = lang || 'js';
    }
    Handler.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var commands, _i, commands_1, base, file, components, _a, components_1, base, file;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        commands = fs_1["default"].readdirSync(this.commandsFolder).filter(function (base) { return base.endsWith(_this.lang); });
                        _i = 0, commands_1 = commands;
                        _b.label = 1;
                    case 1:
                        if (!(_i < commands_1.length)) return [3 /*break*/, 4];
                        base = commands_1[_i];
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('.' + _this.commandsFolder + '/' + base); })];
                    case 2:
                        file = _b.sent();
                        this.commands.set(file["default"].name, file["default"]);
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        components = fs_1["default"].readdirSync(this.componentsFolder).filter(function (base) { return base.endsWith(_this.lang); });
                        _a = 0, components_1 = components;
                        _b.label = 5;
                    case 5:
                        if (!(_a < components_1.length)) return [3 /*break*/, 8];
                        base = components_1[_a];
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('.' + _this.componentsFolder + '/' + base); })];
                    case 6:
                        file = _b.sent();
                        this.components.set(file["default"].type + file["default"].id, file["default"]);
                        _b.label = 7;
                    case 7:
                        _a++;
                        return [3 /*break*/, 5];
                    case 8:
                        console.log("Loaded " + this.commands.size + " and " + this.components.size);
                        return [2 /*return*/];
                }
            });
        });
    };
    return Handler;
}());
exports["default"] = Handler;
