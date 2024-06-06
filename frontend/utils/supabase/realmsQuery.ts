'use server'
import 'server-only'
import { createClient } from '@supabase/supabase-js'

export async function getRealmData(accessToken: string, realmId: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SERVICE_ROLE!,
    )

    const { data: user, error: userError } = await supabase.auth.getUser(accessToken)

    if (userError) {
        return { data: null, error: userError }
    }

    const { data, error } = await supabase.from('realms').select('id, name, owner_id, map_data').eq('id', realmId)

    return { data, error }
}
