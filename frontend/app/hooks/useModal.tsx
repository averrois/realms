'use client'
import { createContext, useContext, useState, ReactNode, FC } from 'react';

type Modal = 'None' | 'Create Realm' | 'Account Dropdown' | 'Loading' | 'Delete Room'

type ModalContextType = {
    modal: Modal,
    setModal: (value: Modal) => void,
}

const ModalContext = createContext<ModalContextType>({
    modal: 'None',
    setModal: () => {}
})

type ModalProviderProps = {
    children: ReactNode
}

export const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
    const [modal, setModal] = useState<Modal>('None')

    const value: ModalContextType = { modal, setModal }

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    )
}

export const useModal = () => useContext(ModalContext)
