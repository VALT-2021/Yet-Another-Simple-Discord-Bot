import { Message } from 'discord.js'
import * as fs from 'fs'
import resolve from 'path'
import { join } from 'path'
import { Client } from './client'
import { Embed } from './embed'
import { Permissions } from './permissions'

enum Args_error {
    Integer = 'Integer',
    Float = 'Float',
    String = 'String',
}

interface CommandHandlerOptions {
    commands : Array<string>;
    args? : Array<string>;
    argsError? : string | Embed;
    permissionError? : string | Embed;
    permissions? : Array<Permissions>;
    bot_permissions? : Array<Permissions>;
    bot_permissionError? : string | Embed;
    requiredroles? : Array<string>;
    execute(message : Message, client : Client, args : Array<string>) : void;
    help(message : Message) : void;
    cooldown? : number;
}

export class CommandHandler {
    private __commands : Map<string, Object>

    constructor(){
        this.__commands = new Map()
    }

    load(folder : string){
        var path = resolve.resolve(folder)
        if(fs.existsSync(path)){
            var files = fs.readdirSync(path).filter(f => f.endsWith('.js'))
            if(files){
                for(var file of files){
                    file = join(path, file)
                    const options = require(file)
                    if(typeof options.commands === 'string') options.commands = [options.commands]
                    if(typeof options.args === 'string') options.args = [options.args]
                    if(typeof options.permissions === 'string') options.permissions = [options.permissions]
                    if(typeof options.bot_permissions === 'string') options.permissions = [options.permissions]
                    if(typeof options.requiredroles === 'string') options.requiredroles = [options.requiredroles]
                    for(var command of options.commands){
                        this.set(command, options)
                    }
                }
            }
            else console.log(`No .js Files were found in ${path}`)
        }
        else console.log(`No Folder found by the name of ${folder}`)
    }

    private set(command_name : string, options : Object): Map<string, Object>{
        this.__commands.set(command_name, options)
        return this.__commands
    }

    private get(command_name: string): CommandHandlerOptions | undefined{
        var command = this.__commands.get(command_name)
        if(command === undefined) return undefined
        else return command as CommandHandlerOptions
    }

    run(command_name: string, message : Message, client : Client, args : string[]){
        var command = this.get(command_name)
        if(!command) return console.error(`Error : Command ${command_name} doesn\' t exists`)
        client.embed.clear()

        if(command.bot_permissions !== undefined){
            var perm = command.bot_permissions
            for(var each of perm){
                if(message.guild?.me?.permissions.has(each)) continue
                else {
                    this.perm_error(each, message, command, true)
                    return
                }
            }
        }

        if(command.permissions !== undefined){
            var perm = command.permissions
            for(var each of perm){
                if(message.member?.permissions.has(each)) continue
                else {
                    this.perm_error(each, message, command, false)
                    return
                }
            }
        }
        console.log(command.args)
        if(command?.args) {
            var args_check = this.args_checker(command.args, args)
            if(args_check === Args_error.Float || args_check === Args_error.String || args_check === Args_error.Integer){
                this.args_error(message, command)
                return
            }
        }
        
        command.execute(message, client, args)
    }

    valid(command_name:string) : boolean{
        var command = this.__commands.get(command_name)
        if(command === undefined) return false
        else return true
    }

    private perm_error(error : Permissions, message : Message, command: CommandHandlerOptions, bot : boolean){
        if(bot){
            if(command.bot_permissionError){
                if(command.bot_permissionError instanceof Embed){
                    message.channel.send({
                        embeds : [command.bot_permissionError]
                    })
                    return
                }
                else{
                    message.channel.send(command.bot_permissionError)
                }
            }
            else {
                message.channel.send(`I am missing ${error} permission.`)
            }
        }
        else{
            if(command.permissionError){
                if(command.permissionError instanceof Embed){
                    message.channel.send({
                        embeds : [command.permissionError]
                    })
                    return
                }
                else{
                    message.channel.send(command.permissionError)
                }
            }
            else {
                message.channel.send(`You are missing ${error} permission.`)
            }
        }
    }

    private args_error(message : Message, command : CommandHandlerOptions){
        if(command.argsError){
            if(command.argsError instanceof Embed){
                message.channel.send({
                    embeds : [command.argsError]
                })
                return
            }
            else { 
                message.channel.send({
                    content : command.argsError as string
                })
                return
            }
        }
        else{
            message.channel.send(`Error : You have given invalid arguments \nArguements should be : ${command.args} `)
        }
    }

    private args_checker(template_args : string[], args : string[]) : boolean | Args_error{
        for(var x in args){
            if(template_args[x] === '<int>'){
                var number = parseInt(args[x])
                if(number === NaN) return Args_error.Integer
                else continue
            }
            else if(template_args[x] === '<float>'){
                var number = parseFloat(args[x])
                if(number === NaN) return Args_error.Float
                else continue
            }
            else if(template_args[x] === '<string>'){
                var string = typeof(args[x])
                if(string !== 'string') return Args_error.String
                else continue
            }
        }
        return true
    }
}

export class ComponentsHandler{
    private __components : Map<string, any>

    constructor(){
        this.__components = new Map()
    }
}

export class SlashHandler {
    private __slash : Map<string, any>

    constructor(){
        this.__slash = new Map()
    }
}