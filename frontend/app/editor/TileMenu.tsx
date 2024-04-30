'use client'
import React, { useState } from 'react'
import PaletteDropdown from './PaletteDropdown'
import { SheetName } from '@/utils/pixi/spritesheet/spritesheet'
import TileMenuGrid from './TileMenuGrid'

type TileMenuProps = {
    selectedTile: string,
    setSelectedTile: (tile: string) => void
}

const menuItems: SheetName[] = ['city']

const TileMenu:React.FC<TileMenuProps> = ({ selectedTile, setSelectedTile }) => {

    const [selectedPalette, setSelectedPalette] = useState<SheetName>('city')
    
    return (
        <div className='flex flex-col items-center'>
            <div className='flex flex-row items-center justify-between w-full'>
                Palette
                <PaletteDropdown menuItems={menuItems} selectedItem={selectedPalette} setSelectedItem={setSelectedPalette}/>
            </div>
            <TileMenuGrid selectedPalette={selectedPalette} selectedTile={selectedTile} setSelectedTile={setSelectedTile}/>
        </div>  
    )
}

export default TileMenu