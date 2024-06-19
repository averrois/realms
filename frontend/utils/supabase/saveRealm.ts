'use server'
import 'server-only'
import { RealmData } from '../pixi/types'
import { createClient } from '@supabase/supabase-js'

export async function saveRealm(access_token: string, realmData: RealmData, id: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SERVICE_ROLE!,
    )

    const { data: user, error: userError } = await supabase.auth.getUser(access_token)
    if (!user || !user.user) {
        return { error: userError }
    }

    const { data: realm, error: realmError } = await supabase.from('realms').select('id, owner_id').eq('id', id).single()
    if (!realm) {
        return { error: realmError }
    }

    if (realm.owner_id !== user.user.id) {
        return { error: { message: 'You do not have permission to update this realm.' } }
    }

    const { error } = await supabase
        .from('realms')
        .update({ map_data: realmData })
        .eq('id', id)

    if (error) {
        return { error }
    }

    return { error: null }
}