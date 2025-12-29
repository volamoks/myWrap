import { useState, useEffect } from 'react';

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const scramble = (str) => str.split('').map(char =>
    /[0-9A-Za-z]/.test(char) ? CHARS[Math.floor(Math.random() * CHARS.length)] : char
).join('');

export const useScrambleText = (value, speed = 60, startDelay = 500) => {
    const originalValue = value.toString();
    // Initialize with a scrambled version immediately so it doesn't show the answer
    const [display, setDisplay] = useState(() => scramble(originalValue));

    useEffect(() => {
        let iterations = 0;
        let interval;

        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                const scrambled = originalValue.split('').map((char, index) => {
                    if (!/[0-9A-Za-z]/.test(char)) return char;
                    if (index < iterations) return originalValue[index];
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                }).join('');

                setDisplay(scrambled);

                if (iterations >= originalValue.length) {
                    clearInterval(interval);
                    setDisplay(originalValue);
                }

                // Scramble speed: 
                // Normalize duration for long text. Target ~25 frames (1.5s).
                const step = Math.max(1 / 5, originalValue.length / 25);
                iterations += step;
            }, speed);
        }, startDelay);

        return () => {
            clearTimeout(timeout);
            if (interval) clearInterval(interval);
        };
    }, [originalValue, speed, startDelay]);

    return display;
};
