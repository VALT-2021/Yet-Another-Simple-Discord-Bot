import { Message } from "discord.js";
import { Client } from "../utils/client";

export = { 
    "commands" : "help",
    "cooldown" : 20,
    execute(message : Message, client : Client, args : string[]) {
    message.channel.send('Command Handler = Said HELLO')
    },
    "args" : ['<int>'],
    "argsError" : "You have typed args wrong"
}