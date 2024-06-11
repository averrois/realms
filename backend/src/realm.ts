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

    public addPlayerToSession(realmId: string, uid: string, username: string) {
        this.sessions[realmId].addPlayer(uid, username)
        this.playerIdToRealmId[uid] = realmId
    }
}

class Session {
    private mapData: RealmData
    private roomData: RoomData = {}

    constructor(mapData: RealmData) {
        this.mapData = mapData
    }

    public addPlayer(uid: string, username: string): void {
        const spawnIndex = this.mapData.spawnpoint.roomIndex

        if (!this.roomData[spawnIndex]) this.roomData[spawnIndex] = []

        const player: Player = {
            uid,
            username,
            x: this.mapData.spawnpoint.x,
            y: this.mapData.spawnpoint.y,
        }

        this.roomData[spawnIndex].push(player)
    }
}

const sessionManager = new SessionManager()

export { sessionManager }