import { Button } from '@/src/components/ui/Button';
import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EarnIdeasScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Earn Ideas</Text>
                    <Text style={styles.subtitle}>
                        Find your next side hustle tailored to your skills and time.
                    </Text>
                </View>

                {/* Placeholder for AI Generated Ideas */}
                <View style={styles.emptyState}>
                    <Feather name="cpu" size={64} color={COLORS.textMuted} style={{ marginBottom: SPACING.md }} />
                    <Text style={styles.emptyText}>
                        No ideas generated yet. Let AI find the perfect match for you!
                    </Text>
                </View>

                <Button
                    title="Generate More Ideas"
                    variant="primary"
                    size="lg"
                    fullWidth
                    onPress={() => router.push('/earn/generate')}
                    style={styles.generateButton}
                />

                <Button
                    title="Create Roadmap from Idea "
                    variant="outline"
                    size="lg"
                    fullWidth
                    onPress={() => router.push('/earn/roadmap')}
                    style={styles.roadmapButton}
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
        flexGrow: 1,
        padding: SPACING.lg,
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
        lineHeight: 24,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
    },

    emptyText: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textMuted,
        textAlign: 'center',
        maxWidth: '80%',
    },
    generateButton: {
        marginBottom: SPACING.md,
    },
    roadmapButton: {
        marginBottom: SPACING.xl,
    },
});
