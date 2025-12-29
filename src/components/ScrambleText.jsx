import React from 'react';
import { useScrambleText } from '../hooks/useScrambleText';

const ScrambleText = ({ children, className = '', style = {}, color }) => {
    // accept value as children or prop
    const content = children || '';
    // Use default delay of 500ms from hook
    const display = useScrambleText(content);

    // If color is passed, merge it into style or className
    const finalStyle = { ...style };
    if (color) {
        finalStyle.color = color;
    }

    return (
        <span
            className={`inline-flex items-center justify-center whitespace-nowrap leading-none ${className}`}
            style={{
                ...finalStyle,
                verticalAlign: 'middle' // Ensure alignment with surrounding text
            }}
        >
            {display}
        </span>
    );
};

export default ScrambleText;
