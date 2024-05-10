import React, { useEffect, useState, useRef } from 'react'
import { RealmData } from '@/utils/pixi/types'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import BasicButton from '@/components/BasicButton'
import signal from '@/utils/signal'

type RoomsProps = {
    realmData: RealmData
}

const Rooms:React.FC<RoomsProps> = ({ realmData }) => {

    const [rooms, setRooms] = useState<string[]>(realmData.map(room => room.name))
    const [roomIndex, setRoomIndex] = useState<number>(0)
    const roomsContainerRef = useRef<HTMLDivElement>(null)

    function onClickCreateRoom() {
        signal.emit('createRoom')
    }

    useEffect(() => {
        // scroll when new room is created
        roomsContainerRef.current?.scrollTo(0, roomsContainerRef.current.scrollHeight)
        const onNewRoom = (newRoom: string) => {
            setRooms([...rooms, newRoom])
        }

        signal.on('newRoom', onNewRoom)

        return () => {
            signal.off('newRoom', onNewRoom)
        }
    }, [rooms])

    return (
        <div className='flex flex-col items-center px-4 grow gap-2'>
                <h1>Rooms</h1>
                <div className='flex flex-col items-center w-full overflow-y-scroll h-[200px] gap-1' ref={roomsContainerRef}>
                    {rooms.map((room, index) => (
                        <div className={`${roomIndex === index ? 'bg-secondaryhover' : 'bg-secondaryhoverdark'} w-full p-1 px-2 rounded-md cursor-pointer`} key={room + index}>{room}</div>
                    ))}
                </div>
                <BasicButton className='flex flex-row items-center gap-1 text-xl mb-4' onClick={onClickCreateRoom}>
                    Create Room
                    <PlusCircleIcon className='h-5'/>
                </BasicButton>
        </div>
    )
}

export default Rooms