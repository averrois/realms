import { createClient } from '@supabase/supabase-js'
import revalidate from '../revalidate'

export async function updateVisitedRealms(accessToken: string, shareId: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SERVICE_ROLE!,
    )

    console.log('updating')

    // get user data
    const { data: user, error: userError } = await supabase.auth.getUser(accessToken)
    if (!user || !user.user) {
        return
    }

    // get profile
    const { data: profile, error: profileError } = await supabase.from('profiles').select('visited_realms').eq('id', user.user.id).single()
    if (!profile) {
        console.log('no profile')
        return
    }

    const visitedRealms = profile.visited_realms || []
    if (visitedRealms.includes(shareId)) {
        console.log('already saved')
        return
    }

    visitedRealms.push(shareId)

    console.log('inserting')
    // update profile with new visited realms
    await supabase
        .from('profiles')
        .update({ 
        visited_realms: visitedRealms
        })
        .eq('id', user.user.id)

    revalidate('/app')
}