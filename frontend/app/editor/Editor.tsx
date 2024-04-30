'use client'
import React, { useState, useEffect } from 'react'
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
    const [selectedTile, setSelectedTile] = useState<string>('')
    const [gameLoaded, setGameLoaded] = useState<boolean>(false)

    function selectTool(tool:Tool) {
        // do not allow tool selection if game not loaded
        if (gameLoaded === false) return

        setTool(tool)
        setSelectedTile('')
        signal.emit('selectTool', tool)
    }

    useEffect(() => {
        const onTileSelected = () => {
            setTool('Tile')
        }

        signal.on('tileSelected', onTileSelected)

        return () => {
            signal.off('newTool', onTileSelected)
        }
    }, [])

    return (
        <div className='relative w-full h-screen flex flex-col'>
            <TopBar />
            <div className='w-full grow flex flex-row'>
                <LeftBar tool={tool} selectTool={selectTool}/>
                <PixiEditor className='h-full grow' setGameLoaded={setGameLoaded}/>
                <RightSection selectedTile={selectedTile} setSelectedTile={setSelectedTile}/>
            </div>
            <Coords />
        </div>
    )
}

export default Editor