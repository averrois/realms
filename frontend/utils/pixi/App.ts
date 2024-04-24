import * as PIXI from 'pixi.js'
import { TileMap , getDefaultTileMap } from './types'

PIXI.TextureStyle.defaultOptions.scaleMode = 'nearest'

export class App {
    protected app: PIXI.Application = new PIXI.Application()
    protected readonly gameScale: number = 5
    protected initialized: boolean = false
    protected tileMapContainer: PIXI.Container = new PIXI.Container({
        scale: this.gameScale,
    })
    protected tileMap: TileMap = getDefaultTileMap()

    async init() {
        const container = document.getElementById('app-container')
        if (!container) {
            throw new Error('Container not found')
        }

        await this.app.init({
            resizeTo: container,
            backgroundColor: 0x0F0F0F,
        })
        this.initialized = true

        // Mount containers
        this.app.stage.addChild(this.tileMapContainer)
    }

    public getApp() {
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