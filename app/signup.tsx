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
import { CodeInput } from '@/src/components/ui/CodeInput';
import { Input } from '@/src/components/ui/Input';
import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { signUp } from '@/src/services/authService';
import { useAuthStore } from '@/src/store/authStore';
import { Feather } from '@expo/vector-icons';


export default function SignupScreen() {
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // OTP State
    const [showVerification, setShowVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');

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
        // Supabase SignUp triggers the email dispatch
        const result = await signUp({ email, password, confirmPassword });
        setIsLoading(false);

        if (result.error) {
            Alert.alert('Signup Failed', result.error.message);
        } else {
            // If signup is successful (but unverified), show OTP input
            // Supabase returns null session if email confirmation is required
            if (!result.data?.session && result.data?.user) {
                setShowVerification(true);
                Alert.alert('Verification Code Sent', 'Please check your email for the code.');
            } else if (result.data?.user) {
                // If auto-confirmed (shouldn't happen if confirm email is ON)
                setUser(result.data.user);
                router.replace('/onboarding/skills');
            }
        }
    };

    const handleVerify = async () => {
        if (!verificationCode) {
            Alert.alert('Error', 'Please enter the verification code');
            return;
        }

        setIsLoading(true);
        const { verifyOtp } = await import('@/src/services/authService');
        try {
            const { session, user } = await verifyOtp(email, verificationCode);

            if (session && user) {
                setUser(user);
                router.replace('/onboarding/skills');
            } else {
                Alert.alert('Error', 'Verification failed. Please try again.');
            }
        } catch (error: any) {
            Alert.alert('Verification Failed', error.message || 'Invalid code');
        } finally {
            setIsLoading(false);
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
                        <Text style={styles.title}>
                            {showVerification ? 'Verify Email' : 'Join Hustle.ai'}
                        </Text>
                        <Text style={styles.subtitle}>
                            {showVerification
                                ? `Enter the code sent to ${email}`
                                : 'Start your journey to financial freedom'}
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {!showVerification ? (
                            <>
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
                                        <Feather name={showPassword ? "eye" : "eye-off"} size={20} color={COLORS.textSecondary} />
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
                            </>
                        ) : (
                            <>
                                <View style={{ marginBottom: 24, alignItems: 'center' }}>
                                    <Text style={{ color: COLORS.textSecondary, marginBottom: 8, textAlign: 'center' }}>
                                        Check your email inbox (and spam) for the code.
                                    </Text>
                                </View>

                                <CodeInput
                                    value={verificationCode}
                                    onChangeText={setVerificationCode}
                                    length={6}
                                />

                                <Button
                                    title="Verify & Continue"
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    isLoading={isLoading}
                                    onPress={handleVerify}
                                    style={styles.signupButton}
                                />

                                <Button
                                    title="Resend Code"
                                    variant="ghost"
                                    size="sm"
                                    onPress={async () => {
                                        // Resend Logic
                                        setIsLoading(true);
                                        try {
                                            console.log("Resending signup for:", email);
                                            const res = await signUp({ email, password, confirmPassword });
                                            // Note: signUp will resend confirmation if user exists and is unconfirmed
                                            if (res.error) {
                                                Alert.alert("Resend Failed", res.error.message);
                                            } else {
                                                Alert.alert("Code Resent", "Please check your email.");
                                            }
                                        } catch (e) {
                                            console.error(e);
                                        } finally {
                                            setIsLoading(false);
                                        }
                                    }}
                                    disabled={isLoading}
                                />
                            </>

                        )}
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
