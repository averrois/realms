import { SlashCommandBuilder, ChatInputCommandInteraction, Guild, GuildChannel } from 'discord.js'
import { Command } from '../commands'
import { getRoomFromName, getRoomNames } from '../../utils'
import { supabase } from '../../supabase'

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('connect')
    .setDescription('connect this channel with a room from your realm.')
    .addStringOption(option => 
        option
            .setName('room_name')
            .setDescription('the name of the room you want to connect with.')
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
        return await interaction.reply({ content: 'You must be the owner of the realm to connect a room!', ephemeral: true })
    }

    const mapData = realm.map_data
    const room = getRoomFromName(mapData, roomName)

    if (!room) {
        const roomNames = getRoomNames(mapData)
        const message = `No room with that name was found in your realm! Here are the rooms in your realm: ${roomNames.map(name => '`' + name + '`').join(', ')}`
        return await interaction.reply({ content: message, ephemeral: true })
    }

    room.channelId = interaction.channelId

    const { error: updateError } = await supabase.from('realms').update({ map_data: mapData }).eq('id', realm.id).eq('owner_id', realm.owner_id)
    if (updateError) {
        return await interaction.reply({ content: 'There was an error on our end. Sorry!', ephemeral: true })
    }

    // check if channel is private
    const everyone = guild.roles.everyone
    const channel = interaction.channel as GuildChannel
    let isPrivate = false
    if (channel.permissionsFor(everyone)?.has('ViewChannel') === false) {
        isPrivate = true
    }

    let reply = `${interaction.channel} has been connected to ` + '`' + room.name + '`' + '!'
    if (isPrivate) {
        reply += '\n\nWARNING: We noticed this channel is private. This means that users in your realm will be able to send and receive messages from it, regardless of their permissions. If you want to keep this channel private, you can use the `/disconnect` command to disconnect it from the room. If you are okay with this, remember to add the bot to the channel so it can send messages!'
    }

    await interaction.reply({ content: reply, ephemeral: true })
  },
}

export default command
