import React from 'react'
import SpecialTileItem from './SpecialTileItem'
import { Tool } from '@/utils/pixi/types'

type SpecialTilesProps = {
    selectTool: (tool: Tool) => void
    tool: Tool
}

const SpecialTiles:React.FC<SpecialTilesProps> = ({ selectTool, tool }) => {
    
    return (
        <div className='w-full flex flex-col items-center'>
            <SpecialTileItem>
                
            </SpecialTileItem>
        </div>
    )
}

export default SpecialTiles