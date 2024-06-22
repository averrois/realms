import { client } from './client'

export async function sendMessageToChannel(senderId: string, guildId: string, channelId: string, message: string) {
    try {
        const guild = await client.guilds.fetch(guildId)
        if (!guild) {
            return
        }

        const channel = await guild.channels.fetch(channelId)
        if (!channel || !channel.isTextBased()) {
            return
        }

        const member = await guild.members.fetch(senderId)
        if (!member) {
            return
        }

        await channel.send(message)
    } catch (err) {
    }
}

export async function userIsInGuild(userId: string, guildId: string) {
    try {
        const guild = await client.guilds.fetch(guildId)
        if (!guild) {
            return false
        }

        const member = await guild.members.fetch(userId)
        if (!member) {
            return false
        }

        return true
    } catch {
        return false
    }
}