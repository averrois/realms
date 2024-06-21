import { SlashCommandBuilder, ChatInputCommandInteraction, Guild } from 'discord.js'
import { Command } from '../commands'
import { supabase } from '../../supabase'
import { getRoomNamesWithChannelId } from '../../utils'

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('rooms')
    .setDescription('see which rooms are connected to this channel'),
  async execute(interaction: ChatInputCommandInteraction) {

    const guild = interaction.guild as Guild
    const { data: realms, error: getRealmError } = await supabase.from('realms').select('map_data').eq('discord_server_id', guild.id)
    if (getRealmError) {
        await interaction.reply({ content: 'There was an error on our end. Sorry!', ephemeral: true })
        return
    }
    if (realms.length === 0) {
        await interaction.reply({ content: "This server is not linked to a realm! Link it with the `/link` command!", ephemeral: true })
        return
    }

    const roomNames = getRoomNamesWithChannelId(realms[0].map_data, interaction.channelId)
    const message = `This channel is connected to rooms: ${roomNames.map(name => '`' + name + '`').join(', ')}`

    await interaction.reply({ content: roomNames.length > 0 ? message : 'There are no rooms connected to this channel!', ephemeral: true })
  },
}

export default command
