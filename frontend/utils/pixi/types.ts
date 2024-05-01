import { Sprite } from 'pixi.js'

export type Tool = 'None' | 'Hand' | 'ZoomIn' | 'ZoomOut' | 'Tile'

export type TilePoint = `${number}, ${number}`

export interface TilemapJSON {
    [key: `${number}, ${number}`]: {
        layer1: string,
        layer2: string,
        layer3: string,
        layer4: string,
        layer5: string,
        layer6: string,
        layer7: string,
        layer8: string,
        layer9: string,
        layer10: string
    }
}

export interface TilemapSprites {
    [key: `${number}, ${number}`]: {
        layer1: Sprite,
        layer2: Sprite,
        layer3: Sprite,
        layer4: Sprite,
        layer5: Sprite,
        layer6: Sprite,
        layer7: Sprite,
        layer8: Sprite,
        layer9: Sprite,
        layer10: Sprite
    }
}

export type Layer = 'layer1' | 'layer2' | 'layer3' | 'layer4' | 'layer5' | 'layer6' | 'layer7' | 'layer8' | 'layer9' | 'layer10'
