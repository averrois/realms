import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ManageChild from '../ManageChild'
import NotFound from '../../not-found'

export default async function Manage({ params }: { params: { id: string } }) {

    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/signin')
    }

    const { data, error } = await supabase.from('realms').select('id, name, owner_id, map_data, privacy_level').eq('id', params.id)

    // Show not found page if no data is returned
    if (!data || !data[0]) {
        return <NotFound />
    }
    const realm = data[0]

    return (
        <div>
            <ManageChild realmId={realm.id} privacyLevel={realm.privacy_level}/>
        </div>
    )
}