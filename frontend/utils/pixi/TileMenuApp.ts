import * as PIXI from 'pixi.js'
import { SheetName, sprites } from './spritesheet/spritesheet'

PIXI.TextureStyle.defaultOptions.scaleMode = 'nearest'

export class TileMenuApp {
    protected app: PIXI.Application = new PIXI.Application()
    protected initialized: boolean = false

    public async init(container: HTMLDivElement, sheetName: SheetName, spriteName: string) {
        await this.app.init({
            resizeTo: container,
            backgroundAlpha: 0,
        })
        this.initialized = true

        const spriteTexture = sprites.getSprite(sheetName, spriteName)
        const sprite = new PIXI.Sprite(spriteTexture)

        // center the sprite in the app 
        sprite.scale.set(1.5)
        sprite.x = (this.app.screen.width / 2) - (sprite.width / 2)
        sprite.y = (this.app.screen.height / 2) - (sprite.height / 2)

        this.app.stage.addChild(sprite)
    }

    public getApp = () => {
        if (!this.initialized) {
            throw new Error('App not initialized')
        }

        return this.app
    }

    public destroy() {
        if (this.initialized) {
            this.app.destroy()
        }
    }
}