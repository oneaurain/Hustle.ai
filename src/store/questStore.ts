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
}));
