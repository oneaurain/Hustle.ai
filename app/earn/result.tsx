import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IdeaResultScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Your Hustle Ideas 🚀</Text>
                    <Text style={styles.subtitle}>
                        Based on your skills and interests, here are the best matches:
                    </Text>
                </View>

                {/* Ideas List */}
                <Card variant="elevated" padding="md" style={styles.card}>
                    <Text style={styles.ideaTitle}>Idea 1: Freelance Graphic Design</Text>
                    <Text style={styles.ideaDesc}>
                        Use your design skills to create logos and branding for small businesses.
                    </Text>
                    <Button
                        title="View Steps"
                        variant="outline"
                        size="sm"
                        onPress={() => { }}
                    />
                </Card>

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
    doneButton: {
        marginTop: SPACING.xl,
    },
});
