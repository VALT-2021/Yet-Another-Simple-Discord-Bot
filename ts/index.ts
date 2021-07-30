import {
    Client
} from './utils/client'
import { token, prefix } from './auth.json'

const client = new Client({
    intents: [
        'GUILDS',
        'GUILD_VOICE_STATES'
    ]
})

client.slashCommands.init()
client.components.init()

client.on('interaction', async interaction => {
    if (interaction.inGuild()) {
        if (interaction.isCommand()) try {
            client.slashCommands.execute(interaction.commandName.toLowerCase())
        } catch(e) {
            console.log(e)
        } else if (interaction.isMessageComponent()) try {
            client.components.execute(interaction.componentType.toLowerCase() + interaction.customId.slice(0, 6).toLowerCase())
        } catch(e) {
            console.log(e)
        }
    }
})

client.login(token)