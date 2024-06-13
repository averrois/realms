import { App } from './App'
import { Player } from './Player/Player'
import { Point, RealmData, TilePoint } from './types'
import * as PIXI from 'pixi.js'
import { server } from './server'
import signal from '../signal'

export class PlayApp extends App {
    private scale: number = 2
    private player: Player
    public blocked: Set<TilePoint> = new Set()
    public keysDown: string[] = []
    private teleportLocation: Point | null = null
    private fadeOverlay: PIXI.Graphics = new PIXI.Graphics()
    private fadeDuration: number = 0.5
    private uid: string = ''
    private players: { [key: string]: Player } = {}

    constructor(uid: string, realmData: RealmData, username: string, skin: string = '009') {
        super(realmData)
        this.uid = uid
        this.player = new Player(skin, this, username, true)
    }

    override async loadRoom(index: number) {
        this.players = {}
        this.removeSocketEvents()
        await super.loadRoom(index)
        this.setUpBlockedTiles()
        this.spawnLocalPlayer()
        this.setUpSocketEvents()
        await this.spawnOtherPlayers()
    }

    private async loadAssets() {
        await PIXI.Assets.load('/fonts/silkscreen.ttf')
        await PIXI.Assets.load('/fonts/nunito.ttf')
    }

    private async spawnOtherPlayers() {
        const {data, error} = await server.getPlayersInRoom(this.currentRoomIndex)
        if (error) {
            console.error('Failed to get player positions in room:', error)
            return
        }

        for (const player of data.players) {
            if (player.uid === this.uid || player.uid in this.players) continue
            await this.spawnPlayer(player.uid, '009', player.username, player.x, player.y)
        }

        this.sortObjectsByY()
    }

    private async spawnPlayer(uid: string, skin: string, username: string, x: number, y: number) {
        const otherPlayer = new Player(skin, this, username)
        await otherPlayer.init()
        otherPlayer.setPosition(x, y)
        this.layers.object.addChild(otherPlayer.parent)
        this.players[uid] = otherPlayer
        this.sortObjectsByY()
    }

    public async init() {
        await super.init()
        await this.loadAssets()
        await this.loadRoom(this.realmData.spawnpoint.roomIndex)
        this.app.stage.eventMode = 'static'
        this.setScale(this.scale)
        this.app.renderer.on('resize', this.resizeEvent)
        this.clickEvents()
        this.setUpKeyboardEvents()
        this.setUpFadeOverlay()
        this.fadeOut()
        this.setUpMouseStyles()
    }

    private spawnLocalPlayer = async () => {
        await this.player.init()

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
        this.updateFadeOverlay(x, y)
    }

    private updateFadeOverlay = (x: number, y: number) => {
        this.fadeOverlay.clear()
        this.fadeOverlay.rect(0, 0, this.app.screen.width * (1 / this.scale), this.app.screen.height * (1 / this.scale))
        this.fadeOverlay.fill(0x0F0F0F)
        this.fadeOverlay.pivot.set(-x, -y)
    }

    private resizeEvent = () => {
        this.moveCameraToPlayer()
    }

    private setUpFadeOverlay = () => {
        this.fadeOverlay.rect(0, 0, this.app.screen.width * (1 / this.scale), this.app.screen.height * (1 / this.scale))
        this.fadeOverlay.fill(0x0F0F0F)
        this.app.stage.addChild(this.fadeOverlay)
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

    private clickEvents = () => {
        this.app.stage.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
            if (this.player.frozen) return  

            const clickPosition = e.getLocalPosition(this.app.stage)
            const { x, y } = this.convertScreenToTileCoordinates(clickPosition.x, clickPosition.y)

            if (this.player.currentTilePosition.x === x && this.player.currentTilePosition.y === y) {
                signal.emit('showSkinMenu')
            } else {
                this.player.moveToTile(x, y)
                this.player.setMovementMode('mouse')
            }
        })
    }

    private setUpMouseStyles = () => {
        this.app.stage.on('pointermove', (e: PIXI.FederatedPointerEvent) => {
            const clickPosition = e.getLocalPosition(this.app.stage)
            const { x, y } = this.convertScreenToTileCoordinates(clickPosition.x, clickPosition.y)
            if (this.player.currentTilePosition.x === x && this.player.currentTilePosition.y === y) {
                this.app.canvas.style.cursor = 'pointer'
            } else {
                this.app.canvas.style.cursor = 'default'
            }
        })
    }

    private setUpKeyboardEvents = () => {
        document.addEventListener('keydown', this.keydown)
        document.addEventListener('keyup', this.keyup)
    }

    private keydown = (event: KeyboardEvent) => {
        if (this.keysDown.includes(event.key)) return
        this.player.keydown(event)
        this.keysDown.push(event.key)
    }

    private keyup = (event: KeyboardEvent) => {
        this.keysDown = this.keysDown.filter((key) => key !== event.key)
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

    private teleport = async (roomIndex: number, x: number, y: number) => {
        this.player.setFrozen(true)
        await this.fadeIn()
        if (this.currentRoomIndex === roomIndex) {
            this.player.setPosition(x, y)
            this.moveCameraToPlayer()
        } else {
            this.teleportLocation = { x, y }
            this.currentRoomIndex = roomIndex
            this.player.changeAnimationState('idle_down')
            await this.loadRoom(roomIndex)
        }

        server.socket.emit('teleport', { x, y, roomIndex })

        this.player.setFrozen(false)
        this.fadeOut()
    }

    public hasTeleport = (x: number, y: number) => {
        const tile = `${x}, ${y}` as TilePoint
        return this.realmData.rooms[this.currentRoomIndex].tilemap[tile]?.teleporter
    }


    private fadeIn = () => {
        PIXI.Ticker.shared.remove(this.fadeOutTicker)
        this.fadeOverlay.alpha = 0
        return new Promise<void>((resolve) => {
            const fadeTicker = ({ deltaTime }: { deltaTime: number }) => {
                this.fadeOverlay.alpha += (deltaTime / 60) / this.fadeDuration
                if (this.fadeOverlay.alpha >= 1) {
                    this.fadeOverlay.alpha = 1
                    PIXI.Ticker.shared.remove(fadeTicker)
                    resolve()
                }
            }

            PIXI.Ticker.shared.add(fadeTicker)
        })
    }

    private fadeOut = () => {
        PIXI.Ticker.shared.add(this.fadeOutTicker)
    }

    private fadeOutTicker = ({ deltaTime }: { deltaTime: number }) => {
        this.fadeOverlay.alpha -= (deltaTime / 60) / this.fadeDuration
        if (this.fadeOverlay.alpha <= 0) {
            this.fadeOverlay.alpha = 0
            PIXI.Ticker.shared.remove(this.fadeOutTicker)
        }
    }

    private destroyPlayers = () => {
        for (const player of Object.values(this.players)) {
            player.destroy()
        }
        this.player.destroy()
    }

    private onPlayerLeftRoom = (uid: string) => {
        if (this.players[uid]) {
            this.players[uid].destroy()
            this.layers.object.removeChild(this.players[uid].parent)
            delete this.players[uid]
            console.log('Player left room:', uid)
        }
    }

    private onPlayerJoinedRoom = (playerData: any) => {
        this.spawnPlayer(playerData.uid, '009', playerData.username, playerData.x, playerData.y)
    }

    private onPlayerMoved = (data: any) => {
        if (this.blocked.has(`${data.x}, ${data.y}`)) return

        const player = this.players[data.uid]
        if (player) {
            player.moveToTile(data.x, data.y)
        }
    }

    private onPlayerTeleported = (data: any) => {
        const player = this.players[data.uid]
        if (player) {
            player.setPosition(data.x, data.y)
        }
    }

    private setUpSocketEvents = () => {
        server.socket.on('playerLeftRoom', this.onPlayerLeftRoom)
        server.socket.on('playerJoinedRoom', this.onPlayerJoinedRoom)
        server.socket.on('playerMoved', this.onPlayerMoved)
        server.socket.on('playerTeleported', this.onPlayerTeleported)
    }

    private removeSocketEvents = () => {
        server.socket.off('playerLeftRoom', this.onPlayerLeftRoom)
        server.socket.off('playerJoinedRoom', this.onPlayerJoinedRoom)
        server.socket.off('playerMoved', this.onPlayerMoved)
        server.socket.off('playerTeleported', this.onPlayerTeleported)
    }

    public destroy() {
        this.removeSocketEvents()
        this.destroyPlayers()
        server.disconnect()
        PIXI.Ticker.shared.destroy()
        document.removeEventListener('keydown', this.keydown)
        document.removeEventListener('keyup', this.keyup)

        super.destroy()
    }
}