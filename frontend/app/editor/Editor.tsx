'use client'
import React, { useState } from 'react'
import TopBar from './Toolbars/TopBar'
import LeftBar from './Toolbars/LeftBar'
import RightSection from './Toolbars/RightSection'
import PixiEditor from './PixiEditor'
import Coords from './Toolbars/Coords'
import { Tool } from '@/utils/pixi/types'
import signal from '@/utils/signal'

type EditorProps = {
    
}

const Editor:React.FC<EditorProps> = () => {
    
    const [tool, setTool] = useState<Tool>('None')

    function selectTool(tool:Tool) {
        setTool(tool)
        signal.emit('selectTool', tool)
    }

    return (
        <div className='relative w-full h-screen flex flex-col'>
            <TopBar />
            <div className='w-full grow flex flex-row'>
                <LeftBar tool={tool} selectTool={selectTool}/>
                <PixiEditor className='h-full grow'/>
                <RightSection />
            </div>
            <Coords />
        </div>
    )
}

export default Editor