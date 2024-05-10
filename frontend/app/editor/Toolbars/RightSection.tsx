import React, { useState } from 'react'
import TileMenu from '../TileMenu'
import Rooms from '../Rooms'
import { RealmData } from '@/utils/pixi/types'

type RightSectionProps = {
    selectedTile: string
    setSelectedTile: (tile: string) => void
    realmData: RealmData
}

type Tab = 'Tile' | 'Effects'
3
const RightSection:React.FC<RightSectionProps> = ({ selectedTile, setSelectedTile, realmData }) => {
    
    const [tab, setTab] = useState<Tab>('Tile')

    return (
        <div className='min-w-[370px] bg-secondary select-none'>
            <div className='flex flex-row h-10 px-2 pt-[4px]'>
                <div 
                    className={`grow bg-secondary hover:bg-secondaryhoverdark rounded-t-md cursor-pointer grid place-items-center select-none ${tab === 'Tile' ? 'pointer-events-none bg-secondaryhover' : ''}`}
                    onClick={() => setTab('Tile')}
                >
                    Tiles
                </div>
                <div 
                    className={`grow bg-secondary hover:bg-secondaryhoverdark rounded-t-md cursor-pointer grid place-items-center select-none ${tab === 'Effects' ? 'pointer-events-none bg-secondaryhover' : ''}`}
                    onClick={() => setTab('Effects')}
                >
                    Effects
                </div>
            </div>
            <div className='bg-secondaryhover h-[4px]'/>
            <div className='p-2'>
                {tab === 'Tile' && <TileMenu selectedTile={selectedTile} setSelectedTile={setSelectedTile}/>}
                {tab === 'Effects' && <div>Effects</div>}
            </div>
            <Rooms realmData={realmData}/>
        </div>
    )
}

export default RightSection