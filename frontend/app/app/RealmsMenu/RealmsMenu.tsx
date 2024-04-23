'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import BasicButton from '@/components/BasicButton'

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
        <div className='flex flex-col items-center p-4 gap-2'>
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
            <BasicButton className='fixed bottom-4 w-[90%] h-12 sm:hidden' disabled={selectedRealm === ''}>
                Join Realm
            </BasicButton>
        </div>
    )
}

export default RealmsMenu