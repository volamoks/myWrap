import React from 'react';
import { motion } from 'framer-motion';

const SectionHeader = ({ children, className = '' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center justify-center mb-8 ${className}`}
        >
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-[#263238] text-center leading-none">
                {children}
            </h2>
            {/* Decorative Underline */}
            <div className="h-1.5 w-20 bg-[#263238] opacity-20 mt-4 rounded-full" />
        </motion.div>
    );
};

export default SectionHeader;
