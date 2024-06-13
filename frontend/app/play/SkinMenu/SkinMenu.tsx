import React, { useState } from 'react'
import Modal from '@/components/Modal/Modal'
import { useModal } from '@/app/hooks/useModal'
import AnimatedCharacter from './AnimatedCharacter'
import { ArrowFatLeft, ArrowFatRight } from '@phosphor-icons/react'
import BasicButton from '@/components/BasicButton'

type SkinMenuProps = {
    
}

const SkinMenu:React.FC<SkinMenuProps> = () => {

    const { modal } = useModal()

    const [skin, setSkin] = useState<string>('009')
    
    return (
        <Modal open={modal === 'Skin'} closeOnOutsideClick>
            <div className='w-96 h-96 flex flex-col items-center justify-between'>
                <AnimatedCharacter src={`/sprites/characters/Character_${skin}.png`} className='w-48'/>
                <div className='flex flex-row items-center justify-center gap-4 mb-16'>
                    <button className='hover:bg-secondaryhover aspect-square grid place-items-center rounded-lg p-1'>
                        <ArrowFatLeft className='h-12 w-12'/>
                    </button>
                    <BasicButton>
                        Switch
                    </BasicButton>
                    <button className='hover:bg-secondaryhover aspect-square grid place-items-center rounded-lg p-1'>
                        <ArrowFatRight className='h-12 w-12'/>
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default SkinMenu