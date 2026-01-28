
import { ReferralCard } from '@/src/components/referral/ReferralCard';
import { Button } from '@/src/components/ui/Button';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { useTheme } from '@/src/context/ThemeContext';
import { useAuthStore } from '@/src/store/authStore';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const { theme, toggleTheme } = useTheme();
    const { user, isGuest, clearUser, setGuest } = useAuthStore();
    const [name, setName] = useState(user?.user_metadata?.full_name || 'Hustler');
    const [image, setImage] = useState(user?.user_metadata?.avatar_url || null);
    const [isEditing, setIsEditing] = useState(false);

    const handleSignOut = async () => {
        await clearUser();
        router.replace('/login');
    };

    const pickImage = async () => {
        // Request permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            // TODO: Upload to Supabase Storage and update user metadata
        }
    };

    const handleSaveProfile = () => {
        setIsEditing(false);
        // TODO: Update user metadata in Supabase
    };

    // Guest Mode is now handled inline
    const GuestBanner = () => (
        <View style={styles.guestBanner}>
            <View style={styles.guestBannerContent}>
                <Feather name="user-plus" size={24} color={COLORS.primary} />
                <View style={styles.guestBannerTextContainer}>
                    <Text style={styles.guestBannerTitle}>Guest Mode</Text>
                    <Text style={styles.guestBannerText}>Sign in to save progress & earnings.</Text>
                </View>
            </View>
            <Button
                title="Sign Up"
                size="sm"
                onPress={() => {
                    setGuest(false);
                    router.replace('/login');
                }}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: SPACING.xl }}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                    <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                        <Text style={styles.editButton}>{isEditing ? 'Cancel' : 'Edit'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.profileSection}>
                    {isGuest ? (
                        <GuestBanner />
                    ) : (
                        <>
                            <TouchableOpacity onPress={isEditing ? pickImage : undefined} activeOpacity={isEditing ? 0.7 : 1}>
                                <View style={styles.avatarContainer}>
                                    {image ? (
                                        <Image source={{ uri: image }} style={styles.avatar} />
                                    ) : (
                                        <View style={[styles.avatar, styles.placeholderAvatar]}>
                                            <Feather name="user" size={40} color={COLORS.textSecondary} />
                                        </View>
                                    )}
                                    {isEditing && (
                                        <View style={styles.editIconBadge}>
                                            <Feather name="camera" size={14} color="#FFF" />
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>

                            {isEditing ? (
                                <View style={styles.editForm}>
                                    <TextInput
                                        style={styles.nameInput}
                                        value={name}
                                        onChangeText={setName}
                                        placeholder="Your Name"
                                        placeholderTextColor={COLORS.textMuted}
                                    />
                                    <Button title="Save Changes" onPress={handleSaveProfile} size="sm" />
                                </View>
                            ) : (
                                <>
                                    <Text style={styles.name}>{name}</Text>
                                    <Text style={styles.email}>{user?.email}</Text>
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>Free Tier</Text>
                                    </View>
                                </>
                            )}
                        </>
                    )}
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>Quests</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>$0</Text>
                        <Text style={styles.statLabel}>Earnings</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>1</Text>
                        <Text style={styles.statLabel}>Level</Text>
                    </View>
                </View>

                <ReferralCard userName={name} />

                <View style={styles.menuSection}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings' as any)}>
                        <Feather name="settings" size={20} color={COLORS.textPrimary} />
                        <Text style={styles.menuText}>Settings</Text>
                        <Feather name="chevron-right" size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/membership')}>
                        <Feather name="award" size={20} color={COLORS.primary} />
                        <Text style={styles.menuText}>Membership</Text>
                        <Feather name="chevron-right" size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings/about' as any)}>
                        <Feather name="info" size={20} color={COLORS.primary} />
                        <Text style={styles.menuText}>About App</Text>
                        <Feather name="chevron-right" size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Feather name="help-circle" size={20} color={COLORS.textPrimary} />
                        <Text style={styles.menuText}>Help & Support</Text>
                        <Feather name="chevron-right" size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Button
                        title="Sign Out"
                        variant="outline"
                        onPress={handleSignOut}
                        icon={<Feather name="log-out" size={18} color={COLORS.primary} />}
                        fullWidth
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.darkBg,
        padding: SPACING.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: FONT_SIZES['3xl'],
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    editButton: {
        fontSize: FONT_SIZES.base,
        color: COLORS.primary,
        fontWeight: '600',
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: SPACING.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: COLORS.primary,
    },
    placeholderAvatar: {
        backgroundColor: COLORS.cardBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.darkBg,
    },
    name: {
        fontSize: FONT_SIZES['2xl'],
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    email: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
    },
    badge: {
        backgroundColor: COLORS.cardBg,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
    },
    badgeText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    nameInput: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '600',
        color: COLORS.textPrimary,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderColor,
        textAlign: 'center',
        marginBottom: SPACING.md,
        minWidth: 200,
        paddingVertical: 8,
    },
    editForm: {
        alignItems: 'center',
        width: '100%',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
        gap: SPACING.md,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.cardBg,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.borderColor,
    },
    statValue: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
    },
    menuSection: {
        backgroundColor: COLORS.cardBg,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.sm,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.surfaceBg,
    },
    menuText: {
        flex: 1,
        marginLeft: SPACING.md,
        fontSize: FONT_SIZES.base,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    footer: {
        marginTop: 'auto',
    },
    guestBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.surfaceBg,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    guestBannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        flex: 1,
    },
    guestBannerTextContainer: {
        flex: 1,
    },
    guestBannerTitle: {
        fontSize: FONT_SIZES.base,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    guestBannerText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
    },
});
