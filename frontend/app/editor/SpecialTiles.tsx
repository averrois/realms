import React from 'react'
import SpecialTileItem from './SpecialTileItem'
import { SpecialTile } from '@/utils/pixi/types'
import { Placeholder, FlyingSaucer } from '@phosphor-icons/react'

type SpecialTilesProps = {
    specialTile: SpecialTile
    selectSpecialTile: (specialTile: SpecialTile) => void
}

const SpecialTiles:React.FC<SpecialTilesProps> = ({ specialTile, selectSpecialTile }) => {


    return (
        <div className='w-full flex flex-col items-center'>
            <SpecialTileItem 
                iconColor='red' 
                title='Impassable' 
                description='Specify tiles that cannot be walked on.' 
                selected={specialTile === 'Impassable'} 
                onClick={() => selectSpecialTile('Impassable')}>
                <Placeholder className='w-12 h-12'/>
            </SpecialTileItem>
            <SpecialTileItem 
                iconColor='blue' 
                title='Teleport' 
                description='Set up a one-way teleporter between tiles.' 
                selected={specialTile === 'Teleport'} 
                onClick={() => selectSpecialTile('Teleport')}>
                <FlyingSaucer className='w-12 h-12'/>
            </SpecialTileItem>
        </div>
    )
}

export default SpecialTiles