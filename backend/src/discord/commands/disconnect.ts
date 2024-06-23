import { SlashCommandBuilder, ChatInputCommandInteraction, Guild } from 'discord.js'
import { Command } from '../commands'
import { getRoomFromName, getRoomNamesWithChannelId } from '../../utils'
import { supabase } from '../../supabase'

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('disconnect this channel from a room in your realm.')
    .addStringOption(option => 
        option
            .setName('room_name')
            .setDescription('the name of the room you want to disconnect with.')
            .setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild as Guild
    if (interaction.user.id !== guild.ownerId) {
      return await interaction.reply({ content: 'only the owner of this server can run this command. sorry!', ephemeral: true })
    }

    const { data: realms, error: getRealmError } = await supabase.from('realms').select('share_id, id, owner_id, map_data').eq('discord_server_id', guild.id)
    if (getRealmError) {
        await interaction.reply({ content: 'There was an error on our end. Sorry!', ephemeral: true })
        return
    }
    if (realms.length === 0) {
        await interaction.reply({ content: "This server is not linked to a realm! Link it with the `/link` command!", ephemeral: true })
        return
    }

    const realm = realms[0]

    const roomName = interaction.options.getString('room_name')!

    const { data: profileData, error: profileError } = await supabase.from('profiles').select('id').eq('discord_id', interaction.user.id).single()
    if (!profileData) {
        return await interaction.reply({ content: "Your profile couldn't be fetched, try again later.", ephemeral: true })
    }

    if (profileData.id !== realm.owner_id) {
        return await interaction.reply({ content: 'You must be the owner of the realm to disconnect a room!', ephemeral: true })
    }

    const mapData = realm.map_data
    const room = getRoomFromName(mapData, roomName)

    if (!room) {
        const roomNames = getRoomNamesWithChannelId(mapData, interaction.channelId)
        const message = `No room with that name is connected to this channel. Here are the rooms this channel is connected to: ${roomNames.map(name => '`' + name + '`').join(', ')}`
        return await interaction.reply({ content: message, ephemeral: true })
    }

    delete room.channelId 

    const { error: updateError } = await supabase.from('realms').update({ map_data: mapData }).eq('id', realm.id).eq('owner_id', realm.owner_id)
    if (updateError) {
        return await interaction.reply({ content: 'There was an error on our end. Sorry!', ephemeral: true })
    }

    await interaction.reply({ content: `${interaction.channel} has been disconnected from ` + '`' + room.name + '`' + '!', ephemeral: true })
  },
}

export default command
