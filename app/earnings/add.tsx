import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { supabase } from '@/src/config/supabase';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { useAuthStore } from '@/src/store/authStore';
import { useQuestStore } from '@/src/store/questStore';

export default function AddEarningsScreen() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const { quests } = useQuestStore();
    const activeQuests = quests.filter((q) => q.status === 'active');

    const [selectedQuestId, setSelectedQuestId] = useState<string>('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedQuestId || !amount) {
            Alert.alert('Error', 'Please select a quest and enter an amount');
            return;
        }

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        setIsSubmitting(true);
        try {
            if (user?.id) {
                const { error } = await supabase.from('earnings').insert({
                    user_id: user.id,
                    quest_id: selectedQuestId,
                    amount: numAmount,
                    description: description || null,
                });

                if (error) throw error;
            }

            Alert.alert(
                'Success! 🎉',
                `Logged $${numAmount.toFixed(2)} in earnings`,
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            console.error('Error logging earnings:', error);
            Alert.alert('Error', 'Failed to log earnings. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>


                <View style={styles.header}>
                    <Text style={styles.icon}>💰</Text>
                    <Text style={styles.title}>Log Earnings</Text>
                    <Text style={styles.subtitle}>Track your side hustle income</Text>
                </View>

                {activeQuests.length === 0 ? (
                    <Card variant="elevated" padding="lg">
                        <Text style={styles.emptyText}>
                            You don't have any active quests yet. Start a quest to track earnings!
                        </Text>
                        <Button
                            title="Discover Quests"
                            variant="primary"
                            onPress={() => router.push('/(tabs)/discover')}
                            style={styles.discoverButton}
                        />
                    </Card>
                ) : (
                    <>
                        {/* Quest Selection */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Select Quest</Text>
                            <View style={styles.questList}>
                                {activeQuests.map((quest) => (
                                    <TouchableOpacity
                                        key={quest.id}
                                        style={[
                                            styles.questOption,
                                            selectedQuestId === quest.id && styles.questOptionSelected,
                                        ]}
                                        onPress={() => setSelectedQuestId(quest.id)}
                                    >
                                        <Text style={styles.questIcon}>{quest.custom_data.icon}</Text>
                                        <Text
                                            style={[
                                                styles.questTitle,
                                                selectedQuestId === quest.id && styles.questTitleSelected,
                                            ]}
                                            numberOfLines={2}
                                        >
                                            {quest.custom_data.title}
                                        </Text>
                                        {selectedQuestId === quest.id && (
                                            <View style={styles.checkmark}>
                                                <Text style={styles.checkmarkText}>✓</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Amount Input */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Amount Earned</Text>
                            <View style={styles.amountInputContainer}>
                                <Text style={styles.dollarSign}>$</Text>
                                <TextInput
                                    style={styles.amountInput}
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="decimal-pad"
                                    placeholder="0.00"
                                    placeholderTextColor={COLORS.textMuted}
                                />
                            </View>
                        </View>

                        {/* Description Input */}
                        <View style={styles.section}>
                            <Text style={styles.label}>Description (Optional)</Text>
                            <TextInput
                                style={styles.textInput}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="e.g., First client payment, Blog post #5"
                                placeholderTextColor={COLORS.textMuted}
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        {/* Submit Button */}
                        <Button
                            title="Log Earnings"
                            variant="primary"
                            size="lg"
                            fullWidth
                            onPress={handleSubmit}
                            isLoading={isSubmitting}
                            disabled={!selectedQuestId || !amount}
                            style={styles.submitButton}
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
    backButton: {
        marginBottom: SPACING.lg,
    },
    backText: {
        fontSize: FONT_SIZES.base,
        color: COLORS.questGreen,
        fontWeight: '600',
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    icon: {
        fontSize: 64,
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: FONT_SIZES['3xl'],
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    label: {
        fontSize: FONT_SIZES.base,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    questList: {
        gap: SPACING.md,
    },
    questOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.cardBg,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 2,
        borderColor: COLORS.borderColor,
    },
    questOptionSelected: {
        borderColor: COLORS.questGreen,
        backgroundColor: `${COLORS.questGreen}15`,
    },
    questIcon: {
        fontSize: 28,
        marginRight: SPACING.md,
    },
    questTitle: {
        flex: 1,
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    questTitleSelected: {
        color: COLORS.questGreen,
    },
    checkmark: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.questGreen,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmarkText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.darkBg,
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardBg,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 2,
        borderColor: COLORS.borderColor,
        padding: SPACING.md,
    },
    dollarSign: {
        fontSize: FONT_SIZES['3xl'],
        fontWeight: '700',
        color: '#FFD700', // Gold color
        marginRight: SPACING.sm,
    },
    amountInput: {
        flex: 1,
        fontSize: FONT_SIZES['3xl'],
        fontWeight: '700',
        color: COLORS.textPrimary,
        padding: 0,
    },
    textInput: {
        backgroundColor: COLORS.cardBg,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 2,
        borderColor: COLORS.borderColor,
        padding: SPACING.md,
        fontSize: FONT_SIZES.base,
        color: COLORS.textPrimary,
        textAlignVertical: 'top',
        minHeight: 80,
    },
    submitButton: {
        marginTop: SPACING.md,
    },
    emptyText: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.lg,
        lineHeight: 24,
    },
    discoverButton: {
        marginTop: SPACING.md,
    },
});
