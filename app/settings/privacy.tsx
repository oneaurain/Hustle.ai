import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.title}>Privacy Policy</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.paragraph}>
                    Last Updated: January 28, 2026
                </Text>

                <Text style={styles.heading}>1. Introduction</Text>
                <Text style={styles.paragraph}>
                    Welcome to SideQuest ("we," "our," or "us"). We respect your privacy and represent that we handle your data with care. This Privacy Policy explains how we collect, use, and share your information when you use our mobile application.
                </Text>

                <Text style={styles.heading}>2. Information We Collect</Text>
                <Text style={styles.paragraph}>
                    • **Account Information:** Email address and authentication data via Supabase.
                    • **Usage Data:** Quest progress, earnings history, and app interaction data.
                    • **Device Data:** Device type, OS version, and advertising IDs (Google AdMob).
                    • **Payment Data:** Transaction history via Stripe (we do not store full credit card numbers).
                </Text>

                <Text style={styles.heading}>3. Third-Party Services</Text>
                <Text style={styles.paragraph}>
                    We use trusted third-party services to operate our app:
                    • **Google AdMob:** To display advertisements (banner and rewarded). Google collects device identifiers.
                    • **Stripe:** To process secure payments.
                    • **Supabase:** For secure authentication and database hosting.
                    • **AI Service:** To generate personalized quest roadmaps.
                </Text>

                <Text style={styles.heading}>4. Data Deletion</Text>
                <Text style={styles.paragraph}>
                    You have the right to request the deletion of your account and all associated data. You can perform this action directly within the App Settings &rarr; Delete Account. This will permanently remove your data from our servers.
                </Text>

                <Text style={styles.heading}>5. Contact Us</Text>
                <Text style={styles.paragraph}>
                    If you have questions about this policy, please contact us at support@hustle.ai.
                </Text>
            </ScrollView>
        </SafeAreaView >
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
