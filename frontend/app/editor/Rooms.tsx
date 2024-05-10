import React, { useEffect, useState } from 'react'
import signal from '@/utils/signal'

type RoomsProps = {
    
}

const Rooms:React.FC<RoomsProps> = () => {

    const [rooms, setRooms] = useState<string[]>([])
    
    useEffect(() => {
        const setInitialRooms = (rooms: string[]) => {
            setRooms(rooms)
        }

        signal.on('rooms', setInitialRooms)

        return () => {
            signal.off('rooms', setInitialRooms)
        }
    }, [])

    return (
        <div className='flex flex-col items-center'>
                <h1>Rooms</h1>
                <div className='flex flex-col items-center'>
                    {rooms.map(room => (
                        <div>{room}</div>
                    ))}
                </div>
        </div>
    )
}

export default Rooms