import { App } from './App'
import { Player } from './Player/Player'
import { Point, RealmData, TilePoint } from './types'
import * as PIXI from 'pixi.js'

export class PlayApp extends App {

    private scale: number = 2
    private player: Player
    public blocked: Set<TilePoint> = new Set()
    public keysDown: Set<string> = new Set()
    private teleportLocation: Point | null = null
    private fadeOverlay: PIXI.Graphics = new PIXI.Graphics()

    constructor(realmData: RealmData, skin: string = '009') {
        super(realmData)
        this.player = new Player(skin, this, true)
    }

    override async loadRoom(index: number) {
        await super.loadRoom(index)
        this.setUpBlockedTiles()
        this.spawnLocalPlayer()
    }

    public async init() {
        await super.init()
        await this.loadRoom(this.realmData.spawnpoint.roomIndex)
        this.app.stage.eventMode = 'static'
        this.setScale(this.scale)
        this.app.renderer.on('resize', this.resizeEvent)
        this.clickMovement()
        this.setUpKeyboardEvents()
        this.setUpFadeOverlay()
    }

    private spawnLocalPlayer = async () => {
        await this.player.loadAnimations()

        if (this.teleportLocation) {
            this.player.setPosition(this.teleportLocation.x, this.teleportLocation.y)
        } else {
            this.player.setPosition(this.realmData.spawnpoint.x, this.realmData.spawnpoint.y)
        }
        this.layers.object.addChild(this.player.parent)
        this.moveCameraToPlayer()
    }

    private setScale = (newScale: number) => {
        this.scale = newScale
        this.app.stage.scale.set(this.scale)
    }

    public moveCameraToPlayer = () => {
        const x = this.player.parent.x - (this.app.screen.width / 2) / this.scale
        const y = this.player.parent.y - (this.app.screen.height / 2) / this.scale
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

    private clickMovement = () => {
        this.app.stage.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
            const clickPosition = e.getLocalPosition(this.app.stage)
            const { x, y } = this.convertScreenToTileCoordinates(clickPosition.x, clickPosition.y)
            this.player.moveToTile(x, y)
            this.player.setMovementMode('mouse')
        })
    }

    private setUpKeyboardEvents = () => {
        document.addEventListener('keydown', this.keydown)
        document.addEventListener('keyup', this.keyup)
    }

    private keydown = (event: KeyboardEvent) => {
        if (this.keysDown.has(event.key)) return
        this.player.keydown(event)
        this.keysDown.add(event.key)
    }

    private keyup = (event: KeyboardEvent) => {
        this.keysDown.delete(event.key)
    }

    public teleportIfOnTeleportSquare = (x: number, y: number) => {
        const tile = `${x}, ${y}` as TilePoint
        const teleport = this.realmData.rooms[this.currentRoomIndex].tilemap[tile]?.teleporter
        if (teleport) {
            this.teleport(teleport.roomIndex, teleport.x, teleport.y)
            return true
        }
        return false
    }

    private teleport = (roomIndex: number, x: number, y: number) => {
        if (this.currentRoomIndex === roomIndex) {
            this.player.setPosition(x, y)
            this.moveCameraToPlayer()
        } else {
            this.teleportLocation = { x, y }
            this.currentRoomIndex = roomIndex
            this.loadRoom(roomIndex)
        }
    }

    public hasTeleport = (x: number, y: number) => {
        const tile = `${x}, ${y}` as TilePoint
        return this.realmData.rooms[this.currentRoomIndex].tilemap[tile].teleporter
    }

    private setUpFadeOverlay = () => {
        this.fadeOverlay.rect(0, 0, this.app.screen.width, this.app.screen.height)
        this.fadeOverlay.fill(0x000000)
        this.fadeOverlay.alpha = 0
        this.fadeOverlay.eventMode = 'none'
        this.app.stage.addChild(this.fadeOverlay)
    }

    public destroy() {
        document.removeEventListener('keydown', this.keydown)
        document.removeEventListener('keyup', this.keyup)

        super.destroy()
    }
}