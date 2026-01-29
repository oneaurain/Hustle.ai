import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { useReferralStore } from '@/src/store/referralStore';
import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React, { useEffect } from 'react';
import { Alert, Platform, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';

interface ReferralCardProps {
    userName: string;
}

export const ReferralCard: React.FC<ReferralCardProps> = ({ userName }) => {
    const {
        referralCode,
        referralCount,
        generateCode,
        getTier,
        getNextReward,

        getProgress,
        initialize,
    } = useReferralStore();

    useEffect(() => {
        initialize();
        if (!referralCode && userName) {
            generateCode(userName);
        }
    }, [userName]);

    const handleCopy = async () => {
        if (referralCode) {
            await Clipboard.setStringAsync(referralCode);
            if (Platform.OS === 'android') {
                ToastAndroid.show('Referral code copied!', ToastAndroid.SHORT);
            } else {
                Alert.alert('Copied', 'Referral code copied to clipboard!');
            }
        }
    };

    const tier = getTier();
    const progress = getProgress();

    const getTierColor = () => {
        switch (tier) {
            case 'Gold': return '#F59E0B';
            case 'Silver': return '#94A3B8';
            default: return '#B45309'; // Bronze
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Feather name="gift" size={20} color={COLORS.primary} />
                    <Text style={styles.title}>Refer & Earn</Text>
                </View>
                <View style={[styles.tierBadge, { backgroundColor: `${getTierColor()}20`, borderColor: getTierColor() }]}>
                    <Text style={[styles.tierText, { color: getTierColor() }]}>{tier} Member</Text>
                </View>
            </View>

            <Text style={styles.description}>
                Invite friends and earn rewards. Unlock a <Text style={styles.highlight}>10% Discount</Text> after 3 referrals!
            </Text>

            {/* Code Box */}
            <TouchableOpacity style={styles.codeBox} onPress={handleCopy} activeOpacity={0.7}>
                <View>
                    <Text style={styles.codeLabel}>Your Unique Code</Text>
                    <Text style={styles.codeValue}>{referralCode || 'GENERATING...'}</Text>
                </View>
                <Feather name="copy" size={20} color={COLORS.primary} />
            </TouchableOpacity>

            {/* Progress Section */}
            <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressText}>
                        <Text style={{ fontWeight: 'bold' }}>{referralCount}</Text>
                        /{tier === 'Bronze' ? '3' : tier === 'Silver' ? '10' : '∞'} Referrals
                    </Text>
                    <Text style={styles.rewardText}>Next: {getNextReward()}</Text>
                </View>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.cardBg,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        marginBottom: SPACING.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    tierBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
    },
    tierText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    description: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.lg,
        lineHeight: 20,
    },
    highlight: {
        color: COLORS.success,
        fontWeight: '700',
    },
    codeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.surfaceBg,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        marginBottom: SPACING.lg,
        borderStyle: 'dashed',
    },
    codeLabel: {
        fontSize: 10,
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    codeValue: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.primary,
        letterSpacing: 1,
    },
    progressSection: {
        marginTop: SPACING.xs,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    progressText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
    },
    rewardText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.primary,
        fontWeight: '600',
    },
    progressBarBg: {
        height: 6,
        backgroundColor: COLORS.surfaceBg,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.success,
        borderRadius: 3,
    },
});
