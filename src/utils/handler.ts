import { Message, Options } from 'discord.js'
import * as fs from 'fs'
import resolve from 'path'
import { join } from 'path'
import { Client } from './client'
import { Embed } from './embed'
import { Permissions } from './permissions'

export enum Args_types {
    Integer = '<int>',
    Float = '<float>',
    String = '<string>',
    User = '<user>',
    Channel = '<channel>',
    Role = '<role>'
}

export enum Error_type{
    Args = 'ARGS',
    Permissions = 'PERMISSIONS',
    Bot_Permissions = 'BOT_PERMISSIONS',
    Cooldown = 'COOLDOWN',
}

export interface Cooldown_options {
    time_left : number
}

export interface Permissions_options{
    permission_error : Permissions,
}

export interface Args_options{
    index : number
}

export interface CommandHandlerOptions {
    commands : Array<string> | string;
    cooldown? : number;
    args? : Array<string>;
    permissions? : Array<Permissions>;
    bot_permissions? : Array<Permissions>;
    execute(message : Message, client : Client, args : Array<string>) : void;
    help(message : Message) : void;
    error(error : Error_type, message : Message, client : Client, options : Cooldown_options | Permissions_options | Args_options) : void
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
                    const options = require(file).command
                    if(typeof options.commands === 'string') options.commands = [options.commands]
                    if(typeof options.args === 'string') options.args = [options.args]
                    if(typeof options.permissions === 'string') options.permissions = [options.permissions]
                    if(typeof options.bot_permissions === 'string') options.permissions = [options.bot_permissions]
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

    private on_error(command_name: string ,error : Error_type, message : Message, client : Client, options : Cooldown_options | Permissions_options | Args_options){
        this.get(command_name)?.error(error, message, client, options)
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

        if(command.cooldown && command.cooldown > 0){
            var check = this.cooldown_checker(command_name, message.author.id as string)
            if(check !== undefined){
                if(check === true) {
                    var cool_time = this.__get(command_name)?.get(message.author.id as string)
                    var cool_options : Cooldown_options = {
                        time_left : (cool_time) ? cool_time : 0
                    }
                    return this.on_error(command_name, Error_type.Cooldown, message, client, cool_options)
                }
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
                    var bot_perm_options : Permissions_options = {
                        permission_error : each
                    } 
                    this.on_error(command_name, Error_type.Bot_Permissions, message, client, bot_perm_options)
                    return
                }
            }
        }

        if(command.permissions !== undefined){
            var perm = command.permissions
            for(var each of perm){
                if(message.member?.permissions.has(each)) continue
                else {
                    var perm_options : Permissions_options = {
                        permission_error : each
                    }
                    this.on_error(command_name, Error_type.Permissions, message, client, perm_options)
                    return
                }
            }
        }
        
        if(command?.args) {
            var args_check = this.args_checker(command.args, args)
            if(args_check >= 0){
                var args_options : Args_options = {
                    index : args_check
                }
                this.on_error(command_name, Error_type.Args, message, client, args_options)
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

    private cooldown_checker(command_name: string, author_id : string): boolean | undefined{
        var map = this.__get(command_name)
        if(map){
            if(map.has(author_id)) return true
            else return false
        }
        return undefined
    }

    private args_checker(template_args : string[], args : string[]) : number{
        for(var x in template_args){
            if(template_args[x] === Args_types.Integer){
                var number = parseInt(args[x])
                if(number === NaN) return parseInt(x)
                else if(!number) return parseInt(x)
                else continue
            }
            else if(template_args[x] === Args_types.Float){
                var number = parseFloat(args[x])
                if(number === NaN) return parseInt(x)
                else if(!number) return parseInt(x)
                else continue
            }
            else if(template_args[x] === Args_types.String){
                var string = typeof(args[x])
                if(string !== 'string') return parseInt(x)
                else if(!string) return parseInt(x)
                else continue
            }
            else if(template_args[x] === Args_types.User){
                var string = typeof(args[x])
                if(string !== 'string' || !string) return parseInt(x)
                else if(!string.startsWith('<@!') && !string.endsWith('>')) return parseInt(x)
                else continue
            }
            else if(template_args[x] === Args_types.Channel){
                var string = typeof(args[x])
                if(string !== 'string' || !string) return parseInt(x)
                else if(!string.startsWith('<#') && !string.endsWith('>')) return parseInt(x)
                else continue
            }
            else if(template_args[x] === Args_types.Role){
                var string = typeof(args[x])
                if(string !== 'string' || !string) return parseInt(x)
                else if(!string.startsWith('<@&') && !string.endsWith('>')) return parseInt(x)
                else continue
            }
            else return -2
        }
        return -1
    }
}

interface ComponentsHandlerOptions {
    commands : Array<string>;
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

export class ComponentsHandler{
    private __components : Map<string, any>
    private __cooldowns : Map<string, Map<string, number>>

    constructor(){
        this.__components = new Map()
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
        this.__components.set(command_name, options)
        return this.__components
    }

    private __get(command_name: string): Map<string, number> | undefined{
        var command = this.__cooldowns.get(command_name)
        if(command === undefined) return undefined
        else return command
    }

    private get(command_name: string): CommandHandlerOptions | undefined{
        var command = this.__components.get(command_name)
        if(command === undefined) return undefined
        else return command as CommandHandlerOptions
    }
}

export class SlashHandler {
    private __slash : Map<string, any>

    constructor(){
        this.__slash = new Map()
    }
}