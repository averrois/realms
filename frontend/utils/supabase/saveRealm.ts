'use server'
import 'server-only'
import { RealmData } from '../pixi/types'
import { createClient } from '@supabase/supabase-js'
import { RealmDataSchema } from '../pixi/zod'
import { formatForComparison, removeExtraSpaces } from '../removeExtraSpaces'

export async function saveRealm(access_token: string, realmData: RealmData, id: string) {
    const result = RealmDataSchema.safeParse(realmData)
    if (result.success === false) {
        return { error: { message: 'Invalid realm data.' } }
    }

    realmData = JSON.parse(JSON.stringify(realmData))

    // return if any rooms in realm data have the same name
    const roomNames = new Set<string>()
    for (const room of realmData.rooms) {
        const roomName = formatForComparison(room.name)

        if (roomNames.has(roomName)) {
            return { error: { message: 'Room names must be unique.' } }
        }
        if (roomName === '') {
            return { error: { message: 'Room name cannot be empty.' } }
        }
        roomNames.add(roomName)

        room.name = removeExtraSpaces(room.name, true)
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
