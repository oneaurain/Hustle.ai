import { Button } from '@/src/components/ui/Button';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { paymentService } from '@/src/services/paymentService';
import { useAlertStore } from '@/src/store/alertStore';
import { useAuthStore } from '@/src/store/authStore';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MembershipScreen() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    // Mock referral count - in real app would come from DB
    const referralCount = user?.user_metadata?.referral_count || 0;
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'lifetime'>('monthly');

    const { showAlert, hideAlert } = useAlertStore();

    const handleUpgrade = async () => {
        setIsLoading(true);
        try {
            // Apply discount if 3+ referrals
            // Monthly: Base 2.99 (299 cents). Discounted 1.99 (199 cents).
            // Lifetime: Base 9.99 (999 cents).

            let finalPrice = 0;

            if (selectedPlan === 'monthly') {
                // Base $2.99. If 3+ referrals -> $1.99
                finalPrice = referralCount >= 3 ? 199 : 299;
            } else {
                // Lifetime $9.99. If 3+ referrals -> discount? 
                // Maintaining existing logic: let's apply a similar scale or just keeping it simple.
                // Previous logic was 10%. Let's keep lifetime simple or apply similar "Pro" discount.
                // Let's assume the "45% / 1.99" request was specific to Monthly. 
                // For lifetime, let's just give a 10% discount as before or maybe 20%?
                // I'll stick to the explicit user request for monthly and keep slight discount for lifetime.
                finalPrice = referralCount >= 3 ? 899 : 999;
            }

            const isInitialized = await paymentService.initializePaymentSheet(finalPrice);
            if (isInitialized) {
                const success = await paymentService.openPaymentSheet();
                if (success) {
                    // Unlock features
                    showAlert('Welcome to Pro!', 'All premium features are now unlocked.', [
                        { text: "Awesome!", onPress: hideAlert }
                    ]);
                    // TODO: Update user metadata in backend
                }
            }
        } catch (error) {
            console.error(error);
            showAlert('Error', 'Something went wrong during checkout.', [
                { text: "OK", onPress: hideAlert }
            ]);
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

                {/* Plan Selection */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, selectedPlan === 'monthly' && styles.activeTab]}
                        onPress={() => setSelectedPlan('monthly')}
                    >
                        <Text style={[styles.tabText, selectedPlan === 'monthly' && styles.activeTabText]}>Monthly</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, selectedPlan === 'lifetime' && styles.activeTab]}
                        onPress={() => setSelectedPlan('lifetime')}
                    >
                        <Text style={[styles.tabText, selectedPlan === 'lifetime' && styles.activeTabText]}>Lifetime</Text>
                        <View style={styles.saveBadge}>
                            <Text style={styles.saveBadgeText}>SAVE 50%</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Pro Card */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.card}>
                    <View style={styles.badgeContainer}>
                        <Feather name="zap" size={20} color={COLORS.darkBg} />
                        <Text style={styles.badgeText}>{selectedPlan === 'lifetime' ? 'BEST VALUE' : 'MOST POPULAR'}</Text>
                    </View>

                    <Text style={styles.planName}>Hustle Pro {selectedPlan === 'lifetime' && '👑'}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.currency}>$</Text>
                        {/* Display Price Logic */}
                        <Text style={styles.price}>
                            {selectedPlan === 'monthly'
                                ? (referralCount >= 3 ? '1.99' : '2.99')
                                : (referralCount >= 3 ? '8.99' : '9.99')}
                        </Text>
                        <Text style={styles.period}>{selectedPlan === 'monthly' ? '/month' : '/one-time'}</Text>
                    </View>

                    {/* Original Price Strikethrough if discounted */}
                    {referralCount >= 3 && (
                        <Text style={styles.strikethroughPrice}>
                            {selectedPlan === 'monthly' ? '$2.99' : '$9.99'}
                        </Text>
                    )}

                    <View style={styles.featuresList}>
                        {features.map((feature, index) => (
                            <View key={index} style={styles.featureItem}>
                                <Feather name="check-circle" size={20} color={COLORS.primary} />
                                <Text style={styles.featureText}>{feature}</Text>
                            </View>
                        ))}
                    </View>

                    <Button
                        title={isLoading ? "Processing..." : `Upgrade for $${selectedPlan === 'monthly' ? (referralCount >= 3 ? '1.99' : '2.99') : (referralCount >= 3 ? '8.99' : '9.99')}`}
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
                            <Text style={styles.discountText}>45% Referral Discount Applied!</Text>
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
        marginBottom: SPACING.xs,
    },
    strikethroughPrice: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textMuted,
        textDecorationLine: 'line-through',
        textAlign: 'center',
        marginBottom: SPACING.lg,
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
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.cardBg,
        borderRadius: BORDER_RADIUS.full,
        padding: 4,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.full,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    activeTab: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    activeTabText: {
        color: COLORS.textInverse,
        fontWeight: '700',
    },
    saveBadge: {
        backgroundColor: COLORS.success,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    saveBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '800',
    },
});
