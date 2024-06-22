import { z } from 'zod'
import { kickPlayer } from './sockets/kick'
import { Server } from 'socket.io'

export const defaultMapData: RealmData = {
    spawnpoint: {
        roomIndex: 0,
        x: 0,
        y: 0,
    },
    rooms: [{name: 'Home', tilemap: {}}]
}

export type RealmData = {
    spawnpoint: {
        roomIndex: number,
        x: number,
        y: number,
    },
    rooms: Room[],
}

export interface Room {
    name: string,
    tilemap: {
        [key: `${number}, ${number}`]: {
            floor?: string,
            above_floor?: string,
            object?: string,
            impassable?: boolean
            teleporter?: {
                roomIndex: number,
                x: number,
                y: number,
            }
        }
    }
    channelId?: string
}

export interface Player {
    uid: string,
    username: string,
    x: number,
    y: number,
    room: number,
    socketId: string,
    skin: string
}

export const defaultSkin = '009'

export const Spawnpoint = z.object({
    roomIndex: z.number(),
    x: z.number(),
    y: z.number(),
})

export type RoomData = { [key: number]: Player[] }

export class SessionManager {
    private sessions: { [key: string]: Session } = {}
    private playerIdToRealmId: { [key: string]: string } = {}
    private socketIdToPlayerId: { [key: string]: string } = {}

    public createSession(id: string, mapData: RealmData | null, discord_id: string | null, privacy_level: string): void {
        const realm = new Session(id, mapData, discord_id, privacy_level)

        this.sessions[id] = realm
    }

    public getSession(id: string): Session {
        return this.sessions[id]
    }

    public getPlayerSession(uid: string): Session {
        const realmId = this.playerIdToRealmId[uid]
        return this.sessions[realmId]
    }

    public addPlayerToSession(socketId: string, realmId: string, uid: string, username: string, skin: string) {
        this.sessions[realmId].addPlayer(socketId, uid, username, skin)
        this.playerIdToRealmId[uid] = realmId
        this.socketIdToPlayerId[socketId] = uid
    }

    public logOutPlayer(uid: string) {
        const realmId = this.playerIdToRealmId[uid]
        // If the player is not in a realm, do nothing
        if (!realmId) return

        const player = this.sessions[realmId].getPlayer(uid)
        delete this.socketIdToPlayerId[player.socketId]
        delete this.playerIdToRealmId[uid]
        this.sessions[realmId].removePlayer(uid)
    }

    public getSocketIdsInRoom(realmId: string, roomIndex: number): string[] {
        return this.sessions[realmId].getPlayersInRoom(roomIndex).map(player => player.socketId)
    }

    public logOutBySocketId(socketId: string) {
        const uid = this.socketIdToPlayerId[socketId]
        if (!uid) return false

        this.logOutPlayer(uid)
        return true
    }

    public terminateSession(io: Server, id: string, reason: string) {
        const session = this.sessions[id]
        if (!session) return

        const players = session.getPlayerIds()
        players.forEach(player => {
            kickPlayer(player, reason)
        })

        delete this.sessions[id]
    }
}

export class Session {
    private roomData: { [key: number]: Set<string> } = {}
    public players: { [key: string]: Player } = {}
    public id: string
    public map_data: RealmData 
    public discord_id: string | null
    public privacy_level

    constructor(id: string, mapData: RealmData | null, discord_id: string | null, privacy_level: string) {
        this.id = id
        this.map_data = mapData || defaultMapData
        this.discord_id = discord_id
        this.privacy_level = privacy_level
    }

    public addPlayer(socketId: string, uid: string, username: string, skin: string) {
        this.removePlayer(uid)
        const spawnIndex = this.map_data.spawnpoint.roomIndex
        const spawnX = this.map_data.spawnpoint.x
        const spawnY = this.map_data.spawnpoint.y
        if (!this.roomData[spawnIndex]) this.roomData[spawnIndex] = new Set<string>()

        const player: Player = {
            uid,
            username,
            x: spawnX,
            y: spawnY,
            room: spawnIndex,
            socketId: socketId,
            skin,
        }

        this.roomData[spawnIndex].add(uid)
        this.players[uid] = player
    }

    public removePlayer(uid: string): void {
        if (!this.players[uid]) return

        const player = this.players[uid]
        this.roomData[player.room].delete(uid)
        delete this.players[uid]
    }

    public changeRoom(uid: string, roomIndex: number): void {
        if (!this.players[uid]) return

        const player = this.players[uid]

        this.roomData[player.room].delete(uid)

        if (!this.roomData[roomIndex]) this.roomData[roomIndex] = new Set<string>()

        this.roomData[roomIndex].add(uid)

        player.room = roomIndex
    }

    public getPlayersInRoom(roomIndex: number): Player[] {
        const players = Array.from(this.roomData[roomIndex] || [])
            .map(uid => this.players[uid])

        return players
    }

    public getPlayer(uid: string): Player {
        return this.players[uid]
    }

    public getPlayerIds(): string[] {
        return Object.keys(this.players)
    }

    public getPlayerRoom(uid: string): number {
        return this.players[uid].room
    }

}

const sessionManager = new SessionManager()

export { sessionManager }