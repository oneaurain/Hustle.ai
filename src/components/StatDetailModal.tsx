import { Button } from '@/src/components/ui/Button';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { Feather } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StatDetailModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    value: string;
    icon: keyof typeof Feather.glyphMap;
    color: string;
    description: string;
    trend?: string;
    history?: { label: string; value: string }[];
}

export const StatDetailModal: React.FC<StatDetailModalProps> = ({
    visible,
    onClose,
    title,
    value,
    icon,
    color,
    description,
    trend,
    history
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

                <MotiView
                    from={{ opacity: 0, scale: 0.95, translateY: 10 }}
                    animate={{ opacity: 1, scale: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 250 }}
                    style={[styles.modalContent, { borderColor: color }]}
                >
                    <View style={[styles.header, { backgroundColor: color + '10' }]}>
                        <View style={[styles.iconBadge, { backgroundColor: color + '20' }]}>
                            <Feather name={icon} size={24} color={color} />
                        </View>
                    </View>

                    <View style={styles.body}>
                        <Text style={styles.label}>{title}</Text>
                        <Text style={[styles.value, { color: color }]}>{value}</Text>

                        {trend && (
                            <View style={styles.trendBadge}>
                                <Feather name="trending-up" size={14} color={COLORS.success} />
                                <Text style={styles.trendText}>{trend} this week</Text>
                            </View>
                        )}

                        <Text style={styles.description}>{description}</Text>

                        {history && (
                            <View style={styles.historyContainer}>
                                <Text style={styles.historyTitle}>Recent Activity</Text>
                                {history.map((item, index) => (
                                    <View key={index} style={styles.historyRow}>
                                        <Text style={styles.historyLabel}>{item.label}</Text>
                                        <Text style={styles.historyValue}>{item.value}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={styles.footer}>
                        <Button title="Close" onPress={onClose} fullWidth />
                    </View>
                </MotiView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContent: {
        width: '100%',
        backgroundColor: COLORS.cardBg,
        borderRadius: BORDER_RADIUS['2xl'],
        borderWidth: 2,
        overflow: 'hidden',
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: SPACING.lg,
    },
    iconBadge: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        padding: 4,
    },
    body: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.lg,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    value: {
        fontSize: FONT_SIZES['4xl'],
        fontWeight: '800',
        marginBottom: SPACING.xs,
        fontFamily: 'SpaceGrotesk_700Bold',
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: SPACING.lg,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: COLORS.success + '15',
        borderRadius: BORDER_RADIUS.sm,
        alignSelf: 'flex-start',
    },
    trendText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.success,
        fontWeight: '600',
    },
    description: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textPrimary,
        lineHeight: 22,
        marginBottom: SPACING.xl,
    },
    historyContainer: {
        backgroundColor: COLORS.surfaceBg,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
    },
    historyTitle: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
    },
    historyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderColor,
        paddingBottom: SPACING.xs,
    },
    historyLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textPrimary,
    },
    historyValue: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    footer: {
        padding: SPACING.lg,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderColor,
    },
});
