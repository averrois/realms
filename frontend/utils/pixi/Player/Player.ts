import * as PIXI from 'pixi.js'
import playerSpriteSheetData from './PlayerSpriteSheetData'
import { Point, Coordinate } from '../types'
import { PlayApp } from '../PlayApp'
import { bfs } from '../pathfinding'

export class Player {

    private skin: string = '001'
    public parent: PIXI.Container = new PIXI.Container()
    private animationSpeed: number = 0.1
    private movementSpeed: number = 2
    private currentTilePosition: Point = { x: 0, y: 0 }
    private isLocal: boolean = false
    private playApp: PlayApp
    private targetPosition: { x: number, y: number } | null = null
    private path: Coordinate[] = []
    private pathIndex: number = 0

    constructor(skin: string, playApp: PlayApp, isLocal: boolean = false) {
        this.skin = skin
        this.playApp = playApp
    }

    public async loadAnimations() {
        const src = `/sprites/characters/Character_${this.skin}.png`
        await PIXI.Assets.load(src)

        const spriteSheetData = JSON.parse(JSON.stringify(playerSpriteSheetData))
        spriteSheetData.meta.image = src

        const sheet = new PIXI.Spritesheet(PIXI.Texture.from(src), spriteSheetData)
        await sheet.parse()

        const animatedSprite = new PIXI.AnimatedSprite(sheet.animations['idle_down'])
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
            y: (y * 32) + 16
        }
    }

    public moveToTile = (x: number, y: number) => {
        const start: Coordinate = [this.currentTilePosition.x, this.currentTilePosition.y]
        const end: Coordinate = [x, y]

        const path: Coordinate[] | null = bfs(start, end, this.playApp.blocked)
        if (!path || path.length === 0) return

        this.path = path
        this.pathIndex = 0
        this.targetPosition = this.convertTilePosToPlayerPos(this.path[this.pathIndex][0], this.path[this.pathIndex][1])
        PIXI.Ticker.shared.add(this.move)
    }

    private move = ({ deltaTime }: { deltaTime: number }) => {
        if (!this.targetPosition) return

        const dx = this.targetPosition.x - this.parent.x
        const dy = this.targetPosition.y - this.parent.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < this.movementSpeed) {
            this.parent.x = this.targetPosition.x
            this.parent.y = this.targetPosition.y
            this.currentTilePosition = {
                x: this.path[this.pathIndex][0],
                y: this.path[this.pathIndex][1]
            }

            this.pathIndex++
            if (this.pathIndex < this.path.length) {
                this.targetPosition = this.convertTilePosToPlayerPos(this.path[this.pathIndex][0], this.path[this.pathIndex][1])
            } else {
                PIXI.Ticker.shared.remove(this.move)
                this.targetPosition = null
            }
        } else {
            const angle = Math.atan2(dy, dx)
            this.parent.x += Math.cos(angle) * this.movementSpeed
            this.parent.y += Math.sin(angle) * this.movementSpeed
        }

        this.playApp.moveCameraToPlayer()
    }
}
