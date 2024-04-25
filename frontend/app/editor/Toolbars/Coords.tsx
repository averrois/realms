'use client'
import React, { useState } from 'react'

type CoordsProps = {
    
}

const Coords:React.FC<CoordsProps> = () => {

    const [coords, setCoords] = useState({x: 0, y: 0})
    
    return (
        <div className='absolute bg-white rounded-lg text-primary bottom-[12px] right-[270px] px-1 bg-opacity-50'>
            x:{coords.x} y:{coords.y}
        </div>
    )
}

export default Coords