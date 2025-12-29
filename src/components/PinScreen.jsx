import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import GraphicBackground from './GraphicBackground';

export default function PinScreen({ onUnlock, correctPin = '2024' }) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pin === correctPin) {
            onUnlock();
        } else {
            setError(true);
            setPin('');
            setTimeout(() => setError(false), 500);
        }
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center p-4 bg-pastel-cream overflow-hidden">
            {/* Use a vibrant theme for the cover. 'red' matches the 3D numbers style often used. */}
            <GraphicBackground theme="red" variantKey="cover" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 flex flex-col items-center w-full max-w-sm"
            >
                {/* Massive Monoton Title - Poster Style */}
                <h1 className="text-7xl mb-2 text-center leading-none text-[#D32F2F] select-none uppercase"
                    style={{ fontFamily: '"Monoton", cursive', letterSpacing: '0px' }}>
                    НАШ 2025
                </h1>

                <p className="text-xl font-bold tracking-[0.3em] mb-12 opacity-60 text-black uppercase">
                    ТОЛЬКО ДЛЯ ТЕБЯ
                </p>

                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6">
                    <div className="relative group">
                        <input
                            type="tel"
                            value={pin}
                            onChange={(e) => {
                                setPin(e.target.value);
                                setError(false);
                            }}
                            className={`
                                w-48 py-2 text-center text-4xl font-bold tracking-[0.5em] 
                                bg-transparent border-b-2 focus:outline-none 
                                transition-all placeholder:text-black/10 font-mono
                                ${error
                                    ? 'border-red-500 text-red-500'
                                    : 'border-black/30 focus:border-black text-black'
                                }
                            `}
                            placeholder="••••"
                            maxLength={4}
                            autoFocus
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={pin.length < 4}
                        className="
                            mt-4 bg-black text-white px-10 py-4 rounded-full font-bold 
                            uppercase tracking-widest flex items-center gap-2 
                            shadow-xl transition-all
                            disabled:opacity-0 disabled:translate-y-4
                        "
                    >
                        START <ArrowRight size={16} />
                    </motion.button>

                    {error && (
                        <motion.p
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-red-600 font-bold text-sm bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm"
                        >
                            WRONG PIN
                        </motion.p>
                    )}
                </form>
            </motion.div>
        </div>
    );
}
