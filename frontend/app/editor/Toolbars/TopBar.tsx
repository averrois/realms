import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import React from 'react'

type TopBarProps = {
    
}

const TopBar:React.FC<TopBarProps> = () => {
    
    return (
        <div className='w-full h-[48px] bg-secondary flex flex-row items-center p-2 border-b-2 border-black'>
            <div className='hover:bg-secondaryhover aspect-square grid place-items-center rounded-lg p-1'>
                <Link href={'/app'}>
                    <ArrowLeftEndOnRectangleIcon className='h-8 w-8 text-white'/>
                </Link>
            </div>
        </div>
    )
}

export default TopBar