'use client'
import React, { useState } from 'react'
import signal from '@/utils/signal'
import ToolButton from './ToolButton'
import { HandRaisedIcon } from '@heroicons/react/24/outline'
import { Tool } from '@/utils/pixi/types'

type LeftBarProps = {
    
}

const LeftBar:React.FC<LeftBarProps> = () => {
    
    const [tool, setTool] = useState<Tool>('None')

    function selectTool(tool:Tool) {
        setTool(tool)
        signal.emit('selectTool', tool)
    }

    return (
        <div className='w-[48px] bg-secondary flex flex-col items-center p-1'>
            <ToolButton selected={tool === 'Hand'} onClick={() => selectTool('Hand')}>
                <HandRaisedIcon className='h-8 w-8 text-white'/>
            </ToolButton>
        </div>
    )
}

export default LeftBar