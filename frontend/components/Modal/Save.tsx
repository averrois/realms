import React from 'react'
import Modal from './Modal'
import { useModal } from '@/app/hooks/useModal'
import LoadingSpinner from '../LoadingSpinner'

type SaveProps = {
    
}

const Save:React.FC<SaveProps> = () => {
    
    const [modal, setModal] = useModal()

    return (
        <Modal open={modal === 'Save'} className='bg-transparent'>
            <LoadingSpinner />
        </Modal>
    )
}

export default Save