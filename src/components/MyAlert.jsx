"use client"
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const MyAlert = ({ message, duration = 5000, alertHandler }) => {
    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const visibleTimer = setTimeout(() => {
            setVisible(true);
        }, 100);

        const hideTimer = setTimeout(() => {
            setVisible(false);

            const handlerTimer = setTimeout(() => {
                alertHandler(false);
            }, 500);

            return () => clearTimeout(handlerTimer);
        }, duration);

        return () => {
            clearTimeout(visibleTimer);
            clearTimeout(hideTimer);
        };
    }, [duration, alertHandler]);

    if (!mounted) return null;

    return createPortal(
        <div
            className={`fixed left-150 right-150 border-2 border-red-500 bg-[#540101]  z-[200] rounded-lg  text-white p-2 text-center font-bold transition-all duration-1000 ease-in-out ${visible ? 'top-5' : '-top-24 pointer-events-none'}`}
        >
            {message}
        </div>,
        document.body
    );
};

export default MyAlert;
