'use client'
import React, { useRef } from 'react'
import { EditorApp } from '@/utils/pixi/EditorApp'
import { useEffect } from 'react'
import signal from '@/utils/signal'

type PixiEditorProps = {
    className?: string
    setGameLoaded: (loaded:boolean) => void
}

const PixiEditor:React.FC<PixiEditorProps> = ({ className, setGameLoaded }) => {

    const appRef = useRef<EditorApp | null>(null)

    useEffect(() => {
        const mount = async () => {
            const app = new EditorApp()
            appRef.current = app
            await app.init()
            setGameLoaded(true)

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

    const onMouseEnter = () => {
        signal.emit('mouseOver', true)
    }

    const onMouseLeave = () => {
        signal.emit('mouseOver', false)
    }

    return (
        <div id='app-container' className={`overflow-hidden ${className}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            
        </div>
    )
}

export default PixiEditor
