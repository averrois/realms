import { Sprite } from 'pixi.js'

export type Tool = 'None' | 'Hand' | 'ZoomIn' | 'ZoomOut' | 'Tile'

export type TilePoint = `${number}, ${number}`

export type RealmData = Room[]

export interface Room {
    name: string,
    tilemap: {
        [key: `${number}, ${number}`]: {
            floor: string,
            transition: string,
            object: string,
        }
    }
}

export interface TilemapSprites {
    [key: `${number}, ${number}`]: {
        floor: Sprite,
        transition: Sprite,
        object: Sprite,
    }
}

export type Layer = 'floor' | 'transition' | 'object' 
