import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js'
import ping from './commands/ping'
import server from './commands/server'
import user from './commands/user'
import link from './commands/link'
import message from './commands/message'
import play from './commands/play'
import pair from './commands/pair'
import unpair from './commands/unpair'

export type Command = {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder,
    execute: Function
}

export const commands: Command[] = [
    ping,
    server,
    user,
    link,
    message,
    play,
    pair,
    unpair,
]