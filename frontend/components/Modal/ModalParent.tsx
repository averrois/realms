'use client'
import React from 'react'
import { useModal } from '@/app/hooks/useModal'
import CreateRealmModal from './CreateRealmModal'
import AccountDropdown from './AccountDropdown'
import LoadingModal from './LoadingModal'
import DeleteRoomModal from './DeleteRoomModal'
import TeleportModal from './TeleportModal'

const ModalParent:React.FC = () => {
    return (
        <div>
            <CreateRealmModal />
            <AccountDropdown />
            <LoadingModal />
            <DeleteRoomModal />
            <TeleportModal />
        </div>
    )
}
export default ModalParent;