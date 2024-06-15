'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import BasicButton from '@/components/BasicButton'
import DesktopRealmItem from './DesktopRealmItem'
import { useRouter } from 'next/navigation'

type Realm = {
    id: string,
    name: string,
    share_id?: string
}

type RealmsMenuProps = {
    realms: Realm[]
    errorMessage: string
}

const RealmsMenu:React.FC<RealmsMenuProps> = ({ realms, errorMessage }) => {

    const [selectedRealm, setSelectedRealm] = useState<Realm | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage)
        }
    }, [errorMessage])

    function getLink() {
        if (selectedRealm?.share_id) {
            return `/play/${selectedRealm.id}?shareId=${selectedRealm.share_id}`
        } else {
            return `/play/${selectedRealm?.id}`
        }
    }

    return (
        <>
            {/* Mobile View */}
            <div className='flex flex-col items-center p-4 gap-2 sm:hidden'>
                {realms.map((realm) => {

                    function selectRealm() {
                        setSelectedRealm(realm)
                    }

                    return (
                        <button key={realm.id} className={`w-full h-12 bg-quaternary pl-2 hover:bg-quaternaryhover cursor-pointer rounded-md border-4 border-transparent ${selectedRealm?.id === realm.id ? 'border-white' : ''}`} onClick={selectRealm}>
                            <p className='text-white text-xl text-left'>{realm.name}</p>
                        </button>
                    )
                })}
                <div className='fixed bottom-0 w-full bg-primary grid place-items-center p-2'>
                     <BasicButton className='w-[90%] h-12 text-xl' disabled={selectedRealm === null} onClick={() => router.push(getLink())}>
                        Join Realm
                    </BasicButton>
                </div>
            </div>

            {/* Desktop View */}
            <div className='flex flex-col items-center w-full p-8'>
                <div className='hidden sm:grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-8 w-full'>
                    {realms.map((realm) => {
                        return (
                            <DesktopRealmItem key={realm.id} name={realm.name} id={realm.id} shareId={realm.share_id}/>
                        )
                    })}
                </div>
            </div>
            
        </>
        
    )
}

export default RealmsMenu