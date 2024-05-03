import * as PIXI from 'pixi.js'
import { Layer, RealmData } from './types'
import { sprites } from './spritesheet/spritesheet'

PIXI.TextureStyle.defaultOptions.scaleMode = 'nearest'

export class App {
    protected app: PIXI.Application = new PIXI.Application()
    protected initialized: boolean = false
    protected layers: { [key in Layer]: PIXI.Container } = {
        floor: new PIXI.Container(),
        transition: new PIXI.Container(),
        object: new PIXI.Container(),
    }
    protected currentRoomIndex: number = 0    
    protected realmData: RealmData = [{name: 'Home', tilemap: {}}]

    constructor(realmData?: RealmData) {
        if (realmData) {
            this.realmData = JSON.parse(JSON.stringify(realmData))
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

        await this.loadRoomSprites(this.currentRoomIndex)
    }

    protected loadRoomSprites = async (index: number) => {
        // Clear the current room
        this.layers.floor.removeChildren()
        this.layers.transition.removeChildren()
        this.layers.object.removeChildren()

        const room = this.realmData[index]

        for (const [tilePoint, tileData] of Object.entries(room.tilemap)) {
            const floor = tileData.floor
            const transition = tileData.transition
            const object = tileData.object

            const [x, y] = tilePoint.split(',').map(Number)
            const coordinates = this.convertToRealCoordinates(x, y)

            if (floor) {
                const floorSprite = await sprites.getSpriteForTileJSON(floor)
                floorSprite.position.set(coordinates.x, coordinates.y)
                this.layers.floor.addChild(floorSprite)
            }

            if (transition) {
                const transitionSprite = await sprites.getSpriteForTileJSON(transition)
                transitionSprite.position.set(coordinates.x, coordinates.y)
                this.layers.transition.addChild(transitionSprite)
            }

            if (object) {
                const objectSprite = await sprites.getSpriteForTileJSON(object)
                objectSprite.position.set(coordinates.x, coordinates.y)
                this.layers.object.addChild(objectSprite)
            }
        }
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

    protected convertToRealCoordinates = (x: number, y: number) => {
        const tileSize = 32
        return {
            x: x * tileSize,
            y: y * tileSize,
        }
    }

    public destroy() {
        if (this.initialized) {
            this.app.destroy()
        }
    }
}