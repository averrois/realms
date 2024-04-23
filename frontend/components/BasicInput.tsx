import React from 'react'

type BasicInputProps = {
    label?: string
    className?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const BasicInput:React.FC<BasicInputProps> = ({ label, className, value, onChange }) => {
    
    return (
        <div>
        <label className="block text-lg font-medium leading-6 text-white">
            {label}
        </label>
        <div className="mt-1">
            <input
                type="text"
                className={`rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-md leading-6 ${className}`}
                autoComplete='off'
                placeholder=""
                value={value}
                onChange={onChange}
            />
        </div>
        </div>
  )
}

export default BasicInput