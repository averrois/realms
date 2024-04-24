export type BasicTile = 'None'

export type TileMap = BasicTile[][]

export const getDefaultTileMap = (): TileMap => {
    return Array(100).fill(Array(100).fill('None'));
}