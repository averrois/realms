'use client'
import React, { useRef } from 'react'
import { PlayApp } from '@/utils/pixi/PlayApp'
import { useEffect } from 'react'
import { RealmData } from '@/utils/pixi/types'
import { useModal } from '../hooks/useModal'
import { server } from '@/utils/pixi/server'

type PixiAppProps = {
    className?: string
    mapData: RealmData
    username: string
    refresh_token: string
    realmId: string
    uid: string
    shareId: string
}

const PixiApp:React.FC<PixiAppProps> = ({ className, mapData, username, refresh_token, realmId, uid, shareId }) => {

    const appRef = useRef<PlayApp | null>(null)
    const { setModal, setLoadingText } = useModal()

    useEffect(() => {
        const mount = async () => {
            const app = new PlayApp(uid, mapData, username)
            appRef.current = app
            setModal('Loading')
            setLoadingText('Connecting to server...')
            const connected = await server.connect(realmId, uid, shareId, refresh_token)
            if (!connected) {
                setModal('Failed To Connect')
                return
            }

            setLoadingText('Loading game...')
            await app.init()
            setModal('None')
            const pixiApp = app.getApp()
            
            document.getElementById('app-container')!.appendChild(pixiApp.canvas)
        }

        if (!appRef.current) {
            mount()
        }
        
        return () => {
            if (appRef.current) {
                appRef.current.destroy()
            }
        }
    }, [])

    return (
        <div id='app-container' className={`overflow-hidden ${className}`}>
            
        </div>
    )
}

export default PixiApp
