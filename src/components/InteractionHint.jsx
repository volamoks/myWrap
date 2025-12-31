import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand } from 'lucide-react';

export default function InteractionHint({ show, onDismiss }) {
    if (!show) return null;

    useEffect(() => {
        const timer = setTimeout(onDismiss, 4000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center"
            >
                <div className="bg-black/70 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 text-white shadow-xl mt-32">
                    <motion.div
                        animate={{
                            scale: [1, 0.9, 1],
                            rotate: [0, -10, 0]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity
                        }}
                    >
                        <Hand size={24} />
                    </motion.div>
                    <span className="font-display font-medium text-sm">Tap the photo!</span>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
