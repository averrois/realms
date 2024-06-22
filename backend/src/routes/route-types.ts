import { z } from 'zod'

export const GetPlayersInRoom = z.object({
    access_token: z.string(),
    roomIndex: z.string().transform((val) => parseInt(val, 10)),
})

export const IsOwnerOfServer = z.object({
    access_token: z.string(),
    serverId: z.string(),
})

export const GetServerName = z.object({
    serverId: z.string(),
})

export const GetChannelName = z.object({
    serverId: z.string(),
    channelId: z.string(),
    userId: z.string(),
})

export const UserIsInGuild = z.object({
    access_token: z.string(),
    guildId: z.string(),
})