import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const notificationService = {
    /**
     * Request permissions for notifications
     */
    requestPermissions: async () => {
        if (Platform.OS === 'web') return false;

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        return finalStatus === 'granted';
    },

    /**
     * Schedule a "Smart Nudge" based on hypothetical user data
     * In a real app, this would analyze user logs.
     */
    scheduleSmartNudge: async () => {
        if (Platform.OS === 'web') return;

        // Cancel existing to avoid spam
        await Notifications.cancelAllScheduledNotificationsAsync();

        // Mock Logic: User usually earns on Tuesdays
        // Schedule a notification for next Tuesday at 10 AM?
        // For demo purposes, we'll schedule one 10 seconds from now

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Hustle.ai",
                body: "You usually earn on Tuesdays. Ready to start a quest?",
                sound: true,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 10,
                repeats: false,
            },
        });

        return "Nudge scheduled for 10s from now";
    },

    /**
     * Send an immediate test notification
     */
    sendTestNotification: async () => {
        if (Platform.OS === 'web') return;

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Hustle.ai",
                body: "This is a test notification with haptics! 📳",
            },
            trigger: null, // Immediate
        });
    }
};
