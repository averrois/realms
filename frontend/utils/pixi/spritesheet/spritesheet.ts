import * as PIXI from 'pixi.js'
import { citySpriteSheetData } from './city'

export interface SpriteSheetTile {
    name: string,
    x: number,
    y: number,
    width: number,
    height: number
}

export interface SpriteSheetData {
    width: number,
    height: number,
    url: string,
    sprites: SpriteSheetTile[],
}

type Sheets = {
    [key in SheetName]?: PIXI.Spritesheet
}

type SheetName = 'City'

const spriteSheetMap: { [key in SheetName]: SpriteSheetData } = {
    City: citySpriteSheetData
}

export class Sprites {
    private sheets: Sheets = {}

    public async load(sheetName: SheetName) {
        if (!spriteSheetMap[sheetName]) {
            throw new Error(`Sheet ${sheetName} not found`)
        }

        await PIXI.Assets.load(spriteSheetMap[sheetName].url)
        this.sheets[sheetName] = new PIXI.Spritesheet(PIXI.Texture.from(spriteSheetMap[sheetName].url), this.getSpriteSheetData(spriteSheetMap[sheetName]))
        await this.sheets[sheetName]!.parse()
    }

    public getSheet(sheetName: SheetName) {
        if (!this.sheets[sheetName]) {
            throw new Error(`Sheet ${sheetName} not found`)
        }

        return this.sheets[sheetName]!
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

        for (const sprite of data.sprites) {
            spriteSheetData.frames[sprite.name] = {
                frame: {
                    x: sprite.x,
                    y: sprite.y,
                    w: sprite.width,
                    h: sprite.height
                },
                spriteSourceSize: {
                    x: 0,
                    y: 0,
                    w: sprite.width,
                    h: sprite.height
                },
                sourceSize: {
                    w: sprite.width,
                    h: sprite.height
                }
            }
        }

        return spriteSheetData
    }   
}