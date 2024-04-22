'use client'
import React from 'react'
import { useModal } from '@/app/hooks/useModal'
import CreateRealmModal from './CreateRealmModal'

const ModalParent:React.FC = () => {
    const [modal] = useModal()
    
    return (
        <div>
            {modal === 'Create Realm' && (
                <CreateRealmModal />
            )}
        </div>
    )
}
export default ModalParent;