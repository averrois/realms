import * as PIXI from 'pixi.js'
import playerSpriteSheetData from './PlayerSpriteSheetData'
import { Point, Coordinate, AnimationState, Direction } from '../types'
import { PlayApp } from '../PlayApp'
import { bfs } from '../pathfinding'

export class Player {

    private skin: string = '001'
    private animationState: AnimationState = 'idle_down'
    private direction: Direction = 'down'
    public parent: PIXI.Container = new PIXI.Container()
    private animationSpeed: number = 0.1
    private movementSpeed: number = 3
    private currentTilePosition: Point = { x: 0, y: 0 }
    private isLocal: boolean = false
    private playApp: PlayApp
    private targetPosition: { x: number, y: number } | null = null
    private path: Coordinate[] = []
    private pathIndex: number = 0
    private sheet: any = null
    private moving: boolean = false

    constructor(skin: string, playApp: PlayApp, isLocal: boolean = false) {
        this.skin = skin
        this.playApp = playApp
    }

    public async loadAnimations() {
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
        PIXI.Ticker.shared.remove(this.move)
        const start: Coordinate = [this.currentTilePosition.x, this.currentTilePosition.y]
        const end: Coordinate = [x, y]

        const path: Coordinate[] | null = bfs(start, end, this.playApp.blocked)
        if (!path || path.length === 0) {
            this.changeAnimationState(`idle_${this.direction}` as AnimationState)
            this.moving = false
            return
        }

        this.path = path
        this.pathIndex = 0
        this.targetPosition = this.convertTilePosToPlayerPos(this.path[this.pathIndex][0], this.path[this.pathIndex][1])
        PIXI.Ticker.shared.add(this.move)
    }

    private move = ({ deltaTime }: { deltaTime: number }) => {
        if (!this.targetPosition) return

        this.moving = true

        this.currentTilePosition = {
            x: this.path[this.pathIndex][0],
            y: this.path[this.pathIndex][1]
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
                if (movementInput.x !== 0 || movementInput.y !== 0) {
                    this.moveToTile(this.currentTilePosition.x + movementInput.x, this.currentTilePosition.y + movementInput.y)
                } else {
                    PIXI.Ticker.shared.remove(this.move)
                    this.targetPosition = null
                    this.moving = false

                    // set idle
                    this.changeAnimationState(`idle_${this.direction}` as AnimationState)
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

        this.playApp.moveCameraToPlayer()
        this.playApp.sortObjectsByY()
    }

    private changeAnimationState = (state: AnimationState) => {
        if (this.animationState === state) return

        this.animationState = state
        const animatedSprite = this.parent.children[0] as PIXI.AnimatedSprite
        animatedSprite.textures = this.sheet.animations[state]
        animatedSprite.play()
    }

    public keydown = (event: KeyboardEvent) => {
        if (this.moving) return

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
}
