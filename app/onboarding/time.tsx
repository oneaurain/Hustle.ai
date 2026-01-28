import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/src/components/ui/Button';
import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { useOnboardingStore } from '@/src/store/onboardingStore';

export default function TimeScreen() {
    const router = useRouter();
    const { available_hours_per_week, setHours } = useOnboardingStore();
    const [hours, setHoursLocal] = useState(available_hours_per_week || 5);

    const handleNext = () => {
        setHours(hours);
        router.push('/onboarding/resources');
    };

    const handleBack = () => {
        router.back();
    };

    const getTimeDescription = () => {
        if (hours < 5) return 'Perfect for micro-hustles';
        if (hours < 10) return 'Good for side projects';
        if (hours < 20) return 'Room for serious income';
        return 'Could replace full-time job!';
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: '50%' }]} />
                    </View>
                    <Text style={styles.step}>Step 2 of 4</Text>
                    <Text style={styles.title}>How much time do you have?</Text>
                    <Text style={styles.subtitle}>
                        Weekly hours you can dedicate to side hustles
                    </Text>
                </View>

                {/* Time Selector */}
                <View style={styles.timeContainer}>
                    <View style={styles.hoursDisplay}>
                        <Text style={styles.hoursNumber}>{hours}</Text>
                        <Text style={styles.hoursLabel}>hours/week</Text>
                    </View>

                    <Text style={styles.description}>{getTimeDescription()}</Text>

                    <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={40}
                        step={1}
                        value={hours}
                        onValueChange={setHoursLocal}
                        minimumTrackTintColor={COLORS.primary}
                        maximumTrackTintColor={COLORS.borderColor}
                        thumbTintColor={COLORS.primary}
                    />

                    <View style={styles.sliderLabels}>
                        <Text style={styles.sliderLabel}>1h</Text>
                        <Text style={styles.sliderLabel}>40h</Text>
                    </View>

                    {/* Time Examples */}
                    <View style={styles.examples}>
                        <Text style={styles.examplesTitle}>For reference:</Text>
                        <Text style={styles.example}>• 5-10h = 1-2 hours per day</Text>
                        <Text style={styles.example}>• 10-20h = Part-time schedule</Text>
                        <Text style={styles.example}>• 20-40h = Full-time hustle</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Button
                        title="Back"
                        variant="outline"
                        size="lg"
                        fullWidth
                        onPress={handleBack}
                    />
                    <Button
                        title="Continue"
                        variant="primary"
                        size="lg"
                        fullWidth
                        onPress={handleNext}
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
        backgroundColor: COLORS.primary,
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
    timeContainer: {
        flex: 1,
        marginBottom: SPACING.xl,
    },
    hoursDisplay: {
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    hoursNumber: {
        fontSize: 72,
        fontWeight: '700',
        color: COLORS.primary,
        lineHeight: 80,
    },
    hoursLabel: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.textSecondary,
    },
    description: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '600',
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: SPACING.xl,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
    },
    sliderLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textMuted,
    },
    examples: {
        backgroundColor: COLORS.cardBg,
        padding: SPACING.lg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
    },
    examplesTitle: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    example: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    footer: {
        gap: SPACING.md,
    },
});
