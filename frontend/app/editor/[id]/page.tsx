'use client'
import NotFound from '@/app/not-found'
import { createClient } from '@/utils/supabase/client'
import { redirect } from 'next/navigation'
import PixiEditor from '../PixiEditor'
import Toolbars from '../Toolbars'
import { useState, useEffect } from 'react'

export default function RealmEditor({ params }: { params: { id: string } }) {

    const [realm, setRealm] = useState<any>(null)
    useEffect(() => {
        const fetchRealm = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                return redirect('/signin')
            }

            const { data, error } = await supabase.from('realms').select('id, name, owner_id').eq('id', params.id)
            // Show not found page if we are not the owner or no data is returned
            if (!data || user.id !== data[0].owner_id) {
                return <NotFound />
            }
            const realm = data[0]
            setRealm(realm)
        }

        fetchRealm()
    }, [])

    return (
        <div className='relative'>
            {realm && (
                <>
                    <PixiEditor />
                    <Toolbars />
                </>
            )}
        </div>
    )
}