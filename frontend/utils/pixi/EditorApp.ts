import * as PIXI from 'pixi.js'
import { App } from './App'

export class EditorApp extends App {

    private gridLines: PIXI.Container = new PIXI.Container()
    private toolMode: 'Hand' = 'Hand'

    public async init() {
        await super.init()
        this.app.stage.addChild(this.gridLines)
        await this.loadAssets()
        this.drawGridLines()

        this.setUpInteraction()
    }

    private async loadAssets() {
        await PIXI.Assets.load('/sprites/tile-outline.png')
    }

    private drawGridLines() {
        const tilingSprite = new PIXI.TilingSprite({
            texture: PIXI.Texture.from('/sprites/tile-outline.png'),
            width: this.app.screen.width,
            height: this.app.screen.height,
        })

        this.app.stage.addChild(tilingSprite)
    }

    private setUpInteraction() {
        this.app.stage.interactive = true
        this.app.stage.on('pointerdown', (e) => {
            if (this.toolMode === 'Hand') {
                console.log('running')
            }
        })

    }
}