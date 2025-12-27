import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, RotateCcw, Loader2 } from 'lucide-react';
import Snowfall from './Snowfall';
import Ornaments from './Ornaments';
import ImageModal from './ImageModal';
import InteractionHint from './InteractionHint';
import SwipeHint from './SwipeHint';
import ImagePreloader from './ImagePreloader';
import HeartReaction from './HeartReaction';
import Fireworks from './Fireworks';


export default function StoryContainer({ storiesData }) {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [hasSeenHint, setHasSeenHint] = useState(false);
    const [hasSeenSwipeHint, setHasSeenSwipeHint] = useState(false);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Auto-scroll effect
    useEffect(() => {
        if (loading || !stories.length || selectedImage || index >= stories.length - 1) return;

        const currentStory = stories[index];
        // Longer duration for grids and text-heavy slides
        const duration = (currentStory.type === 'photo-grid' || currentStory.type === 'summary')
            ? 10000
            : 5000;

        const timer = setTimeout(() => {
            setDirection(1);
            setIndex(prev => prev + 1);
        }, duration);

        return () => clearTimeout(timer);
    }, [index, stories, loading, selectedImage]);

    useEffect(() => {
        if (storiesData) {
            setStories(storiesData);
            setLoading(false);
            return;
        }

        fetch('/config.json')
            .then(res => {
                if (!res.ok) throw new Error('Failed to load config');
                return res.json();
            })
            .then(data => {
                setStories(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const next = useCallback(() => {
        if (!stories.length) return;

        if (index < stories.length - 1) {
            setDirection(1);
            setIndex(prev => prev + 1);
            if (stories[index + 1].type === 'photo-grid' && !hasSeenHint) {
                // Hint logic handled in RenderStoryContent via prop
            }
            if (index === 0 && !hasSeenSwipeHint) {
                setTimeout(() => setHasSeenSwipeHint(true), 1000);
            }
        }
    }, [index, stories, hasSeenHint, hasSeenSwipeHint]);

    const prev = useCallback(() => {
        setIndex(curr => {
            if (curr > 0) {
                setDirection(-1);
                return curr - 1;
            }
            return curr;
        });
    }, []);

    const restart = () => {
        setDirection(-1);
        setIndex(0);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                next();
            } else if (e.key === 'ArrowLeft') {
                prev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [next, prev]);

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-pastel-cream">
                <Loader2 className="animate-spin text-text-soft" size={48} />
                <Snowfall />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-pastel-cream text-red-500 gap-4">
                <p>Ошибка загрузки истории: {error}</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white rounded shadow">
                    Попробовать снова
                </button>
            </div>
        );
    }

    const story = stories[index];
    if (!story) return null; // Should not happen if loading is false and stories has data

    const showHint = story.type === 'photo-grid' && !hasSeenHint;

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? '100%' : '-100%',
            scale: 1, // Keep scale 1 to avoid gaps
            zIndex: 1
        }),
        center: {
            x: 0,
            scale: 1,
            zIndex: 1
        },
        exit: (direction) => ({
            x: direction < 0 ? '100%' : '-100%',
            scale: 1, // Keep scale 1 to avoid gaps
            zIndex: 0
        })
    };

    return (
        <div className="h-full w-full bg-pastel-cream overflow-hidden relative">
            <ImagePreloader stories={stories} />
            {/* Progress Bars */}
            <div className="absolute top-4 left-4 right-4 z-50 flex gap-1.5 px-2">
                {stories.map((story, i) => {
                    const isCurrent = i === index;
                    const isPast = i < index;
                    const duration = (story.type === 'photo-grid' || story.type === 'summary') ? 10 : 5;

                    return (
                        <div key={i} className="h-1 flex-1 bg-black/10 rounded-full overflow-hidden relative">
                            <motion.div
                                className="h-full bg-black/40"
                                initial={{ width: isPast ? '100%' : '0%' }}
                                animate={{ width: isPast ? '100%' : (isCurrent ? '100%' : '0%') }}
                                transition={{
                                    duration: isCurrent ? duration : 0,
                                    ease: "linear"
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={index}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.6 }, // Slightly faster, no opacity lag
                    }}
                    className={`story-page absolute inset-0 ${story.theme === 'blue' ? 'gradient-bg-blue' :
                        story.theme === 'green' ? 'gradient-bg-green' :
                            story.theme === 'yellow' ? 'gradient-bg-yellow' :
                                story.theme === 'purple' ? 'gradient-bg-purple' :
                                    'gradient-bg-red'
                        }`}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2} // Add a bit of resistance/feel
                    style={{ touchAction: 'none' }} // CRITICAL for mobile
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = offset.x; // Drag distance
                        if (swipe < -50) next();
                        else if (swipe > 50) prev();
                    }}
                >
                    {story.type === 'summary' && <Fireworks />}
                    <Ornaments theme={story.theme} />
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pb-28">
                        {/* Swipe Hint on Welcome Screen */}
                        <SwipeHint
                            show={index === 0 && !hasSeenSwipeHint}
                            direction="left"
                            onDismiss={() => setHasSeenSwipeHint(true)}
                        />

                        <RenderStoryContent
                            story={story}
                            onRestart={restart}
                            onImageClick={setSelectedImage}
                            showHint={showHint}
                            onHintDismiss={() => setHasSeenHint(true)}
                        />
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Tap zones for desktop/fast nav */}
            <div className="hidden md:block absolute inset-y-0 left-0 w-1/4 z-[60]" onClick={prev} />
            <div className="hidden md:block absolute inset-y-0 right-0 w-1/4 z-[60]" onClick={next} />

            <HeartReaction />

            <ImageModal
                isOpen={!!selectedImage}
                images={stories[index]?.type === 'photo-grid' ? stories[index].images : []}
                initialIndex={selectedImage ? (stories[index]?.images?.indexOf(selectedImage) ?? 0) : 0}
                onClose={() => setSelectedImage(null)}
            />
        </div >
    );
}

function RenderStoryContent({ story, onRestart, onImageClick, showHint, onHintDismiss }) {
    if (story.type === 'welcome') {
        return (
            <div className="text-center mt-[-10vh]">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <div className="text-8xl mb-4">🎄</div>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-5xl font-display font-bold text-text-soft mb-4 leading-tight"
                >
                    {story.title}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-lg opacity-70 px-8"
                >
                    {story.subtitle}
                </motion.p>
            </div>
        );
    }

    if (story.type === 'stat') {
        return (
            <div className="w-full max-w-sm">
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xl font-display uppercase tracking-widest opacity-40 mb-2"
                >
                    {story.title}
                </motion.h2>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className={`text-[120px] font-display font-black leading-none mb-6 ${story.theme === 'blue' ? 'text-accent-blue' :
                        story.theme === 'green' ? 'text-accent-green' :
                            story.theme === 'yellow' ? 'text-accent-yellow' :
                                story.theme === 'purple' ? 'text-accent-purple' :
                                    'text-accent-red'
                        }`}
                >
                    {story.value}
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl text-text-soft leading-relaxed"
                >
                    {story.description}
                </motion.p>
            </div>
        );
    }

    if (story.type === 'photo-grid') {
        return (
            <div className="w-full flex flex-col items-center">
                <h2 className="text-3xl font-display font-bold mb-8">{story.title}</h2>
                <div className="grid grid-cols-2 gap-4 w-full px-4 relative">
                    <InteractionHint show={showHint} onDismiss={onHintDismiss} />
                    {story.images.map((img, i) => (
                        <motion.div
                            key={i}
                            layoutId={img}
                            onClick={(e) => {
                                e.stopPropagation();
                                onImageClick(img);
                                if (showHint) onHintDismiss();
                            }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                            className="aspect-[3/4] bg-white p-2 pb-8 shadow-xl rounded-sm cursor-zoom-in relative z-20"
                        >
                            <img src={img} className="w-full h-full object-cover grayscale-[20%]" alt="Moment" />
                        </motion.div>
                    ))}
                </div>
                <p className="mt-12 text-center opacity-60 px-8 italic">{story.description}</p>
            </div>
        );
    }

    if (story.type === 'summary') {
        return (
            <div className="w-full max-w-sm text-center">
                <h2 className="text-4xl font-display font-bold mb-12">Наш Год ❤️</h2>
                <div className="space-y-8 mb-16">
                    {story.stats.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between border-b border-black/5 pb-4"
                        >
                            <span className="text-xl opacity-60">{s.label}</span>
                            <span className={`text-3xl font-bold font-display ${story.theme === 'blue' ? 'text-accent-blue' :
                                story.theme === 'green' ? 'text-accent-green' :
                                    story.theme === 'yellow' ? 'text-accent-yellow' :
                                        story.theme === 'purple' ? 'text-accent-purple' :
                                            'text-accent-red'
                                }`}>{s.value}</span>
                        </motion.div>
                    ))}
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onRestart}
                    className={`flex items-center gap-3 bg-white px-8 py-4 rounded-full shadow-lg font-bold mx-auto ${story.theme === 'blue' ? 'text-accent-blue' :
                        story.theme === 'green' ? 'text-accent-green' :
                            story.theme === 'yellow' ? 'text-accent-yellow' :
                                story.theme === 'purple' ? 'text-accent-purple' :
                                    'text-accent-red'
                        }`}
                >
                    <RotateCcw className="w-5 h-5" />
                    Посмотреть снова
                </motion.button>
            </div>
        );
    }

    return null;
}
