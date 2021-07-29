import Discord from 'discord.js';

let client = new Discord.Client({
    intents: [
        'GUILDS'
    ]
})

client.once('ready', async () => {
    
})