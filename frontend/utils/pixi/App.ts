import * as PIXI from 'pixi.js'
import signal from '../signal'

PIXI.TextureStyle.defaultOptions.scaleMode = 'nearest'

export class App {
    protected app: PIXI.Application = new PIXI.Application()
    protected initialized: boolean = false
    protected gameWorldContainer: PIXI.Container = new PIXI.Container()
    protected isMouseInScreen: boolean = false

    public async init() {
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
        this.app.stage.addChild(this.gameWorldContainer)

        this.setUpMouseListeners()
    }

    public getApp = () => {
        if (!this.initialized) {
            throw new Error('App not initialized')
        }

        return this.app
    }

    protected convertToTileCoordinates = (x: number, y: number) => {
        const tileSize = 32
        return {
            x: Math.floor(x / tileSize),
            y: Math.floor(y / tileSize),
        }
    }

    private onMouseEnter = () => {
        this.isMouseInScreen = true
    }

    private onMouseLeave = () => {
        this.isMouseInScreen = false
    }

    private setUpMouseListeners = () => {
        signal.on('mouseEnter', this.onMouseEnter)
        signal.on('mouseLeave', this.onMouseLeave)
    }

    public destroy() {
        signal.off('mouseEnter', this.onMouseEnter)
        signal.off('mouseLeave', this.onMouseLeave)

        if (this.initialized) {
            this.app.destroy()
        }
    }
}