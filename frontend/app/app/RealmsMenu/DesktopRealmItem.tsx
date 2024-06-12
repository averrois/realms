import { DotsThreeVertical } from '@phosphor-icons/react'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useModal } from '@/app/hooks/useModal'
import Link from 'next/link'

type DesktopRealmItemProps = {
    name: string,
    id: string
}

const DesktopRealmItem:React.FC<DesktopRealmItemProps> = ({ name, id }) => {
    
    const [showMenu, setShowMenu] = useState<boolean>(false)  
    const router = useRouter()
    const menuRef = useRef<HTMLDivElement>(null)
    const dotsRef = useRef<HTMLDivElement>(null)
    const { setRealmToDelete, setModal } = useModal()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) && dotsRef.current && !dotsRef.current.contains(event.target as Node)) {
                setShowMenu(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    function handleDotsClick() {
        setShowMenu(!showMenu)
    }

    function handleDelete() {
        setRealmToDelete({ name, id })
        setModal('Delete Realm')
    }

    return (
        <div className='relative select-none'>
            <Link href={`/play/${id}`}>
                <div className='w-full aspect-video rounded-3xl overflow-hidden relative'>
                    <img src='/pixel-screenshot.jpg' />
                    <div className='animate-pulse w-full h-full bg-secondary'/>
                </div>
            </Link>
            <div className='mt-1 flex flex-row justify-between'>
                <p>{name}</p>
                <div ref={dotsRef}>
                    <DotsThreeVertical className='h-7 w-7 cursor-pointer hover:bg-neutral-900 rounded-md p-1' onClick={handleDotsClick}/>
                </div>
            </div>
            {showMenu && (
                <div className='absolute w-36 h-24 rounded-lg bg-secondary right-0 flex flex-col z-10' ref={menuRef}>
                    <button className='grow w-full hover:bg-secondaryhover rounded-t-lg text-left pl-4' onClick={() => router.push(`/editor/${id}`)}>
                        Edit Map
                    </button>
                    <button className='grow w-full hover:bg-secondaryhover text-left pl-4' onClick={() => router.push(`/manage/${id}`)}>Manage</button>
                    <button className='grow w-full hover:bg-red-500 rounded-b-lg text-left pl-4' onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    )
}

export default DesktopRealmItem