import React from 'react'
import Modal from './Modal'
import { useModal } from '@/app/hooks/useModal'

type DeleteRoomModalProps = {
    
}

const DeleteRoomModal:React.FC<DeleteRoomModalProps> = () => {
    
    const { modal, setModal } = useModal()

    return (
        <Modal open={modal === 'Delete Room'} closeOnOutsideClick>
            <div className='p2 flex flex-col items-center'>
                <h1 className='text-center'>Are you sure you want to delete this room? It will be gone forever!</h1>
            </div>
        </Modal>
    )
}

export default DeleteRoomModal