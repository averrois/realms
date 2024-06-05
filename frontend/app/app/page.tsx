import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar/Navbar'
import { getOwnedRealms } from '@/utils/supabase/realmsQuery'
import RealmsMenu from './RealmsMenu/RealmsMenu'

export default async function App() {

    const supabase = createClient()

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        return redirect('/signin')
    }

    const { data, error } = await getOwnedRealms(session.access_token)

    const realms = data || [] 
    const errorMessage = error?.message || ''

    return (
        <div>
            <Navbar />
            <h1 className='text-3xl pl-4 pt-4'>Your Realms</h1>
            <RealmsMenu realms={realms} errorMessage={errorMessage}/>
        </div>
    )
}
