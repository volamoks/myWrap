import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function HeartReaction() {
    const [hearts, setHearts] = useState([]);

    const addHearts = useCallback(() => {
        const timestamp = Date.now();
        // Spawn a burst of 12-20 hearts (Increased!)
        const count = Math.floor(Math.random() * 8) + 12;
        const newHearts = Array.from({ length: count }).map((_, i) => ({
            id: `${timestamp}-${i}`,
            x: Math.random() * 120 - 60, // Wider spread
            scale: Math.random() * 0.5 + 0.8, // 0.8 to 1.3
            rotate: Math.random() * 40 - 20,
            duration: Math.random() * 1.5 + 1.5, // 1.5 to 3.0s
            delay: Math.random() * 0.3
        }));

        setHearts(prev => [...prev, ...newHearts]);

        setTimeout(() => {
            setHearts(prev => prev.filter(h => !newHearts.some(nh => nh.id === h.id)));
        }, 3000);
    }, []);

    return (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[70] flex flex-col items-center">
            {/* Flying Hearts Container */}
            <div className="absolute bottom-full mb-4 w-60 h-96 pointer-events-none flex justify-center">
                <AnimatePresence>
                    {hearts.map(heart => (
                        <motion.div
                            key={heart.id}
                            initial={{ opacity: 0, y: 20, x: 0, scale: 0 }}
                            animate={{
                                opacity: [0, 1, 1, 0],
                                y: -500 - Math.random() * 200, // Higher!
                                x: heart.x,
                                scale: heart.scale,
                                rotate: heart.rotate
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: heart.duration,
                                ease: "easeOut",
                                delay: heart.delay
                            }}
                            className="absolute bottom-0 text-accent-red drop-shadow-sm"
                        >
                            <Heart className="w-10 h-10 fill-current" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* The Button with Hint Animation */}
            <div className="relative">
                {/* Pulse Ring Hint */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-accent-red rounded-full opacity-20"
                />

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ scale: [1, 1.05, 1] }} // Subtle heartbeat
                    transition={{
                        scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                        default: { duration: 0.2 }
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        addHearts();
                    }}
                    className="relative w-16 h-16 bg-white/90 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center text-accent-red hover:bg-white transition-colors border border-white/50"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                    <Heart className="w-8 h-8 fill-current" />
                </motion.button>
            </div>
        </div>
    );
}
