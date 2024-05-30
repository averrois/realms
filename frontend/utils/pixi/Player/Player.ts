import * as PIXI from 'pixi.js'
import playerSpriteSheetData from './PlayerSpriteSheetData'

export class Player {

    private skin: string = '001'
    public parent: PIXI.Container = new PIXI.Container()
    private animationSpeed: number = 0.1
    private movementSpeed: number = 3
    private isLocal: boolean = false

    constructor(skin: string, isLocal: boolean = false) {
        this.skin = skin
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
    }

    private convertTilePosToPlayerPos = (x: number, y: number) => {
        return {
            x: (x * 32) + 16,
            y: (y * 32) + 16
        }
    }

    public moveToTile = (x: number, y: number) => {
        const pos = this.convertTilePosToPlayerPos(x, y)
        const targetX = pos.x
        const targetY = pos.y

        const move = ({ deltaTime }: { deltaTime: number }) => {
            const speed = this.movementSpeed * deltaTime
            const dx = targetX - this.parent.x
            const dy = targetY - this.parent.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < speed) {
                this.parent.x = targetX
                this.parent.y = targetY
                PIXI.Ticker.shared.remove(move)
            } else {
                const angle = Math.atan2(dy, dx)
                this.parent.x += Math.cos(angle) * speed
                this.parent.y += Math.sin(angle) * speed
            }
        }

        PIXI.Ticker.shared.add(move)
    }
}