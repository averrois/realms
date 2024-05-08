import * as PIXI from 'pixi.js'
import { App } from './App'
import signal from '../signal'
import { Layer, TilemapSprites, Tool, TilePoint } from './types'
import { SheetName, sprites } from './spritesheet/spritesheet'

export class EditorApp extends App {
    private gridLineContainer: PIXI.Container = new PIXI.Container()
    private gridLines: PIXI.TilingSprite = new PIXI.TilingSprite()
    private toolMode: Tool = 'None'
    private dragging: boolean = false
    private initialDragPosition: PIXI.Point = new PIXI.Point()
    private scale: number = 1
    protected isMouseInScreen: boolean = false
    private selectedPalette: SheetName = 'city'
    private selectedTile: string = ''   
    private tilemapSprites: TilemapSprites = {}
    private needsToSave: boolean = false

    public async init() {
        await super.init()

        this.app.stage.addChild(this.gridLineContainer)

        await this.loadAssets()
        this.drawGridLines()

        this.setUpSignalListeners()
        this.setUpBeforeUnload()
        this.setUpInteraction()
    }

    override async loadRoomSprites(index: number) {
        await super.loadRoomSprites(index)

        // iterate through all layers and update tilemapSprites
        for (const tile of this.layers.floor.children) {
            const key = `${tile.x / 32}, ${tile.y / 32}` as TilePoint
            this.tilemapSprites[key] = {
                ...this.tilemapSprites[key],
                floor: tile as PIXI.Sprite
            }
        }

        for (const tile of this.layers.transition.children) {
            const key = `${tile.x / 32}, ${tile.y / 32}` as TilePoint
            this.tilemapSprites[key] = {
                ...this.tilemapSprites[key],
                transition: tile as PIXI.Sprite
            }
        }

        for (const tile of this.layers.object.children) {
            const key = `${tile.x / 32}, ${tile.y / 32}` as TilePoint
            this.tilemapSprites[key] = {
                ...this.tilemapSprites[key],
                object: tile as PIXI.Sprite
            }
        }
    }

    private loadAssets = async () => {
        await PIXI.Assets.load('/sprites/tile-outline.png')
    }

    private drawGridLines = () => {
        this.gridLines = new PIXI.TilingSprite({
            texture: PIXI.Texture.from('/sprites/tile-outline.png'),
            width: this.app.screen.width,
            height: this.app.screen.height,
            alpha: 0.1,
        })

        this.gridLineContainer.addChild(this.gridLines)
        this.gridLineContainer.eventMode = 'none'
        this.app.renderer.on('resize', this.resizeGridLines)
    }

    private resizeGridLines = () => {
        this.gridLines.width = this.app.screen.width * (1 / this.scale)
        this.gridLines.height = this.app.screen.height * (1 / this.scale)
    }

    private setUpSignalListeners = () => {
        signal.on('selectTool', this.onSelectTool)
        signal.on('tileSelected', this.onSelectTile)
        signal.on('mouseOver', this.onMouseOver)
        signal.on('beginSave', this.onBeginSave)
        signal.on('saved', this.onSaved)
    }

    private onSelectTile = (tile: string) => {
        this.selectedTile = tile
        this.toolMode = 'Tile'
    }

    private onSelectTool = (tool: Tool) => {
        this.toolMode = tool
    }

    private setUpInteraction = () => {
        this.app.stage.eventMode = 'static'
        this.app.stage.hitArea = this.app.screen
        this.handTool()
        this.zoomInTool()
        this.zoomOutTool()
        this.tileTool()
        this.eraserTool()
        this.sendCoordinates()
    }

    private placeTileAndSave = (e: PIXI.FederatedPointerEvent) => {
        const { x, y, layer } =  this.placeTileOnMousePosition(e)

        // For database purposes
        this.addTileToRealmData(x, y, layer, this.selectedPalette + '-' + this.selectedTile)
    }

    private placeTileOnMousePosition = (e: PIXI.FederatedPointerEvent) => {
        const position = e.getLocalPosition(this.app.stage)
        const convertedPosition = this.convertToTileCoordinates(position.x, position.y)
        
        const tile = sprites.getSprite(this.selectedPalette, this.selectedTile)
        tile.x = convertedPosition.x * 32
        tile.y = convertedPosition.y * 32

        tile.eventMode = 'static'
        tile.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
            console.log('nice')
        })

        const layer = sprites.getSpriteLayer(this.selectedPalette, this.selectedTile) as Layer

        return this.setTileAtPosition(convertedPosition.x, convertedPosition.y, layer, tile)
    }

    private getTileAtPosition = (x: number, y: number, layer: Layer) => {
        const key = `${x}, ${y}` as TilePoint
        return this.tilemapSprites[key]?.[layer]
    }

    private setTileAtPosition = (x: number, y: number, layer: Layer, tile: PIXI.Sprite) => {
        const existingTile = this.getTileAtPosition(x, y, layer)
        if (existingTile) {
            this.layers[layer].removeChild(existingTile)
        }

        this.layers[layer].addChild(tile)

        const key = `${x}, ${y}` as TilePoint
        this.tilemapSprites[key] = {
            ...this.tilemapSprites[key],
            [layer]: tile
        }

        // sort the children by y position
        this.sortObjectsByY()

        return { x, y, layer, tile }
    }

    private addTileToRealmData = (x: number, y: number, layer: Layer, tile: string) => {
        const key = `${x}, ${y}` as TilePoint
        this.realmData[this.currentRoomIndex] = {
            ...this.realmData[this.currentRoomIndex],
            tilemap: {
                ...this.realmData[this.currentRoomIndex].tilemap,
                [key]: {
                    ...this.realmData[this.currentRoomIndex].tilemap[key],
                    [layer]: tile
                }
            }
        }
        this.needsToSave = true
    }

    private removeTileFromRealmData = (x: number, y: number, layer: Layer) => {
        const key = `${x}, ${y}` as TilePoint
        delete this.realmData[this.currentRoomIndex].tilemap[key][layer]
        this.needsToSave = true
    }

    private tileTool = () => {
        this.app.stage.on('pointerup', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Tile') {
                this.app.stage.off('pointermove', this.placeTileAndSave)
            }
        })

        this.app.stage.on('pointerupoutside', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Tile') {
                this.app.stage.off('pointermove', this.placeTileAndSave)
            }
        })

        this.app.stage.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Tile') {
                this.placeTileAndSave(e)
                this.app.stage.on('pointermove', this.placeTileAndSave)
            }
        })
    }

    private eraseTile = (e: PIXI.FederatedPointerEvent) => {
        const position = e.getLocalPosition(this.app.stage)
        const { x, y } = this.convertToTileCoordinates(position.x, position.y)

        const floorTile = this.getTileAtPosition(x, y, 'floor')
        const transitionTile = this.getTileAtPosition(x, y, 'transition')
        const objectTile = this.getTileAtPosition(x, y, 'object')
        
        if (objectTile) {
            this.layers.object.removeChild(objectTile)
            delete this.tilemapSprites[`${x}, ${y}`].object
            this.removeTileFromRealmData(x, y, 'object')
        } else if (transitionTile) {
            this.layers.transition.removeChild(transitionTile)
            delete this.tilemapSprites[`${x}, ${y}`].transition
            this.removeTileFromRealmData(x, y, 'transition')
        } else if (floorTile) {
            this.layers.floor.removeChild(floorTile)
            delete this.tilemapSprites[`${x}, ${y}`].floor
            this.removeTileFromRealmData(x, y, 'floor')
        }

    }

    private eraserTool = () => {
        this.app.stage.on('pointerup', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Eraser') {
                this.app.stage.off('pointermove', this.eraseTile)
            }
        })

        this.app.stage.on('pointerupoutside', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Eraser') {
                this.app.stage.off('pointermove', this.eraseTile)
            }
        })

        this.app.stage.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Eraser') {
                this.eraseTile(e)
                this.app.stage.on('pointermove', this.eraseTile)
            }
        })
    }

    private zoomInTool = () => {
        this.app.stage.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'ZoomIn') {
                this.zoomTo(this.scale + 0.2, e)
            }
        })
    }

    private zoomOutTool = () => {
        this.app.stage.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'ZoomOut') {
                this.zoomTo(this.scale - 0.2, e)
            }
        })
    }

    private zoomTo = (newScale: number, e: PIXI.FederatedPointerEvent) => {
        if (newScale < 0.6 || newScale > 3) return;

        const localPosition = e.getLocalPosition(this.app.stage)
        const globalPosition = e.global

        // Calculate new position to center zoom on the mouse pointer
        const newPositionX = globalPosition.x - (localPosition.x * newScale) 
        const newPositionY = globalPosition.y - (localPosition.y * newScale) 

        this.app.stage.position.x = newPositionX
        this.app.stage.position.y = newPositionY

        this.setScale(newScale)
    }

    private setScale(newScale: number) {
        this.scale = newScale
        this.app.stage.scale.set(this.scale)
        this.matchGridLinesToStage()
        this.resizeGridLines()
    }

    private matchGridLinesToStage = () => {
        this.gridLineContainer.position.x = -this.app.stage.position.x * (1 / this.scale)
        this.gridLineContainer.position.y = -this.app.stage.position.y * (1 / this.scale)
        this.gridLines.tilePosition.x = this.app.stage.position.x * (1 / this.scale)
        this.gridLines.tilePosition.y = this.app.stage.position.y * (1 / this.scale)
    }

    private handTool = () => {
        this.app.stage.on('pointerup', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Hand') {
                this.onDragEnd(e)
            }
        })

        this.app.stage.on('pointerupoutside', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Hand') {
                this.onDragEnd(e)
            }
        })

        this.app.stage.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Hand') {
                this.onDragStart(e)
            }
        })
    }

    private onDragMove = (e: PIXI.FederatedPointerEvent) => {
        const diffX = e.getLocalPosition(this.app.stage).x - this.initialDragPosition.x
        const diffY = e.getLocalPosition(this.app.stage).y - this.initialDragPosition.y
        this.app.stage.position.x += diffX 
        this.app.stage.position.y += diffY 

        this.matchGridLinesToStage()
    }

    private onDragStart = (e: PIXI.FederatedPointerEvent) => {
        this.dragging = true
        this.initialDragPosition.set(e.getLocalPosition(this.app.stage).x, e.getLocalPosition(this.app.stage).y)
        this.app.stage.on('pointermove', this.onDragMove)
    }

    private onDragEnd = (e: PIXI.FederatedPointerEvent) => {
        if (this.dragging) {
            this.app.stage.off('pointermove', this.onDragMove)
            this.dragging = false
        }
    }

    private sendCoordinates = () => {
        this.app.stage.on('pointermove', (e: PIXI.FederatedPointerEvent) => {
            if (this.isMouseInScreen === false) return

            const position = e.getLocalPosition(this.app.stage)
            const convertedPosition = this.convertToTileCoordinates(position.x, position.y)
            signal.emit('coordinates', convertedPosition)
        })
    }

    private onMouseOver = (isOver: boolean) => {
        this.isMouseInScreen = isOver
    }

    private onBeginSave = () => {
        signal.emit('save', this.realmData)
    }

    private onBeforeUnload = (e: BeforeUnloadEvent) => {
        if (this.needsToSave) {
            const message = 'Your changes may not be saved.'
            e.returnValue = message
            return message
        }
    }

    private setUpBeforeUnload = () => {
        window.addEventListener('beforeunload', this.onBeforeUnload)
    }

    private onSaved = () => {
        this.needsToSave = false
    }

    public destroy() {
        signal.off('selectTool', this.onSelectTool)
        signal.off('mouseOver', this.onMouseOver)
        signal.off('tileSelected', this.onSelectTile)
        signal.off('beginSave', this.onBeginSave)
        signal.off('saved', this.onSaved)
        window.removeEventListener('beforeunload', this.onBeforeUnload)

        super.destroy()
    }
}