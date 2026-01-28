import { Button } from '@/src/components/ui/Button';
import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    retryLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
    title = 'Something went wrong',
    message = 'We encountered an error. Please try again.',
    onRetry,
    retryLabel = 'Try Again'
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Feather name="alert-triangle" size={48} color={COLORS.error} />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            {onRetry && (
                <Button
                    title={retryLabel}
                    onPress={onRetry}
                    variant="outline"
                    style={styles.button}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.error + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.lg,
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
        marginBottom: SPACING.xl,
        lineHeight: 22,
    },
    button: {
        minWidth: 150,
    }
});
