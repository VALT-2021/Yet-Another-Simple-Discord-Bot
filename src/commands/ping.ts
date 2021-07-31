import { Message } from "discord.js";
import { Client } from "../utils/client";
import { Args_options, CommandHandlerOptions, Cooldown_options, Error_type, Permissions_options } from "../utils/handler";

export var command : CommandHandlerOptions = { 
    "commands" : ["ping", "p", "hello"],
    "cooldown" : 20,
    execute(message : Message, client : Client, args : string[]) {
    message.channel.send('Command Handler = Said HELLO')
    },
    help(message : Message){
        message.channel.send('I am help')
    },
    error(error : Error_type, message : Message, client : Client, options : Cooldown_options | Permissions_options | Args_options){
        message.channel.send('I am error')
    },
}