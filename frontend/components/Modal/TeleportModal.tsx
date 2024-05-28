import React, { useState } from 'react'
import Modal from './Modal'
import { useModal } from '@/app/hooks/useModal'
import BasicInput from '../BasicInput'

type TeleportModalProps = {
    
}

const TeleportModal:React.FC<TeleportModalProps> = () => {

    const { modal, roomList } = useModal()
    const [ selectedRoomIndex, setSelectedRoomIndex ] = useState<number>(0)
    
    return (
        <Modal open={modal === 'Teleport'} closeOnOutsideClick>
            <div className='p-2 flex flex-row gap-8'>
                <div className='flex flex-col gap-1 items-center'>
                    <h1 className='text-lg'>Destination Room</h1>
                    {roomList.map((room, index) => {

                        function selectRoom(index: number) {
                            setSelectedRoomIndex(index)
                        }

                        return (
                            <div 
                                key={index} 
                                className={`${selectedRoomIndex === index ? 'border-black' : 'border-secondary'} border-4 bg-quaternary px-1 rounded-lg cursor-pointer w-24 text-center hover:bg-quaternaryhover`}
                                onClick={() => selectRoom(index)}
                            >
                                {room}
                            </div>
                        )
                    })}
                </div>
                <div className='flex flex-col gap-1 items-center'>
                    <h1 className='text-lg'>Coordinates</h1>
                    <div className='flex flex-row gap-1 items-center'>
                        <h1>X:</h1>
                        <BasicInput className='w-12 h-6' type='number'/>
                        <h1>Y:</h1>
                        <BasicInput className='w-12 h-6' type='number'/>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default TeleportModal