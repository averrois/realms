import React from 'react'
import Modal from './Modal'
import { useModal } from '@/app/hooks/useModal'

type DeleteRoomModalProps = {
    
}

const DeleteRoomModal:React.FC<DeleteRoomModalProps> = () => {
    
    const { modal, roomToDelete } = useModal()

    return (
        <Modal open={modal === 'Delete Room'} closeOnOutsideClick>
            <div className='p-2 flex flex-col items-center'>
                <h1 className='text-center'>Are you sure you want to delete <span className='text-red-500'>{roomToDelete.name}</span>? It will be gone forever!</h1>
            </div>
        </Modal>
    )
}

export default DeleteRoomModal