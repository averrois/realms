'use client'
import React, { useState } from 'react'
import Dropdown from '@/components/Dropdown'
import BasicButton from '@/components/BasicButton'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-toastify'
import revalidate from '@/utils/revalidate'
import { useModal } from '../hooks/useModal'
import { Copy } from '@phosphor-icons/react'
import { v4 as uuidv4 } from 'uuid'

type ManageChildProps = {
    realmId: string
    privacyLevel: 'anyone' | 'discord'
    startingShareId: string
}

const privacyOptions = [
    'anyone with share link',
    'anyone in the discord server'
]

const ManageChild:React.FC<ManageChildProps> = ({ realmId, privacyLevel, startingShareId }) => {

    const [selectedTab, setSelectedTab] = useState(0)
    const [privacy, setPrivacy] = useState(getDropdownValue())
    const [shareId, setShareId] = useState(startingShareId)
    const { setModal } = useModal()

    const supabase = createClient()

    function getDropdownValue() {
        if (privacyLevel === 'anyone') {
            return 'anyone with share link'
        } else {
            return 'anyone in the discord server'
        }
    }

    function getPrivacyLevel() {
        if (privacy === 'anyone with share link') {
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

    function copyLink() {
        const link = process.env.NEXT_PUBLIC_BASE_URL + '/play/' + realmId + '?shareId=' + shareId
        navigator.clipboard.writeText(link)
        toast.success('Link copied!')
    }

    async function generateNewLink() {
        setModal('Loading')

        const newShareId = uuidv4()
        const { error } = await supabase
            .from('realms')
            .update({ 
                share_id: newShareId
                })
            .eq('id', realmId)

        if (error) {
            toast.error(error.message)
        } else {
            setShareId(newShareId)
            const link = process.env.NEXT_PUBLIC_BASE_URL + '/play/' + realmId + '?shareId=' + newShareId
            navigator.clipboard.writeText(link)
            toast.success('New link copied!')
        }

        revalidate('/manage/[id]')
        setModal('None')
    }

    return (
        <div className='flex flex-col items-center pt-24'>
            <div className='flex flex-row gap-8 relative'>
                <div className='flex flex-col h-[500px] w-[200px] border-white border-r-2 pr-4 gap-2'>
                    <h1 className={`${selectedTab === 0 ? 'font-bold' : ''} cursor-pointer`} onClick={() => setSelectedTab(0)}>Sharing Options</h1> 
                    <h1 className={`${selectedTab === 1 ? 'font-bold' : ''} cursor-pointer`} onClick={() => setSelectedTab(1)}>Discord Channel</h1> 
                </div>
                <div className='flex flex-col w-[300px]'>
                    {selectedTab === 0 && (
                        <div className='flex flex-col gap-2'>
                            Who can join this realm?
                            <div>
                                <Dropdown items={privacyOptions} selectedItem={privacy} setSelectedItem={setPrivacy}/>
                            </div>
                            <BasicButton className='flex flex-row items-center gap-2 text-sm max-w-max' onClick={copyLink}>
                                Copy Link <Copy />
                            </BasicButton>
                            <BasicButton className='flex flex-row items-center gap-2 text-sm max-w-max' onClick={generateNewLink}>
                                Generate New Link <Copy />
                            </BasicButton>
                        </div>
                    )}
                    </div>
                <BasicButton className='absolute bottom-[-50px] right-0' onClick={save}>
                    Save
                </BasicButton>
            </div>
        </div>
    )
}

export default ManageChild