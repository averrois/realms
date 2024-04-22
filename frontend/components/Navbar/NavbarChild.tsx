'use client'
import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { PlusCircleIcon } from '@heroicons/react/24/outline'

type NavbarChildProps = {
    name: string,
    avatar_url: string
};

export const NavbarChild:React.FC<NavbarChildProps> = ({ name, avatar_url }) => {

    const router = useRouter()
    const [menuOpen, setMenuOpen] = useState(false)

    async function handleSignOut() {
        const supabase = createClient()
        await supabase.auth.signOut()

        router.push('/signin')
    }

    return (
        <div className='w-full h-16 bg-secondary flex flex-row items-center p-2 pl-4 relative justify-end md:justify-between'>
            <button className='bg-quaternary hover:bg-quaternaryhover py-1 px-2 rounded-3xl text-xl hidden md:flex flex-row items-center gap-2'>
                Create Realm
                <PlusCircleIcon className='h-5'/>
            </button>
            <div className='flex flex-row items-center gap-4 hover:bg-secondaryhover rounded-3xl cursor-pointer py-1 px-2 select-none' onClick={() => setMenuOpen(prev => !prev)}>
                <p className='text-white text-xl'>{name}</p>
                <img src={avatar_url} className='aspect-square rounded-full w-12'/>
            </div>
            {menuOpen && <button className='bg-secondary hover:bg-secondaryhover absolute top-[72px] right-[8px] rounded-md w-32 text-center text-xl p-1' onClick={handleSignOut}>Sign Out</button>}
        </div>
    )
}