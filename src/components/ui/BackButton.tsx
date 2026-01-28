import { BORDER_RADIUS, COLORS, SPACING } from '@/src/constants/theme';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface BackButtonProps {
    onPress?: () => void;
    absolute?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({ onPress, absolute = true }) => {
    const router = useRouter();

    const handlePress = () => {
        Haptics.selectionAsync();
        if (onPress) {
            onPress();
        } else {
            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace('/');
            }
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, absolute && styles.absolute]}
            onPress={handlePress}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <Feather name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.cardBg,
        // Add shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        zIndex: 999,
    },
    absolute: {
        position: 'absolute',
        top: SPACING.md,
        left: SPACING.lg,
    },
});
