'use client'
import React, { useEffect } from 'react'
import PixiApp from './PixiApp'
import { RealmData } from '@/utils/pixi/types'
import PlayNavbar from './PlayNavbar'
import signal from '@/utils/signal'
import { useModal } from '../hooks/useModal'

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

    const { setModal, setDisconnectedMessage } = useModal()

    useEffect(() => {
        const onKicked = (message: string) => { 
            setModal('Disconnected')
            setDisconnectedMessage(message)
        }

        signal.on('kicked', onKicked)

        return () => {
            signal.off('kicked', onKicked)
        }
    }, [])

    return (
        <div className='relative w-full h-screen flex flex-col-reverse sm:flex-col'>
            <PixiApp mapData={mapData} className='w-full grow sm:h-full sm:flex-grow-0' username={username} access_token={access_token} realmId={realmId} uid={uid} shareId={shareId} initialSkin={initialSkin}/>
            <PlayNavbar />
        </div>
    )
}
export default PlayClient