import { COLORS, FONT_SIZES } from '@/src/constants/theme';
import { useQuestStore } from '@/src/store/questStore';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const StreakCounter: React.FC = () => {
    const { getStreak } = useQuestStore();
    const streak = getStreak(); // Use the selector directly

    return (
        <View style={styles.container}>
            <Feather name="zap" size={16} color={COLORS.warning} />
            <Text style={styles.streakText}>{streak}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${COLORS.warning}20`,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    streakText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: 'bold',
        color: COLORS.warning,
    },
});
