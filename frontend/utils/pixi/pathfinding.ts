import { TilePoint, Coordinate } from './types'

export function bfs(start: Coordinate, end: Coordinate, blocked: Set<TilePoint>): Coordinate[] | null {
    const directions: Coordinate[] = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ]

    const queue: [Coordinate, Coordinate[]][] = [[start, [start]]]
    const visited = new Set<TilePoint>(blocked)
    visited.add(`${start[0]}, ${start[1]}`)

    while (queue.length > 0) {
        const [currentPos, path] = queue.shift()!;
        const [x, y] = currentPos

        if (x === end[0] && y === end[1]) {
            return path.slice(1)
        }

        for (const [dx, dy] of directions) {
            const nextPos: Coordinate = [x + dx, y + dy];
            const nextPosStr = `${nextPos[0]}, ${nextPos[1]}` as TilePoint
            if (!visited.has(nextPosStr)) {
                visited.add(nextPosStr)
                queue.push([nextPos, path.concat([nextPos])])
            }
        }
    }

    return null
}