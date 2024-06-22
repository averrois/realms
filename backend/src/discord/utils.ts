import { Guild, PermissionsBitField } from 'discord.js'
import { client } from './client'

export const confirmedGuildStates: { [key: string]: { [key: string]: boolean } } = {}

export function setConfirmedGuildState(guildId: string, userId: string, isMember: boolean) {
    if (!confirmedGuildStates[guildId]) {
        confirmedGuildStates[guildId] = {}
    }
    confirmedGuildStates[guildId][userId] = isMember
}

function isConfirmedGuildState(guildId: string, userId: string): boolean | undefined {
    if (guildId in confirmedGuildStates && userId in confirmedGuildStates[guildId]) {
        return confirmedGuildStates[guildId][userId]
    }
    return undefined
}

export async function sendMessageToChannel(senderId: string, guildId: string, channelId: string, message: string) {
    let isInServer = isConfirmedGuildState(guildId, senderId)
    if (isInServer === false) {
        return
    }

    try {
        const guild = await client.guilds.fetch(guildId)
        if (!guild) {
            return
        }

        if (isInServer === undefined) {
            isInServer = await userIsInGuild(senderId, guild)
            if (!isInServer) {
                return
            }
        }

        const channel = await guild.channels.fetch(channelId)
        if (!channel || !channel.isTextBased()) {
            return
        }

        const canSpeak = channel.permissionsFor(senderId)?.has(PermissionsBitField.Flags.SendMessages)
        if (!canSpeak) return
        await channel.send(message)
    } catch (err) {
    }
}

export async function userIsInGuildWithId(userId: string, guildId: string) {
    const isConfirmed = isConfirmedGuildState(guildId, userId)
    if (isConfirmed !== undefined) {
        return isConfirmed
    }

    try {
        const guild = await client.guilds.fetch(guildId)
        if (!guild) {
            return false
        }

        return await userIsInGuild(userId, guild)
    } catch {
        return false
    }
}

export async function userIsInGuild(userId: string, guild: Guild) {
    const isConfirmed = isConfirmedGuildState(guild.id, userId)
    if (isConfirmed !== undefined) {
        return isConfirmed
    }

    try {
        await guild.members.fetch({
            force: true,
            user: userId,
        })
        setConfirmedGuildState(guild.id, userId, true)
        return true
    } catch (err: any) {
        if (err.rawError?.message === 'Unknown Member') {
            setConfirmedGuildState(guild.id, userId, false)
        }
        return false
    }
}
