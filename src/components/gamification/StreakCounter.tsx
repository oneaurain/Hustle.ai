import { COLORS, FONT_SIZES } from '@/src/constants/theme';
import { useGamificationStore } from '@/src/store/gamificationStore';
import { Feather } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const StreakCounter: React.FC = () => {
    const { streak, checkStreak } = useGamificationStore();

    useEffect(() => {
        checkStreak();
    }, []);

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
