import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { sendMessageToChannel } from '../utils'
import { Command } from '../commands'

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('message')
    .setDescription('Get a message from the bot.'),
  async execute(interaction: ChatInputCommandInteraction) {
    await sendMessageToChannel(interaction.guildId!, interaction.channelId, 'Hey!')
    await interaction.reply('Message sent!')
  },
}

export default command
