import React from 'react'

type ToolButtonProps = {
    children?: React.ReactNode
    selected: boolean
    onClick?: () => void
}

const ToolButton:React.FC<ToolButtonProps> = ({ children, selected, onClick }) => {
    
    return (
        <button className={`${selected ? 'bg-secondaryhover' : ''} hover:bg-secondaryhover aspect-square grid place-items-center rounded-lg p-1`} onClick={onClick}>
            {children}
        </button>
    )
}
export default ToolButton