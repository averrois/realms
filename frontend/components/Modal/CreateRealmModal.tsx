'use client'
import React, { useState } from 'react'
import Modal from './Modal'
import { useModal } from '@/app/hooks/useModal'

const CreateRealmModal:React.FC = () => {
    
    const [modal, setModal] = useModal()

    return (
        <Modal open={modal === 'Create Realm'} closeOnOutsideClick={true}>
            hello
        </Modal>
    )
}

export default CreateRealmModal