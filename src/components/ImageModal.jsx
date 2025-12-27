import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageModal({ images = [], initialIndex = 0, isOpen, onClose }) {
    const [index, setIndex] = useState(initialIndex);

    // Sync index when modal opens
    useEffect(() => {
        if (isOpen) setIndex(initialIndex);
    }, [isOpen, initialIndex]);

    const showPrev = index > 0;
    const showNext = index < images.length - 1;

    const next = (e) => {
        e.stopPropagation();
        if (showNext) setIndex(index + 1);
    };

    const prev = (e) => {
        e.stopPropagation();
        if (showPrev) setIndex(index - 1);
    };

    const currentImage = images[index];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    />

                    <motion.div
                        layoutId={currentImage}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative z-10 w-full max-w-4xl max-h-[90vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image area
                    >
                        <button
                            onClick={onClose}
                            className="absolute -top-12 right-0 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {/* Navigation Buttons */}
                        {showPrev && (
                            <button
                                onClick={prev}
                                className="absolute left-0 md:-left-16 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm z-20"
                            >
                                <ChevronLeft size={32} />
                            </button>
                        )}

                        {showNext && (
                            <button
                                onClick={next}
                                className="absolute right-0 md:-right-16 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm z-20"
                            >
                                <ChevronRight size={32} />
                            </button>
                        )}

                        {/* Image */}
                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
                            <motion.img
                                key={currentImage} // Key change triggers animation
                                src={currentImage}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                alt="Gallery"
                                className="max-w-full max-h-[85vh] object-contain shadow-2xl"
                            />
                        </div>

                        {/* Counter */}
                        {images.length > 1 && (
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium">
                                {index + 1} / {images.length}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
