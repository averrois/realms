'use client'
import React, { useState, useEffect } from 'react'
import signal from '@/utils/signal'

type CoordsProps = {
    
}

const Coords:React.FC<CoordsProps> = () => {

    const [coords, setCoords] = useState({x: 0, y: 0})

    useEffect(() => {
        const setCoordinates = (data: any) => {
            setCoords(data)
        }

        signal.on('coordinates', setCoordinates)

        return () => {
            signal.off('coordinates', setCoordinates)
        }
    }, [])
    
    return (
        <div className='absolute bg-white rounded-lg text-primary bottom-[12px] right-[320px] px-1 bg-opacity-50 pointer-events-none'>
            x:{coords.x} y:{coords.y}
        </div>
    )
}

export default Coords