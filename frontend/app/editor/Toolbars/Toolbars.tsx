import React from 'react'
import TopBar from './TopBar'
import LeftBar from './LeftBar'
import RightSection from './RightSection'

type ToolbarsProps = {
    
}

const Toolbars:React.FC<ToolbarsProps> = () => {
    
    return (
        <div>
            <TopBar />
            <LeftBar />
            <RightSection />
        </div>
    )
}

export default Toolbars