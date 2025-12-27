import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Star, Cloud } from 'lucide-react';

export default function Ornaments({ theme }) {
    const getColor = () => {
        switch (theme) {
            case 'red': return 'text-accent-red/20';
            case 'blue': return 'text-accent-blue/20';
            case 'green': return 'text-accent-green/20';
            case 'yellow': return 'text-accent-yellow/20';
            case 'purple': return 'text-accent-purple/20';
            default: return 'text-accent-red/20';
        }
    };
    const color = getColor();

    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-50">
            {/* Top Left Cluster */}
            <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 6, repeat: Infinity }}
                className={`absolute -top-10 -left-10 ${color}`}
            >
                <Sparkles size={160} />
            </motion.div>

            {/* Bottom Right Cluster */}
            <motion.div
                animate={{ scale: [1, 1.1, 1], y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className={`absolute -bottom-16 -right-16 ${color}`}
            >
                <Heart size={200} fill="currentColor" />
            </motion.div>

            {/* Top Right */}
            <motion.div
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 4, repeat: Infinity }}
                className={`absolute top-12 right-12 ${color}`}
            >
                <Star size={80} fill="currentColor" />
            </motion.div>

            {/* Bottom Left */}
            <motion.div
                animate={{ x: [-10, 10, -10] }}
                transition={{ duration: 7, repeat: Infinity }}
                className={`absolute bottom-20 left-4 ${color}`}
            >
                <Sparkles size={60} />
            </motion.div>

            {/* Scattered bits */}
            <div className={`absolute top-1/2 left-8 ${color} opacity-50`}>
                <Heart size={24} fill="currentColor" />
            </div>
            <div className={`absolute top-1/4 right-20 ${color} opacity-40`}>
                <Sparkles size={32} />
            </div>
            <div className={`absolute bottom-1/4 right-8 ${color} opacity-60`}>
                <Star size={40} fill="currentColor" />
            </div>
            <div className={`absolute top-1/3 left-1/4 ${color} opacity-30`}>
                <Cloud size={100} fill="currentColor" />
            </div>
        </div>
    );
}
