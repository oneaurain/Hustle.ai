import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { RoadmapResponse } from '../services/aiService';

interface RoadmapState {
    currentRoadmap: RoadmapResponse | null;
    savedRoadmaps: Record<string, RoadmapResponse>; // Cache by Idea Title

    setCurrentRoadmap: (roadmap: RoadmapResponse | null) => void;
    saveRoadmap: (title: string, roadmap: RoadmapResponse) => void;
    getRoadmap: (title: string) => RoadmapResponse | undefined;
}

export const useRoadmapStore = create<RoadmapState>()(
    persist(
        (set, get) => ({
            currentRoadmap: null,
            savedRoadmaps: {},

            setCurrentRoadmap: (roadmap) => set({ currentRoadmap: roadmap }),

            saveRoadmap: (title, roadmap) => set((state) => ({
                savedRoadmaps: { ...state.savedRoadmaps, [title]: roadmap },
                currentRoadmap: roadmap // Auto-set as current when saved
            })),

            getRoadmap: (title) => get().savedRoadmaps[title],
        }),
        {
            name: 'roadmap-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
