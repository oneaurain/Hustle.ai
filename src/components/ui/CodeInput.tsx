import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface CodeInputProps {
    value: string;
    onChangeText: (text: string) => void;
    length?: number;
}

export const CodeInput: React.FC<CodeInputProps> = ({ value, onChangeText, length = 6 }) => {
    const inputRef = useRef<TextInput>(null);
    const [focused, setFocused] = useState(false);

    const handlePress = () => {
        inputRef.current?.focus();
    };

    const digits = new Array(length).fill(0);

    return (
        <View style={styles.container}>
            <Pressable onPress={handlePress} style={styles.inputsContainer}>
                {digits.map((_, index) => {
                    const digit = value[index];
                    const isFocused = focused && index === value.length;
                    const isFilled = !!digit;

                    return (
                        <View
                            key={index}
                            style={[
                                styles.box,
                                isFocused && styles.boxFocused,
                                isFilled && styles.boxFilled,
                            ]}
                        >
                            <Text style={styles.digit}>
                                {digit || ''}
                            </Text>
                            {isFocused && <View style={styles.cursor} />}
                        </View>
                    );
                })}
            </Pressable>

            <TextInput
                ref={inputRef}
                value={value}
                onChangeText={(text) => {
                    // Only allow numeric input
                    const cleaned = text.replace(/[^0-9]/g, '');
                    if (cleaned.length <= length) {
                        onChangeText(cleaned);
                    }
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                keyboardType="number-pad"
                maxLength={length}
                style={styles.hiddenInput} // Hide the actual input
                caretHidden={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: SPACING.lg,
    },
    inputsContainer: {
        flexDirection: 'row',
        gap: SPACING.sm, // Gap between boxes
        justifyContent: 'center',
        width: '100%',
    },
    box: {
        width: 45,
        height: 55,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.cardBg,
    },
    boxFocused: {
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    boxFilled: {
        borderColor: COLORS.textSecondary,
        backgroundColor: COLORS.surfaceBg,
    },
    digit: {
        fontSize: FONT_SIZES['2xl'],
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    hiddenInput: {
        position: 'absolute',
        opacity: 0,
        height: 1,
        width: 1,
    },
    cursor: {
        position: 'absolute',
        bottom: 10,
        width: '40%',
        height: 2,
        backgroundColor: COLORS.primary,
    }
});
