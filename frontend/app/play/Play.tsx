'use client'
import React, { useEffect } from 'react'
import PixiApp from './PixiApp'
import { RealmData } from '@/utils/pixi/types'
import PlayNavbar from './PlayNavbar'
import { useModal } from '../hooks/useModal'
import { server } from '@/utils/pixi/server'

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

    const { setErrorModal, setDisconnectedMessage } = useModal()

    useEffect(() => {
        const onKicked = (message: string) => { 
            setErrorModal('Disconnected')
            setDisconnectedMessage(message)
        }

        const onDisconnect = () => {
            setErrorModal('Disconnected')
            setDisconnectedMessage('You have been disconnected from the server.')
        }

        server.socket.on('kicked', onKicked)
        server.socket.on('disconnect', onDisconnect)

        return () => {
            server.socket.off('kicked', onKicked)
            server.socket.off('disconnect', onDisconnect)
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