"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const handler_1 = require("./handler");
class Client extends discord_js_1.default.Client {
    constructor(options) {
        super(options);
        this.slashCommands = new handler_1.SlashCommandHandler('../routes/discordCommands');
        this.components = new handler_1.ComponentHandler('../routes/discordComponents');
    }
}
exports.Client = Client;
//# sourceMappingURL=client.js.map