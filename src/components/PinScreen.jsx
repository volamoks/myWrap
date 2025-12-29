import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import GraphicBackground from './GraphicBackground';
import ScrambleText from './ScrambleText';

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
            {/* Digital Overlay Layers */}
            <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden opacity-[0.03]">
                {/* Scanlines */}
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.2) 50%)',
                    backgroundSize: '100% 4px'
                }} />
                {/* Moving Scanline Bar */}
                <motion.div
                    animate={{ y: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="absolute w-full h-[20%] bg-gradient-to-b from-transparent via-black/10 to-transparent"
                />
            </div>

            {/* Blue theme requested */}
            <GraphicBackground theme="blue" variantKey="cover" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 flex flex-col items-center w-full max-w-2xl"
            >
                {/* Main Lockup: Tree Left | Text Right */}
                <div className="flex flex-row items-center justify-center w-full gap-4 mb-12 px-2">
                    {/* Left: Tree - Bigger */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex-shrink-0"
                    >
                        <img
                            src="/hero-tree.png"
                            alt="Tree"
                            className="w-[280px] h-auto object-contain drop-shadow-2xl rotate-[-3deg]"
                        />
                    </motion.div>

                    {/* Right: Stacked Text - Massive & Fluid */}
                    <div className="flex flex-col items-start relative z-10">
                        <span className="text-xl font-bold tracking-[0.4em] opacity-50 text-[#263238] uppercase mb-1 md:mb-4 ml-2">
                            НАШ
                        </span>
                        <h1 className="text-[clamp(6rem,25vw,12rem)] font-normal text-[#0288D1] leading-[0.8] select-none"
                            style={{ fontFamily: '"Monoton", cursive' }}>
                            <ScrambleText>20</ScrambleText>
                        </h1>
                        <h1 className="text-[clamp(6rem,25vw,12rem)] font-normal text-[#0288D1] leading-[0.8] select-none"
                            style={{ fontFamily: '"Monoton", cursive' }}>
                            <ScrambleText>25</ScrambleText>
                        </h1>
                    </div>
                </div>

                <p className="text-lg font-bold tracking-[0.2em] mb-10 opacity-70 text-[#263238] uppercase">
                    Надо всего лишь ввести код
                </p>

                <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-6">
                    <div className="flex flex-col items-center gap-3">
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
                                    transition-all placeholder:text-black/10
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
                        {/* Hint Moved Here and Secret Removed */}
                        <p className="text-xs font-bold opacity-40 uppercase tracking-widest text-[#263238] animate-pulse">

                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={pin.length < 4}
                        className="
                            mt-2 bg-black text-white px-12 py-4 rounded-full font-bold 
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
