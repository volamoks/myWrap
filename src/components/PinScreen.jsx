import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import GraphicBackground from './GraphicBackground';
import ScrambleText from './ScrambleText';
import AccentText from './AccentText';
import GeometricTree from './GeometricTree';

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
                {/* Main Lockup: Tree Left | Text Center */}
                <div className="relative w-full flex flex-col items-center justify-center mb-12 px-2">
                    {/* Geometric Tree - Absolute Left, centered vertically */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 z-0">
                        <GeometricTree />
                    </div>

                    {/* Right: Stacked Text - Massive & Fluid */}
                    <div className="flex flex-col items-center relative z-10 ml-[20%]"> {/* Added margin to offset from tree */}
                        <span className="text-xl font-bold italic tracking-[0.4em] opacity-50 text-[#263238] uppercase mb-1 md:mb-4">
                            OUR
                        </span>
                        <div className="flex flex-col leading-[0.8] items-center">
                            <AccentText theme="blue" className="text-[clamp(9rem,35vw,18rem)]">
                                20
                            </AccentText>
                            <AccentText theme="blue" className="text-[clamp(9rem,35vw,18rem)]">
                                25
                            </AccentText>
                        </div>
                    </div>
                </div>

                <p className="text-lg font-bold tracking-[0.2em] mb-10 opacity-70 text-[#263238] uppercase">
                    Just enter the code...
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
