'use client'
import React from 'react'
import { useModal } from '@/app/hooks/useModal'
import CreateRealmModal from './CreateRealmModal'
import AccountDropdown from './AccountDropdown'

const ModalParent:React.FC = () => {
    const [modal] = useModal()
    
    return (
        <div>
            {modal === 'Create Realm' && (
                <CreateRealmModal />
            )}
            {modal === 'Account Dropdown' && (
                <AccountDropdown />
            )}
        </div>
    )
}
export default ModalParent;