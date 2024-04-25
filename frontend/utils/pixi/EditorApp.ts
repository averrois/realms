import * as PIXI from 'pixi.js'
import { App } from './App'
import signal from '../signal'

export class EditorApp extends App {

    private gridLineContainer: PIXI.Container = new PIXI.Container()
    private gridLines: PIXI.TilingSprite = new PIXI.TilingSprite()
    private toolMode: 'Hand' = 'Hand'
    private dragging: boolean = false
    private initialDragPosition: PIXI.Point = new PIXI.Point()

    public async init() {
        await super.init()
        this.app.stage.addChild(this.gridLineContainer)
        await this.loadAssets()
        this.drawGridLines()

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
        this.app.renderer.on('resize', this.onResize)
    }

    private onResize = () => {
        this.gridLines.width = this.app.screen.width
        this.gridLines.height = this.app.screen.height
        console.log('running')
    }

    private setUpInteraction = () => {
        this.app.stage.interactive = true
        this.handTool()
        this.sendCoordinates()
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

    private sendCoordinates = () => {
        this.app.stage.on('pointermove', (e: PIXI.FederatedPointerEvent) => {
            const position = e.getLocalPosition(this.app.stage)
            const convertedPosition = this.convertToTileCoordinates(position.x, position.y)
            signal.emit('coordinates', convertedPosition)
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
        console.log(this.initialDragPosition)
        this.app.stage.on('pointermove', this.onDragMove)
    }

    private onDragEnd = (e: PIXI.FederatedPointerEvent) => {
        if (this.dragging) {
            this.app.stage.off('pointermove', this.onDragMove)
            this.dragging = false
        }
    }

    public destroy() {
        super.destroy()
    }
}