import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { Command } from '../commands'

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply('I like fortnite a lot.')
	},
}

export default command