import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    ActivityIndicator,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
} from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../../constants/theme';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    iconRight?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    disabled,
    style,
    icon,
    iconRight,
    onPress,
    ...props
}) => {
    const handlePress = async (e: any) => {
        if (!disabled && !isLoading) {
            if (Platform.OS !== 'web') {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            onPress?.(e);
        }
    };

    const buttonStyle = [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        (disabled || isLoading) && styles.disabled,
        style,
    ];

    const textStyle = [
        styles.text,
        styles[`text_${variant}`],
        styles[`textSize_${size}`],
    ];

    return (
        <TouchableOpacity
            style={buttonStyle}
            disabled={disabled || isLoading}
            activeOpacity={0.7}
            onPress={handlePress}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator
                    color={variant === 'primary' ? COLORS.textInverse : COLORS.primary}
                />
            ) : (
                <>
                    {icon && <View style={styles.iconLeft}>{icon}</View>}
                    <Text style={textStyle}>{title}</Text>
                    {iconRight && <View style={styles.iconRight}>{iconRight}</View>}
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BORDER_RADIUS.md,
    },
    iconLeft: {
        marginRight: SPACING.sm,
    },
    iconRight: {
        marginLeft: SPACING.sm,
    },

    // Variants
    primary: {
        backgroundColor: COLORS.primary,
    },
    secondary: {
        backgroundColor: COLORS.secondary,
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },

    // Sizes
    size_sm: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        minHeight: 36,
    },
    size_md: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        minHeight: 48,
    },
    size_lg: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        minHeight: 56,
    },

    fullWidth: {
        width: '100%',
    },

    disabled: {
        opacity: 0.5,
    },

    // Text styles
    text: {
        fontWeight: '700',
        textAlign: 'center',
    },
    text_primary: {
        color: COLORS.textInverse,
    },
    text_secondary: {
        color: COLORS.textInverse,
    },
    text_ghost: {
        color: COLORS.primary,
    },
    text_outline: {
        color: COLORS.primary,
    },

    textSize_sm: {
        fontSize: FONT_SIZES.sm,
    },
    textSize_md: {
        fontSize: FONT_SIZES.base,
    },
    textSize_lg: {
        fontSize: FONT_SIZES.lg,
    },
});
