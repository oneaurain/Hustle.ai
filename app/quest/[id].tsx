import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuestProgress } from '@/src/components/QuestProgress';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { useQuestStore } from '@/src/store/questStore';

export default function QuestDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { quests, updateQuest } = useQuestStore();

    const quest = quests.find((q) => q.id === id);
    const [isStarting, setIsStarting] = useState(false);

    if (!quest || !quest.custom_data) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Feather name="alert-circle" size={48} color={COLORS.error} />
                    <Text style={styles.errorText}>Quest not found</Text>
                    <Button
                        title="Go Back"
                        variant="primary"
                        onPress={() => router.back()}
                    />
                </View>
            </SafeAreaView>
        );
    }

    const questData = quest.custom_data;
    const isActive = quest.status === 'active';
    const isCompleted = quest.status === 'completed';

    const handleStartQuest = async () => {
        setIsStarting(true);
        try {
            await updateQuest(quest.id, {
                status: 'active',
                started_at: new Date().toISOString(),
            });
            Alert.alert(
                'Quest Started',
                'Your journey begins now. Check the Home screen to track your progress.',
                [
                    { text: 'View Active Quests', onPress: () => router.push('/(tabs)') },
                    { text: 'OK' },
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to start quest. Please try again.');
        } finally {
            setIsStarting(false);
        }
    };

    const difficultyStars = Array(questData.difficulty).fill(0).map((_, i) => (
        <Feather key={i} name="star" size={16} color={COLORS.warning} style={{ marginHorizontal: 1 }} />
    ));

    const monthlyEarnings = `$${questData.earningsPotential.min}-$${questData.earningsPotential.max}`;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={20} color={COLORS.textPrimary} />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Feather name="activity" size={40} color={COLORS.primary} />
                    </View>
                    <Text style={styles.title}>{questData.title}</Text>
                    <View style={styles.category}>
                        <Text style={styles.categoryText}>{questData.category}</Text>
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Feather name="dollar-sign" size={20} color={COLORS.success} style={{ marginBottom: 4 }} />
                        <Text style={styles.statLabel}>Monthly</Text>
                        <Text style={styles.statValue}>{monthlyEarnings}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Feather name="clock" size={20} color={COLORS.info} style={{ marginBottom: 4 }} />
                        <Text style={styles.statLabel}>First $</Text>
                        <Text style={styles.statValue}>{questData.timeToFirstDollar}h</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Feather name="bar-chart-2" size={20} color={COLORS.warning} style={{ marginBottom: 4 }} />
                        <Text style={styles.statLabel}>Difficulty</Text>
                        <View style={{ flexDirection: 'row' }}>{difficultyStars}</View>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About This Quest</Text>
                    <Text style={styles.description}>{questData.fullDescription}</Text>
                </View>

                {/* Why This Matches You */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Why This Matches You</Text>
                    <Card variant="default" padding="md" style={{ backgroundColor: `${COLORS.info}10`, borderColor: `${COLORS.info}30` }}>
                        <Text style={styles.description}>{questData.whyMatch}</Text>
                    </Card>
                </View>

                {/* Action Steps & Progress */}
                {isActive ? (
                    <QuestProgress
                        quest={quest}
                        onUpdate={async (id: string, data: any) => {
                            await updateQuest(id, data);
                        }}
                    />
                ) : (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Action Steps</Text>
                        {questData.actionSteps.map((step, index) => (
                            <View key={index} style={styles.stepItem}>
                                <View style={styles.stepNumber}>
                                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                                </View>
                                <Text style={styles.stepText}>{step}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Requirements */}
                <View style={styles.requirementsRow}>
                    <View style={styles.requirementCol}>
                        <Text style={styles.requirementTitle}>Skills Needed</Text>
                        {questData.requiredSkills.map((skill, index) => (
                            <View key={index} style={styles.reqItem}>
                                <Feather name="check" size={12} color={COLORS.success} style={{ marginTop: 2 }} />
                                <Text style={styles.reqText}>{skill}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.requirementCol}>
                        <Text style={styles.requirementTitle}>Resources</Text>
                        {questData.requiredResources.map((resource, index) => (
                            <View key={index} style={styles.reqItem}>
                                <Feather name="check" size={12} color={COLORS.success} style={{ marginTop: 2 }} />
                                <Text style={styles.reqText}>{resource}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Platforms */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recommended Platforms</Text>
                    <View style={styles.platformList}>
                        {questData.platforms.map((platform, index) => (
                            <View key={index} style={styles.platformChip}>
                                <Text style={styles.platformText}>{platform}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Common Pitfalls */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Common Pitfalls to Avoid</Text>
                    {questData.commonPitfalls?.map((pitfall, index) => (
                        <View key={index} style={styles.pitfallItem}>
                            <Feather name="alert-triangle" size={14} color={COLORS.warning} style={{ marginTop: 2, marginRight: 8 }} />
                            <Text style={styles.pitfallText}>{pitfall}</Text>
                        </View>
                    ))}
                </View>

                {/* Startup Cost */}
                {questData.startupCost > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Startup Investment</Text>
                        <Text style={styles.description}>
                            Approximately ${questData.startupCost} to get started
                        </Text>
                    </View>
                )}

                {/* CTA Button */}
                {!isActive && !isCompleted && (
                    <Button
                        title="Start This Quest"
                        variant="primary"
                        size="lg"
                        fullWidth
                        onPress={handleStartQuest}
                        isLoading={isStarting}
                        style={styles.ctaButton}
                    />
                )}

                {isActive && (
                    <Button
                        title="Quest In Progress"
                        variant="secondary"
                        size="lg"
                        fullWidth
                        disabled
                        style={styles.ctaButton}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.darkBg,
    },
    scrollContent: {
        padding: SPACING.lg,
        paddingBottom: SPACING['3xl'],
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.lg,
        gap: 8,
    },
    backText: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.surfaceBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
    },
    title: {
        fontSize: FONT_SIZES['3xl'],
        fontWeight: '700',
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    category: {
        backgroundColor: COLORS.surfaceBg,
        paddingHorizontal: SPACING.md,
        paddingVertical: 4,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
    },
    categoryText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
        backgroundColor: COLORS.cardBg,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 10,
        color: COLORS.textMuted,
        marginBottom: 4,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    statValue: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    description: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
        lineHeight: 24,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
    },
    stepNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.surfaceBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
        marginTop: 2,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
    },
    stepNumberText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    stepText: {
        flex: 1,
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },
    requirementsRow: {
        flexDirection: 'row',
        gap: SPACING.xl,
        marginBottom: SPACING.xl,
    },
    requirementCol: {
        flex: 1,
    },
    requirementTitle: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    reqItem: {
        flexDirection: 'row',
        marginBottom: 8,
        gap: 8,
    },
    reqText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        flex: 1,
    },
    platformList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    platformChip: {
        paddingHorizontal: SPACING.md,
        paddingVertical: 6,
        backgroundColor: COLORS.surfaceBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
    },
    platformText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    pitfallItem: {
        flexDirection: 'row',
        marginBottom: SPACING.sm,
    },
    pitfallText: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
        flex: 1,
        lineHeight: 22,
    },
    ctaButton: {
        marginTop: SPACING.md,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    errorText: {
        fontSize: FONT_SIZES.xl,
        color: COLORS.textPrimary,
        marginTop: SPACING.md,
        marginBottom: SPACING.lg,
    },
});
