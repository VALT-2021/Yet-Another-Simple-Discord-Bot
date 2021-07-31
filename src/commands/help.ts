import { Message } from "discord.js";
import { Client } from "../utils/client";
import { CommandHandlerOptions, Error_type, Cooldown_options, Permissions_options, Args_options } from "../utils/handler";
import { Permissions } from "../utils/permissions";

export var command : CommandHandlerOptions = { 
    "commands" : "help",
    "cooldown" : 10,
    execute(message : Message, client : Client, args : string[]) {
        message.channel.send('Command Handler = Said HELLO')
    },
    help(message : Message){
        message.channel.send('I am help')
    },
    error(error : Error_type, message : Message, client : Client, options : Cooldown_options | Permissions_options | Args_options){
        message.channel.send('I am error')
    },
    "args" : ['<int>'],
    "permissions" : [Permissions.BAN_MEMBERS],
}