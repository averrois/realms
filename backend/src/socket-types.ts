import { z } from 'zod'

export const JoinRealm = z.object({
    realmId: z.string(),
    shareId: z.string(),
})