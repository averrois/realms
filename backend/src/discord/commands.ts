import { SlashCommandBuilder } from 'discord.js'
import ping from './commands/ping'
import server from './commands/server'
import user from './commands/user'

export type Command = {
    data: SlashCommandBuilder,
    execute: Function
}

export const commands: Command[] = [
    ping,
    server,
    user,
]