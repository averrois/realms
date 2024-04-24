import * as PIXI from 'pixi.js'
import { TileMap , getDefaultTileMap} from './types'

PIXI.TextureStyle.defaultOptions.scaleMode = 'nearest'

export class App {
    private initialized: boolean = false
    private app: PIXI.Application = new PIXI.Application()
    private tileMapContainer: PIXI.Container = new PIXI.Container({
        scale: 5,
    })
    private gridLines: PIXI.Container = new PIXI.Container()
    private tileMap: TileMap = getDefaultTileMap()

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
        this.app.stage.addChild(this.gridLines)

        await this.loadAssets()
        this.drawGridLines()
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

    drawGridLines() {
        for (let y = 0; y < this.tileMap.length; y++) {
            for (let x = 0; x < this.tileMap[y].length; x++) {
                const sprite = PIXI.Sprite.from('/sprites/tile-outline.png');
                sprite.x = x * 80;
                sprite.y = y * 80;
                this.gridLines.addChild(sprite);
            }
        }
    }

}