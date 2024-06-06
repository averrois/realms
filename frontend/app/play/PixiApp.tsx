'use client'
import React, { useRef } from 'react'
import { PlayApp } from '@/utils/pixi/PlayApp'
import { useEffect } from 'react'
import { RealmData } from '@/utils/pixi/types'

type PixiAppProps = {
    className?: string
    mapData: RealmData
    username: string
}

const PixiApp:React.FC<PixiAppProps> = ({ className, mapData, username }) => {

    const appRef = useRef<PlayApp | null>(null)

    useEffect(() => {
        const mount = async () => {
            const app = new PlayApp(mapData, username)
            appRef.current = app
            await app.init()

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
