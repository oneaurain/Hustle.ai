import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { useAuthStore } from '@/src/store/authStore';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const router = useRouter();
    const { user, clearUser } = useAuthStore();

    const handleSignOut = async () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                        await clearUser();
                        router.replace('/login');
                    }
                }
            ]
        );
    };

    const SettingItem = ({ icon, label, onPress, isDestructive = false }: { icon: any, label: string, onPress: () => void, isDestructive?: boolean }) => (
        <TouchableOpacity style={styles.item} onPress={onPress}>
            <View style={styles.itemLeft}>
                <Feather name={icon} size={20} color={isDestructive ? COLORS.error : COLORS.textPrimary} />
                <Text style={[styles.itemLabel, isDestructive && styles.destructiveLabel]}>{label}</Text>
            </View>
            <Feather name="chevron-right" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
    );

    const SectionHeader = ({ title }: { title: string }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.title}>Settings</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <SectionHeader title="Preferences" />
                <View style={styles.section}>
                    <SettingItem
                        icon="bell"
                        label="Notifications"
                        onPress={() => router.push('/settings/notifications')}
                    />

                </View>

                <SectionHeader title="Legal" />
                <View style={styles.section}>
                    <SettingItem
                        icon="lock"
                        label="Privacy Policy"
                        onPress={() => router.push('/settings/privacy')}
                    />
                    <SettingItem
                        icon="file-text"
                        label="Terms of Service"
                        onPress={() => router.push('/settings/terms')}
                    />
                </View>

                <SectionHeader title="Account" />
                <View style={styles.section}>
                    {user ? (
                        <>
                            <SettingItem
                                icon="log-out"
                                label="Sign Out"
                                onPress={handleSignOut}
                            />
                            <SettingItem
                                icon="trash-2"
                                label="Delete Account"
                                onPress={() => Alert.alert("Delete Account", "This action cannot be undone. Please contact support.")}
                                isDestructive
                            />
                        </>
                    ) : (
                        <SettingItem
                            icon="log-in"
                            label="Sign In / Sign Up"
                            onPress={() => router.push('/login')}
                        />
                    )}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.version}>Version 1.0.0</Text>
                    <Text style={styles.copyright}>© 2026 Hustle.ai</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.darkBg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderColor,
    },
    backButton: {
        padding: 4,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    content: {
        padding: SPACING.lg,
    },
    sectionHeader: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
        marginTop: SPACING.md,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    section: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.surfaceBg,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    itemLabel: {
        fontSize: FONT_SIZES.base,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    destructiveLabel: {
        color: COLORS.error,
    },
    footer: {
        alignItems: 'center',
        marginTop: SPACING.xl,
        marginBottom: SPACING['3xl'],
    },
    version: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textMuted,
    },
    copyright: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textMuted,
        marginTop: 4,
    },
});
