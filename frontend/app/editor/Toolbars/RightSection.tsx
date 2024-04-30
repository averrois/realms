import React, { useState } from 'react'

type RightSectionProps = {
    
}

type Tab = 'Tile' | 'Effects'

const RightSection:React.FC<RightSectionProps> = () => {
    
    const [tab, setTab] = useState<Tab>('Tile')

    return (
        <div className='min-w-[300px] bg-secondary'>
            <div className='flex flex-row h-10 px-2 pt-[4px]'>
                <div 
                    className={`grow bg-secondary hover:bg-secondaryhoverdark rounded-t-md cursor-pointer grid place-items-center ${tab === 'Tile' ? 'pointer-events-none bg-secondaryhover' : ''}`}
                    onClick={() => setTab('Tile')}
                >
                    Tiles
                </div>
                <div 
                    className={`grow bg-secondary hover:bg-secondaryhoverdark rounded-t-md cursor-pointer grid place-items-center ${tab === 'Effects' ? 'pointer-events-none bg-secondaryhover' : ''}`}
                    onClick={() => setTab('Effects')}
                >
                    Effects
                </div>
            </div>
            <div className='bg-secondaryhover h-[4px]'/>
        </div>
    )
}

export default RightSection