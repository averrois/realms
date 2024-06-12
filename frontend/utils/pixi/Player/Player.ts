import * as PIXI from 'pixi.js'
import playerSpriteSheetData from './PlayerSpriteSheetData'
import { Point, Coordinate, AnimationState, Direction } from '../types'
import { PlayApp } from '../PlayApp'
import { bfs } from '../pathfinding'
import { server } from '../server'

export class Player {

    private skin: string = '001'
    private username: string = ''

    private animationState: AnimationState = 'idle_down'
    private direction: Direction = 'down'
    public parent: PIXI.Container = new PIXI.Container()
    private animationSpeed: number = 0.1
    private movementSpeed: number = 3.5
    private currentTilePosition: Point = { x: 0, y: 0 }
    private isLocal: boolean = false
    private playApp: PlayApp
    private targetPosition: { x: number, y: number } | null = null
    private path: Coordinate[] = []
    private pathIndex: number = 0
    private sheet: any = null
    private movementMode: 'keyboard' | 'mouse' = 'mouse'
    public frozen: boolean = false
    private initialized: boolean = false

    constructor(skin: string, playApp: PlayApp, username: string, isLocal: boolean = false) {
        this.skin = skin
        this.playApp = playApp
        this.username = username
        this.isLocal = isLocal
    }

    private async loadAnimations() {
        const src = `/sprites/characters/Character_${this.skin}.png`
        await PIXI.Assets.load(src)

        const spriteSheetData = JSON.parse(JSON.stringify(playerSpriteSheetData))
        spriteSheetData.meta.image = src

        this.sheet = new PIXI.Spritesheet(PIXI.Texture.from(src), spriteSheetData)
        await this.sheet.parse()

        const animatedSprite = new PIXI.AnimatedSprite(this.sheet.animations['idle_down'])
        animatedSprite.animationSpeed = this.animationSpeed
        animatedSprite.play()
        this.parent.addChild(animatedSprite)
    }

    private addUsername() {
        const text = new PIXI.Text({
            text: this.username,
            style: {
                fontFamily: 'silkscreen',
                fontSize: 128,
                fill: 0xFFFFFF,
            }
        })
        text.anchor.set(0.5)
        text.scale.set(0.07)
        text.y = 8
        this.parent.addChild(text)
    }

    public async init() {
        if (this.initialized) return
        await this.loadAnimations()
        this.addUsername()
        this.initialized = true
    }

    public setPosition(x: number, y: number) {
        const pos = this.convertTilePosToPlayerPos(x, y)
        this.parent.x = pos.x
        this.parent.y = pos.y
        this.currentTilePosition = { x, y }
    }

    private convertTilePosToPlayerPos = (x: number, y: number) => {
        return {
            x: (x * 32) + 16,
            y: (y * 32) + 24
        }
    }

    public moveToTile = (x: number, y: number) => {
        const start: Coordinate = [this.currentTilePosition.x, this.currentTilePosition.y]
        const end: Coordinate = [x, y]

        const path: Coordinate[] | null = bfs(start, end, this.playApp.blocked)
        if (!path || path.length === 0 || this.playApp.blocked.has(`${x}, ${y}`)) {
            return
        }

        PIXI.Ticker.shared.remove(this.move)

        this.path = path
        this.pathIndex = 0
        this.targetPosition = this.convertTilePosToPlayerPos(this.path[this.pathIndex][0], this.path[this.pathIndex][1])
        PIXI.Ticker.shared.add(this.move)

        if (this.isLocal) {
            server.socket.emit('movePlayer', { x, y })
        }
    }

    private move = ({ deltaTime }: { deltaTime: number }) => {
        if (!this.targetPosition) return

        this.currentTilePosition = {
            x: this.path[this.pathIndex][0],
            y: this.path[this.pathIndex][1]
        }

        if (this.isLocal && this.playApp.hasTeleport(this.currentTilePosition.x, this.currentTilePosition.y) && this.movementMode === 'keyboard') {
            this.setFrozen(true)
        }

        const speed = this.movementSpeed * deltaTime

        const dx = this.targetPosition.x - this.parent.x
        const dy = this.targetPosition.y - this.parent.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < speed) {
            this.parent.x = this.targetPosition.x
            this.parent.y = this.targetPosition.y

            this.pathIndex++
            if (this.pathIndex < this.path.length) {
                this.targetPosition = this.convertTilePosToPlayerPos(this.path[this.pathIndex][0], this.path[this.pathIndex][1])
            } else {
                const movementInput = this.getMovementInput()
                const newTilePosition = { x: this.currentTilePosition.x + movementInput.x, y: this.currentTilePosition.y + movementInput.y }

                // Teleport
                const teleported = this.teleportIfOnTeleporter('keyboard')
                if (teleported) {
                    this.stop()
                    return
                }

                if ((movementInput.x !== 0 || movementInput.y !== 0) && !this.playApp.blocked.has(`${newTilePosition.x}, ${newTilePosition.y}`)) {
                    this.moveToTile(newTilePosition.x, newTilePosition.y)
                } else {
                    this.stop()

                    // Teleport
                    const teleported = this.teleportIfOnTeleporter('mouse')
                    if (teleported) return
                }
            }
        } else {
            const angle = Math.atan2(dy, dx)
            this.parent.x += Math.cos(angle) * speed
            this.parent.y += Math.sin(angle) * speed

            // set direction
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) {
                    this.direction = 'right'
                } else {
                    this.direction = 'left'
                }
            } else {
                if (dy > 0) {
                    this.direction = 'down'
                } else {
                    this.direction = 'up'
                }
            }

            this.changeAnimationState(`walk_${this.direction}` as AnimationState)
        }

        this.playApp.sortObjectsByY()

        if (this.isLocal) {
            this.playApp.moveCameraToPlayer()
        }
    }

    private stop = () => {
        PIXI.Ticker.shared.remove(this.move)
        this.targetPosition = null
        this.changeAnimationState(`idle_${this.direction}` as AnimationState)
    }

    private teleportIfOnTeleporter = (movementMode: 'keyboard' | 'mouse') => {
        if (this.isLocal && this.movementMode === movementMode) {
            const teleported = this.playApp.teleportIfOnTeleportSquare(this.currentTilePosition.x, this.currentTilePosition.y)
            return teleported
        }
        return false
    }

    private changeAnimationState = (state: AnimationState) => {
        if (this.animationState === state) return

        this.animationState = state
        const animatedSprite = this.parent.children[0] as PIXI.AnimatedSprite
        animatedSprite.textures = this.sheet.animations[state]
        animatedSprite.play()
    }

    public keydown = (event: KeyboardEvent) => {
        if (this.frozen) return

        this.setMovementMode('keyboard')
        const movementInput = { x: 0, y: 0 }
        if (event.key === 'ArrowUp' || event.key === 'w') {
            movementInput.y -= 1
        }
        if (event.key === 'ArrowDown' || event.key === 's') {
            movementInput.y += 1
        }
        if (event.key === 'ArrowLeft' || event.key === 'a') {
            movementInput.x -= 1
        }
        if (event.key === 'ArrowRight' || event.key === 'd') {
            movementInput.x += 1
        }

        this.moveToTile(this.currentTilePosition.x + movementInput.x, this.currentTilePosition.y + movementInput.y)
    }

    public setMovementMode = (mode: 'keyboard' | 'mouse') => {
        this.movementMode = mode
    }

    private getMovementInput = () => {
        const movementInput = { x: 0, y: 0 }
        if (this.playApp.keysDown.has('ArrowUp') || this.playApp.keysDown.has('w')) {
            movementInput.y -= 1
        }
        if (this.playApp.keysDown.has('ArrowDown') || this.playApp.keysDown.has('s')) {
            movementInput.y += 1
        }
        if (this.playApp.keysDown.has('ArrowLeft') || this.playApp.keysDown.has('a')) {
            movementInput.x -= 1
        }
        if (this.playApp.keysDown.has('ArrowRight') || this.playApp.keysDown.has('d')) {
            movementInput.x += 1
        }

        return movementInput
    }

    public setFrozen = (frozen: boolean) => {
        this.frozen = frozen
    }

    public destroy() {
        PIXI.Ticker.shared.remove(this.move)
    }
}
