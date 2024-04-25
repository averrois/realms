'use client'
import React, { useRef } from 'react'
import { EditorApp } from '@/utils/pixi/EditorApp'
import { useEffect } from 'react'

type PixiEditorProps = {
    className?: string
}

const PixiEditor:React.FC<PixiEditorProps> = ({ className }) => {

    const appRef = useRef<EditorApp | null>(null)

    useEffect(() => {
        const mount = async () => {
            const app = new EditorApp()
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

export default PixiEditor
