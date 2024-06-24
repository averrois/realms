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

    { name: 'vibrant_green_flower_1', x: 416, y: 64, width: 32, height: 32, layer: 'above_floor' },
    { name: 'vibrant_green_flower_2', x: 448, y: 64, width: 32, height: 32, layer: 'above_floor' },
    { name: 'vibrant_green_flower_3', x: 480, y: 64, width: 32, height: 32, layer: 'above_floor' },
    { name: 'vibrant_green_flower_4', x: 480, y: 96, width: 32, height: 32, layer: 'above_floor' },
    { name: 'vibrant_green_flower_5', x: 448, y: 96, width: 32, height: 32, layer: 'above_floor' },
    { name: 'vibrant_green_flower_6', x: 416, y: 96, width: 32, height: 32, layer: 'above_floor' },

    { name: 'blue_flower_1', x: 416, y: 128, width: 32, height: 32, layer: 'above_floor' },
    { name: 'blue_flower_2', x: 448, y: 128, width: 32, height: 32, layer: 'above_floor' },
    { name: 'blue_flower_3', x: 480, y: 128, width: 32, height: 32, layer: 'above_floor' },
    { name: 'blue_flower_4', x: 480, y: 160, width: 32, height: 32, layer: 'above_floor' },
    { name: 'blue_flower_5', x: 448, y: 160, width: 32, height: 32, layer: 'above_floor' },
    { name: 'blue_flower_6', x: 416, y: 160, width: 32, height: 32, layer: 'above_floor' },

    { name: 'placeholder_1', x: 0, y: 32, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_2', x: 32, y: 32, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_3', x: 64, y: 32, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_4', x: 96, y: 32, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_5', x: 128, y: 32, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_6', x: 160, y: 32, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_7', x: 192, y: 32, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_8', x: 224, y: 32, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_9', x: 256, y: 32, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_10', x: 288, y: 32, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_11', x: 320, y: 32, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_12', x: 352, y: 32, width: 32, height: 32, layer: 'above_floor' },

    { name: 'placeholder_13', x: 0, y: 64, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_14', x: 32, y: 64, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_15', x: 64, y: 64, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_16', x: 96, y: 64, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_17', x: 128, y: 64, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_18', x: 160, y: 64, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_19', x: 192, y: 64, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_20', x: 224, y: 64, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_21', x: 256, y: 64, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_22', x: 288, y: 64, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_23', x: 320, y: 64, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_24', x: 352, y: 64, width: 32, height: 32, layer: 'above_floor' },

    { name: 'placeholder_25', x: 0, y: 96, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_26', x: 32, y: 96, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_27', x: 64, y: 96, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_28', x: 96, y: 96, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_29', x: 128, y: 96, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_30', x: 160, y: 96, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_31', x: 192, y: 96, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_32', x: 224, y: 96, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_33', x: 256, y: 96, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_34', x: 288, y: 96, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_35', x: 320, y: 96, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_36', x: 352, y: 96, width: 32, height: 32, layer: 'above_floor' },

    { name: 'placeholder_37', x: 0, y: 128, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_38', x: 32, y: 128, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_39', x: 64, y: 128, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_40', x: 96, y: 128, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_41', x: 128, y: 128, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_42', x: 160, y: 128, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_43', x: 192, y: 128, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_44', x: 224, y: 128, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_45', x: 256, y: 128, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_46', x: 288, y: 128, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_47', x: 320, y: 128, width: 32, height: 32, layer: 'above_floor' },
    { name: 'placeholder_48', x: 352, y: 128, width: 32, height: 32, layer: 'above_floor' },


]

const grasslandsSpriteSheetData = new SpriteSheetData(width, height, url, sprites)

export { grasslandsSpriteSheetData }