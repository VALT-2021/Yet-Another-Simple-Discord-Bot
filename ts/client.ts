import Discord from 'discord.js';

class Client extends Discord.Client {
    public commands: Map<String, any>
    public components: Map<String, any>
    public cooldowns: Map<Discord.User | Discord.GuildMember, any>
}

const client = new Client({
    intents: [
        'GUILDS'
    ]
})