import { Button } from '@/src/components/ui/Button';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SHADOWS, SPACING } from '@/src/constants/theme';
import { useAlertStore } from '@/src/store/alertStore';
import { Feather } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

export const CustomAlert = () => {
    const { visible, title, message, buttons, hideAlert } = useAlertStore();

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={hideAlert}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 200 }}
                    style={styles.alertContainer}
                >
                    <View style={styles.content}>
                        <View style={styles.iconContainer}>
                            <Feather name="info" size={32} color={COLORS.primary} />
                        </View>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.message}>{message}</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        {buttons.map((btn, index) => {
                            // Map 'destructive' | 'cancel' | 'default' to Button variants
                            let variant: 'primary' | 'secondary' | 'ghost' | 'outline' = 'primary';

                            if (btn.style === 'cancel') variant = 'ghost';
                            if (btn.style === 'destructive') variant = 'primary'; // Or custom danger variant if Button supports it, but primary is fine

                            // If it's a destructive action, we might want to manually style it if Button doesn't have a 'destructive' variant
                            // Since Button doesn't explicitly have 'destructive', we can override style
                            const isDestructive = btn.style === 'destructive';

                            return (
                                <View key={index} style={{ flex: 1, marginLeft: index > 0 ? SPACING.sm : 0 }}>
                                    <Button
                                        title={btn.text}
                                        variant={variant}
                                        size="md"
                                        onPress={() => {
                                            hideAlert();
                                            if (btn.onPress) btn.onPress();
                                        }}
                                        style={isDestructive ? { backgroundColor: COLORS.error } : {}}
                                    />
                                </View>
                            );
                        })}
                    </View>
                </MotiView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    alertContainer: {
        backgroundColor: COLORS.cardBg, // Use consistent card background
        borderRadius: BORDER_RADIUS['2xl'],
        width: '100%',
        maxWidth: 340,
        ...SHADOWS.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.borderColor,
    },
    content: {
        padding: SPACING.xl,
        alignItems: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.surfaceBg,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    message: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        padding: SPACING.md,
        backgroundColor: COLORS.surfaceBg, // Slightly different bg for actions
        borderTopWidth: 1,
        borderTopColor: COLORS.borderColor,
    },
});
