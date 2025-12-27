import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function ImageModal({ image, onClose }) {
    return (
        <AnimatePresence>
            {image && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        layoutId={image}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="relative z-10 max-w-full max-h-[90vh] overflow-hidden rounded-lg shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <img
                            src={image}
                            alt="Zoomed"
                            className="w-full h-full object-contain max-h-[90vh]"
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
