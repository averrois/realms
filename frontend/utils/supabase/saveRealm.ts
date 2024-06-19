'use server'
import 'server-only'
import { RealmData } from '../pixi/types'
import { createClient } from '@supabase/supabase-js'
import { RealmDataSchema } from '../pixi/zod'

export async function saveRealm(access_token: string, realmData: RealmData, id: string) {
    const result = RealmDataSchema.safeParse(realmData)
    if (result.success === false) {
        return { error: { message: 'Invalid realm data.' } }
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SERVICE_ROLE!,
    )

    const { data: user, error: userError } = await supabase.auth.getUser(access_token)
    if (!user || !user.user) {
        return { error: userError }
    }

    const { error } = await supabase
        .from('realms')
        .update({ map_data: realmData })
        .eq('id', id)
        .eq('owner_id', user.user.id)

    if (error) {
        return { error }
    }

    return { error: null }
}
