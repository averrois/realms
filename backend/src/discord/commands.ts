import { SlashCommandBuilder } from 'discord.js'
import ping from './commands/ping'

export type Command = {
    data: SlashCommandBuilder,
    execute: Function
}

export const commands: Command[] = [
    ping
]