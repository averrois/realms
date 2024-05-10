import React, { useEffect, useState, useRef } from 'react'
import { RealmData } from '@/utils/pixi/types'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import BasicButton from '@/components/BasicButton'
import signal from '@/utils/signal'
import { useModal } from '../hooks/useModal'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { Trash } from '@phosphor-icons/react'

type RoomsProps = {
    realmData: RealmData
}

const Rooms:React.FC<RoomsProps> = ({ realmData }) => {

    const [rooms, setRooms] = useState<string[]>(realmData.map(room => room.name))
    const [roomIndex, setRoomIndex] = useState<number>(0)
    const roomsContainerRef = useRef<HTMLDivElement>(null)
    const { setModal, setRoomToDelete }= useModal()
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
                        const onRoomClick = () => {
                            if (roomIndex === index) return

                            signal.emit('changeRoom', index)
                        }

                        const onTrashClick = (e: React.MouseEvent<SVGSVGElement>) => {
                            e.stopPropagation()
                            setModal('Delete Room')
                            setRoomToDelete({
                                name: room,
                                index
                            })
                        }

                        return (
                            <div 
                                onClick={onRoomClick} 
                                className={`${roomIndex === index ? 'bg-secondaryhover' : 'bg-secondaryhoverdark cursor-pointer'} hover:bg-secondaryhover w-full p-1 px-2 rounded-md flex flex-row items-center justify-between`} 
                                key={room + index}
                            >
                                {room}
                                <div className='flex flex-row items-center gap-1'>
                                    <PencilSquareIcon className='h-5 w-5 cursor-pointer hover:bg-secondaryhoverdark rounded-md p-[2px]'/>
                                    <Trash className='h-5 w-5 cursor-pointer hover:bg-secondaryhoverdark rounded-md p-[2px]' onClick={onTrashClick}/>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <BasicButton className='flex flex-row items-center gap-1 text-xl mb-4 w-full justify-center' onClick={onClickCreateRoom}>
                    Create Room
                    <PlusCircleIcon className='h-5 cursor-pointer hover:bg-secondaryhoverdark'/>
                </BasicButton>
        </div>
    )
}

export default Rooms