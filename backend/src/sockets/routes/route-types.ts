import { z } from 'zod'

export const GetPlayersInRoom = z.object({
    access_token: z.string(),
    roomIndex: z.string().transform((val) => parseInt(val, 10)),
})