import React from 'react'
import TopBar from './Toolbars/TopBar'
import LeftBar from './Toolbars/LeftBar'
import RightSection from './Toolbars/RightSection'
import PixiEditor from './PixiEditor'
import Coords from './Toolbars/Coords'

type EditorProps = {
    
}

const Editor:React.FC<EditorProps> = () => {
    
    return (
        <div className='relative w-full h-screen flex flex-col'>
            <TopBar />
            <div className='w-full grow flex flex-row'>
                <LeftBar />
                <PixiEditor className='h-full grow'/>
                <RightSection />
            </div>
            <Coords />
        </div>
    )
}

export default Editor