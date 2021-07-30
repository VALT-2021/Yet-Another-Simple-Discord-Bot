import { MessageEmbed, MessageEmbedOptions } from "discord.js";
export class Embed extends MessageEmbed{
    private __embed : MessageEmbed
    constructor(options? : MessageEmbed | MessageEmbedOptions){
        super(options)
        this.__embed = new MessageEmbed()
    }

    clear(){
        this.__embed = new MessageEmbed()
    }
}