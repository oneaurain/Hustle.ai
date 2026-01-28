import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { Quest } from '@/src/types';
import { Card } from './ui/Card';

interface QuestProgressProps {
    quest: Quest;
    onUpdate: (questId: string, updates: any) => Promise<void>;
}

export const QuestProgress: React.FC<QuestProgressProps> = ({ quest, onUpdate }) => {
    const questData = quest.custom_data;
    const completedSteps = questData.completedSteps || [];
    const totalSteps = questData.actionSteps.length;
    const progress = Math.round((completedSteps.length / totalSteps) * 100);

    const toggleStep = async (index: number) => {
        // Haptic feedback for better UX
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const isCompleted = completedSteps.includes(index);
        let newCompletedSteps;

        if (isCompleted) {
            newCompletedSteps = completedSteps.filter((i) => i !== index);
        } else {
            newCompletedSteps = [...completedSteps, index];
            // Celebrate completion
            if (newCompletedSteps.length === totalSteps) {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
        }

        const newProgress = Math.round((newCompletedSteps.length / totalSteps) * 100);

        // Optimistic update could happen here, but we'll rely on parent for now
        await onUpdate(quest.id, {
            custom_data: {
                ...questData,
                completedSteps: newCompletedSteps,
                progress: newProgress,
            },
            // If all steps done, mark as completed? Maybe let user do that manually or prompt them.
            // For now just update progress.
        });
    };

    return (
        <Card variant="elevated" padding="lg" style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>🎯 Current Progress</Text>
                <Text style={styles.percentage}>{progress}%</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>

            <View style={styles.stepsContainer}>
                {questData.actionSteps.map((step, index) => {
                    const isCompleted = completedSteps.includes(index);
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.stepItem, isCompleted && styles.stepItemCompleted]}
                            onPress={() => toggleStep(index)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
                                {isCompleted && <Feather name="check" size={14} color={COLORS.darkBg} />}
                            </View>
                            <Text style={[styles.stepText, isCompleted && styles.stepTextCompleted]}>
                                {step}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    percentage: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.success,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: COLORS.surfaceBg,
        borderRadius: 4,
        marginBottom: SPACING.lg,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.success,
        borderRadius: 4,
    },
    stepsContainer: {
        gap: SPACING.md,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: SPACING.sm,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    stepItemCompleted: {
        backgroundColor: `${COLORS.success}10`,
        borderColor: `${COLORS.success}20`,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: COLORS.textSecondary,
        marginRight: SPACING.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: COLORS.success,
        borderColor: COLORS.success,
    },
    stepText: {
        flex: 1,
        fontSize: FONT_SIZES.base,
        color: COLORS.textPrimary,
        lineHeight: 22,
    },
    stepTextCompleted: {
        color: COLORS.textMuted,
        textDecorationLine: 'line-through',
    },
});
