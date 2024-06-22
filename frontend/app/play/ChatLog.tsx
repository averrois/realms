'use client'
import signal from '@/utils/signal'
import React, { useState, useEffect, useRef } from 'react'
import { Chat, ArrowUpLeft } from '@phosphor-icons/react'

type ChatLogProps = {}

type Message = {
    content: string,
    username: string
}

const ChatLog: React.FC<ChatLogProps> = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [expanded, setExpanded] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const onNewMessage = (message: Message) => {
            setMessages(prevMessages => [message, ...prevMessages])
            containerRef.current?.scrollTo(0, containerRef.current.scrollHeight)
        }

        signal.on('newMessage', onNewMessage)

        return () => {
            signal.off('newMessage', onNewMessage)
        }
    }, [])

    const expand = () => {
        setExpanded(true)
    }

    const collapse = () => {
        setExpanded(false)
    }

    return (
        <div className='absolute top-0 left-0'>
            {!expanded && (
                <div
                    className='bg-secondary hover:bg-lightblue p-2 grid place-items-center rounded-br-lg cursor-pointer'
                    onClick={expand}
                >
                    <Chat className='h-7 w-7' />
                </div>
            )}
            {expanded && (
                <div className='bg-secondary w-[400px] h-[200px] rounded-br-lg transparent-scrollbar relative p-1 border-b-8 border-r-8 border-darkblue'>
                    <div className='cursor-pointer absolute bottom-[-8px] right-[-8px] rounded-tl-lg rounded-br-lg bg-darkblue hover:bg-lightblue p-2' onClick={collapse}>
                        <ArrowUpLeft className='h-4 w-4' />
                    </div>
                    <div className='w-full h-full flex flex-col-reverse overflow-y-scroll'>
                        {messages.map((message, index) => (
                            <div key={index}>
                                <span className='font-bold'>{message.username}:</span> {message.content}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChatLog
