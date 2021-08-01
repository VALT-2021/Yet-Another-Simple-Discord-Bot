import Discord from 'discord.js'
import { Client } from './utils/client'
import * as auth from './auth.json'

const prefix = auth.prefix
const client = new Client({
    intents : [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_VOICE_STATES ]
})

client.commands.load('./commands/')
client.components.load('./components/')

client.on('ready', () => {
    console.log(`We have logged in as ${client.user?.tag}`)
})

client.on('messageCreate', (message) => {
    if(message.channel.type !== 'GUILD_TEXT') return
    if(message.content.startsWith(prefix)){
        let args = message.content.slice(prefix.length).trim().split(' ')
        let cmd = args.shift()?.toLowerCase() as string
        if(client.commands.valid(cmd)){
            client.commands.run(cmd, message, client, args)
        }
    }
})

// client.login(auth.token)