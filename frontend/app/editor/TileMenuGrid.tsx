'use client'
import React, { useEffect, useState } from 'react'
import TileGridItem from './TileGridItem'
import { SheetName, sprites } from '@/utils/pixi/spritesheet/spritesheet'
import { TileWithPalette } from './Editor'

type TileMenuGridProps = {
    selectedPalette: SheetName
    selectedTile: TileWithPalette
    setSelectedTile: (tile: TileWithPalette) => void
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
                    {sprites.spriteSheetDataSet[selectedPalette].spritesList.map((spriteData, index) => {
                        return <TileGridItem sheetName={selectedPalette} spriteName={spriteData.name} selected={selectedTile.name === spriteData.name && selectedTile.palette === selectedPalette} onClick={() => setSelectedTile({ name: spriteData.name, palette: selectedPalette })} key={index}/>
                    })}
                </div>
            )}
        </div>
        
    )
}

export default TileMenuGrid