import { Server } from 'socket.io'
import { JoinRealm } from './socket-types'
import { z } from 'zod'
import { supabase } from './supabase'
import { users } from './Users'

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
        socket.on('joinRealm', async (realmId: z.infer<typeof JoinRealm>) => {
            const rejectJoin = () => {
                socket.emit('failedToJoinRoom')
            }

            if (JoinRealm.safeParse(realmId).success === false) {
                rejectJoin()
                return
            }

            const { data, error } = await supabase.from('realms').select('id').eq('id', realmId)

            if (error || !data || data.length === 0) {
                rejectJoin()
                return
            }

            socket.join(realmId)
            socket.emit('joinedRealm')
        })

        // Handle a disconnection
        socket.on('disconnect', () => {
            console.log('disconnect')
            const uid = socket.handshake.query.uid as string
            users.removeUser(uid)
        })
    })
}