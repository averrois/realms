'use client'
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import React, { useEffect } from 'react'
import BasicButton from '@/components/BasicButton'
import signal from '@/utils/signal'
import { useModal } from '@/app/hooks/useModal'
import { RealmData } from '@/utils/pixi/types'
import { createClient } from '@/utils/supabase/client'
import { useParams } from 'next/navigation'
import { toast } from 'react-toastify'
import revalidate from '@/utils/revalidate'
import { FloppyDisk } from '@phosphor-icons/react'
import { saveRealm } from '@/utils/supabase/saveRealm'

type TopBarProps = {
    
}

const TopBar:React.FC<TopBarProps> = () => {

    const { setLoadingText, setModal } = useModal()
    const { id } = useParams()

    const supabase = createClient()

    function beginSave() {
        signal.emit('beginSave')
        setModal('Loading')
        setLoadingText('Saving...')
    }

    useEffect(() => {
        const save = async (realmData: RealmData) => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                toast.error('You must be signed in to save.')
                return
            }

            const { error } = await saveRealm(session.access_token, realmData, id as string)

            revalidate('/editor/[id]')
            revalidate('/play/[id]')
            setModal('None')
            signal.emit('saved')
        }

        signal.on('save', save)

        return () => {
            signal.off('save', save)
        }
    }, [])

    return (
        <div className='w-full h-[48px] bg-secondary flex flex-row items-center p-2 border-b-2 border-black gap-2'>
            <div className='hover:bg-lightblue aspect-square grid place-items-center rounded-lg p-1'>
                <Link href={'/app'}>
                    <ArrowLeftEndOnRectangleIcon className='h-8 w-8 text-white'/>
                </Link>
            </div>
            <BasicButton onClick={beginSave} className='flex flex-row gap-2 items-center text-lg'>
                Save
                <FloppyDisk className='h-6 w-6'/>
            </BasicButton>
        </div>
    )
}

export default TopBar