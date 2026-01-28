import { COLORS, FONT_SIZES, SPACING } from '@/src/constants/theme';
import { secureStorage } from '@/src/services/storageService';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
    const router = useRouter();
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [marketingEnabled, setMarketingEnabled] = useState(false);

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            const push = await secureStorage.getItem('settings_notifications_push');
            const email = await secureStorage.getItem('settings_notifications_email');
            const marketing = await secureStorage.getItem('settings_notifications_marketing');

            if (push !== null) setPushEnabled(push === 'true');
            if (email !== null) setEmailEnabled(email === 'true');
            if (marketing !== null) setMarketingEnabled(marketing === 'true');
        } catch (e) {
            console.error(e);
        }
    };

    const toggleSwitch = async (key: string, value: boolean, setter: (val: boolean) => void) => {
        setter(value);
        await secureStorage.setItem(key, String(value));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.title}>Notifications</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.section}>
                    <View style={styles.row}>
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Push Notifications</Text>
                            <Text style={styles.description}>Receive updates about your quests and earnings.</Text>
                        </View>
                        <Switch
                            trackColor={{ false: COLORS.surfaceBg, true: COLORS.primary }}
                            thumbColor={'#FFF'}
                            onValueChange={(val) => toggleSwitch('settings_notifications_push', val, setPushEnabled)}
                            value={pushEnabled}
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Email Notifications</Text>
                            <Text style={styles.description}>Get weekly digests and important account alerts.</Text>
                        </View>
                        <Switch
                            trackColor={{ false: COLORS.surfaceBg, true: COLORS.primary }}
                            thumbColor={'#FFF'}
                            onValueChange={(val) => toggleSwitch('settings_notifications_email', val, setEmailEnabled)}
                            value={emailEnabled}
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Marketing Emails</Text>
                            <Text style={styles.description}>Receive tips, tricks, and promotional offers.</Text>
                        </View>
                        <Switch
                            trackColor={{ false: COLORS.surfaceBg, true: COLORS.primary }}
                            thumbColor={'#FFF'}
                            onValueChange={(val) => toggleSwitch('settings_notifications_marketing', val, setMarketingEnabled)}
                            value={marketingEnabled}
                        />
                    </View>
                </View>
            </View>
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
    section: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 12,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
    },
    textContainer: {
        flex: 1,
        paddingRight: SPACING.md,
    },
    label: {
        fontSize: FONT_SIZES.base,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    description: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.surfaceBg,
        marginVertical: SPACING.md,
    },
});
