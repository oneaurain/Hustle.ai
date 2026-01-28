import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ReferralTier = 'Bronze' | 'Silver' | 'Gold';

interface ReferralState {
    referralCode: string | null;
    referralCount: number;
    referredBy: string | null;

    // Actions
    generateCode: (userName: string) => void;
    incrementReferral: () => void;
    setReferredBy: (code: string) => void;
    reset: () => void;

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

            generateCode: (userName: string) => {
                const { referralCode } = get();
                if (referralCode) return;

                // Simple code generation: Name + Random 3 digit number
                const cleanName = userName.replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, 4);
                const randomNum = Math.floor(100 + Math.random() * 900); // 100-999
                const newCode = `${cleanName || 'USER'}${randomNum}`;

                set({ referralCode: newCode });
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
