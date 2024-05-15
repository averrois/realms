'use client'
import React, { useState } from 'react'
import PaletteDropdown from './PaletteDropdown'
import { SheetName } from '@/utils/pixi/spritesheet/spritesheet'
import TileMenuGrid from './TileMenuGrid'
import Rooms from './Rooms'
import { RealmData } from '@/utils/pixi/types'

type TileMenuProps = {
    selectedTile: string,
    setSelectedTile: (tile: string) => void
    realmData: RealmData
}

const menuItems: SheetName[] = ['city']

const TileMenu:React.FC<TileMenuProps> = ({ selectedTile, setSelectedTile, realmData }) => {

    const [selectedPalette, setSelectedPalette] = useState<SheetName>('city')
    
    return (
        <div className='flex flex-col items-center gap-2'>
            <div className='flex flex-row items-center justify-between w-full'>
                Palette
                <PaletteDropdown menuItems={menuItems} selectedItem={selectedPalette} setSelectedItem={setSelectedPalette}/>
            </div>
            <TileMenuGrid selectedPalette={selectedPalette} selectedTile={selectedTile} setSelectedTile={setSelectedTile}/>
            <Rooms realmData={realmData}/>
        </div>  
    )
}

export default TileMenu