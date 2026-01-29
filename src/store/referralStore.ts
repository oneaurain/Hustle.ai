import { supabase } from '@/src/config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';

export type ReferralTier = 'Bronze' | 'Silver' | 'Gold';

interface ReferralState {
    referralCode: string | null;
    referralCount: number;
    referredBy: string | null;

    // Actions
    generateCode: (userName: string) => Promise<void>;
    incrementReferral: () => void;
    setReferredBy: (code: string) => void;
    reset: () => void;
    initialize: () => Promise<void>;

    // Computed
    getTier: () => ReferralTier;
    getNextReward: () => string;
    getProgress: () => number; // 0 to 1
}

export const useReferralStore = create<ReferralState>()(
    persist(
        (set, get) => ({
            referralCode: null,
            referralCount: 0,
            referredBy: null,

            initialize: async () => {
                const user = useAuthStore.getState().user;
                if (!user) return;

                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('referral_code')
                        .eq('id', user.id)
                        .single();

                    if (data?.referral_code) {
                        set({ referralCode: data.referral_code });
                    }
                } catch (e) {
                    console.log('Error fetching referral code:', e);
                }
            },

            generateCode: async (userName: string) => {
                const { referralCode } = get();
                if (referralCode) return;

                const user = useAuthStore.getState().user;

                // Simple code generation: Name + Random 3 digit number
                const cleanName = userName.replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, 4);
                const randomNum = Math.floor(100 + Math.random() * 900); // 100-999
                const newCode = `${cleanName || 'USER'}${randomNum}`;

                // Optimistic update
                set({ referralCode: newCode });

                if (user) {
                    try {
                        await supabase
                            .from('profiles')
                            .update({ referral_code: newCode })
                            .eq('id', user.id);
                    } catch (e) {
                        console.error('Error saving referral code:', e);
                    }
                }
            },

            incrementReferral: () => {
                set((state) => ({ referralCount: state.referralCount + 1 }));
            },

            setReferredBy: (code: string) => {
                set({ referredBy: code });
            },

            reset: () => set({ referralCode: null, referralCount: 0, referredBy: null }),

            getTier: () => {
                const { referralCount } = get();
                if (referralCount >= 10) return 'Gold';
                if (referralCount >= 3) return 'Silver';
                return 'Bronze';
            },

            getNextReward: () => {
                const { referralCount } = get();
                if (referralCount < 3) return '10% Discount';
                if (referralCount < 10) return 'VIP Status';
                return 'Max Level Reached!';
            },

            getProgress: () => {
                const { referralCount } = get();
                if (referralCount < 3) return referralCount / 3;
                if (referralCount < 10) return (referralCount - 3) / (10 - 3);
                return 1;
            }
        }),
        {
            name: 'referral-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
