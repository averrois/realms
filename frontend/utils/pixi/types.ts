import { Sprite } from 'pixi.js'

export type Tool = 'None' | 'Hand' | 'ZoomIn' | 'ZoomOut' | 'Tile'

export interface TilemapJSON {
    [key: `${number}, ${number}`]: {
        layer1: string,
        layer2: string,
        layer3: string,
        layer4: string,
        layer5: string
    }
}

export interface TilemapSprites {
    [key: `${number}, ${number}`]: {
        layer1: Sprite,
        layer2: Sprite,
        layer3: Sprite,
        layer4: Sprite,
        layer5: Sprite
    }
}

