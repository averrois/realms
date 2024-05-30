import { App } from './App'
import { Player } from './Player/Player'
import { RealmData, TilePoint } from './types'
import * as PIXI from 'pixi.js'

export class PlayApp extends App {

    private scale: number = 2
    private player: Player
    public blocked: Set<TilePoint> = new Set()

    constructor(realmData: RealmData, skin: string = '012') {
        super(realmData)
        this.player = new Player(skin, this, true)
    }

    override async loadRoom(index: number) {
        await super.loadRoom(index)
        this.setUpBlockedTiles()
    }

    public async init() {
        await super.init()
        await this.loadRoom(this.realmData.spawnpoint.roomIndex)
        this.setScale(this.scale)
        this.app.renderer.on('resize', this.resizeEvent)

        await this.player.loadAnimations()
        this.player.setPosition(this.realmData.spawnpoint.x, this.realmData.spawnpoint.y)
        this.layers.object.addChild(this.player.parent)
        this.moveCameraToPlayer()
        this.player.moveToTile(5, 13)
    }

    private setScale = (newScale: number) => {
        this.scale = newScale
        this.app.stage.scale.set(this.scale)
    }

    private moveCameraToPlayer = () => {
        const x = Math.round(this.player.parent.x - (this.app.screen.width / 2) / this.scale)
        const y = Math.round(this.player.parent.y - (this.app.screen.height / 2) / this.scale)
        this.app.stage.pivot.set(x, y)
    }

    private resizeEvent = () => {
        this.moveCameraToPlayer()
    }

    private setUpBlockedTiles = () => {
        this.blocked = new Set<TilePoint>()

        for (const [key, value] of Object.entries(this.realmData.rooms[this.currentRoomIndex].tilemap)) {
            if (value.impassable) {
                this.blocked.add(key as TilePoint)
            }
        }

        for (const [key, value] of Object.entries(this.collidersFromSpritesMap)) {
            if (value) {
                this.blocked.add(key as TilePoint)
            }
        }
    }
}