'use client'
import signal from '@/utils/signal'
import React, { useState, useEffect, useRef } from 'react'

type ChatLogProps = {
    
}

type Message = {
    content: string,
    username: string
}

const ChatLog:React.FC<ChatLogProps> = () => {
    
    const [messages, setMessages] = useState<Message[]>([])
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const onNewMessage = (message: Message) => {
            setMessages([message, ...messages])
            containerRef.current?.scrollTo(0, containerRef.current.scrollHeight)
        }

        signal.on('newMessage', onNewMessage)

        return () => {
            signal.off('newMessage', onNewMessage)
        }
    }, [messages])

    return (
        <div className='hidden sm:flex absolute top-0 left-0 flex-col-reverse pt-4 pl-2 w-[400px] h-[100px] text-sm md:text-base md:h-[200px] overflow-y-scroll no-scrollbar' ref={containerRef}>
            {messages.map((message, index) => (
                <div key={index}>
                    <span className='font-bold'>{message.username}:</span> {message.content}
                </div>
            ))}
        </div>
    )
}

export default ChatLog