import { Message } from 'discord.js'
import * as fs from 'fs'
import { Client } from './client'

export class CommandHandler {
    private __commands: Map<string, string>
    
    constructor(){
        this.__commands = new Map()
    }
    /**
     * 
     * @param folder Exact Folder Location
     */
    load(folder : string){
        if(fs.existsSync(folder)){
            var folders = fs.readdirSync(folder)
            if(folders.length !== 0){
                for(var x in folders){
                    if(folders[x].endsWith('.js')) this.set(folders[x].replace('.js', ''), `${folder}${folders[x]}`)
                    else continue
                }
            }
            else console.log(`No command is found in that folder.`)
        }
        else console.log(`Folder is not found : ${folder}`)
    }

    private set(command_name : string, foldername : string){
        this.__commands.set(command_name.toLowerCase(), foldername)
        return this.__commands
    }

    private get(command_name:string){
        return this.__commands.get(command_name.toLowerCase())
    }

    run(command_name:string, message : Message , client : Client, args : string[]){
        var folder = this.get(command_name) as string
        const { execute } = require('../' + folder)
        execute(message, client, args);
    }

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
    load(folder : string){
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

    run(command_name:string, message : Message , client : Client, args : string[]){
        var folder = this.get(command_name) as string
        const { execute } = require('../' + folder)
        execute(message, client, args);
    }

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
    load(folder : string){
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

    run(command_name:string, message : Message , client : Client, args : string[]){
        var folder = this.get(command_name) as string
        const { execute } = require('../' + folder)
        execute(message, client, args);
    }

    valid(command_name:string): boolean{
        var command = this.get(command_name)
        if(command !== undefined) return true
        else return false
    }
}