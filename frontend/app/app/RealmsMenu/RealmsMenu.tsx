'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import BasicButton from '@/components/BasicButton'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

type Realm = {
    id: string,
    name: string,
}

type RealmsMenuProps = {
    realms: Realm[]
    errorMessage: string
}

const RealmsMenu:React.FC<RealmsMenuProps> = ({ realms, errorMessage }) => {

    const [selectedRealm, setSelectedRealm] = useState<string>('')

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage)
        }
    }, [errorMessage])

    return (
        <>
            {/* Mobile View */}
            <div className='flex flex-col items-center p-4 gap-2 sm:hidden'>
                {realms.map((realm) => {

                    function selectRealm() {
                        setSelectedRealm(realm.id)
                    }

                    return (
                        <button key={realm.id} className={`w-full h-12 bg-quaternary pl-2 hover:bg-quaternaryhover cursor-pointer rounded-md border-4 border-transparent ${selectedRealm === realm.id ? 'border-white' : ''}`} onClick={selectRealm}>
                            <p className='text-white text-xl text-left'>{realm.name}</p>
                        </button>
                    )
                })}
                <div className='fixed bottom-0 w-full bg-primary grid place-items-center p-2'>
                     <BasicButton className='w-[90%] h-12' disabled={selectedRealm === ''}>
                        Join Realm
                    </BasicButton>
                </div>
            </div>

            {/* Desktop View */}
            <div className='flex flex-col items-center w-full p-8'>
                <div className='hidden sm:grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-8 w-full'>
                    {realms.map((realm) => {
                        return (
                            <div key={realm.id}>
                                <div className='w-full aspect-video rounded-3xl overflow-hidden relative'>
                                    <img src='/pixel-screenshot.jpg' />
                                    <div className='animate-pulse w-full h-full bg-secondary'/>
                                </div>
                                <div className='mt-1 flex flex-row justify-between'>
                                    <p>{realm.name}</p>
                                    <Link href={`/editor/${realm.id}`}>
                                        <PencilSquareIcon className='h-7 w-7 cursor-pointer hover:bg-neutral-900 rounded-md p-1'/>
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            
        </>
        
    )
}

export default RealmsMenu