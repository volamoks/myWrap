import React from 'react';
import { useScrambleText } from '../hooks/useScrambleText';

const Number3D = ({ value, theme = 'red' }) => {
    const displayValue = useScrambleText(value);

    // Color palettes for gradients
    const colors = {
        blue: { top: '#4FC3F7', bottom: '#0288D1' },
        green: { top: '#81C784', bottom: '#388E3C' },
        yellow: { top: '#FFF176', bottom: '#FBC02D' },
        purple: { top: '#E1BEE7', bottom: '#8E24AA' },
        red: { top: '#EF5350', bottom: '#C62828' },
    };

    const c = colors[theme] || colors.red;
    const gradientId = `grad-${theme}`;

    return (
        <div className="relative flex justify-center items-center py-4 w-full">
            <svg width="100%" height="250" viewBox="0 0 600 250" className="overflow-visible">
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={c.top} />
                        <stop offset="100%" stopColor={c.bottom} />
                    </linearGradient>
                    {/* Hard shadow for "sticker" look */}
                    <filter id="shadow">
                        <feDropShadow dx="4" dy="4" stdDeviation="0" floodColor="#263238" floodOpacity="1" />
                    </filter>
                </defs>

                <text
                    x="50%"
                    y="80%"
                    textAnchor="middle"
                    fontSize="220"
                    fill={`url(#${gradientId})`}
                    style={{
                        fontFamily: '"Monoton", cursive',
                        filter: 'url(#shadow)'
                    }}
                >
                    {displayValue}
                </text>
            </svg>
        </div>
    );
};

export default Number3D;
