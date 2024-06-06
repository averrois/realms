'use client'
import React, { useState } from 'react'
import Dropdown from '@/components/Dropdown'
import BasicButton from '@/components/BasicButton'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-toastify'
import revalidate from '@/utils/revalidate'
import { useModal } from '../hooks/useModal'

type ManageChildProps = {
    realmId: string
    privacyLevel: 'anyone' | 'discord'
}

const privacyOptions = [
    'anyone with link',
    'anyone in the discord server'
]

const ManageChild:React.FC<ManageChildProps> = ({ realmId, privacyLevel }) => {

    const [selectedTab, setSelectedTab] = useState(0)
    const [privacy, setPrivacy] = useState(getDropdownValue())
    const { setModal } = useModal()

    const supabase = createClient()

    function getDropdownValue() {
        if (privacyLevel === 'anyone') {
            return 'anyone with link'
        } else {
            return 'anyone in the discord server'
        }
    }

    function getPrivacyLevel() {
        if (privacy === 'anyone with link') {
            return 'anyone'
        } else {
            return 'discord'
        }
    }

    async function save() {
        setModal('Loading')

        const { error } = await supabase
            .from('realms')
            .update({ 
                privacy_level: getPrivacyLevel()
                })
            .eq('id', realmId)

        if (error) {
            toast.error(error.message)
        } else {
            toast.success('Saved!')
        }

        revalidate('/manage/[id]')
        setModal('None')
    }
    
    return (
        <div className='flex flex-col items-center pt-24'>
            <div className='flex flex-row gap-8 relative'>
                <div className='flex flex-col h-[500px] border-white border-r-2 pr-4 gap-2'>
                    <h1 className={`${selectedTab === 0 ? 'font-bold' : ''} cursor-pointer`}>Sharing Options</h1> 
                </div>
                {selectedTab === 0 && (
                    <div className='flex flex-col'>
                        <div className='flex flex-col gap-2'>
                            Who can join this realm?
                            <Dropdown items={privacyOptions} selectedItem={privacy} setSelectedItem={setPrivacy}/>
                        </div>
                    </div>
                )}
                <BasicButton className='absolute bottom-[-50px] right-0' onClick={save}>
                    Save
                </BasicButton>
            </div>
        </div>
    )
}

export default ManageChild