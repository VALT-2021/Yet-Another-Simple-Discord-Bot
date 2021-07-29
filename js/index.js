"use strict";
exports.__esModule = true;
var discord_1 = require('discord.js')
var handler_1 = require("../utils/js/handlerhandler");
var client = new discord_1.Client({
    intents: [
        'GUILDS'
    ]
});

var handler = new handler_1['default']('./js/discordCommands', './js/discordComponents');
handler.init();
client.once('ready', function () {
    console.log('Ready Client ' + client.user.username);
});
