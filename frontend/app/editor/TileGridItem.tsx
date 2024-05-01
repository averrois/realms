'use client'
import React, { useEffect, useRef } from 'react'
import { TileMenuApp } from '@/utils/pixi/TileMenuApp'
import { SheetName } from '@/utils/pixi/spritesheet/spritesheet'
import { sprites } from '@/utils/pixi/spritesheet/spritesheet'

type TileGridItemProps = {
    sheetName: SheetName
    sprite: string
    selected: boolean
    onClick: () => void
}

const TileGridItem: React.FC<TileGridItemProps> = ({ sheetName, sprite, selected, onClick }) => {
    
    const src = sprites.spriteSheetDataSet[sheetName].url
    const { x, y, width, height } = sprites.spriteSheetDataSet[sheetName].sprites[sprite]
    const spriteWidth = sprites.spriteSheetDataSet[sheetName].width // Width of the whole sprite sheet
    const spriteHeight = sprites.spriteSheetDataSet[sheetName]. height // Height of the whole sprite sheet

    // Correctly calculate the scale of the background image to fit all sprites.
    const scaleX = spriteWidth / width;
    const scaleY = spriteHeight / height;

    return (
        <div className={`w-full aspect-square hover:bg-secondaryhover cursor-pointer rounded-lg flex flex-col items-center justify-center gap-4 ${selected ? 'bg-secondaryhover' : ''}`} onClick={onClick}>
            <div style={{
                backgroundImage: `url(${src})`,
                backgroundPosition: `-${x}px -${y}px`,
                backgroundSize: `${scaleX * 100}% ${scaleY * 100}%`,
                width: `${width}px`,
                height: `${height}px`
            }}></div>
            
            <p className='text-sm'>{sprite}</p>
        </div>
    )
}

export default TileGridItem
