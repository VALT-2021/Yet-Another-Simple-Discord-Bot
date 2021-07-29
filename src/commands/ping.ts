import { Message } from "discord.js";
import { Client } from "../utils/client";

export function execute(message : Message, client : Client, args : string[]) {
    message.channel.send('Command Handler = Said HELLO')
}