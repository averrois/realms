import * as PIXI from 'pixi.js'
import playerSpriteSheetData from './PlayerSpriteSheetData'

export class Player {

    private skin: string = '001'
    public parent: PIXI.Container = new PIXI.Container()
    private animationSpeed: number = 0.1
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
        x = (x * 32) + 16
        y = (y * 32) + 16

        this.parent.x = x
        this.parent.y = y
    }
}