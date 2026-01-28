import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuestCard } from '@/src/components/QuestCard';
import { Button } from '@/src/components/ui/Button';
import { QuestCardSkeleton } from '@/src/components/ui/SkeletonLoader';
import { supabase } from '@/src/config/supabase';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { generateQuests } from '@/src/services/questService';
import { useAuthStore } from '@/src/store/authStore';
import { useOnboardingStore } from '@/src/store/onboardingStore';
import { useQuestStore } from '@/src/store/questStore';

export default function DiscoverScreen() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const { quests, addQuest } = useQuestStore();

    // Fix: Use individual selectors instead of getData() to avoid infinite loop
    const skills = useOnboardingStore((state) => state.skills);
    const available_hours_per_week = useOnboardingStore((state) => state.available_hours_per_week);
    const resources = useOnboardingStore((state) => state.resources);
    const goals = useOnboardingStore((state) => state.goals);
    const interests = useOnboardingStore((state) => state.interests);
    const location_type = useOnboardingStore((state) => state.location_type);

    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'suggested' | 'active'>('suggested');

    // Filter quests
    const suggestedQuests = quests.filter((q) => q.status === 'suggested');
    const activeQuests = quests.filter((q) => q.status === 'active');

    const displayedQuests = filter === 'all'
        ? quests
        : filter === 'suggested'
            ? suggestedQuests
            : activeQuests;

    const handleGenerateQuests = async () => {
        setIsLoading(true);
        try {
            // Build onboarding data object here
            const onboardingData = {
                skills,
                available_hours_per_week,
                resources,
                goals,
                interests,
                location_type,
            };

            const newQuests = await generateQuests(onboardingData);

            // Save to Supabase if user is logged in
            if (user?.id && newQuests.length > 0) {
                const questsToInsert = newQuests.map((quest) => ({
                    user_id: user.id,
                    status: 'suggested',
                    custom_data: quest,
                }));

                const { data, error } = await supabase
                    .from('quests')
                    .insert(questsToInsert)
                    .select();

                if (!error && data) {
                    data.forEach((quest) => addQuest(quest));
                }
            } else {
                // Add to local store only
                newQuests.forEach((quest) => {
                    addQuest({
                        id: `local-${Date.now()}-${Math.random()}`,
                        user_id: user?.id || 'guest',
                        status: 'suggested',
                        custom_data: quest,
                        started_at: undefined,
                        completed_at: undefined,
                        created_at: new Date().toISOString(),

                    });
                });
            }
        } catch (error) {
            console.error('Error generating quests:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Auto-generate quests if user has none (run only once)
        if (quests.length === 0 && !isLoading) {
            handleGenerateQuests();
        }
    }, []); // Empty deps - run only on mount

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={handleGenerateQuests}
                        tintColor={COLORS.primary}
                    />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Discover Quests</Text>
                    <Text style={styles.subtitle}>
                        AI-powered side hustles tailored just for you
                    </Text>
                </View>

                {/* Filter Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}
                >
                    <TouchableOpacity
                        style={[styles.filterTab, filter === 'suggested' && styles.filterTabActive]}
                        onPress={() => setFilter('suggested')}
                    >
                        <Text style={[styles.filterText, filter === 'suggested' && styles.filterTextActive]}>
                            Suggested ({suggestedQuests.length})
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterTab, filter === 'active' && styles.filterTabActive]}
                        onPress={() => setFilter('active')}
                    >
                        <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>
                            Active ({activeQuests.length})
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
                        onPress={() => setFilter('all')}
                    >
                        <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                            All ({quests.length})
                        </Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Quest List */}
                {isLoading && quests.length === 0 ? (
                    <View style={styles.loadingContainer}>
                        <QuestCardSkeleton />
                        <QuestCardSkeleton />
                        <QuestCardSkeleton />
                        <Text style={styles.loadingText}>Curating your quests with AI...</Text>
                    </View>
                ) : displayedQuests.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconContainer}>
                            <Feather name="search" size={48} color={COLORS.textMuted} />
                        </View>
                        <Text style={styles.emptyTitle}>No Quests Found</Text>
                        <Text style={styles.emptyText}>
                            {filter === 'suggested'
                                ? 'Tap generate to get AI-powered recommendations based on your profile.'
                                : 'You haven\'t started any quests yet. Browse suggested quests to begin!'}
                        </Text>
                        <Button
                            title="Generate Quests"
                            variant="primary"
                            size="lg"
                            onPress={handleGenerateQuests}
                            isLoading={isLoading}
                            style={styles.generateButton}
                            iconRight={<Feather name="zap" size={18} color={COLORS.textInverse} />}
                        />
                    </View>
                ) : (
                    <>
                        {displayedQuests.map((quest) => (
                            <QuestCard
                                key={quest.id}
                                quest={quest.custom_data}
                                status={quest.status}
                                showStatus={true}
                                onPress={() => router.push({
                                    pathname: '/quest/[id]',
                                    params: { id: quest.id },
                                })}
                            />
                        ))}

                        {/* Generate More Button */}
                        <Button
                            title="Generate More Results"
                            variant="outline"
                            size="lg"
                            fullWidth
                            onPress={handleGenerateQuests}
                            isLoading={isLoading}
                            style={styles.moreButton}
                            icon={<Feather name="plus-circle" size={18} color={COLORS.primary} />}
                        />
                    </>
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
    header: {
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: FONT_SIZES['4xl'],
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },
    filterContainer: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
        paddingRight: SPACING.lg,
    },
    filterTab: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.cardBg,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
    },
    filterTabActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary,
    },
    filterText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    filterTextActive: {
        color: COLORS.textInverse,
    },
    loadingContainer: {
        paddingVertical: SPACING['3xl'],
        alignItems: 'center',
    },
    loadingText: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
        marginTop: SPACING.md,
    },
    emptyContainer: {
        paddingVertical: SPACING['3xl'],
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.surfaceBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
    },
    emptyTitle: {
        fontSize: FONT_SIZES['2xl'],
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    emptyText: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xl,
        lineHeight: 24,
    },
    generateButton: {
        marginTop: SPACING.sm,
        width: '100%',
    },
    moreButton: {
        marginTop: SPACING.lg,
    },
});
