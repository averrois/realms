import { Server } from 'socket.io'
import { JoinRealm } from './socket-types'
import { z } from 'zod'
import { supabase } from './supabase'
import { users } from './Users'
import { sessionManager } from './realm'

function protectConnection(io: Server) {
    io.use(async (socket, next) => {
        const access_token = socket.handshake.query.access_token as string
        const uid = socket.handshake.query.uid as string
        if (!access_token || !uid) {
            // Reject the connection by calling next with an error.
            const error = new Error("Invalid access token or uid")
            return next(error)
        } else {
            // If clientId is provided, check if valid user
            const { data: user, error: error } = await supabase.auth.getUser(access_token)

            if (error) {
                return next(new Error("Invalid access token"))
            }

            // reject connection if the uid does not match the access token
            if (!user || user.user.id !== uid) {
                return next(new Error("Invalid uid"))
            }

            if (users.getUser(uid)) {
                return next(new Error("User already connected"))
            }

            users.addUser(uid, user.user)
            next()
        }
    })
}

export function sockets(io: Server) {
    protectConnection(io)

    // Handle a connection
    io.on('connection', (socket) => {
        socket.on('joinRealm', async (realmData: z.infer<typeof JoinRealm>) => {

            const rejectJoin = () => {
                socket.emit('failedToJoinRoom')
            }

            if (JoinRealm.safeParse(realmData).success === false) {
                rejectJoin()
                return
            }

            const { data, error } = await supabase.from('realms').select('privacy_level, owner_id, share_id, map_data').eq('id', realmData.realmId)

            if (error || !data || data.length === 0) {
                rejectJoin()
                return
            }

            const realm = data[0]

            const join = () => {
                socket.join(realmData.realmId)
                socket.emit('joinedRealm')

                if (!sessionManager.getSession(realmData.realmId)) {
                    sessionManager.createSession(realmData.realmId, realm.map_data)
                }

                const uid = socket.handshake.query.uid as string
                const username = users.getUser(uid)!.user_metadata.full_name
                sessionManager.addPlayerToSession(realmData.realmId, uid, username)
            }

            if (realm.owner_id === socket.handshake.query.uid) {
                join()
                return
            }

            if (realm.privacy_level === 'discord') {
                // TODO: Check if they are in discord 
                rejectJoin()
                return
            } else if (realm.privacy_level === 'anyone') {
                if (realm.share_id === realmData.shareId) {
                    join()
                    return
                }
            }

            rejectJoin()
        })

        // Handle a disconnection
        socket.on('disconnect', () => {
            const uid = socket.handshake.query.uid as string
            users.removeUser(uid)
            sessionManager.logOutPlayer(uid)
        })
    })
}