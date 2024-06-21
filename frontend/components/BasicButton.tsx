import React from 'react'
import LoadingSpinner from './LoadingSpinner'

type BasicButtonProps = {
    children?: React.ReactNode
    className?: string
    onClick?: () => void
    disabled?: boolean
    loading?: boolean
}

const BasicButton:React.FC<BasicButtonProps> = ({ children, className, onClick, disabled, loading }) => {
    
    return (
        <button 
            disabled={loading || disabled} 
            className={`
                bg-quaternary 
                hover:bg-quaternaryhover 
                py-1 
                px-2 
                rounded-3xl 
                relative
                ${disabled ? 'bg-quaternarydisabled text-gray-400' : ''} 
                ${className}
            `} 
                onClick={onClick}
        >
            <div className={`${loading ? 'opacity-0' : 'opacity-100'} `}>
                {children}
            </div>
            {loading && (
                <div className='grid place-items-center absolute w-full h-full top-0 left-0'>
                    <LoadingSpinner small/>
                </div>
            )}
        </button>
    )
}

export default BasicButton