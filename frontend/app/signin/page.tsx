import { createClient } from '@/utils/supabase/client'

export default function Login() {

    const supabase = createClient()

    const signInWithDiscord = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'discord',
        })
    }

  return (
    <div className='flex flex-col items-center w-full'>
        
    </div>
  );
}
