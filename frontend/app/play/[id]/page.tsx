import React from 'react'
import NotFound from '@/app/not-found'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { defaultMapData } from '@/utils/pixi/types'
import PixiApp from '../PixiApp'
import { getPlayRealmData } from '@/utils/supabase/getPlayRealmData'

export default async function Play({ params, searchParams }: { params: { id: string }, searchParams: { shareId: string } }) {

    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const { data: { user } } = await supabase.auth.getUser()

    if (!session || !user) {
        return redirect('/signin')
    }

    const { data, error } = !searchParams.shareId ? await supabase.from('realms').select('map_data').eq('id', params.id) : await getPlayRealmData(session.access_token, searchParams.shareId)
    // Show not found page if no data is returned
    if (!data || !data[0]) {
        return <NotFound />
    }
    const realm = data[0] 
    const map_data = realm.map_data || defaultMapData

    return (
        <div className='relative w-full h-screen'>
            <PixiApp mapData={map_data} className='absolute w-full h-full' username={user.user_metadata.full_name} refresh_token={session.refresh_token} realmId={params.id} uid={user.id} shareId={searchParams.shareId || ''}/>
        </div>
    )
}