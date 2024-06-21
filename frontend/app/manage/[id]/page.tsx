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

    const { data, error } = await supabase.from('realms').select('id, name, owner_id, map_data, privacy_level, share_id, only_owner').eq('id', params.id).single()

    // Show not found page if no data is returned
    if (!data) {
        return <NotFound />
    }
    const realm = data

    return (
        <div>
            <ManageChild realmId={realm.id} privacyLevel={realm.privacy_level} startingShareId={realm.share_id} startingOnlyOwner={realm.only_owner}/>
        </div>
    )
}