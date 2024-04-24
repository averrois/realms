'use client'
import React, { useRef } from 'react'
import { App } from '@/utils/pixi/App'
import { useEffect } from 'react'

const PixiEditor:React.FC = () => {

    const appRef = useRef<App | null>(null)

    useEffect(() => {
        const mount = async () => {
            const app = new App()
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
        <div id='app-container' className='w-full h-screen'>

        </div>
    )
}

export default PixiEditor
