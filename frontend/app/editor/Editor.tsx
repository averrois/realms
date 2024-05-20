'use client'
import React, { useState, useEffect } from 'react'
import TopBar from './Toolbars/TopBar'
import LeftBar from './Toolbars/LeftBar'
import RightSection from './Toolbars/RightSection'
import PixiEditor from './PixiEditor'
import Coords from './Toolbars/Coords'
import { RealmData, Tool, TileMode, SpecialTile } from '@/utils/pixi/types'
import signal from '@/utils/signal'

type EditorProps = {
    realmData: RealmData
}

const Editor:React.FC<EditorProps> = ({ realmData }) => {
    
    const [tool, setTool] = useState<Tool>('None')
    const [tileMode, setTileMode] = useState<TileMode>('Single')
    const [selectedTile, setSelectedTile] = useState<string>('')
    const [gameLoaded, setGameLoaded] = useState<boolean>(false)
    const [specialTile, setSpecialTile] = useState<SpecialTile>('None')

    function selectTool(tool:Tool) {
        // do not allow tool selection if game not loaded
        if (gameLoaded === false) return

        setTool(tool)
        setSelectedTile('')
        signal.emit('selectTool', tool)
    }

    function selectTileMode(mode: TileMode) {
        if (gameLoaded === false) return

        setTileMode(mode)
        signal.emit('selectTileMode', mode)
    }

    function selectSpecialTile(specialTile: SpecialTile) {
        if (gameLoaded === false) return

        setSpecialTile(specialTile)
        setTool('Tile')
        signal.emit('selectSpecialTile', specialTile)
    }

    function selectTile(tile: string) {
        if (gameLoaded === false) return

        setSelectedTile(tile)
        signal.emit('tileSelected', tile)
    }

    useEffect(() => {
        const onResetSpecialTileMode = () => {
            setSpecialTile('None')
        }
        const onTileSelected = () => {
            setTool('Tile')
        }

        signal.on('tileSelected', onTileSelected)
        signal.on('resetSpecialTileMode', onResetSpecialTileMode)

        return () => {
            signal.off('resetSpecialTileMode', onResetSpecialTileMode)
            signal.off('resetSpecialTileMode', onResetSpecialTileMode)
        }
    }, [])

    return (
        <div className='relative w-full h-screen flex flex-col'>
            <TopBar />
            <div className='w-full grow flex flex-row'>
                <LeftBar tool={tool} tileMode={tileMode} selectTool={selectTool} selectTileMode={selectTileMode} specialTile={specialTile}/>
                <PixiEditor className='h-full grow' setGameLoaded={setGameLoaded} realmData={realmData}/>
                <RightSection selectedTile={selectedTile} setSelectedTile={selectTile} realmData={realmData} specialTile={specialTile} selectSpecialTile={selectSpecialTile}/>
            </div>
            <Coords />
        </div>
    )
}

export default Editor