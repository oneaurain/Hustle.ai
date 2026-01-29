import { Button } from '@/src/components/ui/Button';
import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TypewriterText } from '../src/components/ui/TypewriterText';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    {/* <Image
                        source={require('@/assets/icon.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    /> */}
                </View>

                {/* Title */}
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Welcome to Hustle.ai</Text>
                    <TypewriterText
                        text="'Your next money hustle starts here'"
                        style={styles.tagline}
                        speed={40}
                    />
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    Discover AI-powered side hustles personalized just for you.
                    Turn your skills into income with step-by-step guidance.
                </Text>

                {/* CTA Buttons */}
                <View style={styles.buttonContainer}>
                    <Button
                        title="Get Started"
                        variant="primary"
                        size="lg"
                        fullWidth
                        onPress={() => router.push('/signup')}
                    />

                    <Button
                        title="Sign In"
                        variant="outline"
                        size="lg"
                        fullWidth
                        onPress={() => router.push('/login')}
                    />
                </View>


            </View>
        </SafeAreaView>
    );
}

const FeatureItem: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
    <View style={styles.featureItem}>
        <Text style={styles.featureIcon}>{icon}</Text>
        <Text style={styles.featureText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.darkBg,
    },
    content: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING['3xl'],
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: SPACING['2xl'],
    },
    logo: {
        width: 120,
        height: 120,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    title: {
        fontFamily: 'GravitasOne_400Regular',
        fontSize: FONT_SIZES['4xl'],
        fontWeight: '400',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    tagline: {
        fontSize: FONT_SIZES.lg,
        color: '#272727d8',
        fontWeight: '600',
        textAlign: 'center',
    },
    description: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: SPACING['2xl'],
    },
    buttonContainer: {
        gap: SPACING.md,
        marginBottom: SPACING['2xl'],
    },
    features: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: SPACING.lg,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderColor,
    },
    featureItem: {
        alignItems: 'center',
        gap: SPACING.xs,
    },
    featureIcon: {
        fontSize: 24,
    },
    featureText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
});
