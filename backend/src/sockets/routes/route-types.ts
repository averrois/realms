import { z } from 'zod'

export const GetPlayerPositionsInRoom = z.object({
    refresh_token: z.string(),
    roomIndex: z.string().transform((val) => parseInt(val, 10)),
})