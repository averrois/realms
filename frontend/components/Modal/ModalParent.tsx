'use client'
import React from 'react'
import { useModal } from '@/app/hooks/useModal'
import CreateRealmModal from './CreateRealmModal'
import AccountDropdown from './AccountDropdown'
import LoadingModal from './LoadingModal'
import DeleteRoomModal from './DeleteRoomModal'

const ModalParent:React.FC = () => {
    const { modal } = useModal()
    
    return (
        <div>
            {modal === 'Create Realm' && (
                <CreateRealmModal />
            )}
            {modal === 'Account Dropdown' && (
                <AccountDropdown />
            )}
            {modal === 'Loading' && (
                <LoadingModal />
            )}
            {modal === 'Delete Room' && (
                <DeleteRoomModal />
            )}
        </div>
    )
}
export default ModalParent;