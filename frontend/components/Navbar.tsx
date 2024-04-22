import React from 'react'
import { createClient } from '@/utils/supabase/server'

const Navbar:React.FC = async () => {

    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    
    return (
        <div className='w-full h-16 bg-secondary flex flex-row justify-end items-center gap-4 p-2'>
            <p className='text-white text-xl'>{user?.user_metadata.full_name}</p>
            <img src={user?.user_metadata.avatar_url} className='aspect-square rounded-full w-12'/>
        </div>
    )
}
export default Navbar;