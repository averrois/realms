import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/Navbar/Navbar'

export default async function App() {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/signin')
    }

    return (
        <div>
            <Navbar />
            <h1 className='text-3xl pl-4 pt-4'>Your Realms</h1>
        </div>
    )
}