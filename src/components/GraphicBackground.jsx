import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const GraphicBackground = ({ theme = 'red', variantKey = 0 }) => {
    // Generate a deterministic pattern index based on the key
    const patterns = ['stripes', 'grid', 'circles', 'dots', 'rays'];
    const patternIndex = typeof variantKey === 'string'
        ? variantKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % patterns.length
        : variantKey % patterns.length;

    const pattern = patterns[patternIndex];

    const colors = {
        blue: { main: '#E1F5FE', accent: '#81D4FA', dark: '#0288D1' },
        green: { main: '#E8F5E9', accent: '#A5D6A7', dark: '#388E3C' },
        yellow: { main: '#FFFDE7', accent: '#FFF59D', dark: '#FBC02D' },
        purple: { main: '#F3E5F5', accent: '#CE93D8', dark: '#7B1FA2' },
        red: { main: '#FFEBEE', accent: '#EF9A9A', dark: '#D32F2F' },
    };

    const c = colors[theme] || colors.red;

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Base muted background color handled by CSS classes in parent, but we can add a subtle tint here if needed */}

            {/* Patterns are now treated as "Graphic Elements" - offset, large, asymmetrical */}
            <motion.div
                animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.4, 0.5, 0.4]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 z-0 mix-blend-multiply"
            >
                {pattern === 'stripes' && <StripesPattern color={c.accent} />}
                {pattern === 'grid' && <GridPattern color={c.accent} />}
                {pattern === 'circles' && <CirclesPattern color={c.accent} />}
                {pattern === 'dots' && <DotsPattern color={c.accent} />}
                {pattern === 'rays' && <RaysPattern color={c.accent} />}
            </motion.div>

            {/* Subtle noise overlay for texture */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'1\'/%3E%3C/svg%3E")'
            }} />

            {/* Digital "scanner" line sweep - Made more visible */}
            <motion.div
                animate={{ y: ['-10%', '110%'] }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-30 pointer-events-none blur-[1px]"
                style={{ color: c.accent }}
            />
        </div>
    );
};

// --- Pattern Components (Asymmetrical / Offset) ---

const StripesPattern = ({ color }) => (
    // Diagonal sash from bottom-left to top-right
    <svg width="100%" height="100%" className="opacity-40">
        <defs>
            <pattern id="stripes" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect x="0" y="0" width="20" height="80" fill={color} />
            </pattern>
        </defs>
        {/* Only cover the right side partially */}
        <rect x="30%" y="-50%" width="100%" height="200%" fill="url(#stripes)" transform="rotate(-15)" />
    </svg>
);

const GridPattern = ({ color }) => (
    // A "floor" grid that fades out
    <div className="w-full h-full flex flex-col justify-end" style={{ perspective: '800px' }}>
        <motion.div
            className="w-[150%] h-[100%] origin-bottom"
            style={{
                backgroundSize: '80px 80px',
                backgroundImage: `linear-gradient(to right, ${color} 2px, transparent 2px), linear-gradient(to bottom, ${color} 2px, transparent 2px)`,
                transform: 'rotateX(50deg) translateX(-10%)',
                maskImage: 'linear-gradient(to top, black 20%, transparent 90%)'
            }}
            animate={{ backgroundPosition: ['0px 0px', '0px 80px'] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        />
    </div>
);

const CirclesPattern = ({ color }) => (
    // Concentric circles rippling from Bottom-Right corner
    <svg width="100%" height="100%" className="opacity-80">
        {[...Array(4)].map((_, i) => (
            <motion.circle
                key={i}
                cx="90%" // Offset to right
                cy="90%" // Offset to bottom
                r={(i + 1) * 20 + "%"}
                stroke={color}
                strokeWidth="40" // Thicker, bolder graphic lines
                strokeOpacity="0.5"
                fill="none"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: [0, 0.6, 0] }}
                transition={{
                    repeat: Infinity,
                    duration: 10,
                    delay: i * 2,
                    ease: "easeInOut"
                }}
            />
        ))}
    </svg>
);

const DotsPattern = ({ color }) => (
    // Cluster of dots in Top-Right
    <svg width="100%" height="100%" className="opacity-50">
        <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="8" fill={color} />
            </pattern>
        </defs>
        {/* Large circle shape containing the dots pattern */}
        <circle cx="90%" cy="20%" r="40%" fill="url(#dots)" />
    </svg>
);

const RaysPattern = ({ color }) => (
    // Bursting from Top-Left corner
    <svg width="100%" height="100%" className="opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.g
            style={{ transformOrigin: '0% 0%' }} // Top Left Pivot
            animate={{ rotate: [0, 10, 0] }} // Gentle sway instead of full spin
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        >
            {[...Array(8)].map((_, i) => (
                <polygon
                    key={i}
                    points="0,0 200,20 200,60" // Long rays extending out
                    fill={color}
                    transform={`rotate(${i * 25 - 10} 0 0)`}
                />
            ))}
        </motion.g>
    </svg>
);

export default GraphicBackground;
