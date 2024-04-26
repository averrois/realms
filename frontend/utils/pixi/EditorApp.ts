import * as PIXI from 'pixi.js'
import { App } from './App'
import signal from '../signal'
import { Tool } from './types'

export class EditorApp extends App {

    private gridLineContainer: PIXI.Container = new PIXI.Container()
    private gridLines: PIXI.TilingSprite = new PIXI.TilingSprite()
    private toolMode: Tool = 'None'
    private dragging: boolean = false
    private initialDragPosition: PIXI.Point = new PIXI.Point()
    private scale: number = 1

    public async init() {
        await super.init()
        this.app.stage.addChild(this.gridLineContainer)
        await this.loadAssets()
        this.drawGridLines()

        this.setUpUIListeners()
        this.setUpInteraction()
    }

    private loadAssets = async () => {
        await PIXI.Assets.load('/sprites/tile-outline.png')
    }

    private drawGridLines = () => {
        this.gridLines = new PIXI.TilingSprite({
            texture: PIXI.Texture.from('/sprites/tile-outline.png'),
            width: this.app.screen.width,
            height: this.app.screen.height,
        })

        this.gridLineContainer.addChild(this.gridLines)
        this.app.renderer.on('resize', this.resizeGridLines)
    }

    private resizeGridLines = () => {
        this.gridLines.width = this.app.screen.width
        this.gridLines.height = this.app.screen.height
    }

    private setUpUIListeners = () => {
        signal.on('selectTool', this.onSelectTool)
    }

    private onSelectTool = (tool: Tool) => {
        this.toolMode = tool
    }

    private setUpInteraction = () => {
        this.app.stage.interactive = true
        this.handTool()
        this.zoomInTool()
        this.zoomOutTool()
        this.sendCoordinates()
    }

    private zoomInTool = () => {
        this.app.stage.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'ZoomIn') {
                this.setScale(this.scale + 0.1)
            }
        })
    }

    private zoomOutTool = () => {
        this.app.stage.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
            if (this.toolMode === 'ZoomOut') {
                this.setScale(this.scale - 0.1)
            }
        })
    }

    private setScale(newScale: number) {
        this.scale = newScale
        this.app.stage.scale.set(this.scale)
        this.resizeGridLines()
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

        // move the grid lines so they stay in front of camera at all times
        this.gridLineContainer.position.x -= diffX
        this.gridLineContainer.position.y -= diffY

        // scroll the grid lines so they look like they are moving
        this.gridLines.tilePosition.x += diffX
        this.gridLines.tilePosition.y += diffY
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

    public destroy() {
        signal.off('selectTool', this.onSelectTool)
        super.destroy()
    }
}