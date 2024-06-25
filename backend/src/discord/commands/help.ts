import { SlashCommandBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, Guild } from 'discord.js'
import { Command } from '../commands'

const command: Command = {
  cooldown: 0,
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('learn the Realms commands'),
  async execute(interaction: ChatInputCommandInteraction) {

    const commandInstructions = [
        '​\n`/link` - link this server to a realm.',
        '`/play` - join the realm.',
        '`/connect <room_name>` - connect this channel to a specific room.',
        '`/disconnect <room_name>` - disconnect this channel from a room.',
        '`/rooms` - see which rooms are connected to this channel.',
    ]

    await interaction.reply({ content: commandInstructions.join('\n'), ephemeral: true })
  },
}

export default command
