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

const SKILL_OPTIONS = [
    { id: 'writing', label: 'Writing', icon: '✍️' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'development', label: 'Development', icon: '💻' },
    { id: 'photography', label: 'Photography', icon: '📸' },
    { id: 'video-editing', label: 'Video Editing', icon: '🎬' },
    { id: 'social-media', label: 'Social Media', icon: '📱' },
    { id: 'marketing', label: 'Marketing', icon: '📊' },
    { id: 'teaching', label: 'Teaching', icon: '👨‍🏫' },
    { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'art', label: 'Art', icon: '🖼️' },
    { id: 'languages', label: 'Languages', icon: '🗣️' },
    { id: 'fitness', label: 'Fitness', icon: '💪' },
];

export default function SkillsScreen() {
    const router = useRouter();
    const { skills, setSkills } = useOnboardingStore();
    const [selectedSkills, setSelectedSkills] = useState<string[]>(skills);

    const toggleSkill = (skillId: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skillId)
                ? prev.filter((id) => id !== skillId)
                : [...prev, skillId]
        );
    };

    const handleNext = () => {
        setSkills(selectedSkills);
        router.push('/onboarding/time');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: '25%' }]} />
                    </View>
                    <Text style={styles.step}>Step 1 of 4</Text>
                    <Text style={styles.title}>What are your skills?</Text>
                    <Text style={styles.subtitle}>
                        Select all that apply. We'll match you with relevant quests.
                    </Text>
                </View>

                {/* Skill Grid */}
                <View style={styles.skillGrid}>
                    {SKILL_OPTIONS.map((skill) => {
                        const isSelected = selectedSkills.includes(skill.id);
                        return (
                            <TouchableOpacity
                                key={skill.id}
                                style={[
                                    styles.skillCard,
                                    isSelected && styles.skillCardSelected,
                                ]}
                                onPress={() => toggleSkill(skill.id)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.skillIcon}>{skill.icon}</Text>
                                <Text
                                    style={[
                                        styles.skillLabel,
                                        isSelected && styles.skillLabelSelected,
                                    ]}
                                >
                                    {skill.label}
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
                    <Text style={styles.selectedCount}>
                        {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected
                    </Text>
                    <Button
                        title="Continue"
                        variant="primary"
                        size="lg"
                        fullWidth
                        onPress={handleNext}
                        disabled={selectedSkills.length === 0}
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
        lineHeight: 22,
    },
    skillGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
        marginBottom: SPACING.xl,
    },
    skillCard: {
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
    skillCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: `${COLORS.primary}15`,
    },
    skillIcon: {
        fontSize: 32,
        marginBottom: SPACING.sm,
    },
    skillLabel: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    skillLabelSelected: {
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
        gap: SPACING.md,
    },
    selectedCount: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.primary,
        textAlign: 'center',
    },
});
