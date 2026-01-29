import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
    return {
        ...config,
        name: config.name || "Hustle.ai",
        slug: config.slug || "hustle-ai",
        plugins: [
            ...(config.plugins || []),
            [
                "react-native-google-mobile-ads",
                {
                    "androidAppId": process.env.ADMOB_APP_ID || "ca-app-pub-3940256099942544~3347511713", // Test ID as fallback
                    "iosAppId": process.env.ADMOB_APP_ID || "ca-app-pub-3940256099942544~1458002511", // Test ID as fallback
                }
            ],
            [
                "@stripe/stripe-react-native",
                {
                    "merchantIdentifier": "merchant.com.hustle.ai",
                    "enableGooglePay": true
                }
            ]
        ]
    };
};
