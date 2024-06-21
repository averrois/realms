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