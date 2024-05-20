import React, { useState, useEffect } from 'react'
import SpecialTileItem from './SpecialTileItem'
import { SpecialTile, Tool } from '@/utils/pixi/types'
import { Placeholder } from '@phosphor-icons/react'
import signal from '@/utils/signal'

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
        </div>
    )
}

export default SpecialTiles