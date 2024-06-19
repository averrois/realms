import { SlashCommandBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, Guild } from 'discord.js'
import { Command } from '../commands'

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Link your server to a realm.'),
  async execute(interaction: ChatInputCommandInteraction) {

    const guild = interaction.guild as Guild
    if (interaction.user.id !== guild.ownerId) {
      await interaction.reply({ content: 'only the owner of this server can link it to a realm. sorry!', ephemeral: true })
      return
    }

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Click Here')
          .setStyle(ButtonStyle.Link)
          .setURL(process.env.FRONTEND_URL!)
      )

    await interaction.reply({ content: '​\n\n**🚀 click the button below to link this server to a realm! 🚀**\n​', components: [row], ephemeral: true })
  },
}

export default command
