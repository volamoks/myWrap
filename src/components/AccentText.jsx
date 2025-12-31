import React from 'react';

const AccentText = ({ children, className = '', theme = 'blue', size = 'text-6xl' }) => {
    // Theme colors for the 3D shadow effect (using the darker/bottom shade for shadow)
    const colors = {
        blue: '#0288D1',
        green: '#388E3C',
        yellow: '#FBC02D',
        purple: '#8E24AA',
        red: '#C62828',
    };

    const shadowColor = colors[theme] || colors.blue;

    return (
        <span
            className={`font-normal inline-block ${size} ${className}`}
            style={{
                fontFamily: '"Rampart One", cursive',
                color: '#FFFFFF',
                WebkitTextStroke: `1.5px ${shadowColor}`,
                lineHeight: '0.85',
                letterSpacing: '-0.05em',
                paintOrder: 'stroke fill',
            }}
        >
            {children}
        </span>
    );
};

export default AccentText;
