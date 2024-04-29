export interface SpriteSheetTile {
    name: string,
    x: number,
    y: number,
    width: number,
    height: number
}

export interface SpriteSheetData {
    width: number,
    height: number,
    url: string,
    sprites: SpriteSheetTile[],
}

export function getSpriteSheetData(data: SpriteSheetData) {
    const spriteSheetData = {
        frames: {} as any,
        meta: {
            image: data.url,
            size: {
                w: data.width,
                h: data.height
            },
            format: 'RGBA8888',
            scale: 1
        },
        animations: {}
    }

    for (const sprite of data.sprites) {
        spriteSheetData.frames[sprite.name] = {
            frame: {
                x: sprite.x,
                y: sprite.y,
                w: sprite.width,
                h: sprite.height
            },
            spriteSourceSize: {
                x: 0,
                y: 0,
                w: sprite.width,
                h: sprite.height
            },
            sourceSize: {
                w: sprite.width,
                h: sprite.height
            }
        }
    }

    return spriteSheetData
}   