import { Collection, Message } from 'discord.js'
import * as fs from 'fs'
import { Client } from './client'

export class CommandHandler {
    private __commands: Map<string, any>
    private __cooldowns : Map<string, Map<string, number>>

    constructor(){
        this.__commands = new Map()
        this.__cooldowns = new Map()
    }
    /**
     * 
     * @param folder Exact Folder Location
     */
    load(folder : string): void{
        if(fs.existsSync(folder)){
            var folders = fs.readdirSync(folder)
            if(folders.length !== 0){
                for(var x in folders){
                    if(folders[x].endsWith('.js')) {
                        const command = require('../' + `${folder}${folders[x]}`)
                        this.cool_set(command.name)
                        this.set(command.name, command)
                    }
                    else continue
                }
            }
            else console.log(`No command is found in that folder.`)
        }
        else console.log(`Folder is not found : ${folder}`)
    }

    private set(command_name : string, exe_command : any){
        this.__commands.set(command_name.toLowerCase(), exe_command)
        return this.__commands
    }

    private get(command_name:string){
        return this.__commands.get(command_name.toLowerCase())
    }

    private cool_set(command_name : string){
        this.__cooldowns.set(command_name, new Map())
        return this.__cooldowns
    }

    private cool_get(command_name : string){
        return this.__cooldowns.get(command_name)
    }

    private cool_start(command_name:string, timestamp : number ,author_id : string): boolean{
        console.log(`Author ID : ${author_id}\nTimestamp : ${timestamp}`)
        this.__cooldowns.get(command_name)?.set(author_id, timestamp)
        console.log('')
        console.log(this.__cooldowns)
        if(this.cool_get(command_name)) return false
        else return true
    }

    private cool_end(command_name:string, author_id : string): boolean{
        this.cool_get(command_name)?.delete(author_id)
        if(this.cool_get(command_name)) return false
        else return true
    }

    private cool_status(command_name:string, author_id:string){
        if(this.cool_get(command_name)?.has(author_id)) return true
        else return false
    }
    /**
     * 
     * @param command_name Command you want to run
     * @param message Message Class of Discord
     * @param client Client that was created
     * @param args Rest arguements of message
     */
    run(command_name:string, message : Message , client : Client, args : string[]): void{
        var cooldown_sec = this.get(command_name).cooldown
        var time = Date.now() + cooldown_sec * 1000
        if(!this.cool_status(command_name, message.author.id)){
            this.cool_start(command_name, time, message.author.id)
            this.get(command_name).execute(message, client, args);
            setTimeout(() => {
                this.cool_end(command_name, message.author.id)
            }, cooldown_sec)
        }
        else message.channel.send(`You need to wait for sometime before running ${command_name} command.`)
    }

    /**
     * 
     * @param command_name Command that you want to validate
     * @returns true or false
     */
    valid(command_name:string): boolean{
        var command = this.get(command_name)
        if(command !== undefined) return true
        else return false
    }
}

export class ComponentsHandler {
    private __components: Map<string, string>
    
    constructor(){
        this.__components = new Map()
    }
    /**
     * 
     * @param folder Exact Folder Location
     */
    load(folder : string): void{
        if(fs.existsSync(folder)){
            var folders = fs.readdirSync(folder)
            if(folders.length !== 0){
                for(var x in folders){
                    if(folders[x].endsWith('.js')) this.set(folders[x].replace('.js', ''), `${folder}${folders[x]}`)
                    else continue
                }
            }
            else console.log(`No components is found in that folder.`)
        }
        else console.log(`Folder is not found : ${folder}`)
    }

    private set(command_name : string, foldername : string){
        this.__components.set(command_name.toLowerCase(), foldername)
        return this.__components
    }

    private get(command_name:string){
        return this.__components.get(command_name.toLowerCase())
    }

    /**
     * 
     * @param command_name Command you want to run
     * @param message Message Class of Discord
     * @param client Client that was created
     * @param args Rest arguements of message
     */
    run(command_name:string, message : Message , client : Client, args : string[]): void{
        var folder = this.get(command_name) as string
        const { execute } = require('../' + folder)
        execute(message, client, args);
    }

    /**
     * 
     * @param command_name Command that you want to validate
     * @returns true or false
     */
    valid(command_name:string): boolean{
        var command = this.get(command_name)
        if(command !== undefined) return true
        else return false
    }
}

export class SlashHandler {
    private __slash: Map<string, string>
    
    constructor(){
        this.__slash = new Map()
    }
    /**
     * 
     * @param folder Exact Folder Location
     */
    load(folder : string): void{
        if(fs.existsSync(folder)){
            var folders = fs.readdirSync(folder)
            if(folders.length !== 0){
                for(var x in folders){
                    if(folders[x].endsWith('.js')) this.set(folders[x].replace('.js', ''), `${folder}${folders[x]}`)
                    else continue
                }
            }
            else console.log(`No slash-command is found in that folder.`)
        }
        else console.log(`Folder is not found : ${folder}`)
    }

    private set(command_name : string, foldername : string){
        this.__slash.set(command_name.toLowerCase(), foldername)
        return this.__slash
    }

    private get(command_name:string){
        return this.__slash.get(command_name.toLowerCase())
    }

    /**
     * 
     * @param command_name Command you want to run
     * @param message Message Class of Discord
     * @param client Client that was created
     * @param args Rest arguements of message
     */
    run(command_name:string, message : Message , client : Client, args : string[]): void{
        var folder = this.get(command_name) as string
        const { execute } = require('../' + folder)
        execute(message, client, args);
    }

    /**
     * 
     * @param command_name Command that you want to validate
     * @returns true or false
     */
    valid(command_name:string): boolean{
        var command = this.get(command_name)
        if(command !== undefined) return true
        else return false
    }
}