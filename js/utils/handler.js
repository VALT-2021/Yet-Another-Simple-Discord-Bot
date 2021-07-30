"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentHandler = exports.SlashCommandHandler = void 0;
const fs_1 = __importDefault(require("fs"));
class SlashCommandHandler {
    constructor(path) {
        this.path = path;
        this.slash = new Map();
    }
    async init() {
        let folder = fs_1.default.readdirSync(this.path).filter(file => file.endsWith('js'));
        for (let file of folder) {
            let base = (await Promise.resolve().then(() => __importStar(require(this.path + '/' + file))))['default'];
            this.slash.set(base.name, base);
        }
    }
    execute(slashCommandName) {
        return this.slash.get(slashCommandName).execute();
    }
}
exports.SlashCommandHandler = SlashCommandHandler;
class ComponentHandler {
    constructor(path) {
        this.path = path;
        this.component = new Map();
    }
    async init() {
        let folder = fs_1.default.readdirSync(this.path).filter(file => file.endsWith('js'));
        for (let file of folder) {
            let base = (await Promise.resolve().then(() => __importStar(require(this.path + '/' + file))))['default'];
            this.component.set(base.type + base.id, base);
        }
    }
    execute(componentIdentifier) {
        return this.component.get(componentIdentifier).execute();
    }
}
exports.ComponentHandler = ComponentHandler;
//# sourceMappingURL=handler.js.map