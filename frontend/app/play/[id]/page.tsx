import React from 'react'
import NotFound from '@/app/not-found'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { defaultMapData } from '@/utils/pixi/types'

export default async function Play({ params }: { params: { id: string } }) {

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/signin')
    }

    const { data, error } = await supabase.from('realms').select('name, map_data').eq('id', params.id)
    // Show not found page if no data is returned
    if (!data || !data[0]) {
        return <NotFound />
    }
    const realm = data[0] 
    const map_data = realm.map_data || defaultMapData

    return (
        <div>
            Welcome to {realm.name}
        </div>
    )
}