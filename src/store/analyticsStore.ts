import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface DailyLog {
    date: string; // YYYY-MM-DD
    earnings: number;
    questsCompleted: number;
    minutesActive: number;
}

interface AnalyticsState {
    logs: Record<string, DailyLog>; // Keyed by date string

    // Actions
    logEarnings: (amount: number) => void;
    logQuestCompletion: () => void;
    logAppOpen: () => void;

    logAppOpen: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>()(
    persist(
        (set, get) => ({
            logs: {},

            logEarnings: (amount) => {
                const today = new Date().toISOString().split('T')[0];
                set((state) => {
                    const currentLog = state.logs[today] || { date: today, earnings: 0, questsCompleted: 0, minutesActive: 0 };
                    return {
                        logs: {
                            ...state.logs,
                            [today]: { ...currentLog, earnings: currentLog.earnings + amount }
                        }
                    };
                });
            },

            logQuestCompletion: () => {
                const today = new Date().toISOString().split('T')[0];
                set((state) => {
                    const currentLog = state.logs[today] || { date: today, earnings: 0, questsCompleted: 0, minutesActive: 0 };
                    return {
                        logs: {
                            ...state.logs,
                            [today]: { ...currentLog, questsCompleted: currentLog.questsCompleted + 1 }
                        }
                    };
                });
            },

            logAppOpen: () => {
                // Simple tracker for now, could be expanded to real session timing
                const today = new Date().toISOString().split('T')[0];
                set((state) => {
                    const currentLog = state.logs[today] || { date: today, earnings: 0, questsCompleted: 0, minutesActive: 0 };
                    return {
                        logs: {
                            ...state.logs,
                            [today]: { ...currentLog } // Just ensuring record exists
                        }
                    };
                });
            },

            getWeeklyData: () => {
                const { logs } = get();
                const labels: string[] = [];
                const data: number[] = [];

                // Get last 7 days
                for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dateStr = d.toISOString().split('T')[0];
                    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

                    labels.push(dayLabel);
                    data.push(logs[dateStr]?.earnings || 0);
                }

                return { labels, data };
            }
        }),
        {
            name: 'analytics-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
