import { Sprite } from 'pixi.js'

export const defaultMapData: RealmData = {
    spawnpoint: {
        roomIndex: 0,
        x: 0,
        y: 0,
    },
    rooms: [{name: 'Home', tilemap: {}}]
}

export type Tool = 'None' | 'Hand' | 'ZoomIn' | 'ZoomOut' | 'Tile'  | 'Eraser'

export type SpecialTile = 'None' | 'Impassable' | 'Teleport' | 'Spawn'

export type TileMode = 'Single' | 'Rectangle'

export type TilePoint = `${number}, ${number}`

export type RealmData = {
    spawnpoint: {
        roomIndex: number,
        x: number,
        y: number,
    },
    rooms: Room[],
}

export interface Room {
    name: string,
    tilemap: {
        [key: `${number}, ${number}`]: {
            floor?: string,
            above_floor?: string,
            object?: string,
            impassable?: boolean
            teleporter?: {
                roomIndex: number,
                x: number,
                y: number,
            }
        }
    }
}

export interface ColliderMap {
    [key: `${number}, ${number}`]: boolean
}

export interface GizmoSpriteMap {
    [key: `${number}, ${number}`]: Sprite
}

export interface TilemapSprites {
    [key: `${number}, ${number}`]: {
        floor?: Sprite,
        above_floor?: Sprite,
        object?: Sprite,
    }
}

export type Layer = 'floor' | 'above_floor' | 'object'

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

export type Coordinate = [number, number]

export type AnimationState = 'idle_down' | 'idle_up' | 'idle_left' | 'idle_right' | 'walk_down' | 'walk_up' | 'walk_left' | 'walk_right'

export type Direction = 'down' | 'up' | 'left' | 'right'
