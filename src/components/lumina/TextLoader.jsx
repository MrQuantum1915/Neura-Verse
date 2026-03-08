import React from 'react';

const TextLoader = ({ currentLoadingMessage }) => {
    return (
        <div className="flex items-center py-2 px-1">
            <div className="loader-wrapper">
                <div className="loader" />
                <div className="letter-wrapper px-4 text-orange-400 text-sm font-medium">
                    {currentLoadingMessage.split('').map((char, i) => (
                        <span key={i} className="loader-letter">
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TextLoader;
