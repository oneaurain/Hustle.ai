import { Button } from '@/src/components/ui/Button';
import { ErrorState } from '@/src/components/ui/ErrorState';
import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { generateRoadmap, RoadmapResponse } from '@/src/services/aiService'; // Ensure this path is correct
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RoadmapGeneratorScreen() {
    const router = useRouter();
    const [idea, setIdea] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!idea.trim()) {
            Alert.alert('Please enter an idea', 'Tell us what you want to build!');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await generateRoadmap(idea);
            if (result) {
                setRoadmap(result);
            } else {
                setError('Failed to generate roadmap. The AI service might be busy.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={100}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Roadmap Generator </Text>
                        <Text style={styles.subtitle}>
                            Turn your idea into a step-by-step launch plan.
                        </Text>
                    </View>

                    {error ? (
                        <ErrorState
                            message={error}
                            onRetry={() => setError(null)}
                        />
                    ) : !roadmap ? (
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>What's your idea?</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="e.g. A dog walking service for busy professionals, or selling vintage clothes on Instagram..."
                                placeholderTextColor={COLORS.textMuted}
                                multiline
                                numberOfLines={4}
                                value={idea}
                                onChangeText={setIdea}
                            />
                            <Button
                                title={isLoading ? "Generating Plan..." : "Generate Roadmap"}
                                variant="primary"
                                size="lg"
                                fullWidth
                                onPress={handleGenerate}
                                disabled={isLoading}
                                style={styles.generateButton}
                            />
                            {isLoading && <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />}
                        </View>
                    ) : (
                        <View style={styles.resultSection}>
                            <View style={styles.resultHeader}>
                                <Text style={styles.resultTitle}>{roadmap.title}</Text>
                                <Text style={styles.resultOverview}>{roadmap.overview}</Text>
                            </View>

                            {roadmap.timeline.map((item, index) => (
                                <View key={index} style={styles.timelineItem}>
                                    <View style={styles.timelineLeft}>
                                        <View style={styles.dot} />
                                        <View style={styles.line} />
                                    </View>
                                    <View style={styles.timelineContent}>
                                        <Text style={styles.weekBadge}>{item.week}</Text>
                                        <Text style={styles.focusText}>{item.focus}</Text>
                                        {item.tasks.map((task, tIndex) => (
                                            <View key={tIndex} style={styles.taskItem}>
                                                <Feather name="check" size={14} color={COLORS.questGreen} />
                                                <Text style={styles.taskText}>{task}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            ))}

                            <Button
                                title="Start New Idea"
                                variant="outline"
                                onPress={() => {
                                    setRoadmap(null);
                                    setIdea('');
                                }}
                                style={styles.resetButton}
                            />
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
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
        paddingBottom: 100,
    },
    header: {
        marginBottom: SPACING.xl,
    },
    title: {
        fontFamily: 'GravitasOne_400Regular',
        fontSize: FONT_SIZES['3xl'],
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
    },
    label: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
        fontWeight: '600',
    },
    textArea: {
        backgroundColor: COLORS.cardBg,
        borderWidth: 2,
        borderColor: COLORS.borderColor,
        borderRadius: 12,
        padding: SPACING.md,
        fontSize: FONT_SIZES.base,
        color: COLORS.textPrimary,
        height: 120,
        textAlignVertical: 'top',
        marginBottom: SPACING.lg,
    },
    generateButton: {
        marginBottom: SPACING.md,
    },
    inputSection: {
        marginBottom: SPACING.xl,
    },
    resultSection: {
        marginBottom: SPACING.xl,
    },
    loader: {
        marginTop: SPACING.md,
    },
    resultHeader: {
        marginBottom: SPACING.xl,
    },
    resultTitle: {
        fontSize: FONT_SIZES['2xl'],
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    resultOverview: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
        fontStyle: 'italic',
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: SPACING.lg,
    },
    timelineLeft: {
        alignItems: 'center',
        marginRight: SPACING.md,
        width: 20,
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
        marginBottom: 4,
    },
    line: {
        flex: 1,
        width: 2,
        backgroundColor: COLORS.borderColor,
    },
    timelineContent: {
        flex: 1,
        backgroundColor: COLORS.cardBg,
        borderRadius: 12,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
    },
    weekBadge: {
        backgroundColor: COLORS.primary,
        color: COLORS.textInverse,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
        fontSize: FONT_SIZES.xs,
        fontWeight: 'bold',
        marginBottom: SPACING.sm,
    },
    focusText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 8,
    },
    taskText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        flex: 1,
    },
    resetButton: {
        marginTop: SPACING.xl,
    },
});
