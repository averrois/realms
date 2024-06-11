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
}

export interface Player {
    uid: string,
    username: string,
    x: number,
    y: number,
    room: number,
}

export type RoomData = { [key: number]: Player[] }

class SessionManager {
    private sessions: { [key: string]: Session } = {}
    private playerIdToRealmId: { [key: string]: string } = {}

    public createSession(id: string, mapData: RealmData): void {
        const realm = new Session(mapData)

        this.sessions[id] = realm
    }

    public getSession(id: string): Session {
        return this.sessions[id]
    }

    public getPlayerSession(uid: string): Session {
        const realmId = this.playerIdToRealmId[uid]
        return this.sessions[realmId]
    }

    public addPlayerToSession(realmId: string, uid: string, username: string) {
        this.sessions[realmId].addPlayer(uid, username)
        this.playerIdToRealmId[uid] = realmId
    }

    public logOutPlayer(uid: string) {
        const realmId = this.playerIdToRealmId[uid]
        // If the player is not in a realm, do nothing
        if (!realmId) return

        this.sessions[realmId].removePlayer(uid)
        delete this.playerIdToRealmId[uid]
    }
}

class Session {
    private mapData: RealmData
    private roomData: { [key: number]: Set<string> } = {}
    private players: { [key: string]: Player } = {}

    constructor(mapData: RealmData) {
        this.mapData = mapData
    }

    public addPlayer(uid: string, username: string): void {
        this.removePlayer(uid)

        const spawnIndex = this.mapData.spawnpoint.roomIndex

        if (!this.roomData[spawnIndex]) this.roomData[spawnIndex] = new Set<string>()

        const player: Player = {
            uid,
            username,
            x: this.mapData.spawnpoint.x,
            y: this.mapData.spawnpoint.y,
            room: spawnIndex,
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
        this.roomData[roomIndex].add(uid)

        player.room = roomIndex
    }

    public getPlayerPositionsInRoom(roomIndex: number): Player[] {
        const players = Array.from(this.roomData[roomIndex] || [])
            .map(uid => this.players[uid])

        return players
    }
}

const sessionManager = new SessionManager()

export { sessionManager }