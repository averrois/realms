'use client'
import React from 'react'
import PixiApp from './PixiApp'
import { RealmData } from '@/utils/pixi/types'
import { useEffect, useState } from 'react'
import signal from '@/utils/signal'
import { useModal } from '../hooks/useModal'

type PlayProps = {
    mapData: RealmData
    username: string
    access_token: string
    realmId: string
    uid: string
    shareId: string
}

const PlayClient:React.FC<PlayProps> = ({ mapData, username, access_token, realmId, uid, shareId }) => {

    const { setModal } = useModal()
    
    useEffect(() => {
        const onShowSkinMenu = () => {
            setModal('Skin')
        }

        signal.on('showSkinMenu', onShowSkinMenu)

        return () => {
            signal.off('showSkinMenu', onShowSkinMenu)
        }
    }, [])

    return (
        <div className='relative w-full h-screen'>
            <PixiApp mapData={mapData} className='absolute w-full h-full' username={username} access_token={access_token} realmId={realmId} uid={uid} shareId={shareId}/>
        </div>
    )
}
export default PlayClient