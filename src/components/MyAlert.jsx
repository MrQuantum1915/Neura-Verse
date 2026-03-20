"use client"
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAlertStore } from '@/store/global/useAlertStore';

const MyAlert = ({ message: legacyMessage, duration = 5000, alertHandler }) => {
    const { alert: storeVisible, message: storeMessage } = useAlertStore();
    const [mounted, setMounted] = useState(false);
    const [legacyVisible, setLegacyVisible] = useState(false);
    const isLegacyMode = typeof legacyMessage === 'string';

    const visible = isLegacyMode ? legacyVisible : storeVisible;
    const resolvedMessage = isLegacyMode ? legacyMessage : storeMessage;
    const hasContent = typeof resolvedMessage === 'string' && resolvedMessage.trim().length > 0;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isLegacyMode) return;

        const visibleTimer = setTimeout(() => {
            setLegacyVisible(true);
        }, 100);

        const hideTimer = setTimeout(() => {
            setLegacyVisible(false);

            if (typeof alertHandler === 'function') {
                const handlerTimer = setTimeout(() => {
                    alertHandler(false);
                }, 500);

                return () => clearTimeout(handlerTimer);
            }
        }, duration);

        return () => {
            clearTimeout(visibleTimer);
            clearTimeout(hideTimer);
        };
    }, [isLegacyMode, duration, alertHandler]);

    if (!mounted || !hasContent) return null;

    return createPortal(
        <div
            className={`font-sans fixed left-1/2 -translate-x-1/2 border-2 border-red-600 bg-black z-[1000] text-red-600 px-8 py-4 font-bold uppercase tracking-widest transition-all duration-700 ease-in-out ${visible ? 'top-10 opacity-100' : '-top-24 opacity-0 pointer-events-none'}`}
        >
            {resolvedMessage}
        </div>,
        document.body
    );
};

export default MyAlert;
