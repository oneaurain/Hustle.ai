import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { SplashScreen } from '@/src/components/SplashScreen';
import { CustomAlert } from '@/src/components/ui/CustomAlert';
import { LevelUpModal } from '@/src/components/ui/LevelUpModal';
import { RatingModal } from '@/src/components/ui/RatingModal'; // Import
import { Toast } from '@/src/components/ui/Toast';
import { ThemeProvider as CustomThemeProvider } from '@/src/context/ThemeContext';
import { useAuthStore } from '@/src/store/authStore';
import { GravitasOne_400Regular, useFonts } from '@expo-google-fonts/gravitas-one';

export const unstable_settings = {
  anchor: 'index',
};

import { useQuestStore } from '@/src/store/questStore';

export default function RootLayout() {
  const initialize = useAuthStore((state) => state.initialize);
  const user = useAuthStore((state) => state.user);
  const initQuests = useQuestStore((state) => state.initialize);

  const [fontsLoaded] = useFonts({
    GravitasOne_400Regular,
  });

  useEffect(() => {
    initialize();
  }, []);

  // Reload quests when user changes (login/logout/init)
  useEffect(() => {
    if (user) {
      initQuests();
    }
  }, [user]);

  const [isSplashVisible, setIsSplashVisible] = useState(true);

  if (!fontsLoaded) {
    return null;
  }

  if (isSplashVisible) {
    return <SplashScreen onFinish={() => setIsSplashVisible(false)} />;
  }

  return (
    <CustomThemeProvider>
      <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}>
        <ThemeProvider value={DarkTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#FFFFFF' },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <LevelUpModal />
          <RatingModal />
          <CustomAlert />
          <Toast message="" visible={false} onHide={() => { }} />
          <StatusBar style="light" />
        </ThemeProvider>
      </StripeProvider>
    </CustomThemeProvider>
  );
}
