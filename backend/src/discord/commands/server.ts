import { SlashCommandBuilder, ChatInputCommandInteraction, Guild } from 'discord.js'
import { Command } from '../commands'

const command: Command = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about the server.'),
	async execute(interaction: ChatInputCommandInteraction) {
        const guild = interaction.guild as Guild
		// interaction.guild is the object representing the Guild in which the command was run
		await interaction.reply(`This server is ${guild.name} and has ${guild.memberCount} members.`)
	},
}

export default command