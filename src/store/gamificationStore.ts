import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Badge {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: string | null;
}

interface GamificationState {
    xp: number;
    level: number;
    streak: number;
    lastLoginDate: string | null;
    badges: Badge[];
    addXp: (amount: number) => void;
    incrementStreak: () => void;
    checkStreak: () => void;
    unlockBadge: (badgeId: string) => void;
    reset: () => void;
}

// XP required for each level (simple formula: level * 1000)
const XP_PER_LEVEL = 1000;

export const useGamificationStore = create<GamificationState>()(
    persist(
        (set, get) => ({
            xp: 0,
            level: 1,
            streak: 0,
            lastLoginDate: null,
            badges: [
                { id: 'first_100', title: 'First $100', description: 'Earn your first $100', icon: '💰', unlockedAt: null },
                { id: 'weekend_warrior', title: 'Weekend Warrior', description: 'Complete a quest on a weekend', icon: '⚔️', unlockedAt: null },
                { id: 'night_owl', title: 'Night Owl', description: 'Complete a quest after 10 PM', icon: '🦉', unlockedAt: null },
                { id: 'first_quest', title: 'First Steps', description: 'Complete your first quest', icon: '🚀', unlockedAt: null },
            ],

            addXp: (amount) => {
                const { xp, level } = get();
                const newXp = xp + amount;
                const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;

                set({ xp: newXp, level: newLevel });
            },

            incrementStreak: () => {
                set((state) => ({ streak: state.streak + 1 }));
            },

            checkStreak: () => {
                const { lastLoginDate, streak } = get();
                const today = new Date().toISOString().split('T')[0];

                if (lastLoginDate !== today) {
                    if (lastLoginDate) {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        const yesterdayStr = yesterday.toISOString().split('T')[0];

                        if (lastLoginDate === yesterdayStr) {
                            // Consecutive day
                            set({ streak: streak + 1, lastLoginDate: today });
                        } else {
                            // Streak broken
                            set({ streak: 1, lastLoginDate: today });
                        }
                    } else {
                        // First login
                        set({ streak: 1, lastLoginDate: today });
                    }
                }
            },

            unlockBadge: (badgeId) => {
                set((state) => ({
                    badges: state.badges.map((b) =>
                        b.id === badgeId && !b.unlockedAt
                            ? { ...b, unlockedAt: new Date().toISOString() }
                            : b
                    ),
                }));
            },

            reset: () => set({ xp: 0, level: 1, streak: 0, lastLoginDate: null }),
        }),
        {
            name: 'gamification-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
