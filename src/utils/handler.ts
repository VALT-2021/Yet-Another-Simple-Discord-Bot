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
    User = 'User',
    Channel = 'Channel',
    Roles = 'Role'
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
    cooldownError? : string | Embed;
}

export class CommandHandler {
    private __commands : Map<string, Object>
    private __cooldowns : Map<string, Map<string, number>>

    constructor(){
        this.__commands = new Map()
        this.__cooldowns = new Map()
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
                        this.__set(command, options)
                        this.set(command, options)
                    }
                }
            }
            else console.log(`No .js Files were found in ${path}`)
        }
        else console.log(`No Folder found by the name of ${folder}`)
    }

    private __set(command_name : string, options : Object): Map<string, Map<string, number>>{
        this.__cooldowns.set(command_name, new Map<string, number>())
        return this.__cooldowns
    }

    private set(command_name : string, options : Object): Map<string, Object>{
        this.__commands.set(command_name, options)
        return this.__commands
    }

    private __get(command_name: string): Map<string, number> | undefined{
        var command = this.__cooldowns.get(command_name)
        if(command === undefined) return undefined
        else return command
    }

    private get(command_name: string): CommandHandlerOptions | undefined{
        var command = this.__commands.get(command_name)
        if(command === undefined) return undefined
        else return command as CommandHandlerOptions
    }

    run(command_name: string, message : Message, client : Client, args : string[]){
        var command = this.get(command_name)
        if(!command) return console.error(`Error : Command ${command_name} doesn\' t exists`)

        if(command.cooldown){
            var check = this.cooldown_checker(command_name, message.author.id as string)
            if(check !== undefined){
                if(check === true) return this.cooldown_error(command_name, command, message)
                else {
                    this.cooldown_start(command_name, message.author.id as string, command)
                    setTimeout(() => {
                        this.cooldown_end(command_name, message.author.id as string)
                    }, (command.cooldown * 1000))
                }
            }
        }

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
        
        if(command?.args) {
            var args_check = this.args_checker(command.args, args)
            if(args_check === Args_error.Float || args_check === Args_error.String || args_check === Args_error.Integer || args_check === Args_error.User || args_check === Args_error.Roles || args_check === Args_error.Channel){
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

    private cooldown_end(command_name:string, author_id : string){
        var cool_map = this.__get(command_name)
        if(cool_map){
            cool_map.delete(author_id)
            return this.__cooldowns
        }
    }

    private cooldown_start(command_name:string, author_id : string, command : CommandHandlerOptions){
        var cool_map = this.__get(command_name)
        if(cool_map && command.cooldown){
            cool_map.set(author_id, (Date.now() + (command.cooldown * 1000)))
            return this.__cooldowns
        }
    }

    private cooldown_error(command_name:string, command : CommandHandlerOptions, message : Message){
        var cool_time = this.__get(command_name)?.get(message.author.id as string)
        if(command.cooldown && cool_time){
            if(command.cooldownError){
                if(command.cooldownError instanceof Embed){
                    message.channel.send({
                        embeds : [command.cooldownError]
                    })
                    return
                }
                else{
                    message.channel.send(command.cooldownError)
                }
            }
            else {
                message.channel.send(`You need to wait ${((cool_time - Date.now())/1000).toFixed(2)} seconds before running ${command_name} command.`)
            }
        }
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

    private cooldown_checker(command_name: string, author_id : string): boolean | undefined{
        var map = this.__get(command_name)
        if(map){
            if(map.has(author_id)) return true
            else return false
        }
        return undefined
    }

    private args_checker(template_args : string[], args : string[]) : boolean | Args_error{
        for(var x in template_args){
            if(template_args[x] === '<int>'){
                var number = parseInt(args[x])
                if(number === NaN) return Args_error.Integer
                else if(!number) return Args_error.Integer
                else continue
            }
            else if(template_args[x] === '<float>'){
                var number = parseFloat(args[x])
                if(number === NaN) return Args_error.Float
                else if(!number) return Args_error.Float
                else continue
            }
            else if(template_args[x] === '<string>'){
                var string = typeof(args[x])
                if(string !== 'string') return Args_error.String
                else if(!string) return Args_error.String
                else continue
            }
            else if(template_args[x] === '<user>'){
                var string = typeof(args[x])
                if(string !== 'string' || !string) return Args_error.User
                else if(!string.startsWith('<@!') && !string.endsWith('>')) return Args_error.User
                else continue
            }
            else if(template_args[x] === '<channel>'){
                var string = typeof(args[x])
                if(string !== 'string' || !string) return Args_error.Channel
                else if(!string.startsWith('<#') && !string.endsWith('>')) return Args_error.Channel
                else continue
            }
            else if(template_args[x] === '<role>'){
                var string = typeof(args[x])
                if(string !== 'string' || !string) return Args_error.Roles
                else if(!string.startsWith('<@&') && !string.endsWith('>')) return Args_error.Roles
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