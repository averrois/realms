import React from 'react'
import Modal from '@/components/Modal/Modal'
import { useModal } from '@/app/hooks/useModal'

type SkinMenuProps = {
    
}

const SkinMenu:React.FC<SkinMenuProps> = () => {

    const { modal } = useModal()
    
    return (
        <Modal open={modal === 'Skin'} closeOnOutsideClick>
            <div className='w-96 h-96'>

            </div>
        </Modal>
    )
}

export default SkinMenu