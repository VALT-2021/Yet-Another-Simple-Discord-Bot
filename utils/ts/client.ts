import * as Discord from 'discord.js';

export default class Client extends Discord.Client {
    public commands: Map<any, any>
    public components: Map<any, any>
    public cooldowns: Map<Discord.User | Discord.GuildMember, any>
    public type: String
}