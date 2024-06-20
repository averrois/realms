'use client'
import Dropdown from '@/components/Dropdown'
import Link from 'next/link'
import React, { useState } from 'react'

type LinkClientProps = {
    serverName: string,
    serverId: string
    ownedRealms: any
}

const LinkClient:React.FC<LinkClientProps> = ({ serverName, serverId, ownedRealms }) => {
    
    const [selectedRealm, setSelectedRealm] = useState(ownedRealms && ownedRealms[0] ? ownedRealms[0].name : '')

    function getRealmTitle() {
        if (selectedRealm) {
            return <span className='text-3xl font-bold text-quaternaryhover'>{selectedRealm}</span>
        } else {
            return <span>a realm.</span>
        }
    }

    return (
        <div className='pt-36 place-items-center grid'>
            <div className='flex flex-col items-center gap-12'>
                <h1 className='text-xl text-center'>link <span className='font-bold text-3xl text-[#5764F2]'>{serverName}</span> to {getRealmTitle()}</h1>
                {!ownedRealms || ownedRealms.length === 0 && (
                    <h1 className='text-lg'>You haven't made any realms! Click <Link href='/app' className='underline'>here</Link> to make one!</h1>
                )}
                {ownedRealms && ownedRealms.length > 0 && (
                    <div className='flex flex-col items-center gap-2'>
                        <h1>Choose a realm to link to your server.</h1>
                        <Dropdown items={ownedRealms.map((realm: any) => realm.name)} setSelectedItem={setSelectedRealm} selectedItem={selectedRealm} alternateStyle/>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LinkClient