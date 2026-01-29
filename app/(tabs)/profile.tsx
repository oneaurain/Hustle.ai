
import { ReferralCard } from '@/src/components/referral/ReferralCard';
import { Button } from '@/src/components/ui/Button';
import { supabase } from '@/src/config/supabase';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { useTheme } from '@/src/context/ThemeContext';
import { useAlertStore } from '@/src/store/alertStore';
import { useAuthStore } from '@/src/store/authStore';
import { useQuestStore } from '@/src/store/questStore';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const { theme, toggleTheme } = useTheme();
    const { user, isGuest, clearUser, setGuest } = useAuthStore();
    const [name, setName] = useState(user?.user_metadata?.full_name || 'Hustler');
    const [image, setImage] = useState(user?.user_metadata?.avatar_url || null);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleSignOut = async () => {
        await clearUser();
        router.replace('/login');
    };

    const { showAlert, hideAlert } = useAlertStore();

    const uploadImage = async (uri: string) => {
        try {
            setUploading(true);
            const response = await fetch(uri);
            const blob = await response.blob();
            const arrayBuffer = await new Response(blob).arrayBuffer();
            const fileExt = uri.split('.').pop()?.toLowerCase() ?? 'jpg';
            const fileName = `${user?.id}/avatar.${fileExt}`;
            const filePath = `${fileName}`;

            // Create formData for Supabase
            const formData = new FormData();
            formData.append('file', {
                uri,
                name: fileName,
                type: `image/${fileExt}`
            } as any);

            // Upload directly to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, arrayBuffer, {
                    contentType: `image/${fileExt}`,
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // 1. Update Auth Metadata
            const { data: { user: updatedUser }, error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            if (updateError) throw updateError;

            // 2. Update Public Profile Table
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: user?.id,
                    avatar_url: publicUrl,
                    updated_at: new Date().toISOString(),
                });

            if (profileError) {
                console.error("Profile table update failed (avatar):", profileError);
            }

            // CRITICAL: Update local store immediately to persist change in UI
            if (updatedUser) {
                const { setUser } = useAuthStore.getState();
                setUser(updatedUser);
            }

            setImage(publicUrl);
            showAlert('Success', 'Profile picture updated!');
        } catch (error) {
            console.error('Error uploading image: ', error);
            // Fallback for demo/guest mode or if storage fails
            setImage(uri);
        } finally {
            setUploading(false);
        }
    };

    const pickImage = async () => {
        // Request permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            showAlert('Permission needed', 'Sorry, we need camera roll permissions to make this work!', [{ text: 'OK', onPress: hideAlert }]);
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], // Updated from deprecated MediaTypeOptions
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled && result.assets[0].uri) {
            setImage(result.assets[0].uri);
            if (!isGuest && user) {
                await uploadImage(result.assets[0].uri);
            }
        }
    };

    const handleSaveProfile = async () => {
        if (isGuest || !user) {
            setIsEditing(false);
            return;
        }

        try {
            // 1. Update Auth Metadata (Session)
            const { error: authError } = await supabase.auth.updateUser({
                data: { full_name: name }
            });

            if (authError) throw authError;

            // 2. Update Public Profile Table
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: name,
                    email: user.email,
                    updated_at: new Date().toISOString(),
                });

            if (profileError) {
                console.error("Profile table update failed:", profileError);
            }

            setIsEditing(false);
            showAlert('Success', 'Profile updated!', [{ text: 'OK', onPress: hideAlert }]);

            // Refresh local user to ensure UI updates
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                useAuthStore.getState().setUser(session.user);
            }

        } catch (error) {
            showAlert('Error', 'Error updating profile', [{ text: 'OK', onPress: hideAlert }]);
            console.error(error);
        }
    };

    // --- REAL DATA INTEGRATION ---
    const { completedQuests, getStreak, getTotalXP, getPotentialEarnings, getTopSkill } = useQuestStore();

    const questsDoneCount = completedQuests.length;
    const totalXP = getTotalXP();
    const potentialEarnings = getPotentialEarnings();
    const topCategory = getTopSkill();
    // -----------------------------


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
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: SPACING.lg, paddingBottom: SPACING.xl }}
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
                                    {uploading && (
                                        <View style={styles.loadingBadge}>
                                            <ActivityIndicator size="small" color={COLORS.primary} />
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

                <View style={styles.statsContainer}>
                    <Text style={styles.sectionTitle}>Hustle Statistics</Text>
                    <View style={styles.consistencyGrid}>
                        {/* Earnings Card */}
                        <View style={[styles.trackerCard, { backgroundColor: '#10B98115', borderColor: '#10B981' }]}>
                            <Feather name="dollar-sign" size={24} color="#10B981" style={{ marginBottom: 8 }} />
                            <Text style={[styles.trackerValue, { color: '#10B981' }]}>${potentialEarnings}</Text>
                            <Text style={styles.trackerLabel}>Potential Value</Text>
                        </View>

                        {/* Top Category Card */}
                        <View style={[styles.trackerCard, { backgroundColor: '#3B82F615', borderColor: '#3B82F6' }]}>
                            <Feather name="briefcase" size={24} color="#3B82F6" style={{ marginBottom: 8 }} />
                            <Text style={[styles.trackerValue, { color: '#3B82F6', fontSize: 16 }]} numberOfLines={1}>
                                {completedQuests.length > 0 ? topCategory.split(' ')[0] : '-'}
                            </Text>
                            <Text style={styles.trackerLabel}>Top Skill</Text>
                        </View>

                        {/* Quests Card */}
                        <View style={[styles.trackerCard, { backgroundColor: '#F59E0B15', borderColor: '#F59E0B' }]}>
                            <Feather name="check-circle" size={24} color="#F59E0B" style={{ marginBottom: 8 }} />
                            <Text style={[styles.trackerValue, { color: '#F59E0B' }]}>{questsDoneCount}</Text>
                            <Text style={styles.trackerLabel}>Quests Done</Text>
                        </View>
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

                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings/help' as any)}>
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
    statsContainer: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
        marginLeft: 4,
    },
    consistencyGrid: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    trackerCard: {
        flex: 1,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.xl,
        alignItems: 'center',
        borderWidth: 1,
        justifyContent: 'center',
        minHeight: 110,
    },
    trackerValue: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '800',
        marginBottom: 4,
    },
    trackerLabel: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
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
    loadingBadge: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
