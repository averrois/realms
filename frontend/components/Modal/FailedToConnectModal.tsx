import React from 'react'
import Modal from './Modal'
import { useModal } from '@/app/hooks/useModal'

type FailedToConnectModalProps = {
    
}

const FailedToConnectModal:React.FC<FailedToConnectModalProps> = () => {
    
    const { modal } = useModal()

    const onRetry = () => {
        window.location.reload()
    }

    return (
        <Modal open={modal === 'Failed To Connect'} className='bg-transparent'>
            <div className='flex flex-col items-center gap-2'>
                <h1 className='text-red-500'>Failed to connect to server.</h1>
                <button className='bg-secondary hover:bg-secondaryhover text-white px-2 py-1 rounded-md outline-none' onClick={onRetry}>Retry</button>
            </div>
        </Modal>
    )
}

export default FailedToConnectModal