import * as PIXI from 'pixi.js'

PIXI.TextureStyle.defaultOptions.scaleMode = 'nearest'

export class TileMenuApp {
    protected app: PIXI.Application = new PIXI.Application()
    protected initialized: boolean = false

    public async init() {
        const container = document.getElementById('app-container')
        if (!container) {
            throw new Error('Container not found')
        }

        await this.app.init({
            resizeTo: container,
            backgroundAlpha: 0,
        })
        this.initialized = true
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