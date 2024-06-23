import { Router } from 'express'
import { GetPlayersInRoom, GetServerName, IsOwnerOfServer, UserIsInGuild, GetChannelName } from './route-types'
import { supabase } from '../supabase'
import { z } from 'zod'
import { sessionManager } from '../session'
import { client } from '../discord/client'
import { userIsInGuildWithId } from '../discord/utils'

export default function routes(): Router {
    const router = Router()

    router.get('/getPlayersInRoom', async (req, res) => {
        const params = req.query as unknown as z.infer<typeof GetPlayersInRoom>
        if (!GetPlayersInRoom.safeParse(params).success) {
            return res.status(400).json({ message: 'Invalid parameters' })
        }

        const { data: user, error: error } = await supabase.auth.getUser(params.access_token)

        if (error) {
            return res.status(401).json({ message: 'Invalid access token' })
        }

        const session = sessionManager.getPlayerSession(user.user.id)
        if (!session) {
            return res.status(400).json({ message: 'User not in a realm.' })
        }

        const players = session.getPlayersInRoom(params.roomIndex)
        return res.json({ players })
    })

    router.get('/isOwnerOfServer', async (req, res) => {
        const params = req.query as unknown as z.infer<typeof IsOwnerOfServer>
        if (!IsOwnerOfServer.safeParse(params).success) {
            return res.status(400).json({ message: 'Invalid parameters' })
        }

        const { data: user, error: error } = await supabase.auth.getUser(params.access_token)

        if (error) {
            return res.status(401).json({ message: 'Invalid access token' })
        }

        const userId = user.user.user_metadata.provider_id

        try {
            const guild = await client.guilds.fetch(params.serverId)
            if (!guild) {
                return res.status(400).json({ message: 'Invalid server ID.' })
            }
            return res.json({ isOwner: guild.ownerId === userId })
        } catch (err: any) {
            if (err.rawError?.message === 'Unknown Guild') {
                return res.status(400).json({ message: 'Please add the realms bot to your server before linking!' })
            }
            return res.status(400).json({ message: 'Invalid server ID.' })
        }
    })

    router.get('/getServerName', async (req, res) => {
        const params = req.query as unknown as z.infer<typeof GetServerName>
        if (!GetServerName.safeParse(params).success) {
            return res.status(400).json({ message: 'Invalid parameters' })
        }
        
        try {
            const guild = await client.guilds.fetch(params.serverId)
            if (!guild) {
                return res.status(400).json({ message: 'Invalid server ID.' })
            }
            return res.json({ name: guild.name })
        } catch (err: any) {
            return res.status(400).json({ message: 'Something went wrong.' })
        }
    })

    router.get('/getChannelName', async (req, res) => {
        const params = req.query as unknown as z.infer<typeof GetChannelName>
        if (!GetChannelName.safeParse(params).success) {
            return res.status(400).json({ message: 'Invalid parameters' })
        }

        try {
            const guild = await client.guilds.fetch(params.serverId)
            if (!guild) {
                return res.status(400).json({ message: 'Invalid server ID.' })
            }

            await guild.members.fetch({
                force: true,
                user: params.userId,
            })

            const channel = await guild.channels.fetch(params.channelId)
            if (!channel) {
                return res.status(400).json({ message: 'Invalid channel ID.' })
            }

            return res.json({ name: channel.name })
        } catch (err: any) {
            return res.status(400).json({ message: 'Something went wrong.' })
        }
    })

    router.get('/userIsInGuild', async (req, res) => {
        const params = req.query as unknown as z.infer<typeof UserIsInGuild>
        if (!UserIsInGuild.safeParse(params).success) {
            return res.status(400).json({ message: 'Invalid parameters' })
        }

        const { data: user, error: error } = await supabase.auth.getUser(params.access_token)

        if (error) {
            return res.status(401).json({ message: 'Invalid access token' })
        }

        const isInGuild = await userIsInGuildWithId(user.user.user_metadata.provider_id, params.guildId)
        return res.json({ isInGuild })
    })

    return router
}