import { Router } from 'express'
import { GetPlayerPositionsInRoom } from './route-types'

export default function routes(): Router {
    const router = Router()

    router.get('/getPlayerPositionsInRoom', (req, res) => {
        if (!GetPlayerPositionsInRoom.safeParse(req.query).success) {
            return res.status(400).json({ error: 'Invalid parameters' })
        }
            
        return res.json({ message: 'Hello, world!'})
    })

    return router
}