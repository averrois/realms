import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar/Navbar'
import RealmsMenu from './RealmsMenu/RealmsMenu'
import { getVisitedRealms } from '@/utils/supabase/getVisitedRealms'

export default async function App() {

    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    const { data: { session } } = await supabase.auth.getSession()

    if (!user) {
        return redirect('/signin')
    }

    const realms = []
    const { data: ownedRealms, error } = await supabase.from('realms').select('id, name').eq('owner_id', user.id)
    if (ownedRealms) {
        realms.push(...ownedRealms)
    }
    if (session) {
        const { data: visitedRealms, error: visitedRealmsError } = await getVisitedRealms(session.access_token)
        if (visitedRealms) {
            realms.push(...visitedRealms)
        }
    }
    const errorMessage = error?.message || ''

    return (
        <div>
            <Navbar />
            <h1 className='text-3xl pl-4 pt-4'>Your Realms</h1>
            <RealmsMenu realms={realms} errorMessage={errorMessage}/>
        </div>
    )
}