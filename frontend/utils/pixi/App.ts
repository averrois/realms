import * as PIXI from 'pixi.js'
import { Layer, RealmData } from './types'

PIXI.TextureStyle.defaultOptions.scaleMode = 'nearest'

export class App {
    protected app: PIXI.Application = new PIXI.Application()
    protected initialized: boolean = false
    protected layers: { [key in Layer]: PIXI.Container } = {
        floor: new PIXI.Container(),
        transition: new PIXI.Container(),
        object: new PIXI.Container(),
    }
    protected realmData: RealmData = [{name: 'Home'}]

    constructor(realmData?: RealmData) {
        if (realmData) {
            this.realmData = realmData
        }
    }

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

        this.app.stage.addChild(this.layers.floor)
        this.app.stage.addChild(this.layers.transition)
        this.app.stage.addChild(this.layers.object)
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

    public destroy() {
        if (this.initialized) {
            this.app.destroy()
        }
    }
}