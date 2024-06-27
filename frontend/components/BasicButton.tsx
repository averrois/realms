import React from 'react'

type BasicButtonProps = {
    children?: React.ReactNode
    className?: string
    onClick?: () => void
    disabled?: boolean
}

const BasicButton:React.FC<BasicButtonProps> = ({ children, className, onClick, disabled }) => {
    
    return (
        <button className={`bg-rainbow-less hover:bg-rainbow-less-hover font-bold py-1 px-2 rounded-3xl ${disabled ? 'pointer-events-none text-gray-500' : ''} ${className}`} onClick={onClick}>
            {children}
        </button>
    )
}

export default BasicButton