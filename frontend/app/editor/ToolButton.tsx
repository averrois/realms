import React from 'react'

type ToolButtonProps = {
    children?: React.ReactNode
}

const ToolButton:React.FC<ToolButtonProps> = ({ children }) => {
    
    return (
        <button className='hover:bg-secondaryhover w-full aspect-square grid place-items-center rounded-lg'>
            {children}
        </button>
    )
}
export default ToolButton