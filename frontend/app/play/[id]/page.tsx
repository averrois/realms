import React from 'react'
import NotFound from '@/app/not-found'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { defaultMapData } from '@/utils/pixi/types'
import { getPlayRealmData } from '@/utils/supabase/getPlayRealmData'
import PlayClient from '../Play'
import { defaultSkin } from '@/utils/pixi/Player/skins'

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

    const profile = await supabase.from('profiles').select('skin').eq('id', user.id)
    let skin = defaultSkin

    if (profile.data && profile.data[0]) {
        skin = profile.data[0].skin
    }

    return (
        <PlayClient 
            mapData={map_data} 
            username={user.user_metadata.full_name} 
            access_token={session.access_token} 
            realmId={params.id} 
            uid={user.id} 
            shareId={searchParams.shareId || ''} 
            initialSkin={skin}
        />
    )
}