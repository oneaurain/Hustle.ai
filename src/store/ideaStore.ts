import { QuestData } from '@/src/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface IdeaState {
    savedIdeas: QuestData[];
    addIdea: (idea: QuestData) => void;
    removeIdea: (title: string) => void;
    updateIdea: (oldTitle: string, updates: Partial<QuestData>) => void;
    clearIdeas: () => void;
}

export const useIdeaStore = create<IdeaState>()(
    persist(
        (set) => ({
            savedIdeas: [],
            addIdea: (idea) => set((state) => {
                // Prevent duplicates based on title
                if (state.savedIdeas.some(i => i.title === idea.title)) return state;
                return { savedIdeas: [idea, ...state.savedIdeas] };
            }),
            removeIdea: (title) => set((state) => ({
                savedIdeas: state.savedIdeas.filter((i) => i.title !== title),
            })),
            updateIdea: (oldTitle, updates) => set((state) => ({
                savedIdeas: state.savedIdeas.map((i) =>
                    i.title === oldTitle ? { ...i, ...updates } : i
                ),
            })),
            clearIdeas: () => set({ savedIdeas: [] }),
        }),
        {
            name: 'idea-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
