import NotFound from '@/app/not-found'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Editor from '../Editor'
import { defaultMapData } from '@/utils/pixi/types'

export default async function RealmEditor({ params }: { params: { id: string } }) {

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/signin')
    }

    const { data, error } = await supabase.from('realms').select('id, name, owner_id, map_data').eq('id', params.id)
    // Show not found page if we are not the owner or no data is returned
    if (!data || !data[0] || user.id !== data[0].owner_id) {
        return <NotFound />
    }
    const realm = data[0] 
    const map_data = realm.map_data || defaultMapData

    return (
        <div>
            <Editor realmData={map_data}/>
        </div>
    )
}