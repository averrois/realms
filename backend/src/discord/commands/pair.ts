import { SlashCommandBuilder, ChatInputCommandInteraction, Guild } from 'discord.js'
import { Command } from '../commands'

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('pair')
    .setDescription('Pair this channel with a room from your realm.')
    .addStringOption(option => 
        option
            .setName('room_name')
            .setDescription('The name of the room you want to pair with.')
            .setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild as Guild
    if (interaction.user.id !== guild.ownerId) {
      await interaction.reply({ content: 'only the owner of this server can run this command. sorry!', ephemeral: true })
      return
    }

    const roomName = interaction.options.getString('room_name')
    

    await interaction.reply('You passed the room name: ' + interaction.options.getString('room_name') + '!')

  },
}

export default command
