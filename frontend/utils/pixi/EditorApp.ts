import * as PIXI from 'pixi.js'
import { App } from './App'
import signal from '../signal'
import { Layer, TilemapSprites, Tool, TilePoint, Point, RealmData, Room, TileMode, GizmoSpriteMap, SpecialTile } from './types'
import { SheetName, SpriteSheetTile, sprites } from './spritesheet/spritesheet'

export class EditorApp extends App {
    private gridLines: PIXI.TilingSprite = new PIXI.TilingSprite()
    private gizmoContainer: PIXI.Container = new PIXI.Container()
    private toolMode: Tool = 'None'
    private tileMode: TileMode = 'Single'
    private dragging: boolean = false
    private initialDragPosition: PIXI.Point = new PIXI.Point()
    private scale: number = 1
    private selectedPalette: SheetName = 'city'
    private selectedTile: string = ''   
    private selectedTileLayer: Layer | null = null
    private specialTileMode: SpecialTile = 'None'
    private eraserLayer: Layer | 'gizmo' = 'floor'
    private tilemapSprites: TilemapSprites = {}
    private needsToSave: boolean = false
    private currentCoordinates: Point = { x: 0, y: 0 }
    private lastErasedCoordinates: Point = { x: 0, y: 0 }
    private canErase: boolean = true

    private gizmoSprites: GizmoSpriteMap = {}
    private previewTiles: PIXI.Sprite[] = []
    private hiddenTiles: PIXI.Sprite[] = []
    private eraserTiles: PIXI.Sprite[] = []

    public async init() {
        await this.loadAssets()
        await super.init()

        this.gizmoContainer.eventMode = 'static'
        this.gizmoContainer.visible = false
        this.app.stage.addChild(this.gizmoContainer)

        this.drawGridLines()
        this.setUpSignalListeners()
        this.setUpBeforeUnload()
        this.setUpInteraction()
        this.onSelectEraserLayer(this.eraserLayer)
    }

    override async loadRoom(index: number) {
        this.tilemapSprites = {}
        this.collidersFromSpritesMap = {}
        this.gizmoSprites = {}

        await super.loadRoom(index)

        this.drawColliders()

        this.setUpInitialTilemapDataAndPointerEvents('floor')
        this.setUpInitialTilemapDataAndPointerEvents('transition')
        this.setUpInitialTilemapDataAndPointerEvents('object')
    }

    private drawColliders = () => {
        this.gizmoContainer.removeChildren()
        for (const [key, value] of Object.entries(this.collidersFromSpritesMap)) {
            if (value) {
                const [x, y] = key.split(',').map(Number)
                this.placeColliderSprite(x, y)
            }
        }

        for (const [key, value] of Object.entries(this.realmData[this.currentRoomIndex].tilemap)) {
            if (value.impassable) {
                const [x, y] = key.split(',').map(Number)
                const sprite = this.placeColliderSprite(x, y)

                // set up erase
                if (sprite) {
                    this.setUpEraserTool(sprite, x, y, 'gizmo')
                }
            }
        }
    }

    private setUpInitialTilemapDataAndPointerEvents = (layer: Layer) => {
        const tiles = this.layers[layer].children

        for (const tile of tiles) {
            const convertedPosition = this.convertScreenToTileCoordinates(tile.x, tile.y)

            const key: TilePoint = `${convertedPosition.x}, ${convertedPosition.y}`

            this.tilemapSprites[key] = { ...this.tilemapSprites[key], [layer]: tile as PIXI.Sprite }

            this.setUpEraserTool(tile as PIXI.Sprite, convertedPosition.x, convertedPosition.y, layer)
        }
    }

    private loadAssets = async () => {
        await PIXI.Assets.load('/sprites/tile-outline.png')
        await PIXI.Assets.load('/sprites/erase-tile.png')
        await PIXI.Assets.load('/sprites/collider-tile.png')
        await PIXI.Assets.load('/sprites/teleport-tile.png')
    }

    private placeColliderSprite = (x: number, y: number, tile?: PIXI.Sprite) => {
        const key = `${x}, ${y}` as TilePoint

        const sprite = tile || new PIXI.Sprite(PIXI.Texture.from('/sprites/collider-tile.png'))
        sprite.x = x * 32
        sprite.y = y * 32
        this.gizmoContainer.addChild(sprite)
        this.gizmoSprites[key] = sprite

        return sprite
    } 

    private placeImpassableCollider = (x: number, y: number, tile: PIXI.Sprite) => {
        this.addColliderToRealmData(x, y)

        return this.placeColliderSprite(x, y, tile)
    }

    private placeColliderFromSprite = (x: number, y: number, tile?: PIXI.Sprite) => {
        const key = `${x}, ${y}` as TilePoint
        this.placeColliderSprite(x, y, tile)
        this.collidersFromSpritesMap[key] = true
    }

    private isColliderAtPosition = (x: number, y: number) => {
        const key = `${x}, ${y}` as TilePoint
        return this.collidersFromSpritesMap[key] || this.realmData[this.currentRoomIndex].tilemap[key]?.impassable === true
    }

    private removeGizmoAtPosition = (x: number, y: number, eraseSpriteCollider?: boolean) => {
        const key = `${x}, ${y}` as TilePoint
        if (!eraseSpriteCollider && this.collidersFromSpritesMap[key]) return
        this.collidersFromSpritesMap[key] = false

        const sprite = this.gizmoSprites[key]
        if (sprite) {
            this.gizmoContainer.removeChild(sprite)
        }

        delete this.gizmoSprites[key]

        this.removeGizmoFromRealmData(x, y)
    }

    private drawGridLines = () => {
        this.gridLines = new PIXI.TilingSprite({
            texture: PIXI.Texture.from('/sprites/tile-outline.png'),
            width: this.app.screen.width,
            height: this.app.screen.height,
            alpha: 0.1,
        })

        this.gridLines.eventMode = 'none'
        this.app.stage.addChild(this.gridLines)
        this.app.renderer.on('resize', this.resizeEvent)
    }

    private resizeEvent = () => {
        this.resizeGridLines()
        this.matchHitAreaToGridLines()
    }

    private resizeGridLines = () => {
        this.gridLines.width = this.app.screen.width * (1 / this.scale)
        this.gridLines.height = this.app.screen.height * (1 / this.scale)
    }

    private matchHitAreaToGridLines = () => {
        this.app.stage.hitArea = new PIXI.Rectangle(this.gridLines.position.x, this.gridLines.position.y, this.gridLines.width, this.gridLines.height)
    }

    private setUpSignalListeners = () => {
        signal.on('selectTool', this.onSelectTool)
        signal.on('tileSelected', this.onSelectTile)
        signal.on('beginSave', this.onBeginSave)
        signal.on('saved', this.onSaved)
        signal.on('createRoom', this.onCreateRoom)
        signal.on('changeRoom', this.changeRoom)
        signal.on('deleteRoom', this.onDeleteRoom)
        signal.on('changeRoomName', this.onChangeRoomName)
        signal.on('selectTileMode', this.onSelectTileMode)
        signal.on('showGizmos', this.onShowGizmos)
        signal.on('selectSpecialTile', this.onSelectSpecialTile)
        signal.on('selectEraserLayer', this.onSelectEraserLayer)
    }

    private onSelectTile = (tile: string) => {
        this.selectedTile = tile
        this.toolMode = 'Tile'
        const spriteLayer = sprites.getSpriteLayer(this.selectedPalette, this.selectedTile)
        this.selectedTileLayer = spriteLayer
        this.setSpecialTileToNone()
    }

    private onSelectSpecialTile = (specialTile: SpecialTile) => {
        this.specialTileMode = specialTile
        this.toolMode = 'Tile'
        this.gizmoContainer.visible = true
        signal.emit('gizmosVisible')
    }

    private setSpecialTileToNone = () => {
        this.specialTileMode = 'None'
        signal.emit('resetSpecialTileMode')
    }

    private onSelectTool = (tool: Tool) => {
        this.toolMode = tool
        this.setSpecialTileToNone()
    }

    private onSelectTileMode = (mode: TileMode) => {
        this.tileMode = mode
    }

    private onSelectEraserLayer = (layer: Layer | 'gizmo') => {
        this.eraserLayer = layer

        this.layers.floor.eventMode = 'none'
        this.layers.transition.eventMode = 'none'
        this.layers.object.eventMode = 'none'
        this.gizmoContainer.eventMode = 'none'

        if (layer === 'floor') {
            this.layers.floor.eventMode = 'static'
        } else if (layer === 'transition') {
            this.layers.transition.eventMode = 'static'
        } else if (layer === 'object') {
            this.layers.object.eventMode = 'static'
        } else if (layer === 'gizmo') {
            this.gizmoContainer.eventMode = 'static'
            this.gizmoContainer.visible = true
            signal.emit('gizmosVisible')    
        }
    }

    private setUpInteraction = () => {
        this.app.stage.eventMode = 'static'
        this.app.stage.hitArea = this.app.screen
        this.handTool()
        this.zoomInTool()
        this.zoomOutTool()
        this.tileTool()
        this.rectangleEraserTool()
        this.updateCoordinates()
    }

    private placeTileOnMousePosition = (e: PIXI.FederatedPointerEvent) => {
        const position = e.getLocalPosition(this.app.stage)
        const tileCoordinates = this.convertScreenToTileCoordinates(position.x, position.y)

        this.placeTileAtPosition(tileCoordinates.x, tileCoordinates.y)
    }

    private placeTileAtPosition = (x: number, y: number) => {
        const { tile, data, layer, type } = this.getCurrentSpriteInfo()

        tile.x = x * 32
        tile.y = y * 32

        if (data.colliders) {
            if (this.collidersConflict(data.colliders, tile)) return
        }

        this.setUpEraserTool(tile, x, y, layer)

        if (type === 'Impassable') {
            if (this.isColliderAtPosition(x, y) === false) {
                this.placeImpassableCollider(x, y, tile)
            }
            return
        }

        this.layers[layer as Layer].addChild(tile)

        const existingTile = this.getTileAtPosition(x, y, layer as Layer)
        if (existingTile) {
            this.layers[layer as Layer].removeChild(existingTile)
        }

        const key = `${x}, ${y}` as TilePoint
        this.tilemapSprites[key] = {
            ...this.tilemapSprites[key],
            [layer]: tile
        }

        if (data.colliders) {
            data.colliders.forEach((collider) => {
                const colliderCoordinates = this.getTileCoordinatesOfCollider(collider, tile)
                // do not place the sprite if there is already a collider there. doing this would just double up the sprites.
                if (this.isColliderAtPosition(colliderCoordinates.x, colliderCoordinates.y) === false) {   
                    this.placeColliderFromSprite(colliderCoordinates.x, colliderCoordinates.y)
                }
            })
        }

        // sort the children by y position
        this.sortObjectsByY()

        // For database purposes
        this.addTileToRealmData(x, y, layer as Layer, this.selectedPalette + '-' + this.selectedTile)
    }

    private collidersConflict = (colliders: Point[], tile: PIXI.Sprite) => {
        for (const collider of colliders) {
            const colliderCoordinates = this.getTileCoordinatesOfCollider(collider, tile)
                const key = `${colliderCoordinates.x}, ${colliderCoordinates.y}` as TilePoint

                // cannot place a tile with collider on top of another collider
                if (this.collidersFromSpritesMap[key] === true) return true
        }
        return false
    }

    private rectangleEraserTool = () => {
        this.app.stage.on('pointerup', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Eraser' && this.getCurrentTileMode() === 'Rectangle') {
                // eraser drag end
                this.onRectangleEraseDragEnd(e)
                this.removeEraserTiles()
            } 
        })

        this.app.stage.on('pointerupoutside', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Eraser' && this.getCurrentTileMode() === 'Rectangle') {
                // eraser drag end
                this.onRectangleEraseDragEnd(e)
                this.removeEraserTiles()
            } 
        })

        this.app.stage.on('pointerleave', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Eraser' && this.getCurrentTileMode() === 'Rectangle') {
                // Remove eraser rectangle
                this.removeEraserTiles()
            }
        })

        this.app.stage.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Eraser' && this.getCurrentTileMode() === 'Rectangle') {
                // eraser drag start
                this.onRectangleEraseDragStart(e)
            }
        })
    }

    private onRectangleEraseDragStart = (e: PIXI.FederatedPointerEvent) => {
        this.dragging = true
        this.initialDragPosition.set(e.getLocalPosition(this.app.stage).x, e.getLocalPosition(this.app.stage).y)
        this.app.stage.on('pointermove', this.onRectangleEraseDragMove)
    }

    private onRectangleEraseDragMove = (e: PIXI.FederatedPointerEvent) => {
        this.removeEraserTiles()
        const dragPosition = e.getLocalPosition(this.app.stage)
        const squares = this.getTileCoordinatesInRectangle(this.initialDragPosition, dragPosition)

        squares.forEach(square => {
            // place eraser tile
            const sprite = new PIXI.Sprite(PIXI.Texture.from('/sprites/erase-tile.png'))
            sprite.x = square.x * 32
            sprite.y = square.y * 32
            this.eraserTiles.push(sprite)
            this.app.stage.addChild(sprite)
        })
    }

    private onRectangleEraseDragEnd = (e: PIXI.FederatedPointerEvent) => {
        if (this.dragging) {
            this.app.stage.off('pointermove', this.onRectangleEraseDragMove)
            this.dragging = false

            // get array of tile coordinates between initial and final position in rectangle
            const dragEndPosition = e.getLocalPosition(this.app.stage)
            const squares = this.getTileCoordinatesInRectangle(this.initialDragPosition, dragEndPosition)
            
            // erase the tiles!
            this.eraseTilesInRectangle(squares)
        }
    }

    private removeEraserTiles = () => {
        for (const eraserTile of this.eraserTiles) {
            if (eraserTile.parent) {
                eraserTile.parent.removeChild(eraserTile)
            }
        }
        this.eraserTiles = []
    }

    private eraseTilesInRectangle = (squares: Point[]) => {
        squares.forEach(square => {
            this.eraseTileAtPosition(square.x, square.y, this.eraserLayer)
        })
    }

    private eraseTileAtPosition = (x: number, y: number, layer: Layer | 'gizmo') => {
        const tile = this.getTileAtPosition(x, y, layer as Layer)
        if (tile) {
            if (layer === 'gizmo') {
                this.removeGizmoAtPosition(x, y)
                return
            }

            const tileData = this.getTileDataAtPosition(x, y, layer as Layer)
            this.layers[layer as Layer].removeChild(tile)
            delete this.tilemapSprites[`${x}, ${y}`][layer as Layer]
            this.removeTileFromRealmData(x, y, layer as Layer)

            if (tileData && tileData.colliders) {
                // remove the collider and the sprite
                tileData.colliders.forEach((collider) => {
                    const colliderCoordinates = this.getTileCoordinatesOfCollider(collider, tile)
                    this.removeGizmoAtPosition(colliderCoordinates.x, colliderCoordinates.y, true)
                })
            }
        }
    }

    private setUpEraserTool = (tile: PIXI.Sprite, x: number, y: number, layer: Layer | 'gizmo') => {
        const erase = () => {
            this.eraseTileAtPosition(x, y, layer)
            this.lastErasedCoordinates = this.currentCoordinates
            this.canErase = false
        }

        tile.eventMode = 'static'
        tile.on('pointermove', (e: PIXI.FederatedPointerEvent) => {
            // if mouse is clicked
            if (this.toolMode === 'Eraser' && this.getCurrentTileMode() === 'Single') {
                tile.tint = 0xababab
                const holdingClick = e.buttons === 1
                if (holdingClick && this.canErase) {
                    erase()
                }
            }
        })

        tile.on('pointerleave', () => {
            if (this.toolMode === 'Eraser' && this.getCurrentTileMode() === 'Single') {
                tile.tint = 0xFFFFFF
            }
        })

        tile.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Eraser' && this.getCurrentTileMode() === 'Single') {
                erase()
            }
        })
    }

    private getTileAtPosition = (x: number, y: number, layer: Layer | 'gizmo') => {
        const key = `${x}, ${y}` as TilePoint

        if (layer === 'gizmo') {
            return this.gizmoSprites[key]
        }

        return this.tilemapSprites[key]?.[layer]
    }

    private getTileDataAtPosition = (x: number, y: number, layer: Layer) => {
        const key = `${x}, ${y}` as TilePoint
        const tileName = this.realmData[this.currentRoomIndex].tilemap[key]?.[layer]
        if (tileName) {
            const [sheetName, spriteName] = tileName.split('-') as [SheetName, string]

            return sprites.getSpriteData(sheetName, spriteName)
        }
    }

    private addTileToRealmData = (x: number, y: number, layer: Layer, tile: string) => {
        const key = `${x}, ${y}` as TilePoint
        const newRealmData = this.realmData
        newRealmData[this.currentRoomIndex] = {
            ...newRealmData[this.currentRoomIndex],
            tilemap: {
                ...newRealmData[this.currentRoomIndex].tilemap,
                [key]: {
                    ...newRealmData[this.currentRoomIndex].tilemap[key],
                    [layer]: tile
                }
            }
        }
        this.updateRealmData(newRealmData)
    }

    private addColliderToRealmData = (x: number, y: number) => {
        const key = `${x}, ${y}` as TilePoint
        const newRealmData = this.realmData
        newRealmData[this.currentRoomIndex].tilemap[key] = {
            ...newRealmData[this.currentRoomIndex].tilemap[key],
            impassable: true
        }
        this.updateRealmData(newRealmData)
    }

    private removeGizmoFromRealmData = (x: number, y: number) => {
        const key = `${x}, ${y}` as TilePoint
        const newRealmData = this.realmData
        newRealmData[this.currentRoomIndex].tilemap[key] = {
            ...newRealmData[this.currentRoomIndex].tilemap[key],
            impassable: false
            // TODO: remove all other kinds of gizmos
        }
        this.updateRealmData(newRealmData)
    }

    private removeTileFromRealmData = (x: number, y: number, layer: Layer) => {
        const key = `${x}, ${y}` as TilePoint
        const newRealmData = this.realmData
        delete newRealmData[this.currentRoomIndex].tilemap[key][layer]
        this.updateRealmData(newRealmData)
    }

    private updateRealmData = (newRealmData: RealmData) => {
        this.realmData = newRealmData
        this.needsToSave = true
    }

    private placePreviewTileAtMouse = (e: PIXI.FederatedPointerEvent) => {
        const position = e.getLocalPosition(this.app.stage)
        const tileCoordinates = this.convertScreenToTileCoordinates(position.x, position.y)

        this.placePreviewTileAtPosition(tileCoordinates.x, tileCoordinates.y)
    }

    private placePreviewTileAtPosition = (x: number, y: number) => {
        const { tile, data, layer } = this.getCurrentSpriteInfo()

        tile.x = x * 32
        tile.y = y * 32
        this.previewTiles.push(tile)

        let colliderConflict = false
        if (data.colliders) {
            if (this.collidersConflict(data.colliders, tile)) {
                colliderConflict = true
                tile.tint = 0xff0008
            }
        }

        const existingTile = this.getTileAtPosition(x, y, layer as Layer)
        // hide tiles it covers
        if (existingTile && !colliderConflict) {
            existingTile.visible = false
            this.hiddenTiles.push(existingTile)
        }

        if (layer === 'gizmo') {
            this.gizmoContainer.addChild(tile)
        } else {
            this.layers[layer as Layer].addChild(tile)
        }


        if (!colliderConflict) {
            this.sortObjectsByY()
        }
    }

    private removePreviewTiles = () => {  
        for (const previewTile of this.previewTiles) {
            if (previewTile.parent) {
                previewTile.parent.removeChild(previewTile)
            }
        }
        this.previewTiles = []

        for (const hiddenTile of this.hiddenTiles) {
            hiddenTile.visible = true
        }
        this.hiddenTiles = []
    }

    private tileTool = () => {
        this.app.stage.on('pointerup', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Tile') {
                this.app.stage.off('pointermove', this.placeTileOnMousePosition)
                this.onTileDragEnd(e)
            } 
        })

        this.app.stage.on('pointerupoutside', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Tile') {
                this.app.stage.off('pointermove', this.placeTileOnMousePosition)
                this.onTileDragEnd(e)
                this.removePreviewTiles()
            } 
        })

        this.app.stage.on('pointerleave', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Tile') {
                if (this.getCurrentTileMode() === 'Single') {
                    this.removePreviewTiles()
                } else {
                    if (this.dragging === false) {
                        this.removePreviewTiles()
                    }
                }
            } 
        })

        this.app.stage.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Tile') {
                if (this.getCurrentTileMode() === 'Single') {
                    this.removePreviewTiles()
                    this.placeTileOnMousePosition(e)
                    this.app.stage.on('pointermove', this.placeTileOnMousePosition)
                } else if (this.getCurrentTileMode() === 'Rectangle') {
                    this.onTileDragStart(e)
                }
            }
        })

        this.app.stage.on('pointermove', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Tile') {
                this.removePreviewTiles()
                if (this.dragging === false) {
                    this.placePreviewTileAtMouse(e)
                }
            }
        })
    }

    private getCurrentSpriteInfo = (): { data: SpriteSheetTile, layer: Layer | 'gizmo', tile: PIXI.Sprite, type: string } => {
        if (this.specialTileMode === 'Impassable') {
            const colliderTile = new PIXI.Sprite(PIXI.Texture.from('/sprites/collider-tile.png'))
            const layer = 'gizmo'
            return { data: {} as SpriteSheetTile, layer, tile: colliderTile, type: 'Impassable' }
        } else if (this.specialTileMode === 'Teleport') {
            const teleportTile = new PIXI.Sprite(PIXI.Texture.from('/sprites/teleport-tile.png'))
            const layer = 'gizmo'
            return { data: {} as SpriteSheetTile, layer, tile: teleportTile, type: 'Teleport' }
        }

        const data = sprites.getSpriteData(this.selectedPalette, this.selectedTile)
        const layer = sprites.getSpriteLayer(this.selectedPalette, this.selectedTile) as Layer
        const tile = sprites.getSprite(this.selectedPalette, this.selectedTile)

        return { data, layer, tile, type: 'Tile' }
    }

    private onTileDragStart = (e: PIXI.FederatedPointerEvent) => {
        this.dragging = true
        this.initialDragPosition.set(e.getLocalPosition(this.app.stage).x, e.getLocalPosition(this.app.stage).y)
        this.app.stage.on('pointermove', this.onTileDragMove)
    }

    private onTileDragMove = (e: PIXI.FederatedPointerEvent) => {
        const dragPosition = e.getLocalPosition(this.app.stage)
        const squares = this.getTileCoordinatesInRectangle(this.initialDragPosition, dragPosition)

        squares.forEach(square => {
            this.placePreviewTileAtPosition(square.x, square.y)
        })
    }

    private onTileDragEnd = (e: PIXI.FederatedPointerEvent) => {
        if (this.dragging) {
            this.app.stage.off('pointermove', this.onTileDragMove)
            this.dragging = false

            // get array of tile coordinates between initial and final position in rectangle
            const dragEndPosition = e.getLocalPosition(this.app.stage)
            const squares = this.getTileCoordinatesInRectangle(this.initialDragPosition, dragEndPosition)
            
            // place the tiles!
            squares.forEach(square => {
                this.placeTileAtPosition(square.x, square.y)
            })
        }
    }

    private getTileCoordinatesInRectangle = (start: Point, end: Point) => {
        const rectangleStart = this.convertScreenToTileCoordinates(start.x, start.y)
        const rectangleEnd = this.convertScreenToTileCoordinates(end.x, end.y)

        const xStart = Math.min(rectangleStart.x, rectangleEnd.x)
        const yStart = Math.min(rectangleStart.y, rectangleEnd.y)
        const xEnd = Math.max(rectangleStart.x, rectangleEnd.x)
        const yEnd = Math.max(rectangleStart.y, rectangleEnd.y)

        const squares: Point[] = [];
        for (let x = xStart; x <= xEnd; x++) {
            for (let y = yStart; y <= yEnd; y++) {
                squares.push({ x,y })
            }
        }

        return squares
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
        this.resizeEvent()
    }

    private matchGridLinesToStage = () => {
        this.gridLines.position.x = -this.app.stage.position.x * (1 / this.scale)
        this.gridLines.position.y = -this.app.stage.position.y * (1 / this.scale)
        this.gridLines.tilePosition.x = this.app.stage.position.x * (1 / this.scale)
        this.gridLines.tilePosition.y = this.app.stage.position.y * (1 / this.scale)
    }

    private handTool = () => {
        this.app.stage.on('pointerup', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Hand') {
                this.onHandDragEnd(e)
            }
        })

        this.app.stage.on('pointerupoutside', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Hand') {
                this.onHandDragEnd(e)
            }
        })

        this.app.stage.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'Hand') {
                this.onHandDragStart(e)
            }
        })
    }

    private onHandDragMove = (e: PIXI.FederatedPointerEvent) => {
        const diffX = e.getLocalPosition(this.app.stage).x - this.initialDragPosition.x
        const diffY = e.getLocalPosition(this.app.stage).y - this.initialDragPosition.y
        this.app.stage.position.x += diffX 
        this.app.stage.position.y += diffY 

        this.matchGridLinesToStage()
        this.matchHitAreaToGridLines()
    }

    private onHandDragStart = (e: PIXI.FederatedPointerEvent) => {
        this.dragging = true
        this.initialDragPosition.set(e.getLocalPosition(this.app.stage).x, e.getLocalPosition(this.app.stage).y)
        this.app.stage.on('pointermove', this.onHandDragMove)
    }

    private onHandDragEnd = (e: PIXI.FederatedPointerEvent) => {
        if (this.dragging) {
            this.app.stage.off('pointermove', this.onHandDragMove)
            this.dragging = false
        }
    }

    private updateCoordinates = () => {
        this.app.stage.on('pointermove', (e: PIXI.FederatedPointerEvent) => {
            const position = e.getLocalPosition(this.app.stage)
            const convertedPosition = this.convertScreenToTileCoordinates(position.x, position.y)
            this.currentCoordinates = convertedPosition

            if (this.currentCoordinates.x !== this.lastErasedCoordinates.x || this.currentCoordinates.y !== this.lastErasedCoordinates.y) {
                this.canErase = true
            }

            signal.emit('coordinates', this.currentCoordinates)
        })
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

    private onCreateRoom = () => {
        const newRoom: Room = {
            name: 'New Room',
            tilemap: {}
        }
        const newRealmData = this.realmData
        newRealmData.push(newRoom)
        this.updateRealmData(newRealmData)
        signal.emit('newRoom', newRoom.name)

        this.changeRoom(this.realmData.length - 1)
    }

    private changeRoom = async (index: number) => {
        signal.emit('loadingRoom')
        this.currentRoomIndex = index
        await this.loadRoom(this.currentRoomIndex)
        this.app.stage.position.set(0, 0)
        this.setScale(1)
        signal.emit('roomChanged', this.currentRoomIndex)
    }

    private onDeleteRoom = async (index: number) => {
        // disable delete if only one room
        if (this.realmData.length === 1) return

        const newRealmData = this.realmData
        newRealmData.splice(index, 1)
        this.updateRealmData(newRealmData)

        if (this.currentRoomIndex === index) {
            await this.changeRoom(0)
        } else if (this.currentRoomIndex > index) {
            this.currentRoomIndex -= 1
        }

        signal.emit('roomDeleted', { deletedIndex: index, newIndex: this.currentRoomIndex })
    }

    private onChangeRoomName = ({ index, newName }: { index: number, newName: string }) => {
        const newRealmData = this.realmData
        newRealmData[index].name = newName
        this.updateRealmData(newRealmData)
        signal.emit('roomNameChanged', { index, newName })
    }

    private getCurrentTileMode = (): TileMode => {
        // rectangle mode does nothing for object layer or teleport
        if ((this.selectedTileLayer === 'object' && this.toolMode === 'Tile' && this.specialTileMode === 'None') || this.specialTileMode === 'Teleport') {
            return 'Single'
        }

        return this.tileMode
    }
    
    private onSaved = () => {
        this.needsToSave = false
    }

    private onShowGizmos = (show: boolean) => {
        this.gizmoContainer.visible = show
    }

    public destroy() {
        signal.off('selectTool', this.onSelectTool)
        signal.off('tileSelected', this.onSelectTile)
        signal.off('beginSave', this.onBeginSave)
        signal.off('saved', this.onSaved)
        signal.off('createRoom', this.onCreateRoom)
        signal.off('changeRoom', this.changeRoom)
        signal.off('deleteRoom', this.onDeleteRoom)
        signal.off('changeRoomName', this.onChangeRoomName)
        signal.off('selectTileMode', this.onSelectTileMode)
        signal.off('showGizmos', this.onShowGizmos)
        signal.off('selectSpecialTile', this.onSelectSpecialTile)
        signal.off('selectEraserLayer', this.onSelectEraserLayer)
        window.removeEventListener('beforeunload', this.onBeforeUnload)

        super.destroy()
    }
}