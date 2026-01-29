import { Button } from '@/src/components/ui/Button';
import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface DeleteAccountModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ visible, onClose, onConfirm }) => {
    const [confirmationText, setConfirmationText] = useState('');
    const requiredText = "DELETE";

    const isConfirmed = confirmationText === requiredText;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <View style={styles.overlay}>
                    <View style={styles.container}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Feather name="x" size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>

                        <View style={styles.iconContainer}>
                            <Feather name="alert-triangle" size={32} color={COLORS.error} />
                        </View>

                        <Text style={styles.title}>Delete Account?</Text>

                        <Text style={styles.warningText}>
                            This action is permanent and cannot be undone. You will lose your data.
                        </Text>

                       

                        <Text style={styles.instructionText}>
                            Type "{requiredText}" below to confirm.
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder={requiredText}
                            placeholderTextColor={COLORS.textMuted}
                            value={confirmationText}
                            onChangeText={setConfirmationText}
                            autoCapitalize="characters"
                        />

                        <View style={styles.buttonContainer}>
                            <Button
                                title="Cancel"
                                variant="outline"
                                onPress={onClose}
                                style={{ flex: 1 }}
                            />
                            <Button
                                title="Delete"
                                variant="primary" // Actually want red, but variant might not support it. We can override style.
                                onPress={onConfirm}
                                disabled={!isConfirmed}
                                style={[{ flex: 1, backgroundColor: isConfirmed ? COLORS.error : COLORS.textMuted }]}
                            />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    closeButton: {
        position: 'absolute',
        top: SPACING.md,
        right: SPACING.md,
        zIndex: 10,
        padding: 4,
    },
    container: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 24,
        padding: SPACING.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.error,
        position: 'relative', // Context for absolute close button if needed, but here it's inside
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: FONT_SIZES['2xl'],
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    warningText: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    listContainer: {
        width: '100%',
        gap: 8,
        marginBottom: SPACING.xl,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: COLORS.surfaceBg,
        padding: SPACING.md,
        borderRadius: 12,
    },
    listItemText: {
        color: COLORS.textPrimary,
        fontSize: FONT_SIZES.sm,
        fontWeight: '500',
    },
    instructionText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
    },
    input: {
        width: '100%',
        backgroundColor: COLORS.darkBg,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        borderRadius: 12,
        padding: SPACING.md,
        fontSize: FONT_SIZES.lg,
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: SPACING.xl,
        letterSpacing: 2,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: SPACING.md,
        width: '100%',
    }
});
