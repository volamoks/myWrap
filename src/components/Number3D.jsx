import React from 'react';

const Number3D = ({ value, theme = 'red' }) => {
    // Color palettes for gradients and 3D sides
    const colors = {
        blue: { top: '#4FC3F7', bottom: '#0288D1', side: '#01579B' },
        green: { top: '#81C784', bottom: '#388E3C', side: '#1B5E20' },
        yellow: { top: '#FFF176', bottom: '#FBC02D', side: '#F57F17' },
        purple: { top: '#E1BEE7', bottom: '#8E24AA', side: '#4A148C' },
        red: { top: '#EF5350', bottom: '#C62828', side: '#B71C1C' },
    };

    const c = colors[theme] || colors.red;
    const gradientId = `grad-${theme}`;
    const depth = 20; // Deep extrusion

    return (
        <div className="relative flex justify-center items-center py-4">
            {/* Large SVG canvas for Monoton */}
            {/* viewBox increased to 600x300 for massive numbers */}
            <svg width="100%" height="300" viewBox="0 0 600 300" className="overflow-visible">
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={c.top} />
                        <stop offset="100%" stopColor={c.bottom} />
                    </linearGradient>
                    <filter id="dropshadow" height="150%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
                        <feOffset dx="0" dy="10" result="offsetblur" />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.4" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <g className="select-none" style={{ fontFamily: '"Monoton", cursive', fontWeight: 400 }}>
                    {/* Render multiple layers for the "side" extrusion */}
                    {Array.from({ length: depth }).map((_, i) => (
                        <text
                            key={i}
                            x="50%"
                            y="80%"
                            textAnchor="middle"
                            fontSize="280"
                            letterSpacing="15"
                            fill={c.side}
                            transform={`translate(${i * 1}, ${i * 1})`}
                            style={{ opacity: 0.8 }}
                        >
                            {value}
                        </text>
                    ))}

                    {/* The main front face */}
                    <text
                        x="50%"
                        y="80%"
                        textAnchor="middle"
                        fontSize="280"
                        letterSpacing="15"
                        fill={`url(#${gradientId})`}
                        filter="url(#dropshadow)"
                        style={{ filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.3))' }}
                    >
                        {value}
                    </text>
                </g>
            </svg>
        </div>
    );
};

export default Number3D;
