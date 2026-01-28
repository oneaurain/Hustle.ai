import { COLORS } from '@/src/constants/theme';
import { useAuthStore } from '@/src/store/authStore';
import React from 'react';
import { Text, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const AD_UNIT_ID = __DEV__ ? TestIds.BANNER : (process.env.EXPO_PUBLIC_ADMOB_BANNER_ID || TestIds.BANNER);

export const AdBanner = () => {
    const user = useAuthStore((state) => state.user);
    const isPremium = user?.user_metadata?.subscription_tier === 'premium';

    if (isPremium) {
        return null;
    }

    try {
        return (
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
                <BannerAd
                    unitId={AD_UNIT_ID}
                    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                    }}
                />
            </View>
        );
    } catch (error) {
        // Fallback for Expo Go where native module is missing
        return (
            <View style={{
                alignItems: 'center',
                marginVertical: 10,
                backgroundColor: COLORS.cardBg,
                padding: 10,
                borderWidth: 1,
                borderColor: COLORS.borderColor,
                borderRadius: 8
            }}>
                <Text style={{ color: COLORS.textSecondary, fontSize: 12 }}>Ad Setup Required (Dev Client)</Text>
            </View>
        );
    }
};
