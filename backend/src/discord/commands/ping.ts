import { SlashCommandBuilder } from 'discord.js'
import { Command } from '../commands'

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction: any) {
		await interaction.reply('Pong!')
	},
}

export default command