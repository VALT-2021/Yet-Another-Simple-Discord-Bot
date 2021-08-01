import { Message } from "discord.js";
import { Client } from "../utils/client";
import { CommandHandlerOptions, Error_type, Cooldown_options, Permissions_options, Args_options, Args_types } from "../utils/handler";
import { Permissions } from "../utils/permissions";

export var command : CommandHandlerOptions= { 
    "commands" : "template",
    "cooldown" : 0,
    "args" : [Args_types.Integer],
    "permissions" : [Permissions.KICK_MEMBERS],
    "bot_permissions" : [Permissions.KICK_MEMBERS],
    execute(message : Message, client : Client, args : string[]) {
        message.channel.send('Command Handler = Said HELLO')
    },
    help(message : Message){
        message.channel.send(`You need to have args in this manner ${this.args?.join(' , ')}`)
    },
    error(error : Error_type, message : Message, client : Client, options : Cooldown_options | Permissions_options | Args_options){
        switch(error){
            case Error_type.Args :
                //Args error occured.
                // Handling this error :
                // var args_index = options as Args_options
                // message.channel.send(`${this.args?[args_index.index]: String} is wrong on your side`)

            case Error_type.Bot_Permissions:
                // Bot Permission Error Occured.
                // Handling this error :
                // var bot_perm_options = options as Permissions_options
                // message.channel.send(`I am missing ${perm_options.permission_error} permissions.`)

            case Error_type.Permissions :
                // Member Permissions Error Occured.
                // Handling this error :
                // var perm_options = options as Permissions_options
                // message.channel.send(`You are missing ${perm_options.permission_error} permissions`)
            case Error_type.Cooldown :
                // Cooldown Error occured.
                // Handling this error
                // var cool_options = options as Cooldown_options
                // message.channel.send(`You need to wait ${cool_options.time_left} before using ${this.commands} command.`)
        }
    },
}