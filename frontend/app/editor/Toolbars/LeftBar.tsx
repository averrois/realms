'use client'
import React from 'react'
import ToolButton from './ToolButton'
import { HandRaisedIcon } from '@heroicons/react/24/outline'
import { Tool } from '@/utils/pixi/types'
import { MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon, Square2StackIcon } from '@heroicons/react/24/solid'

type LeftBarProps = {
    tool: Tool,
    selectTool: (tool:Tool) => void
}

const LeftBar:React.FC<LeftBarProps> = ({ tool, selectTool }) => {

    return (
        <div className='w-[48px] bg-secondary flex flex-col items-center p-1 gap-2'>
            <ToolButton selected={tool === 'Hand'} onClick={() => selectTool('Hand')}>
                <HandRaisedIcon className='h-8 w-8 text-white'/>
            </ToolButton>
            <ToolButton selected={tool === 'ZoomIn'} onClick={() => selectTool('ZoomIn')}>
                <MagnifyingGlassPlusIcon className='h-8 w-8 text-white'/>
            </ToolButton>
            <ToolButton selected={tool === 'ZoomOut'} onClick={() => selectTool('ZoomOut')}>
                <MagnifyingGlassMinusIcon className='h-8 w-8 text-white'/>
            </ToolButton>
            <ToolButton selected={tool === 'Tile'} onClick={() => selectTool('Tile')}>
                <Square2StackIcon className='h-8 w-8 text-white'/>
            </ToolButton>
        </div>
    )
}

export default LeftBar