import * as PIXI from 'pixi.js'
import { Layer, RealmData, ColliderMap, TilePoint, defaultMapData } from './types'
import { sprites, Collider } from './spritesheet/spritesheet'

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
    protected realmData: RealmData = defaultMapData
    protected collidersFromSpritesMap: ColliderMap = {}

    constructor(realmData: RealmData) {
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
    }

    protected async loadRoom(index: number) {
        // Clear the current room
        this.layers.floor.removeChildren()
        this.layers.transition.removeChildren()
        this.layers.object.removeChildren()
        this.collidersFromSpritesMap = {}

        const room = this.realmData.rooms[index]

        for (const [tilePoint, tileData] of Object.entries(room.tilemap)) {
            const floor = tileData.floor
            const transition = tileData.transition
            const object = tileData.object

            const [x, y] = tilePoint.split(',').map(Number)

            if (floor) {
                await this.placeTileFromJson(x, y, 'floor', floor)
            }

            if (transition) {
                await this.placeTileFromJson(x, y, 'transition', transition)
            }

            if (object) {
                await this.placeTileFromJson(x, y, 'object', object)
            }
        }

        this.sortObjectsByY()
    }

    private placeTileFromJson = async (x: number, y: number, layer: Layer, tileName: string) => {
        const screenCoordinates = this.convertTileToScreenCoordinates(x, y)
        const { sprite, data } = await sprites.getSpriteForTileJSON(tileName)
        sprite.position.set(screenCoordinates.x, screenCoordinates.y)
        this.layers[layer].addChild(sprite)

        // set up default tile colliders 
        if (data.colliders) {
            data.colliders.forEach((collider) => {
                const colliderCoordinates = this.getTileCoordinatesOfCollider(collider, sprite)

                const key = `${colliderCoordinates.x}, ${colliderCoordinates.y}` as TilePoint
                this.collidersFromSpritesMap[key] = true
            })
        }
    }

    protected getTileCoordinatesOfCollider = (collider: Collider, sprite: PIXI.Sprite) => {
        const topLeftX = sprite.x - sprite.width * sprite.anchor.x
        const topLeftY = sprite.y - sprite.height * sprite.anchor.y

        const gridCoordinates = this.convertScreenToTileCoordinates(topLeftX, topLeftY)

        return {
            x: gridCoordinates.x + collider.x,
            y: gridCoordinates.y + collider.y,
        }
    }

    public getApp = () => {
        if (!this.initialized) {
            throw new Error('App not initialized')
        }

        return this.app
    }

    protected convertScreenToTileCoordinates = (x: number, y: number) => {
        const tileSize = 32
        return {
            x: Math.floor(x / tileSize),
            y: Math.floor(y / tileSize),
        }
    }

    protected convertTileToScreenCoordinates = (x: number, y: number) => {
        const tileSize = 32
        return {
            x: x * tileSize,
            y: y * tileSize,
        }
    }

    protected sortObjectsByY = () => {
        this.layers.object.children.sort((a, b) => {
            return a.y - b.y
        })
    }

    public destroy() {
        if (this.initialized) {
            this.app.destroy()
        }
    }
}