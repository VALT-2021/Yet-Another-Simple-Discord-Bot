import Discord from 'discord.js';
import { SlashCommandHandler, ComponentHandler } from './handler';
export declare class Client extends Discord.Client {
    slashCommands: SlashCommandHandler;
    components: ComponentHandler;
    constructor(options: Discord.ClientOptions);
}
//# sourceMappingURL=client.d.ts.map