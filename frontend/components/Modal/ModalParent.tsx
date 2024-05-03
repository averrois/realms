'use client'
import React from 'react'
import { useModal } from '@/app/hooks/useModal'
import CreateRealmModal from './CreateRealmModal'
import AccountDropdown from './AccountDropdown'
import Save from './Save'

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
            {modal === 'Save' && (
                <Save />
            )}
        </div>
    )
}
export default ModalParent;