'use client'
import React, { useEffect, useRef } from 'react'
import { TileMenuApp } from '@/utils/pixi/TileMenuApp'
import { SheetName } from '@/utils/pixi/spritesheet/spritesheet'

type TileGridItemProps = {
    sheetName: SheetName
    sprite: string
    selected: boolean
    onClick: () => void
}

const TileGridItem:React.FC<TileGridItemProps> = ({ sheetName, sprite, selected, onClick }) => {
    
    const appRef = useRef<TileMenuApp | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const mount = async () => {
            const app = new TileMenuApp()
            appRef.current = app
            await app.init(containerRef.current!, sheetName, sprite)

            const pixiApp = app.getApp()
            
            containerRef.current!.appendChild(pixiApp.canvas)
        }

        if (!appRef.current) {
            mount()
        }
        
        return () => {
            if (appRef.current) {
                appRef.current.destroy()
            }
        }
    }, [])

    return (
        <div className={`w-full aspect-square hover:bg-secondaryhover cursor-pointer rounded-lg flex flex-col items-center ${selected ? 'bg-secondaryhover' : ''}`} onClick={onClick}>
            <div ref={containerRef} className='grow w-full'></div>
            <p className='text-sm'>{sprite}</p>
        </div>
    )
}

export default TileGridItem