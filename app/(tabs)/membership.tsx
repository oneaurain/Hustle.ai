import { Button } from '@/src/components/ui/Button';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { paymentService } from '@/src/services/paymentService';
import { useAuthStore } from '@/src/store/authStore';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MembershipScreen() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    // Mock referral count - in real app would come from DB
    const referralCount = user?.user_metadata?.referral_count || 0;
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async () => {
        setIsLoading(true);
        try {
            // Apply 10% discount if 3+ referrals
            const price = referralCount >= 3 ? 449 : 499; // in cents

            const isInitialized = await paymentService.initializePaymentSheet(price);
            if (isInitialized) {
                const success = await paymentService.openPaymentSheet();
                if (success) {
                    // Unlock features
                    Alert.alert('Welcome to Pro!', 'All premium features are now unlocked.');
                    // TODO: Update user metadata in backend
                }
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Something went wrong during checkout.');
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        "Unlimited AI Quest Generation",
        "Priority Access to High-Value Gigs",
        "Exclusive 'Hustle Pro' Badge",
        "Advanced Analytics Dashboard",
        "24/7 Priority Support"
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Unlock Your Potential</Text>
                    <Text style={styles.subtitle}>Supercharge your side hustle journey with Hustle.ai Pro.</Text>
                </View>

                {/* Pro Card */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.card}>
                    <View style={styles.badgeContainer}>
                        <Feather name="zap" size={20} color={COLORS.darkBg} />
                        <Text style={styles.badgeText}>BEST VALUE</Text>
                    </View>

                    <Text style={styles.planName}>Hustle Pro🥵</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.currency}>$</Text>
                        <Text style={styles.price}>4.99</Text>
                        <Text style={styles.period}>/month</Text>
                    </View>

                    <View style={styles.featuresList}>
                        {features.map((feature, index) => (
                            <View key={index} style={styles.featureItem}>
                                <Feather name="check-circle" size={20} color={COLORS.primary} />
                                <Text style={styles.featureText}>{feature}</Text>
                            </View>
                        ))}
                    </View>

                    <Button
                        title={isLoading ? "Processing..." : "Upgrade Now"}
                        variant="primary"
                        size="lg"
                        fullWidth
                        disabled={isLoading}
                        onPress={handleUpgrade}
                        iconRight={!isLoading ? <Feather name="arrow-right" size={20} color={COLORS.textInverse} /> : undefined}
                    />

                    {/* Referral Discount Badge */}
                    {referralCount >= 3 && (
                        <View style={styles.discountBadge}>
                            <Feather name="tag" size={14} color={COLORS.textInverse} />
                            <Text style={styles.discountText}>10% Referral Discount Applied!</Text>
                        </View>
                    )}

                    <Text style={styles.guarantee}>7-day money-back guarantee. Cancel anytime.</Text>
                </Animated.View>

                <View style={styles.freeTier}>
                    <Text style={styles.freeTitle}>Current Plan: Free Tier</Text>
                    <Text style={styles.freeText}>Restricted to 3 quests/month. Basic analytics.</Text>
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
    scrollContent: {
        padding: SPACING.lg,
    },
    header: {
        marginBottom: SPACING.xl,
        alignItems: 'center',
    },
    title: {
        fontFamily: 'GravitasOne_400Regular',
        fontSize: FONT_SIZES['3xl'],
        fontWeight: '400',
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
        textAlign: 'center',
        paddingHorizontal: SPACING.lg,
    },
    card: {
        backgroundColor: COLORS.cardBg,
        borderRadius: BORDER_RADIUS['2xl'],
        padding: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 8,
        position: 'relative',
    },
    badgeContainer: {
        position: 'absolute',
        top: -16,
        alignSelf: 'center',
        backgroundColor: COLORS.warning,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: BORDER_RADIUS.full,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    badgeText: {
        color: COLORS.darkBg,
        fontWeight: '800',
        fontSize: FONT_SIZES.xs,
    },
    planName: {
        fontSize: FONT_SIZES['2xl'],
        fontWeight: '700',
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginTop: SPACING.md,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginBottom: SPACING.xl,
    },
    currency: {
        fontSize: FONT_SIZES.xl,
        color: COLORS.textSecondary,
        marginBottom: 8,
        marginRight: 4,
    },
    price: {
        fontSize: 48,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    period: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
        marginBottom: 8,
        marginLeft: 4,
    },
    featuresList: {
        gap: SPACING.md,
        marginBottom: SPACING.xl,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    featureText: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textPrimary,
    },
    guarantee: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: SPACING.md,
    },
    freeTier: {
        marginTop: SPACING.xl,
        alignItems: 'center',
        padding: SPACING.lg,
    },
    freeTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    freeText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    discountBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.success,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: BORDER_RADIUS.md,
        marginTop: SPACING.md,
        gap: 6,
    },
    discountText: {
        color: COLORS.textInverse,
        fontWeight: 'bold',
        fontSize: FONT_SIZES.xs,
    },
});
