import React from 'react';
import { useScrambleText } from '../hooks/useScrambleText';

const AnimatedNumber = ({ value, className = '', style = {} }) => {
    const display = useScrambleText(value);

    return (
        <span className={className} style={style}>
            {display}
        </span>
    );
};

export default AnimatedNumber;
