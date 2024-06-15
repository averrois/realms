import React, { useState, useEffect } from 'react'
import Modal from '@/components/Modal/Modal'
import { useModal } from '@/app/hooks/useModal'
import AnimatedCharacter from './AnimatedCharacter'
import { ArrowFatLeft, ArrowFatRight } from '@phosphor-icons/react'
import BasicButton from '@/components/BasicButton'
import { skins, defaultSkin } from '@/utils/pixi/Player/skins'
import signal from '@/utils/signal'
import { createClient } from '@/utils/supabase/client'

type SkinMenuProps = {
    
}

const SkinMenu:React.FC<SkinMenuProps> = () => {

    const { modal, setModal } = useModal()

    const [skinIndex, setSkinIndex] = useState<number>(skins.indexOf(defaultSkin))

    const supabase = createClient()

    function decrement() {
        setSkinIndex((prevIndex) => (prevIndex - 1 + skins.length) % skins.length)
    }

    function increment() {
        setSkinIndex((prevIndex) => (prevIndex + 1) % skins.length)
    }

    useEffect(() => {
        const onGotSkin = (skin: string) => {
            setSkinIndex(skins.indexOf(skin))
        }

        signal.on('skin', onGotSkin)

        return () => {
            signal.off('skin', onGotSkin)
        }
    }, [])

    async function onClickSwitch() {
        const newSkin = skins[skinIndex]
        // update profile on supabase with different skin
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
                .from('profiles')
                .update({ skin: newSkin })
                .eq('id', user.id)

        if (error) return

        signal.emit('switchSkin', newSkin)
        setModal('None')
    }
    
    return (
        <Modal open={modal === 'Skin'} closeOnOutsideClick>
            <div className='w-96 h-96 flex flex-col items-center justify-between pt-8'>
                <p>{skinIndex + 1} / {skins.length}</p>
                <AnimatedCharacter src={`/sprites/characters/Character_${skins[skinIndex]}.png`} className='w-48'/>
                <div className='flex flex-row items-center justify-center gap-4 mb-12'>
                    <button className='hover:bg-secondaryhover aspect-square grid place-items-center rounded-lg p-1 outline-none' onClick={decrement}>
                        <ArrowFatLeft className='h-12 w-12'/>
                    </button>
                    <BasicButton className='font-bold' onClick={onClickSwitch}>
                        Switch
                    </BasicButton>
                    <button className='hover:bg-secondaryhover aspect-square grid place-items-center rounded-lg p-1 outline-none' onClick={increment}>
                        <ArrowFatRight className='h-12 w-12'/>
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default SkinMenu