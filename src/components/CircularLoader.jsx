'use client';
import React from 'react';

const CircularLoader = ({ size, color }) => {
    const borderColor = `border-t-${color}`
    
    return (
        <div className={`w-${size} h-${size} animate-spin rounded-full border-4 border-gray-700 ${borderColor}`}>
        </div>
    );
};

export default CircularLoader;
