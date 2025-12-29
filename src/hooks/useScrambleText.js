import { useState, useEffect } from 'react';

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const useScrambleText = (value, speed = 40) => {
    const [display, setDisplay] = useState('');
    const originalValue = value.toString();

    useEffect(() => {
        let iterations = 0;
        // Adjust iterations based on length so short words don't stuck and long words don't take forever
        // But for "Matrix" feel, a fixed overhead is good.
        const maxIterations = 10;

        const interval = setInterval(() => {
            const scrambled = originalValue.split('').map((char, index) => {
                // Scramble digits AND letters. Keep spaces/symbols static.
                if (!/[0-9A-Za-z]/.test(char)) return char;

                if (index < iterations) {
                    return originalValue[index];
                }

                return CHARS[Math.floor(Math.random() * CHARS.length)];
            }).join('');

            setDisplay(scrambled);

            if (iterations >= originalValue.length) {
                clearInterval(interval);
                setDisplay(originalValue);
            }

            // Scramble speed: 
            // 1/3 means 3 frames per character lock.
            iterations += 1 / 3;
        }, speed);

        return () => clearInterval(interval);
    }, [originalValue, speed]);

    return display || originalValue;
};
