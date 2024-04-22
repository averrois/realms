'use client'
import React, { useState } from 'react'
import Modal from './Modal'
import { useModal } from '@/app/hooks/useModal'
import BasicButton from '../BasicButton'
import { PlusCircleIcon } from '@heroicons/react/24/outline'

const CreateRealmModal:React.FC = () => {
    
    const [modal] = useModal()

    return (
        <Modal open={modal === 'Create Realm'} closeOnOutsideClick={true}>
            <div className='flex flex-col items-center p-2'>
                <h1 className='text-3xl p-4'>Create a Realm</h1>
                <BasicButton>
                    Create
                </BasicButton>
            </div>
        </Modal>
    )
}

export default CreateRealmModal