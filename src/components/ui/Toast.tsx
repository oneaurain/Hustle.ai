import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { Feather } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

interface ToastProps {
    message: string;
    type?: 'error' | 'success' | 'info';
    visible: boolean;
    onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'error',
    visible,
    onHide
}) => {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(onHide, 3000);
            return () => clearTimeout(timer);
        }
    }, [visible, onHide]);

    if (!visible) return null;

    const getBackgroundColor = () => {
        switch (type) {
            case 'success': return COLORS.success;
            case 'info': return COLORS.info;
            case 'error':
            default: return COLORS.error;
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return 'check-circle';
            case 'info': return 'info';
            case 'error':
            default: return 'alert-circle';
        }
    };

    return (
        <Animated.View
            entering={FadeInUp.springify()}
            exiting={FadeOutUp}
            style={[styles.container, { backgroundColor: getBackgroundColor() }]}
        >
            <Feather name={getIcon()} size={24} color="#FFF" />
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60, // Below status bar
        left: SPACING.lg,
        right: SPACING.lg,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 9999,
        gap: SPACING.sm,
    },
    message: {
        color: '#FFF',
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        flex: 1,
    },
});
