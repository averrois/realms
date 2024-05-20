import React from 'react'

type ToolButtonProps = {
    children?: React.ReactNode
    selected: boolean
    onClick?: () => void
    className?: string
}

const ToolButton:React.FC<ToolButtonProps> = ({ children, selected, onClick, className }) => {
    
    return (
        <button className={`${selected ? 'bg-secondaryhover' : ''} hover:bg-secondaryhover aspect-square grid place-items-center rounded-lg p-1 ${className}`} onClick={onClick}>
            {children}
        </button>
    )
}
export default ToolButton