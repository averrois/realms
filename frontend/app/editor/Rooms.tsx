import React, { useEffect, useState, useRef } from 'react'
import { RealmData } from '@/utils/pixi/types'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import BasicButton from '@/components/BasicButton'
import signal from '@/utils/signal'
import { useModal } from '../hooks/useModal'
import RoomItem from './RoomItem'

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

        const onRoomDeleted = ({ deletedIndex, newIndex }: { deletedIndex: number, newIndex: number }) => {
            setRoomIndex(newIndex)
            const newRooms = [...rooms]
            newRooms.splice(deletedIndex, 1)
            setRooms(newRooms)
        }

        const onRoomNameChanged = ({ index, newName }: { index: number, newName: string }) => {
            const newRooms = [...rooms]
            newRooms[index] = newName
            setRooms(newRooms)
        }

        signal.on('newRoom', onNewRoom)
        signal.on('loadingRoom', onLoadingRoom)
        signal.on('roomChanged', onRoomChanged)
        signal.on('roomDeleted', onRoomDeleted)
        signal.on('roomNameChanged', onRoomNameChanged)

        return () => {
            signal.off('newRoom', onNewRoom)
            signal.off('loadingRoom', onLoadingRoom)
            signal.off('roomChanged', onRoomChanged)
            signal.off('roomDeleted', onRoomDeleted)
            signal.off('roomNameChanged', onRoomNameChanged)
        }
    }, [rooms])

    return (
        <div className='flex flex-col items-center px-3 grow gap-2 w-full'>
                <h1 className='w-full'>Rooms</h1>
                <div className='flex flex-col items-center w-full overflow-y-scroll max-h-[220px] gap-1' ref={roomsContainerRef}>
                    {rooms.map((room, index) => <RoomItem rooms={rooms} selectedRoomIndex={roomIndex} roomIndex={index} roomName={room} key={index}/>)}
                </div>
                <BasicButton className='flex flex-row items-center gap-1 text-xl mb-4 w-full justify-center' onClick={onClickCreateRoom}>
                    Create Room
                    <PlusCircleIcon className='h-5 cursor-pointer hover:bg-secondaryhoverdark'/>
                </BasicButton>
        </div>
    )
}

export default Rooms