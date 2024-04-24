'use client'
import React from 'react'
import ToolButton from './ToolButton'
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/solid'
import DynamicLink from '@/components/DynamicLink'

type ToolbarsProps = {
    
}

const Toolbars:React.FC<ToolbarsProps> = () => {
    
    return (
        <div>
            <div className='w-full h-[48px] pl-[48px] bg-secondary absolute top-0'>

            </div>
            <div className='h-screen w-[48px] bg-secondary absolute left-0 flex flex-col items-center p-1'>
                <div className='hover:bg-secondaryhover w-full aspect-square grid place-items-center rounded-lg'>
                    <DynamicLink href={'/app'}>
                        <ArrowLeftEndOnRectangleIcon className='h-8 w-8 text-white'/>
                    </DynamicLink>
                </div>
            </div>
        </div>
    )
}

export default Toolbars