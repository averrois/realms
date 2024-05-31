import { SpriteSheetData } from './spritesheet'

export const groundSpriteSheetData: SpriteSheetData = {
    width: 768,
    height: 384,
    url: '/sprites/spritesheets/ground.png',
    sprites: {
        tl_lgrass_trans: { x: 0, y: 0, width: 32, height: 32, layer: 'transition' },
        t_lgrass_trans: { x: 32, y: 0, width: 32, height: 32, layer: 'transition' },
        tr_lgrass_trans: { x: 64, y: 0, width: 32, height: 32, layer: 'transition' },
        l_lgrass_trans: { x: 0, y: 32, width: 32, height: 32, layer: 'transition' },
        light_solid_grass: { x: 32, y: 32, width: 32, height: 32 },
        r_lgrass_trans: { x: 64, y: 32, width: 32, height: 32, layer: 'transition' },
        bl_lgrass_trans: { x: 0, y: 64, width: 32, height: 32, layer: 'transition' },
        b_lgrass_trans: { x: 32, y: 64, width: 32, height: 32, layer: 'transition' },
        br_lgrass_trans: { x: 64, y: 64, width: 32, height: 32, layer: 'transition' },
    }
}