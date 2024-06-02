'use client'
import React from 'react'
import PaletteDropdown from './PaletteDropdown'
import { SheetName } from '@/utils/pixi/spritesheet/spritesheet'
import TileMenuGrid from './TileMenuGrid'
import Rooms from './Rooms'
import { TileWithPalette } from './Editor'

type TileMenuProps = {
    selectedTile: TileWithPalette,
    setSelectedTile: (tile: TileWithPalette) => void
    rooms: string[]
    setRooms: (rooms: string[]) => void
    roomIndex: number
    setRoomIndex: (index: number) => void
    palettes: SheetName[]
    selectedPalette: SheetName
    setSelectedPalette: (palette: SheetName) => void
}


const TileMenu:React.FC<TileMenuProps> = ({ selectedTile, setSelectedTile, rooms, setRooms, roomIndex, setRoomIndex, palettes, selectedPalette, setSelectedPalette }) => {

    return (
        <div className='flex flex-col items-center gap-2 p-2'>
            <div className='flex flex-row items-center justify-between w-full'>
                Palette
                <PaletteDropdown palettes={palettes} selectedItem={selectedPalette} setSelectedItem={setSelectedPalette}/>
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