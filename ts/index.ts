import Discord from 'discord.js'
import Client from '../utils/client'
import Handler from '../utils/handler'

const client = new Client({
    intents: [
        'GUILDS'
    ]
})

const handler = new Handler('./ts/discordCommands', './ts/discordComponents')
handler.init()

client.once('ready', () => {
    console.log('Ready Client ' + client.user.username)
})