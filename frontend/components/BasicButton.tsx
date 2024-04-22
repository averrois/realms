import React from 'react'

type BasicButtonProps = {
    children?: React.ReactNode
    className?: string
    onClick?: () => void
}

const BasicButton:React.FC<BasicButtonProps> = ({ children, className, onClick }) => {
    
    return (
        <button className={`bg-quaternary hover:bg-quaternaryhover py-1 px-2 rounded-3xl text-xl ${className}`} onClick={onClick}>
            {children}
        </button>
    )
}

export default BasicButton