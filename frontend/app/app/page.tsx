import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar/Navbar'
import RealmsMenu from './RealmsMenu/RealmsMenu'

export default async function App() {

    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/signin')
    }

    const { data, error } = await supabase.from('realms').select('id, name').eq('owner_id', user.id)

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