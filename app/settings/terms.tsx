import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.title}>Terms of Service</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.paragraph}>
                    Last Updated: January 1, 2026
                </Text>

                <Text style={styles.heading}>1. Acceptance of Terms</Text>
                <Text style={styles.paragraph}>
                    By accessing and using Hustle.ai, you accept and agree to be bound by the terms and provision of this agreement.
                </Text>

                <Text style={styles.heading}>2. Use License</Text>
                <Text style={styles.paragraph}>
                    Permission is granted to temporarily download one copy of the materials (information or software) on Hustle.ai's website for personal, non-commercial transitory viewing only.
                </Text>

                <Text style={styles.heading}>3. Disclaimer</Text>
                <Text style={styles.paragraph}>
                    The materials on Hustle.ai's website are provided "as is". Hustle.ai makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </Text>

                <Text style={styles.heading}>4. Limitations</Text>
                <Text style={styles.paragraph}>
                    In no event shall Hustle.ai or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Hustle.ai's Internet site.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.darkBg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderColor,
    },
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    content: {
        padding: SPACING.lg,
    },
    heading: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    paragraph: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
        lineHeight: 24,
        marginBottom: SPACING.md,
    },
});
