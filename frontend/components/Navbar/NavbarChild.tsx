'use client'
import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

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
        <>
            <div className='flex flex-row items-center gap-4 hover:bg-secondaryhover rounded-md cursor-pointer py-1 px-2 select-none' onClick={() => setMenuOpen(prev => !prev)}>
                <p className='text-white text-xl'>{name}</p>
                <img src={avatar_url} className='aspect-square rounded-full w-12'/>
            </div>
            {menuOpen && <button className='bg-secondary hover:bg-secondaryhover absolute top-[72px] rounded-md w-32 text-center text-lg' onClick={handleSignOut}>Sign Out</button>}
        </>
    )
}