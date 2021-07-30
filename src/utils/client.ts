import * as discord from "discord.js"
import { CommandHandler, SlashHandler, ComponentsHandler } from "./handler"
import { Embed } from "./embed";

export class Client extends discord.Client {
    public commands: CommandHandler;
    public slash: SlashHandler;
    public components: ComponentsHandler;
    public embed : Embed;
    constructor(options : discord.ClientOptions){
        super(options)
        this.commands = new CommandHandler()
        this.slash = new SlashHandler()
        this.components = new ComponentsHandler()
        this.embed = new Embed()
    }
}