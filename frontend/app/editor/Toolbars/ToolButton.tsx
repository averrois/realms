import React, { useState } from 'react'

type ToolButtonProps = {
    children?: React.ReactNode
    selected: boolean
    onClick?: () => void
    className?: string
    label?: string
}

const ToolButton:React.FC<ToolButtonProps> = ({ children, selected, onClick, className, label }) => {
    
    const [showTooltip, setShowTooltip] = useState<boolean>(false)

    return (
        <div className='relative' onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
            <button className={`${selected ? 'bg-lightblue' : ''} hover:bg-lightblue aspect-square grid place-items-center rounded-lg p-1 ${className}`} onClick={onClick}>
                {children}
            </button>
            {showTooltip && label && <div className='absolute p-1 px-2 bg-secondary left-12 top-1 rounded-md whitespace-nowrap'>
                {label}
            </div>}
        </div>
        
    )
}
export default ToolButton