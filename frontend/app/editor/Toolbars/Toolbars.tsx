import React from 'react'
import TopBar from './TopBar'
import LeftBar from './LeftBar'
import RightSection from './RightSection'
import Coords from './Coords'

type ToolbarsProps = {
    
}

const Toolbars:React.FC<ToolbarsProps> = () => {
    
    return (
        <div className='relative w-full h-screen'>
            <TopBar />
            <LeftBar />
            <RightSection />
            <Coords />
        </div>
    )
}

export default Toolbars