import { SpriteSheetTile } from './spritesheet'
import { SpriteSheetData } from './SpriteSheetData'

const width = 1024
const height = 1024
const url = '/sprites/spritesheets/grasslands.png'
const sprites: SpriteSheetTile[] = [
    { name: 'iight_green_flower_1', x: 384, y: 0, width: 32, height: 32, layer: 'above_floor' },
    { name: 'iight_green_flower_2', x: 384, y: 32, width: 32, height: 32, layer: 'above_floor' },
    { name: 'iight_green_flower_3', x: 384, y: 64, width: 32, height: 32, layer: 'above_floor' },
    { name: 'iight_green_flower_4', x: 384, y: 96, width: 32, height: 32, layer: 'above_floor' },
    { name: 'iight_green_flower_5', x: 384, y: 128, width: 32, height: 32, layer: 'above_floor' },
    { name: 'iight_green_flower_6', x: 384, y: 160, width: 32, height: 32, layer: 'above_floor' },

    { name: 'dark_green_flower_1', x: 416, y: 0, width: 32, height: 32, layer: 'above_floor' },
    { name: 'dark_green_flower_2', x: 448, y: 0, width: 32, height: 32, layer: 'above_floor' },
    { name: 'dark_green_flower_3', x: 480, y: 0, width: 32, height: 32, layer: 'above_floor' },
    { name: 'dark_green_flower_4', x: 480, y: 32, width: 32, height: 32, layer: 'above_floor' },
    { name: 'dark_green_flower_5', x: 448, y: 32, width: 32, height: 32, layer: 'above_floor' },
    { name: 'dark_green_flower_6', x: 416, y: 32, width: 32, height: 32, layer: 'above_floor' },
]

const grasslandsSpriteSheetData = new SpriteSheetData(width, height, url, sprites)

export { grasslandsSpriteSheetData }