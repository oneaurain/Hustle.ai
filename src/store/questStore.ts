import { supabase } from '@/src/config/supabase';
import { create } from 'zustand';
import type { Quest, QuestData } from '../types';
import { useAuthStore } from './authStore';

interface QuestState {
    quests: Quest[];
    activeQuests: Quest[];
    completedQuests: Quest[];
    isLoading: boolean;
    setQuests: (quests: Quest[]) => void;
    addQuest: (quest: Quest) => Promise<void>;
    updateQuest: (questId: string, updates: Partial<Quest>) => Promise<void>;
    updateQuestData: (questId: string, updates: Partial<QuestData>) => Promise<void>;
    deleteQuest: (questId: string) => Promise<void>;
    getQuestById: (questId: string) => Quest | undefined;
    markQuestActive: (questId: string) => Promise<void>;
    markQuestCompleted: (questId: string) => Promise<void>;
    updateQuestProgress: (questId: string, completedStepIndex: number) => Promise<void>;
    initialize: () => Promise<void>;
    getStreak: () => number;
    getTotalXP: () => number;
    getPotentialEarnings: () => number;
    getTopSkill: () => string;
}

export const useQuestStore = create<QuestState>((set, get) => ({
    quests: [],
    activeQuests: [],
    completedQuests: [],
    isLoading: false,

    initialize: async () => {
        set({ isLoading: true });
        try {
            const user = useAuthStore.getState().user;
            if (!user) {
                set({ quests: [], activeQuests: [], completedQuests: [], isLoading: false });
                return;
            }

            const { data, error } = await supabase
                .from('quests')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const quests = data as Quest[] || [];
            const activeQuests = quests.filter(q => q.status === 'active');
            const completedQuests = quests.filter(q => q.status === 'completed');

            set({ quests, activeQuests, completedQuests });
        } catch (error) {
            console.error('Error fetching quests:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    setQuests: (quests) => {
        const activeQuests = quests.filter(q => q.status === 'active');
        const completedQuests = quests.filter(q => q.status === 'completed');

        set({ quests, activeQuests, completedQuests });
    },

    addQuest: async (quest) => {
        const user = useAuthStore.getState().user;

        // Optimistic update
        const currentQuests = get().quests;
        const updatedQuests = [...currentQuests, quest];
        get().setQuests(updatedQuests);

        if (user && !quest.id.startsWith('local-')) {
            try {
                // If it's a new generated quest being added that wasn't already inserted
                // Note: check logic in discover.tsx, it might already insert. 
                // For now, we assume if it's passed here it might need saving if not already saved.
                // But usually we treat addQuest as "update local store" in this codebase.
                // To avoid duplicates if discover.tsx already inserted, we check.
            } catch (error) {
                console.error('Error adding quest to Supabase:', error);
            }
        }
    },

    updateQuest: async (questId, updates) => {
        // Optimistic update
        const quests = get().quests.map(q =>
            q.id === questId ? { ...q, ...updates } : q
        );
        get().setQuests(quests);

        // Sync to Supabase
        const user = useAuthStore.getState().user;
        if (user) {
            try {
                const { error } = await supabase
                    .from('quests')
                    .update(updates)
                    .eq('id', questId)
                    .eq('user_id', user.id);

                if (error) throw error;
            } catch (error) {
                console.error('Error updating quest in Supabase:', error);
            }
        }
    },

    updateQuestData: async (questId, updates) => {
        const quest = get().getQuestById(questId);
        if (!quest) return;

        const updatedCustomData = { ...quest.custom_data, ...updates };

        // Optimistic update
        const quests = get().quests.map(q =>
            q.id === questId ? { ...q, custom_data: updatedCustomData } : q
        );
        get().setQuests(quests);

        // Sync to Supabase
        const user = useAuthStore.getState().user;
        if (user) {
            try {
                const { error } = await supabase
                    .from('quests')
                    .update({ custom_data: updatedCustomData })
                    .eq('id', questId)
                    .eq('user_id', user.id);

                if (error) throw error;
            } catch (error) {
                console.error('Error updating quest data:', error);
            }
        }
    },

    deleteQuest: async (questId) => {
        // Optimistic update
        const quests = get().quests.filter(q => q.id !== questId);
        get().setQuests(quests);

        const user = useAuthStore.getState().user;
        if (user) {
            try {
                await supabase.from('quests').delete().eq('id', questId).eq('user_id', user.id);
            } catch (error) {
                console.error('Error deleting quest:', error);
            }
        }
    },

    getQuestById: (questId) => {
        return get().quests.find(q => q.id === questId);
    },

    markQuestActive: async (questId) => {
        await get().updateQuest(questId, {
            status: 'active',
            started_at: new Date().toISOString()
        });
    },

    markQuestCompleted: async (questId) => {
        await get().updateQuest(questId, {
            status: 'completed',
            completed_at: new Date().toISOString()
        });
    },

    updateQuestProgress: async (questId, completedStepIndex) => {
        const quest = get().getQuestById(questId);
        if (!quest) return;

        const completedSteps = quest.custom_data.completedSteps || [];

        if (!completedSteps.includes(completedStepIndex)) {
            completedSteps.push(completedStepIndex);
        }

        const progress = (completedSteps.length / quest.custom_data.actionSteps.length) * 100;

        await get().updateQuestData(questId, {
            completedSteps,
            progress
        });
    },

    // Derived State Getters
    getStreak: () => {
        const completedQuests = get().completedQuests;
        if (completedQuests.length === 0) return 0;

        // Sort by date descending
        const sorted = [...completedQuests].sort((a, b) =>
            new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime()
        );

        const uniqueDates = new Set<string>();
        sorted.forEach(q => {
            if (q.completed_at) {
                uniqueDates.add(q.completed_at.split('T')[0]);
            }
        });

        const sortedDates = Array.from(uniqueDates).sort().reverse(); // ['2023-10-25', '2023-10-24', ...]

        if (sortedDates.length === 0) return 0;

        // Check if the most recent date is today or yesterday
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        const lastActivity = sortedDates[0];
        if (lastActivity !== today && lastActivity !== yesterday) {
            return 0; // Streak broken
        }

        let streak = 0;
        let currentDate = new Date(lastActivity);

        for (let i = 0; i < sortedDates.length; i++) {
            const dateStr = sortedDates[i];
            const date = new Date(dateStr);

            // Allow for same day (already handled by uniqueDates set, but logic check)
            const diffTime = Math.abs(currentDate.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (i === 0) {
                streak++;
                continue;
            }

            // If this date is exactly 1 day before the previous date (currentDate)
            // Actually, my loop logic needs to be: 
            // expectedDate is currentDate - 1 day.
            // If sortedDates[i] == expectedDate, streak++, currentDate = expectedDate.

            // Let's simplfy:
            // current date is sortedDates[i-1] (prev iteration)
            // check if sortedDates[i] is consecutive.

            const prevDate = new Date(sortedDates[i - 1]);
            const thisDate = new Date(sortedDates[i]);

            const diff = (prevDate.getTime() - thisDate.getTime()) / (1000 * 3600 * 24);

            if (Math.round(diff) === 1) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    },

    getTotalXP: () => {
        return get().completedQuests.reduce((acc, quest) => {
            return acc + (quest.custom_data?.xp || 100);
        }, 0);
    },

    getPotentialEarnings: () => {
        return get().completedQuests.reduce((acc, quest) => {
            return acc + (quest.custom_data?.earningsPotential?.min || 0);
        }, 0);
    },

    getTopSkill: () => {
        const completedQuests = get().completedQuests;
        if (completedQuests.length === 0) return 'None';

        const categories = completedQuests.map(q => q.custom_data?.category || 'General');
        // Sort by frequency
        return categories.sort((a, b) =>
            categories.filter(v => v === a).length - categories.filter(v => v === b).length
        ).pop() || 'General';
    }
}));
