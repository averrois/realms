import React, { useEffect, useState, useRef } from 'react'
import { RealmData } from '@/utils/pixi/types'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import BasicButton from '@/components/BasicButton'
import signal from '@/utils/signal'
import { useModal } from '../hooks/useModal'

type RoomsProps = {
    realmData: RealmData
}

const Rooms:React.FC<RoomsProps> = ({ realmData }) => {

    const [rooms, setRooms] = useState<string[]>(realmData.map(room => room.name))
    const [roomIndex, setRoomIndex] = useState<number>(0)
    const roomsContainerRef = useRef<HTMLDivElement>(null)
    const [modal, setModal] = useModal()
    const firstRender = useRef(true)

    function onClickCreateRoom() {
        signal.emit('createRoom')
    }

    useEffect(() => {
        // scroll when new room is created
        if (firstRender.current === false) {
            roomsContainerRef.current?.scrollTo(0, roomsContainerRef.current.scrollHeight)
        }

        const onNewRoom = (newRoom: string) => {
            setRooms([...rooms, newRoom])
            firstRender.current = false
        }

        const onLoadingRoom = () => {
            setModal('Loading')
        }

        const onRoomChanged = (index: number) => {
            setRoomIndex(index)
            setModal('None')
        }

        signal.on('newRoom', onNewRoom)
        signal.on('loadingRoom', onLoadingRoom)
        signal.on('roomChanged', onRoomChanged)

        return () => {
            signal.off('newRoom', onNewRoom)
            signal.off('loadingRoom', onLoadingRoom)
            signal.off('roomChanged', onRoomChanged)
        }
    }, [rooms])

    return (
        <div className='flex flex-col items-center px-3 grow gap-2'>
                <h1 className='w-full'>Rooms</h1>
                <div className='flex flex-col items-center w-full overflow-y-scroll max-h-[220px] gap-1' ref={roomsContainerRef}>
                    {rooms.map((room, index) => {
                        const onClick = () => {
                            if (roomIndex === index) return

                            signal.emit('changeRoom', index)
                        }

                        return (
                            <div 
                                onClick={onClick} 
                                className={`${roomIndex === index ? 'bg-secondaryhover pointer-events-none' : 'bg-secondaryhoverdark'} hover:bg-secondaryhover w-full p-1 px-2 rounded-md cursor-pointer`} 
                                key={room + index}
                            >
                                {room}
                            </div>
                        )
                    })}
                </div>
                <BasicButton className='flex flex-row items-center gap-1 text-xl mb-4 w-full justify-center' onClick={onClickCreateRoom}>
                    Create Room
                    <PlusCircleIcon className='h-5'/>
                </BasicButton>
        </div>
    )
}

export default Rooms