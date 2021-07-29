import Client from '../utils/ts/client'
import Handler from '../utils/ts/handler'

const client = new Client({
    intents: [
        'GUILDS'
    ]
})

const handler = new Handler('./ts/discordCommands', './ts/discordComponents')
handler.init()

client.once('ready', () => {
    console.log('Ready Client')
})