import * as PIXI from 'pixi.js'

export class App {
    private initialized: boolean = false
    private app: PIXI.Application = new PIXI.Application()

    async init() {
        const container = document.getElementById('app-container')
        if (!container) {
            throw new Error('Container not found')
        }

        await this.app.init({
            resizeTo: container,
        backgroundColor: 0x0F0F0F
        })
        this.initialized = true

        await this.loadAssets()
        const sprite = PIXI.Sprite.from('/sprites/tile-outline.png')
        this.app.stage.addChild(sprite)
    }

    getApp() {
        if (!this.initialized) {
            throw new Error('App not initialized')
        }

        return this.app
    }

    destroy() {
        if (this.initialized) {
            this.app.destroy()
        }
    }

    async loadAssets() {
        await PIXI.Assets.load('/sprites/tile-outline.png')
    }
}