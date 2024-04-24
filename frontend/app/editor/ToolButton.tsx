import React from 'react'
import Link from 'next/link'

type ToolButtonProps = {
    children?: React.ReactNode
    href?: string
}

const ToolButton:React.FC<ToolButtonProps> = ({ children, href }) => {
    
    return <button className='hover:bg-secondaryhover w-full aspect-square grid place-items-center rounded-lg'>
        {href ? <Link href={href}>{children}</Link> : children}
    </button>
}
export default ToolButton;