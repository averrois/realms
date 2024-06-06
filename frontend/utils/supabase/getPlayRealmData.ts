'use server'
import 'server-only'
import { createClient } from '@supabase/supabase-js'

export async function getPlayRealmData(accessToken: string, shareId: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SERVICE_ROLE!,
    )

    const { data: user, error: userError } = await supabase.auth.getUser(accessToken)

    if (userError) {
        return { data: null, error: userError }
    }

    const { data, error } = await supabase.from('realms').select('map_data, privacy_level').eq('share_id', shareId)

    if (data && data[0]) {
        if (data[0].privacy_level === 'anyone') {
            return { data, error }
        } else if (data[0].privacy_level === 'discord') {
            // TODO: check if they are in discord 
        }
    }  

    return { data: null, error: 'Realm not found'}
}
