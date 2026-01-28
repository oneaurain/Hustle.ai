import { useAuthStore } from '@/src/store/authStore';
import { AdEventType, RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

// Use Test IDs for development
const AD_UNIT_ID = __DEV__ ? TestIds.REWARDED : (process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID || TestIds.REWARDED);

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const AdService = {

    // Track ad view on backend
    logAdView: async (adType: 'banner' | 'rewarded' | 'interstitial') => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        try {
            await fetch(`${BACKEND_URL}/ads/view`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, adType })
            });
        } catch (error) {
            console.error('Failed to log ad view:', error);
        }
    },

    // Show Rewarded Ad
    showRewardedAd: async (onReward: () => void, onError?: () => void) => {
        const user = useAuthStore.getState().user;

        try {
            const rewarded = RewardedAd.createForAdRequest(AD_UNIT_ID);
            let loaded = false;

            const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
                loaded = true;
                rewarded.show();
            });

            const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, async (reward) => {
                // Log reward on backend
                if (user) {
                    try {
                        await fetch(`${BACKEND_URL}/ads/reward`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId: user.id, rewardType: 'generate_quest' })
                        });
                    } catch (e) {
                        console.error('Failed to log reward:', e);
                    }
                }
                onReward();
            });

            const unsubscribeError = rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
                console.error('Ad Error:', error);
                if (onError) onError();
            });

            rewarded.load();
        } catch (e) {
            console.log("AdMob not initialized (likely Expo Go). Simulating reward for dev.");
            // Simulate reward for dev environment so logic doesn't block
            if (__DEV__) {
                setTimeout(() => onReward(), 1000);
            } else {
                if (onError) onError();
            }
        }
    }
};
