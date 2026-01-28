import { COLORS } from '@/src/constants/theme';
import React, { useEffect, useState } from 'react';
import { Text, TextProps } from 'react-native';

interface TypewriterTextProps extends TextProps {
    text: string;
    speed?: number;
    delay?: number;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
    text,
    speed = 50,
    delay = 0,
    style,
    ...props
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStarted(true);
        }, delay);
        return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
        if (!started) return;

        if (displayedText.length < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(text.slice(0, displayedText.length + 1));
            }, speed);
            return () => clearTimeout(timeout);
        }
    }, [displayedText, started, text, speed]);

    return (
        <Text style={style} {...props}>
            {displayedText}
            <Text style={{ color: COLORS.primary }}>|</Text>
        </Text>
    );
};
