'use client'
import { createContext, useContext, useState, ReactNode, FC } from 'react';

type Modal = 'None' | 'Create Realm' | 'Account Dropdown' | 'Loading'

type ModalContextType = [
    modalValue: Modal,
    setModalValue: (value: Modal) => void,
]

const ModalContext = createContext<ModalContextType>([
    'None',
    () => {}
])

type ModalProviderProps = {
    children: ReactNode
}

export const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
    const [modalValue, setModalValue] = useState<Modal>('None')

    const value: ModalContextType = [modalValue, setModalValue]

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    )
}

export const useModal = () => useContext(ModalContext)
