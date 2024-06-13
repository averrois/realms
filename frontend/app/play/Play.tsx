'use client'
import React from 'react'
import PixiApp from './PixiApp'
import { RealmData } from '@/utils/pixi/types'
import PlayNavbar from './PlayNavbar'

type PlayProps = {
    mapData: RealmData
    username: string
    access_token: string
    realmId: string
    uid: string
    shareId: string
    initialSkin: string
}

const PlayClient:React.FC<PlayProps> = ({ mapData, username, access_token, realmId, uid, shareId, initialSkin }) => {

    return (
        <div className='relative w-full h-screen flex flex-col'>
            <PixiApp mapData={mapData} className='w-full grow sm:h-full sm:flex-grow-0' username={username} access_token={access_token} realmId={realmId} uid={uid} shareId={shareId} initialSkin={initialSkin}/>
            <PlayNavbar />
        </div>
    )
}
export default PlayClient