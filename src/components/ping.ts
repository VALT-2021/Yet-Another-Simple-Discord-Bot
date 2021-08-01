import { Message } from "discord.js";
import { Client } from "../utils/client";
import { ComponentsHandlerOptions, Error_type, Permissions_options, ComponentType } from "../utils/handler";
import { Permissions } from "../utils/permissions";

export var components : ComponentsHandlerOptions= { 
    "components" : "ping",
    "component_type" : ComponentType.Button,
    "permissions" : [Permissions.KICK_MEMBERS],
    "bot_permissions" : [Permissions.KICK_MEMBERS],
    execute(message : Message, client : Client, args : string[]) {
        message.channel.send('Command Handler = Said HELLO')
    },
    error(error : Error_type, message : Message, client : Client, options : Permissions_options ){
        switch(error){

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
        }
    },
}