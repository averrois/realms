import React, { useState } from 'react'
import Dropdown from '@/components/Dropdown'

type ManageChildProps = {
    
}

const ManageChild:React.FC<ManageChildProps> = () => {
    
    return (
        <div className='grid place-items-center w-full h-screen'>
            <div className='flex flex-row gap-2'>
                <div className='flex flex-col'>
                    <h1>Who can join your realm</h1>
                </div>
            </div>
        </div>
    )
}

export default ManageChild