'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import LinkRealmDropdown from '@/components/LinkRealmDropdown'
import BasicButton from '@/components/BasicButton'

type LinkClientProps = {
    serverName: string,
    serverId: string
    ownedRealms: any
}

const LinkClient:React.FC<LinkClientProps> = ({ serverName, serverId, ownedRealms }) => {
    
    const [selectedRealm, setSelectedRealm] = useState(ownedRealms && ownedRealms[0] ? ownedRealms[0] : null)

    function getRealmTitle() {
        if (selectedRealm) {
            return <span className='text-3xl font-bold text-quaternaryhover'>{selectedRealm.name}</span>
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
                        <h1 className='3xl font-bold'>What will happen:</h1>
                        <ul className='list-disc'>
                            <li>Messages from your realm will be shared with your Discord server.</li>
                            <li>Messages from your Discord server will be shared with your realm.</li>
                            <li>This happens by linking channels with rooms from your realm.</li>
                        </ul>
                        <h1 className='mt-12'>Choose a realm to link to your server!</h1>
                        <h1 className='max-w-[350px] text-center'></h1>
                        <LinkRealmDropdown realms={ownedRealms} setSelectedRealm={setSelectedRealm} selectedRealm={selectedRealm} />
                        <BasicButton className='font-bold mt-12 p-2'>
                            Link
                        </BasicButton>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LinkClient