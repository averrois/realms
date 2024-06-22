import { Events, GuildMember } from 'discord.js'
import { Event } from '../events'
import { users } from '../../Users'
import { kickPlayer } from '../../sockets/kick'
import { sessionManager } from '../../session'

const event: Event = {
    name: Events.GuildMemberRemove,
    execute(member: GuildMember) {
        const user = users.getUserByDiscordId(member.id)
        if (!user) return
        const session = sessionManager.getPlayerSession(user.id)

        if (session.privacy_level === 'discord') {
            kickPlayer(user.id, "You left the Discord server.")
        }
    }
}

export default event