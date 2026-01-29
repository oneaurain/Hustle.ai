import { Button } from '@/src/components/ui/Button';
import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { useAuthStore } from '@/src/store/authStore';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface AuthGateProps {
    children: React.ReactNode;
    title?: string;
    message?: string;
}

export const AuthGate: React.FC<AuthGateProps> = ({
    children,
    title = "Unlock AI Features",
    message = "Sign in to access AI-powered tools, save your progress, and level up your career."
}) => {
    const { user, isGuest } = useAuthStore();
    const router = useRouter();

    if (user && !isGuest) {
        return <>{children}</>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Feather name="lock" size={32} color={COLORS.primary} />
                </View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Sign In / Sign Up"
                        onPress={() => router.push('/login')}
                        fullWidth
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.darkBg,
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    content: {
        backgroundColor: COLORS.cardBg,
        padding: SPACING.xl,
        borderRadius: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.borderColor,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(0, 255, 163, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    message: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xl,
        lineHeight: 24,
    },
    buttonContainer: {
        width: '100%',
    }
});
