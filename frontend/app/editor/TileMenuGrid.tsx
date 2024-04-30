'use client'
import React, { useEffect, useState } from 'react'
import TileGridItem from './TileGridItem'
import { SheetName, sprites } from '@/utils/pixi/spritesheet/spritesheet'

type TileMenuGridProps = {
    selectedPalette: SheetName
}

const TileMenuGrid:React.FC<TileMenuGridProps> = ({ selectedPalette }) => {

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
        <div className='w-full'>
            {!loading && (
                <div className='grid grid-cols-3 w-full gap-2 pt-2'>
                    <TileGridItem />
                </div>
            )}
        </div>
        
    )
}

export default TileMenuGrid