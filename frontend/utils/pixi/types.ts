import { Sprite } from 'pixi.js'

export type Tool = 'None' | 'Hand' | 'ZoomIn' | 'ZoomOut' | 'Tile'  | 'Eraser'

export type TilePoint = `${number}, ${number}`

export type RealmData = Room[]

export interface Room {
    name: string,
    tilemap: {
        [key: `${number}, ${number}`]: {
            floor?: string,
            transition?: string,
            object?: string,
        }
    }
}

export interface TilemapSprites {
    [key: `${number}, ${number}`]: {
        floor?: Sprite,
        transition?: Sprite,
        object?: Sprite,
    }
}

export type Layer = 'floor' | 'transition' | 'object'

export type Bounds = {
    x: number,
    y: number,
    width: number,
    height: number,
}

export type Point = {
    x: number,
    y: number,
}
