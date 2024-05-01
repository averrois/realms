import * as PIXI from 'pixi.js'
import { citySpriteSheetData } from './city'
import { Layer } from '../types'

export interface SpriteSheetTile {
    x: number,
    y: number,
    width: number,
    height: number
    layer?: Layer
}

export interface SpriteSheetData {
    width: number,
    height: number,
    url: string,
    sprites: { [key: string]: SpriteSheetTile },
}

type Sheets = {
    [key in SheetName]?: PIXI.Spritesheet
}

export type SheetName = 'city'

class Sprites {
    public spriteSheetDataSet: { [key in SheetName]: SpriteSheetData } = {
        city: citySpriteSheetData
    }
    public sheets: Sheets = {}

    public async load(sheetName: SheetName) {
        if (!this.spriteSheetDataSet[sheetName]) {
            throw new Error(`Sheet ${sheetName} not found`)
        }

        if (this.sheets[sheetName]) {
            return
        }

        await PIXI.Assets.load(this.spriteSheetDataSet[sheetName].url)
        this.sheets[sheetName] = new PIXI.Spritesheet(PIXI.Texture.from(this.spriteSheetDataSet[sheetName].url), this.getSpriteSheetData(this.spriteSheetDataSet[sheetName]))
        await this.sheets[sheetName]!.parse()
    }

    public getSprite(sheetName: SheetName, spriteName: string) {
        if (!this.sheets[sheetName]) {
            throw new Error(`Sheet ${sheetName} not found`)
        }

        if (!this.sheets[sheetName]!.textures[spriteName]) {
            throw new Error(`Sprite ${spriteName} not found in sheet ${sheetName}`)
        }

        return this.sheets[sheetName]!.textures[spriteName]
    }

    public getSpriteLayer(sheetName: SheetName, spriteName: string) {
        if (!this.spriteSheetDataSet[sheetName]) {
            throw new Error(`Sheet ${sheetName} not found`)
        }

        if (!this.spriteSheetDataSet[sheetName].sprites[spriteName]) {
            throw new Error(`Sprite ${spriteName} not found in sheet ${sheetName}`)
        }

        return this.spriteSheetDataSet[sheetName].sprites[spriteName].layer || 'floor'
    }

    private getSpriteSheetData(data: SpriteSheetData) {
        const spriteSheetData = {
            frames: {} as any,
            meta: {
                image: data.url,
                size: {
                    w: data.width,
                    h: data.height
                },
                format: 'RGBA8888',
                scale: 1
            },
            animations: {}
        }

        for (const [name, spriteData] of Object.entries(data.sprites)) {
            spriteSheetData.frames[name] = {
                frame: {
                    x: spriteData.x,
                    y: spriteData.y,
                    w: spriteData.width,
                    h: spriteData.height
                },
                spriteSourceSize: {
                    x: 0,
                    y: 0,
                    w: spriteData.width,
                    h: spriteData.height
                },
                sourceSize: {
                    w: spriteData.width,
                    h: spriteData.height
                }
            }
        }

        return spriteSheetData
    }   
}

const sprites = new Sprites()

export { sprites }