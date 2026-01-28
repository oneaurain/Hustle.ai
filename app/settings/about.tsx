import { Card } from '@/src/components/ui/Card';
import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
    const router = useRouter();

    const openLink = (url: string) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.title}>About Us</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Hero Image */}
                {/* Hero Image / Logo */}
                <View style={styles.imageContainer}>
                    <View style={styles.logoWrapper}>
                        <Image
                            source={require('@/assets/comp.png')}
                            style={styles.heroImage}
                            resizeMode="cover"
                        />
                    </View>
                </View>


                <View style={styles.section}>
                    <Text style={styles.appName}>Hustle.ai</Text>
                    <Text style={styles.version}>Version 1.0.0</Text>
                    <Text style={styles.description}>
                        Hustle.ai is your ultimate companion for discovering and managing side hustles.
                        Powered by advanced AI APIs, we analyze market trends to generate personalized
                        earning opportunities just for you.
                    </Text>
                </View>

                {/* Social Media Links */}
                <View style={styles.socialContainer}>
                    <TouchableOpacity
                        style={[styles.socialButton, { backgroundColor: '#FF0000', borderColor: '#FF0000' }]}
                        onPress={() => openLink('https://youtube.com/@har4hit')}
                    >
                        <FontAwesome name="youtube-play" size={20} color="#FFFFFF" />
                        <Text style={styles.socialText}>YouTube</Text>
                    </TouchableOpacity>


                </View>

                <Card variant="outlined" style={styles.devCard}>
                    <View style={styles.devHeader}>
                        <Feather name="code" size={24} color={COLORS.primary} />
                        <Text style={styles.devTitle}>Developer & Company</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Lead Developer</Text>
                        <Text style={styles.value}>Harshit & Aarav</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Published By</Text>
                        <Text style={styles.value}>AURA.IN</Text>
                    </View>
                </Card>

                <View style={styles.techSection}>
                    <Text style={styles.sectionTitle}>Technology Stack</Text>
                    <Text style={styles.techText}>
                        Built with React Native and Expo Go.
                        Our backend leverages scalable cloud infrastructure to deliver
                        real-time insights and secure data management.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.copyright}>© 2026 Aura.in. All rights reserved.</Text>
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
        paddingBottom: SPACING['3xl'],
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: SPACING.lg,
    },
    heroImage: {
        width: 150,
        height: 150,
        borderRadius: 100,
    },
    logoWrapper: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
        // Container for dashed border
        width: 156,
        height: 156,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        justifyContent: 'center',
    },
    section: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    appName: {
        fontSize: FONT_SIZES['3xl'],
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 4,
        fontFamily: 'GravitasOne_400Regular',
    },
    version: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
    },
    description: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.md,
        marginBottom: SPACING.xl,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 16,
        gap: 10,
        // Default border/bg overwritten by gradient where used
    },
    socialText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: FONT_SIZES.base,
        letterSpacing: 0.5,
    },
    devCard: {
        marginBottom: SPACING.xl,
        padding: SPACING.lg,
    },
    devHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    devTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.xs,
    },
    label: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
    },
    value: {
        fontSize: FONT_SIZES.base,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.borderColor,
        marginVertical: SPACING.sm,
    },
    techSection: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    techText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },
    footer: {
        alignItems: 'center',
        marginTop: 'auto',
    },
    copyright: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textMuted,
    },
});
