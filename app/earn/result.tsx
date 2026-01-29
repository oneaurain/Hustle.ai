import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { generateQuests } from '@/src/services/questService';
import { useIdeaStore } from '@/src/store/ideaStore';
import { useOnboardingStore } from '@/src/store/onboardingStore';
import { QuestData } from '@/src/types';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IdeaResultScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [results, setResults] = useState<QuestData[]>([]);

    // Store for saving ideas
    const { addIdea } = useIdeaStore();

    // Get store data for generation
    const getData = useOnboardingStore((state) => state.getData);

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async () => {
        setIsLoading(true);
        try {
            // Generate fresh ideas based on profile
            const quests = await generateQuests(getData());
            const newQuests = quests.slice(0, 3);

            // Ensure exactly 3 outcomes as requested, OR append if loading more
            setResults(prev => [...prev, ...newQuests]);

        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Your Hustle Ideas 🚀</Text>
                    <Text style={styles.subtitle}>
                        Based on your skills and interests, here are the best matches:
                    </Text>
                </View>

                {isLoading && results.length === 0 ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.loadingText}>AI is crafting your plan...</Text>
                    </View>
                ) : (
                    <View>
                        {results.map((idea, index) => {
                            const isBestMatch = index === 0;
                            return (
                                <Card
                                    key={`${index}-${idea.title}`}
                                    variant="elevated"
                                    padding="md"
                                    style={[
                                        styles.card,
                                        isBestMatch && styles.bestMatchCard
                                    ]}
                                >
                                    {isBestMatch && (
                                        <View style={styles.bestMatchBadge}>
                                            <Text style={styles.bestMatchText}>🏆 Best for You</Text>
                                        </View>
                                    )}
                                    <Text style={styles.ideaTitle}>{idea.title}</Text>
                                    <Text style={styles.ideaDesc}>{idea.shortDescription}</Text>
                                    <View style={styles.matchBadge}>
                                        <Text style={styles.matchText}>Difficulty: {idea.difficulty}/5</Text>
                                    </View>
                                    <View style={styles.buttonRow}>
                                        <Button
                                            title="View Steps"
                                            variant={isBestMatch ? "primary" : "outline"}
                                            size="sm"
                                            onPress={() => router.push({
                                                pathname: '/earn/roadmap',
                                                params: { initialIdea: idea.title }
                                            })}
                                            style={{ flex: 1 }}
                                        />
                                        <Button
                                            title=""
                                            variant="ghost"
                                            size="sm"
                                            icon={<Feather name="bookmark" size={24} color={COLORS.primary} />} // Increased size
                                            onPress={() => {
                                                addIdea(idea);
                                            }}
                                            style={{ width: 40, paddingHorizontal: 0 }} // Square-ish for icon
                                        />
                                    </View>
                                </Card>
                            );
                        })}

                        <Button
                            title={isLoading ? "Loading..." : "Generate More Ideas ✨"}
                            variant="outline"
                            onPress={loadResults}
                            disabled={isLoading}
                            style={styles.loadMoreButton}
                        />
                    </View>
                )}

                <Button
                    title="Done"
                    variant="ghost"
                    size="lg"
                    fullWidth
                    onPress={() => router.push('/(tabs)/earn')}
                    style={styles.doneButton}
                />
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
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: FONT_SIZES['3xl'],
        color: COLORS.textPrimary,
        fontFamily: 'GravitasOne_400Regular',
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
    },
    card: {
        marginBottom: SPACING.lg,
    },
    ideaTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    ideaDesc: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
    },
    matchBadge: {
        marginBottom: SPACING.sm,
    },
    matchText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.questGreen,
        fontWeight: '600',
    },
    loadingContainer: {
        padding: SPACING.xl,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: SPACING.md,
        color: COLORS.textSecondary,
    },
    doneButton: {
        marginTop: SPACING.md,
        marginBottom: SPACING.xl,
    },
    bestMatchCard: {
        borderColor: '#FFD700', // Gold
        borderWidth: 2,
        backgroundColor: 'rgba(255, 215, 0, 0.05)',
    },
    bestMatchBadge: {
        backgroundColor: '#FFD700',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: SPACING.sm,
    },
    bestMatchText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: FONT_SIZES.xs,
    },
    loadMoreButton: {
        marginTop: SPACING.md,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
        alignItems: 'center',
    }
});
