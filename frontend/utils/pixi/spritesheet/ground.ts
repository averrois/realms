import LeftBar from '@/app/editor/Toolbars/LeftBar'
import { SpriteSheetData } from './spritesheet'

export const groundSpriteSheetData: SpriteSheetData = {
    width: 768,
    height: 384,
    url: '/sprites/spritesheets/ground.png',
    sprites: {
        // * Light Grass
        top_left_outer_light_grass: { x: 0, y: 0, width: 32, height: 32, layer: 'transition' },
        top_outer_light_grass: { x: 32, y: 0, width: 32, height: 32, layer: 'transition' },
        top_right_outer_light_grass: { x: 64, y: 0, width: 32, height: 32, layer: 'transition' },
        left_outer_light_grass: { x: 0, y: 32, width: 32, height: 32, layer: 'transition' },
        light_solid_grass: { x: 32, y: 32, width: 32, height: 32 },
        right_outer_light_grass: { x: 64, y: 32, width: 32, height: 32, layer: 'transition' },
        bottom_left_outer_light_grass: { x: 0, y: 64, width: 32, height: 32, layer: 'transition' },
        bottom_outer_light_grass: { x: 32, y: 64, width: 32, height: 32, layer: 'transition' },
        bottom_right_outer_light_grass: { x: 64, y: 64, width: 32, height: 32, layer: 'transition' },

        top_left_inner_corner_light_grass: { x: 96, y: 0, width: 32, height: 32, layer: 'transition' },
        top_inner_corner_light_grass: { x: 128, y: 0, width: 32, height: 32, layer: 'transition' },
        top_right_inner_corner_light_grass: { x: 160, y: 0, width: 32, height: 32, layer: 'transition' },
        left_inner_corner_light_grass: { x: 96, y: 32, width: 32, height: 32, layer: 'transition' },
        light_solid_grass1: { x: 32, y: 32, width: 32, height: 32 },
        right_inner_corner_light_grass: { x: 160, y: 32, width: 32, height: 32, layer: 'transition' },
        bottom_left_inner_corner_light_grass: { x: 96, y: 64, width: 32, height: 32, layer: 'transition' },
        bottom_inner_corner_light_grass: { x: 128, y: 64, width: 32, height: 32, layer: 'transition' },
        bottom_right_inner_corner_light_grass: { x: 160, y: 64, width: 32, height: 32, layer: 'transition' },

        bl_tr_corners_light_grass: { x: 288, y: 96, width: 32, height: 32, layer: 'transition' },

        top_left_corner_light_grass: { x: 208, y: 16, width: 32, height: 32, layer: 'transition' },
        top_right_corner_light_grass: { x: 240, y: 16, width: 32, height: 32, layer: 'transition' },

        tl_br_corners_light_grass: { x: 352, y: 96, width: 32, height: 32, layer: 'transition' },

        bottom_left_corner_light_grass: { x: 208, y: 48, width: 32, height: 32, layer: 'transition' },
        bottom_right_corner_light_grass: { x: 240, y: 48, width: 32, height: 32, layer: 'transition' },

        top_left_inner_curve_light_grass: { x: 288, y: 0, width: 32, height: 32, layer: 'transition' },
        top_inner_curve_light_grass: { x: 320, y: 0, width: 32, height: 32, layer: 'transition' },
        top_right_inner_curve_light_grass: { x: 352, y: 0, width: 32, height: 32, layer: 'transition' },
        left_inner_curve_light_grass: { x: 288, y: 32, width: 32, height: 32, layer: 'transition' },
        light_solid_grass2: { x: 32, y: 32, width: 32, height: 32 },
        right_inner_curve_light_grass: { x: 352, y: 32, width: 32, height: 32, layer: 'transition' },
        bottom_left_inner_curve_light_grass: { x: 288, y: 64, width: 32, height: 32, layer: 'transition' },
        bottom_inner_curve_light_grass: { x: 320, y: 64, width: 32, height: 32, layer: 'transition' },
        bottom_right_inner_curve_light_grass: { x: 352, y: 64, width: 32, height: 32, layer: 'transition' },

        // * Vibrant grass
        top_left_outer_vibrant_grass: { x: 384, y: 0, width: 32, height: 32, layer: 'transition' },
        top_outer_vibrant_grass: { x: 416, y: 0, width: 32, height: 32, layer: 'transition' },
        top_right_outer_vibrant_grass: { x: 448, y: 0, width: 32, height: 32, layer: 'transition' },
        left_outer_vibrant_grass: { x: 384, y: 32, width: 32, height: 32, layer: 'transition' },
        vibrant_solid_grass: { x: 416, y: 32, width: 32, height: 32 },
        right_outer_vibrant_grass: { x: 448, y: 32, width: 32, height: 32, layer: 'transition' },
        bottom_left_outer_vibrant_grass: { x: 384, y: 64, width: 32, height: 32, layer: 'transition' },
        bottom_outer_vibrant_grass: { x: 416, y: 64, width: 32, height: 32, layer: 'transition' },
        bottom_right_outer_vibrant_grass: { x: 448, y: 64, width: 32, height: 32, layer: 'transition' },

        top_left_inner_corner_vibrant_grass: { x: 480, y: 0, width: 32, height: 32, layer: 'transition' },
        top_inner_corner_vibrant_grass: { x: 512, y: 0, width: 32, height: 32, layer: 'transition' },
        top_right_inner_corner_vibrant_grass: { x: 544, y: 0, width: 32, height: 32, layer: 'transition' },
        left_inner_corner_vibrant_grass: { x: 480, y: 32, width: 32, height: 32, layer: 'transition' },
        vibrant_solid_grass1: { x: 416, y: 32, width: 32, height: 32 },
        right_inner_corner_vibrant_grass: { x: 544, y: 32, width: 32, height: 32, layer: 'transition' },
        bottom_left_inner_corner_vibrant_grass: { x: 480, y: 64, width: 32, height: 32, layer: 'transition' },
        bottom_inner_corner_vibrant_grass: { x: 512, y: 64, width: 32, height: 32, layer: 'transition' },
        bottom_right_inner_corner_vibrant_grass: { x: 544, y: 64, width: 32, height: 32, layer: 'transition' },

        bl_tr_corners_vibrant_grass: { x: 672, y: 96, width: 32, height: 32, layer: 'transition' },

        top_left_corner_vibrant_grass: { x: 592, y: 16, width: 32, height: 32, layer: 'transition' },
        top_right_corner_vibrant_grass: { x: 624, y: 16, width: 32, height: 32, layer: 'transition' },

        tl_br_corners_vibrant_grass: { x: 736, y: 96, width: 32, height: 32, layer: 'transition' },

        bottom_left_corner_vibrant_grass: { x: 592, y: 48, width: 32, height: 32, layer: 'transition' },
        bottom_right_corner_vibrant_grass: { x: 624, y: 48, width: 32, height: 32, layer: 'transition' },

        top_left_inner_curve_vibrant_grass: { x: 672, y: 0, width: 32, height: 32, layer: 'transition' },
        top_inner_curve_vibrant_grass: { x: 704, y: 0, width: 32, height: 32, layer: 'transition' },
        top_right_inner_curve_vibrant_grass: { x: 736, y: 0, width: 32, height: 32, layer: 'transition' },
        left_inner_curve_vibrant_grass: { x: 672, y: 32, width: 32, height: 32, layer: 'transition' },
        vibrant_solid_grass2: { x: 416, y: 32, width: 32, height: 32 },
        right_inner_curve_vibrant_grass: { x: 736, y: 32, width: 32, height: 32, layer: 'transition' },
        bottom_left_inner_curve_vibrant_grass: { x: 672, y: 64, width: 32, height: 32, layer: 'transition' },
        bottom_inner_curve_vibrant_grass: { x: 704, y: 64, width: 32, height: 32, layer: 'transition' },
        bottom_right_inner_curve_vibrant_grass: { x: 736, y: 64, width: 32, height: 32, layer: 'transition' },
         
    }
}