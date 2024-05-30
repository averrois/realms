import * as PIXI from 'pixi.js'
import playerSpriteSheetData from './PlayerSpriteSheetData'

export class Player {

    private src_id: string = '001'
    private parent: PIXI.Container = new PIXI.Container()
    private animationSpeed: number = 0.1

    constructor(src_id: string) {
        this.src_id = src_id
    }

    private async loadAnimations() {
        const src = `/sprites/characters/Character_${this.src_id}.png`
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
}