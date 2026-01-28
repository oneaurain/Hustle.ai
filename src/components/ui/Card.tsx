import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { BORDER_RADIUS, COLORS, SPACING } from '../../constants/theme';

interface CardProps extends ViewProps {
    variant?: 'default' | 'outlined' | 'elevated';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
    variant = 'default',
    padding = 'md',
    style,
    children,
    ...props
}) => {
    const cardStyle = [
        styles.base,
        styles[variant],
        padding !== 'none' && styles[`padding_${padding}`],
        style,
    ];

    return (
        <View style={cardStyle} {...props}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    base: {
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
    },

    // Variants
    default: {
        backgroundColor: COLORS.cardBg,
    },
    outlined: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.borderColor,
    },
    elevated: {
        backgroundColor: COLORS.cardBg,
        shadowColor: COLORS.questGreen,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },

    // Padding
    padding_sm: {
        padding: SPACING.sm,
    },
    padding_md: {
        padding: SPACING.md,
    },
    padding_lg: {
        padding: SPACING.lg,
    },
});
