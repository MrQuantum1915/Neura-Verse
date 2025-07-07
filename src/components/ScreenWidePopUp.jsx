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
                    flex flex-col justify-center items-center rounded-2xl border-3 ${borderColorClass} shadow-2xl shadow-red-800/75 w-1/3 bg-black
                    transition-all duration-500 ease-out
                    ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                `}
                style={{ transformOrigin: 'center' }}
            >
                <p className={`text-4xl my-4 mx-2 font-bold text-blue-100`}>{headline}</p>
                <p className='text-2xl my-4 mx-8 text-blue-100'>{description}</p>
                <div className='flex flex-row gap-4 my-4 flex-wrap'>
                    <button
                        className={
                            `px-4 py-2 cursor-pointer border-2
                        ${bgColorClass}
                        ${borderColorClass} rounded-lg
                        transition-all duration-300 ease-in-out
                        hover:opacity-75`
                        }
                        onClick={() => {
                            buttonAction(() => true);
                        }}>{buttonName}</button>
                    <button
                        className={
                            `px-4 py-2 cursor-pointer border-2
                            border-cyan-400 bg-white/10
                            rounded-lg
                            transition-all duration-300 ease-in-out
                            hover:bg-white/20`
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
