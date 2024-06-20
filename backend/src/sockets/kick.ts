import { Server } from 'socket.io'
import { sessionManager } from '../session'

export function kickPlayer(io: Server, uid: string, reason: string) {
    const session = sessionManager.getPlayerSession(uid)
    const room = session.getPlayerRoom(uid)
    const players = session.getPlayersInRoom(room)

    for (const player of players) {
        if (player.uid === uid) {
            io.to(player.socketId).emit('kicked', reason)
        } else {
            io.to(player.socketId).emit('playerLeftRoom', uid)
        }
    }
    // player is already in session, kick them
    sessionManager.logOutPlayer(uid)
}