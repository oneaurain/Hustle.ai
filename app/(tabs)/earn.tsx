import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Toast } from '@/src/components/ui/Toast';
import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { useIdeaStore } from '@/src/store/ideaStore';
import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EarnIdeasScreen() {
    const router = useRouter();
    const { savedIdeas, removeIdea } = useIdeaStore();
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const handleCopy = async (text: string) => {
        await Clipboard.setStringAsync(text);
        setToastMessage("Copied to clipboard!");
        setTimeout(() => setToastMessage(null), 2000);
    };

    const handleShare = async (idea: any) => {
        try {
            await Share.share({
                message: `Check out this side quest idea: ${idea.title} - ${idea.shortDescription}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = (title: string) => {
        Alert.alert(
            "Delete Idea",
            "Are you sure you want to remove this idea?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => removeIdea(title) }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Earn Ideas</Text>
                    <Text style={styles.subtitle}>
                        Find your next side hustle tailored to your skills and time.
                    </Text>
                </View>

                {savedIdeas.length === 0 ? (
                    /* Empty State */
                    <View style={styles.emptyState}>
                        <Feather name="cpu" size={64} color={COLORS.textMuted} style={{ marginBottom: SPACING.md }} />
                        <Text style={styles.emptyText}>
                            No ideas saved yet. Let AI generate a tailored plan for you!
                        </Text>
                    </View>
                ) : (
                    /* Saved Ideas List */
                    <View style={styles.ideasContainer}>
                        <Text style={styles.sectionTitle}>Saved Ideas ({savedIdeas.length})</Text>
                        {savedIdeas.map((idea, index) => (
                            <Card key={`${index}-${idea.title}`} variant="default" padding="md" style={styles.ideaCard}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.ideaTitle}>{idea.title}</Text>
                                    <View style={styles.difficultyBadge}>
                                        <Text style={styles.difficultyText}>Difficulty: {idea.difficulty}/5</Text>
                                    </View>
                                </View>
                                <Text style={styles.ideaDesc}>{idea.shortDescription}</Text>

                                <View style={styles.actionRow}>
                                    <TouchableOpacity style={styles.iconButton} onPress={() => handleCopy(`${idea.title}\n${idea.shortDescription}`)}>
                                        <Feather name="copy" size={18} color={COLORS.textSecondary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.iconButton} onPress={() => handleShare(idea)}>
                                        <Feather name="share-2" size={18} color={COLORS.textSecondary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.iconButton} onPress={() => handleDelete(idea.title)}>
                                        <Feather name="trash-2" size={18} color={COLORS.error} />
                                    </TouchableOpacity>
                                    <Button
                                        title="View Roadmap"
                                        size="sm"
                                        variant="outline"
                                        style={{ marginLeft: 'auto' }}
                                        onPress={() => router.push({
                                            pathname: '/earn/roadmap',
                                            params: { initialIdea: idea.title }
                                        })}
                                    />
                                </View>
                            </Card>
                        ))}
                    </View>
                )}

                <View style={styles.footer}>
                    <Button
                        title={savedIdeas.length > 0 ? "Generate New Ideas" : "Generate Ideas"}
                        variant="primary"
                        size="lg"
                        fullWidth
                        onPress={() => router.push('/earn/generate')}
                        style={styles.buttonSpacing}
                    />

                    <Button
                        title="Roadmap"
                        variant="outline"
                        size="lg"
                        fullWidth
                        onPress={() => router.push('/earn/roadmap')}
                    />
                </View>

            </ScrollView>
            {toastMessage && <Toast message={toastMessage} visible={!!toastMessage} onHide={() => setToastMessage(null)} />}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.darkBg,
    },
    scrollContent: {
        flexGrow: 1,
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
        lineHeight: 24,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xl,
    },
    emptyText: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textMuted,
        textAlign: 'center',
        maxWidth: '80%',
    },
    footer: {
        marginTop: 'auto',
        gap: SPACING.sm, // Tighter spacing
        marginBottom: SPACING.lg,
    },
    buttonSpacing: {
        marginBottom: 0,
    },
    // New Styles for List
    ideasContainer: {
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
    },
    ideaCard: {
        marginBottom: SPACING.md,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.xs,
    },
    ideaTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        flex: 1,
        marginRight: SPACING.sm,
    },
    ideaDesc: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
        lineHeight: 20,
    },
    difficultyBadge: {
        backgroundColor: COLORS.surfaceBg,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    difficultyText: {
        fontSize: 10,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderColor,
        paddingTop: SPACING.md,
    },
    iconButton: {
        padding: 4,
    },
});
