import React, { useState } from 'react'
import Modal from './Modal'
import { useModal } from '@/app/hooks/useModal'
import BasicInput from '../BasicInput'
import BasicButton from '../BasicButton'
import signal from '@/utils/signal'

type TeleportModalProps = {
    
}

const TeleportModal:React.FC<TeleportModalProps> = () => {

    const { modal, setModal, roomList } = useModal()
    const [ selectedRoomIndex, setSelectedRoomIndex ] = useState<number>(0)
    const [ x, setX ] = useState<string>('0')
    const [ y, setY ] = useState<string>('0')

    const onXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setX(e.target.value)
    }

    const onYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setY(e.target.value)
    }

    function onSubmit() {
        signal.emit('teleport', {
            roomIndex: selectedRoomIndex,
            x: parseInt(x),
            y: parseInt(y)
        })
        setModal('None')
    }

    return (
        <Modal open={modal === 'Teleport'} closeOnOutsideClick>
            <div className='flex flex-col items-center gap-4 p-4'>
                <div className='flex flex-row gap-8'>
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
                            <BasicInput className='w-12 h-6' type='number' value={x} onChange={onXChange}/>
                            <h1>Y:</h1>
                            <BasicInput className='w-12 h-6' type='number' value={y} onChange={onYChange}/>
                        </div>
                    </div>
                </div>
                <BasicButton onClick={onSubmit} className='text-lg'>
                    Confirm
                </BasicButton>
            </div>
        </Modal>
    )
}

export default TeleportModal