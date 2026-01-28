import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/src/components/ui/Button';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { useOnboardingStore } from '@/src/store/onboardingStore';

const RESOURCE_OPTIONS = [
    { id: 'laptop', label: 'Laptop/Computer', icon: '💻' },
    { id: 'smartphone', label: 'Smartphone', icon: '📱' },
    { id: 'camera', label: 'Camera', icon: '📷' },
    { id: 'internet', label: 'Reliable Internet', icon: '🌐' },
    { id: 'transportation', label: 'Transportation', icon: '🚗' },
    { id: 'small-budget', label: 'Small Budget ($50-200)', icon: '💵' },
    { id: 'medium-budget', label: 'Medium Budget ($200+)', icon: '💰' },
    { id: 'space', label: 'Workspace/Studio', icon: '🏠' },
    { id: 'tools', label: 'Professional Tools', icon: '🛠️' },
];

export default function ResourcesScreen() {
    const router = useRouter();
    const { resources, setResources } = useOnboardingStore();
    const [selectedResources, setSelectedResources] = useState<string[]>(resources);

    const toggleResource = (resourceId: string) => {
        setSelectedResources((prev) =>
            prev.includes(resourceId)
                ? prev.filter((id) => id !== resourceId)
                : [...prev, resourceId]
        );
    };

    const handleNext = () => {
        setResources(selectedResources);
        router.push('/onboarding/goals');
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: '75%' }]} />
                    </View>
                    <Text style={styles.step}>Step 3 of 4</Text>
                    <Text style={styles.title}>What resources do you have?</Text>
                    <Text style={styles.subtitle}>
                        Select what you currently have access to
                    </Text>
                </View>

                {/* Resource Grid */}
                <View style={styles.resourceGrid}>
                    {RESOURCE_OPTIONS.map((resource) => {
                        const isSelected = selectedResources.includes(resource.id);
                        return (
                            <TouchableOpacity
                                key={resource.id}
                                style={[
                                    styles.resourceCard,
                                    isSelected && styles.resourceCardSelected,
                                ]}
                                onPress={() => toggleResource(resource.id)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.resourceIcon}>{resource.icon}</Text>
                                <Text
                                    style={[
                                        styles.resourceLabel,
                                        isSelected && styles.resourceLabelSelected,
                                    ]}
                                    numberOfLines={2}
                                >
                                    {resource.label}
                                </Text>
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
                        title="Continue"
                        variant="primary"
                        size="lg"
                        onPress={handleNext}
                        disabled={selectedResources.length === 0}
                        style={styles.continueButton}
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
    resourceGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
        marginBottom: SPACING.xl,
    },
    resourceCard: {
        width: '47%',
        aspectRatio: 1.5,
        backgroundColor: COLORS.cardBg,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 2,
        borderColor: COLORS.borderColor,
        padding: SPACING.md,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    resourceCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: `${COLORS.primary}15`,
    },
    resourceIcon: {
        fontSize: 32,
        marginBottom: SPACING.sm,
    },
    resourceLabel: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    resourceLabelSelected: {
        color: COLORS.primary,
    },
    checkmark: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmarkText: {
        fontSize: 12,
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
    continueButton: {
        flex: 2,
    },
});
