import { SlashCommandBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { Command } from '../commands'

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Link your server to a realm.'),
  async execute(interaction: ChatInputCommandInteraction) {
    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Click Here')
          .setStyle(ButtonStyle.Link)
          .setURL(process.env.FRONTEND_URL!)
      )

    await interaction.reply({ content: '​\n\n**Click the button below to link this Discord server to a realm!**\n​', components: [row], ephemeral: true })
  },
}

export default command
