import { SlashCommandBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, Guild } from 'discord.js'
import { Command } from '../commands'
import { supabase } from '../../supabase'

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Join the realm!'),
  async execute(interaction: ChatInputCommandInteraction) {

    const guildId = interaction.guildId
    const { data: realm, error: getRealmError } = await supabase.from('realms').select('share_id, id').eq('discord_server_id', guildId).single()
    if (getRealmError) {
        await interaction.reply({ content: 'There was an error on our end. Sorry!', ephemeral: true })
        return
    }
    if (!realm) {
        await interaction.reply({ content: 'This server is not linked to a realm! Link it to start playing.', ephemeral: true })
        return
    }

    const link = new URL(process.env.FRONTEND_URL! + `/play/${realm.id}`)
    const params = new URLSearchParams({
        shareId: realm.share_id,
    })
    link.search = params.toString()

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Play')
          .setStyle(ButtonStyle.Link)
          .setURL(link.toString())
      )

    await interaction.reply({ content: '​\n\n**click the button below to join the realm.**\n​', components: [row], ephemeral: true })
  },
}

export default command
