import React from 'react'
import Modal from './Modal'
import { useModal } from '@/app/hooks/useModal'

type TeleportModalProps = {
    
}

const TeleportModal:React.FC<TeleportModalProps> = () => {

    const { modal } = useModal()
    
    return (
        <Modal open={modal === 'Teleport'} closeOnOutsideClick>
            Teleport Modal
        </Modal>
    )
}

export default TeleportModal