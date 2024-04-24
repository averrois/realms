import * as PIXI from 'pixi.js'
import { App } from './App'

export class EditorApp extends App {

    private gridLines: PIXI.Container = new PIXI.Container()

    async init() {
        super.init()
        this.app.stage.addChild(this.gridLines)
        await this.loadAssets()
        this.drawGridLines()
    }

    async loadAssets() {
        await PIXI.Assets.load('/sprites/tile-outline.png')
    }

    drawGridLines() {
        for (let y = 0; y < this.tileMap.length; y++) {
            for (let x = 0; x < this.tileMap[y].length; x++) {
                const sprite = PIXI.Sprite.from('/sprites/tile-outline.png');
                sprite.x = x * 16 * this.gameScale;
                sprite.y = y * 16 * this.gameScale;
                this.gridLines.addChild(sprite);
            }
        }
    }
}