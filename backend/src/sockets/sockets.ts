import { Server } from 'socket.io'
import { JoinRealm, Disconnect, OnEventCallback, MovePlayer, Teleport, ChangedSkin } from './socket-types'
import { z } from 'zod'
import { supabase } from '../supabase'
import { users } from '../Users'
import { defaultSkin, sessionManager } from '../session'

function protectConnection(io: Server) {
    io.use(async (socket, next) => {
        const access_token = socket.handshake.query.access_token as string
        const uid = socket.handshake.query.uid as string
        if (!access_token || !uid) {
            // Reject the connection by calling next with an error.
            const error = new Error("Invalid access token or uid.")
            return next(error)
        } else {
            // If clientId is provided, check if valid user
            const { data: user, error: error } = await supabase.auth.getUser(access_token)

            if (error) {
                return next(new Error("Invalid access token."))
            }

            // reject connection if the uid does not match the access token
            if (!user || user.user.id !== uid) {
                return next(new Error("Invalid uid."))
            }

            if (users.getUser(uid)) {
                return next(new Error("User already connected."))
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

        function on(eventName: string, schema: z.ZodTypeAny, callback: OnEventCallback) {
            socket.on(eventName, (data: any) => {
                const success = schema.safeParse(data).success
                if (!success) return

                const session = sessionManager.getPlayerSession(socket.handshake.query.uid as string)
                if (!session) {
                    return
                }
                callback({ session, data })
            })
        }

        function emit(eventName: string, data: any) {
            const session = sessionManager.getPlayerSession(socket.handshake.query.uid as string)
            if (!session) {
                return
            }

            const room = session.getPlayerRoom(socket.handshake.query.uid as string)
            const players = session.getPlayersInRoom(room)

            for (const player of players) {
                if (player.socketId === socket.id) continue

                io.to(player.socketId).emit(eventName, data)
            }
        }

        socket.on('joinRealm', async (realmData: z.infer<typeof JoinRealm>) => {

            const rejectJoin = (reason: string) => {
                socket.emit('failedToJoinRoom', reason)
            }

            if (JoinRealm.safeParse(realmData).success === false) {
                rejectJoin('Invalid request data.')
                return
            }

            const { data, error } = await supabase.from('realms').select('privacy_level, owner_id, share_id').eq('id', realmData.realmId).single()

            if (error || !data) {
                rejectJoin('Realm not found.')
                return
            }

            const realm = data

            const join = async () => {
                socket.join(realmData.realmId)

                if (!sessionManager.getSession(realmData.realmId)) {
                    sessionManager.createSession(realmData.realmId)
                }

                const uid = socket.handshake.query.uid as string
                const username = users.getUser(uid)!.user_metadata.full_name

                const profile = await supabase.from('profiles').select('skin').eq('id', uid).single()
                let skin = defaultSkin
                if (profile.data) {
                    skin = profile.data.skin
                }

                await sessionManager.addPlayerToSession(socket.id, realmData.realmId, uid, username, skin)

                const session = sessionManager.getPlayerSession(uid)
                const player = session.getPlayer(uid)

                socket.emit('joinedRealm')
                emit('playerJoinedRoom', player)
            }

            if (realm.owner_id === socket.handshake.query.uid) {
                join()
                return
            }

            if (realm.privacy_level === 'discord') {
                // TODO: Check if they are in discord 
                rejectJoin('User is not in the Discord server.')
                return
            } else if (realm.privacy_level === 'anyone') {
                if (realm.share_id === realmData.shareId) {
                    join()
                    return
                } else {
                    rejectJoin('The share link has been changed.')
                    return
                }
            }

            rejectJoin('Unknown.')
        })

        // Handle a disconnection
        on('disconnect', Disconnect, ({ session, data }) => {
            const uid = socket.handshake.query.uid as string
            emit('playerLeftRoom', uid)
            sessionManager.logOutPlayer(uid)
            users.removeUser(uid)
        })

        on('movePlayer', MovePlayer, ({ session, data }) => {  
            const player = session.getPlayer(socket.handshake.query.uid as string)
            player.x = data.x
            player.y = data.y
            emit('playerMoved', {
                uid: player.uid,
                x: player.x,
                y: player.y
            })
        })  

        on('teleport', Teleport, ({ session, data }) => {
            const uid = socket.handshake.query.uid as string
            const player = session.getPlayer(uid)
            player.x = data.x
            player.y = data.y
            if (player.room !== data.roomIndex) {
                emit('playerLeftRoom', uid)
                const session = sessionManager.getPlayerSession(uid)
                session.changeRoom(uid, data.roomIndex)
                emit('playerJoinedRoom', player)
            } else {
                emit('playerTeleported', { uid, x: player.x, y: player.y })
            }
        })

        on('changedSkin', ChangedSkin, ({ session, data }) => {
            const uid = socket.handshake.query.uid as string
            const player = session.getPlayer(uid)
            player.skin = data
            emit('playerChangedSkin', { uid, skin: player.skin })
        })
    })
}