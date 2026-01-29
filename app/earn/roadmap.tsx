import { AuthGate } from '@/src/components/auth/AuthGate';
import { Button } from '@/src/components/ui/Button';
import { ErrorState } from '@/src/components/ui/ErrorState';
import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { generateRoadmap } from '@/src/services/aiService';
import { useRoadmapStore } from '@/src/store/roadmapStore';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RoadmapGeneratorScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();


    // Store
    const { getRoadmap, saveRoadmap, currentRoadmap, setCurrentRoadmap } = useRoadmapStore();

    const [idea, setIdea] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // RESET on every focus (Fresh Start)
    useFocusEffect(
        useCallback(() => {
            if (!params.initialIdea) {
                // Completely fresh start
                setIdea('');
                setCurrentRoadmap(null);
                setError(null);
            } else {
                // Pre-fill idea but do NOT auto-load cached result
                setIdea(params.initialIdea as string);
                setCurrentRoadmap(null);
                setError(null);
            }
        }, [params.initialIdea])
    );

    const handleGenerate = async (queryOverride?: string) => {
        const query = queryOverride || idea;
        if (!query.trim()) {
            Alert.alert('Please enter an idea', 'Tell us what you want to build!');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await generateRoadmap(query);
            if (result) {
                // Save to store
                saveRoadmap(query, result);
            } else {
                setError('Failed to generate roadmap. The AI service might be busy.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAskAI = () => {
        if (!currentRoadmap) return;

        // Navigate to Chat Tab with context
        // We can pass params to the tab screen via a special route or context store
        // For now, let's just go there. Ideally, we push to a specific chat stack.
        // Since user requested "New Page" behavior often implies a stack push, but "Tab" implies switching tabs.
        // Let's switch to the Chat Tab and pass data via a global store or params if Expo Router supports it well.

        // @ts-ignore - Expo router typing issue
        router.push({
            pathname: '/(tabs)/chat',
            params: { context: JSON.stringify(currentRoadmap) }
        });
    };

    return (
        <AuthGate
            title="Unlock AI Roadmaps"
            message="Expert business plans generated in seconds. Sign in to turn your ideas into income."
        >
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    style={styles.keyboardContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.header}>
                            {/* Back button removed */}
                            <View>
                                <Text style={styles.title}>Roadmap Generator</Text>
                                <Text style={styles.subtitle}>
                                    Turn your idea into a step-by-step launch plan.
                                </Text>
                            </View>
                        </View>

                        {error ? (
                            <ErrorState
                                message={error}
                                onRetry={() => setError(null)}
                            />
                        ) : !currentRoadmap && !isLoading ? (
                            <View style={styles.inputSection}>
                                <Text style={styles.label}>What's your idea?</Text>
                                <TextInput
                                    style={styles.textArea}
                                    placeholder="e.g. A dog walking service for busy professionals..."
                                    placeholderTextColor={COLORS.textMuted}
                                    multiline
                                    numberOfLines={4}
                                    value={idea}
                                    onChangeText={setIdea}
                                />
                                <Button
                                    title="Generate Roadmap "
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    onPress={() => handleGenerate()}
                                    style={styles.generateButton}
                                />
                            </View>
                        ) : isLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
                                <Text style={styles.loadingText}>Synthesizing Plan...</Text>
                            </View>
                        ) : currentRoadmap ? (
                            <View style={styles.resultSection}>
                                <View style={styles.resultHeader}>
                                    <Text style={styles.resultTitle}>{currentRoadmap.title}</Text>
                                    <Text style={styles.resultOverview}>{currentRoadmap.overview}</Text>
                                </View>

                                {/* ASK AI CTA */}
                                <TouchableOpacity style={styles.askAiButton} onPress={handleAskAI}>
                                    <View style={styles.askAiContent}>
                                        <Feather name="message-circle" size={24} color="#FFF" style={{ marginRight: 8 }} />
                                        <Text style={styles.askAiText}>Ask More Details</Text>
                                    </View>
                                    <Feather name="chevron-right" size={20} color="#FFF" />
                                </TouchableOpacity>

                                {currentRoadmap.timeline.map((item, index) => (
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

                                <View style={styles.actionSection}>
                                    <Button
                                        title="Start New Idea"
                                        variant="outline"
                                        fullWidth
                                        onPress={() => {
                                            setCurrentRoadmap(null);
                                            setIdea('');
                                        }}
                                        style={styles.resetButton}
                                    />
                                </View>
                            </View>
                        ) : null}
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </AuthGate >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.darkBg, // Fix for white box
    },
    keyboardContainer: {
        flex: 1,
        backgroundColor: COLORS.darkBg, // Fix for white box
    },
    scrollContent: {
        padding: SPACING.lg,
        paddingBottom: 120,
    },
    header: {
        marginBottom: SPACING.xl,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    // backButton removed
    title: {
        fontFamily: 'GravitasOne_400Regular',
        fontSize: FONT_SIZES['2xl'],
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: FONT_SIZES.sm,
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
        borderWidth: 1,
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
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    loader: {
        marginBottom: SPACING.md,
    },
    loadingText: {
        color: COLORS.textSecondary,
        fontSize: FONT_SIZES.base,
    },
    resultHeader: {
        marginBottom: SPACING.lg,
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
    // Ask AI Button (Game Themed)
    askAiButton: {
        backgroundColor: '#000000', // Black
        borderRadius: 12,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#333',
    },
    askAiContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    askAiText: {
        color: '#FFF', // White text
        fontWeight: '900',
        fontSize: FONT_SIZES.lg,
        letterSpacing: 0.5,
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
        borderWidth: 2,
        borderColor: COLORS.darkBg,
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
    actionSection: {
        marginTop: SPACING.xl,
        gap: SPACING.md,
    },
    resetButton: {
        marginTop: SPACING.sm,
    },
});
