'use client'

import { useState, useEffect } from 'react'

function ScreenWidePopUp({ headline, description, color, bgcolor, buttonName, buttonAction, triggerCause }) {

    // **NOTE** : two button pop up only

    const borderColorClass = color ? `border-${color}` : 'border-white';
    const shadowColorClass = color ? `shadow-${color}` : 'shadow-white';
    const bgColorClass = bgcolor ? `bg-${bgcolor}` : 'bg-white/10';

    const [visible, setVisible] = useState(false);

    // trigger animation on mount
    useEffect(() => {
        setTimeout(() => setVisible(true), 10);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(() => {
            triggerCause(() => false);
            buttonAction(() => false);
        }, 500);
    };

    return (
        <div
            className={`
                fixed inset-0 flex items-center justify-center z-100 h-screen w-full
                transition-all duration-500 ease-out
                ${visible ? 'bg-black/75' : 'bg-black/0'}
            `}
        >
            <div
                className={`
                    flex flex-col justify-center items-center border-2 border-white w-1/3 bg-black
                    transition-all duration-500 ease-out p-8
                    ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                `}
                style={{ transformOrigin: 'center' }}
            >
                <p className={`text-3xl my-4 mx-2 font-bold uppercase tracking-widest text-white`}>{headline}</p>
                <p className='text-lg my-4 mx-8 text-white/70 text-center'>{description}</p>
                <div className='flex flex-row gap-4 my-8 flex-wrap'>
                    <button
                        className={
                            `px-6 py-3 cursor-pointer border-2
                        border-white bg-black text-white font-bold uppercase tracking-widest
                        transition-all duration-300 ease-in-out
                        hover:bg-red-600 hover:border-red-600`
                        }
                        onClick={() => {
                            buttonAction(() => true);
                        }}>{buttonName}</button>
                    <button
                        className={
                            `px-6 py-3 cursor-pointer border-2
                            border-white bg-black text-white font-bold uppercase tracking-widest
                            transition-all duration-300 ease-in-out
                            hover:bg-white hover:text-black`
                        }
                        onClick={handleClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ScreenWidePopUp
