import React from 'react';
import { motion } from 'framer-motion';

const GeometricTree = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-[35vh] w-[18vh] pointer-events-none"
        >
            <svg
                viewBox="0 0 100 200"
                className="h-full w-full overflow-visible"
                preserveAspectRatio="none"
            >
                {/* 
                    Tree Tiers - 3 Triangles
                    Colors picked to match the reference:
                    - Light green: #E8F5E9 / #DCFCE7
                    - Shadow/Accent green: #A5D6A7 / #86EFAC
                    - Ornament: #FFF3E0 (Beige/Peach)
                */}

                {/* Bottom Tier */}
                <g transform="translate(0, 100) scale(1.5)">
                    {/* Shadow/Back Layer */}
                    <path d="M0,50 L55,50 L5,5 Z" fill="#4ADE80" opacity="0.5" />
                    {/* Main Triangle */}
                    <path d="M0,45 L50,45 L0,0 Z" fill="#DCFCE7" />
                    {/* Ornament */}
                    <g transform="translate(30, 55)">
                        <circle r="6" fill="#FEF3C7" />
                        <line x1="-3" y1="-3" x2="3" y2="3" stroke="#555" strokeWidth="0.5" />
                        <line x1="0" y1="-6" x2="0" y2="-10" stroke="#555" strokeWidth="0.5" /> {/* String */}
                    </g>
                </g>

                {/* Middle Tier */}
                <g transform="translate(0, 50) scale(1.3)">
                    {/* Shadow */}
                    <path d="M0,50 L55,50 L5,5 Z" fill="#4ADE80" opacity="0.5" />
                    {/* Main */}
                    <path d="M0,45 L50,45 L0,0 Z" fill="#DCFCE7" />
                    {/* Ornament */}
                    <g transform="translate(32, 55)">
                        <circle r="6" fill="#FEF3C7" />
                        <line x1="-3" y1="3" x2="3" y2="-3" stroke="#555" strokeWidth="0.5" />
                        <line x1="0" y1="-6" x2="0" y2="-10" stroke="#555" strokeWidth="0.5" /> {/* String */}
                    </g>
                </g>

                {/* Top Tier */}
                <g transform="translate(0, 10) scale(1.1)">
                    {/* Shadow */}
                    <path d="M0,50 L55,50 L5,5 Z" fill="#4ADE80" opacity="0.5" />
                    {/* Main */}
                    <path d="M0,45 L50,45 L0,0 Z" fill="#DCFCE7" />
                    {/* Ornament */}
                    <g transform="translate(32, 55)">
                        <circle r="6" fill="#FEF3C7" />
                        <line x1="-3" y1="-3" x2="3" y2="3" stroke="#555" strokeWidth="0.5" />
                        <line x1="0" y1="-6" x2="0" y2="-10" stroke="#555" strokeWidth="0.5" /> {/* String */}
                    </g>
                </g>
            </svg>
        </motion.div>
    );
};

export default GeometricTree;
