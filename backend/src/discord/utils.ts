import { client } from './client'

export async function sendMessageToChannel(guildId: string, channelId: string, message: string) {
    const guild = await client.guilds.fetch(guildId)
    console.log(guild.name)
}