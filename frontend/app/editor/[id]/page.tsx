import NotFound from '@/app/not-found'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function RealmEditor({ params }: { params: { id: string } }) {

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/signin')
    }

    const { data, error } = await supabase.from('realms').select('id, name, owner_id').eq('id', params.id)
    // Show not found page if we are not the owner
    if (!data || user.id !== data[0].owner_id) {
        return <NotFound />
    }
    const realm = data[0]

    return (
        <div>
            <h1>Realm Editor</h1>
            <p>Realm Name: {realm.name}</p>
        </div>
    )
}