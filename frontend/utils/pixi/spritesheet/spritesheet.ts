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

export type SheetName = 'city'

class Sprites {
    private spriteSheetDataSet: { [key in SheetName]: SpriteSheetData } = {
        city: citySpriteSheetData
    }
    private sheets: Sheets = {}

    public async load(sheetName: SheetName) {
        if (!this.spriteSheetDataSet[sheetName]) {
            throw new Error(`Sheet ${sheetName} not found`)
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

const sprites = new Sprites()

export { sprites }