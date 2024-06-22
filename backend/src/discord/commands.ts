import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js'
import link from './commands/link'
import play from './commands/play'
import connect from './commands/connect'
import disconnect from './commands/disconnect'
import help from './commands/help'
import rooms from './commands/rooms'

export type Command = {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder,
    execute: Function
}

export const commands: Command[] = [
    link,
    play,
    connect,
    disconnect,
    help,
    rooms
]