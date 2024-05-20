import { Tool } from '@/utils/pixi/types'
import React from 'react'

type SpecialTileItemProps = {
    children: React.ReactNode
    iconColor: 'red' | 'blue' | 'green' | 'yellow'
    title: string,
    description: string
    selected: boolean
    onClick: () => void
}

const SpecialTileItem:React.FC<SpecialTileItemProps> = ({ children, iconColor, title, description, selected, onClick }) => {
    
    function getColorClassName() {
        switch (iconColor) {
            case 'red':
                return 'bg-red-500'
            case 'blue':
                return 'bg-blue-500'
            case 'green':
                return 'bg-green-500'
            case 'yellow':
                return 'bg-yellow-500'
        }
    }

    return (
        <div className={`${selected ? 'bg-secondaryhover' : ''} w-full h-24 flex flex-row items-center justify-center gap-4 p-8 hover:bg-secondaryhover cursor-pointer`} onClick={onClick}>
            <div className={`${getColorClassName()} rounded-md`}>
                {children}
            </div>
            <div className='flex flex-col'>
                <h1 className='text-xl'>{title}</h1>
                <p>{description}</p>
            </div>
        </div>
    )
}

export default SpecialTileItem