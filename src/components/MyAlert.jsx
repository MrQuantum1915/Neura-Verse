"use client"
import React, { useEffect, useState } from 'react';

const MyAlert = ({ message, duration = 5000, alertHandler }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const visibleTimer = setTimeout(() => {
            setVisible(true); // show alert
        }, 100);

        // Hide alert after duration
        const hideTimer = setTimeout(() => {
            setVisible(false);

            // Wait a short time before calling alertHandler (e.g., 500ms)
            const handlerTimer = setTimeout(() => {
                alertHandler(false);
            }, 500);

            // Cleanup handlerTimer
            return () => clearTimeout(handlerTimer);
        }, duration);

        // Cleanup all timers
        return () => {
            clearTimeout(visibleTimer);
            clearTimeout(hideTimer);
        };
    }, [duration, alertHandler]);

    return (
        <div
            className={`fixed left-150 right-150 border-2 border-red-500 bg-[#540101]   z-1000 rounded-lg  text-white p-2 text-center font-bold transition-all duration-1000 ease-in-out ${visible ? 'top-5' : '-top-24 pointer-events-none'}`}
        >
            {message}
        </div>
    );
};

export default MyAlert;
