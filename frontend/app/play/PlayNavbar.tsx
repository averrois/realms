import React from 'react'
import { TShirt } from '@phosphor-icons/react'
import { useModal } from '../hooks/useModal'
import signal from '@/utils/signal'
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

type PlayNavbarProps = {
    
}

const PlayNavbar:React.FC<PlayNavbarProps> = () => {

    const { setModal } = useModal()

    const onClickSkinButton = () => {
        setModal('Skin')
        signal.emit('requestSkin')
    }
    
    return (
        <div className='bg-secondary w-full sm:w-[600px] md:w-[750px] lg:w-[950px] h-14 sm:absolute sm:bottom-0 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:rounded-tl-2xl sm:rounded-tr-2xl flex flex-row items-center px-2 justify-between'>
            <Link href='/app' className='hover:bg-secondaryhover aspect-square grid place-items-center rounded-lg p-1 border-2 outline-none'>
                <ArrowLeftEndOnRectangleIcon className='h-8 w-8'/>
            </Link>
            <button className='hover:bg-secondaryhover aspect-square grid place-items-center rounded-lg p-1 border-2 outline-none' onClick={onClickSkinButton}>
                <TShirt className='h-8 w-8'/>
            </button>
        </div>
    )
}

export default PlayNavbar