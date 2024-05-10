import React, { useEffect, useRef, useState } from 'react'
import signal from '@/utils/signal'
import { useModal } from '../hooks/useModal'
import { Trash } from '@phosphor-icons/react'
import { PencilSquareIcon } from '@heroicons/react/24/outline'

type RoomItemProps = {
    rooms: string[]
    selectedRoomIndex: number
    roomIndex: number
    roomName: string
}

const RoomItem:React.FC<RoomItemProps> = ({ rooms, selectedRoomIndex, roomIndex, roomName }) => {
    
    const { setModal, setRoomToDelete } = useModal()
    const inputRef = useRef<HTMLInputElement>(null)
    const [inputDisabled, setInputDisabled] = useState<boolean>(true)
    const [value, setValue] = useState<string>(rooms[roomIndex])

    const onRoomClick = () => {
        if (selectedRoomIndex === roomIndex) return

        signal.emit('changeRoom', roomIndex)
    }

    const onTrashClick = (e: React.MouseEvent<SVGSVGElement>) => {
        e.stopPropagation()
        setModal('Delete Room')
        setRoomToDelete({
            name: roomName,
            index: roomIndex
        })
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setValue(newValue)
    }

    const onPencilClick = (e: React.MouseEvent<SVGSVGElement>) => {
        e.stopPropagation()
        setInputDisabled(false)
        inputRef.current?.focus()
        inputRef.current?.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length)
    }

    useEffect(() => {
        const onBlur = () => {
            // save the new room name
            signal.emit('changeRoomName', { index: roomIndex, newName: value })
            setInputDisabled(true)
        }

        inputRef.current?.addEventListener('blur', onBlur)

        return () => {
            inputRef.current?.removeEventListener('blur', onBlur)
        }
    }, [roomIndex, value, inputDisabled])

    return (
        <div 
            onClick={onRoomClick} 
            className={`${selectedRoomIndex === roomIndex ? 'bg-secondaryhover' : 'bg-secondaryhoverdark cursor-pointer'} hover:bg-secondaryhover w-full p-1 px-2 rounded-md flex flex-row items-center justify-between`} 
        >
            <input type='text' value={value} className={`${inputDisabled ? 'pointer-events-none' : ''} bg-transparent outline-none`} ref={inputRef} onChange={onInputChange}/>
            <div className='flex flex-row items-center gap-1'>
                <PencilSquareIcon className='h-5 w-5 cursor-pointer hover:bg-secondaryhoverdark rounded-md p-[2px]' onClick={onPencilClick}/>
                <Trash className={`h-5 w-5 cursor-pointer hover:bg-secondaryhoverdark rounded-md p-[2px] ${rooms.length <= 1 ? 'hidden' : ''}`} onClick={onTrashClick}/>
            </div>
        </div>
    )
}

export default RoomItem