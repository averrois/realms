import { SpriteSheetData } from './spritesheet'

export const groundSpriteSheetData: SpriteSheetData = {
    width: 768,
    height: 384,
    url: '/sprites/spritesheets/ground.png',
    sprites: {
        top_left_outer_light_grass: { x: 0, y: 0, width: 32, height: 32, layer: 'transition' },
        top_outer_light_grass: { x: 32, y: 0, width: 32, height: 32, layer: 'transition' },
        top_right_outer_light_grass: { x: 64, y: 0, width: 32, height: 32, layer: 'transition' },
        left_outer_light_grass: { x: 0, y: 32, width: 32, height: 32, layer: 'transition' },
        light_solid_grass: { x: 32, y: 32, width: 32, height: 32 },
        right_outer_light_grass: { x: 64, y: 32, width: 32, height: 32, layer: 'transition' },
        bottom_left_outer_light_grass: { x: 0, y: 64, width: 32, height: 32, layer: 'transition' },
        bottom_outer_light_grass: { x: 32, y: 64, width: 32, height: 32, layer: 'transition' },
        bottom_right_outer_light_grass: { x: 64, y: 64, width: 32, height: 32, layer: 'transition' },

        top_left_inner_light_grass: { x: 96, y: 0, width: 32, height: 32, layer: 'transition' },
        top_inner_light_grass: { x: 128, y: 0, width: 32, height: 32, layer: 'transition' },
        top_right_inner_light_grass: { x: 160, y: 0, width: 32, height: 32, layer: 'transition' },
        left_inner_light_grass: { x: 96, y: 32, width: 32, height: 32, layer: 'transition' },
        light_solid_grass1: { x: 32, y: 32, width: 32, height: 32 },
        right_inner_light_grass: { x: 160, y: 32, width: 32, height: 32, layer: 'transition' },
        bottom_left_inner_light_grass: { x: 96, y: 64, width: 32, height: 32, layer: 'transition' },
        bottom_inner_light_grass: { x: 128, y: 64, width: 32, height: 32, layer: 'transition' },
        bottom_right_inner_light_grass: { x: 160, y: 64, width: 32, height: 32, layer: 'transition' },

        bl_tr_corners_light_grass: { x: 288, y: 96, width: 32, height: 32, layer: 'transition' },

        top_left_corner_light_grass: { x: 208, y: 16, width: 32, height: 32, layer: 'transition' },
        top_right_corner_light_grass: { x: 240, y: 16, width: 32, height: 32, layer: 'transition' },

        tl_br_corners_light_grass: { x: 352, y: 96, width: 32, height: 32, layer: 'transition' },

        bottom_left_corner_light_grass: { x: 208, y: 48, width: 32, height: 32, layer: 'transition' },
        bottom_right_corner_light_grass: { x: 240, y: 48, width: 32, height: 32, layer: 'transition' },

        
    }
}