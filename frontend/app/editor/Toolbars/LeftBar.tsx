'use client'
import React from 'react'
import ToolButton from './ToolButton'
import { HandRaisedIcon } from '@heroicons/react/24/outline'
import { Tool, TileMode } from '@/utils/pixi/types'
import { MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon } from '@heroicons/react/24/solid'
import { Eraser } from '@phosphor-icons/react'
import { GridFour, Square } from '@phosphor-icons/react'

type LeftBarProps = {
    tool: Tool,
    tileMode: TileMode,
    selectTool: (tool:Tool) => void
    selectTileMode: (mode: TileMode) => void
}

const LeftBar:React.FC<LeftBarProps> = ({ tool, tileMode, selectTool, selectTileMode }) => {

    return (
        <div className='w-[48px] bg-secondary flex flex-col items-center py-1 gap-2'>
            <ToolButton selected={tool === 'Hand'} onClick={() => selectTool('Hand')}>
                <HandRaisedIcon className='h-8 w-8 text-white'/>
            </ToolButton>
            <ToolButton selected={tool === 'ZoomIn'} onClick={() => selectTool('ZoomIn')}>
                <MagnifyingGlassPlusIcon className='h-8 w-8 text-white'/>
            </ToolButton>
            <ToolButton selected={tool === 'ZoomOut'} onClick={() => selectTool('ZoomOut')}>
                <MagnifyingGlassMinusIcon className='h-8 w-8 text-white'/>
            </ToolButton>
            <ToolButton selected={tool === 'Eraser'} onClick={() => selectTool('Eraser')}>
                <Eraser className='h-8 w-8'/>
            </ToolButton>
            <div className='w-full h-[2px] bg-black'/>
            <ToolButton selected={tileMode === 'Single'} onClick={() => selectTileMode('Single')}>
                <Square className='h-8 w-8'/>
            </ToolButton>
            <ToolButton selected={tileMode === 'Rectangle'} onClick={() => selectTileMode('Rectangle')}>
                <GridFour className='h-8 w-8'/>
            </ToolButton>
        </div>
    )
}

export default LeftBar