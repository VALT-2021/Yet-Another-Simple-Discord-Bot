import Discord from 'discord.js'
import {
    SlashCommandHandler,
    ComponentHandler
} from './handler'

export class Client extends Discord.Client {
    public slashCommands: SlashCommandHandler
    public components: ComponentHandler

    constructor(options: Discord.ClientOptions) {
        super(options)
        this.slashCommands = new SlashCommandHandler('../routes/discordCommands')
        this.components = new ComponentHandler('../routes/discordComponents')
    }
}