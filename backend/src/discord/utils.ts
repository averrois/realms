import { client } from './client'

export async function sendMessageToChannel(guildId: string, channelId: string, message: string) {
    const guild = await client.guilds.fetch(guildId)
    if (!guild) {
        console.log('No guild with this ID found.')
        return
    }

    const channel = await guild.channels.fetch(channelId)
    if (!channel || !channel.isTextBased()) {
        console.log('No channel with this ID found.')
        return
    }

    await channel.send(message)
}