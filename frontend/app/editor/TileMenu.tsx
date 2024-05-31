'use client'
import React, { useState } from 'react'
import PaletteDropdown from './PaletteDropdown'
import { SheetName } from '@/utils/pixi/spritesheet/spritesheet'
import TileMenuGrid from './TileMenuGrid'
import Rooms from './Rooms'

type TileMenuProps = {
    selectedTile: string,
    setSelectedTile: (tile: string) => void
    rooms: string[]
    setRooms: (rooms: string[]) => void
    roomIndex: number
    setRoomIndex: (index: number) => void
}

const menuItems: SheetName[] = ['ground', 'city']

const TileMenu:React.FC<TileMenuProps> = ({ selectedTile, setSelectedTile, rooms, setRooms, roomIndex, setRoomIndex }) => {

    const [selectedPalette, setSelectedPalette] = useState<SheetName>(menuItems[0])
    
    return (
        <div className='flex flex-col items-center gap-2 p-2'>
            <div className='flex flex-row items-center justify-between w-full'>
                Palette
                <PaletteDropdown menuItems={menuItems} selectedItem={selectedPalette} setSelectedItem={setSelectedPalette}/>
            </div>
            <TileMenuGrid selectedPalette={selectedPalette} selectedTile={selectedTile} setSelectedTile={setSelectedTile}/>
            <Rooms 
                rooms={rooms}
                setRooms={setRooms}
                roomIndex={roomIndex}
                setRoomIndex={setRoomIndex}
            />
        </div>  
    )
}

export default TileMenu