import { TilePoint } from './types';

export type Coordinate = [number, number]

export function findPath(start: Coordinate, end: Coordinate, blocked: Set<TilePoint>): Coordinate[] | null {
    const directions = [
        [0, 1],  // right
        [1, 0],  // down
        [0, -1], // left
        [-1, 0]  // up
    ]
    
    function isBlocked(pos: Coordinate): boolean {
        return blocked.has(`${pos[0]}, ${pos[1]}`)
    }
    
    function isWithinBounds(pos: Coordinate): boolean {
        return pos[0] >= 0 && pos[1] >= 0;
    }

    const queue: [Coordinate, Coordinate[]][] = [[start, [start]]]
    const visited = new Set<string>()
    visited.add(`${start[0]}, ${start[1]}`)
    
    while (queue.length > 0) {
        const [current, path] = queue.shift()!;
        
        if (current[0] === end[0] && current[1] === end[1]) {
            return path.slice(1)
        }
        
        for (const [dx, dy] of directions) {
            const next: Coordinate = [current[0] + dx, current[1] + dy]
            
            if (isWithinBounds(next) && !isBlocked(next) && !visited.has(`${next[0]}, ${next[1]}`)) {
                visited.add(`${next[0]}, ${next[1]}`)
                queue.push([next, path.concat([next])])
            }
        }
    }
    
    return null
}