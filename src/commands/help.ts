import { Message } from "discord.js";
import { Client } from "../utils/client";
import { Permissions } from "../utils/permissions";

export = { 
    "commands" : "help",
    "cooldown" : 20,
    execute(message : Message, client : Client, args : string[]) {
    message.channel.send('Command Handler = Said HELLO')
    },
    "args" : ['<int>'],
    "argsError" : "You have typed args wrong",
    "permissions" : [Permissions.BAN_MEMBERS]
}