import { client } from './client'

export async function sendMessageToChannel(guildId: string, channelId: string, message: string) {
    try {
        const guild = await client.guilds.fetch(guildId)
        if (!guild) {
            return
        }

        const channel = await guild.channels.fetch(channelId)
        if (!channel || !channel.isTextBased()) {
            return
        }

        await channel.send(message)
    } catch (err) {
    }
}