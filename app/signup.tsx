import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { signUp } from '@/src/services/authService';
import { useAuthStore } from '@/src/store/authStore';


export default function SignupScreen() {
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = async () => {
        // Validation
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        const result = await signUp({ email, password, confirmPassword });
        setIsLoading(false);

        if (result.error) {
            Alert.alert('Signup Failed', result.error.message);
        } else if (result.data) {
            setUser(result.data);
            // Navigate to onboarding
            router.replace('/onboarding/skills');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Join Hustle.ai</Text>
                        <Text style={styles.subtitle}>
                            Start your journey to financial freedom 
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <Input
                            label="Email"
                            placeholder="your@email.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                        />

                        <Input
                            label="Password"
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            autoComplete="password"
                            rightIcon={
                                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                            }
                            onRightIconPress={() => setShowPassword(!showPassword)}
                        />

                        <Input
                            label="Confirm Password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            autoComplete="password"
                        />

                        <Button
                            title="Create Account"
                            variant="primary"
                            size="lg"
                            fullWidth
                            isLoading={isLoading}
                            onPress={handleSignup}
                            style={styles.signupButton}
                        />

                        <Text style={styles.terms}>
                            By signing up, you agree to our Terms of Service and Privacy Policy
                        </Text>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Button
                            title="Sign In"
                            variant="ghost"
                            size="sm"
                            onPress={() => router.back()}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.darkBg,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: SPACING.lg,
        justifyContent: 'center',
    },
    header: {
        marginBottom: SPACING['2xl'],
    },
    title: {
        fontFamily: 'GravitasOne_400Regular',
        fontSize: FONT_SIZES['4xl'],
        fontWeight: '400',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textSecondary,
    },
    form: {
        marginBottom: SPACING.xl,
    },
    eyeIcon: {
        fontSize: 20,
    },
    signupButton: {
        marginTop: SPACING.md,
        marginBottom: SPACING.md,
    },
    terms: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textMuted,
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
});
