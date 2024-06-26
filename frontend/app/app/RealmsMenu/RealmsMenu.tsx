'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import BasicButton from '@/components/BasicButton'
import DesktopRealmItem from './DesktopRealmItem'
import { useRouter } from 'next/navigation'

type Realm = {
    id: string,
    name: string,
    share_id: string
    shared?: boolean
    playerCount?: number
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
                {realms.length === 0 && <p className='text-center'>You have no realms you can join. Create one on desktop to get started!</p>}
                {realms.map((realm) => {

                    function selectRealm() {
                        setSelectedRealm(realm)
                    }

                    return (
                        <button key={realm.id} className={`w-full h-12 bg-quaternary px-2 hover:bg-quaternaryhover cursor-pointer rounded-md border-4 border-transparent flex flex-row items-center justify-between${selectedRealm?.id === realm.id ? 'border-white' : ''}`} onClick={selectRealm}>
                            <p className='text-white text-xl text-left'>{realm.name}</p>
                            {realm.playerCount !== undefined && realm.playerCount !== null && <div className='rounded-full grid place-items-center w-8 h-8 font-bold bg-green-500'>
                                {realm.playerCount}
                            </div>}
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
            <div className='flex-col items-center w-full p-8 hidden sm:flex'>
                {realms.length === 0 && <p className='text-center'>You have no realms you can join. Create a realm to get started!</p>}
                <div className='hidden sm:grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-8 w-full'>
                    {realms.map((realm) => {
                        return (
                            <DesktopRealmItem key={realm.id} name={realm.name} id={realm.id} shareId={realm.share_id} shared={realm.shared} playerCount={realm.playerCount}/>
                        )
                    })}
                </div>
            </div>
            
        </>
        
    )
}

export default RealmsMenu