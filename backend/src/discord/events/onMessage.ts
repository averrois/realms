import { Events, Message } from 'discord.js'
import { Event } from '../events'
import { sessionManager } from '../../session'
import { io } from '../..'
import { userIsInGuild } from '../utils'

const event: Event = {
    name: Events.MessageCreate,
    async execute(message: Message) {
        if (message.author.bot || message.system) return
        if (!message.guild) return
        const channelId = message.channel.id
        const session = sessionManager.getSessionByServerId(message.guild.id)
        if (!session) return
        const roomIndex = session.getRoomWithChannelId(channelId)
        if (roomIndex === null) return
        const players = session.getPlayersInRoom(roomIndex)

        for (const player of players) {
            const inGuild = await userIsInGuild(player.discordId, message.guild)
            if (!inGuild) continue

            io.to(player.socketId).emit('discordMessage', {
                username: message.author.displayName,
                content: message.content
            })
        }
    }
}

export default event