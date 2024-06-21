import { SlashCommandBuilder } from 'discord.js'
import ping from './commands/ping'
import server from './commands/server'
import user from './commands/user'
import link from './commands/link'
import message from './commands/message'
import play from './commands/play'

export type Command = {
    data: SlashCommandBuilder,
    execute: Function
}

export const commands: Command[] = [
    ping,
    server,
    user,
    link,
    message,
    play,
]