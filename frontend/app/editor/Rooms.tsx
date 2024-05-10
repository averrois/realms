import React, { useEffect, useState } from 'react'
import { RealmData } from '@/utils/pixi/types'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import BasicButton from '@/components/BasicButton'

type RoomsProps = {
    realmData: RealmData
}

const Rooms:React.FC<RoomsProps> = ({ realmData }) => {

    const [rooms, setRooms] = useState<string[]>(realmData.map(room => room.name))
    const [roomIndex, setRoomIndex] = useState<number>(0)
    
    return (
        <div className='flex flex-col items-center px-4 grow'>
                <h1>Rooms</h1>
                <div className='flex flex-col items-center w-full grow overflow-y-scroll'>
                    {rooms.map((room, index) => (
                        <div className={`${roomIndex === index ? 'bg-secondaryhover' : 'bg-secondaryhoverdark'} w-full p-1 px-2 rounded-md cursor-pointer`}>{room}</div>
                    ))}
                </div>
                <BasicButton className='flex flex-row items-center gap-1 text-xl mb-4'>
                    Create Room
                    <PlusCircleIcon className='h-5'/>
                </BasicButton>
        </div>
    )
}

export default Rooms