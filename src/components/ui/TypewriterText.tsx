import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

interface TypewriterTextProps extends TextProps {
    text: string;
    speed?: number;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ text, speed = 50, style, ...props }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let currentIndex = 0;
        const timer = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText((prev) => prev + text.charAt(currentIndex));
                currentIndex++;
            } else {
                clearInterval(timer);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed]);

    return (
        <Text style={style} {...props}>
            {displayedText}
        </Text>
    );
};

const styles = StyleSheet.create({});
