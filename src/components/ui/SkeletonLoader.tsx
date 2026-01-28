import { BORDER_RADIUS, COLORS, SPACING } from '@/src/constants/theme';
import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface SkeletonProps {
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = 20,
    borderRadius = BORDER_RADIUS.md,
    style
}) => {
    return (
        <MotiView
            from={{ opacity: 0.3 }}
            animate={{ opacity: 0.7 }}
            transition={{
                type: 'timing',
                duration: 1000,
                loop: true,
                repeatReverse: true,
            }}
            style={[
                styles.skeleton,
                { width, height, borderRadius, backgroundColor: COLORS.surfaceBg },
                style
            ]}
        />
    );
};

export const QuestCardSkeleton = () => (
    <View style={styles.cardContainer}>
        <View style={styles.header}>
            <Skeleton width={40} height={40} borderRadius={20} />
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Skeleton width="60%" height={24} style={{ marginBottom: 8 }} />
                <Skeleton width="40%" height={16} />
            </View>
        </View>
        <Skeleton width="100%" height={60} style={{ marginVertical: 12 }} />
        <View style={styles.footer}>
            <Skeleton width={80} height={24} borderRadius={12} />
            <Skeleton width={80} height={24} borderRadius={12} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: COLORS.surfaceBg,
    },
    cardContainer: {
        backgroundColor: COLORS.cardBg,
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.xl,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footer: {
        flexDirection: 'row',
        gap: 8,
    }
});
