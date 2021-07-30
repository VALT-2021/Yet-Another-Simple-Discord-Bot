import { Message } from "discord.js";
import { Client } from "../utils/client";

export = { 
    "commands" : ["ping", "p", "hello"],
    "cooldown" : 20,
    "args" : "",
    execute(message : Message, client : Client, args : string[]) {
    message.channel.send('Command Handler = Said HELLO')
}

}