import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { NavbarChild } from './NavbarChild'

export const Navbar:React.FC = async () => {

    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    
    return (
        <div className='w-full h-16 bg-secondary flex flex-row justify-end items-center p-2 relative'>
            <NavbarChild name={user?.user_metadata.full_name} avatar_url={user?.user_metadata.avatar_url}/>
        </div>
    )
}
