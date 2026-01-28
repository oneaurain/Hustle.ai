import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/src/components/ui/Card';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { useQuestStore } from '@/src/store/questStore';

export default function AnalyticsScreen() {
    const router = useRouter();
    const { quests } = useQuestStore();

    // Calculate stats
    const activeQuests = quests.filter(q => q.status === 'active');
    const completedQuests = quests.filter(q => q.status === 'completed');
    const totalEarned = 0; // In a real app, calculate from earnings table

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Analytics</Text>
                </View>

                {/* Main Stats */}
                <View style={styles.mainStats}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Total Earned</Text>
                        <Text style={styles.statValue}>${totalEarned}</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: COLORS.surfaceBg }]}>
                        <Text style={styles.statLabel}>Completed</Text>
                        <Text style={styles.statValue}>{completedQuests.length}</Text>
                    </View>
                </View>

                {/* Progress Chart Placeholder */}
                <Card variant="default" padding="lg" style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.sectionTitle}>Earnings Overview</Text>
                        <TouchableOpacity style={styles.chartFilter}>
                            <Text style={styles.filterText}>This Month</Text>
                            <Feather name="chevron-down" size={14} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.chartPlaceholder}>
                        <Feather name="bar-chart-2" size={48} color={COLORS.accent} />
                        <Text style={styles.chartText}>No earnings data yet</Text>
                    </View>
                </Card>

                {/* Recent Activity */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    {activeQuests.length === 0 && completedQuests.length === 0 ? (
                        <Text style={styles.emptyText}>No activity recorded yet</Text>
                    ) : (
                        quests.slice(0, 5).map(quest => (
                            <View key={quest.id} style={styles.activityItem}>
                                <View style={[styles.activityIcon, {
                                    backgroundColor: quest.status === 'active' ? `${COLORS.info}20` : `${COLORS.success}20`
                                }]}>
                                    <Feather
                                        name={quest.status === 'active' ? "activity" : "check"}
                                        size={16}
                                        color={quest.status === 'active' ? COLORS.info : COLORS.success}
                                    />
                                </View>
                                <View style={styles.activityInfo}>
                                    <Text style={styles.activityTitle}>{quest.custom_data.title}</Text>
                                    <Text style={styles.activityDate}>
                                        {new Date(quest.updated_at).toLocaleDateString()}
                                    </Text>
                                </View>
                                <Text style={styles.activityStatus}>{quest.status}</Text>
                            </View>
                        ))
                    )}
                </View>
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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    backButton: {
        marginRight: SPACING.md,
    },
    title: {
        fontSize: FONT_SIZES['2xl'],
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    mainStats: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.xl,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.cardBg,
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
    },
    statLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    statValue: {
        fontSize: FONT_SIZES['3xl'],
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    chartCard: {
        marginBottom: SPACING.xl,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    chartFilter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.surfaceBg,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    filterText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    chartPlaceholder: {
        height: 200,
        backgroundColor: COLORS.surfaceBg,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: COLORS.borderColor,
    },
    chartText: {
        marginTop: SPACING.md,
        color: COLORS.textMuted,
        fontSize: FONT_SIZES.sm,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    emptyText: {
        color: COLORS.textMuted,
        fontStyle: 'italic',
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dividerColor,
    },
    activityIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    activityInfo: {
        flex: 1,
    },
    activityTitle: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '500',
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    activityDate: {
        fontSize: 10,
        color: COLORS.textMuted,
    },
    activityStatus: {
        fontSize: 10,
        fontWeight: '600',
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
    },
});
