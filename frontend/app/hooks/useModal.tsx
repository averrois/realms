'use client'
import { createContext, useContext, useState, ReactNode, FC } from 'react';

type Modal = 'None' | 'Create Realm' | 'Account Dropdown' | 'Loading' | 'Delete Room' | 'Teleport'

type RoomToDelete = {
    name: string,
    index: number
}

type ModalContextType = {
    modal: Modal,
    setModal: (value: Modal) => void,
    roomToDelete: RoomToDelete,
    setRoomToDelete: (value: RoomToDelete) => void,
}

const ModalContext = createContext<ModalContextType>({
    modal: 'None',
    setModal: () => {},
    roomToDelete: {
        name: '',
        index: 0
    },
    setRoomToDelete: () => {},
})

type ModalProviderProps = {
    children: ReactNode
}

export const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
    const [modal, setModal] = useState<Modal>('None')
    const [roomToDelete, setRoomToDelete] = useState<RoomToDelete>({
        name: '',
        index: 0
    })

    const value: ModalContextType = { modal, setModal, roomToDelete, setRoomToDelete }

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    )
}

export const useModal = () => useContext(ModalContext)
