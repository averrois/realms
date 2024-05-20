import { Sprite } from 'pixi.js'

export const defaultMapData = [{name: 'Home', tilemap: {}}]

export type Tool = 'None' | 'Hand' | 'ZoomIn' | 'ZoomOut' | 'Tile'  | 'Eraser'

export type SpecialTile = 'None' | 'Impassable' | 'Teleport' | 'Spawn'

export type TileMode = 'Single' | 'Rectangle'

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

export interface TileColliderMap {
    [key: `${number}, ${number}`]: boolean
}

export interface TileColliderSpriteMap {
    [key: `${number}, ${number}`]: Sprite
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
