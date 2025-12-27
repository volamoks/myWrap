import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Lock } from 'lucide-react';
import Snowfall from './Snowfall';

export default function PinScreen({ onUnlock, correctPin = '2024' }) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);

    const handleKeyPress = (num) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            if (newPin.length === 4) {
                if (newPin === correctPin) {
                    onUnlock();
                } else {
                    setError(true);
                    setTimeout(() => {
                        setPin('');
                        setError(false);
                    }, 600);
                }
            }
        }
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-pastel-cream text-text-soft p-8 overflow-hidden relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-6"
            >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Lock className="w-6 h-6 text-accent-red" />
                </div>

                <div className="text-center">
                    <h1 className="text-2xl font-display font-bold mb-2">Наш 2024-2025</h1>
                    <p className="text-sm opacity-60">Только для твоих глаз</p>
                </div>

                <motion.div
                    animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                    className="flex gap-4 my-8"
                >
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={`w-4 h-4 rounded-full border-2 border-accent-red transition-colors ${pin.length > i ? 'bg-accent-red' : 'bg-transparent'
                                }`}
                        />
                    ))}
                </motion.div>

                <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, ''].map((num, i) => (
                        num === '' ? <div key={i} /> : (
                            <button
                                key={i}
                                onClick={() => handleKeyPress(num)}
                                className="w-16 h-16 rounded-full bg-white text-xl font-medium flex items-center justify-center active:bg-pastel-red transition-colors shadow-sm"
                            >
                                {num}
                            </button>
                        )
                    ))}
                </div>

                <div className="mt-8 flex items-center gap-2 opacity-40 text-xs">
                    <Heart className="w-3 h-3 fill-current" />
                    <span>Made for you</span>
                </div>
            </motion.div>
        </div>
    );
}
