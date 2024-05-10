import React, { useEffect, useState } from 'react'
import signal from '@/utils/signal'
import { RealmData } from '@/utils/pixi/types'

type RoomsProps = {
    realmData: RealmData
}

const Rooms:React.FC<RoomsProps> = ({ realmData }) => {

    const [rooms, setRooms] = useState<string[]>(realmData.map(room => room.name))
    const [roomIndex, setRoomIndex] = useState<number>(0)
    
    return (
        <div className='flex flex-col items-center px-4'>
                <h1>Rooms</h1>
                <div className='flex flex-col items-center w-full'>
                    {rooms.map(room => (
                        <div className={`bg-secondaryhoverdark w-full p-1 px-2 rounded-md cursor-pointer`}>{room}</div>
                    ))}
                </div>
        </div>
    )
}

export default Rooms