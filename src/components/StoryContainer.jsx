import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Loader2 } from 'lucide-react';
import ImageModal from './ImageModal';
import InteractionHint from './InteractionHint';
import SwipeHint from './SwipeHint';
import ImagePreloader from './ImagePreloader';
import Fireworks from './Fireworks';
import AccentText from './AccentText';
import GraphicBackground from './GraphicBackground';
import ScrambleText from './ScrambleText';
import HeartReaction from './HeartReaction';
import SectionHeader from './SectionHeader';

export default function StoryContainer({ storiesData }) {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [hasSeenHint, setHasSeenHint] = useState(false);
    const [hasSeenSwipeHint, setHasSeenSwipeHint] = useState(false);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFireworks, setShowFireworks] = useState(false);

    const triggerFireworks = () => {
        setShowFireworks(true);
        setTimeout(() => setShowFireworks(false), 3000);
    };

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
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-pastel-cream text-red-500 gap-4">
                <p>Error loading story: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-6 py-2 bg-white text-black rounded-full font-bold"
                >
                    Try again
                </button>
            </div>
        );
    }

    const story = stories[index];
    if (!story) return null;

    const showHint = story.type === 'photo-grid' && !hasSeenHint;

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? '100%' : '-100%',
            scale: 1,
            zIndex: 1
        }),
        center: {
            x: 0,
            scale: 1,
            zIndex: 1
        },
        exit: (direction) => ({
            x: direction < 0 ? '100%' : '-100%',
            scale: 1,
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
                    return (
                        <div key={i} className="h-1 flex-1 bg-black/10 rounded-full overflow-hidden relative">
                            <motion.div
                                className="h-full bg-black/40"
                                initial={{ width: isPast ? '100%' : '0%' }}
                                animate={{ width: isPast || isCurrent ? '100%' : '0%' }}
                                transition={{ duration: 0.3 }}
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
                        x: { type: "tween", ease: [0.32, 0.72, 0, 1], duration: 0.6 },
                    }}
                    className={`story-page absolute inset-0 ${story.theme === 'blue' ? 'gradient-bg-blue' :
                        story.theme === 'green' ? 'gradient-bg-green' :
                            story.theme === 'yellow' ? 'gradient-bg-yellow' :
                                story.theme === 'purple' ? 'gradient-bg-purple' :
                                    'gradient-bg-red'
                        }`}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    style={{ touchAction: 'none' }}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = offset.x;
                        if (swipe < -50) next();
                        else if (swipe > 50) prev();
                    }}
                >
                    {showFireworks && <Fireworks />}
                    <GraphicBackground theme={story.theme} variantKey={index} />

                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                        <SwipeHint
                            show={index === 0 && !hasSeenSwipeHint}
                            direction="left"
                            onDismiss={() => setHasSeenSwipeHint(true)}
                        />

                        <RenderStoryContent
                            story={story}
                            index={index}
                            onRestart={restart}
                            onImageClick={setSelectedImage}
                            showHint={showHint}
                            onHintDismiss={() => setHasSeenHint(true)}
                            onTriggerFireworks={triggerFireworks}
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
        </div>
    );
}

function RenderStoryContent(props) {
    const { story } = props;

    switch (story.type) {
        case 'welcome': return <WelcomeStory {...props} />;
        case 'stat': return <StatStory {...props} />;
        case 'photo-grid': return <PhotoGridStory {...props} />;
        case 'quiz': return <QuizStory {...props} />;
        case 'list': return <ListStory {...props} />;
        case 'quote': return <QuoteStory {...props} />;
        case 'summary': return <SummaryStory {...props} />;
        default: return null;
    }
}



const WelcomeStory = ({ story }) => (
    <div className="text-center mt-[-10vh]">
        {story.icon && (
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
            >
                <div className="text-8xl mb-4">{story.icon}</div>
            </motion.div>
        )}
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
        >
            <AccentText theme={story.theme || 'blue'} size="text-8xl md:text-9xl">
                {story.title}
            </AccentText>
        </motion.div>
        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-lg opacity-70 px-8 font-medium"
        >
            {story.subtitle}
        </motion.p>
    </div>
);

const StatStory = ({ story, index }) => {
    const alignments = ['items-start text-left', 'items-center text-center', 'items-end text-right'];
    const alignmentClass = alignments[index ? index % 3 : 1];

    return (
        <div className={`w-full max-w-sm flex flex-col ${alignmentClass}`}>
            <SectionHeader className="mb-6">
                {story.title}
            </SectionHeader>
            <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
                className="mb-6 relative z-10 w-full"
            >
                <div className={`flex ${(!index || index % 3 === 1) ? 'justify-center' : index % 3 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <AccentText value={story.value} theme={story.theme} size="text-[12rem] md:text-[14rem]">
                        {story.value}
                    </AccentText>
                </div>
            </motion.div>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl text-text-soft leading-relaxed font-medium max-w-[90%]"
            >
                {story.description}
            </motion.p>
        </div >
    );
};

const PhotoGridStory = ({ story, onImageClick, showHint, onHintDismiss }) => (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <SectionHeader className="mb-6">
            {story.title}
        </SectionHeader>
        <p className="text-xl text-center text-[#263238] opacity-60 font-medium mb-8">
            {story.description}
        </p>

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
                    whileHover={{ scale: 1.02, rotate: i % 2 === 0 ? 1 : -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                    className="aspect-[3/4] border-4 border-white shadow-[6px_6px_0px_rgba(38,50,56,0.2)] rounded-2xl cursor-zoom-in relative z-20 overflow-hidden bg-gray-100"
                >
                    <img src={img} className="w-full h-full object-cover grayscale-[10%]" alt="Moment" />
                </motion.div>
            ))}
        </div>
    </div>
);

const QuizStory = ({ story, onTriggerFireworks }) => {
    const [selected, setSelected] = useState(null);

    const themeColors = {
        blue: '#0288D1',
        green: '#388E3C',
        yellow: '#FBC02D',
        purple: '#8E24AA',
        red: '#C62828',
        black: '#263238'
    };
    const accentColor = themeColors[story.theme] || themeColors.blue;

    return (
        <div className="w-full max-w-sm flex flex-col items-center">
            <SectionHeader className="min-h-[5rem]">
                {story.title}
            </SectionHeader>
            <div className="flex flex-col gap-5 w-full">
                {story.options.map((opt, i) => {
                    const isSelected = selected === i;
                    const isRevealed = selected !== null;
                    const isCorrect = opt.correct;

                    // Base styles
                    let style = {
                        backgroundColor: 'transparent',
                        borderColor: accentColor,
                        // Layered shadow: White block (offset) + Colored spread (simulating border)
                        boxShadow: `8px 8px 0px 0px #FFFFFF, 8px 8px 0px 2px ${accentColor}`,
                        color: '#263238'
                    };

                    // State-based overrides
                    if (isRevealed) {
                        if (isSelected) {
                            style.backgroundColor = isCorrect ? '#00E054' : '#FF4646';
                            style.borderColor = isCorrect ? '#00E054' : '#FF4646';
                            style.color = '#FFFFFF';
                            style.boxShadow = 'none';
                        } else if (isCorrect) {
                            style.backgroundColor = '#00E054';
                            style.borderColor = '#00E054';
                            style.color = '#FFFFFF';
                            style.boxShadow = 'none';
                        } else {
                            // Unselected, incorrect options remain simplified but faded?
                            style.opacity = 0.5;
                            style.boxShadow = 'none';
                        }
                    }

                    return (
                        <motion.button
                            key={i}
                            whileHover={!isRevealed ? { scale: 1.02, x: 2, y: -2 } : {}}
                            whileTap={!isRevealed ? { scale: 0.98, x: 0, y: 0 } : {}}
                            onClick={() => {
                                if (!isRevealed) {
                                    setSelected(i);
                                    if (opt.correct) onTriggerFireworks();
                                }
                            }}
                            className={`
                                relative p-6 rounded-xl font-bold text-xl text-left border-2 
                                transition-all flex items-center justify-between group
                            `}
                            style={style}
                        >
                            <span className="relative z-10 uppercase tracking-wide">{opt.text}</span>
                            {isRevealed && isCorrect && <span className="text-2xl">✨</span>}
                            {isRevealed && isSelected && !isCorrect && <span className="text-2xl">❌</span>}
                        </motion.button>
                    )
                })}
            </div>
        </div>
    );
};

const ListStory = ({ story }) => (
    <div className="w-full max-w-md flex flex-col items-center text-center">
        <SectionHeader>
            {story.title}
        </SectionHeader>

        <div className="flex flex-col w-full gap-0">
            {story.items.map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex flex-col py-6 border-b border-black/10 last:border-none relative group"
                >
                    <span className="text-sm font-black uppercase tracking-[0.3em] text-[#263238] mb-2 opacity-100">
                        {item.label}
                    </span>
                    <AccentText
                        className="text-3xl sm:text-4xl md:text-5xl leading-none text-[#263238] inline-flex items-center justify-center min-h-[1.1em] flex-wrap text-center"
                        theme={story.theme}
                    >
                        {item.value}
                    </AccentText>
                </motion.div>
            ))}
        </div>
    </div>
);

const QuoteStory = ({ story, onRestart }) => {
    const themeColors = {
        blue: '#0288D1',
        green: '#388E3C',
        yellow: '#FBC02D',
        purple: '#8E24AA',
        red: '#C62828',
        black: '#263238'
    };
    const accentColor = themeColors[story.theme] || themeColors.black;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 relative">
            <div className="w-full max-w-lg mb-8 flex items-center justify-center px-4">
                <h2 className="text-3xl md:text-4xl font-black leading-tight text-center px-2 text-[#263238] uppercase">
                    {story.title}
                </h2>
            </div>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-xl md:text-2xl font-bold text-[#263238] max-w-md leading-relaxed opacity-80"
            >
                {story.subtitle}
            </motion.p>

            <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2, type: 'spring' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRestart}
                className="mt-16 px-10 py-4 rounded-xl font-bold text-lg uppercase tracking-widest flex items-center gap-2 border-2 transition-all"
                style={{
                    backgroundColor: 'transparent',
                    borderColor: accentColor,
                    color: '#263238',
                    boxShadow: `8px 8px 0px 0px #FFFFFF, 8px 8px 0px 2px ${accentColor}`
                }}
            >
                <RotateCcw className="w-5 h-5" /> REPLAY
            </motion.button>
        </div>
    );
};

const SummaryStory = ({ story, onRestart }) => (
    <div className="w-full h-full flex flex-col items-center justify-start pt-24 pb-32 px-6 relative overflow-y-auto no-scrollbar">
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-12 flex-shrink-0"
        >
            <SectionHeader>
                RECAP
            </SectionHeader>
        </motion.div>

        <div className="flex flex-col gap-12 w-full max-w-xs relative z-10 pb-12">
            {story.stats.map((s, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 + 0.3 }}
                    className="flex flex-col items-center"
                >
                    <AccentText
                        className="text-7xl md:text-9xl leading-[0.85] text-[#263238] inline-flex items-center justify-center min-h-[1.1em] drop-shadow-md"
                        theme={story.theme}
                        size="text-7xl md:text-9xl"
                    >
                        {s.value}
                    </AccentText>
                    <span className="text-sm font-black uppercase tracking-[0.2em] text-[#263238] opacity-50 mt-2">
                        {s.label}
                    </span>
                </motion.div>
            ))}
        </div>
    </div>
);
