import React from 'react';

type LeftBarProps = {
    
};

const LeftBar:React.FC<LeftBarProps> = () => {
    
    return (
        <div className='w-[48px] bg-secondary absolute left-0 top-[48px] flex flex-col items-center p-1' style={{height: 'calc(100vh - 48px)'}}>
            
        </div>
    )
}
export default LeftBar;