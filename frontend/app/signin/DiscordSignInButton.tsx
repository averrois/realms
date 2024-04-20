import React from 'react'

type DiscordSignInButtonProps = {
    onClick: () => void
}

const DiscordSignInButton:React.FC<DiscordSignInButtonProps> = ({ onClick }) => {
    
    return (
        <button className='h-16 w-64 bg-[#5764F2] rounded-md flex items-center justify-center space-x-3 p-2' onClick={onClick}>
            <img src='/discord-mark-white.png' alt="Discord logo" className='h-10' />
            <span className='text-white font-medium'>Sign in with Discord</span>
        </button>
    );
}

export default DiscordSignInButton