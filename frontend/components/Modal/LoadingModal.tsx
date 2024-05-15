import React from 'react'
import Modal from './Modal'
import { useModal } from '@/app/hooks/useModal'
import LoadingSpinner from '../LoadingSpinner'

type SaveProps = {
    
}

const LoadingModal:React.FC<SaveProps> = () => {
    
    const { modal, setModal}  = useModal()

    return (
        <Modal open={modal === 'Loading'} className='bg-transparent'>
            <LoadingSpinner />
        </Modal>
    )
}

export default LoadingModal