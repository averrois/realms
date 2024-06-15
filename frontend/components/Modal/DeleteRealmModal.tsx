import React, { useState } from 'react'
import Modal from './Modal'
import { useModal } from '@/app/hooks/useModal'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-toastify'
import revalidate from '@/utils/revalidate'

type DeleteRealmModalProps = {
    
}

const DeleteRealmModal:React.FC<DeleteRealmModalProps> = () => {
    
    const { modal, realmToDelete, setModal } = useModal()
    const [loading, setLoading] = useState<boolean>(false)

    const onClickDelete = async () => {
        const supabase = createClient()
        setLoading(true)

        const { error } = await supabase.from('realms').delete().eq('id', realmToDelete.id) 

        if (error) {
            setLoading(false)
            toast.error(error.message)
        }

        if (!error) {
            revalidate('/app')
            window.location.reload()
        }
    }

    const onClickCancel = () => {
        setModal('None')
    }

    return (
        <Modal open={modal === 'Delete Realm'} closeOnOutsideClick>
            <div className='p-2 flex flex-col items-center gap-2'>
                <h1 className='text-center'>Are you sure you want to delete <span className='text-red-500'>{realmToDelete.name}</span>? It will be gone forever!</h1>
                <div className={`flex flex-row items-center gap-2 ${loading ? 'pointer-events-none' : ''}`}>
                    <button className='bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md outline-none' onClick={onClickDelete}>Delete</button>
                    <button className='bg-darkblue hover:bg-lightblue text-white px-2 py-1 rounded-md outline-none' onClick={onClickCancel}>Cancel</button>
                </div>
            </div>
        </Modal>
    )
}

export default DeleteRealmModal