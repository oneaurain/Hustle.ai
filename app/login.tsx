import { makeRedirectUri } from 'expo-auth-session';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
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
import { supabase } from '@/src/config/supabase';
import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { signIn } from '@/src/services/authService';
import { useAuthStore } from '@/src/store/authStore';
import { Feather } from '@expo/vector-icons';

export default function LoginScreen() {
    const router = useRouter();
    const { setUser, setGuest } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setIsLoading(true);
        const result = await signIn({ email, password });
        setIsLoading(false);

        if (result.error) {
            Alert.alert('Login Failed', result.error.message);
        } else if (result.data) {
            setUser(result.data);
            router.replace('/(tabs)');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const redirectUrl = makeRedirectUri({ scheme: 'hustle-ai' }); // Ensure scheme matches app.json
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                    skipBrowserRedirect: true,
                },
            });

            if (error) throw error;

            if (data?.url) {
                const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
                if (result.type === 'success' && result.url) {
                    // Extract tokens from the URL fragment
                    const params = result.url.split('#')[1] || result.url.split('?')[1];
                    if (params) {
                        const searchParams = new URLSearchParams(params);
                        const access_token = searchParams.get('access_token');
                        const refresh_token = searchParams.get('refresh_token');

                        if (access_token && refresh_token) {
                            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                                access_token,
                                refresh_token,
                            });
                            if (sessionError) throw sessionError;

                            if (sessionData.user) {
                                setUser(sessionData.user);
                                router.replace('/(tabs)');
                            }
                        }
                    }
                }
            }
        } catch (error: any) {
            Alert.alert('Google Sign In Error', error.message);
        }
    };

    const handleGuestLogin = () => {
        setGuest(true);
        router.replace('/(tabs)');
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
                        <Text style={styles.title}>Welcome Back!</Text>
                        <Text style={styles.subtitle}>Sign in to continue your hustle</Text>
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

                        <Button
                            title="Sign In"
                            variant="primary"
                            size="lg"
                            fullWidth
                            isLoading={isLoading}
                            onPress={handleLogin}
                            style={styles.loginButton}
                        />

                        <Button
                            title="Forgot Password?"
                            variant="ghost"
                            size="sm"
                            onPress={async () => {
                                if (!email) {
                                    Alert.alert("Input Required", "Please enter your email to reset password.");
                                    return;
                                }
                                try {
                                    const { error } = await supabase.auth.resetPasswordForEmail(email);
                                    if (error) Alert.alert("Error", error.message);
                                    else Alert.alert("Success", "Check your email for the reset link!");
                                } catch (err: any) {
                                    Alert.alert("Error", err.message);
                                }
                            }}
                        />

                        {/* Password reset not needed for OTP */}

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <Button
                            title="Continue with Google"
                            variant="outline"
                            onPress={handleGoogleLogin}
                            fullWidth
                            icon={<Feather name="globe" size={20} color={COLORS.primary} />}
                            style={styles.socialButton}
                        />

                        <Button
                            title="Continue as Guest"
                            variant="ghost"
                            onPress={handleGuestLogin}
                            fullWidth
                            style={styles.guestButton}
                        />
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <Button
                            title="Sign Up"
                            variant="ghost"
                            size="sm"
                            onPress={() => router.push('/signup')}
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
    loginButton: {
        marginTop: SPACING.md,
        marginBottom: SPACING.sm,
    },
    socialButton: {
        marginBottom: SPACING.xs,
    },
    guestButton: {
        marginTop: SPACING.xs,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.borderColor,
    },
    dividerText: {
        marginHorizontal: SPACING.md,
        color: COLORS.textMuted,
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
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
