'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import LinkRealmDropdown from '@/components/LinkRealmDropdown'
import BasicButton from '@/components/BasicButton'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-toastify'

type LinkClientProps = {
    serverName: string,
    serverId: string
    ownedRealms: any
}

const LinkClient:React.FC<LinkClientProps> = ({ serverName, serverId, ownedRealms }) => {
    
    const [selectedRealm, setSelectedRealm] = useState(ownedRealms?.[0] ?? null)

    function getRealmTitle() {
        if (selectedRealm) {
            return <span className='text-3xl font-bold text-quaternaryhover'>{selectedRealm.name}</span>
        } else {
            return <span>a realm.</span>
        }
    }

    async function onLink() {
        const supabase = createClient()

        const { error } = await supabase.from('realms').update({
            discord_server_id: serverId
        }).eq('id', selectedRealm.id)

        if (error) {
            toast.error(error.message)
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
                        <ul className='list-disc max-w-[450px]'>
                            <li>Messages will be shared between the Discord channels and realm rooms that you link together.</li>
                            <li>It basically combines your realm chat and your Discord chat!</li>
                        </ul>
                        <h1 className='mt-12'>Choose a realm to link to your server!</h1>
                        <h1 className='max-w-[350px] text-center'></h1>
                        <LinkRealmDropdown realms={ownedRealms} setSelectedRealm={setSelectedRealm} selectedRealm={selectedRealm} />
                        <BasicButton className='font-bold mt-12 p-2' onClick={onLink}>
                            Link 🚀
                        </BasicButton>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LinkClient