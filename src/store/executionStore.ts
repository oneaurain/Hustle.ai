import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ExecutionGuide } from '../services/executionService';

export interface SavedExecutionGuide {
    idea: string;
    guide: ExecutionGuide;
    createdAt: string;
}

interface ExecutionState {
    currentGuide: SavedExecutionGuide | null;
    savedGuides: SavedExecutionGuide[];

    setCurrentGuide: (guide: SavedExecutionGuide | null) => void;
    saveGuide: (idea: string, guide: ExecutionGuide) => void;
    getGuide: (idea: string) => SavedExecutionGuide | undefined;
    removeGuide: (idea: string) => void;
    clearAll: () => void;
}

export const useExecutionStore = create<ExecutionState>()(
    persist(
        (set, get) => ({
            currentGuide: null,
            savedGuides: [],

            setCurrentGuide: (guide) => set({ currentGuide: guide }),

            saveGuide: (idea, guide) => {
                const entry: SavedExecutionGuide = {
                    idea,
                    guide,
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({
                    currentGuide: entry,
                    savedGuides: [
                        entry,
                        ...state.savedGuides.filter((g) => g.idea !== idea),
                    ],
                }));
            },

            getGuide: (idea) => get().savedGuides.find((g) => g.idea === idea),

            removeGuide: (idea) =>
                set((state) => ({
                    savedGuides: state.savedGuides.filter((g) => g.idea !== idea),
                })),

            clearAll: () => set({ currentGuide: null, savedGuides: [] }),
        }),
        {
            name: 'execution-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
