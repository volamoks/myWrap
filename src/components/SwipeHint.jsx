import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand } from 'lucide-react';

export default function SwipeHint({ show, direction = 'left', onDismiss }) {
    if (!show) return null;

    useEffect(() => {
        const timer = setTimeout(onDismiss, 4000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    const xMove = direction === 'left' ? -50 : 50;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center mb-[-20vh]" // Lower on screen
            >
                <div className="flex flex-col items-center gap-4 opacity-80 mix-blend-multiply">
                    <motion.div
                        animate={{
                            x: [0, xMove, 0],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="bg-white/80 p-3 rounded-full backdrop-blur-sm shadow-lg"
                    >
                        <Hand size={32} className="text-text-soft" />
                    </motion.div>
                    <span className="font-display font-medium text-text-soft bg-white/60 px-3 py-1 rounded-full text-sm">
                        {direction === 'left' ? 'Swipe Left' : 'Swipe Right'}
                    </span>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
