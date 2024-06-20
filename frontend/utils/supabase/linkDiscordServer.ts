'use server'
import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { request } from '../backend/requests'

export async function linkDiscordServer(access_token: string, discord_server_id: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SERVICE_ROLE!,
    )

    const { data: user, error: userError } = await supabase.auth.getUser(access_token)
    if (!user || !user.user) {
        return { error: userError }
    }

    const { data, error } = await request('/isOwnerOfServer', { access_token, serverId: discord_server_id })
    if (error) {
        return { error }
    }

    if (!data || !data.isOwner) {
        return { error: 'You are not the owner of this server! You can only link servers that you own.' }
    }

    return { error: null }
}