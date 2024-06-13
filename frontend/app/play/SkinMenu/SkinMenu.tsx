import React from 'react'
import Modal from '@/components/Modal/Modal'
import { useModal } from '@/app/hooks/useModal'

type SkinMenuProps = {
    
}

const SkinMenu:React.FC<SkinMenuProps> = () => {

    const { modal } = useModal()
    
    return (
        <Modal open={modal === 'Skin'} closeOnOutsideClick>
            nice
        </Modal>
    )
}

export default SkinMenu