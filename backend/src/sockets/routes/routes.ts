import { Router } from 'express'
import { GetPlayerPositionsInRoom } from './route-types'
import { supabase } from '../../supabase'
import { z } from 'zod'
import { sessionManager } from '../../realm'

export default function routes(): Router {
    const router = Router()

    router.get('/getPlayerPositionsInRoom', async (req, res) => {
        const params = req.query as unknown as z.infer<typeof GetPlayerPositionsInRoom>
        if (!GetPlayerPositionsInRoom.safeParse(params).success) {
            return res.status(400).json({ error: 'Invalid parameters' })
        }

        const { data: user, error: error } = await supabase.auth.getUser(params.access_token)

        if (error) {
            return res.status(401).json({ error: 'Invalid access token' })
        }

        const session = sessionManager.getPlayerSession(user.user.id)
        if (!session) {
            return res.status(400).json({ error: 'User not in a realm.' })
        }

        const players = session.getPlayerPositionsInRoom(params.roomIndex)
        return res.json({ players })
    })

    return router
}