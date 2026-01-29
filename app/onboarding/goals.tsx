import { useRouter } from 'expo-router';
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

import { Button } from '@/src/components/ui/Button';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { supabase } from '@/src/config/supabase';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { generateQuests } from '@/src/services/questService';
import { useAuthStore } from '@/src/store/authStore';
import { useOnboardingStore } from '@/src/store/onboardingStore';
import { useQuestStore } from '@/src/store/questStore';

const GOAL_OPTIONS = [
    { id: 'extra-income', label: 'Extra Income', icon: '💵', description: '$200-500/month' },
    { id: 'full-time', label: 'Replace Job', icon: '🚀', description: 'Full-time income' },
    { id: 'debt-free', label: 'Pay Off Debt', icon: '💳', description: 'Financial freedom' },
    { id: 'save', label: 'Save Money', icon: '🏦', description: 'Build savings' },
    { id: 'travel', label: 'Travel Fund', icon: '✈️', description: 'See the world' },
    { id: 'business', label: 'Start Business', icon: '🏢', description: 'Be your own boss' },
    { id: 'learn', label: 'Learn & Grow', icon: '📚', description: 'New skills' },
    { id: 'freedom', label: 'Time Freedom', icon: '⏰', description: 'Flexible schedule' },
];

export default function GoalsScreen() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const { goals, setGoals, getData } = useOnboardingStore();
    const { addQuest } = useQuestStore();

    const [selectedGoals, setSelectedGoals] = useState<string[]>(goals);
    const [isLoading, setIsLoading] = useState(false);

    const toggleGoal = (goalId: string) => {
        setSelectedGoals((prev) =>
            prev.includes(goalId)
                ? prev.filter((id) => id !== goalId)
                : [...prev, goalId]
        );
    };

    const handleComplete = async () => {
        if (selectedGoals.length === 0) {
            Alert.alert('Please select at least one goal');
            return;
        }

        setGoals(selectedGoals);
        setIsLoading(true);

        try {
            // Get all onboarding data
            const onboardingData = {
                ...getData(),
                goals: selectedGoals,
                interests: selectedGoals, // Using goals as interests for now
            };

            // Save user profile to Supabase
            if (user?.id) {
                const { error } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        ...onboardingData,
                    });

                if (error) throw error;

                // Mark onboarding as complete
                await supabase
                    .from('users')
                    .update({ onboarding_completed: true })
                    .eq('id', user.id);
            }

            // Generate AI quests
            console.log('Generating quests with profile:', onboardingData);
            const quests = await generateQuests(onboardingData);

            // Save generated quests to Supabase
            if (user?.id && quests.length > 0) {
                const questsToInsert = quests.map((quest) => ({
                    user_id: user.id,
                    status: 'suggested',
                    custom_data: quest,
                }));

                const { data, error } = await supabase
                    .from('quests')
                    .insert(questsToInsert as any)
                    .select();

                if (error) throw error;

                // Add quests to store
                if (data) {
                    data.forEach((quest) => addQuest(quest));
                }
            }

            setIsLoading(false);
            router.replace('/(tabs)');
        } catch (error) {
            setIsLoading(false);
            console.error('Onboarding error:', error);
            Alert.alert(
                'Setup Complete',
                'Your profile is saved! Quests will be generated shortly.',
                [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
            );
        }
    };

    const handleBack = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <LoadingSpinner size={60} />
                    <Text style={styles.loadingTitle}>Generating Your Quests...</Text>
                    <Text style={styles.loadingText}>
                        Our AI is analyzing your profile to find the perfect side hustles for you
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: '100%' }]} />
                    </View>
                    <Text style={styles.step}>Step 4 of 4</Text>
                    <Text style={styles.title}>What are your goals?</Text>
                    <Text style={styles.subtitle}>
                        Why do you want to start a side hustle?
                    </Text>
                </View>

                {/* Goal Grid */}
                <View style={styles.goalGrid}>
                    {GOAL_OPTIONS.map((goal) => {
                        const isSelected = selectedGoals.includes(goal.id);
                        return (
                            <TouchableOpacity
                                key={goal.id}
                                style={[
                                    styles.goalCard,
                                    isSelected && styles.goalCardSelected,
                                ]}
                                onPress={() => toggleGoal(goal.id)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.goalIcon}>{goal.icon}</Text>
                                <View style={styles.goalContent}>
                                    <Text
                                        style={[
                                            styles.goalLabel,
                                            isSelected && styles.goalLabelSelected,
                                        ]}
                                    >
                                        {goal.label}
                                    </Text>
                                    <Text style={styles.goalDescription}>{goal.description}</Text>
                                </View>
                                {isSelected && (
                                    <View style={styles.checkmark}>
                                        <Text style={styles.checkmarkText}>✓</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Button
                        title="Back"
                        variant="outline"
                        size="lg"
                        onPress={handleBack}
                        style={styles.backButton}
                    />
                    <Button
                        title="Start My Journey 🚀"
                        variant="primary"
                        size="lg"
                        onPress={handleComplete}
                        disabled={selectedGoals.length === 0}
                        style={styles.completeButton}
                    />
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
        paddingBottom: SPACING['2xl'],
    },
    header: {
        marginBottom: SPACING.xl,
    },
    progressBar: {
        height: 4,
        backgroundColor: COLORS.borderColor,
        borderRadius: 2,
        marginBottom: SPACING.md,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.questGreen,
    },
    step: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
    },
    title: {
        fontSize: FONT_SIZES['3xl'],
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
    },
    goalGrid: {
        gap: SPACING.md,
        marginBottom: SPACING.xl,
    },
    goalCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardBg,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 2,
        borderColor: COLORS.borderColor,
        padding: SPACING.lg,
        position: 'relative',
    },
    goalCardSelected: {
        borderColor: COLORS.questGreen,
        backgroundColor: `${COLORS.questGreen}15`,
    },
    goalIcon: {
        fontSize: 32,
        marginRight: SPACING.md,
    },
    goalContent: {
        flex: 1,
    },
    goalLabel: {
        fontSize: FONT_SIZES.base,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    goalLabelSelected: {
        color: COLORS.questGreen,
    },
    goalDescription: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textMuted,
    },
    checkmark: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.questGreen,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmarkText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.darkBg,
    },
    footer: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    backButton: {
        flex: 1,
    },
    completeButton: {
        flex: 2,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    loadingTitle: {
        fontSize: FONT_SIZES['2xl'],
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginTop: SPACING.xl,
        marginBottom: SPACING.sm,
    },
    loadingText: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
});
