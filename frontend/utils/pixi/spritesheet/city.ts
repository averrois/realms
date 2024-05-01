import { SpriteSheetData } from './spritesheet'

export const citySpriteSheetData: SpriteSheetData = {
    width: 1024,
    height: 1536,
    url: '/sprites/city/FDR_City.png',
    sprites: {
        light_solid_grass: { x: 32, y: 0, width: 32, height: 32 },
        light_detailed_grass: { x: 64, y: 0, width: 32, height: 32 },
        dark_solid_grass: { x: 96, y: 0, width: 32, height: 32 },
        dark_detailed_grass: { x: 128, y: 0, width: 32, height: 32 },
        solid_dirt: { x: 160, y: 0, width: 32, height: 32 },
        detailed_dirt: { x: 192, y: 0, width: 32, height: 32 },
        solid_sand: { x: 224, y: 0, width: 32, height: 32 },
        detailed_sand: { x: 256, y: 0, width: 32, height: 32 },
        light_concrete: { x: 288, y: 0, width: 32, height: 32 },
        dark_concrete: { x: 320, y: 0, width: 32, height: 32 },
        sign: { x: 512, y: 0, width: 32, height: 32, layer: 'object' }
    }
}