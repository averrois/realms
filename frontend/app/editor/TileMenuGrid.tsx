'use client'
import React, { useEffect, useState } from 'react'
import TileGridItem from './TileGridItem'
import { SheetName, sprites } from '@/utils/pixi/spritesheet/spritesheet'
import signal from '@/utils/signal'

type TileMenuGridProps = {
    selectedPalette: SheetName
    selectedTile: string
    setSelectedTile: (tile: string) => void
}

const TileMenuGrid:React.FC<TileMenuGridProps> = ({ selectedPalette, selectedTile, setSelectedTile }) => {

    const [loading, setLoading] = useState<boolean>(true)
    
    useEffect(() => {
        const load = async () => {
            setLoading(true)
            await sprites.load(selectedPalette)
            setLoading(false)
        }
        load()
    }, [selectedPalette])

    return (
        <div className='w-full h-[400px] overflow-y-scroll border-b-2 border-primary pb-2 transparent-scrollbar'>
            {!loading && (
                <div className='grid grid-cols-3 w-full gap-2 pt-2'>
                    {Object.entries(sprites.spriteSheetDataSet[selectedPalette].sprites).map(([spriteName, spriteData], index) => {
                        return <TileGridItem sheetName={selectedPalette} sprite={spriteName} selected={selectedTile === spriteName} onClick={() => setSelectedTile(spriteName)} key={index}/>
                    })}
                </div>
            )}
        </div>
        
    )
}

export default TileMenuGrid