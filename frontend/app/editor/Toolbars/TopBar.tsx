'use client'
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import React, { useEffect } from 'react'
import BasicButton from '@/components/BasicButton'
import signal from '@/utils/signal'
import { useModal } from '@/app/hooks/useModal'

type TopBarProps = {
    
}

const TopBar:React.FC<TopBarProps> = () => {

    const [modal, setModal] = useModal()

    function beginSave() {
        signal.emit('beginSave')
        setModal('Save')
    }

    return (
        <div className='w-full h-[48px] bg-secondary flex flex-row items-center p-2 border-b-2 border-black gap-2'>
            <div className='hover:bg-secondaryhover aspect-square grid place-items-center rounded-lg p-1'>
                <Link href={'/app'}>
                    <ArrowLeftEndOnRectangleIcon className='h-8 w-8 text-white'/>
                </Link>
            </div>
            <BasicButton onClick={beginSave}>
                Save
            </BasicButton>
        </div>
    )
}

export default TopBar