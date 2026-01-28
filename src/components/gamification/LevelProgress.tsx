import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { useGamificationStore } from '@/src/store/gamificationStore';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const XP_PER_LEVEL = 1000;

export const LevelProgress: React.FC = () => {
    const { level, xp } = useGamificationStore();

    // Calculate progress to next level
    // Accessing store values directly inside component to ensure reactivity
    const currentLevelXp = (level - 1) * XP_PER_LEVEL;
    const nextLevelXp = level * XP_PER_LEVEL;
    const xpInCurrentLevel = xp - currentLevelXp;
    const progressPercent = Math.min(Math.max(xpInCurrentLevel / XP_PER_LEVEL, 0), 1) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.textRow}>
                <Text style={styles.levelText}>Lvl {level}</Text>
                <Text style={styles.xpText}>{xpInCurrentLevel} / {XP_PER_LEVEL} XP</Text>
            </View>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.sm,
    },
    textRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    levelText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    xpText: {
        fontSize: 10,
        color: COLORS.textSecondary,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: COLORS.surfaceBg,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.questGreen,
        borderRadius: 4,
    },
});
